const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@coalition.com' },
    update: {},
    create: {
      email: 'admin@coalition.com',
      password: hashedPassword,
    },
  });

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
        ],
      },
      diagnosticList: {
        create: [
          {
            name: 'Hypertension',
            description: 'Chronic high blood pressure',
            status: 'Under Observation',
          },
        ],
      },
      labResults: {
        create: [{ name: 'Blood Test' }],
      },
    },
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
