# AyurSutra API Documentation

## Overview

RESTful API for the AyurSutra Panchakarma Management System. All endpoints use JSON and return `{ success: boolean, ... }` format.

## Base URL

```
Development: http://localhost:5000/api
Production:  https://api.ayursutra.com/api
```

## Authentication

Uses JWT with **httpOnly cookies** — tokens are never exposed to JavaScript. The browser automatically sends them with every request (`withCredentials: true`).

Access token: 15 min  |  Refresh token: 7 days

All endpoints except `/api/auth/*` public routes require authentication.

---

## Auth Endpoints

### POST /api/auth/login
Login with email and password. Sets httpOnly cookies.

**Request:**
```json
{ "email": "patient@ayursutra.com", "password": "password123" }
```

**Response (200):**
```json
{
  "success": true,
  "user": { "id": 2, "fullName": "Rajesh Kumar", "email": "patient@ayursutra.com", "role": "patient" }
}
```

**Response (401):**
```json
{ "success": false, "message": "Invalid credentials" }
```

### POST /api/auth/register
Register a new user account. Sets httpOnly cookies.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+91 99999 00000",
  "role": "patient",
  "dateOfBirth": "1990-01-01"
}
```

**Response (201):**
```json
{ "success": true, "user": { "id": 3, "fullName": "John Doe", "email": "john@example.com", "role": "patient" } }
```

**Response (409):**
```json
{ "success": false, "message": "Email already registered" }
```

### POST /api/auth/logout
Clears auth + refresh cookies and invalidates refresh token in DB.

**Response (200):**
```json
{ "success": true, "message": "Logged out successfully" }
```

### POST /api/auth/refresh
Uses refresh token cookie to issue new access + refresh tokens.

**Response (200):** `{ "success": true }`  |  **Response (401):** `{ "success": false, "message": "Invalid or expired refresh token" }`

### GET /api/auth/me
Returns current user from auth cookie. Used for session restore on page load.

**Response (200):**
```json
{ "success": true, "user": { "id": 1, "fullName": "Dr. Ayurveda Sharma", "email": "doctor@ayursutra.com", "role": "practitioner", "phone": "+91 99999 11111" } }
```

### POST /api/auth/forgot-password
Request password reset. Returns success regardless of whether email exists (prevents user enumeration).

**Request:** `{ "email": "user@example.com" }`

**Response (200):** `{ "success": true, "message": "If an account exists, a reset link will be sent" }`

### POST /api/auth/reset-password
Reset password using token from forgot-password flow.

**Request:** `{ "token": "jwt_reset_token", "password": "newpassword123" }`

**Response (200):** `{ "success": true, "message": "Password reset successfully" }`

---

## Patient Endpoints

All require authentication. Patients see only their own data; practitioners see their assigned patients.

### GET /api/patients
List patients. Optional: `?limit=10&offset=0`

**Response (200):**
```json
{ "success": true, "patients": [{ "id": "P001", "name": "Rajesh Kumar", "age": 45, "gender": "Male", "constitution": "Vata-Pitta", "status": "Active", ... }] }
```

### GET /api/patients/:id
Get patient with appointments and treatments.

**Response (200):**
```json
{
  "success": true,
  "patient": {
    "id": "P001", "name": "Rajesh Kumar", ...,
    "appointments": [{ "id": 1, "scheduledDate": "2024-01-22", "status": "scheduled", ... }],
    "treatments": [{ "id": 1, "type": "Panchakarma", "status": "Active", "completedSessions": 14, ... }]
  }
}
```

### POST /api/patients
Create patient record (practitioner/admin only).

**Request:**
```json
{ "name": "New Patient", "age": 30, "gender": "Male", "phone": "+91 88888 00000", "constitution": "Vata", "currentCondition": "Back pain" }
```

**Response (201):**
```json
{ "success": true, "patient": { "id": "P...", "name": "New Patient", ... } }
```

**Validation (400):**
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "name", "message": "\"name\" is required" }] }
```

### PUT /api/patients/:id
Update patient (practitioner/admin only).

**Request:**
```json
{ "name": "Updated Name", "status": "Completed" }
```

---

## Appointment Endpoints

All require authentication. Role-scoped: patients see own, practitioners see assigned.

### GET /api/appointments
List appointments. Optional query params: `?status=scheduled&date=2024-01-22&limit=20`

**Response (200):**
```json
{ "success": true, "appointments": [{ "id": 1, "patientId": "P001", "scheduledDate": "2024-01-22", "scheduledTime": "10:00:00", "treatmentType": "Abhyanga", "status": "scheduled", ... }] }
```

### GET /api/appointments/:id
Get single appointment with patient and practitioner details.

### POST /api/appointments
Book a new appointment.

**Request:**
```json
{
  "patientId": "P001",
  "scheduledDate": "2024-01-25",
  "scheduledTime": "10:00:00",
  "duration": 60,
  "treatmentType": "Abhyanga",
  "notes": "First session",
  "isVirtual": false
}
```

**Response (201):**
```json
{ "success": true, "appointment": { "id": 6, "patientId": "P001", "status": "scheduled", ... } }
```

### PUT /api/appointments/:id
Update appointment (practitioner only).

**Request:**
```json
{ "status": "completed", "notes": "Session went well" }
```

### PUT /api/appointments/:id/cancel
Cancel appointment (sets status to "cancelled").

---

## Treatment Endpoints

### GET /api/treatments
List treatments. Optional: `?status=Active`

### GET /api/treatments/:id
Get treatment with patient details.

### POST /api/treatments
Create treatment plan (practitioner only).

**Request:**
```json
{
  "patientId": "P001",
  "type": "Abhyanga",
  "startDate": "2024-02-01",
  "totalSessions": 12
}
```

### PUT /api/treatments/:id
Update treatment plan (practitioner only). Fields: `type`, `endDate`, `status`, `totalSessions`, `completedSessions`, `notes`.

---

## Notification Endpoints

### GET /api/notifications
Get user's notifications. Optional: `?unreadOnly=true`

**Response (200):**
```json
{ "success": true, "notifications": [{ "id": 1, "title": "Appointment Reminder", "message": "...", "isRead": false, "type": "appointment", "createdAt": "..." }] }
```

### GET /api/notifications/:id
Get single notification (scoped to current user).

### PUT /api/notifications/:id/read
Mark notification as read.

### PUT /api/notifications/mark-all-read
Mark all notifications as read.

### DELETE /api/notifications/:id
Delete notification.

---

## Analytics Endpoints

Practitioner/admin only. All return `{ success: true, data: { ... } }`.

### GET /api/analytics/overview
Dashboard summary: `totalPatients`, `activePatients`, `totalAppointments`, `completedTreatments`.

### GET /api/analytics/revenue
Revenue trend data (last 6 months).

### GET /api/analytics/treatment-effectiveness
Treatment effectiveness metrics grouped by type.

### GET /api/analytics/patient-flow
Patient flow by day of week.

---

## Error Format

All errors follow the same structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Validation error
- `401` — Authentication required / Invalid token
- `403` — Insufficient permissions
- `404` — Resource not found
- `409` — Conflict (duplicate email)
- `500` — Internal server error

---

## Rate Limiting

Global: 100 requests per 15 minutes per IP on all `/api/` routes.

---

## Pagination

List endpoints accept `?limit=N&offset=M`. Default: 50 items, offset 0.
