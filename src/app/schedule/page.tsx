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
  ArrowLeft,
  User,
  Bell,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddAppointmentModal from '@/components/AddAppointmentModal';
import EditAppointmentModal from '@/components/EditAppointmentModal';

/* ── helpers ── */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

/** Return the Monday of the week containing `date` */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Build 7 Date objects starting from `monday` */
function buildWeek(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Format a Date as YYYY-MM-DD (local time) */
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format a 24-h time string like "14:30" → "2:30 PM" */
function formatTime(t: string): string {
  if (!t) return t;
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/* ── appointment colours cycling ── */
const CARD_COLORS = ['#E0F3FA', '#FFE6E9', '#D8FCF7', '#F4F0FE'];

/* ── component ── */
export default function SchedulePage() {
  /* ---------- clock state ---------- */
  const [now, setNow] = React.useState<Date | null>(null);

  // Hydrate clock on client only to avoid SSR mismatch
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------- alarm system ---------- */
  // Tracks "YYYY-MM-DD|HH:MM|appointmentId" keys already alerted this session
  const alertedRef = React.useRef<Set<string>>(new Set());
  const [toasts, setToasts] = React.useState<{ id: string; patient: string; service: string; time: string }[]>([]);

  // Request browser notification permission once on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Dismiss a toast
  const dismissToast = (id: string) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  // Send email via API + fire browser notification + vibrate + show in-app toast
  const fireAlarm = React.useCallback(async (apt: any) => {
    const key = `${(apt.date || '').slice(0, 10)}|${apt.time}|${apt.id}`;
    if (alertedRef.current.has(key)) return;
    alertedRef.current.add(key);

    // 1. Vibrate (mobile)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 300]);
    }

    // 2. Browser push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`🔔 Appointment Now: ${apt.patient}`, {
        body: `${apt.service} — ${formatTime(apt.time)}`,
        icon: '/favicon.ico',
      });
    }

    // 3. In-app toast
    setToasts(prev => [
      { id: key, patient: apt.patient, service: apt.service, time: apt.time },
      ...prev.slice(0, 4),
    ]);

    // 4. Email to admin
    try {
      await fetch('/api/appointments/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: apt.patient,
          service: apt.service,
          time: apt.time,
          date: apt.date,
        }),
      });
    } catch (err) {
      console.error('Alarm email failed:', err);
    }
  }, []);


  /* ---------- week / selected-day state ---------- */
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [weekStart, setWeekStart] = React.useState<Date>(() => getMondayOf(today));
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);

  const weekDays = React.useMemo(() => buildWeek(weekStart), [weekStart]);

  const weekLabel = React.useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.getMonth() === last.getMonth()) {
      return `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${MONTH_NAMES[first.getMonth()]} – ${MONTH_NAMES[last.getMonth()]} ${last.getFullYear()}`;
  }, [weekDays]);

  const prevWeek = () => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  /* ---------- appointments ---------- */
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAppointment, setEditingAppointment] = React.useState<any | null>(null);

  const fetchAppointments = () => {
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
  };

  React.useEffect(() => { fetchAppointments(); }, []);

  // Keep ref in sync with latest appointments (only when data changes, not on every clock tick)
  const appointmentsRef = React.useRef<any[]>([]);
  React.useEffect(() => { appointmentsRef.current = appointments; }, [appointments]);

  // Alarm watcher — checks every 30 s whether an appointment starts right now
  React.useEffect(() => {
    const check = () => {
      const current = new Date();
      const todayStr = toLocalDateStr(current);
      const nowHHMM = current.toTimeString().slice(0, 5); // "HH:MM"
      appointmentsRef.current.forEach(apt => {
        const aptDate = (apt.date || '').slice(0, 10);
        if (aptDate === todayStr && apt.time === nowHHMM) {
          fireAlarm(apt);
        }
      });
    };
    const id = setInterval(check, 30_000);
    check();
    return () => clearInterval(id);
  }, [fireAlarm]);

  const handleAddAppointment = async (data: any) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchAppointments();
      } else {
        const err = await res.json();
        alert('Failed: ' + (err.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* Filter appointments for the selected day */
  const selectedDateStr = toLocalDateStr(selectedDate);
  const dayAppointments = appointments.filter(apt => {
    const aptDate = (apt.date || '').slice(0, 10); // handles ISO strings like 2026-05-06T00:00:00.000Z
    return aptDate === selectedDateStr;
  });

  /* Sort by time */
  const sortedAppointments = [...dayAppointments].sort((a, b) =>
    (a.time || '').localeCompare(b.time || '')
  );

  /* ── clock display ── */
  const clockTime = now
    ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';
  const clockDate = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  /* ── next appointment from now ── */
  const nextAppointment = React.useMemo(() => {
    if (!now) return null;
    const todayStr = toLocalDateStr(now);
    const nowTime = now.toTimeString().slice(0, 5); // HH:MM
    return appointments
      .filter(a => {
        const aptDate = (a.date || '').slice(0, 10);
        return aptDate === todayStr && (a.time || '') >= nowTime;
      })
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))[0] ?? null;
  }, [appointments, now]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-[100px] lg:pt-[110px] pb-10 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* ── Calendar Column ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Header */}
          <div className="card p-4 lg:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 bg-gray-50 rounded-xl hover:bg-[#01F0D0]/10 transition-all text-[#072635] group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#072635]">Schedule</h1>
              <div className="hidden sm:flex items-center space-x-2 bg-[#F6F7F8] px-4 py-2 rounded-full">
                <CalendarIcon size={16} className="text-[#072635]" />
                <span className="text-sm font-bold text-[#072635]">{weekLabel}</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevWeek}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100"
                  aria-label="Previous week"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100"
                  aria-label="Next week"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-[#01F0D0] px-4 lg:px-6 py-2.5 rounded-full text-xs lg:text-sm font-extrabold text-[#072635] shadow-sm hover:shadow-[#01F0D0]/40 transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                <span>New Appointment</span>
              </button>
            </div>
          </div>

          {/* Week strip */}
          <div className="card bg-white p-4 lg:p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between mb-8 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              {weekDays.map((d, index) => {
                const isToday = toLocalDateStr(d) === toLocalDateStr(today);
                const isSelected = toLocalDateStr(d) === selectedDateStr;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(d)}
                    className="flex flex-col items-center space-y-3 flex-shrink-0 min-w-[50px] lg:flex-1 focus:outline-none"
                  >
                    <span className="text-[10px] lg:text-xs font-bold text-[#707070] uppercase tracking-widest">
                      {DAY_NAMES[d.getDay()]}
                    </span>
                    <div
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-extrabold text-sm lg:text-lg transition-all relative ${
                        isSelected
                          ? 'bg-[#01F0D0] text-[#072635] shadow-lg shadow-[#01F0D0]/30'
                          : isToday
                          ? 'ring-2 ring-[#01F0D0] text-[#072635] hover:bg-[#01F0D0]/10'
                          : 'hover:bg-gray-50 text-[#072635]'
                      }`}
                    >
                      {d.getDate()}
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#01F0D0]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Appointment list for selected day */}
            <div>
              <p className="text-xs font-bold text-[#707070] uppercase tracking-widest mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-12 text-[#707070]">
                  <div className="w-8 h-8 border-4 border-[#01F0D0] border-t-transparent rounded-full animate-spin mr-3" />
                  Loading…
                </div>
              ) : sortedAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-14 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#F6F7F8] flex items-center justify-center mb-4">
                    <CalendarIcon size={28} className="text-[#C0C0C0]" />
                  </div>
                  <p className="font-bold text-[#072635] mb-1">No appointments</p>
                  <p className="text-xs text-[#707070]">No appointments scheduled for this day.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-5 px-5 py-2.5 bg-[#01F0D0] text-[#072635] text-xs font-extrabold rounded-full hover:bg-[#01d9bc] transition-all"
                  >
                    + New Appointment
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {sortedAppointments.map((apt, index) => (
                    <motion.div
                      key={apt.id ?? index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="flex items-center space-x-3 lg:space-x-6 group"
                    >
                      <div className="w-16 lg:w-20 text-[10px] lg:text-sm font-bold text-[#707070] uppercase flex-shrink-0">
                        {formatTime(apt.time)}
                      </div>
                      <div
                        className="flex-1 p-3 lg:p-5 rounded-2xl lg:rounded-3xl flex items-center justify-between group-hover:shadow-md transition-all border border-transparent group-hover:border-white"
                        style={{ backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }}
                      >
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0 bg-gray-100 flex items-center justify-center">
                            <Image
                              src={`/${(apt.patient || '').split(' ')[0].toLowerCase()}.png`}
                              alt={apt.patient || 'Patient'}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={(e: any) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <User size={20} className="text-gray-400 absolute" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs lg:text-sm font-extrabold text-[#072635] truncate">{apt.patient}</span>
                            <div className="flex items-center space-x-2 text-[10px] lg:text-xs text-[#072635] opacity-60">
                              <Clock size={11} />
                              <span className="truncate">30 min • {apt.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span
                            className={`hidden sm:inline px-3 py-1 rounded-full text-[10px] font-bold ${
                              apt.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : apt.status === 'Cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {apt.status}
                          </span>
                          <button
                            onClick={() => setEditingAppointment(apt)}
                            className="p-2 hover:bg-white/50 rounded-full transition-all"
                            title="Edit appointment"
                          >
                            <MoreVertical size={18} className="text-[#072635]" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Info Column ── */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">

          {/* Live Clock Card */}
          <div className="card p-6 lg:p-8 bg-white overflow-hidden relative shadow-sm">
            {/* decorative glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#01F0D0]/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#01F0D0]/20 blur-2xl pointer-events-none" />

            <div className="flex items-center space-x-2 mb-4">
              <Clock size={16} className="text-[#01F0D0]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#707070]">Current Time</span>
            </div>

            <div className="font-extrabold text-4xl lg:text-5xl tracking-tight tabular-nums text-[#072635] mb-2">
              {now
                ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                : '--:--'}
              <span className="text-[#01F0D0] text-2xl lg:text-3xl ml-1">
                {now ? ':' + String(now.getSeconds()).padStart(2, '0') : ''}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#707070] mb-6">{clockDate}</p>

            {/* Next appointment today */}
            {nextAppointment ? (
              <div className="bg-[#F6F7F8] p-4 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-[#072635] uppercase tracking-widest">Next Today</p>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-[#01F0D0] rounded-xl flex items-center justify-center text-[#072635] flex-shrink-0">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#072635]">{nextAppointment.patient}</p>
                    <p className="text-[10px] text-[#707070]">{formatTime(nextAppointment.time)} • {nextAppointment.service}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F6F7F8] p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-[#072635] uppercase tracking-widest mb-1">Next Today</p>
                <p className="text-xs text-[#707070]">No more appointments today.</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card p-6 lg:p-8 bg-white shadow-sm">
            <h2 className="text-lg lg:text-xl font-extrabold text-[#072635] mb-4">Today's Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Today',
                  value: appointments.filter(a => (a.date || '').slice(0, 10) === toLocalDateStr(today)).length,
                  color: '#01F0D0',
                },
                {
                  label: 'This Week',
                  value: appointments.filter(a => {
                    const d = (a.date || '').slice(0, 10);
                    return d >= toLocalDateStr(weekDays[0]) && d <= toLocalDateStr(weekDays[6]);
                  }).length,
                  color: '#6C63FF',
                },
                {
                  label: 'Scheduled',
                  value: appointments.filter(a => a.status === 'Scheduled').length,
                  color: '#3B82F6',
                },
                {
                  label: 'Completed',
                  value: appointments.filter(a => a.status === 'Completed').length,
                  color: '#22C55E',
                },
              ].map(stat => (
                <div key={stat.label} className="bg-[#F6F7F8] rounded-2xl p-4 flex flex-col">
                  <span className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-[10px] font-bold text-[#707070] uppercase tracking-wider mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Requests */}
          <div className="card p-6 lg:p-8 bg-white shadow-sm">
            <h2 className="text-lg lg:text-xl font-extrabold text-[#072635] mb-4 lg:mb-6">Patient Requests</h2>
            <div className="space-y-6">
              {[
                { name: 'Alex Johnson', msg: 'Dr. Simmons, I need to reschedule my checkup…' },
                { name: 'Maria Garcia', msg: 'Requesting earliest available slot next week.' },
              ].map((req, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#F6F7F8] rounded-full flex items-center justify-center text-[#707070] flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#072635]">{req.name}</span>
                    <span className="text-[10px] lg:text-xs text-[#707070] truncate">{req.msg}</span>
                    <div className="flex space-x-2 mt-3">
                      <button className="px-4 py-1.5 bg-[#01F0D0] text-[#072635] rounded-full text-[10px] font-bold hover:bg-[#01d9bc] transition-all">Approve</button>
                      <button className="px-4 py-1.5 bg-[#F6F7F8] text-[#707070] rounded-full text-[10px] font-bold hover:bg-gray-200 transition-all">Decline</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAppointment}
      />

      <EditAppointmentModal
        appointment={editingAppointment}
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        onUpdated={() => { fetchAppointments(); setEditingAppointment(null); }}
      />

      {/* ── In-app alarm toasts ── */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-auto flex items-start gap-4 bg-[#072635] text-white px-5 py-4 rounded-2xl shadow-2xl max-w-sm w-full border border-[#01F0D0]/30"
          >
            <div className="w-10 h-10 rounded-xl bg-[#01F0D0] flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bell size={18} className="text-[#072635]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#01F0D0] uppercase tracking-widest mb-0.5">Appointment Now</p>
              <p className="text-sm font-extrabold truncate">{toast.patient}</p>
              <p className="text-xs text-white/60 truncate">{toast.service} · {formatTime(toast.time)}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="mt-0.5 p-1.5 rounded-full hover:bg-white/10 transition-all flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} className="text-white/60" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
