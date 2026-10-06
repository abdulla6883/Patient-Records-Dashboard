import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface Appointment {
  id: string;
  patient: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

interface EditAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_OPTIONS = ['Scheduled', 'Completed', 'Cancelled'];

const EditAppointmentModal = ({
  appointment,
  isOpen,
  onClose,
  onUpdated,
}: EditAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    patient: '',
    service: '',
    date: '',
    time: '',
    status: 'Scheduled',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  // Populate form when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        patient: appointment.patient,
        service: appointment.service,
        date: (appointment.date || '').slice(0, 10), // YYYY-MM-DD
        time: appointment.time,
        status: appointment.status,
      });
      setError('');
      setShowDeleteConfirm(false);
    }
  }, [appointment]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to update appointment.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!appointment) return;
    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to delete appointment.');
        setShowDeleteConfirm(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-lg shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#072635]">Edit Appointment</h2>
              <p className="text-xs text-[#707070] mt-0.5">Update details for this appointment</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-50 text-[#072635] hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Patient Name */}
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1.5">
                Patient Name
              </label>
              <input
                required
                value={formData.patient}
                onChange={e => setFormData({ ...formData, patient: e.target.value })}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. Jessica Taylor"
              />
            </div>

            {/* Service */}
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1.5">
                Service
              </label>
              <input
                required
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                placeholder="e.g. General Checkup"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1.5">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F7F8] rounded-xl outline-none focus:ring-2 focus:ring-[#01F0D0] transition-all text-[#072635] font-bold"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      formData.status === s
                        ? s === 'Completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : s === 'Cancelled'
                          ? 'bg-red-100 text-red-600 border-red-200'
                          : 'bg-blue-100 text-blue-600 border-blue-200'
                        : 'bg-[#F6F7F8] text-[#707070] border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between">
              {/* Delete */}
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                    <AlertTriangle size={14} />
                    <span>Sure?</span>
                  </div>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all flex items-center gap-1.5"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : null}
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 text-[#707070] rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Save */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-[#707070] hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#01F0D0] rounded-full text-sm font-extrabold text-[#072635] hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditAppointmentModal;
