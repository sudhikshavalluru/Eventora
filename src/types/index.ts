export type EventType = 'personal' | 'professional' | 'club' | 'comedy' | 'music' | 'other';

export interface Guest {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  tableId?: string;
  seatId?: string;
  registrationDate?: string;
}

export interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  status: 'planned' | 'paid';
}

export interface Revenue {
  id: string;
  category: string;
  name: string;
  amount: number;
  status: 'projected' | 'received';
}

export type UserRole = 'manager' | 'customer' | 'staff';

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'offline';
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'contacted' | 'booked' | 'completed';
}

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
}

export interface SeatingTable {
  id: string;
  x: number;
  y: number;
  name: string;
  capacity: number;
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  isPublic: boolean;
  price?: number;
  budget: {
    total: number;
    expenses: Expense[];
    revenues: Revenue[];
  };
  guests: Guest[];
  tasks: Task[];
  vendors: Vendor[];
  timeline: TimelineItem[];
  seating: {
    tables: SeatingTable[];
  };
}
