'use client';

import React from 'react';
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
import { ChevronDown, ChevronUp } from 'lucide-react';

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

interface BloodPressureChartProps {
  history: any[];
}

const BloodPressureChart = ({ history }: BloodPressureChartProps) => {
  // Take last 6 months for the chart
  const recentHistory = history && history.length > 0 ? [...history].slice(0, 6).reverse() : [];
  
  const data = {
    labels: recentHistory.map(h => `${h.month?.substring(0, 3) || ''}, ${h.year || ''}`),
    datasets: [
      {
        label: 'Systolic',
        data: recentHistory.map(h => h.blood_pressure?.systolic?.value || 0),
        borderColor: '#E66FD2',
        backgroundColor: '#E66FD2',
        pointBackgroundColor: '#E66FD2',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1,
        pointRadius: 6,
        tension: 0.4,
      },
      {
        label: 'Diastolic',
        data: recentHistory.map(h => h.blood_pressure?.diastolic?.value || 0),
        borderColor: '#8C6FE6',
        backgroundColor: '#8C6FE6',
        pointBackgroundColor: '#8C6FE6',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1,
        pointRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        min: 60,
        max: 180,
        ticks: {
          stepSize: 20,
          color: '#072635',
          font: {
            family: 'Manrope',
            size: 12,
          },
        },
        grid: {
          color: '#CBC8D4',
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#072635',
          font: {
            family: 'Manrope',
            size: 12,
          },
        },
      },
    },
  };

  const latest = history && history.length > 0 ? history[0] : {
    blood_pressure: {
      systolic: { value: 0, levels: 'N/A' },
      diastolic: { value: 0, levels: 'N/A' }
    }
  };

  return (
    <div className="bg-[#F4F0FE] rounded-2xl p-3 lg:p-6 flex flex-col xl:flex-row space-y-6 xl:space-y-0 xl:space-x-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg lg:text-xl font-extrabold text-[#072635]">Blood Pressure</h3>
          <div className="flex items-center text-xs lg:text-sm text-[#072635] font-medium bg-white/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors">
            Last 6 months <ChevronDown size={16} className="ml-2" />
          </div>
        </div>
        <div className="h-[180px] lg:h-[220px]">
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="w-full xl:w-[180px] flex flex-row xl:flex-col justify-between xl:justify-start xl:space-y-8 border-t xl:border-t-0 xl:border-l border-[#CBC8D4] pt-6 xl:pt-0 xl:pl-8">
        <div className="flex-1 xl:flex-none">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#E66FD2] shadow-sm"></div>
            <span className="text-xs lg:text-sm font-extrabold text-[#072635]">Systolic</span>
          </div>
          <div className="text-xl lg:text-3xl font-black text-[#072635]">{latest.blood_pressure?.systolic?.value}</div>
          <div className="flex items-center text-[10px] lg:text-xs text-[#072635] mt-1.5 font-bold">
            <ChevronUp size={16} className="text-[#072635] mr-1" />
            {latest.blood_pressure?.systolic?.levels}
          </div>
        </div>
        
        <div className="flex-1 xl:flex-none border-l xl:border-l-0 xl:border-t border-[#CBC8D4] pl-6 xl:pl-0 xl:pt-8">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#8C6FE6] shadow-sm"></div>
            <span className="text-xs lg:text-sm font-extrabold text-[#072635]">Diastolic</span>
          </div>
          <div className="text-xl lg:text-3xl font-black text-[#072635]">{latest.blood_pressure?.diastolic?.value}</div>
          <div className="flex items-center text-[10px] lg:text-xs text-[#072635] mt-1.5 font-bold">
            <ChevronDown size={16} className="text-[#072635] mr-1" />
            {latest.blood_pressure?.diastolic?.levels}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodPressureChart;
