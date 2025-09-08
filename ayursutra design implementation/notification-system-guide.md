# Notification System Implementation Guide

## Overview

The Notification System provides multi-channel communication (SMS, Email, In-app, Push) for appointment reminders, treatment updates, and health alerts across the AyurSutra platform using Node.js/Express.js backend.

## System Architecture

```
NotificationService/
├── services/
│   ├── notificationService.js
│   ├── smsService.js
│   ├── emailService.js
│   ├── pushService.js
│   └── inAppService.js
├── templates/
│   ├── email/
│   │   ├── appointmentReminder.html
│   │   ├── treatmentUpdate.html
│   │   └── healthAlert.html
│   └── sms/
│       ├── appointmentReminder.txt
│       └── treatmentUpdate.txt
├── queue/
│   ├── notificationQueue.js
│   └── retryHandler.js
├── models/
│   └── Notification.js
└── routes/
    ├── notifications.js
    └── webhooks.js
```

## Core Components

### 1. Notification Model

```javascript
// models/Notification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'appointment_reminder',
      'appointment_confirmation',
      'treatment_update',
      'medication_reminder',
      'health_alert',
      'progress_update'
    ),
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM('sms', 'email', 'push', 'in_app'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'read'),
    defaultValue: 'pending'
  },
  scheduledAt: {
    type: DataTypes.DATE
  },
  sentAt: {
    type: DataTypes.DATE
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  readAt: {
    type: DataTypes.DATE
  },
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxRetries: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  errorMessage: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Notification.associate = (models) => {
  Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Notification;
```

### 2. Main Notification Service

```javascript
// services/notificationService.js
const { Notification, User } = require('../models');
const smsService = require('./smsService');
const emailService = require('./emailService');
const pushService = require('./pushService');
const inAppService = require('./inAppService');
const notificationQueue = require('../queue/notificationQueue');

class NotificationService {
  constructor() {
    this.channels = {
      sms: smsService,
      email: emailService,
      push: pushService,
      in_app: inAppService
    };
  }

  async sendNotification(notificationData) {
    try {
      // Create notification record
      const notification = await Notification.create({
        userId: notificationData.userId,
        type: notificationData.type,
        channel: notificationData.channel,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        scheduledAt: notificationData.scheduledAt || new Date()
      });

      // Send immediately or queue for later
      if (notificationData.scheduledAt && notificationData.scheduledAt > new Date()) {
        await notificationQueue.schedule(notification.id, notificationData.scheduledAt);
        return { success: true, notificationId: notification.id, status: 'scheduled' };
      } else {
        return await this.processNotification(notification.id);
      }
    } catch (error) {
      console.error('Notification creation error:', error);
      throw new Error('Failed to create notification');
    }
  }

  async processNotification(notificationId) {
    try {
      const notification = await Notification.findByPk(notificationId, {
        include: [{ model: User, as: 'user' }]
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      const channelService = this.channels[notification.channel];
      if (!channelService) {
        throw new Error(`Unsupported channel: ${notification.channel}`);
      }

      // Send notification
      const result = await channelService.send({
        to: this.getRecipientAddress(notification.user, notification.channel),
        title: notification.title,
        message: notification.message,
        data: notification.data,
        type: notification.type
      });

      // Update notification status
      await notification.update({
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null,
        errorMessage: result.error || null
      });

      return {
        success: result.success,
        notificationId: notification.id,
        status: result.success ? 'sent' : 'failed',
        error: result.error
      };
    } catch (error) {
      console.error('Notification processing error:', error);
      
      // Update notification with error
      await Notification.update(
        { 
          status: 'failed',
          errorMessage: error.message,
          retryCount: sequelize.literal('retry_count + 1')
        },
        { where: { id: notificationId } }
      );

      return { success: false, error: error.message };
    }
  }

  getRecipientAddress(user, channel) {
    switch (channel) {
      case 'email':
        return user.email;
      case 'sms':
        return user.phone;
      case 'push':
        return user.pushToken;
      case 'in_app':
        return user.id;
      default:
        throw new Error(`Unknown channel: ${channel}`);
    }
  }

  async sendAppointmentReminder(appointmentId) {
    const appointment = await this.getAppointmentDetails(appointmentId);
    
    const notificationData = {
      userId: appointment.patientId,
      type: 'appointment_reminder',
      channel: 'sms', // Can be configured per user preference
      title: 'Appointment Reminder',
      message: `Reminder: You have an appointment tomorrow at ${appointment.scheduledTime} with Dr. ${appointment.practitioner.fullName}`,
      data: { appointmentId },
      scheduledAt: new Date(appointment.scheduledDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
    };

    return await this.sendNotification(notificationData);
  }

  async sendTreatmentUpdate(treatmentId, updateMessage) {
    const treatment = await this.getTreatmentDetails(treatmentId);
    
    const notificationData = {
      userId: treatment.patientId,
      type: 'treatment_update',
      channel: 'email',
      title: 'Treatment Progress Update',
      message: updateMessage,
      data: { treatmentId }
    };

    return await this.sendNotification(notificationData);
  }

  async getAppointmentDetails(appointmentId) {
    // This would integrate with your appointment service
    // For now, returning mock data structure
    return {
      id: appointmentId,
      patientId: 1,
      scheduledDate: new Date(),
      scheduledTime: '10:00 AM',
      practitioner: { fullName: 'John Doe' }
    };
  }

  async getTreatmentDetails(treatmentId) {
    // This would integrate with your treatment service
    return {
      id: treatmentId,
      patientId: 1
    };
  }
}

module.exports = new NotificationService();
```

