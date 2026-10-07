"use client";

import { useState } from 'react';
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
      setIsAddModalOpen(false);
      window.location.reload();
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1700px] mx-auto">
        {/* Left Column: Patient List */}
        <div className="md:col-span-4 lg:col-span-3 h-[500px] md:h-[calc(100vh-140px)] md:sticky md:top-[110px]">
          <PatientList
            onSelectPatient={setSelectedPatient}
            selectedPatientId={selectedPatient?.id}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Middle Column */}
        <div className="md:col-span-8 lg:col-span-6 space-y-6 order-last lg:order-none">
          {!selectedPatient ? (
            <div className="card p-10 flex flex-col items-center justify-center text-center space-y-6 bg-white border-dashed border-2 border-gray-200">
              <div className="w-16 h-16 bg-[#01F0D0]/10 rounded-full flex items-center justify-center text-[#01F0D0]">
                <LayoutGrid size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-[#072635]">Welcome, Dr. Simmons</h3>
                <p className="text-[#707070] mt-2 max-w-md text-sm">Please select a patient from the sidebar to view their full medical history and diagnostic reports.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Diagnosis History Card */}
              <div className="card p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-[#072635]">Diagnosis History</h2>
                  <Activity className="text-[#01F0D0]" size={24} />
                </div>
                <BloodPressureChart history={selectedPatient.diagnosis_history || []} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
              <div className="card p-6 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-[#072635]">Diagnostic List</h2>
                  <ClipboardList className="text-[#707070] opacity-50" size={24} />
                </div>
                <div className="overflow-x-auto -mx-4">
                  <div className="inline-block min-w-full align-middle px-4">
                    <table className="min-w-[600px] w-full text-left">
                      <thead>
                        <tr className="bg-[#F6F7F8]">
                          <th className="p-4 rounded-l-2xl text-sm font-extrabold text-[#072635]">Problem/Diagnosis</th>
                          <th className="p-4 text-sm font-extrabold text-[#072635]">Description</th>
                          <th className="p-4 rounded-r-2xl text-sm font-extrabold text-[#072635]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(selectedPatient.diagnostic_list || []).map((item: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 text-sm text-[#072635] font-bold">{item.name}</td>
                            <td className="p-4 text-sm text-[#072635]">{item.description}</td>
                            <td className="p-4 text-sm">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap ${
                                item.status.toLowerCase().includes('cured') || item.status.toLowerCase().includes('normal')
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Profile & Labs */}
        <div className="md:col-span-12 lg:col-span-3">
          {selectedPatient && (
            <PatientDetail key={selectedPatient.id} patient={selectedPatient} />
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