"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Download, 
  User, 
  Users, 
  ChevronRight,
  ClipboardList,
  Camera,
  Loader2,
  CheckCircle2,
  Check,
  X,
  Plus,
  Save,
  Activity,
  Trash2
} from 'lucide-react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

interface PatientDetailProps {
  patient: any;
}

const FEMALE_AVATARS = ['/jessica.png', '/samantha.png', '/emily.png', '/ashley.png', '/olivia.png'];
const MALE_AVATARS = ['/brandon.png', '/mike.png', '/nathan.png', '/ryan.png', '/tyler.png', '/dylan.png', '/kevin.png'];

const PatientDetail = ({ patient }: PatientDetailProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: patient.name,
    gender: patient.gender,
    age: patient.age,
    date_of_birth: patient.date_of_birth,
    phone_number: patient.phone_number,
    emergency_contact: patient.emergency_contact,
    insurance_type: patient.insurance_type,
    // Clinical Data - use mapped structure
    systolic: patient.diagnosis_history?.[0]?.blood_pressure?.systolic?.value || 120,
    diastolic: patient.diagnosis_history?.[0]?.blood_pressure?.diastolic?.value || 80,
    heartRate: patient.diagnosis_history?.[0]?.heart_rate?.value || 72,
    respiratoryRate: patient.diagnosis_history?.[0]?.respiratory_rate?.value || 16,
    temperature: patient.diagnosis_history?.[0]?.temperature?.value || 98.6,
    diagnosis: patient.diagnostic_list?.[0]?.name || 'Healthy',
    labResults: patient.lab_results || [],
    diagnosticList: patient.diagnostic_list || []
  });

  // Reset state ONLY when the patient ID changes to avoid losing unsaved edits on parent re-renders
  React.useEffect(() => {
    setEditData({
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      date_of_birth: patient.date_of_birth,
      phone_number: patient.phone_number,
      emergency_contact: patient.emergency_contact,
      insurance_type: patient.insurance_type,
      systolic: patient.diagnosis_history?.[0]?.blood_pressure?.systolic?.value || 120,
      diastolic: patient.diagnosis_history?.[0]?.blood_pressure?.diastolic?.value || 80,
      heartRate: patient.diagnosis_history?.[0]?.heart_rate?.value || 72,
      respiratoryRate: patient.diagnosis_history?.[0]?.respiratory_rate?.value || 16,
      temperature: patient.diagnosis_history?.[0]?.temperature?.value || 98.6,
      diagnosis: patient.diagnostic_list?.[0]?.name || 'Healthy',
      labResults: patient.lab_results || [],
      diagnosticList: patient.diagnostic_list || []
    });
    setIsEditing(false);
    setShowPicker(false);
  }, [patient.id]); 

  const addLabResult = (name: string) => {
    if (!name.trim()) return;
    setEditData(prev => ({
      ...prev,
      labResults: [...prev.labResults, name]
    }));
  };

  const removeLabResult = (index: number) => {
    setEditData(prev => ({
      ...prev,
      labResults: prev.labResults.filter((_: any, i: number) => i !== index)
    }));
  };

  const addDiagnostic = (name: string) => {
    if (!name.trim()) return;
    setEditData(prev => ({
      ...prev,
      diagnosticList: [...prev.diagnosticList, { name, description: 'New diagnosis', status: 'Active' }]
    }));
  };

  const removeDiagnostic = (index: number) => {
    setEditData(prev => ({
      ...prev,
      diagnosticList: prev.diagnosticList.filter((_: any, i: number) => i !== index)
    }));
  };

  // Auto-calculate age ONLY if the DOB was actually changed from the original
  React.useEffect(() => {
    if (!editData.date_of_birth || editData.date_of_birth === 'N/A') return;
    if (editData.date_of_birth === patient.date_of_birth) return; // Don't overwrite if DOB hasn't changed from original
    
    const birthDate = new Date(editData.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age >= 0 && age !== editData.age) {
      setEditData(prev => ({ ...prev, age: age }));
    }
  }, [editData.date_of_birth, patient.date_of_birth]);

  const avatars = patient.gender === 'Female' ? FEMALE_AVATARS : MALE_AVATARS;

  const handleUpdate = async (fields: any) => {
    setIsUpdating(true);
    setShowPicker(false);
    try {
      await api.updatePatient(patient.id, fields);
      setIsUpdating(false);
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsEditing(false);
        window.location.reload(); 
      }, 1000);
    } catch (error) {
      console.error("Failed to update patient:", error);
      setIsUpdating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleUpdate({ profilePicture: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const latestHistory = patient.diagnosis_history?.[0] || {};
    const updatedRecord = {
      month: latestHistory.month || 'March',
      year: parseInt(latestHistory.year?.toString() || '2024'),
      systolicValue: parseInt(editData.systolic.toString()),
      systolicLevel: editData.systolic > 130 ? 'Higher than Average' : 'Normal',
      diastolicValue: parseInt(editData.diastolic.toString()),
      diastolicLevel: editData.diastolic > 85 ? 'Higher than Average' : 'Normal',
      heartRateValue: parseInt(editData.heartRate.toString()),
      heartRateLevel: 'Normal',
      respiratoryValue: parseInt(editData.respiratoryRate.toString()),
      respiratoryLevel: 'Normal',
      temperatureValue: parseFloat(editData.temperature.toString()),
      temperatureLevel: 'Normal',
    };

    const updatedHistory = (patient.diagnosis_history && patient.diagnosis_history.length > 0)
      ? [updatedRecord, ...patient.diagnosis_history.slice(1).map((h: any) => ({
          month: h.month,
          year: parseInt(h.year?.toString() || '2024'),
          systolicValue: h.blood_pressure.systolic.value,
          systolicLevel: h.blood_pressure.systolic.levels,
          diastolicValue: h.blood_pressure.diastolic.value,
          diastolicLevel: h.blood_pressure.diastolic.levels,
          heartRateValue: h.heart_rate.value,
          heartRateLevel: h.heart_rate.levels,
          respiratoryValue: h.respiratory_rate.value,
          respiratoryLevel: h.respiratory_rate.levels,
          temperatureValue: h.temperature.value,
          temperatureLevel: h.temperature.levels
        }))]
      : [updatedRecord];

    handleUpdate({
      name: editData.name,
      gender: editData.gender,
      age: parseInt(editData.age.toString()),
      dateOfBirth: editData.date_of_birth,
      phoneNumber: editData.phone_number,
      emergencyContact: editData.emergency_contact,
      insuranceType: editData.insurance_type,
      diagnosisHistory: updatedHistory,
      diagnosticList: editData.diagnosticList,
      labResults: editData.labResults
    });
  };

  const handleDeletePatient = async () => {
    if (!window.confirm(`Are you sure you want to delete ${patient.name}'s record? This action cannot be undone.`)) return;
    
    setIsUpdating(true);
    try {
      console.log(`[Detail] Deleting patient ${patient.id}...`);
      const res = await fetch(`/api/patients/${patient.id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to delete');
      }
      
      setIsUpdating(false);
      setUpdateSuccess(true);
      
      setTimeout(() => {
        router.push('/'); 
      }, 1000);
    } catch (err: any) {
      console.error("[Detail] Delete error:", err);
      alert(`Error: ${err.response?.data?.error || err.message || 'Failed to delete patient'}`);
      setIsUpdating(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col space-y-6 lg:space-y-8 h-full"
    >
      {/* Profile Section */}
      <div className="card p-4 lg:p-8 flex flex-col items-center bg-white rounded-3xl shadow-sm border border-[#F6F7F8] relative">
        <div className="relative group mb-4 lg:mb-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative w-[120px] h-[120px] xl:w-[160px] xl:h-[160px] rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#01F0D0]/10"
          >
            <Image 
              src={patient.profile_picture || '/default-patient.png'} 
              alt={patient.name} 
              fill
              sizes="(max-width: 1024px) 100px, 200px"
              priority
              className="object-cover"
            />
            
            <AnimatePresence>
              {isUpdating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <Loader2 className="text-white animate-spin" size={32} />
                </motion.div>
              )}
              {updateSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#01F0D0]/80 flex items-center justify-center z-10"
                >
                  <CheckCircle2 className="text-[#072635]" size={40} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {!isEditing && (
            <button 
              onClick={() => setShowPicker(!showPicker)}
              disabled={isUpdating}
              className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all border border-gray-100 group-hover:scale-110 active:scale-95 disabled:opacity-50 z-20 ${
                showPicker ? 'bg-[#072635] text-white' : 'bg-white text-[#072635] hover:bg-[#01F0D0]'
              }`}
              title="Update Profile Picture"
            >
              {showPicker ? <X size={20} /> : <Camera size={20} />}
            </button>
          )}
        </div>

        {/* Avatar Picker Popover */}
        <AnimatePresence>
          {showPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-[160px] lg:top-[220px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#EDEDED] p-4 z-50 w-[240px] lg:w-[280px]"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[#707070] font-black uppercase tracking-widest mb-3">Choose Avatar</p>
                  <div className="grid grid-cols-4 gap-2">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => handleUpdate({ profilePicture: avatar })}
                        className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                          patient.profile_picture === avatar ? 'border-[#01F0D0] shadow-sm' : 'border-transparent'
                        }`}
                      >
                        <Image src={avatar} alt="Avatar" fill className="object-cover" />
                        {patient.profile_picture === avatar && (
                          <div className="absolute inset-0 bg-[#01F0D0]/20 flex items-center justify-center">
                            <Check size={14} className="text-[#072635]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-[#F6F7F8] hover:bg-[#01F0D0] text-[#072635] text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera size={14} />
                    <span>Upload Photo</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full text-center mb-4 lg:mb-8">
          {isEditing ? (
            <input 
              value={editData.name}
              onChange={e => setEditData({...editData, name: e.target.value})}
              className="text-lg lg:text-2xl font-extrabold text-[#072635] bg-[#F6F7F8] border-none rounded-xl px-4 py-2 w-full text-center outline-none ring-2 ring-[#01F0D0]"
              autoFocus
            />
          ) : (
            <h2 className="text-lg lg:text-2xl font-extrabold text-[#072635]">{patient.name}</h2>
          )}
        </div>
        
        <div className="w-full space-y-6">
          <InfoRow 
            icon={<Calendar className="text-[#072635]" size={20} />} 
            label="Date Of Birth" 
            value={editData.date_of_birth} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, date_of_birth: val})}
            type="date"
          />
          <InfoRow 
            icon={<User className="text-[#072635]" size={20} />} 
            label="Age" 
            value={editData.age.toString()} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, age: parseInt(val) || 0})}
            type="number"
          />
          <InfoRow 
            icon={<Users className="text-[#072635]" size={20} />} 
            label="Gender" 
            value={editData.gender} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, gender: val})}
            type="select"
            options={['Female', 'Male', 'Other']}
          />
          <InfoRow 
            icon={<Phone className="text-[#072635]" size={20} />} 
            label="Contact Info." 
            value={editData.phone_number} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, phone_number: val})}
          />
          <InfoRow 
            icon={<Users className="text-[#072635]" size={20} />} 
            label="Emergency Contacts" 
            value={editData.emergency_contact} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, emergency_contact: val})}
          />
          <InfoRow 
            icon={<ShieldCheck className="text-[#072635]" size={20} />} 
            label="Insurance Provider" 
            value={editData.insurance_type} 
            isEditing={isEditing}
            onChange={val => setEditData({...editData, insurance_type: val})}
          />
        </div>

        {/* Clinical Metrics Editor */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-6 pt-6 border-t border-[#F6F7F8] space-y-4"
            >
              <h3 className="text-xs font-black text-[#072635] uppercase tracking-widest flex items-center">
                <Activity size={16} className="mr-2 text-[#01F0D0]" />
                Latest Vital Signs
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-[#707070] uppercase block mb-1">Systolic</label>
                  <input 
                    type="number"
                    value={editData.systolic}
                    onChange={e => setEditData({...editData, systolic: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F6F7F8] rounded-lg text-xs font-bold text-[#072635] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#707070] uppercase block mb-1">Diastolic</label>
                  <input 
                    type="number"
                    value={editData.diastolic}
                    onChange={e => setEditData({...editData, diastolic: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F6F7F8] rounded-lg text-xs font-bold text-[#072635] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#707070] uppercase block mb-1">Heart Rate</label>
                  <input 
                    type="number"
                    value={editData.heartRate}
                    onChange={e => setEditData({...editData, heartRate: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F6F7F8] rounded-lg text-xs font-bold text-[#072635] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#707070] uppercase block mb-1">Temp (°F)</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={editData.temperature}
                    onChange={e => setEditData({...editData, temperature: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F6F7F8] rounded-lg text-xs font-bold text-[#072635] outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-bold text-[#707070] uppercase block mb-1">Primary Diagnosis</label>
                  <input 
                    value={editData.diagnosis}
                    onChange={e => setEditData({...editData, diagnosis: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F6F7F8] rounded-lg text-xs font-bold text-[#072635] outline-none"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] font-bold text-[#707070] uppercase block">Diagnostics List</label>
                  <div className="space-y-2">
                    {editData.diagnosticList.map((diag: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-100 group">
                        <input 
                          value={diag.name}
                          onChange={e => {
                            const newList = [...editData.diagnosticList];
                            newList[idx] = { ...newList[idx], name: e.target.value };
                            setEditData({ ...editData, diagnosticList: newList });
                          }}
                          className="flex-1 text-[10px] font-bold text-[#072635] outline-none"
                        />
                        <button 
                          onClick={() => removeDiagnostic(idx)}
                          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input 
                        id="new-diag"
                        placeholder="Add diagnostic..."
                        className="flex-1 text-[10px] px-2 py-1.5 bg-white rounded-lg border border-dashed border-gray-300 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addDiagnostic((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const input = document.getElementById('new-diag') as HTMLInputElement;
                          addDiagnostic(input.value);
                          input.value = '';
                        }}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-[#01F0D0] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 lg:mt-10 w-full flex space-x-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 lg:py-4 text-xs lg:text-sm font-extrabold text-[#072635] bg-[#F6F7F8] rounded-full hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-3 lg:py-4 text-xs lg:text-sm font-extrabold text-[#072635] bg-[#01F0D0] rounded-full hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all flex items-center justify-center space-x-2"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col w-full space-y-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-3 lg:py-4 text-xs lg:text-sm font-extrabold text-[#072635] bg-[#01F0D0] rounded-full hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all"
              >
                Update Information
              </button>
              <button 
                onClick={handleDeletePatient}
                className="w-full py-3 lg:py-4 text-xs lg:text-sm font-extrabold text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-all flex items-center justify-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete Patient</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Lab Results Section */}
      <div className="card p-4 lg:p-8 bg-white rounded-3xl shadow-sm border border-[#F6F7F8] flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Lab Results</h2>
          {isEditing && (
            <div className="flex items-center space-x-2">
              <input 
                id="new-lab-result"
                placeholder="Add new result..."
                className="text-xs px-3 py-1.5 bg-[#F6F7F8] rounded-lg outline-none ring-1 ring-[#01F0D0]/30 focus:ring-[#01F0D0] w-32 lg:w-48"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLabResult((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('new-lab-result') as HTMLInputElement;
                  addLabResult(input.value);
                  input.value = '';
                }}
                className="p-1.5 bg-[#01F0D0] text-[#072635] rounded-lg hover:bg-[#01d9bc] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3 lg:space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
          {editData.labResults.map((result: string, index: number) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={`${result}-${index}`} 
              className="flex items-center justify-between p-3 lg:p-4 hover:bg-gray-50 rounded-xl transition-all group"
            >
              <span className="text-xs lg:text-sm text-[#072635] font-medium">{result}</span>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <button 
                    onClick={() => removeLabResult(index)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button className="text-[#072635] opacity-50 group-hover:opacity-100 transition-opacity p-1">
                    <Download size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {editData.labResults.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[#707070] space-y-3 py-10">
              <ClipboardList size={40} className="opacity-20" />
              <p className="text-xs lg:text-sm font-medium">No lab results available</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (val: string) => void;
  type?: 'text' | 'date' | 'select' | 'number';
  options?: string[];
}

const InfoRow = ({ icon, label, value, isEditing, onChange, type = 'text', options }: InfoRowProps) => (
  <div className="flex items-center space-x-4 group">
    <div className="w-10 h-10 lg:w-11 lg:h-11 bg-[#F6F7F8] rounded-full flex items-center justify-center text-[#072635] group-hover:bg-[#01F0D0] transition-colors flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-[10px] lg:text-xs text-[#707070] font-medium uppercase tracking-wider">{label}</span>
      {isEditing && onChange ? (
        type === 'select' ? (
          <select 
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-xs lg:text-sm font-extrabold text-[#072635] bg-[#F6F7F8] border-none rounded-lg px-2 py-1 mt-1 outline-none ring-1 ring-[#01F0D0]"
          >
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-xs lg:text-sm font-extrabold text-[#072635] bg-[#F6F7F8] border-none rounded-lg px-2 py-1 mt-1 outline-none ring-1 ring-[#01F0D0] w-full"
          />
        )
      ) : (
        <span className="text-xs lg:text-sm font-extrabold text-[#072635] truncate">
          {value || 'N/A'}
        </span>
      )}
    </div>
  </div>
);

export default PatientDetail;
