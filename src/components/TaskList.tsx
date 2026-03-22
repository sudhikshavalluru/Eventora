import { useState } from 'react';
import { Task } from '../types';
import { Plus, CheckSquare, Square, Trash2, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onUpdate }: TaskListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      completed: false,
      dueDate: newTask.dueDate || undefined
    };
    onUpdate([...tasks, task]);
    setNewTask({ title: '', dueDate: '' });
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Preparation Checklist</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Task Title</label>
              <input 
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                placeholder="What needs to be done?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Due Date (Optional)</label>
              <input 
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-500">Cancel</button>
            <button onClick={handleAddTask} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium">Add Task</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedTasks.map(task => (
          <div 
            key={task.id} 
            className={cn(
              "flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm group transition-all",
              task.completed && "opacity-60"
            )}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-6 h-6 rounded-lg border flex items-center justify-center transition-colors",
                  task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-black"
                )}
              >
                {task.completed && <CheckSquare size={14} />}
              </button>
              <div>
                <p className={cn("text-sm font-medium", task.completed && "line-through")}>{task.title}</p>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                    <Calendar size={10} />
                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">No tasks yet. Start planning your event!</p>
          </div>
        )}
      </div>
    </div>
  );
}
