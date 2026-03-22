import { Event } from '../types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Tech Innovators Conference 2026',
    type: 'professional',
    date: '2026-06-15',
    time: '09:00',
    location: 'Grand Ballroom, Silicon Valley Hotel',
    description: 'Annual gathering of tech leaders and innovators to discuss the future of AI and sustainable technology.',
    capacity: 500,
    isPublic: true,
    budget: {
      total: 50000,
      expenses: [
        { id: 'e1', category: 'Venue', name: 'Ballroom Rental', amount: 15000, status: 'paid' },
        { id: 'e2', category: 'Catering', name: 'Lunch & Coffee Breaks', amount: 12000, status: 'planned' },
        { id: 'e3', category: 'Marketing', name: 'Social Media Ads', amount: 5000, status: 'paid' },
      ],
      revenues: [
        { id: 'r1', category: 'Tickets', name: 'Early Bird Tickets', amount: 20000, status: 'received' },
        { id: 'r2', category: 'Sponsorship', name: 'Tech Corp Gold Sponsor', amount: 15000, status: 'projected' },
      ]
    },
    guests: [
      { id: 'g1', name: 'Alice Johnson', email: 'alice@example.com', status: 'confirmed' },
      { id: 'g2', name: 'Bob Smith', email: 'bob@example.com', status: 'pending' },
      { id: 'g3', name: 'Charlie Davis', email: 'charlie@example.com', status: 'confirmed' },
    ],
    tasks: [
      { id: 't1', title: 'Confirm keynote speaker', completed: true, dueDate: '2026-04-01' },
      { id: 't2', title: 'Finalize catering menu', completed: false, dueDate: '2026-05-10' },
      { id: 't3', title: 'Send out invitations', completed: true, dueDate: '2026-03-15' },
    ],
    vendors: [
      { id: 'v1', name: 'Gourmet Delights', category: 'Catering', contact: 'chef@gourmet.com', status: 'booked' },
      { id: 'v2', name: 'Bright Lights AV', category: 'Audio/Visual', contact: 'tech@brightlights.com', status: 'booked' },
    ],
    timeline: [
      { id: 'tl1', time: '09:00', activity: 'Registration & Coffee' },
      { id: 'tl2', time: '10:00', activity: 'Opening Keynote' },
      { id: 'tl3', time: '12:00', activity: 'Networking Lunch' },
    ],
    seating: {
      tables: [
        { id: 'table1', x: 100, y: 100, name: 'VIP Table 1', capacity: 8 },
        { id: 'table2', x: 300, y: 100, name: 'Tech Table 2', capacity: 10 },
      ]
    }
  },
  {
    id: '2',
    title: 'Sarah & James Wedding',
    type: 'personal',
    date: '2026-08-22',
    time: '16:00',
    location: 'Oceanfront Gardens, Malibu',
    description: 'A beautiful summer wedding celebration by the sea.',
    capacity: 150,
    isPublic: false,
    budget: {
      total: 35000,
      expenses: [
        { id: 'e4', category: 'Venue', name: 'Garden Rental', amount: 8000, status: 'paid' },
        { id: 'e5', category: 'Flowers', name: 'Bouquets & Centerpieces', amount: 4000, status: 'planned' },
      ],
      revenues: []
    },
    guests: [
      { id: 'g4', name: 'David Wilson', email: 'david@example.com', status: 'confirmed' },
      { id: 'g5', name: 'Emma Brown', email: 'emma@example.com', status: 'confirmed' },
    ],
    tasks: [
      { id: 't4', title: 'Dress fitting', completed: true },
      { id: 't5', title: 'Cake tasting', completed: false },
    ],
    vendors: [
      { id: 'v3', name: 'Floral Fantasy', category: 'Decorations', contact: 'info@floral.com', status: 'booked' },
    ],
    timeline: [
      { id: 'tl4', time: '16:00', activity: 'Ceremony' },
      { id: 'tl5', time: '17:00', activity: 'Cocktail Hour' },
    ],
    seating: {
      tables: []
    }
  }
];
