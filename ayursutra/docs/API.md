# AyurSutra API Documentation

## Overview

The AyurSutra API is a RESTful service built with Node.js and Express.js that provides endpoints for managing Ayurvedic healthcare operations, including patient management, appointment scheduling, treatment planning, and AI-powered insights.

## Base URL

```
Production: https://api.ayursutra.com
Development: http://localhost:5000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "patient",
      "fullName": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "patient",
  "dateOfBirth": "1990-01-01"
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/logout
Logout and invalidate tokens.

#### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

## User Management

#### GET /api/users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "role": "patient",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Request:**
```json
{
  "fullName": "John Smith",
  "phone": "+1234567891"
}
```

#### PUT /api/users/password
Change password.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Patient Management

#### GET /api/patients
Get all patients (practitioners only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `constitution`: Filter by constitution type

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "userId": 2,
        "constitution": "Vata-Pitta",
        "medicalHistory": [],
        "allergies": ["Peanuts"],
        "user": {
          "fullName": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### GET /api/patients/:id
Get patient details.

#### POST /api/patients
Create new patient record.

**Request:**
```json
{
  "userId": 2,
  "constitution": "Vata-Pitta",
  "medicalHistory": [
    {
      "condition": "Arthritis",
      "severity": "Moderate",
      "date": "2023-01-01"
    }
  ],
  "allergies": ["Peanuts", "Shellfish"],
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+1234567890",
    "relationship": "Spouse"
  }
}
```

#### PUT /api/patients/:id
Update patient record.

## Appointment Management

#### GET /api/appointments
Get appointments.

**Query Parameters:**
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)
- `status`: Filter by status (scheduled, completed, cancelled)
- `patientId`: Filter by patient ID
- `practitionerId`: Filter by practitioner ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "practitionerId": 1,
      "treatmentType": "Abhyanga",
      "scheduledDate": "2024-01-20",
      "scheduledTime": "10:00",
      "duration": 60,
      "status": "scheduled",
      "notes": "First session",
      "patient": {
        "user": {
          "fullName": "Jane Doe"
        }
      },
      "practitioner": {
        "user": {
          "fullName": "Dr. Smith"
        }
      }
    }
  ]
}
```

#### POST /api/appointments
Book new appointment.

**Request:**
```json
{
  "patientId": 1,
  "practitionerId": 1,
  "treatmentType": "Abhyanga",
  "scheduledDate": "2024-01-20",
  "scheduledTime": "10:00",
  "duration": 60,
  "notes": "First consultation"
}
```

#### PUT /api/appointments/:id
Update appointment.

#### DELETE /api/appointments/:id
Cancel appointment.

#### POST /api/appointments/:id/reschedule
Reschedule appointment.

**Request:**
```json
{
  "scheduledDate": "2024-01-21",
  "scheduledTime": "14:00"
}
```

## Treatment Management

#### GET /api/treatments
Get treatment plans.

#### POST /api/treatments
Create treatment plan.

**Request:**
```json
{
  "patientId": 1,
  "practitionerId": 1,
  "treatmentType": "Panchakarma",
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "sessions": [
    {
      "type": "Consultation",
      "scheduledDate": "2024-01-15",
      "duration": 45,
      "notes": "Initial assessment"
    }
  ],
  "goals": "Improve joint mobility and reduce pain",
  "notes": "Patient has chronic arthritis"
}
```

#### GET /api/treatments/:id
Get treatment plan details.

#### PUT /api/treatments/:id
Update treatment plan.

#### POST /api/treatments/:id/sessions
Add session to treatment plan.

#### PUT /api/treatments/:treatmentId/sessions/:sessionId
Update treatment session.

## AI Scheduling

#### POST /api/ai/optimal-slots
Get optimal appointment slots.

**Request:**
```json
{
  "patientId": 1,
  "practitionerId": 1,
  "treatmentType": "Abhyanga",
  "preferredDate": "2024-01-20",
  "duration": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendedSlots": [
      {
        "date": "2024-01-20",
        "time": "10:00",
        "score": 0.95,
        "reasons": ["Optimal time for patient", "Practitioner availability"]
      }
    ]
  }
}
```

#### POST /api/ai/schedule-appointment
AI-powered appointment scheduling.

#### GET /api/ai/insights/:practitionerId
Get AI insights for practitioner.

## Notifications

#### GET /api/notifications
Get user notifications.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "appointment_reminder",
      "title": "Appointment Reminder",
      "message": "You have an appointment tomorrow at 10:00 AM",
      "isRead": false,
      "createdAt": "2024-01-19T10:00:00.000Z"
    }
  ]
}
```

#### PUT /api/notifications/:id/read
Mark notification as read.

#### POST /api/notifications/send
Send notification (admin only).

## Analytics

#### GET /api/analytics/dashboard/:practitionerId
Get practitioner dashboard analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPatients": 127,
      "activePatients": 45,
      "totalRevenue": 125000,
      "averageSessionDuration": 75
    },
    "revenueData": [
      {
        "month": "Jan",
        "revenue": 32000,
        "appointments": 108
      }
    ],
    "treatmentEffectiveness": [
      {
        "treatment": "Panchakarma",
        "successRate": 95,
        "totalPatients": 22
      }
    ]
  }
}
```

#### GET /api/analytics/patient-progress/:patientId
Get patient progress analytics.

## File Upload

#### POST /api/upload
Upload files (images, documents).

**Request:** Multipart form data
- `file`: File to upload
- `type`: File type (profile, document, report)

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "profile_123_1642694400.jpg",
    "url": "/uploads/profile_123_1642694400.jpg",
    "size": 245760,
    "mimetype": "image/jpeg"
  }
}
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload**: 10 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Query Parameters:**
- `sort`: Sort field (e.g., `createdAt`, `-createdAt` for descending)
- `filter[field]`: Filter by field value
- `search`: Search across multiple fields

Example:
```
GET /api/patients?sort=-createdAt&filter[constitution]=Vata&search=john
```

## Webhooks

The API supports webhooks for real-time notifications:

#### POST /api/webhooks/register
Register webhook endpoint.

**Request:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["appointment.created", "treatment.completed"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`
- `treatment.created`
- `treatment.completed`
- `patient.registered`
- `notification.sent`

## SDK and Libraries

Official SDKs are available for:
- JavaScript/Node.js
- Python
- PHP
- React (hooks library)

## Testing

Use the following test credentials in development:

**Patient Account:**
- Email: patient@test.com
- Password: test123

**Practitioner Account:**
- Email: doctor@test.com
- Password: test123

## Support

For API support:
- Email: api-support@ayursutra.com
- Documentation: https://docs.ayursutra.com
- Status Page: https://status.ayursutra.com
