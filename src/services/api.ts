import axios from 'axios';
import { Patient } from '@/types';

const API_BASE_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const AUTH_TOKEN = 'Basic Y29hbGl0aW9uOnNraWxscy10ZXN0'; // coalition:skills-test

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getJessicaTaylor = async (): Promise<Patient | null> => {
  const patients = await getPatients();
  return patients.find(p => p.name === 'Jessica Taylor') || null;
};
