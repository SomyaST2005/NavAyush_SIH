# Core Backend API Implementation Guide

## Overview

The Core Backend API serves as the central hub for all AyurSutra services, providing RESTful endpoints for patient management, appointment scheduling, treatment tracking, and system administration using Node.js and Express.js.

## System Architecture

```
BackendAPI/
├── controllers/
│   ├── patientController.js
│   ├── practitionerController.js
│   ├── appointmentController.js
│   ├── treatmentController.js
│   └── adminController.js
├── models/
│   ├── Patient.js
│   ├── Practitioner.js
│   ├── Appointment.js
│   ├── Treatment.js
│   └── Notification.js
├── services/
│   ├── patientService.js
│   ├── appointmentService.js
│   ├── treatmentService.js
│   └── analyticsService.js
├── database/
│   ├── connection.js
│   ├── migrations/
│   └── seeders/
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
└── utils/
    ├── validators.js
    ├── helpers.js
    └── constants.js
```

## Database Models (Sequelize)

### 1. Patient Model

```javascript
// models/Patient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.STRING(10)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  address: {
    type: DataTypes.TEXT
  },
  medicalHistory: {
    type: DataTypes.TEXT
  },
  constitutionType: {
    type: DataTypes.ENUM('vata', 'pitta', 'kapha', 'vata_pitta', 'pitta_kapha', 'vata_kapha', 'tridosha')
  },
  emergencyContact: {
    type: DataTypes.STRING(100)
  },
  emergencyPhone: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'patients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Patient.associate = (models) => {
  Patient.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Patient.hasMany(models.Appointment, { foreignKey: 'patientId', as: 'appointments' });
  Patient.hasMany(models.Treatment, { foreignKey: 'patientId', as: 'treatments' });
};

module.exports = Patient;
```

### 2. Appointment Model

```javascript
// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  practitionerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Practitioners',
      key: 'id'
    }
  },
  treatmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Treatments',
      key: 'id'
    }
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  scheduledTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Appointment.associate = (models) => {
  Appointment.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
  Appointment.belongsTo(models.Practitioner, { foreignKey: 'practitionerId', as: 'practitioner' });
  Appointment.belongsTo(models.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
};

module.exports = Appointment;
```

### 3. Treatment Model

```javascript
// models/Treatment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Treatment = sequelize.define('Treatment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  practitionerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Practitioners',
      key: 'id'
    }
  },
  treatmentType: {
    type: DataTypes.ENUM('abhyanga', 'swedana', 'shirodhara', 'panchakarma', 'yoga_therapy', 'herbal_medicine'),
    allowNull: false
  },
  phase: {
    type: DataTypes.ENUM('purvakarma', 'pradhankarma', 'paschatkarma'),
    allowNull: false
  },
  sessionNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  totalSessions: {
    type: DataTypes.INTEGER
  },
  progressPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  notes: {
    type: DataTypes.TEXT
  },
  prescription: {
    type: DataTypes.TEXT
  },
  nextSessionDate: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'treatments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Treatment.associate = (models) => {
  Treatment.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
  Treatment.belongsTo(models.Practitioner, { foreignKey: 'practitionerId', as: 'practitioner' });
  Treatment.hasMany(models.Appointment, { foreignKey: 'treatmentId', as: 'appointments' });
};

module.exports = Treatment;
```

## API Controllers

### 1. Patient Controller

