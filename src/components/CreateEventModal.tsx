import { useState } from 'react';
import { Event, EventType } from '../types';
import { X, Calendar, Clock, MapPin, Type, Users, Globe, Lock, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface CreateEventModalProps {
  onConfirm: (details: Partial<Event>) => void;
  onClose: () => void;
}

export function CreateEventModal({ onConfirm, onClose }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('personal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [isPublic, setIsPublic] = useState(false);
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onConfirm({
      title,
      type,
      date,
      time,
      location,
      description,
      capacity,
      isPublic,
      price
    });
  };

  const eventTypes: { id: EventType; label: string }[] = [
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Pro' },
    { id: 'club', label: 'Club' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'music', label: 'Music' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Create New Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                autoFocus
                type="text"
                required
                placeholder="e.g., Summer Gala 2024"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="time"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacity</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number"
                  required
                  min="1"
                  value={capacity}
                  onChange={e => setCapacity(parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={e => setPrice(parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Venue name or address"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
                  !isPublic 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                    : 'bg-white text-gray-500 border-black/5 hover:border-black/20'
                }`}
              >
                <Lock size={14} /> Private
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
                  isPublic 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                    : 'bg-white text-gray-500 border-black/5 hover:border-black/20'
                }`}
              >
                <Globe size={14} /> Public
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Type</label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    type === t.id 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                      : 'bg-white text-gray-500 border-black/5 hover:border-black/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
            <textarea 
              placeholder="Briefly describe your event..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-black transition-colors h-24 resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 text-sm font-bold bg-[#1A1A1A] text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10"
            >
              Create Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
