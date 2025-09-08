# AyurSutra: Panchakarma Management System - Implementation Guide

## Project Overview

AyurSutra is a comprehensive Panchakarma patient management and therapy scheduling software designed for traditional Ayurvedic healthcare centers. This system addresses the ₹16B Ayurveda market growth with AI-powered scheduling and multi-channel notifications.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patient App   │    │  Therapist App  │    │ Admin Dashboard │
│   (React Web)   │    │  (React Web)    │    │  (React Web)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (Express.js)  │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ AI Scheduling   │    │   PostgreSQL    │    │  Notification   │
│   Service       │    │    Database     │    │    Service      │
│   (Python)      │    │                 │    │   (Twilio)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React.js** - Main UI framework
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management

### Backend
- **Node.js & Express.js** - Core backend
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Python** - AI/ML scheduling algorithms
- **JWT** - Authentication

### External Services
- **Twilio** - SMS notifications
- **SendGrid** - Email notifications
- **AWS** - Cloud hosting (optional for hackathon)

## Database Schema

### Core Tables

```sql
-- Users (Patients, Therapists, Admins)
users (
  id, email, password_hash, role, 
  created_at, updated_at
)

-- Patients
patients (
  id, user_id, full_name, age, gender, 
  phone, medical_history, constitution_type,
  created_at, updated_at
)

-- Therapists
therapists (
  id, user_id, full_name, specialization,
  experience_years, availability_hours,
  created_at, updated_at
)

-- Treatments
treatments (
  id, name, duration_minutes, phase,
  description, requirements,
  created_at, updated_at
)

-- Appointments
appointments (
  id, patient_id, therapist_id, treatment_id,
  scheduled_date, scheduled_time, status,
  notes, created_at, updated_at
)

-- Treatment Sessions
treatment_sessions (
  id, appointment_id, phase, session_number,
  progress_notes, completion_status,
  created_at, updated_at
)

-- Notifications
notifications (
  id, user_id, type, title, message,
  sent_at, read_at, created_at
)
```

## Project Structure

```
ayursutra/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── patient/
│   │   │   ├── therapist/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   └── package.json
├── ai-service/
│   ├── scheduling/
│   ├── models/
│   └── requirements.txt
└── docs/
    ├── patient-dashboard.md
    ├── therapist-dashboard.md
    ├── admin-dashboard.md
    ├── scheduling-system.md
    ├── notification-system.md
    └── deployment.md
```

## Quick Start (Hackathon Setup)

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd ayursutra

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure database and API keys

# Frontend setup
cd ../frontend
npm install

# AI Service setup
cd ../ai-service
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb ayursutra_db

# Run migrations
cd backend
npm run migrate
```

### 3. Environment Variables
```bash
# Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/ayursutra_db
JWT_SECRET=your-jwt-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
SENDGRID_API_KEY=your-sendgrid-key
REDIS_URL=redis://localhost:6379
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: AI Service
cd ai-service
python app.py
```

## Core Features Implementation Priority

### Phase 1 (MVP - Hackathon Ready)
1. **User Authentication** - JWT-based login system
2. **Patient Dashboard** - Basic appointment booking and progress tracking
3. **Therapist Dashboard** - Schedule management and patient records
4. **Simple Scheduling** - Manual appointment booking
5. **Basic Notifications** - Email/SMS reminders

### Phase 2 (Enhanced)
1. **AI-Powered Scheduling** - Automated conflict resolution
2. **Progress Tracking** - Visual treatment milestones
3. **Feedback System** - Patient symptom reporting
4. **Analytics Dashboard** - Treatment outcomes and insights

### Phase 3 (Advanced)
1. **Mobile App** - React Native implementation
2. **Offline Capability** - PWA with local storage
3. **Multi-language Support** - Including Sanskrit terminology
4. **Advanced AI** - Predictive scheduling and treatment recommendations

## Security Considerations

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (Patient, Therapist, Admin)
- **Data Encryption**: AES-256 for sensitive patient data
- **API Security**: Rate limiting, CORS, input validation
- **HIPAA Compliance**: Audit logs, secure data transmission

## Testing Strategy

- **Unit Tests**: Jest for backend logic
- **Integration Tests**: Supertest for API endpoints
- **Frontend Tests**: React Testing Library
- **E2E Tests**: Cypress for critical user flows
- **Load Tests**: Artillery for performance testing

## Deployment Options

### Hackathon (Local/Simple)
- Local PostgreSQL database
- Node.js backend on local server
- React frontend served by Node.js
- Python AI service as separate process

### Production (AWS)
- RDS PostgreSQL database
- ECS containers for backend services
- S3 + CloudFront for frontend hosting
- Lambda functions for AI processing
- ElastiCache for Redis

## Next Steps

1. Review detailed implementation guides:
   - [Patient Dashboard Implementation](./patient-dashboard.md)
   - [Therapist Dashboard Implementation](./therapist-dashboard.md)
   - [Admin Dashboard Implementation](./admin-dashboard.md)
   - [AI Scheduling System](./scheduling-system.md)
   - [Notification System](./notification-system.md)
   - [Deployment Guide](./deployment.md)

2. Set up development environment
3. Implement core authentication system
4. Build patient dashboard (highest priority)
5. Implement basic scheduling
6. Add notification system
7. Test and iterate

## Success Metrics

- **Technical**: 70% scheduling efficiency improvement
- **User Experience**: 40% improvement in treatment adherence
- **Business**: 30% increase in appointment utilization
- **Performance**: <2 second page load times
- **Reliability**: 99.9% uptime

## Support and Documentation

- API Documentation: Generated with Swagger/OpenAPI
- User Manual: Step-by-step guides for each user role
- Developer Guide: Code standards and contribution guidelines
- Troubleshooting: Common issues and solutions

---

**Ready to build the future of Ayurvedic healthcare management!**