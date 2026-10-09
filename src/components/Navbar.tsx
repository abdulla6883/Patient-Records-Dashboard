"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, Settings, MessageSquare, Calendar, Home, Users, CreditCard, LogOut, Bell, HelpCircle, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

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
  const defaultImagePath = gender.toLowerCase() === "female"
    ? "/images/avatar-female.svg"
    : "/images/avatar-male.svg";
  const userImage = userImageFromSession || defaultImagePath;
  const dob = (session?.user as any)?.dateOfBirth;
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 35;

  return (
    <nav className="h-[60px] lg:h-[72px] bg-white/95 backdrop-blur border-b border-gray-100 fixed top-0 left-0 right-0 z-50 px-4">
      <div className="max-w-[1700px] mx-auto h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center min-w-0 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 mr-3 text-[#072635] hover:text-[#01F0D0] flex-shrink-0"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center group cursor-pointer">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#01F0D0] to-[#01b89d] flex items-center justify-center">
                <span className="text-white font-black text-sm lg:text-base">H</span>
              </div>
              <div className="hidden sm:flex flex-col ml-2">
                <span className="text-[10px] lg:text-xs font-black text-[#072635] leading-tight tracking-widest">HEALTH</span>
                <span className="text-[8px] lg:text-[9px] font-bold text-[#01F0D0] tracking-wider">CARE</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Middle: Nav Links */}
        <div className="hidden lg:flex items-center justify-center flex-[3] px-2">
          <div className="flex items-center gap-1 xl:gap-2">
            <NavLink href="/overview" icon={<Home size={16} />} label="Overview" active={pathname === '/overview'} />
            <NavLink href="/" icon={<Users size={16} />} label="Patients" active={pathname === '/'} />
            <NavLink href="/schedule" icon={<Calendar size={16} />} label="Schedule" active={pathname === '/schedule'} />
            <NavLink href="/messages" icon={<MessageSquare size={16} />} label="Message" active={pathname === '/messages'} />
            <NavLink href="/transactions" icon={<CreditCard size={16} />} label="Transactions" active={pathname === '/transactions'} />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex-1 flex items-center justify-end space-x-2 lg:space-x-3 xl:space-x-4 min-w-0">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <button className="p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635]" title="Search">
              <Search size={16} />
            </button>
            <div className="relative" ref={notificationsRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635] relative" title="Notifications">
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[340px] bg-white rounded-2xl shadow border border-gray-100 z-50 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#072635]">Notifications</h3>
                    <button className="text-xs text-[#01F0D0] font-bold uppercase">Mark all</button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {[
                      { title: 'New Appointment', desc: 'Ryan Johnson requested an appointment for tomorrow.', time: '10 min ago', unread: true },
                      { title: 'Lab Results Ready', desc: 'Blood test results for Emily Williams are available.', time: '1 hour ago', unread: true },
                      { title: 'Message Received', desc: 'Jessica Taylor sent you a message.', time: 'Yesterday', unread: false }
                    ].map((n, i) => (
                      <div key={i} className={`p-4 border-b border-gray-100/50 cursor-pointer ${n.unread ? 'bg-[#01F0D0]/5' : 'hover:bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-[#072635]">{n.title}</span>
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#01F0D0]"></div>}
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 text-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <span className="text-xs font-bold text-[#072635]">View All</span>
                  </div>
                </div>
              )}
            </div>
            <Link href="/settings">
              <button className="p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635] hidden sm:block" title="Settings">
                <Settings size={16} />
              </button>
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center lg:border-l lg:pl-4 xl:pl-6 border-gray-200 flex-shrink-0" ref={profileRef}>
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center group cursor-pointer py-1 px-2 rounded-xl hover:bg-gray-100">
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 lg:mr-3 flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-[#01F0D0]">
                {userImage.endsWith('.svg') ? (
                  <img src={userImage} alt={userName} className="w-full h-full object-cover bg-gray-100" />
                ) : (
                  <Image src={userImage} alt={userName} fill sizes="(max-width: 768px) 32px, 40px" priority className="object-cover" />
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#072635] leading-tight">{userName}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <span className="text-[9px] text-gray-500 font-medium uppercase">{gender} • {age} yrs</span>
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-2xl shadow border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-[#01F0D0]/10 to-transparent border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                      {userImage.endsWith('.svg') ? (
                        <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={userImage} alt={userName} fill className="object-cover" />
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
                    <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <Settings size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Profile Settings</span>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <HelpCircle size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Get Help</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-2">
                  <button onClick={() => { setIsProfileDropdownOpen(false); signOut({ callbackUrl: '/login' }); }} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

            <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-2 lg:hidden bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 top-[70px] bg-black/30 backdrop-blur-sm lg:hidden z-40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-[75px] left-3 right-3 bg-white border border-gray-200 p-5 flex flex-col space-y-3 lg:hidden shadow-xl rounded-2xl z-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Navigation</p>
            <NavLink href="/overview" icon={<Home size={18} />} label="Overview" active={pathname === '/overview'} onClick={() => setIsMobileMenuOpen(false)} />
            <NavLink href="/" icon={<Users size={18} />} label="Patients" active={pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
            <NavLink href="/schedule" icon={<Calendar size={18} />} label="Schedule" active={pathname === '/schedule'} onClick={() => setIsMobileMenuOpen(false)} />
            <NavLink href="/messages" icon={<MessageSquare size={18} />} label="Message" active={pathname === '/messages'} onClick={() => setIsMobileMenuOpen(false)} />
            <NavLink href="/transactions" icon={<CreditCard size={18} />} label="Transactions" active={pathname === '/transactions'} onClick={() => setIsMobileMenuOpen(false)} />
            <div className="pt-4 mt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
              <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-[#072635]">
                <Settings size={18} /><span>Settings</span>
              </Link>
              <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-[#072635]">
                <HelpCircle size={18} /><span>Support</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

const NavLink = ({ href, icon, label, active = false, onClick }: { href: string, icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center space-x-2 px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#01F0D0] text-[#072635]' : 'text-[#072635] hover:bg-gray-100/60'}`}>
      <span className={active ? 'scale-105' : 'group-hover:scale-110'}>{icon}</span>
      <span className={`text-xs xl:text-sm font-bold whitespace-nowrap ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      {active && <div className="absolute inset-0 rounded-xl bg-[#01F0D0] -z-10 blur-lg opacity-20" />}
    </div>
  </Link>
);

const IconButton = ({ icon, className = "", badge = false, onClick, title = "" }: { icon: React.ReactNode, className?: string, badge?: boolean, onClick?: () => void, title?: string }) => (
  <button onClick={onClick} title={title} className={`p-2.5 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all text-[#072635] relative ${className}`}>
    <span>{icon}</span>
    {badge && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
  </button>
);

export default Navbar;