```javascript
// controllers/patientController.js
const express = require('express');
const { Patient, Appointment, Treatment } = require('../models');
const { auth, requireRole } = require('../middleware/auth');
const { validatePatient } = require('../middleware/validation');
const patientService = require('../services/patientService');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/patients - Get all patients with pagination and search
router.get('/', auth, requireRole(['practitioner', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = search ? {
      [Op.or]: [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { '$user.email$': { [Op.iLike]: `%${search}%` } }
      ]
    } : {};
    
    const { rows: patients, count: total } = await Patient.findAndCountAll({
      where: whereClause,
      include: [{
        model: require('../models/User'),
        as: 'user',
        attributes: ['email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      patients,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id - Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can access this patient
    if (req.user.role === 'patient' && req.user.patient?.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const patient = await Patient.findByPk(id, {
      include: [{
        model: require('../models/User'),
        as: 'user',
        attributes: ['email', 'fullName', 'phone']
      }]
    });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients - Create new patient
router.post('/', auth, requireRole(['practitioner', 'admin']), validatePatient, async (req, res) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check permissions
    if (req.user.role === 'patient' && req.user.patient?.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const patient = await patientService.updatePatient(id, req.body);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/patients/:id/appointments - Get patient's appointments
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointments = await Appointment.findAll({
      where: { patientId: id },
      include: [{
        model: require('../models/Practitioner'),
        as: 'practitioner',
        attributes: ['fullName', 'specialization']
      }],
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'DESC']]
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

@router.get("/{patient_id}")
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get patient by ID"""
    # Check if user can access this patient
    if current_user['role'] == 'patient' and current_user['user_id'] != patient_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    patient = await patient_service.get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    return patient.to_dict()

@router.post("/")
async def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff)
):
    """Create new patient"""
    patient = await patient_service.create_patient(db, patient_data.dict())
    return patient.to_dict()

@router.put("/{patient_id}")
async def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update patient information"""
    # Check permissions
    if current_user['role'] == 'patient' and current_user['user_id'] != patient_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    patient = await patient_service.update_patient(db, patient_id, patient_data.dict(exclude_unset=True))
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    return patient.to_dict()

@router.get("/{patient_id}/appointments")
async def get_patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get patient's appointments"""
    appointments = await patient_service.get_patient_appointments(db, patient_id)
    return [appointment.to_dict() for appointment in appointments]

@router.get("/{patient_id}/treatments")
async def get_patient_treatments(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get patient's treatment history"""
    treatments = await patient_service.get_patient_treatments(db, patient_id)
    return [treatment.to_dict() for treatment in treatments]
```

### 2. Appointment Controller

```python
# controllers/appointment_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from ..services.appointment_service import AppointmentService
from ..middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["appointments"])
appointment_service = AppointmentService()

class AppointmentCreate(BaseModel):
    patient_id: int
    practitioner_id: int
    treatment_id: Optional[int] = None
    scheduled_date: str
    scheduled_time: str
    duration_minutes: Optional[int] = 60
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    scheduled_date: Optional[str] = None
    scheduled_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@router.post("/")
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create new appointment"""
    # Validate datetime
    try:
        scheduled_datetime = datetime.fromisoformat(f"{appointment_data.scheduled_date}T{appointment_data.scheduled_time}")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date or time format"
        )
    
    # Check availability
    is_available = await appointment_service.check_availability(
        db, appointment_data.practitioner_id, scheduled_datetime, appointment_data.duration_minutes
    )
    
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot not available"
        )
    
    appointment = await appointment_service.create_appointment(db, appointment_data.dict())
    return appointment.to_dict()

@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get appointment by ID"""
    appointment = await appointment_service.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment.to_dict()

@router.put("/{appointment_id}")
async def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update appointment"""
    appointment = await appointment_service.update_appointment(
        db, appointment_id, appointment_data.dict(exclude_unset=True)
    )
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment.to_dict()

@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Cancel appointment"""
    success = await appointment_service.cancel_appointment(db, appointment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return {"message": "Appointment cancelled successfully"}

@router.get("/practitioner/{practitioner_id}")
async def get_practitioner_appointments(
    practitioner_id: int,
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get practitioner's appointments"""
    appointments = await appointment_service.get_practitioner_appointments(
        db, practitioner_id, date
    )
    return [appointment.to_dict() for appointment in appointments]
```

## Service Layer

### 1. Patient Service

