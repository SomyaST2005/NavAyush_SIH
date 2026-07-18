require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), override: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime(), environment: process.env.NODE_ENV || 'development' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authenticate, require('./routes/users'));
app.use('/api/patients', authenticate, require('./routes/patients'));
app.use('/api/appointments', authenticate, require('./routes/appointments'));
app.use('/api/treatments', authenticate, require('./routes/treatments'));
app.use('/api/notifications', authenticate, require('./routes/notifications'));
app.use('/api/analytics', authenticate, require('./routes/analytics'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
});

app.use('*', (req, res) => { res.status(404).json({ message: 'Route not found' }); });

async function startServer() {
  await connectDB();

  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('No users found. Running seeder...');
    const seedDatabase = require('./seed');
    await seedDatabase();
  }

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`AyurSutra Backend Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

startServer();

module.exports = app;