### 3. SMS Service (Twilio Integration)

```javascript
// services/smsService.js
const twilio = require('twilio');
require('dotenv').config();

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async send({ to, message, type }) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getDeliveryStatus(messageId) {
    try {
      const message = await this.client.messages(messageId).fetch();
      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      console.error('SMS status check error:', error);
      return { status: 'unknown', error: error.message };
    }
  }
}

module.exports = new SMSService();
```

### 4. Email Service (SendGrid Integration)

```javascript
// services/emailService.js
const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@ayursutra.com';
    this.templatesPath = path.join(__dirname, '../templates/email');
  }

  async send({ to, title, message, type, data = {} }) {
    try {
      let htmlContent = message;
      
      // Load template if available
      try {
        const templatePath = path.join(this.templatesPath, `${type}.html`);
        const template = await fs.readFile(templatePath, 'utf8');
        htmlContent = this.renderTemplate(template, { title, message, ...data });
      } catch (templateError) {
        // Use plain message if template not found
        console.log(`Template not found for ${type}, using plain message`);
      }

      const mailOptions = {
        to: to,
        from: this.fromEmail,
        subject: title,
        text: message,
        html: htmlContent
      };

      const result = await sgMail.send(mailOptions);
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        status: 'sent'
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  renderTemplate(template, data) {
    let rendered = template;
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(placeholder, data[key] || '');
    });
    return rendered;
  }
}

module.exports = new EmailService();
```

### 5. Push Notification Service

```javascript
// services/pushService.js
const admin = require('firebase-admin');
require('dotenv').config();

class PushService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    }
    this.messaging = admin.messaging();
  }

  async send({ to, title, message, data = {} }) {
    try {
      const payload = {
        token: to,
        notification: {
          title: title,
          body: message
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };

      const result = await this.messaging.send(payload);
      
      return {
        success: true,
        messageId: result,
        status: 'sent'
      };
    } catch (error) {
      console.error('Push notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendToMultiple(tokens, { title, message, data = {} }) {
    try {
      const payload = {
        tokens: tokens,
        notification: {
          title: title,
          body: message
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };

      const result = await this.messaging.sendMulticast(payload);
      
      return {
        success: result.failureCount === 0,
        successCount: result.successCount,
        failureCount: result.failureCount,
        responses: result.responses
      };
    } catch (error) {
      console.error('Batch push notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PushService();
```