```javascript
// services/patientService.js
const { Patient, User, Appointment, Treatment } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

class PatientService {
  async createPatient(patientData) {
    const { userData, ...patientInfo } = patientData;
    
    // Create user first
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      role: 'patient'
    });
    
    // Create patient profile
    const patient = await Patient.create({
      ...patientInfo,
      userId: user.id
    });
    
    return await Patient.findByPk(patient.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName', 'phone']
      }]
    });
  }
  
  async updatePatient(patientId, updateData) {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    await patient.update(updateData);
    
    return await Patient.findByPk(patientId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName', 'phone']
      }]
    });
  }
  
  async getPatientById(patientId) {
    return await Patient.findByPk(patientId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName', 'phone']
      }]
    });
  }
  
  async getPatientAppointments(patientId) {
    return await Appointment.findAll({
      where: { patientId },
      include: [{
        model: require('../models/Practitioner'),
        as: 'practitioner',
        attributes: ['fullName', 'specialization']
      }],
      order: [['scheduledDate', 'DESC']]
    });
  }
  
  async getPatientTreatments(patientId) {
    return await Treatment.findAll({
      where: { patientId },
      include: [{
        model: require('../models/Practitioner'),
        as: 'practitioner',
        attributes: ['fullName', 'specialization']
      }],
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new PatientService();
```
    
    async def get_patient_by_id(self, db: Session, patient_id: int) -> Optional[Patient]:
        """Get patient by ID"""
        return db.query(Patient).filter(Patient.id == patient_id).first()
    
    async def create_patient(self, db: Session, patient_data: dict) -> Patient:
        """Create new patient"""
        patient = Patient(**patient_data)
        db.add(patient)
        db.commit()
        db.refresh(patient)
        return patient
    
    async def update_patient(self, db: Session, patient_id: int, 
                           patient_data: dict) -> Optional[Patient]:
        """Update patient information"""
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return None
        
        for key, value in patient_data.items():
            if hasattr(patient, key):
                setattr(patient, key, value)
        
        db.commit()
        db.refresh(patient)
        return patient
    
    async def get_patient_appointments(self, db: Session, patient_id: int) -> List[Appointment]:
        """Get patient's appointments"""
        return db.query(Appointment).filter(
            Appointment.patient_id == patient_id
        ).order_by(Appointment.scheduled_date.desc()).all()
    
    async def get_patient_treatments(self, db: Session, patient_id: int) -> List[Treatment]:
        """Get patient's treatment history"""
        return db.query(Treatment).filter(
            Treatment.patient_id == patient_id
        ).order_by(Treatment.created_at.desc()).all()
```

## Database Configuration

### 1. Database Connection

```javascript
// database/connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ayursutra_db', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
```

### 2. Database Migration

```python
# database/migrations/001_initial_schema.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now())
    )
    
    # Create patients table
    op.create_table(
        'patients',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('age', sa.Integer),
        sa.Column('gender', sa.String(10)),
        sa.Column('phone', sa.String(20)),
        sa.Column('address', sa.Text),
        sa.Column('medical_history', sa.Text),
        sa.Column('constitution_type', sa.String(50)),
        sa.Column('emergency_contact', sa.String(100)),
        sa.Column('emergency_phone', sa.String(20)),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now())
    )
    
    # Create practitioners table
    op.create_table(
        'practitioners',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('specialization', sa.String(100)),
        sa.Column('experience_years', sa.Integer),
        sa.Column('license_number', sa.String(100)),
        sa.Column('availability_hours', sa.JSON),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now())
    )
    
    # Create appointments table
    op.create_table(
        'appointments',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('patient_id', sa.Integer, sa.ForeignKey('patients.id')),
        sa.Column('practitioner_id', sa.Integer, sa.ForeignKey('practitioners.id')),
        sa.Column('treatment_id', sa.Integer, sa.ForeignKey('treatments.id')),
        sa.Column('scheduled_date', sa.DateTime, nullable=False),
        sa.Column('scheduled_time', sa.DateTime, nullable=False),
        sa.Column('duration_minutes', sa.Integer, default=60),
        sa.Column('status', sa.String(50), default='scheduled'),
        sa.Column('notes', sa.Text),
        sa.Column('reminder_sent', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now())
    )

def downgrade():
    op.drop_table('appointments')
    op.drop_table('practitioners')
    op.drop_table('patients')
    op.drop_table('users')
```

## Main Application

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, testConnection } = require('./database/connection');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const practitionerRoutes = require('./routes/practitioners');
const appointmentRoutes = require('./routes/appointments');
const treatmentRoutes = require('./routes/treatments');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/practitioners', practitionerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AyurSutra API v1.0.0',
    docs: '/api/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ force: false });
    
    app.listen(PORT, () => {
      console.log(`🚀 AyurSutra API running on port ${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
```

## Environment Configuration

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/ayursutra_db
JWT_SECRET_KEY=your-super-secret-jwt-key
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key
CORS_ORIGINS=http://localhost:3000,https://ayursutra.com
```

## Key Features

### 1. RESTful API Design
- Standard HTTP methods and status codes
- Consistent JSON response format
- Proper error handling and validation
- Comprehensive API documentation

### 2. Database Management
- SQLAlchemy ORM with PostgreSQL
- Database migrations with Alembic
- Connection pooling and optimization
- Data validation and constraints

### 3. Security & Authentication
- JWT-based authentication
- Role-based access control
- Rate limiting and CORS protection
- Input validation and sanitization

### 4. Performance Optimization
- Database query optimization
- Caching with Redis
- Pagination for large datasets
- Async/await for I/O operations

This comprehensive backend API provides a solid foundation for the AyurSutra platform with proper architecture, security, and scalability considerations for Phase 1 implementation.
