import { Event } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface AnalyticsProps {
  event: Event;
}

export function Analytics({ event }: AnalyticsProps) {
  const guestStats = [
    { name: 'Confirmed', value: event.guests.filter(g => g.status === 'confirmed').length, color: '#10B981' },
    { name: 'Pending', value: event.guests.filter(g => g.status === 'pending').length, color: '#F59E0B' },
    { name: 'Declined', value: event.guests.filter(g => g.status === 'declined').length, color: '#EF4444' },
  ];

  const taskStats = {
    total: event.tasks.length,
    completed: event.tasks.filter(t => t.completed).length,
    percent: event.tasks.length > 0 ? Math.round((event.tasks.filter(t => t.completed).length / event.tasks.length) * 100) : 0
  };

  const budgetStats = {
    total: event.budget.total,
    spent: event.budget.expenses.reduce((acc, e) => acc + e.amount, 0),
    percent: event.budget.total > 0 ? Math.round((event.budget.expenses.reduce((acc, e) => acc + e.amount, 0) / event.budget.total) * 100) : 0
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase">Guest RSVP Rate</h4>
            <Users size={18} className="text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">
              {event.guests.length > 0 ? Math.round((event.guests.filter(g => g.status === 'confirmed').length / event.guests.length) * 100) : 0}%
            </p>
            <span className="text-xs text-green-500 font-bold mb-1">Confirmed</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase">Task Completion</h4>
            <TrendingUp size={18} className="text-purple-500" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{taskStats.percent}%</p>
            <span className="text-xs text-purple-500 font-bold mb-1">{taskStats.completed} / {taskStats.total}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase">Budget Utilization</h4>
            <DollarSign size={18} className="text-green-500" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{budgetStats.percent}%</p>
            <span className="text-xs text-green-500 font-bold mb-1">${budgetStats.spent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h4 className="font-bold mb-8">Guest Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={guestStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {guestStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h4 className="font-bold mb-6">Preparation Health</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tasks Completed</span>
                <span className="font-bold">{taskStats.completed} / {taskStats.total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${taskStats.percent}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget Allocated</span>
                <span className="font-bold">${budgetStats.spent.toLocaleString()} / ${budgetStats.total.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${budgetStats.percent}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vendors Booked</span>
                <span className="font-bold">{event.vendors.filter(v => v.status === 'booked' || v.status === 'completed').length} / {event.vendors.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${event.vendors.length > 0 ? (event.vendors.filter(v => v.status === 'booked' || v.status === 'completed').length / event.vendors.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