### 6. In-App Notification Service

```javascript
// services/inAppService.js
const { Notification } = require('../models');
const WebSocket = require('ws');

class InAppService {
  constructor() {
    this.connections = new Map(); // userId -> WebSocket connection
  }

  async send({ to, title, message, data = {} }) {
    try {
      // Store in database for persistence
      const notification = await Notification.create({
        userId: to,
        type: data.type || 'general',
        channel: 'in_app',
        title: title,
        message: message,
        data: data,
        status: 'sent'
      });

      // Send real-time notification if user is connected
      const connection = this.connections.get(to);
      if (connection && connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify({
          id: notification.id,
          type: 'notification',
          title: title,
          message: message,
          data: data,
          timestamp: new Date().toISOString()
        }));
      }

      return {
        success: true,
        notificationId: notification.id,
        status: 'sent'
      };
    } catch (error) {
      console.error('In-app notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  addConnection(userId, ws) {
    this.connections.set(userId, ws);
    
    ws.on('close', () => {
      this.connections.delete(userId);
    });
  }

  async getUnreadNotifications(userId) {
    return await Notification.findAll({
      where: {
        userId: userId,
        channel: 'in_app',
        readAt: null
      },
      order: [['created_at', 'DESC']]
    });
  }

  async markAsRead(notificationId, userId) {
    await Notification.update(
      { readAt: new Date(), status: 'read' },
      { 
        where: { 
          id: notificationId, 
          userId: userId,
          channel: 'in_app'
        } 
      }
    );
  }
}

module.exports = new InAppService();
```

### 7. Notification Queue System

```javascript
// queue/notificationQueue.js
const Bull = require('bull');
const Redis = require('redis');
const notificationService = require('../services/notificationService');
require('dotenv').config();

const redis = Redis.createClient(process.env.REDIS_URL);
const notificationQueue = new Bull('notification queue', process.env.REDIS_URL);

// Process notifications
notificationQueue.process('send-notification', async (job) => {
  const { notificationId } = job.data;
  return await notificationService.processNotification(notificationId);
});

// Process scheduled notifications
notificationQueue.process('scheduled-notification', async (job) => {
  const { notificationId } = job.data;
  return await notificationService.processNotification(notificationId);
});

class NotificationQueue {
  async add(notificationId, delay = 0) {
    return await notificationQueue.add('send-notification', 
      { notificationId }, 
      { delay }
    );
  }

  async schedule(notificationId, scheduledAt) {
    const delay = scheduledAt.getTime() - Date.now();
    if (delay > 0) {
      return await notificationQueue.add('scheduled-notification', 
        { notificationId }, 
        { delay }
      );
    } else {
      return await this.add(notificationId);
    }
  }

  async retry(notificationId, retryCount) {
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    return await notificationQueue.add('send-notification', 
      { notificationId }, 
      { delay, attempts: 3 }
    );
  }

  async getStats() {
    return {
      waiting: await notificationQueue.getWaiting(),
      active: await notificationQueue.getActive(),
      completed: await notificationQueue.getCompleted(),
      failed: await notificationQueue.getFailed()
    };
  }
}

module.exports = new NotificationQueue();
```

### 8. Notification Routes

```javascript
// routes/notifications.js
const express = require('express');
const { auth, requireRole } = require('../middleware/authMiddleware');
const notificationService = require('../services/notificationService');
const inAppService = require('../services/inAppService');
const { Notification } = require('../models');

const router = express.Router();

// GET /api/notifications - Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, channel, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { userId: req.user.id };
    if (channel) whereClause.channel = channel;
    if (status) whereClause.status = status;
    
    const { rows: notifications, count: total } = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/send - Send notification (admin/practitioner only)
router.post('/send', auth, requireRole(['admin', 'practitioner']), async (req, res) => {
  try {
    const {
      userId,
      type,
      channel,
      title,
      message,
      data,
      scheduledAt
    } = req.body;
    
    const result = await notificationService.sendNotification({
      userId,
      type,
      channel,
      title,
      message,
      data,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await inAppService.markAsRead(id, req.user.id);
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/unread - Get unread notifications count
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        readAt: null
      }
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Environment Variables

```bash
# .env additions for notification system
# Twilio SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid Email
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@ayursutra.com

