"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Link from 'next/link';
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function OverviewPage() {
  const [data, setData] = React.useState<any>(null);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ptsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/patients')
        ]);

        if (statsRes.status === 401 || ptsRes.status === 401) {
          window.location.href = '/login';
          return;
        }

        const stats = statsRes.ok ? await statsRes.json() : { totalPatients: 0, appointmentsThisMonth: 0, patientGrowth: 0, avgHeartRate: 0 };
        const pts = ptsRes.ok ? await ptsRes.json() : [];

        setData(stats);
        setPatients(Array.isArray(pts) ? pts : []);
      } catch (err) {
        console.error("Overview fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Total Patients', value: data?.patientCount || '0', change: '+12%', icon: <Users size={24} />, color: '#E0F3FA' },
    { title: 'Appointments', value: data?.appointmentCount || '0', change: 'Today', icon: <CalendarIcon size={24} />, color: '#FFE6E9' },
    { title: 'Monthly Revenue', value: '$12,450', change: '+8%', icon: <TrendingUp size={24} />, color: '#D8FCF7' },
    { title: 'Active Cases', value: '156', change: '-3%', icon: <Activity size={24} />, color: '#F4F0FE' },
  ];

  const recentActivity = patients.slice(0, 4).map(p => ({
    patient: p.name,
    action: 'Patient record updated',
    time: 'Recent',
    status: 'Completed',
    image: p.profilePicture || '/default-patient.png'
  }));

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patients',
        data: [1000, 1050, 1100, 1150, 1200, 1284],
        borderColor: '#01F0D0',
        backgroundColor: 'rgba(1, 240, 208, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#707070' } },
    },
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-10 px-4 md:px-8">
      
      <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-8 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2.5 lg:p-3 bg-white rounded-xl lg:rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-[#072635] group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#072635]">Clinic Overview</h1>
              <p className="text-xs lg:text-sm text-[#707070] mt-1 font-medium">Welcome back, Dr. Simmons.</p>
            </div>
          </div>
          <button className="flex items-center justify-center space-x-2 bg-white px-6 py-3 rounded-full text-sm font-bold text-[#072635] shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
            <span>Download Report</span>
            <ArrowRight size={16} />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 lg:p-7 bg-white flex flex-col justify-between h-[160px] lg:h-[200px] hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-[#072635] group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: stat.color }}
                >
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                </div>
                <div className={`flex items-center space-x-1 text-[10px] lg:text-xs font-extrabold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  <span>{stat.change}</span>
                  <ArrowUpRight size={12} className="lg:hidden" />
                  <ArrowUpRight size={14} className="hidden lg:block" />
                </div>
              </div>
              <div>
                <h3 className="text-[10px] lg:text-sm font-bold text-[#707070] uppercase tracking-wider">{stat.title}</h3>
                <p className="text-2xl lg:text-4xl font-extrabold text-[#072635] mt-1 lg:mt-2">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 card p-4 lg:p-8 bg-white h-[400px] lg:h-[480px] flex flex-col shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
              <div>
                <h2 className="text-xl lg:text-2xl font-extrabold text-[#072635]">Patient Growth</h2>
                <p className="text-[10px] lg:text-xs text-[#707070] font-medium mt-1">Registered patients over time</p>
              </div>
              <div className="flex bg-[#F6F7F8] p-1 rounded-xl lg:rounded-2xl self-start sm:self-auto">
                <button className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold text-[#707070] hover:bg-white transition-all">Weekly</button>
                <button className="px-4 lg:px-5 py-2 lg:py-2.5 bg-white rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold text-[#072635] shadow-sm">Monthly</button>
              </div>
            </div>
            <div className="flex-1 relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-4 card p-6 lg:p-8 bg-white h-[400px] lg:h-[480px] flex flex-col shadow-sm">
            <h2 className="text-xl lg:text-2xl font-extrabold text-[#072635] mb-6 lg:mb-8">Recent Activity</h2>
            <div className="space-y-4 lg:space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-3">
              {recentActivity.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 lg:space-x-4 group cursor-pointer"
                >
                  <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.patient} 
                      fill 
                      sizes="48px"
                      priority={index < 2}
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-sm font-extrabold text-[#072635] group-hover:text-[#01F0D0] transition-colors">{item.patient}</span>
                      <span className={`text-[8px] lg:text-[10px] uppercase font-black tracking-widest px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full ${
                        item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <span className="text-[10px] lg:text-xs text-[#707070] mt-0.5 lg:mt-1 font-medium">{item.action}</span>
                    <span className="text-[9px] lg:text-[10px] text-[#707070] mt-1 lg:mt-1.5 flex items-center opacity-40 font-bold">
                      <Clock size={8} className="lg:hidden mr-1" />
                      <Clock size={10} className="hidden lg:block mr-1" />
                      {item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="mt-6 lg:mt-8 w-full py-3 lg:py-4 text-xs lg:text-sm font-extrabold text-[#072635] bg-[#F6F7F8] rounded-full hover:bg-[#01F0D0] transition-all hover:shadow-lg hover:shadow-[#01F0D0]/20">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
