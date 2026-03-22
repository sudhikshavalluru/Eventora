import { useState } from 'react';
import { Event, Guest, Expense, Task, Vendor, TimelineItem, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Users, DollarSign, Map, CheckSquare, 
  Truck, Clock, BarChart3, Trash2, Save, Calendar, MapPin, Globe, ShoppingBag
} from 'lucide-react';
import { GuestList } from './GuestList';
import { BudgetTracker } from './BudgetTracker';
import { SeatingChart } from './SeatingChart';
import { TaskList } from './TaskList';
import { VendorManager } from './VendorManager';
import { Timeline } from './Timeline';
import { Analytics } from './Analytics';
import { RegistrationManager } from './RegistrationManager';
import { cn } from '../utils/cn';

interface EventDetailsProps {
  event: Event;
  onUpdate: (event: Event) => void;
  onDelete: () => void;
  onBack: () => void;
  role: UserRole;
  userEmail?: string;
}

type Tab = 'overview' | 'registration' | 'guests' | 'budget' | 'seating' | 'tasks' | 'vendors' | 'timeline' | 'analytics';

export function EventDetails({ event, onUpdate, onDelete, onBack, role, userEmail }: EventDetailsProps) {
  const isManager = role === 'manager';
  const isStaff = role === 'staff';
  const isCustomer = role === 'customer';

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleSave = () => {
    onUpdate(editedEvent);
    setIsEditing(false);
  };

  const tabs = ([
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'registration', label: 'Registration', icon: Globe },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'seating', label: 'Seating', icon: Map },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'vendors', label: 'Vendors', icon: Truck },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const).filter(tab => {
    if (isManager) return true;
    if (isStaff) return !['budget', 'registration', 'analytics'].includes(tab.id);
    return ['overview', 'registration', 'timeline'].includes(tab.id);
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            {isEditing ? (
              <input 
                type="text"
                value={editedEvent.title}
                onChange={e => setEditedEvent({ ...editedEvent, title: e.target.value })}
                className="text-3xl font-bold tracking-tight bg-transparent border-b border-black/10 focus:outline-none focus:border-black"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            )}
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
              {isEditing ? (
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <input 
                      type="date"
                      value={editedEvent.date}
                      onChange={e => setEditedEvent({ ...editedEvent, date: e.target.value })}
                      className="bg-transparent border-b border-black/10 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <input 
                      type="time"
                      value={editedEvent.time}
                      onChange={e => setEditedEvent({ ...editedEvent, time: e.target.value })}
                      className="bg-transparent border-b border-black/10 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <input 
                      type="text"
                      placeholder="Location"
                      value={editedEvent.location}
                      onChange={e => setEditedEvent({ ...editedEvent, location: e.target.value })}
                      className="bg-transparent border-b border-black/10 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{event.location || 'No location set'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isManager && (
            isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Edit Details
                </button>
                <button 
                  onClick={onDelete}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )
          )}
        </div>
      </header>

      <div className="flex items-center gap-1 border-b border-black/5 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h3 className="font-bold mb-4">Description</h3>
                    {isEditing ? (
                      <textarea 
                        value={editedEvent.description}
                        onChange={e => setEditedEvent({ ...editedEvent, description: e.target.value })}
                        className="w-full h-32 p-3 rounded-xl border border-black/10 focus:outline-none focus:border-black resize-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {event.description || 'No description provided.'}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h3 className="font-bold mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">RSVPs</p>
                        <p className="text-xl font-bold mt-1">
                          {event.guests.filter(g => g.status === 'confirmed').length} / {event.capacity}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                        <p className="text-xl font-bold mt-1">
                          {event.isPublic ? 'Public' : 'Private'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isManager && !isStaff && event.isPublic && !event.guests.some(g => g.email === userEmail && g.status === 'confirmed') && (
                    <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">Ready to join?</h3>
                          <p className="text-blue-100 text-sm">Secure your spot for this event today.</p>
                        </div>
                        <ShoppingBag size={40} className="text-blue-400 opacity-50" />
                      </div>
                      <button 
                        onClick={() => setActiveTab('registration')}
                        className="mt-6 w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
                      >
                        Register Now
                      </button>
                    </div>
                  )}
                </div>
                {(isManager || isStaff) && (
                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                    <h3 className="font-bold mb-4">Recent Tasks</h3>
                    <div className="space-y-3">
                      {event.tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                          <button 
                            onClick={() => {
                              const updatedTasks = event.tasks.map(t => 
                                t.id === task.id ? { ...t, completed: !t.completed } : t
                              );
                              onUpdate({ ...event, tasks: updatedTasks });
                            }}
                            className={cn(
                              "w-5 h-5 rounded border flex items-center justify-center transition-all",
                              task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-black"
                            )}
                          >
                            {task.completed && <CheckSquare size={12} />}
                          </button>
                          <span className={cn("text-sm", task.completed && "line-through text-gray-400")}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                      {event.tasks.length === 0 && <p className="text-sm text-gray-400">No tasks yet.</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'registration' && (
              <RegistrationManager 
                event={event} 
                onUpdate={(guests) => onUpdate({ ...event, guests })} 
                isManager={isManager}
                userEmail={userEmail}
              />
            )}

            {activeTab === 'guests' && (
              <GuestList 
                guests={event.guests} 
                onUpdate={(guests) => onUpdate({ ...event, guests })} 
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTracker 
                event={event} 
                onUpdate={(budget) => onUpdate({ ...event, budget })} 
              />
            )}

            {activeTab === 'seating' && (
              <SeatingChart 
                seating={event.seating} 
                guests={event.guests}
                onUpdate={(seating) => onUpdate({ ...event, seating })} 
              />
            )}
            {/* Global helper for SeatingChart to update guests */}
            {(() => {
              (window as any).updateEventGuests = (guests: Guest[]) => onUpdate({ ...event, guests });
              return null;
            })()}

            {activeTab === 'tasks' && (
              <TaskList 
                tasks={event.tasks} 
                onUpdate={(tasks) => onUpdate({ ...event, tasks })} 
              />
            )}

            {activeTab === 'vendors' && (
              <VendorManager 
                vendors={event.vendors} 
                onUpdate={(vendors) => onUpdate({ ...event, vendors })} 
              />
            )}

            {activeTab === 'timeline' && (
              <Timeline 
                items={event.timeline} 
                onUpdate={(timeline) => onUpdate({ ...event, timeline })} 
                isManager={isManager}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics event={event} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