# Firebase Push Notifications
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Redis for Queue
REDIS_URL=redis://localhost:6379
```

## Package Dependencies

```json
{
  "dependencies": {
    "twilio": "^4.19.0",
    "@sendgrid/mail": "^7.7.0",
    "firebase-admin": "^11.11.0",
    "bull": "^4.11.4",
    "redis": "^4.6.10",
    "ws": "^8.14.2"
  }
}
```

## Integration Benefits

1. **Multi-Channel Support**: SMS, Email, Push, and In-app notifications
2. **Queue System**: Reliable message delivery with retry mechanisms
3. **Real-time Updates**: WebSocket integration for instant in-app notifications
4. **Template Support**: HTML email templates and customizable messages
5. **Scheduling**: Support for delayed and scheduled notifications
6. **Tracking**: Complete delivery status tracking and analytics
7. **Scalability**: Redis-based queue system for high-volume notifications

This notification system provides comprehensive multi-channel communication capabilities integrated seamlessly with the Node.js backend.

class NotificationService:
    def __init__(self):
        self.sms_service = SMSService()
        self.email_service = EmailService()
        self.push_service = PushService()
        self.in_app_service = InAppService()
        
        self.channel_map = {
            NotificationChannel.SMS: self.sms_service,
            NotificationChannel.EMAIL: self.email_service,
            NotificationChannel.PUSH: self.push_service,
            NotificationChannel.IN_APP: self.in_app_service
        }
    
    async def send_notification(self, notification_data: Dict) -> Dict:
        """Send notification through specified channels"""
        
        results = {}
        channels = notification_data.get('channels', [NotificationChannel.IN_APP])
        
        # Send through each channel
        for channel in channels:
            try:
                service = self.channel_map[channel]
                result = await service.send(notification_data)
                results[channel.value] = result
            except Exception as e:
                results[channel.value] = {'success': False, 'error': str(e)}
        
        # Store notification record
        await self.store_notification_record(notification_data, results)
        
        return results
    
    async def send_appointment_reminder(self, appointment: Dict, reminder_time: int = 24) -> Dict:
        """Send appointment reminder notification"""
        
        user_preferences = await self.get_user_notification_preferences(appointment['patient_id'])
        
        notification_data = {
            'type': NotificationType.APPOINTMENT_REMINDER,
            'recipient_id': appointment['patient_id'],
            'channels': user_preferences.get('reminder_channels', [NotificationChannel.SMS, NotificationChannel.IN_APP]),
            'template_data': {
                'patient_name': appointment['patient_name'],
                'appointment_date': appointment['scheduled_date'],
                'appointment_time': appointment['scheduled_time'],
                'treatment_type': appointment['treatment_type'],
                'practitioner_name': appointment['practitioner_name'],
                'clinic_address': appointment.get('clinic_address', ''),
                'reminder_hours': reminder_time
            },
            'scheduled_time': datetime.now() + timedelta(hours=reminder_time),
            'priority': 'normal'
        }
        
        return await self.send_notification(notification_data)
    
    async def send_treatment_update(self, patient_id: str, treatment_data: Dict) -> Dict:
        """Send treatment progress update"""
        
        notification_data = {
            'type': NotificationType.TREATMENT_UPDATE,
            'recipient_id': patient_id,
            'channels': [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
            'template_data': {
                'patient_name': treatment_data['patient_name'],
                'treatment_phase': treatment_data['phase'],
                'progress_percentage': treatment_data['progress'],
                'next_milestone': treatment_data.get('next_milestone', ''),
                'practitioner_notes': treatment_data.get('notes', '')
            },
            'priority': 'normal'
        }
        
        return await self.send_notification(notification_data)
    
    async def send_medication_reminder(self, patient_id: str, medication_data: Dict) -> Dict:
        """Send medication reminder"""
        
        notification_data = {
            'type': NotificationType.MEDICATION_REMINDER,
            'recipient_id': patient_id,
            'channels': [NotificationChannel.PUSH, NotificationChannel.IN_APP],
            'template_data': {
                'medication_name': medication_data['name'],
                'dosage': medication_data['dosage'],
                'timing': medication_data['timing'],
                'instructions': medication_data.get('instructions', '')
            },
            'priority': 'high'
        }
        
        return await self.send_notification(notification_data)
```

