"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SchedulePage() {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAppointments([]);
        setLoading(false);
      });
  }, []);

  const days = [
    { day: 'Mon', date: '21', active: false },
    { day: 'Tue', date: '22', active: false },
    { day: 'Wed', date: '23', active: true },
    { day: 'Thu', date: '24', active: false },
    { day: 'Fri', date: '25', active: false },
    { day: 'Sat', date: '26', active: false },
    { day: 'Sun', date: '27', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-10 px-4 md:px-8">
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-4 lg:p-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/" className="p-2 lg:p-2.5 bg-gray-50 rounded-xl lg:rounded-2xl hover:bg-[#01F0D0]/10 transition-all text-[#072635] group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#072635]">Schedule</h1>
              <div className="hidden sm:flex items-center space-x-2 bg-[#F6F7F8] px-4 py-2 rounded-full">
                <CalendarIcon size={18} className="text-[#072635]" />
                <span className="text-sm font-bold text-[#072635]">March 2024</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100">
                  <ChevronRight size={20} />
                </button>
              </div>
              <button className="flex items-center space-x-2 bg-[#01F0D0] px-4 lg:px-6 py-2.5 rounded-full text-xs lg:text-sm font-extrabold text-[#072635] shadow-sm hover:shadow-[#01F0D0]/40 transition-all">
                <Plus size={16} lgSize={18} strokeWidth={3} />
                <span className="hidden xs:inline">New Appointment</span>
                <span className="xs:hidden">New</span>
              </button>
            </div>
          </div>

          <div className="card bg-white p-4 lg:p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between mb-8 lg:mb-10 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
              {days.map((d, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 flex-shrink-0 min-w-[50px] lg:flex-1">
                  <span className="text-[10px] lg:text-xs font-bold text-[#707070] uppercase tracking-widest">{d.day}</span>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-extrabold text-sm lg:text-lg transition-all cursor-pointer ${
                    d.active ? 'bg-[#01F0D0] text-[#072635] shadow-lg shadow-[#01F0D0]/30' : 'hover:bg-gray-50 text-[#072635]'
                  }`}>
                    {d.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 lg:space-x-6 group"
                >
                  <div className="w-16 lg:w-20 text-[10px] lg:text-sm font-bold text-[#707070] uppercase">{apt.time}</div>
                  <div 
                    className="flex-1 p-3 lg:p-5 rounded-2xl lg:rounded-3xl flex items-center justify-between group-hover:shadow-md transition-all border border-transparent group-hover:border-white"
                    style={{ backgroundColor: ['#E0F3FA', '#FFE6E9', '#D8FCF7', '#F4F0FE'][index % 4] }}
                  >
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                        <Image 
                          src={`/${apt.patient.split(' ')[0].toLowerCase()}.png`} 
                          alt={apt.patient} 
                          fill 
                          sizes="48px"
                          className="object-cover" 
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-patient.png';
                          }} 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs lg:text-sm font-extrabold text-[#072635] truncate">{apt.patient}</span>
                        <div className="flex items-center space-x-2 text-[10px] lg:text-xs text-[#072635] opacity-60">
                          <Clock size={10} className="lg:hidden" />
                          <Clock size={12} className="hidden lg:block" />
                          <span className="truncate">30 min • {apt.service}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/50 rounded-full transition-all flex-shrink-0">
                      <MoreVertical size={18} className="text-[#072635]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <div className="card p-6 lg:p-8 bg-[#072635] text-white">
            <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Upcoming Event</h2>
            <div className="bg-white/10 p-4 lg:p-5 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#01F0D0] rounded-xl flex items-center justify-center text-[#072635]">
                  <CalendarIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Staff Meeting</span>
                  <span className="text-xs opacity-60">Tomorrow, 10:00 AM</span>
                </div>
              </div>
              <p className="text-[10px] lg:text-xs opacity-60 leading-relaxed">
                Reviewing Q1 patient satisfaction scores and telehealth integration protocols.
              </p>
              <button className="w-full py-3 bg-[#01F0D0] text-[#072635] rounded-full text-xs font-bold hover:bg-[#01d9bc] transition-all">
                Add to Calendar
              </button>
            </div>
          </div>

          <div className="card p-6 lg:p-8 bg-white shadow-sm">
            <h2 className="text-lg lg:text-xl font-extrabold text-[#072635] mb-4 lg:mb-6">Patient Requests</h2>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#F6F7F8] rounded-full flex items-center justify-center text-[#707070] flex-shrink-0">
                    <Plus size={20} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#072635]">New Request</span>
                    <span className="text-[10px] lg:text-xs text-[#707070] truncate">Dr. Simmons, I need to reschedule...</span>
                    <div className="flex space-x-2 mt-3">
                      <button className="px-4 py-1.5 bg-[#01F0D0] text-[#072635] rounded-full text-[10px] font-bold">Approve</button>
                      <button className="px-4 py-1.5 bg-[#F6F7F8] text-[#707070] rounded-full text-[10px] font-bold">Decline</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
