# AyurSutra — Panchakarma Management System

A comprehensive Ayurvedic healthcare management platform built for **Smart India Hackathon 2025** (Problem Statement ID: 25023).

---

## Project Overview

AyurSutra digitizes the entire Panchakarma therapy workflow — from patient onboarding and constitution analysis to treatment planning, appointment scheduling, progress tracking, and analytics. Built as a full-stack application with React frontend and Node.js/Express backend, connected to a MongoDB database.

### Problem Statement
Ayurvedic clinics lack digital tools for managing Panchakarma treatments. Patients struggle to track complex multi-session therapies. Practitioners manually manage appointments and can't analyze treatment outcomes at scale. AyurSutra solves this with a role-based platform.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  React 18 + Tailwind CSS + Recharts + React Router  │
│         httpOnly JWT Cookies (auto-sent)            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Express.js API Server (Node 18)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ JWT Auth │ │ Joi      │ │ Role-Based Access    │ │
│  │ Middleware│ │ Validatn │ │ (patient/practitionr)│ │
│  └──────────┘ └──────────┘ └──────────────────────┘ │
│         Routes: auth, patients, appointments,        │
│         treatments, notifications, analytics          │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    MongoDB Atlas                    │
│  Collections: users, patients, appointments,         │
│  treatments, notifications (with Mongoose refs)       │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Tailwind CSS, Recharts | UI, charts, responsive design |
| Routing | React Router 6 | Client-side routing with protected routes |
| Forms | react-hook-form | Input validation on Login/Register |
| State | React Context API | Auth state management |
| HTTP | Axios with interceptors | API calls with auto token refresh |
| Backend | Express.js | REST API server |
| Auth | JWT + bcryptjs | httpOnly cookie-based authentication |
| Validation | Joi | Request body validation on all endpoints |
| ODM | Mongoose | MongoDB queries with population and aggregation |
| Database | MongoDB Atlas | Cloud-hosted MongoDB |
| Notifications | react-hot-toast | Toast feedback for user actions |
| Deployment | AWS (ECS + Docker) | Containerized on AWS cloud |

---

## Features (All Working ✅)

### Authentication & Security
- JWT stored in **httpOnly cookies** (not localStorage — immune to XSS token theft)
- Access token (15 min) + Refresh token (7 days) with automatic rotation
- bcrypt password hashing (12 rounds)
- Role-based middleware: `authenticate` + `authorize('practitioner', 'admin')`
- Joi input validation on every write endpoint
- Helmet security headers + CORS whitelist + rate limiting

### Patient Features
- **Dashboard**: Treatment progress percentage, session count, next appointment, constitution display, treatment phase indicator, progress chart (Recharts), milestone tracker, appointment calendar
- **Book Appointment**: 4-step wizard — select treatment → choose practitioner → pick date/time → confirm. Validates availability, sets duration, shows confirmation with details
- **Treatment History**: Complete history with search, filtering, detail modal, CSV download
- **Profile**: Full editable profile with image upload (camera/file picker), medical history, allergies, medications, notification preferences, privacy settings
- **Notifications**: In-app notification panel with unread count badge, type-based filtering (All/Unread/Appointments), click-to-navigate, mark all read

### Practitioner Features
- **Dashboard Overview**: Today's appointments count, active patients, weekly revenue, satisfaction rate. Quick action buttons for common tasks
- **Today's Schedule**: Real-time appointment list with status (upcoming/in-progress/completed). Actions: Start Session, Complete Session, Call Patient (tel: link), Add Notes (modal with textarea), Reschedule
- **Patient Management**: Searchable patient list with filters (All/Active/New/Completed). Add Patient modal. Action buttons: View (detail modal), Phone, Email, Schedule
- **Calendar**: Month/week/day view with appointment indicators. Add Appointment modal with patient name, treatment, date, time, duration. Date click shows day's appointments
- **Patient Records**: Detailed view with vitals, medical history, treatment history, allergies, medications, clinical notes. CSV export
- **Treatment Planner**: Treatment plan list with progress bars, session tracking, add treatment plan modal, session completion tracking
- **Analytics Dashboard**: Revenue trends (area chart), treatment revenue distribution (pie chart), treatment effectiveness (bar chart), patient flow by hour. Time range filter (7d/30d/90d/1y)
- **AI Insights**: Constitution distribution pie chart, AI-powered recommendations with priority levels, treatment effectiveness comparison

### Backend
- 7 route modules: auth, patients, appointments, treatments, notifications, analytics, users
- Mongoose ODM with 5 models, population, and aggregation pipelines
- Auto-seeder: on first boot with empty DB → creates 3 users, 5 patients, 5 treatments, 5 appointments, 3 notifications
- `/api/health` endpoint for monitoring

---

## Database Schema