### 2. SMS Service Implementation

```python
# channels/sms_service.py
import os
from twilio.rest import Client
from typing import Dict

class SMSService:
    def __init__(self):
        self.client = Client(
            os.getenv('TWILIO_ACCOUNT_SID'),
            os.getenv('TWILIO_AUTH_TOKEN')
        )
        self.from_number = os.getenv('TWILIO_PHONE_NUMBER')
    
    async def send(self, notification_data: Dict) -> Dict:
        """Send SMS notification"""
        
        try:
            # Get recipient phone number
            recipient_phone = await self.get_recipient_phone(notification_data['recipient_id'])
            
            # Generate message content
            message_content = await self.generate_message_content(notification_data)
            
            # Send SMS
            message = self.client.messages.create(
                body=message_content,
                from_=self.from_number,
                to=recipient_phone
            )
            
            return {
                'success': True,
                'message_sid': message.sid,
                'status': message.status
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def generate_message_content(self, notification_data: Dict) -> str:
        """Generate SMS message content based on notification type"""
        
        template_data = notification_data['template_data']
        notification_type = notification_data['type']
        
        if notification_type == NotificationType.APPOINTMENT_REMINDER:
            return f"""
🏥 AyurSutra Reminder
Hello {template_data['patient_name']},
Your {template_data['treatment_type']} appointment is scheduled for {template_data['appointment_date']} at {template_data['appointment_time']} with Dr. {template_data['practitioner_name']}.
Please arrive 15 minutes early. Reply CANCEL to reschedule.
            """.strip()
        
        elif notification_type == NotificationType.MEDICATION_REMINDER:
            return f"""
💊 Medication Reminder
Time to take your {template_data['medication_name']} - {template_data['dosage']}
{template_data['instructions']}
            """.strip()
        
        return "AyurSutra notification"
```

### 3. Email Service Implementation

```python
# channels/email_service.py
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from typing import Dict

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.sendgrid.net')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.username = os.getenv('SENDGRID_USERNAME')
        self.password = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@ayursutra.com')
        
        # Setup Jinja2 for email templates
        self.template_env = Environment(
            loader=FileSystemLoader('templates/email')
        )
    
    async def send(self, notification_data: Dict) -> Dict:
        """Send email notification"""
        
        try:
            # Get recipient email
            recipient_email = await self.get_recipient_email(notification_data['recipient_id'])
            
            # Generate email content
            subject, html_content = await self.generate_email_content(notification_data)
            
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = self.from_email
            message['To'] = recipient_email
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(message)
            
            return {
                'success': True,
                'recipient': recipient_email
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def generate_email_content(self, notification_data: Dict) -> tuple:
        """Generate email subject and HTML content"""
        
        template_data = notification_data['template_data']
        notification_type = notification_data['type']
        
        if notification_type == NotificationType.APPOINTMENT_REMINDER:
            template = self.template_env.get_template('appointment_reminder.html')
            subject = f"Appointment Reminder - {template_data['appointment_date']}"
            
        elif notification_type == NotificationType.TREATMENT_UPDATE:
            template = self.template_env.get_template('treatment_update.html')
            subject = f"Treatment Progress Update - {template_data['progress_percentage']}% Complete"
            
        else:
            template = self.template_env.get_template('default.html')
            subject = "AyurSutra Notification"
        
        html_content = template.render(**template_data)
        
        return subject, html_content
```

