import { useState } from 'react';
import { Event, Staff, Message, Task } from '../types';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '../utils/cn';

interface StaffDashboardProps {
  events: Event[];
  staff: Staff[];
  messages: Message[];
  currentStaffId: string;
  onSendMessage: (text: string, receiverId: string) => void;
  onToggleTask: (taskId: string, eventId: string) => void;
  onSelectEvent: (id: string) => void;
}

export function StaffDashboard({ 
  events, 
  staff, 
  messages, 
  currentStaffId, 
  onSendMessage, 
  onToggleTask,
  onSelectEvent
}: StaffDashboardProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>('manager');
  const [messageText, setMessageText] = useState('');

  const currentStaff = staff.find(s => s.id === currentStaffId);
  
  // Get all tasks assigned to this staff across all events
  const myTasks = events.flatMap(event => 
    event.tasks
      .filter(task => task.assigneeId === currentStaffId)
      .map(task => ({ ...task, eventId: event.id, eventTitle: event.title }))
  );

  const chatMessages = messages.filter(m => 
    (m.senderId === currentStaffId && m.receiverId === selectedChatId) ||
    (m.senderId === selectedChatId && m.receiverId === currentStaffId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText, selectedChatId);
    setMessageText('');
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Staff Portal</h1>
        <p className="text-gray-400 font-medium">Welcome back, {currentStaff?.name}. Here are your assignments.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-green-500" /> My Tasks
              </h2>
              <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {myTasks.filter(t => !t.completed).length} Pending
              </span>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {myTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onToggleTask(task.id, task.eventId)}
                      className={cn(
                        "w-8 h-8 rounded-xl border flex items-center justify-center transition-all",
                        task.completed ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 hover:border-black"
                      )}
                    >
                      {task.completed ? <CheckCircle2 size={16} /> : <Clock size={16} className="text-orange-500" />}
                    </button>
                    <div>
                      <p className={cn("font-bold", task.completed && "line-through text-gray-400")}>
                        {task.title}
                      </p>
                      <button 
                        onClick={() => onSelectEvent(task.eventId)}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        {task.eventTitle}
                      </button>
                    </div>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs font-bold text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <p>No tasks assigned to you yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-black/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-500" /> My Schedule
              </h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.tasks.some(t => t.assigneeId === currentStaffId)).map(event => (
                <button 
                  key={event.id}
                  onClick={() => onSelectEvent(event.id)}
                  className="p-6 rounded-2xl border border-black/5 hover:border-black transition-all text-left space-y-4 group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={14} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Messaging Section */}
        <div className="space-y-6">
          <section className="bg-white rounded-[32px] border border-black/5 shadow-sm flex flex-col h-[600px]">
            <div className="p-6 border-b border-black/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="text-purple-500" /> Team Chat
              </h2>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Sidebar (Horizontal for mobile, vertical for desktop) */}
              <div className="p-4 border-b border-black/5 flex gap-2 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setSelectedChatId('manager')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                    selectedChatId === 'manager' ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  <Shield size={14} /> Manager
                </button>
                {staff.filter(s => s.id !== currentStaffId).map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setSelectedChatId(s.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                      selectedChatId === s.id ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden">
                      <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.senderId === currentStaffId ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-2 rounded-2xl text-sm",
                      msg.senderId === currentStaffId 
                        ? "bg-black text-white rounded-tr-none" 
                        : "bg-gray-100 text-black rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <MessageSquare size={32} strokeWidth={1} />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-black/5">
                <div className="relative">
                  <input 
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-2xl border border-black/5 focus:outline-none focus:border-black text-sm"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Shield({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
