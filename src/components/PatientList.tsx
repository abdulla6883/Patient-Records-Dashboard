"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, MoreVertical, Plus, Trash2, Users, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  profilePicture?: string;
  profile_picture?: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get('id');

  const fetchPatients = async () => {
    try {
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
    fetchPatients();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to delete');
      }
      setPatients(prev => prev.filter(p => p.id !== id));
      if (selectedPatientId === id) {
        onSelectPatient(null);
        router.push('/', { scroll: false });
      }
    } catch (err: any) {
      console.error("Delete request failed:", err);
      alert(`Failed to delete patient: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-[#072635]">Patients</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAddModal}
              className="w-10 h-10 flex items-center justify-center bg-[#01F0D0] rounded-full text-[#072635] shadow-sm hover:shadow-[#01F0D0]/40"
              title="Add New Patient"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
            <button
              onClick={() => setIsSearching(!isSearching)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isSearching ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Search size={20} className="text-[#072635]" />
            </button>
          </div>
        </div>

        {isSearching && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#F6F7F8] border-none rounded-xl focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all text-sm"
              autoFocus
            />
          </div>
        )}
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
              <div
                key={patient.id}
                onClick={() => handlePatientClick(patient)}
                className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all border-b border-[#F6F7F8] group ${
                  selectedPatientId === patient.id ? 'bg-[#D8FCF7]' : 'hover:bg-gray-50'
                }`}
              >
                {selectedPatientId === patient.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#01F0D0]" />
                )}
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#01F0D0]/20 transition-all">
                    <Image
                      src={patient.profile_picture || patient.profilePicture || '/default-patient.png'}
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
                <div className="flex items-center space-x-2 opacity-0 lg:opacity-100 lg:group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => handleDelete(e, patient.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Record"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                  <MoreVertical size={18} className="text-[#072635]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;