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
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close notifications and profile dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = session?.user?.name || "Dr. Jose Simmons";
  const gender = (session?.user as any)?.gender || "Male";
  const userImageFromSession = (session?.user as any)?.image;
  
  // Default profile images
  const defaultImagePath = gender.toLowerCase() === "female" 
    ? "/images/avatar-female.svg" 
    : "/images/avatar-male.svg";
    
  // Use session image if available, otherwise use default
  const userImage = userImageFromSession || defaultImagePath;
  
  const dob = (session?.user as any)?.dateOfBirth;
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 35;

  return (
    <nav className="h-[60px] lg:h-[72px] bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-2xl border-b border-gray-100/50 fixed top-0 left-0 right-0 z-50 transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.05)] px-4">
      <div className="max-w-[1700px] mx-auto h-full flex items-center justify-between">
        {/* Left Section: Logo Text */}
        <div className="flex items-center min-w-0 flex-1">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 mr-3 text-[#072635] hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>

          <Link href="/" className="flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center group cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#01F0D0] to-[#01b89d] flex items-center justify-center shadow-lg shadow-[#01F0D0]/30">
                    <span className="text-white font-black text-sm lg:text-base">H</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#01F0D0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="hidden sm:flex flex-col group-hover:opacity-75 transition-opacity">
                  <span className="text-[10px] lg:text-xs font-black text-[#072635] leading-tight tracking-widest">HEALTH</span>
                  <span className="text-[8px] lg:text-[9px] font-bold text-[#01F0D0] tracking-wider">CARE</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="hidden lg:flex items-center justify-center flex-[3] px-2">
          <div className="flex items-center gap-1 xl:gap-2">
            <NavLink href="/overview" icon={<Home size={16} />} label="Overview" active={pathname === '/overview'} />
            <NavLink href="/" icon={<Users size={16} />} label="Patients" active={pathname === '/'} />
            <NavLink href="/schedule" icon={<Calendar size={16} />} label="Schedule" active={pathname === '/schedule'} />
            <NavLink href="/messages" icon={<MessageSquare size={16} />} label="Message" active={pathname === '/messages'} />
            <NavLink href="/transactions" icon={<CreditCard size={16} />} label="Transactions" active={pathname === '/transactions'} />
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex-1 flex items-center justify-end space-x-2 lg:space-x-3 xl:space-x-4 min-w-0">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <IconButton icon={<Search size={16} />} title="Search" />
            <div className="relative" ref={notificationsRef}>
              <IconButton 
                icon={<Bell size={16} />} 
                badge 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
              />
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-right"
                  >
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/50">
                      <h3 className="text-sm font-bold text-[#072635]">Notifications</h3>
                      <button className="text-xs text-[#01F0D0] font-bold uppercase tracking-wide hover:text-[#01d6ba] transition-colors">Mark all</button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                      {[
                        { title: 'New Appointment', desc: 'Ryan Johnson requested an appointment for tomorrow.', time: '10 min ago', unread: true },
                        { title: 'Lab Results Ready', desc: 'Blood test results for Emily Williams are available.', time: '1 hour ago', unread: true },
                        { title: 'Message Received', desc: 'Jessica Taylor sent you a message.', time: 'Yesterday', unread: false }
                      ].map((n, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ backgroundColor: '#F9FAFB' }}
                          className={`p-4 border-b border-gray-100/50 cursor-pointer transition-all ${n.unread ? 'bg-[#01F0D0]/5' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-[#072635]">{n.title}</span>
                              {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#01F0D0]"></div>}
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-600">{n.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3.5 text-center border-t border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer">
                      <span className="text-xs font-bold text-[#072635]">View All Notifications</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/settings">
              <IconButton icon={<Settings size={16} />} className="hidden sm:block" title="Settings" />
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center lg:border-l lg:pl-4 xl:pl-6 border-gray-200 flex-shrink-0" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center group cursor-pointer py-1 px-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 lg:mr-3 flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-[#01F0D0] group-hover:shadow-md group-hover:shadow-[#01F0D0]/30 transition-all duration-300">
                {userImage.endsWith('.svg') ? (
                  <img 
                    src={userImage} 
                    alt={userName} 
                    className="w-full h-full object-cover bg-gray-100"
                  />
                ) : (
                  <Image 
                    src={userImage} 
                    alt={userName} 
                    fill
                    sizes="(max-width: 768px) 32px, 40px"
                    priority
                    className="object-cover"
                  />
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#072635] leading-tight whitespace-nowrap">{userName}</span>
                  <motion.div
                    animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={14} className="text-gray-400" />
                  </motion.div>
                </div>
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wide">
                  {gender} • {age} yrs
                </span>
              </div>
            </motion.button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-[#01F0D0]/10 to-transparent border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        {userImage.endsWith('.svg') ? (
                          <img 
                            src={userImage} 
                            alt={userName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image 
                            src={userImage} 
                            alt={userName} 
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#072635] truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link href="/settings" onClick={() => setIsProfileDropdownOpen(false)}>
                      <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Settings size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Profile Settings</span>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <HelpCircle size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Get Help</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 p-2">
                    <motion.button
                      whileHover={{ backgroundColor: '#FEE2E2' }}
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Logout button for mobile */}
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 lg:hidden bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex-shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
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
              className="fixed inset-0 top-[70px] bg-black/30 backdrop-blur-sm lg:hidden z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-[75px] left-3 right-3 bg-white border border-gray-200 p-5 flex flex-col space-y-3 lg:hidden shadow-2xl rounded-2xl z-50 origin-top"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Navigation</p>
                <NavLink href="/overview" icon={<Home size={18} />} label="Overview" active={pathname === '/overview'} onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink href="/" icon={<Users size={18} />} label="Patients" active={pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink href="/schedule" icon={<Calendar size={18} />} label="Schedule" active={pathname === '/schedule'} onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink href="/messages" icon={<MessageSquare size={18} />} label="Message" active={pathname === '/messages'} onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink href="/transactions" icon={<CreditCard size={18} />} label="Transactions" active={pathname === '/transactions'} onClick={() => setIsMobileMenuOpen(false)} />
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-xs font-bold text-[#072635] hover:from-gray-100 hover:to-gray-200 transition-all">
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-xs font-bold text-[#072635] hover:from-gray-100 hover:to-gray-200 transition-all">
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
    <motion.div 
      whileHover={{ scale: active ? 1 : 1.02 }}
      className={`flex items-center space-x-2 px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl cursor-pointer transition-all duration-300 group relative ${
        active 
          ? 'bg-[#01F0D0] text-[#072635] shadow-md shadow-[#01F0D0]/20' 
          : 'text-[#072635] hover:bg-gray-100/60'
      }`}>
      <motion.span 
        animate={{ scale: active ? 1.1 : 1 }}
        className={`transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110'}`}
      >
        {icon}
      </motion.span>
      <span className={`text-xs xl:text-sm font-bold tracking-tight whitespace-nowrap ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{label}</span>
      
      {active && (
        <motion.div 
          layoutId="active-nav-glow"
          className="absolute inset-0 rounded-xl bg-[#01F0D0] -z-10 blur-lg opacity-20"
        />
      )}
    </motion.div>
  </Link>
);

const IconButton = ({ icon, className = "", badge = false, onClick, title = "" }: { icon: React.ReactNode, className?: string, badge?: boolean, onClick?: () => void, title?: string }) => (
  <motion.button 
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    title={title}
    className={`p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635] relative group active:scale-90 ${className}`}
  >
    <span className="group-hover:scale-110 transition-transform block">{icon}</span>
    {badge && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-md"
      ></motion.span>
    )}
  </motion.button>
);

export default Navbar;
