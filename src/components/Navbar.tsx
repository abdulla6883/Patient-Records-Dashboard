"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Settings, 
  MessageSquare, 
  Calendar, 
  Home, 
  Users, 
  CreditCard, 
  LogOut,
  Bell,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userName = session?.user?.name || "Dr. Jose Simmons";
  const userImage = session?.user?.image || "/dr-jose-simmons.png";
  
  const gender = (session?.user as any)?.gender || "Male";
  const dob = (session?.user as any)?.dateOfBirth;
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 35;

  return (
    <nav className="h-[60px] lg:h-[72px] bg-white/80 backdrop-blur-2xl border-b border-[#EDEDED] fixed top-0 left-0 right-0 z-50 transition-all duration-500 shadow-sm px-4">
      <div className="max-w-[1700px] mx-auto h-full flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center min-w-0 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 mr-2 text-[#072635] hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center group">
              <Image 
                src="/TestLogo.png" 
                alt="Tech.Care" 
                width={140} 
                height={42} 
                priority
                className="w-[85px] h-[25px] lg:w-[110px] lg:h-[33px] xl:w-[130px] xl:h-[39px] cursor-pointer group-hover:opacity-80 transition-all" 
              />
            </div>
          </Link>
        </div>

        {/* Middle Section: Navigation Links - Smaller font and padding */}
        <div className="hidden lg:flex items-center justify-center flex-[3] px-1">
          <div className="flex items-center gap-0 lg:gap-0.5 xl:gap-1">
            <NavLink href="/overview" icon={<Home size={16} />} label="Overview" active={pathname === '/overview'} />
            <NavLink href="/" icon={<Users size={16} />} label="Patients" active={pathname === '/'} />
            <NavLink href="/schedule" icon={<Calendar size={16} />} label="Schedule" active={pathname === '/schedule'} />
            <NavLink href="/messages" icon={<MessageSquare size={16} />} label="Message" active={pathname === '/messages'} />
            <NavLink href="/transactions" icon={<CreditCard size={16} />} label="Transactions" active={pathname === '/transactions'} />
          </div>
        </div>

        {/* Right Section: Actions & Profile - More compact */}
        <div className="flex-1 flex items-center justify-end space-x-1 lg:space-x-2 xl:space-x-4 min-w-0">
          <div className="flex items-center space-x-0.5 lg:space-x-1">
            <IconButton icon={<Search size={16} />} />
            <IconButton icon={<Bell size={16} />} badge />
            <IconButton icon={<Settings size={16} />} className="hidden sm:block" />
          </div>

          {/* Profile */}
          <div className="flex items-center lg:border-l lg:pl-3 xl:pl-5 border-[#EDEDED] flex-shrink-0">
            <div className="flex items-center group cursor-pointer lg:mr-2 xl:mr-5 p-0.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="relative w-7 h-7 lg:w-9 lg:h-9 lg:mr-2 flex-shrink-0">
                <Image 
                  src={userImage} 
                  alt={userName} 
                  fill
                  sizes="(max-width: 768px) 28px, 36px"
                  priority
                  className="rounded-full object-cover border-2 border-white group-hover:border-[#01F0D0] transition-all" 
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden min-[1300px]:flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] xl:text-xs font-black text-[#072635] leading-tight whitespace-nowrap">{userName}</span>
                  <ChevronDown size={10} className="text-[#707070]" />
                </div>
                <span className="text-[8px] xl:text-[9px] text-[#707070] font-bold uppercase tracking-wider truncate max-w-[120px]">
                  {gender}, {age} Years Old
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-1.5 lg:p-2 bg-red-50 text-red-600 rounded-lg lg:rounded-xl hover:bg-red-600 hover:text-white transition-all flex-shrink-0"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[70px] bg-black/20 backdrop-blur-sm lg:hidden z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-[80px] left-4 right-4 bg-white border border-[#EDEDED] p-4 flex flex-col space-y-2 lg:hidden shadow-2xl rounded-3xl z-50 origin-top"
            >
              <NavLink href="/overview" icon={<Home size={20} />} label="Overview" active={pathname === '/overview'} onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink href="/" icon={<Users size={20} />} label="Patients" active={pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink href="/schedule" icon={<Calendar size={20} />} label="Schedule" active={pathname === '/schedule'} onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink href="/messages" icon={<MessageSquare size={20} />} label="Message" active={pathname === '/messages'} onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink href="/transactions" icon={<CreditCard size={20} />} label="Transactions" active={pathname === '/transactions'} onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-2xl text-sm font-bold text-[#072635]">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-2xl text-sm font-bold text-[#072635]">
                  <HelpCircle size={18} />
                  <span>Support</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ href, icon, label, active = false, onClick }: { href: string, icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center space-x-1.5 px-2.5 lg:px-3 xl:px-4 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl cursor-pointer transition-all duration-300 group relative ${
      active 
        ? 'bg-[#01F0D0] text-[#072635] shadow-sm' 
        : 'text-[#072635] hover:bg-[#F6F7F8]'
    }`}>
      <span className={`${active ? 'scale-105' : 'group-hover:scale-105'} transition-transform duration-300`}>{icon}</span>
      <span className={`text-[10px] xl:text-[11px] font-black tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{label}</span>
      
      {active && (
        <motion.div 
          layoutId="active-nav-glow"
          className="absolute inset-0 rounded-lg lg:rounded-xl bg-[#01F0D0] -z-10 blur-sm opacity-10"
        />
      )}
    </div>
  </Link>
);

const IconButton = ({ icon, className = "", badge = false }: { icon: React.ReactNode, className?: string, badge?: boolean }) => (
  <button className={`p-2 lg:p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635] relative group active:scale-90 ${className}`}>
    <span className="group-hover:scale-110 transition-transform block">{icon}</span>
    {badge && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm"></span>
    )}
  </button>
);

export default Navbar;