### 4. In-App Notification Service

```python
# channels/in_app_service.py
import asyncio
from typing import Dict, List
from datetime import datetime

class InAppService:
    def __init__(self):
        self.active_connections = {}  # WebSocket connections
    
    async def send(self, notification_data: Dict) -> Dict:
        """Send in-app notification"""
        
        try:
            # Store notification in database
            notification_record = await self.store_in_app_notification(notification_data)
            
            # Send real-time notification if user is online
            await self.send_realtime_notification(
                notification_data['recipient_id'], 
                notification_record
            )
            
            return {
                'success': True,
                'notification_id': notification_record['id']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def store_in_app_notification(self, notification_data: Dict) -> Dict:
        """Store notification in database for in-app display"""
        
        notification_record = {
            'id': self.generate_notification_id(),
            'recipient_id': notification_data['recipient_id'],
            'type': notification_data['type'].value,
            'title': self.generate_notification_title(notification_data),
            'message': self.generate_notification_message(notification_data),
            'data': notification_data['template_data'],
            'read': False,
            'created_at': datetime.now(),
            'priority': notification_data.get('priority', 'normal')
        }
        
        # Store in database (implementation depends on your DB choice)
        await self.save_to_database(notification_record)
        
        return notification_record
    
    async def send_realtime_notification(self, user_id: str, notification: Dict):
        """Send real-time notification via WebSocket"""
        
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_json({
                    'type': 'notification',
                    'data': notification
                })
            except:
                # Remove stale connection
                del self.active_connections[user_id]
```

### 5. Notification Queue System

```python
# queue/notification_queue.py
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List
import redis

class NotificationQueue:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0
        )
        self.queue_name = 'notification_queue'
        self.processing = False
    
    async def enqueue_notification(self, notification_data: Dict, delay_seconds: int = 0):
        """Add notification to queue with optional delay"""
        
        scheduled_time = datetime.now() + timedelta(seconds=delay_seconds)
        
        queue_item = {
            'notification_data': notification_data,
            'scheduled_time': scheduled_time.isoformat(),
            'attempts': 0,
            'max_attempts': 3
        }
        
        # Add to Redis sorted set with timestamp as score
        self.redis_client.zadd(
            self.queue_name,
            {json.dumps(queue_item): scheduled_time.timestamp()}
        )
    
    async def process_queue(self):
        """Process notifications from queue"""
        
        self.processing = True
        
        while self.processing:
            try:
                # Get notifications ready to be sent
                current_time = datetime.now().timestamp()
                ready_notifications = self.redis_client.zrangebyscore(
                    self.queue_name, 0, current_time, withscores=True
                )
                
                for notification_json, score in ready_notifications:
                    queue_item = json.loads(notification_json)
                    
                    # Process notification
                    success = await self.process_notification(queue_item)
                    
                    # Remove from queue if successful or max attempts reached
                    if success or queue_item['attempts'] >= queue_item['max_attempts']:
                        self.redis_client.zrem(self.queue_name, notification_json)
                    else:
                        # Retry later
                        queue_item['attempts'] += 1
                        retry_time = datetime.now() + timedelta(minutes=5 * queue_item['attempts'])
                        
                        self.redis_client.zrem(self.queue_name, notification_json)
                        self.redis_client.zadd(
                            self.queue_name,
                            {json.dumps(queue_item): retry_time.timestamp()}
                        )
                
                # Wait before next check
                await asyncio.sleep(10)
                
            except Exception as e:
                print(f"Queue processing error: {e}")
                await asyncio.sleep(30)
```

### 6. API Endpoints

