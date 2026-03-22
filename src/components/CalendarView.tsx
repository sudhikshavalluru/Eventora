import { useState } from 'react';
import { Event } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { cn } from '../utils/cn';
import { motion } from 'motion/react';

interface CalendarViewProps {
  events: Event[];
  onSelectEvent: (id: string) => void;
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
            <p className="text-sm text-gray-500">You have {events.filter(e => isSameMonth(new Date(e.date), currentMonth)).length} events this month.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-xl transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-50/50 border-b border-black/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-black/5 last:border-r-0 transition-colors",
                !isSameMonth(day, currentMonth) && "bg-gray-50/30",
                isSameDay(day, new Date()) && "bg-blue-50/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                  isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-gray-400",
                  !isSameMonth(day, currentMonth) && "opacity-30"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all hover:scale-[1.02]",
                      event.type === 'professional' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                    )}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
