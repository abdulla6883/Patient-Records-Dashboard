"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import {
  Users,
  Calendar,
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
    { title: 'Total Patients', value: data?.patientCount || '0', change: '+12%', icon: <Users size={20} />, color: '#E0F3FA' },
    { title: 'Appointments', value: data?.appointmentCount || '0', change: 'Today', icon: <Calendar size={20} />, color: '#FFE6E9' },
    { title: 'Monthly Revenue', value: '$12,450', change: '+8%', icon: <TrendingUp size={20} />, color: '#D8FCF7' },
    { title: 'Active Cases', value: '156', change: '-3%', icon: <Activity size={20} />, color: '#F4F0FE' },
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
        backgroundColor: 'rgba(1, 240, 208, 0.08)',
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
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-[#072635]">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#072635]">Clinic Overview</h1>
              <p className="text-sm text-[#707070] font-medium">Welcome back, Dr. Simmons.</p>
            </div>
          </div>
          <button className="flex items-center justify-center space-x-2 bg-white px-6 py-3 rounded-full text-sm font-bold text-[#072635] shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
            <span>Download Report</span>
            <ArrowRight size={16} />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="card p-5 bg-white flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#072635] group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: stat.color }}
                >
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                </div>
                <div className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  <span>{stat.change}</span>
                  <ArrowUpRight size={12} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#707070] uppercase tracking-wider">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-[#072635] mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart */}
          <div className="lg:col-span-8 card p-6 bg-white h-[400px] flex flex-col shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#072635]">Patient Growth</h2>
                <p className="text-xs text-[#707070] font-medium mt-1">Registered patients over time</p>
              </div>
              <div className="flex bg-[#F6F7F8] p-1 rounded-xl self-start sm:self-auto">
                <button className="px-5 py-2.5 rounded-lg text-xs font-bold text-[#707070] hover:bg-white transition-all">Weekly</button>
                <button className="px-5 py-2.5 bg-white rounded-lg text-xs font-bold text-[#072635] shadow-sm">Monthly</button>
              </div>
            </div>
            <div className="flex-1 relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-4 card p-6 bg-white h-[400px] flex flex-col shadow-sm">
            <h2 className="text-xl font-extrabold text-[#072635] mb-6">Recent Activity</h2>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group cursor-pointer">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    <Image src={item.image} alt={item.patient} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#072635] group-hover:text-[#01F0D0] transition-colors truncate">{item.patient}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-green-50 text-green-600">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs text-[#707070] mt-0.5 font-medium">{item.action}</span>
                    <span className="text-[10px] text-[#707070] mt-1 flex items-center opacity-40 font-bold">
                      <Clock size={8} className="mr-1" />
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 text-sm font-extrabold text-[#072635] bg-[#F6F7F8] rounded-full hover:bg-[#01F0D0] transition-all hover:shadow-lg hover:shadow-[#01F0D0]/20">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}