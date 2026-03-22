import { useState, useEffect } from 'react';
import { useEventStore } from './store/useEventStore';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EventDetails } from './components/EventDetails';
import { CalendarView } from './components/CalendarView';
import { CreateEventModal } from './components/CreateEventModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { StaffManager } from './components/StaffManager';
import { 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Shield, 
  ShoppingBag, 
  ArrowLeft,
  Users
} from 'lucide-react';
import { Event, UserRole, Staff, Message } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils/cn';

const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'Alex Rivera', role: 'Floor Manager', status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  { id: 's2', name: 'Sarah Chen', role: 'Event Coordinator', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 's3', name: 'Marcus Bell', role: 'Security Lead', status: 'offline', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: 's4', name: 'Elena Gomez', role: 'Catering Head', status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 's1', receiverId: 'manager', text: 'Floor is ready for the sound check.', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'm2', senderId: 'manager', receiverId: 's1', text: 'Great, I will be there in 10 minutes.', timestamp: new Date(Date.now() - 3500000).toISOString() },
];

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  const { events, selectedEvent, setSelectedEventId, addEvent, updateEvent, deleteEvent } = useEventStore();
  const [role, setRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<'dashboard' | 'event' | 'calendar' | 'staff'>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [currentStaffId, setCurrentStaffId] = useState<string>('s1');

  const userEmail = "2410030328@klh.edu.in";

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setView('event');
  };

  const handleCreateEvent = (details: Partial<Event>) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: details.title || 'New Event',
      type: details.type || 'personal',
      date: details.date || new Date().toISOString().split('T')[0],
      time: details.time || '12:00',
      location: details.location || '',
      description: details.description || '',
      capacity: details.capacity || 100,
      isPublic: details.isPublic || false,
      price: details.price || 0,
      budget: { total: 0, expenses: [], revenues: [] },
      guests: [],
      tasks: [],
      vendors: [],
      timeline: [],
      seating: { tables: [] }
    };
    addEvent(newEvent);
    handleSelectEvent(newEvent.id);
    setIsCreateModalOpen(false);
    addToast('Event created successfully!');
  };

  const handleSendMessage = (text: string, receiverId: string) => {
    const senderId = role === 'manager' ? 'manager' : currentStaffId;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    addToast('Message sent');
  };

  const handleAssignTask = (taskId: string, staffId: string) => {
    if (!events.length) return;
    const eventToUpdate = events[0]; // Default to first event for staff management
    const updatedTasks = eventToUpdate.tasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: staffId } : t
    );
    updateEvent({ ...eventToUpdate, tasks: updatedTasks });
    addToast('Task assigned');
  };

  const handleToggleTask = (taskId: string, eventId?: string) => {
    if (!events.length) return;
    const eventToUpdate = eventId ? events.find(e => e.id === eventId) : events[0];
    if (!eventToUpdate) return;
    
    const updatedTasks = eventToUpdate.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateEvent({ ...eventToUpdate, tasks: updatedTasks });
    addToast(updatedTasks.find(t => t.id === taskId)?.completed ? 'Task completed' : 'Task reopened');
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setRole('manager')}
            className="group bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Shield size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Manager</h2>
              <p className="text-gray-500">Organize events, manage staff, and track budgets.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-sm font-bold text-black group-hover:gap-4 transition-all">
              Enter Dashboard <ArrowLeft className="rotate-180" size={18} />
            </div>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setRole('customer')}
            className="group bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Customer</h2>
              <p className="text-gray-500">Discover events, book tickets, and view your schedule.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-4 transition-all">
              Explore Events <ArrowLeft className="rotate-180" size={18} />
            </div>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setRole('staff')}
            className="group bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Staff</h2>
              <p className="text-gray-500">View assigned tasks, chat with team, and update progress.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-sm font-bold text-purple-600 group-hover:gap-4 transition-all">
              Staff Portal <ArrowLeft className="rotate-180" size={18} />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        events={events} 
        onSelectEvent={handleSelectEvent}
        selectedEventId={selectedEvent?.id || null}
        role={role}
        userEmail={userEmail}
        onLogout={() => { setRole(null); setView('dashboard'); setSelectedEventId(null); }}
      />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && (
            role === 'manager' ? (
              <Dashboard 
                events={events} 
                onSelectEvent={handleSelectEvent} 
                onCreateEvent={() => setIsCreateModalOpen(true)}
              />
            ) : role === 'customer' ? (
              <CustomerDashboard 
                events={events} 
                onSelectEvent={(event) => handleSelectEvent(event.id)}
                userEmail={userEmail}
              />
            ) : (
              <StaffDashboard 
                events={events}
                staff={MOCK_STAFF}
                messages={messages}
                currentStaffId={currentStaffId}
                onSendMessage={handleSendMessage}
                onToggleTask={handleToggleTask}
                onSelectEvent={handleSelectEvent}
              />
            )
          )}
          
          {view === 'calendar' && (
            <CalendarView 
              events={events} 
              onSelectEvent={handleSelectEvent} 
            />
          )}

          {view === 'staff' && (
            <div className="space-y-8">
              <header className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight">Staff & Team</h1>
                <p className="text-gray-400 font-medium">Communicate with your team and assign tasks.</p>
              </header>
              {events.length > 0 ? (
                <StaffManager 
                  event={events[0]} 
                  staff={MOCK_STAFF}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onAssignTask={handleAssignTask}
                  onToggleTask={handleToggleTask}
                />
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <p>Create an event first to manage staff.</p>
                </div>
              )}
            </div>
          )}

          {view === 'event' && selectedEvent && (
            <EventDetails 
              event={selectedEvent} 
              onUpdate={(e) => {
                updateEvent(e);
                addToast('Changes saved');
              }} 
              onDelete={() => {
                deleteEvent(selectedEvent.id);
                setView('dashboard');
                addToast('Event deleted', 'error');
              }}
              onBack={() => setView('dashboard')}
              role={role}
              userEmail={userEmail}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {role === 'manager' && (
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A1A1A] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateEventModal 
            onConfirm={handleCreateEvent}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[200] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-black/5 min-w-[240px]",
                toast.type === 'success' ? "bg-white text-green-600" : "bg-white text-red-600"
              )}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold text-[#1A1A1A]">{toast.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
