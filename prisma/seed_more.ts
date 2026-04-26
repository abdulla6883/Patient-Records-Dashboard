import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patients = [
    {
      name: 'Michael Johnson',
      gender: 'Male',
      age: 45,
      profilePicture: '/Michael.png',
      dateOfBirth: 'May 12, 1979',
      phoneNumber: '(555) 123-4567',
      emergencyContact: '(555) 765-4321',
      insuranceType: 'Blue Cross Blue Shield',
      diagnosisHistory: [
        {
          month: 'March',
          year: 2024,
          systolicValue: 140,
          systolicLevel: 'Normal',
          diastolicValue: 90,
          diastolicLevel: 'Normal',
          heartRateValue: 72,
          heartRateLevel: 'Normal',
          respiratoryValue: 16,
          respiratoryLevel: 'Normal',
          temperatureValue: 98.6,
          temperatureLevel: 'Normal',
        }
      ],
      diagnosticList: [
        { name: 'Hypertension', description: 'High blood pressure', status: 'Active' }
      ],
      labResults: [{ name: 'Lipid Panel' }, { name: 'EKG' }]
    },
    {
      name: 'Samantha Reed',
      gender: 'Female',
      age: 32,
      profilePicture: '/Samantha.png',
      dateOfBirth: 'October 5, 1991',
      phoneNumber: '(555) 234-5678',
      emergencyContact: '(555) 876-5432',
      insuranceType: 'Aetna',
      diagnosisHistory: [
        {
          month: 'March',
          year: 2024,
          systolicValue: 120,
          systolicLevel: 'Normal',
          diastolicValue: 80,
          diastolicLevel: 'Normal',
          heartRateValue: 68,
          heartRateLevel: 'Normal',
          respiratoryValue: 14,
          respiratoryLevel: 'Normal',
          temperatureValue: 98.4,
          temperatureLevel: 'Normal',
        }
      ],
      diagnosticList: [
        { name: 'Allergic Rhinitis', description: 'Seasonal allergies', status: 'Chronic' }
      ],
      labResults: [{ name: 'Allergy Panel' }]
    },
    {
      name: 'David Smith',
      gender: 'Male',
      age: 60,
      profilePicture: '/David.png',
      dateOfBirth: 'January 15, 1964',
      phoneNumber: '(555) 345-6789',
      emergencyContact: '(555) 987-6543',
      insuranceType: 'Medicare',
      diagnosisHistory: [
        {
          month: 'March',
          year: 2024,
          systolicValue: 135,
          systolicLevel: 'Higher than Average',
          diastolicValue: 85,
          diastolicLevel: 'Normal',
          heartRateValue: 80,
          heartRateLevel: 'Higher than Average',
          respiratoryValue: 22,
          respiratoryLevel: 'Higher than Average',
          temperatureValue: 99.1,
          temperatureLevel: 'Normal',
        }
      ],
      diagnosticList: [
        { name: 'Coronary Artery Disease', description: 'Narrowing of heart arteries', status: 'Critical' }
      ],
      labResults: [{ name: 'Cardiac Stress Test' }, { name: 'Echocardiogram' }]
    }
  ];

  for (const p of patients) {
    await prisma.patient.create({
      data: {
        name: p.name,
        gender: p.gender,
        age: p.age,
        profilePicture: p.profilePicture,
        dateOfBirth: p.dateOfBirth,
        phoneNumber: p.phoneNumber,
        emergencyContact: p.emergencyContact,
        insuranceType: p.insuranceType,
        diagnosisHistory: {
          create: p.diagnosisHistory
        },
        diagnosticList: {
          create: p.diagnosticList
        },
        labResults: {
          create: p.labResults
        }
      }
    });
  }

  console.log('Extra patients seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
