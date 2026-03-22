import { useState } from 'react';
import { Guest } from '../types';
import { Plus, Search, Mail, MoreVertical, Trash2, Check, X, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

interface GuestListProps {
  guests: Guest[];
  onUpdate: (guests: Guest[]) => void;
}

export function GuestList({ guests, onUpdate }: GuestListProps) {
  const [search, setSearch] = useState('');

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-black/5 rounded-xl focus:outline-none focus:border-black text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-black/5">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filteredGuests.map(guest => (
              <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{guest.name}</p>
                      <p className="text-xs text-gray-400">{guest.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {guest.status === 'confirmed' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check size={12} /> Confirmed
                      </span>
                    )}
                    {guest.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    {guest.status === 'declined' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        <X size={12} /> Declined
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-400">
                    {guest.registrationDate 
                      ? `Registered on ${new Date(guest.registrationDate).toLocaleDateString()}`
                      : 'Manually added'}
                  </p>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">
                  No guests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
