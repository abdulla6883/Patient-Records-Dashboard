import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.diagnosticItem.deleteMany();
  await prisma.diagnosisHistory.deleteMany();
  await prisma.patient.deleteMany();
  // We keep users or upsert them

  // Create a default user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@coalition.com' },
    update: {},
    create: {
      email: 'admin@coalition.com',
      password: hashedPassword,
    },
  });

  // Create initial patient (Jessica Taylor)
  const jessica = await prisma.patient.create({
    data: {
      name: 'Jessica Taylor',
      gender: 'Female',
      age: 28,
      profilePicture: '/jessica.png',
      dateOfBirth: 'August 23, 1996',
      phoneNumber: '(415) 555-1234',
      emergencyContact: '(415) 555-5678',
      insuranceType: 'Sunrise Health Assurance',
      diagnosisHistory: {
        create: [
          {
            month: 'March',
            year: 2024,
            systolicValue: 160,
            systolicLevel: 'Higher than Average',
            diastolicValue: 78,
            diastolicLevel: 'Lower than Average',
            heartRateValue: 78,
            heartRateLevel: 'Lower than Average',
            respiratoryValue: 20,
            respiratoryLevel: 'Normal',
            temperatureValue: 98.6,
            temperatureLevel: 'Normal',
          },
          {
            month: 'February',
            year: 2024,
            systolicValue: 150,
            systolicLevel: 'Higher than Average',
            diastolicValue: 70,
            diastolicLevel: 'Lower than Average',
            heartRateValue: 75,
            heartRateLevel: 'Normal',
            respiratoryValue: 18,
            respiratoryLevel: 'Normal',
            temperatureValue: 98.2,
            temperatureLevel: 'Normal',
          },
        ],
      },
      diagnosticList: {
        create: [
          {
            name: 'Hypertension',
            description: 'Chronic high blood pressure',
            status: 'Under Observation',
          },
          {
            name: 'Type 2 Diabetes',
            description: 'Insulin resistance and high blood sugar',
            status: 'Cured',
          },
        ],
      },
      labResults: {
        create: [
          { name: 'Blood Test' },
          { name: 'CT Scan' },
          { name: 'Radiology Reports' },
        ],
      },
    },
  });

  // Add Transactions
  await prisma.transaction.createMany({
    data: [
      { invoiceId: '#INV-00124', patient: 'Emily Williams', service: 'Full Body Checkup', date: 'Mar 24, 2024', amount: '$450.00', status: 'Paid', method: 'Visa •••• 4242' },
      { invoiceId: '#INV-00125', patient: 'Ryan Johnson', service: 'Dental Consultation', date: 'Mar 22, 2024', amount: '$120.00', status: 'Pending', method: 'Mastercard •••• 8888' },
      { invoiceId: '#INV-00126', patient: 'Jessica Taylor', service: 'Blood Lab Tests', date: 'Mar 18, 2024', amount: '$280.00', status: 'Paid', method: 'PayPal' },
      { invoiceId: '#INV-00127', patient: 'Brandon Mitchell', service: 'Physiotherapy', date: 'Mar 15, 2024', amount: '$95.00', status: 'Refunded', method: 'Visa •••• 1111' },
    ]
  });

  // Add Messages
  await prisma.message.createMany({
    data: [
      { sender: 'Emily Williams', receiver: 'Dr. Jose Simmons', content: "Hello Dr. Simmons, I wanted to follow up on my recent prescription.", time: '12:30 PM', isMe: false },
      { sender: 'Dr. Jose Simmons', receiver: 'Emily Williams', content: "That's wonderful to hear, Emily! Any side effects?", time: '12:35 PM', isMe: true },
    ]
  });

  // Add Appointments
  await prisma.appointment.createMany({
    data: [
      { patient: 'Jessica Taylor', service: 'Monthly Checkup', date: 'Apr 02, 2024', time: '10:00 AM', status: 'Upcoming' },
      { patient: 'Emily Williams', service: 'Consultation', date: 'Apr 05, 2024', time: '02:30 PM', status: 'Upcoming' },
    ]
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
