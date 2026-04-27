"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientList from '@/components/PatientList';
import BloodPressureChart from '@/components/BloodPressureChart';
import HealthMetricCard from '@/components/HealthMetricCard';
import PatientDetail from '@/components/PatientDetail';
import { LayoutGrid, Activity, ClipboardList } from 'lucide-react';
import AddPatientModal from '@/components/AddPatientModal';
import { api } from '@/services/api';

export default function DashboardPage() {

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddPatient = async (data: any) => {
    try {
      await api.createPatient(data);
      // Trigger a refresh of the list or just close
      setIsAddModalOpen(false);
      window.location.reload(); // Quick way to refresh for now
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  const latestStats = selectedPatient?.diagnosis_history?.[0] || {
    respiratory_rate: { value: 0, levels: 'N/A' },
    temperature: { value: 0, levels: 'N/A' },
    heart_rate: { value: 0, levels: 'N/A' },
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-10 px-4 md:px-8">
      <div id="build-ver-12345" className="hidden">Active</div>
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 max-w-[1700px] mx-auto">
        {/* Left Column: Patient List - Takes full width on mobile, 4 cols on md, 3 on lg */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-4 lg:col-span-3 h-[500px] md:h-[calc(100vh-140px)] md:sticky md:top-[110px]"
        >
          <PatientList 
            onSelectPatient={setSelectedPatient} 
            selectedPatientId={selectedPatient?.id} 
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </motion.div>

        {/* Middle Column: Diagnosis History & List - 8 cols on md, 6 on lg */}
        <div className="md:col-span-8 lg:col-span-6 space-y-6 lg:space-y-8 order-last lg:order-none">
          <AnimatePresence mode="wait">
            {!selectedPatient ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card p-10 lg:p-20 flex flex-col items-center justify-center text-center space-y-6 bg-white border-dashed border-2 border-gray-200"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#01F0D0]/10 rounded-full flex items-center justify-center text-[#01F0D0]">
                  <LayoutGrid size={32} className="lg:hidden" />
                  <LayoutGrid size={40} className="hidden lg:block" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Welcome, Dr. Simmons</h3>
                  <p className="text-[#707070] mt-2 max-w-md text-sm lg:text-base">Please select a patient from the sidebar to view their full medical history and diagnostic reports.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedPatient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 lg:space-y-8"
              >
                {/* Diagnosis History Card */}
                <div className="card p-4 lg:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <h2 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Diagnosis History</h2>
                    <Activity className="text-[#01F0D0]" size={24} />
                  </div>
                  <BloodPressureChart history={selectedPatient.diagnosis_history || []} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-6">
                    <HealthMetricCard 
                      title="Respiratory Rate"
                      value={`${latestStats.respiratory_rate.value} bpm`}
                      status={latestStats.respiratory_rate.levels}
                      icon="wind"
                      bgColor="#E0F3FA"
                    />
                    <HealthMetricCard 
                      title="Temperature"
                      value={`${latestStats.temperature.value}°F`}
                      status={latestStats.temperature.levels}
                      icon="thermometer"
                      bgColor="#FFE6E9"
                    />
                    <HealthMetricCard 
                      title="Heart Rate"
                      value={`${latestStats.heart_rate.value} bpm`}
                      status={latestStats.heart_rate.levels}
                      icon="heart"
                      bgColor="#FFE6F1"
                    />
                  </div>
                </div>

                {/* Diagnostic List Card */}
                <div className="card p-4 lg:p-8 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <h2 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Diagnostic List</h2>
                    <ClipboardList className="text-[#707070] opacity-50" size={24} />
                  </div>
                  <div className="overflow-x-auto -mx-4 lg:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 lg:px-0">
                      <table className="min-w-[600px] w-full text-left">
                        <thead>
                          <tr className="bg-[#F6F7F8]">
                            <th className="p-4 lg:p-5 rounded-l-2xl text-xs lg:text-sm font-extrabold text-[#072635]">Problem/Diagnosis</th>
                            <th className="p-4 lg:p-5 text-xs lg:text-sm font-extrabold text-[#072635]">Description</th>
                            <th className="p-4 lg:p-5 rounded-r-2xl text-xs lg:text-sm font-extrabold text-[#072635]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(selectedPatient.diagnostic_list || []).map((item: any, index: number) => (
                            <motion.tr 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              key={index} 
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="p-4 lg:p-5 text-xs lg:text-sm text-[#072635] font-bold">{item.name}</td>
                              <td className="p-4 lg:p-5 text-xs lg:text-sm text-[#072635]">{item.description}</td>
                              <td className="p-4 lg:p-5 text-xs lg:text-sm">
                                <span className={`px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap ${
                                  item.status.toLowerCase().includes('cured') || item.status.toLowerCase().includes('normal')
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Profile & Labs - Full width on md to stack under list but above diagnosis history? 
            Actually on md, List is 4, Content is 8. So this should probably be 12 to stack below. */}
        <div className="md:col-span-12 lg:col-span-3">
          {selectedPatient && (
            <PatientDetail 
              key={selectedPatient.id}
              patient={selectedPatient} 
            />
          )}
        </div>
      </div>
      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddPatient} 
      />
    </div>
  );
}
