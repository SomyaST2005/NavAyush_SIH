# AyurSutra - Panchakarma Management System

A comprehensive Ayurvedic healthcare management platform with AI-powered scheduling and patient tracking.

![AyurSutra](https://img.shields.io/badge/AyurSutra-Panchakarma%20System-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🌟 Features

- **Patient Dashboard** - Progress tracking, appointment booking, treatment history
- **Practitioner Interface** - Patient management, AI insights, treatment planning
- **AI Scheduling** - Intelligent appointment optimization (coming soon)
- **Role-based Authentication** - Secure JWT-based access control
- **Responsive Design** - Modern UI with Tailwind CSS
- **Real-time Analytics** - Treatment effectiveness and progress metrics

## 🚀 Live Demo

🔗 **[View Live Application](https://ayursutra-panchakarma-system.vercel.app)**

## 📁 Project Structure

```
ayursutra/
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── contexts/      # React contexts
├── backend/           # Node.js/Express API
│   ├── routes/        # API endpoints
│   ├── middleware/    # Authentication & validation
│   └── models/        # Database models
├── ai-service/        # Python AI scheduling (future)
├── kubernetes/        # K8s deployment manifests
└── docs/             # Documentation
```

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Recharts
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL (production), Mock data (development)
- **Deployment**: Vercel
- **Future**: AI Service (Python), Kubernetes scaling

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Git

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/SomyaST2005/ayursutra-panchakarma-system.git
cd ayursutra-panchakarma-system
```

2. **Install Dependencies**
```bash
npm run install-deps
```

3. **Start Development Servers**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Deployment

### Vercel (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects configuration

3. **Set Environment Variables**
```env
NODE_ENV=production
REACT_APP_API_URL=https://your-app.vercel.app
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-secret-key
```

### Future Database Setup

When ready for PostgreSQL:
- Add Vercel Postgres from dashboard
- Update `DATABASE_URL` environment variable
- Database migrations run automatically

## 🎯 Demo Credentials

**Patient Account:**
- Email: `patient@ayursutra.com`
- Password: `password123`

**Practitioner Account:**
- Email: `doctor@ayursutra.com`
- Password: `password123`

## 📊 Key Components

### Patient Features
- **Dashboard**: Treatment progress, upcoming appointments
- **Booking**: AI-optimized appointment scheduling
- **History**: Complete treatment records and feedback
- **Progress**: Visual analytics and milestone tracking

### Practitioner Features
- **Patient Management**: Comprehensive patient records
- **Treatment Planning**: Session scheduling and progress monitoring
- **AI Insights**: Treatment effectiveness analytics
- **Calendar**: Appointment management and availability

## 🔮 Roadmap

- [ ] **Phase 1**: Core functionality (✅ Complete)
- [ ] **Phase 2**: PostgreSQL integration
- [ ] **Phase 3**: AI scheduling algorithms
- [ ] **Phase 4**: Mobile app development
- [ ] **Phase 5**: Multi-center management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](ayursutra/LICENSE) file for details.

## 📞 Support

- **Documentation**: [Full Documentation](ayursutra/docs/)
- **Issues**: [GitHub Issues](https://github.com/SomyaST2005/ayursutra-panchakarma-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SomyaST2005/ayursutra-panchakarma-system/discussions)

## 🙏 Acknowledgments

- Built for holistic wellness and Ayurvedic healthcare
- Inspired by traditional Panchakarma practices
- Modern technology meets ancient wisdom

---

**Made with ❤️ for holistic wellness** | **© 2025 AyurSutra**
