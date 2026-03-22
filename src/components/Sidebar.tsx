import { LayoutDashboard, Calendar, Users, Settings, Plus, ChevronRight, LogOut, Shield, ShoppingBag } from 'lucide-react';
import { Event, UserRole } from '../types';
import { cn } from '../utils/cn';

interface SidebarProps {
  currentView: 'dashboard' | 'event' | 'calendar' | 'staff';
  setView: (view: 'dashboard' | 'event' | 'calendar' | 'staff') => void;
  events: Event[];
  onSelectEvent: (id: string) => void;
  selectedEventId: string | null;
  role: UserRole;
  userEmail: string;
  onLogout: () => void;
}

export function Sidebar({ currentView, setView, events, onSelectEvent, selectedEventId, role, userEmail, onLogout }: SidebarProps) {
  const filteredEvents = role === 'manager' 
    ? events 
    : events.filter(e => e.isPublic && e.guests.some(g => g.email === userEmail && g.status === 'confirmed'));

  return (
    <aside className="w-72 bg-white border-r border-black/5 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold",
            role === 'manager' ? "bg-black" : role === 'staff' ? "bg-purple-600" : "bg-blue-600"
          )}>
            {role === 'manager' ? <Shield size={20} /> : role === 'staff' ? <Users size={20} /> : <ShoppingBag size={20} />}
          </div>
          <h1 className="text-xl font-bold tracking-tight">Evently</h1>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              currentView === 'dashboard' ? (role === 'manager' ? "bg-black text-white" : role === 'staff' ? "bg-purple-600 text-white" : "bg-blue-600 text-white") : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <LayoutDashboard size={18} />
            {role === 'manager' ? 'Dashboard' : role === 'staff' ? 'Staff Portal' : 'My Hub'}
          </button>
          
          {role === 'manager' && (
            <>
              <button
                onClick={() => setView('calendar')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  currentView === 'calendar' ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <Calendar size={18} />
                Calendar
              </button>
              <button
                onClick={() => setView('staff')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  currentView === 'staff' ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <Users size={18} />
                Staff & Team
              </button>
            </>
          )}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {role === 'manager' ? 'Your Events' : role === 'staff' ? 'My Assignments' : 'My Tickets'}
          </h2>
        </div>
        
        <div className="space-y-1">
          {filteredEvents.map(event => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group",
                selectedEventId === event.id && currentView === 'event'
                  ? "bg-gray-100 text-[#1A1A1A] font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  event.type === 'professional' ? "bg-blue-500" : "bg-orange-500"
                )} />
                <span className="truncate">{event.title}</span>
              </div>
              <ChevronRight size={14} className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                selectedEventId === event.id && "opacity-100"
              )} />
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-black/5 space-y-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            role === 'manager' ? "bg-black text-white" : role === 'staff' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
          )}>
            {role === 'manager' ? 'M' : role === 'staff' ? 'S' : 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{role === 'manager' ? 'Manager' : role === 'staff' ? 'Staff Member' : 'Customer'}</p>
            <p className="text-xs text-gray-500 truncate">
              {role === 'manager' ? 'manager@evently.com' : role === 'staff' ? 'staff@evently.com' : 'customer@evently.com'}
            </p>
          </div>
          <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
