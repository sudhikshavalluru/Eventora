import { useState, useEffect } from 'react';
import { Event } from '../types';
import { MOCK_EVENTS } from '../data/mockData';

export function useEventStore() {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('evently_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('evently_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEventId === id) setSelectedEventId(null);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  return {
    events,
    selectedEvent,
    setSelectedEventId,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
