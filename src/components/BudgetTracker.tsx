import { useState } from 'react';
import { Event, Expense, Revenue } from '../types';
import { PlusCircle, Trash2 } from 'lucide-react';

interface BudgetTrackerProps {
  event: Event;
  onUpdate: (budget: Event['budget']) => void;
}

export function BudgetTracker({ event, onUpdate }: BudgetTrackerProps) {
  const { budget } = event;
  const [newExpense, setNewExpense] = useState({ category: '', name: '', amount: '', status: 'planned' as Expense['status'] });
  const [newRevenue, setNewRevenue] = useState({ category: '', name: '', amount: '', status: 'projected' as Revenue['status'] });

  const totalExpenses = budget.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenues = budget.revenues.reduce((sum, r) => sum + r.amount, 0);
  const remaining = budget.total - totalExpenses;

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      category: newExpense.category || 'General',
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      status: newExpense.status,
    };
    onUpdate({ ...budget, expenses: [...budget.expenses, expense] });
    setNewExpense({ category: '', name: '', amount: '', status: 'planned' });
  };

  const addRevenue = () => {
    if (!newRevenue.name || !newRevenue.amount) return;
    const revenue: Revenue = {
      id: crypto.randomUUID(),
      category: newRevenue.category || 'General',
      name: newRevenue.name,
      amount: parseFloat(newRevenue.amount),
      status: newRevenue.status,
    };
    onUpdate({ ...budget, revenues: [...budget.revenues, revenue] });
    setNewRevenue({ category: '', name: '', amount: '', status: 'projected' });
  };

  const removeExpense = (id: string) =>
    onUpdate({ ...budget, expenses: budget.expenses.filter(e => e.id !== id) });

  const removeRevenue = (id: string) =>
    onUpdate({ ...budget, revenues: budget.revenues.filter(r => r.id !== id) });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Budget</p>
          <p className="text-3xl font-bold mt-1">${budget.total.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Expenses</p>
          <p className="text-3xl font-bold mt-1 text-red-500">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Remaining</p>
          <p className={`text-3xl font-bold mt-1 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <h3 className="font-bold">Expenses</h3>
          <div className="space-y-2">
            {budget.expenses.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.category} · {e.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">${e.amount.toLocaleString()}</span>
                  <button onClick={() => removeExpense(e.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {budget.expenses.length === 0 && <p className="text-sm text-gray-400">No expenses yet.</p>}
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
            <input className="input-base" placeholder="Name" value={newExpense.name} onChange={e => setNewExpense(p => ({ ...p, name: e.target.value }))} />
            <div className="flex gap-2">
              <input className="input-base flex-1" placeholder="Category" value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))} />
              <input className="input-base w-28" type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} />
              <select className="input-base" value={newExpense.status} onChange={e => setNewExpense(p => ({ ...p, status: e.target.value as Expense['status'] }))}>
                <option value="planned">Planned</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <button onClick={addExpense} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
              <PlusCircle size={16} /> Add Expense
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <h3 className="font-bold">Revenues</h3>
          <div className="space-y-2">
            {budget.revenues.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.category} · {r.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-green-600">${r.amount.toLocaleString()}</span>
                  <button onClick={() => removeRevenue(r.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {budget.revenues.length === 0 && <p className="text-sm text-gray-400">No revenues yet.</p>}
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
            <input className="input-base" placeholder="Name" value={newRevenue.name} onChange={e => setNewRevenue(p => ({ ...p, name: e.target.value }))} />
            <div className="flex gap-2">
              <input className="input-base flex-1" placeholder="Category" value={newRevenue.category} onChange={e => setNewRevenue(p => ({ ...p, category: e.target.value }))} />
              <input className="input-base w-28" type="number" placeholder="Amount" value={newRevenue.amount} onChange={e => setNewRevenue(p => ({ ...p, amount: e.target.value }))} />
              <select className="input-base" value={newRevenue.status} onChange={e => setNewRevenue(p => ({ ...p, status: e.target.value as Revenue['status'] }))}>
                <option value="projected">Projected</option>
                <option value="received">Received</option>
              </select>
            </div>
            <button onClick={addRevenue} className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800">
              <PlusCircle size={16} /> Add Revenue
            </button>
          </div>
          <div className="pt-2 border-t border-black/5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-green-600 mt-1">${totalRevenues.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
