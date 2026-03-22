import { Calendar, Users, DollarSign, ArrowRight, Plus } from 'lucide-react';
import { Event } from '../types';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface DashboardProps {
  events: Event[];
  onSelectEvent: (id: string) => void;
  onCreateEvent: () => void;
}

export function Dashboard({ events, onSelectEvent, onCreateEvent }: DashboardProps) {
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const totalBudget = events.reduce((acc, e) => acc + e.budget.total, 0);
  const totalGuests = events.reduce((acc, e) => acc + e.guests.length, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-gray-500 mt-1">You have {upcomingEvents.length} upcoming events this month.</p>
        </div>
        <button 
          onClick={onCreateEvent}
          className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl font-medium hover:bg-black transition-colors"
        >
          <Plus size={18} />
          Create Event
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Calendar size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Events</p>
          <p className="text-2xl font-bold mt-1">{events.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
            <Users size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Guests</p>
          <p className="text-2xl font-bold mt-1">{totalGuests}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
            <DollarSign size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Managed Budget</p>
          <p className="text-2xl font-bold mt-1">${totalBudget.toLocaleString()}</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <button className="text-sm font-medium text-gray-500 hover:text-[#1A1A1A] flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectEvent(event.id)}
              className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    event.type === 'professional' ? 'bg-blue-50 text-blue-600' : 
                    event.type === 'club' ? 'bg-purple-50 text-purple-600' :
                    event.type === 'comedy' ? 'bg-yellow-50 text-yellow-600' :
                    event.type === 'music' ? 'bg-pink-50 text-pink-600' :
                    'bg-orange-50 text-orange-600'
                  )}>
                    {event.type}
                  </span>
                  <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{event.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-gray-400">{event.time}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-6">{event.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {event.guests.slice(0, 3).map((g, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                        {g.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {event.guests.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                        +{event.guests.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="font-bold text-[#1A1A1A]">{event.guests.filter(g => g.status === 'confirmed').length}</span> / {event.capacity} booked
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="text-sm font-bold">${event.budget.total.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