```python
# api/notification_api.py
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
from ..services.notification_service import NotificationService, NotificationType, NotificationChannel

app = FastAPI()
notification_service = NotificationService()

class NotificationRequest(BaseModel):
    recipient_id: str
    type: NotificationType
    channels: List[NotificationChannel]
    template_data: dict
    scheduled_time: Optional[str] = None
    priority: Optional[str] = "normal"

@app.post("/api/notifications/send")
async def send_notification(request: NotificationRequest):
    """Send immediate notification"""
    result = await notification_service.send_notification(request.dict())
    return result

@app.post("/api/notifications/schedule")
async def schedule_notification(request: NotificationRequest):
    """Schedule notification for later"""
    # Add to queue with delay
    await notification_service.schedule_notification(request.dict())
    return {"message": "Notification scheduled successfully"}

@app.get("/api/notifications/{user_id}")
async def get_user_notifications(user_id: str, unread_only: bool = False):
    """Get user's in-app notifications"""
    notifications = await notification_service.get_user_notifications(user_id, unread_only)
    return {"notifications": notifications}

@app.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark notification as read"""
    await notification_service.mark_as_read(notification_id)
    return {"message": "Notification marked as read"}

@app.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time notifications"""
    await websocket.accept()
    notification_service.in_app_service.active_connections[user_id] = websocket
    
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        del notification_service.in_app_service.active_connections[user_id]
```

### 7. Frontend Integration

```javascript
// services/notificationService.js
class NotificationService {
  constructor() {
    this.websocket = null;
    this.notifications = [];
    this.listeners = [];
  }

  // Connect to WebSocket for real-time notifications
  connect(userId) {
    this.websocket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}`);
    
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        this.handleNewNotification(data.data);
      }
    };
  }

  // Handle new notification
  handleNewNotification(notification) {
    this.notifications.unshift(notification);
    this.notifyListeners(notification);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/ayursutra-icon.png'
      });
    }
  }

  // Get all notifications
  async getNotifications(unreadOnly = false) {
    try {
      const response = await fetch(`/api/notifications/${userId}?unread_only=${unreadOnly}`);
      const data = await response.json();
      this.notifications = data.notifications;
      return this.notifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      // Update local state
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.listeners.push(callback);
  }

  // Notify all listeners
  notifyListeners(notification) {
    this.listeners.forEach(callback => callback(notification));
  }
}

export default new NotificationService();
```

## Email Templates

```html
<!-- templates/email/appointment_reminder.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Appointment Reminder</title>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .appointment-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 AyurSutra</h1>
            <h2>Appointment Reminder</h2>
        </div>
        
        <div class="content">
            <p>Dear {{ patient_name }},</p>
            
            <p>This is a friendly reminder about your upcoming Panchakarma appointment.</p>
            
            <div class="appointment-details">
                <h3>Appointment Details</h3>
                <p><strong>Treatment:</strong> {{ treatment_type }}</p>
                <p><strong>Date:</strong> {{ appointment_date }}</p>
                <p><strong>Time:</strong> {{ appointment_time }}</p>
                <p><strong>Practitioner:</strong> Dr. {{ practitioner_name }}</p>
                <p><strong>Location:</strong> {{ clinic_address }}</p>
            </div>
            
            <p><strong>Please arrive 15 minutes early</strong> to complete any necessary preparations.</p>
            
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        </div>
        
        <div class="footer">
            <p>AyurSutra - Traditional Healing, Modern Technology</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

## Key Features

### 1. Multi-Channel Support
- SMS via Twilio
- Email via SendGrid
- Push notifications
- In-app notifications
- WebSocket real-time updates

### 2. Smart Scheduling
- Delayed notification delivery
- Retry mechanism for failed deliveries
- User preference-based channel selection
- Priority-based routing

### 3. Template System
- HTML email templates
- SMS message templates
- Personalized content generation
- Multi-language support ready

### 4. Real-time Features
- WebSocket connections
- Instant notification delivery
- Live notification status updates
- Browser notification integration

This comprehensive notification system ensures reliable, multi-channel communication for all AyurSutra users with proper queuing, retry mechanisms, and real-time capabilities.
