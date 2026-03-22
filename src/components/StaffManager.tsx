import { useState } from 'react';
import { Staff, Message, Task, Event } from '../types';
import { Users, Send, CheckCircle2, Clock, AlertCircle, MessageSquare, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface StaffManagerProps {
  event: Event;
  staff: Staff[];
  messages: Message[];
  onSendMessage: (text: string, receiverId: string) => void;
  onAssignTask: (taskId: string, staffId: string) => void;
  onToggleTask: (taskId: string, eventId?: string) => void;
}

export function StaffManager({ event, staff, messages, onSendMessage, onAssignTask, onToggleTask }: StaffManagerProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [messageText, setMessageText] = useState('');

  const staffMessages = selectedStaff 
    ? messages.filter(m => 
        (m.senderId === 'manager' && m.receiverId === selectedStaff.id) || 
        (m.senderId === selectedStaff.id && m.receiverId === 'manager')
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const staffTasks = selectedStaff 
    ? event.tasks.filter(t => t.assigneeId === selectedStaff.id)
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedStaff) return;
    onSendMessage(messageText, selectedStaff.id);
    setMessageText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
      {/* Staff List */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-black/5 bg-gray-50">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Users size={16} /> Staff Members
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {staff.map(member => (
            <button
              key={member.id}
              onClick={() => setSelectedStaff(member)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                selectedStaff?.id === member.id 
                  ? "bg-black text-white shadow-md" 
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                  member.status === 'active' ? "bg-green-500" : "bg-gray-300"
                )} />
              </div>
              <div>
                <p className="text-sm font-bold truncate">{member.name}</p>
                <p className={cn(
                  "text-[10px] uppercase tracking-wider font-medium",
                  selectedStaff?.id === member.id ? "text-white/60" : "text-gray-400"
                )}>
                  {member.role}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat & Tasks */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedStaff ? (
          <>
            {/* Messaging */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-black/5 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <h3 className="font-bold text-sm">Chat with {selectedStaff.name}</h3>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                  selectedStaff.status === 'active' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                )}>
                  {selectedStaff.status}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {staffMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      msg.senderId === 'manager' 
                        ? "ml-auto bg-black text-white rounded-tr-none" 
                        : "mr-auto bg-white border border-black/5 rounded-tl-none shadow-sm"
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      msg.senderId === 'manager' ? "text-white/50" : "text-gray-400"
                    )}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {staffMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <MessageSquare size={32} strokeWidth={1} />
                    <p className="text-xs italic">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-black/5 bg-white flex gap-2">
                <input 
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black"
                />
                <button 
                  type="submit"
                  className="bg-black text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

            {/* Assigned Tasks */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-black/5 bg-gray-50">
                <h3 className="font-bold text-sm">Tasks for {selectedStaff.name}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Tasks</p>
                  {staffTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-black/5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onToggleTask(task.id, event.id)}
                          className={cn(
                            "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                            task.completed ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 hover:border-black"
                          )}
                        >
                          {task.completed ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock size={14} className="text-orange-500" />
                          )}
                        </button>
                        <span className={cn("text-sm font-medium", task.completed && "line-through text-gray-400")}>
                          {task.title}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        task.priority === 'high' ? "bg-red-100 text-red-600" : 
                        task.priority === 'medium' ? "bg-orange-100 text-orange-600" : 
                        "bg-blue-100 text-blue-600"
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {staffTasks.length === 0 && (
                    <p className="text-xs text-gray-400 italic py-4 text-center">No tasks assigned yet.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-black/5 space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign New Task</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {event.tasks.filter(t => !t.assigneeId).map(task => (
                      <button
                        key={task.id}
                        onClick={() => onAssignTask(task.id, selectedStaff.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-blue-50 border border-dashed border-blue-200 rounded-xl transition-colors text-left group"
                      >
                        <span className="text-sm font-medium text-blue-700">{task.title}</span>
                        <Plus size={16} className="text-blue-400 group-hover:text-blue-600" />
                      </button>
                    ))}
                    {event.tasks.filter(t => !t.assigneeId).length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center">All tasks are already assigned.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="md:col-span-2 bg-gray-50 rounded-2xl border border-dashed border-black/10 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Users size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="font-bold">Select a staff member</p>
              <p className="text-sm">Choose a member from the left to start chatting or assign tasks.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
