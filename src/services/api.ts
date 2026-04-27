import axios from 'axios';
import { Patient } from '@/types';

const API_BASE_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const AUTH_TOKEN = 'Basic Y29hbGl0aW9uOnNraWxscy10ZXN0'; // coalition:skills-test

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await axios.get('/api/patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const createPatient = async (data: any): Promise<any> => {
  try {
    const response = await axios.post('/api/patients', data);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, data: any): Promise<any> => {
  try {
    const response = await axios.patch(`/api/patients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/patients/${id}`);
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

export const api = {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient
};
