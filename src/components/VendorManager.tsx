import { useState } from 'react';
import { Vendor } from '../types';
import { Plus, Truck, Phone, Mail, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

interface VendorManagerProps {
  vendors: Vendor[];
  onUpdate: (vendors: Vendor[]) => void;
}

export function VendorManager({ vendors, onUpdate }: VendorManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', category: '', contact: '' });

  const handleAdd = () => {
    if (!newVendor.name) return;
    const vendor: Vendor = {
      id: Math.random().toString(36).substr(2, 9),
      name: newVendor.name,
      category: newVendor.category || 'General',
      contact: newVendor.contact,
      status: 'contacted'
    };
    onUpdate([...vendors, vendor]);
    setNewVendor({ name: '', category: '', contact: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(vendors.filter(v => v.id !== id));
  };

  const handleStatusChange = (id: string, status: Vendor['status']) => {
    onUpdate(vendors.map(v => v.id === id ? { ...v, status } : v));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Vendor Directory</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Vendor Name</label>
              <input 
                type="text"
                value={newVendor.name}
                onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                placeholder="e.g. Gourmet Catering"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
              <input 
                type="text"
                value={newVendor.category}
                onChange={e => setNewVendor({ ...newVendor, category: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                placeholder="e.g. Catering"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Info</label>
              <input 
                type="text"
                value={newVendor.contact}
                onChange={e => setNewVendor({ ...newVendor, contact: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                placeholder="Email or Phone"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-500">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium">Add Vendor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(vendor => (
          <div key={vendor.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Truck size={20} />
              </div>
              <select 
                value={vendor.status}
                onChange={(e) => handleStatusChange(vendor.id, e.target.value as Vendor['status'])}
                className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 border-none rounded-full px-2 py-1 focus:ring-0 cursor-pointer"
              >
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <h4 className="font-bold text-lg">{vendor.name}</h4>
            <p className="text-xs text-blue-600 font-medium mb-4">{vendor.category}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={14} />
                <span>{vendor.contact || 'No contact info'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <button className="text-xs font-bold text-gray-400 hover:text-[#1A1A1A] flex items-center gap-1">
                View Contract <ExternalLink size={12} />
              </button>
              <button 
                onClick={() => handleDelete(vendor.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">No vendors added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
