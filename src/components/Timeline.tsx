import { useState } from 'react';
import { TimelineItem } from '../types';
import { Plus, Clock, MoreVertical, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../utils/cn';

interface TimelineProps {
  items: TimelineItem[];
  onUpdate: (items: TimelineItem[]) => void;
  isManager?: boolean;
}

export function Timeline({ items, onUpdate, isManager = true }: TimelineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ time: '', activity: '' });

  const handleAdd = () => {
    if (!isManager || !newItem.time || !newItem.activity) return;
    const item: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: newItem.time,
      activity: newItem.activity
    };
    onUpdate([...items, item].sort((a, b) => a.time.localeCompare(b.time)));
    setNewItem({ time: '', activity: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!isManager) return;
    onUpdate(items.filter(i => i.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Event Schedule</h3>
        {isManager && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} /> Add Activity
          </button>
        )}
      </div>

      {isAdding && isManager && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Time</label>
              <input 
                type="time"
                value={newItem.time}
                onChange={e => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Activity</label>
              <input 
                type="text"
                value={newItem.activity}
                onChange={e => setNewItem({ ...newItem, activity: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                placeholder="e.g. Opening Remarks"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-500">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium">Add to Schedule</button>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100" />
        
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id} className="relative flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10 shrink-0">
                <Clock size={16} className="text-gray-400" />
              </div>
              
              <div className="flex-1 bg-white p-4 rounded-2xl border border-black/5 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600">{item.time}</span>
                    <h4 className="font-bold mt-1">{item.activity}</h4>
                  </div>
                  {isManager && (
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 ml-16">
              <p className="text-sm text-gray-400">No schedule items yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