```
users:         _id (ObjectId), fullName, email, passwordHash, phone,
               role (patient|practitioner|admin), refreshToken, refreshTokenExpires,
               dateOfBirth, timestamps

patients:      _id (ObjectId), patientId (P001, P002...), user → users (ObjectId),
               practitioner → users (ObjectId), name, age, gender, phone, email,
               constitution, currentCondition, status (Active|Inactive|Completed),
               nextAppointment, lastVisit

appointments:  _id (ObjectId), patient → patients (ObjectId), practitioner → users (ObjectId),
               scheduledDate, scheduledTime, duration, treatmentType,
               status (scheduled|confirmed|in-progress|completed|cancelled|pending),
               location, notes, isVirtual

treatments:    _id (ObjectId), patient → patients (ObjectId), type, startDate, endDate,
               status (Active|Completed|On Hold|Cancelled),
               totalSessions, completedSessions, notes

notifications: _id (ObjectId), user → users (ObjectId), type, title, message,
               isRead, actionUrl
```

---

## Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB Atlas (or local MongoDB)

### Setup
```bash
git clone <repo-url>
cd NavAyush_SIH/ayursutra

# Install dependencies
npm run install-deps

# Configure environment
cp .env.example .env
# Edit .env → set MONGODB_URI to your MongoDB connection

# Start (auto-seeds DB on first run if empty)
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Practitioner | doctor@ayursutra.com | password123 |
| Patient | patient@ayursutra.com | password123 |

### Docker (Alternative)
```bash
docker-compose up -d
# App at http://localhost:5000 (serves both frontend + backend)
```

---

## API Documentation

See [docs/API.md](./docs/API.md) for complete endpoint reference with request/response examples.

---

## Project Structure

```
ayursutra/
├── backend/
│   ├── server.js              # Express server, middleware, route mounting
│   ├── seed.js                # Database seeder (auto-runs on empty DB)
│   ├── config/database.js     # Mongoose connection
│   ├── middleware/
│   │   ├── auth.js            # authenticate + authorize JWT middleware
│   │   └── validate.js        # Joi validation middleware factory
│   │   ├── User.js, Patient.js, Appointment.js, Treatment.js, Notification.js
│   ├── validators/
│   │   └── authValidator.js, appointmentValidator.js, patientValidator.js, treatmentValidator.js
│   └── routes/
│       └── auth.js, patients.js, appointments.js, treatments.js, notifications.js, analytics.js, users.js
├── frontend/
│   └── src/
│       ├── App.jsx            # Root with routing + Toaster
│       ├── contexts/AuthContext.js    # Auth state + login/register/logout
│       ├── services/api.js           # Axios instance + interceptors + API methods
│       ├── hooks/                    # useAppointments, useNotifications, usePatientManagement, usePatientProgress
│       ├── pages/                    # LandingPage, Login, Register, BookAppointment, Profile, TreatmentHistory
│       └── components/
│           ├── patient/              # Dashboard, AppointmentCalendar, ProgressChart, TreatmentMilestones, UpcomingAppointments, NotificationPanel, TreatmentPhaseIndicator
│           └── practitioner/         # Dashboard, PatientList, AppointmentScheduler, CalendarView, AIInsights, AnalyticsDashboard, TreatmentPlanner, PatientRecords
├── docs/
│   ├── API.md                # Complete API reference
│   └── FUTURE_PLAN.md        # Detailed development roadmap
├── scripts/deploy.sh         # One-command deploy (local/docker/vercel)
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml         # Local dev with MongoDB Atlas
├── .env.example              # Environment variable template
└── README.md                 # This file
```

---

## Future Roadmap

See [docs/FUTURE_PLAN.md](./docs/FUTURE_PLAN.md) for the full 6-phase development plan including:

1. **Production Hardening** — integration tests, Winston logging, SendGrid email, brute-force protection, DB indexes + migrations
2. **Core Feature Completion** — Socket.io real-time notifications, Twilio SMS reminders, advanced treatment plan builder, Razorpay payments
3. **AI & Intelligence** — Python FastAPI scheduling service, treatment outcome prediction, patient churn detection, NLP session notes
4. **Scale & Infrastructure** — AWS ECS/RDS/ElastiCache deployment, GitHub Actions CI/CD, Prometheus + Grafana monitoring
5. **Platform Expansion** — React Native mobile app, multi-clinic support, telemedicine (WebRTC), lab system & wearable integrations
6. **Advanced AI** — Computer vision for tongue/skin diagnosis, AI diagnosis assistant, research analytics platform

---

## About This Project

This project was built for **Smart India Hackathon 2025** (Problem Statement ID: 25023) as a full-stack Panchakarma management platform.

**Primary Developer:** Somya Shekhar Tiwari — designed the entire architecture, built the backend API with JWT authentication and Mongoose ODM, developed all React frontend components with role-based dashboards, integrated MongoDB Atlas, and handled Docker + deployment configuration. This project was taken from a prototype with mock data and hardcoded passwords to a production-ready application with real authentication, database integration, input validation, and complete CRUD functionality across 7 API route modules and 15+ frontend components.

The initial prototype had mock data, no working auth, broken buttons, missing modals, no database, and over 50 bugs. Everything that works today — JWT httpOnly cookie auth, MongoDB integration, form validation, forgot password flow, appointment booking, real-time dashboard, accessibility, toast notifications, Docker setup, and database seeding — was built and fixed as part of making this ready for production.
