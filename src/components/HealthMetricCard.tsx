"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Heart, ArrowUp, ArrowDown } from 'lucide-react';

interface HealthMetricCardProps {
  title: string;
  value: string;
  status: string;
  icon: string; // Keep for compatibility but we'll use title to switch icons
  bgColor: string;
}

const HealthMetricCard = ({ title, value, status, bgColor }: HealthMetricCardProps) => {
  const getIcon = () => {
    switch (title) {
      case 'Respiratory Rate':
        return <Wind size={32} className="text-[#072635]" />;
      case 'Temperature':
        return <Thermometer size={32} className="text-[#072635]" />;
      case 'Heart Rate':
        return <Heart size={32} className="text-[#072635]" />;
      default:
        return <Wind size={32} className="text-[#072635]" />;
    }
  };

  const isNormal = status.toLowerCase().includes('normal');

  return (
    <motion.div 
      whileHover={{ scale: 1.05, translateY: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-3xl flex flex-col space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
        {getIcon()}
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#072635] opacity-80">{title}</span>
        <span className="text-3xl font-extrabold text-[#072635] mt-1">{value}</span>
      </div>

      <div className="flex items-center space-x-2">
        {isNormal ? (
          <span className="text-sm text-[#072635]">{status}</span>
        ) : (
          <>
            {status.toLowerCase().includes('higher') ? (
              <ArrowUp size={14} className="text-[#072635]" />
            ) : (
              <ArrowDown size={14} className="text-[#072635]" />
            )}
            <span className="text-sm text-[#072635] font-medium">{status}</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HealthMetricCard;
