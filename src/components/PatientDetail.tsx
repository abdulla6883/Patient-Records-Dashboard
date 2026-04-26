"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Download, 
  User, 
  Users, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface PatientDetailProps {
  patient: any;
}

const PatientDetail = ({ patient }: PatientDetailProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col space-y-8"
    >
      {/* Profile Section */}
      <div className="card p-4 lg:p-8 flex flex-col items-center bg-white rounded-3xl shadow-sm border border-[#F6F7F8]">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative w-[120px] h-[120px] xl:w-[160px] xl:h-[160px] mb-4 lg:mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#01F0D0]/10"
        >
          <Image 
            src={patient.profile_picture || '/default-patient.png'} 
            alt={patient.name} 
            fill
            sizes="(max-width: 1024px) 100px, 200px"
            priority
            className="object-cover"
          />
        </motion.div>
        <h2 className="text-lg lg:text-2xl font-extrabold text-[#072635] mb-4 lg:mb-8 text-center">{patient.name}</h2>
        
        <div className="w-full space-y-6">
          <InfoRow 
            icon={<Calendar className="text-[#072635]" size={20} />} 
            label="Date Of Birth" 
            value={patient.date_of_birth} 
          />
          <InfoRow 
            icon={<User className="text-[#072635]" size={20} />} 
            label="Gender" 
            value={patient.gender} 
          />
          <InfoRow 
            icon={<Phone className="text-[#072635]" size={20} />} 
            label="Contact Info." 
            value={patient.phone_number} 
          />
          <InfoRow 
            icon={<Users className="text-[#072635]" size={20} />} 
            label="Emergency Contacts" 
            value={patient.emergency_contact} 
          />
          <InfoRow 
            icon={<ShieldCheck className="text-[#072635]" size={20} />} 
            label="Insurance Provider" 
            value={patient.insurance_type} 
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 w-full bg-[#01F0D0] text-[#072635] font-extrabold py-4 px-10 rounded-full shadow-sm hover:shadow-[#01F0D0]/40 transition-all"
        >
          Show All Information
        </motion.button>
      </div>

      {/* Lab Results Section */}
      <div className="card p-6 bg-white rounded-3xl shadow-sm border border-[#F6F7F8]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-[#072635]">Lab Results</h3>
          <ClipboardList size={24} className="text-[#707070] opacity-50" />
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {patient.lab_results && patient.lab_results.length > 0 ? (
            patient.lab_results.map((result: string, index: number) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-[#F6F7F8] rounded-xl transition-all cursor-pointer group"
              >
                <span className="text-sm font-bold text-[#072635]">{result}</span>
                <div className="flex items-center space-x-2 text-[#072635]">
                  <Download size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ChevronRight size={18} className="text-[#707070] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-10 text-center text-[#707070] text-sm italic">No lab results on file</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center space-x-4 group">
    <div className="w-11 h-11 rounded-full bg-[#F6F7F8] flex items-center justify-center group-hover:bg-[#01F0D0]/10 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-[#707070] font-medium">{label}</span>
      <span className="text-sm font-extrabold text-[#072635]">{value || 'N/A'}</span>
    </div>
  </div>
);

export default PatientDetail;
