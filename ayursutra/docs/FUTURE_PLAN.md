# AyurSutra — Future Development Roadmap

> This document outlines the step-by-step plan to evolve AyurSutra from its current MVP into a production-grade, scalable healthcare platform.

---

## Phase 1: Production Hardening (1-2 weeks)

### 1.1 Complete Integration Tests
**Current state:** Zero tests exist. Jest + Supertest installed but unused.
- Write backend integration tests: auth flow (login → access protected route → logout → token invalid), CRUD for patients/appointments/treatments
- Write frontend component tests: Login form validation, BookAppointment multi-step flow, Dashboard data rendering
- Add test coverage targets: 80% backend, 60% frontend
- Run tests in CI on every push

### 1.2 Error Monitoring & Logging
**Current state:** `console.log` + `morgan` only. Winstein installed but unused.
- Replace console.log with Winston structured JSON logging
- Add request ID generation (UUID) per request → attach to all logs
- Log levels: error (DB failures, auth failures), warn (rate limit hits, validation failures), info (user actions: login, appointment created)
- Integrate Sentry or similar for production error tracking
- Add health check endpoint that also reports DB connection status, uptime, memory

### 1.3 Rate Limiting & Security Hardening
**Current state:** Basic rate limit on all `/api/` (100 req/15 min). No brute-force protection.
- Add strict rate limits: login (5 attempts/15 min/IP), register (3/hour/IP), forgot-password (3/hour/IP)
- Implement account lockout after 5 failed login attempts (15-min cooldown)
- Add CSRF token for all state-changing requests
- Audit all endpoints for role-based access — ensure patients can't hit practitioner endpoints

### 1.4 Email Service
**Current state:** Nodemailer installed but unused. Forgot password generates token but doesn't send email.
- Configure Nodemailer with SendGrid SMTP transport
- Templates for: welcome email, password reset, appointment confirmation, appointment reminder (24h before), treatment milestone
- Use environment-specific sender: `noreply@ayursutra.com` for prod, `dev@localhost` for dev

### 1.5 Database Optimization
**Current state:** Sequelize sync on every boot. No indexes beyond primary keys.
- Add Sequelize migrations instead of `sync({ alter: true })` — version-controlled schema changes
- Add database indexes: `users(email)`, `appointments(scheduled_date, practitioner_id)`, `patients(practitioner_id, status)`, `notifications(user_id, is_read)`
- Add pagination to all list endpoints (currently returns everything)
- Add query parameter support: sorting, date range filtering

---

## Phase 2: Core Feature Completion (2-4 weeks)

### 2.1 Real-time Notifications (WebSocket)
**Current state:** Polling-based (user refreshes to see new notifications). No push.
- Add Socket.io server to Express
- Events: `appointment:created`, `appointment:updated`, `treatment:milestone`, `notification:new`
- Client subscribes on login with JWT auth in handshake
- Notification badge updates in real-time without page refresh
- Practitioner sees live appointment status changes

### 2.2 SMS Reminders (Twilio)
**Current state:** Twilio installed but unused.
- Appointment reminder SMS: 24 hours, 2 hours before scheduled time
- Format: "Namaste [name], your [treatment] with [practitioner] is at [time] tomorrow. - AyurSutra"
- Treatment milestone SMS: "Congratulations! You've completed [X]% of your Panchakarma treatment."
- SMS opt-in/opt-out toggle in profile settings
- Queue-based sending for reliability (Redis-backed)

### 2.3 Advanced Practitioner Features
**Current state:** Basic CRUD + view-only dashboards.
- Treatment plan builder: drag-and-drop session scheduling, automated progress calculation
- Patient vitals tracking over time with trend visualization
- Bulk patient actions: send notification to all active patients, export filtered patient list
- Prescription management: Ayurvedic medicine catalog, dosage calculator based on constitution
- Patient risk scoring: flag patients with low compliance or worsening symptoms

### 2.4 Advanced Patient Features
- Dietary recommendation engine based on constitution + current treatment phase
- Yoga/exercise recommendations per treatment type
- Daily wellness check-in: rate pain/stress/sleep → trended on dashboard
- Treatment journal: daily notes visible to practitioner
- Payment integration: Razorpay for session payments, treatment package subscriptions

---

## Phase 3: AI & Intelligence (4-8 weeks)

### 3.1 AI-Powered Scheduling Service
**Current state:** No AI functionality. Placeholder only in UI.
- Build Python FastAPI microservice (`/ai-service/`)
- ML model: predict optimal appointment slots based on:
  - Patient constitution (Vata/Pitta/Kapha affects best time of day)
  - Treatment type duration requirements
  - Practitioner specializations and historical workload
  - Patient treatment history and progress
  - Season/weather Ayurvedic considerations
- Output: ranked time slots with confidence scores and reasoning
- Integration: REST API call from Node.js backend → Python service → returns recommendations
- Containerization: Docker for the AI service, included in docker-compose

### 3.2 Treatment Outcome Prediction
- Train model on historical treatment data: what constitution + treatment + session count → what outcome
- Predict: estimated sessions needed, probability of improvement for specific symptoms
- Display on practitioner's patient detail view: "Based on similar cases, this patient is likely to need 18-22 sessions with 85% probability of significant pain reduction"

### 3.3 Patient Churn Prediction
- Identify patients at risk of dropping out (missed appointments, declining progress scores)
- Auto-alert practitioner: "Rajesh has missed 2 sessions and progress dropped 15%. Schedule a check-in."
- Automated re-engagement: send personalized message offering to reschedule

