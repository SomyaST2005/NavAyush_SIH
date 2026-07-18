const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Treatment = require('./models/Treatment');
const Notification = require('./models/Notification');

async function seedDatabase() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('password123', 12);

  const [practitioner, patient1, patient2] = await Promise.all([
    User.create({ fullName: 'Dr. Ayurveda Sharma', email: 'doctor@ayursutra.com', passwordHash, phone: '+91 99999 11111', role: 'practitioner' }),
    User.create({ fullName: 'Rajesh Kumar', email: 'patient@ayursutra.com', passwordHash, phone: '+91 98765 43210', role: 'patient' }),
    User.create({ fullName: 'Priya Sharma', email: 'priya@ayursutra.com', passwordHash, phone: '+91 87654 32109', role: 'patient' }),
  ]);

  const [p1, p2, p3, p4, p5] = await Promise.all([
    Patient.create({ patientId: 'P001', user: patient1._id, practitioner: practitioner._id, name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', constitution: 'Vata-Pitta', currentCondition: 'Chronic joint pain, insomnia', status: 'Active' }),
    Patient.create({ patientId: 'P002', user: patient2._id, practitioner: practitioner._id, name: 'Priya Sharma', age: 32, gender: 'Female', phone: '+91 87654 32109', email: 'priya.sharma@email.com', constitution: 'Pitta-Kapha', currentCondition: 'Stress, anxiety, muscle tension', status: 'Active' }),
    Patient.create({ patientId: 'P003', practitioner: practitioner._id, name: 'Amit Patel', age: 38, gender: 'Male', phone: '+91 76543 21098', email: 'amit.patel@email.com', constitution: 'Kapha-Vata', currentCondition: 'Chronic headaches, mental fatigue', status: 'Active' }),
    Patient.create({ patientId: 'P004', practitioner: practitioner._id, name: 'Sunita Gupta', age: 42, gender: 'Female', phone: '+91 65432 10987', email: 'sunita.g@email.com', constitution: 'Vata-Kapha', currentCondition: 'Digestive issues, fatigue', status: 'Active' }),
    Patient.create({ patientId: 'P005', practitioner: practitioner._id, name: 'Vikram Singh', age: 48, gender: 'Male', phone: '+91 54321 09876', email: 'vikram.s@email.com', constitution: 'Pitta', currentCondition: 'Hypertension, stress', status: 'Active' }),
  ]);

  await Promise.all([
    Treatment.create({ patient: p1._id, type: 'Panchakarma', startDate: new Date('2024-01-15'), endDate: new Date('2024-02-15'), status: 'Active', totalSessions: 21, completedSessions: 14 }),
    Treatment.create({ patient: p2._id, type: 'Abhyanga', startDate: new Date('2024-01-10'), endDate: new Date('2024-01-31'), status: 'Active', totalSessions: 12, completedSessions: 9 }),
    Treatment.create({ patient: p3._id, type: 'Shirodhara', startDate: new Date('2024-01-20'), endDate: new Date('2024-02-10'), status: 'Active', totalSessions: 8, completedSessions: 2 }),
    Treatment.create({ patient: p4._id, type: 'Swedana', startDate: new Date('2024-01-18'), endDate: new Date('2024-02-05'), status: 'Active', totalSessions: 10, completedSessions: 5 }),
    Treatment.create({ patient: p5._id, type: 'Panchakarma', startDate: new Date('2024-01-05'), endDate: new Date('2024-02-05'), status: 'Active', totalSessions: 21, completedSessions: 17 }),
  ]);

  await Promise.all([
    Appointment.create({ patient: p1._id, practitioner: practitioner._id, scheduledDate: new Date('2024-01-22'), scheduledTime: '10:00:00', duration: 60, treatmentType: 'Abhyanga', status: 'scheduled', location: 'Room 101' }),
    Appointment.create({ patient: p2._id, practitioner: practitioner._id, scheduledDate: new Date('2024-01-22'), scheduledTime: '11:30:00', duration: 45, treatmentType: 'Consultation', status: 'scheduled', location: 'Room 102' }),
    Appointment.create({ patient: p3._id, practitioner: practitioner._id, scheduledDate: new Date('2024-01-23'), scheduledTime: '09:00:00', duration: 90, treatmentType: 'Shirodhara', status: 'scheduled', location: 'Room 203' }),
    Appointment.create({ patient: p1._id, practitioner: practitioner._id, scheduledDate: new Date('2024-01-15'), scheduledTime: '10:00:00', duration: 60, treatmentType: 'Abhyanga', status: 'completed', location: 'Room 101' }),
    Appointment.create({ patient: p2._id, practitioner: practitioner._id, scheduledDate: new Date('2024-01-18'), scheduledTime: '14:00:00', duration: 45, treatmentType: 'Consultation', status: 'completed', location: 'Room 102' }),
  ]);

  await Promise.all([
    Notification.create({ user: patient1._id, type: 'appointment', title: 'Appointment Reminder', message: 'Your Abhyanga session is tomorrow at 10:00 AM', isRead: false }),
    Notification.create({ user: patient2._id, type: 'treatment', title: 'Milestone Achieved', message: 'You completed 75% of your Abhyanga treatment!', isRead: false }),
    Notification.create({ user: practitioner._id, type: 'alert', title: 'New Patient', message: 'Amit Patel registered as a new patient', isRead: true }),
  ]);

  console.log('Database seeded successfully!');
  console.log('Demo: doctor@ayursutra.com / password123 | patient@ayursutra.com / password123');
}

module.exports = seedDatabase;

if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), override: true });
  const connectDB = require('./config/database');
  connectDB().then(() => seedDatabase().then(() => { console.log('Done.'); process.exit(0); }));
}
