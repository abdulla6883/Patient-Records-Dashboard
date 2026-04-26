"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreVertical,
  CreditCard,
  Wallet,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-10 px-4 md:px-8">
      
      <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2.5 lg:p-3 bg-white rounded-xl lg:rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-[#072635] group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#072635]">Transactions</h1>
              <p className="text-xs lg:text-sm text-[#707070] mt-1">Manage invoices and revenue.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-white border border-[#EDEDED] rounded-full text-xs lg:text-sm font-bold text-[#072635] hover:bg-gray-50 transition-all">
              <Download size={16} lgSize={18} />
              <span>Export</span>
            </button>
            <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-[#01F0D0] rounded-full text-xs lg:text-sm font-extrabold text-[#072635] shadow-sm hover:shadow-[#01F0D0]/40 transition-all">
              <CreditCard size={16} lgSize={18} />
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        {/* Finance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <SummaryCard title="Total Revenue" value="$42,580" change="+12.5%" icon={<Wallet size={20} lgSize={24} />} color="#E0F3FA" />
          <SummaryCard title="Incoming" value="$8,240" change="+4.2%" icon={<ArrowDownLeft size={20} lgSize={24} />} color="#D8FCF7" />
          <SummaryCard title="Outgoing" value="$2,150" change="-2.1%" icon={<ArrowUpRight size={20} lgSize={24} />} color="#FFE6E9" className="sm:col-span-2 lg:col-span-1" />
        </div>

        {/* Transactions Table */}
        <div className="card bg-white shadow-sm overflow-hidden border border-[#F6F7F8]">
          <div className="p-4 lg:p-8 border-b border-[#F6F7F8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-12 pr-4 py-2.5 lg:py-3 bg-[#F6F7F8] rounded-xl lg:rounded-2xl text-sm focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-5 py-2.5 lg:py-3 bg-[#F6F7F8] rounded-xl lg:rounded-2xl text-sm font-bold text-[#072635] hover:bg-gray-100 transition-all">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-[#F6F7F8]/50">
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Invoice ID</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Patient</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Service</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Date</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Amount</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest">Status</th>
                  <th className="p-4 lg:p-6 text-[10px] lg:text-xs font-extrabold text-[#707070] uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 lg:p-6 text-xs lg:text-sm font-bold text-[#072635]">{t.invoiceId}</td>
                    <td className="p-4 lg:p-6 text-xs lg:text-sm font-bold text-[#072635]">{t.patient}</td>
                    <td className="p-4 lg:p-6 text-xs lg:text-sm text-[#707070]">{t.service}</td>
                    <td className="p-4 lg:p-6 text-xs lg:text-sm text-[#707070]">{t.date}</td>
                    <td className="p-4 lg:p-6 text-xs lg:text-sm font-extrabold text-[#072635]">{t.amount}</td>
                    <td className="p-4 lg:p-6">
                      <span className={`px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                        t.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        t.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 lg:p-6 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-[#707070]">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 lg:p-8 border-t border-[#F6F7F8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] lg:text-xs text-[#707070] font-medium">Showing 5 of 128 transactions</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-[#EDEDED] rounded-xl text-[10px] lg:text-xs font-bold text-[#707070] hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 bg-[#072635] text-white rounded-xl text-[10px] lg:text-xs font-bold shadow-md shadow-[#072635]/20">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) => (
  <div className="card p-8 bg-white flex items-center justify-between hover:shadow-md transition-shadow">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-[#707070]">{title}</span>
      <span className="text-2xl font-extrabold text-[#072635] mt-1">{value}</span>
      <span className={`text-xs mt-2 font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change} from last month</span>
    </div>
    <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-[#072635]" style={{ backgroundColor: color }}>
      {icon}
    </div>
  </div>
);
