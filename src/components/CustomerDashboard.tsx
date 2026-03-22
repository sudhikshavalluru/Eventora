import { Event, Guest } from '../types';
import { Calendar, MapPin, Ticket, Clock, Star, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface CustomerDashboardProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  userEmail: string;
}

export function CustomerDashboard({ events, onSelectEvent, userEmail }: CustomerDashboardProps) {
  const myEvents = events.filter(event => 
    event.isPublic &&
    event.guests.some(g => g.email === userEmail && g.status === 'confirmed')
  );

  const upcomingPublicEvents = events.filter(event => 
    event.isPublic && 
    !event.guests.some(g => g.email === userEmail) &&
    new Date(event.date) >= new Date()
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 rounded-3xl overflow-hidden bg-black flex items-center px-12">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-bold text-white">Welcome back!</h1>
          <p className="text-white/70 text-lg">Ready for your next experience?</p>
        </div>
      </div>

      {/* My Registered Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="text-blue-600" /> My Tickets
          </h2>
          <span className="text-sm font-medium text-gray-400">{myEvents.length} upcoming</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map(event => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="group bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all overflow-hidden text-left"
            >
              <div className="h-40 relative">
                <img 
                  src={`https://picsum.photos/seed/${event.id}/600/400`} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Confirmed
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <MapPin size={14} />
                    <span className="truncate max-w-[120px]">{event.location}</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
          {myEvents.length === 0 && (
            <div className="col-span-full py-12 bg-gray-50 rounded-3xl border border-dashed border-black/10 flex flex-col items-center justify-center text-gray-400 space-y-3">
              <Ticket size={40} strokeWidth={1} />
              <p className="font-medium">No tickets yet. Explore public events below!</p>
            </div>
          )}
        </div>
      </section>

      {/* Explore Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="text-yellow-500" /> Explore Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingPublicEvents.map(event => (
            <div 
              key={event.id}
              className="flex bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="w-1/3 relative">
                <img 
                  src={`https://picsum.photos/seed/${event.id}exp/400/600`} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{event.type}</p>
                  <p className="font-bold text-xl">${event.price || 'Free'}</p>
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">{event.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      <Calendar size={12} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      <Clock size={12} />
                      {event.time}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => onSelectEvent(event)}
                    className="flex-1 py-3 bg-gray-100 text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => onSelectEvent(event)}
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
