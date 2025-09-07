# AyurSutra - Panchakarma Management System

<div align="center">
  <img src="https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=AyurSutra" alt="AyurSutra Logo" width="200" height="200">
  
  **Comprehensive Panchakarma patient management and therapy scheduling software for Ayurvedic healthcare centers**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
  [![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ayursutra/panchakarma-system)
</div>

## 🌟 Overview

AyurSutra is a modern, comprehensive digital platform designed specifically for Ayurvedic healthcare centers offering Panchakarma treatments. It streamlines patient management, appointment scheduling, treatment planning, and provides AI-powered insights to enhance therapeutic outcomes.

### ✨ Key Features

- **🏥 Patient Management**: Complete patient lifecycle management with medical history tracking
- **📅 Smart Scheduling**: AI-powered appointment scheduling with optimal time slot recommendations
- **💊 Treatment Planning**: Comprehensive Panchakarma treatment protocols and progress tracking
- **🧠 AI Insights**: Data-driven treatment recommendations and patient outcome predictions
- **📊 Analytics Dashboard**: Practice performance metrics and business intelligence
- **🔔 Notifications**: Multi-channel notifications (SMS, Email, In-app)
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18.2.0 with modern hooks
- Tailwind CSS for responsive design
- Recharts for data visualization
- Lucide React for icons
- Axios for API communication

**Backend:**
- Node.js with Express.js framework
- PostgreSQL database with Sequelize ORM
- Redis for caching and session management
- JWT for authentication
- Winston for logging

**AI Service:**
- Python-based microservice
- Machine learning algorithms for scheduling optimization
- Treatment outcome prediction models

**Infrastructure:**
- Docker containerization
- Kubernetes orchestration
- Nginx reverse proxy
- CI/CD with automated deployments

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- PostgreSQL (>= 13)
- Redis (>= 6.0)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayursutra/panchakarma-system.git
   cd panchakarma-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   cd ..
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

## 📖 Documentation

### Quick Links
- [API Documentation](./docs/api.md)
- [Frontend Guide](./docs/frontend.md)
- [Backend Guide](./docs/backend.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### User Guides
- [Patient Dashboard Guide](./patient-dashboard-guide.md)
- [Practitioner Dashboard Guide](./practitioner-dashboard-guide.md)
- [AI Scheduling System](./ai-scheduling-system-guide.md)
- [Notification System](./notification-system-guide.md)

## 🎯 User Roles

### 👤 Patients
- View treatment progress and milestones
- Book and manage appointments
- Access treatment history
- Receive notifications and reminders
- Update personal information

### 👨‍⚕️ Practitioners
- Manage patient records and treatments
- Create and monitor treatment plans
- View AI-powered insights and recommendations
- Access comprehensive analytics
- Schedule and manage appointments

### 👑 Administrators
- System configuration and management
- User role management
- Practice-wide analytics and reporting
- System monitoring and maintenance

## 🔧 Development

### Project Structure
```
ayursutra/
├── backend/                 # Node.js backend API
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── routes/             # API routes
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── context/        # React context
├── ai-service/             # Python AI microservice
├── kubernetes/             # K8s deployment configs
├── nginx/                  # Nginx configuration
└── scripts/                # Deployment scripts
```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server           # Start backend only
npm run client           # Start frontend only

# Building
npm run build            # Build frontend for production
npm run test             # Run all tests
npm run lint             # Run linting

# Deployment
./scripts/deploy.sh docker    # Deploy with Docker
./scripts/deploy.sh k8s       # Deploy to Kubernetes
./scripts/deploy.sh heroku    # Deploy to Heroku
./scripts/deploy.sh vercel    # Deploy to Vercel
```

## 🚀 Deployment

### Docker Deployment
```bash
# Using Docker Compose
docker-compose up -d

# Using deployment script
./scripts/deploy.sh docker
```

### Kubernetes Deployment
```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Or use deployment script
./scripts/deploy.sh k8s
```

### Cloud Platforms
- **Heroku**: `./scripts/deploy.sh heroku`
- **Netlify**: `./scripts/deploy.sh netlify` (frontend only)
- **Vercel**: `./scripts/deploy.sh vercel` (frontend only)

## 📁 Vercel Deployment

### Prerequisites
- [Vercel Account](https://vercel.com) (free)
- [GitHub Account](https://github.com) (free)

### Step-by-Step Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect the configuration

3. **Environment Variables**
Set these in Vercel Dashboard → Project → Settings → Environment Variables:
```
NODE_ENV=production
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
```

### Future Database Setup (PostgreSQL)

When ready to add PostgreSQL:

1. **Add Vercel Postgres**
- In Vercel Dashboard → Storage → Create Database
- Choose PostgreSQL
- Copy connection string to `DATABASE_URL`

2. **Update Backend for Production**
- Database migrations will run automatically
- API routes are already configured for Vercel

## 🔒 Security

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement
- SQL injection prevention
- XSS protection headers

## 📊 Monitoring & Analytics

### Health Checks
- `/api/health` - Backend health status
- `/health` - Nginx health check
- Kubernetes liveness and readiness probes

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking and alerting
- Performance monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📧 Email: support@ayursutra.com
- 💬 Discord: [AyurSutra Community](https://discord.gg/ayursutra)
- 📖 Documentation: [docs.ayursutra.com](https://docs.ayursutra.com)
- 🐛 Issues: [GitHub Issues](https://github.com/ayursutra/panchakarma-system/issues)

### FAQ

**Q: Can I use AyurSutra for other types of healthcare practices?**
A: While designed for Ayurvedic Panchakarma treatments, the system can be adapted for other healthcare practices with customization.

**Q: Is patient data secure?**
A: Yes, we implement industry-standard security practices including encryption, secure authentication, and compliance with healthcare data protection regulations.

**Q: Can I integrate with existing systems?**
A: AyurSutra provides REST APIs that can be integrated with existing healthcare management systems.

## 🙏 Acknowledgments

- Built with ❤️ for the Ayurvedic healthcare community
- Special thanks to all contributors and beta testers
- Inspired by traditional Ayurvedic wisdom and modern technology

---

<div align="center">
  <p>Made with ❤️ by the AyurSutra Team</p>
  <p>
    <a href="https://ayursutra.com">Website</a> •
    <a href="https://docs.ayursutra.com">Documentation</a> •
    <a href="https://github.com/ayursutra/panchakarma-system">GitHub</a>
  </p>
</div>
