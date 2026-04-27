"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Plus, Trash2, UserPlus, Users, Heart, Activity, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  profilePicture: string;
}

const PatientList = ({ onSelectPatient, selectedPatientId, onOpenAddModal }: { 
  onSelectPatient: (patient: any) => void,
  selectedPatientId?: string,
  onOpenAddModal: () => void
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get('id');

  const fetchPatients = async () => {
    try {
      console.log("Fetching patients from /api/patients...");
      const res = await fetch('/api/patients', { cache: 'no-store' });
      
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        setPatients([]);
        return;
      }
      
      const data = await res.json();

      if (Array.isArray(data)) {
        setPatients(data);
        
        // Handle initial selection
        if (data.length > 0) {
          const patientToSelect = urlPatientId 
            ? data.find((p: any) => p.id === urlPatientId) || data[0]
            : data[0];
          
          if (patientToSelect && (!selectedPatientId || selectedPatientId !== patientToSelect.id)) {
            onSelectPatient(patientToSelect);
          }
        }
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient: any) => {
    onSelectPatient(patient);
    router.push(`/?id=${patient.id}`, { scroll: false });
  };

  useEffect(() => {
    setHasMounted(true);
    fetchPatients();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;

    try {
      console.log(`[UI] Deleting patient ${id}...`);
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to delete');
      }
      
      console.log("[UI] Delete successful");
      setPatients(prev => prev.filter(p => p.id !== id));
      
      if (selectedPatientId === id) {
        onSelectPatient(null);
        router.push('/', { scroll: false });
      }
      
    } catch (err: any) {
      console.error("[UI] Delete request failed:", err);
      alert(`Failed to delete patient: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };

  const handleAddPatient = async (payload: any) => {
    try {
      console.log(`Adding patient ${payload.name}...`);
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          profilePicture: '/default-patient.png',
          dateOfBirth: 'January 1, 1996',
          phoneNumber: '(555) 012-3456',
          emergencyContact: '(555) 987-6543',
          insuranceType: 'Standard Health',
        }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (res.ok) {
        const newPatient = await res.json();
        console.log("Patient added:", newPatient);
        fetchPatients();
        onSelectPatient(newPatient);
      } else {
        const errData = await res.json();
        alert(`Failed to add patient: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Add request failed:", err);
      alert("Network error while adding patient.");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-[#F6F7F8]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-[#072635]">Patients</h2>
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenAddModal} 
              className="w-10 h-10 flex items-center justify-center bg-[#01F0D0] rounded-full transition-all text-[#072635] shadow-sm hover:shadow-[#01F0D0]/40"
              title="Add New Patient"
            >
              <Plus size={20} strokeWidth={3} />
            </motion.button>
            <button 
              onClick={() => setIsSearching(!isSearching)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isSearching ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Search size={20} className="text-[#072635]" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isSearching && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-2 overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-[#F6F7F8] border-none rounded-xl focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all text-sm"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-10 flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#01F0D0] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-[#707070]">Fetching records...</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <Users size={32} />
            </div>
            <p className="text-[#707070] text-sm px-4">
              {searchQuery ? `No patients found matching "${searchQuery}"` : "No patient records available."}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            {filteredPatients.map((patient) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={patient.id}
                onClick={() => handlePatientClick(patient)}
                className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all border-b border-[#F6F7F8] group relative ${
                  selectedPatientId === patient.id ? 'bg-[#D8FCF7]' : 'hover:bg-gray-50'
                }`}
              >
                {selectedPatientId === patient.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#01F0D0]"
                  />
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#01F0D0]/20 transition-all">
                    <Image
                      src={patient.profilePicture || '/default-patient.png'}
                      alt={patient.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[#072635]">{patient.name}</span>
                    <span className="text-xs text-[#707070] font-medium">{patient.gender}, {patient.age}</span>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 transition-all duration-300 ${patient.id === selectedPatientId ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100'}`}>
                  <button 
                    onClick={(e) => handleDelete(e, patient.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors z-30"
                    title="Delete Record"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                  <MoreVertical size={18} className="text-[#072635]" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PatientList;