### 3.4 Natural Language Treatment Notes
- Speech-to-text for practitioner session notes
- NLP to extract structured data: symptoms mentioned, medications discussed, recommendations given
- Auto-populate patient records from voice notes

---

## Phase 4: Scale & Infrastructure (4-8 weeks)

### 4.1 AWS Deployment Architecture
**Current state:** Vercel + Supabase works for MVP. Needs AWS for scale.
- **ECS Fargate** or **EKS** for containerized backend (Docker images already built)
- **RDS PostgreSQL** with Multi-AZ for production database (migrate from Supabase)
- **ElastiCache Redis** for session store, rate limiting, and analytics cache
- **S3 + CloudFront** for frontend static hosting and uploaded documents (patient reports, profile pictures)
- **Route 53** for DNS, **ACM** for SSL certificates
- **Secrets Manager** for all API keys, DB passwords, JWT secrets
- **CloudWatch** for centralized logging and alerting
- Architecture diagram:

```
                    Route 53
                        |
                   CloudFront CDN
                   /           \
           S3 (React app)    ALB (API Gateway)
                                  |
                     ECS Fargate / EKS (Node.js)
                     /          |           \
             RDS PostgreSQL   ElastiCache   AI Service (ECS)
```

### 4.2 CI/CD Pipeline
- **GitHub Actions** workflow:
  - On PR: lint → typecheck → unit tests → integration tests
  - On merge to main: build Docker image → push to ECR → deploy to ECS
  - Database migrations run as part of deploy step
- **Preview environments:** Each PR gets a temporary Vercel/ECS deployment with seeded DB

### 4.3 Database Scaling
- Read replicas for analytics queries (reports, dashboards)
- Connection pooling with PgBouncer
- Partition `appointments` and `notifications` tables by month for query performance
- Archive old data (>2 years) to data warehouse for long-term analytics

### 4.4 Monitoring & Observability
- Prometheus + Grafana for infrastructure metrics (CPU, memory, request latency)
- Custom business metrics: bookings per day, active patients, treatment completion rate
- Uptime monitoring with alerts (PagerDuty/Slack)
- Distributed tracing with OpenTelemetry across Node.js + AI service

---

## Phase 5: Platform Expansion (8-16 weeks)

### 5.1 Mobile Application
- React Native app sharing the same API
- Native features: push notifications, biometric login, offline access to treatment plan
- Camera integration for: document upload, skin/hair analysis (future AI feature)

### 5.2 Multi-Clinic / Multi-Practitioner
- Clinic management: add multiple clinic locations, each with practitioners
- Admin dashboard: aggregate analytics across all clinics
- Patient transfers between clinics
- Role hierarchy: super admin → clinic admin → practitioner → patient

### 5.3 Telemedicine
- Video consultations via WebRTC or Twilio Video
- In-app chat between patient and practitioner
- Virtual waiting room with queue management
- Session recording and notes auto-attached to patient record

### 5.4 Integrations
- **Lab systems:** API integration with diagnostic labs — auto-import test results into patient records
- **Wearable devices:** Fitbit/Apple Health integration — sleep, heart rate, activity data fed into wellness scoring
- **Pharmacy:** E-prescriptions sent directly to partner Ayurvedic pharmacies
- **Insurance:** Claim processing integration for Ayurvedic treatments

### 5.5 Internationalization (i18n)
- Languages: Hindi, Kannada, Tamil, Malayalam, English
- Locale-aware content: treatment descriptions, dietary recommendations, seasonal advice
- RTL support for regional language scripts

---

## Phase 6: Advanced AI (12-24 weeks)

### 6.1 AI-Powered Diagnosis Assistant
- Symptom checker: patient enters symptoms → AI suggests possible Ayurvedic diagnoses
- Prakriti (constitution) analysis from questionnaire + voice/facial features
- Treatment recommendation engine: matches patient constitution + symptoms to treatment protocols

### 6.2 Computer Vision
- Tongue diagnosis image analysis (traditional Ayurvedic diagnostic method)
- Skin condition tracking over treatment course
- Posture analysis for yoga/exercise recommendations

### 6.3 Research & Analytics Platform
- Anonymized aggregate data for Ayurvedic research
- Treatment effectiveness studies across patient populations
- Publication-ready statistical reports

---

## Priority Matrix

| Priority | Feature | Impact | Effort | Phase |
|----------|---------|--------|--------|-------|
| 🔴 P0 | Tests + CI/CD | High | Medium | 1.1, 4.2 |
| 🔴 P0 | Email service (SendGrid) | High | Low | 1.4 |
| 🔴 P0 | DB indexes + pagination | High | Low | 1.5 |
| 🟡 P1 | Real-time notifications (Socket.io) | High | Medium | 2.1 |
| 🟡 P1 | Structured logging (Winston) | Medium | Low | 1.2 |
| 🟡 P1 | SMS reminders (Twilio) | High | Medium | 2.2 |
| 🟡 P1 | AWS deployment | High | High | 4.1 |
| 🟢 P2 | AI scheduling service | Medium | High | 3.1 |
| 🟢 P2 | Mobile app (React Native) | High | High | 5.1 |
| 🟢 P2 | Treatment outcome prediction | Medium | High | 3.2 |
| 🟢 P2 | Telemedicine | Medium | High | 5.3 |
| 🔵 P3 | Computer vision diagnosis | High | Very High | 6.2 |
| 🔵 P3 | Wearable integration | Medium | Medium | 5.4 |
| 🔵 P3 | Multi-clinic management | High | High | 5.2 |
