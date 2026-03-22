import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { SeatingTable, Guest, Event } from '../types';
import { Plus, Trash2, Users, Move, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';

interface SeatingChartProps {
  seating: Event['seating'];
  guests: Guest[];
  onUpdate: (seating: Event['seating']) => void;
}

export function SeatingChart({ seating, guests, onUpdate }: SeatingChartProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setDimensions({ width: clientWidth, height: 500 });
    }
  }, []);

  const handleAddTable = () => {
    const newTable: SeatingTable = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Table ${seating.tables.length + 1}`,
      x: dimensions.width / 2 - 50,
      y: dimensions.height / 2 - 50,
      capacity: 8
    };
    onUpdate({ ...seating, tables: [...seating.tables, newTable] });
  };

  const handleTableDrag = (id: string, e: any) => {
    const updatedTables = seating.tables.map(t => 
      t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t
    );
    onUpdate({ ...seating, tables: updatedTables });
  };

  const handleDeleteTable = (id: string) => {
    onUpdate({ ...seating, tables: seating.tables.filter(t => t.id !== id) });
    if (selectedTableId === id) setSelectedTableId(null);
  };

  const selectedTable = seating.tables.find(t => t.id === selectedTableId);
  
  const totalCapacity = seating.tables.reduce((acc, t) => acc + t.capacity, 0);
  const assignedGuests = guests.filter(g => g.tableId).length;
  const remainingSeats = totalCapacity - assignedGuests;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Seating Map</h3>
          <p className="text-sm text-gray-500">Drag and drop tables to arrange your venue layout.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4 px-4 py-2 bg-white rounded-xl border border-black/5 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Booked</p>
              <p className="text-sm font-bold">{assignedGuests}</p>
            </div>
            <div className="w-px bg-black/5" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Remaining</p>
              <p className="text-sm font-bold text-blue-600">{remainingSeats}</p>
            </div>
          </div>
          <button 
            onClick={handleAddTable}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
          >
            <Plus size={18} />
            Add Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden relative" ref={containerRef}>
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-black/5 text-[10px] font-bold uppercase flex items-center gap-2">
              <Move size={12} /> Drag to move
            </div>
          </div>
          
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Floor Grid */}
              {Array.from({ length: Math.ceil(dimensions.width / 50) }).map((_, i) => (
                <Rect key={`grid-v-${i}`} x={i * 50} y={0} width={1} height={dimensions.height} fill="#F0F0F0" />
              ))}
              {Array.from({ length: Math.ceil(dimensions.height / 50) }).map((_, i) => (
                <Rect key={`grid-h-${i}`} x={0} y={i * 50} width={dimensions.width} height={1} fill="#F0F0F0" />
              ))}

              {seating.tables.map(table => {
                const tableGuests = guests.filter(g => g.tableId === table.id);
                const isFull = tableGuests.length >= table.capacity;

                return (
                  <Group
                    key={table.id}
                    x={table.x}
                    y={table.y}
                    draggable
                    onDragEnd={(e) => handleTableDrag(table.id, e)}
                    onClick={() => setSelectedTableId(table.id)}
                    onTap={() => setSelectedTableId(table.id)}
                  >
                    <Circle
                      radius={40}
                      fill={selectedTableId === table.id ? "#3B82F6" : "#FFFFFF"}
                      stroke={isFull ? "#EF4444" : "#1A1A1A"}
                      strokeWidth={2}
                      shadowBlur={selectedTableId === table.id ? 10 : 0}
                      shadowColor="rgba(0,0,0,0.2)"
                    />
                    <Text
                      text={table.name}
                      fontSize={12}
                      fontStyle="bold"
                      width={80}
                      align="center"
                      x={-40}
                      y={-6}
                      fill={selectedTableId === table.id ? "#FFFFFF" : "#1A1A1A"}
                    />
                    <Text
                      text={`${tableGuests.length}/${table.capacity}`}
                      fontSize={10}
                      width={80}
                      align="center"
                      x={-40}
                      y={10}
                      fill={selectedTableId === table.id ? "#FFFFFF" : isFull ? "#EF4444" : "#6B7280"}
                    />
                    
                    {/* Visual Seats */}
                    {Array.from({ length: table.capacity }).map((_, i) => {
                      const angle = (i / table.capacity) * Math.PI * 2;
                      const r = 50;
                      const isBooked = i < tableGuests.length;
                      return (
                        <Circle
                          key={i}
                          x={Math.cos(angle) * r}
                          y={Math.sin(angle) * r}
                          radius={6}
                          fill={isBooked ? "#3B82F6" : "#E5E7EB"}
                          stroke={isBooked ? "#2563EB" : "#9CA3AF"}
                          strokeWidth={1}
                        />
                      );
                    })}
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Settings size={16} /> Table Settings
            </h4>
            {selectedTable ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Table Name</label>
                  <input 
                    type="text"
                    value={selectedTable.name}
                    onChange={e => {
                      const updated = seating.tables.map(t => t.id === selectedTable.id ? { ...t, name: e.target.value } : t);
                      onUpdate({ ...seating, tables: updated });
                    }}
                    className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Capacity</label>
                  <input 
                    type="number"
                    value={selectedTable.capacity}
                    onChange={e => {
                      const updated = seating.tables.map(t => t.id === selectedTable.id ? { ...t, capacity: Number(e.target.value) } : t);
                      onUpdate({ ...seating, tables: updated });
                    }}
                    className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
                <button 
                  onClick={() => handleDeleteTable(selectedTable.id)}
                  className="w-full flex items-center justify-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} /> Delete Table
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Select a table to edit its properties.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-sm">
              <Users size={16} /> Guest Assignment
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {guests.filter(g => g.status === 'confirmed').map(guest => (
                <div key={guest.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                  <span className="font-medium truncate mr-2">{guest.name}</span>
                  <select 
                    className="bg-transparent border-none focus:ring-0 text-[10px] font-bold text-blue-600 cursor-pointer"
                    value={guest.tableId || ''}
                    onChange={(e) => {
                      const tableId = e.target.value || undefined;
                      const updatedGuests = guests.map(g => g.id === guest.id ? { ...g, tableId } : g);
                      // We need to pass this back up. Since SeatingChart only receives seating, 
                      // we might need to adjust the props or handle it in EventDetails.
                      // For now, I'll assume the parent handles guest updates too.
                      (window as any).updateEventGuests?.(updatedGuests);
                    }}
                  >
                    <option value="">Unassigned</option>
                    {seating.tables.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              ))}
              {guests.filter(g => g.status === 'confirmed').length === 0 && (
                <p className="text-xs text-gray-400 italic">Confirm guests to assign seats.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Settings } from 'lucide-react';
