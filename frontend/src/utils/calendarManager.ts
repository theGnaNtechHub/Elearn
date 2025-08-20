export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  type: 'workshop' | 'quiz' | 'live' | 'assignment' | 'meeting' | 'deadline';
  createdBy: string;
  targetUsers?: string[]; // If empty, visible to all
  targetLevels?: number[]; // If empty, visible to all levels
  targetCourses?: string[]; // If empty, visible to all courses
  isRequired: boolean;
  createdAt: Date;
}

export interface UserEventResponse {
  userId: string;
  eventId: string;
  status: 'interested' | 'attending' | 'not_attending';
  respondedAt: Date;
}

const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Algorithm Workshop',
    description: 'Interactive workshop on advanced algorithms',
    date: new Date(2024, 11, 15),
    time: '2:00 PM',
    type: 'workshop',
    createdBy: 'admin',
    isRequired: false,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Python Basics Quiz',
    description: 'Test your Python fundamentals',
    date: new Date(2024, 11, 18),
    time: '10:00 AM',
    type: 'quiz',
    createdBy: 'admin',
    targetCourses: ['python-basics'],
    isRequired: true,
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Data Structures Live Session',
    description: 'Live Q&A session on data structures',
    date: new Date(2024, 11, 22),
    time: '3:30 PM',
    type: 'live',
    createdBy: 'admin',
    targetLevels: [2, 3],
    isRequired: false,
    createdAt: new Date()
  }
];

export const loadEvents = (): CalendarEvent[] => {
  const stored = localStorage.getItem('calendarEvents');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt)
      }));
    } catch {
      return defaultEvents;
    }
  }
  saveEvents(defaultEvents);
  return defaultEvents;
};

export const saveEvents = (events: CalendarEvent[]): void => {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
};

export const loadUserEventResponses = (): UserEventResponse[] => {
  const stored = localStorage.getItem('userEventResponses');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((response: any) => ({
        ...response,
        respondedAt: new Date(response.respondedAt)
      }));
    } catch {
      return [];
    }
  }
  return [];
};

export const saveUserEventResponses = (responses: UserEventResponse[]): void => {
  localStorage.setItem('userEventResponses', JSON.stringify(responses));
};

export const getEventsForUser = (userId: string): CalendarEvent[] => {
  const events = loadEvents();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.id === userId);
  
  if (!user) return events;

  // Get user's level and enrolled courses
  const { getUserLevel, getUserCourses } = require('./courseManager');
  const userLevel = getUserLevel(userId);
  const userCourses = getUserCourses(userId);
  const userCourseIds = userCourses.map((uc: any) => uc.id);

  return events.filter(event => {
    // Check target users
    if (event.targetUsers && event.targetUsers.length > 0) {
      return event.targetUsers.includes(userId);
    }

    // Check target levels
    if (event.targetLevels && event.targetLevels.length > 0) {
      return event.targetLevels.includes(userLevel);
    }

    // Check target courses
    if (event.targetCourses && event.targetCourses.length > 0) {
      return event.targetCourses.some(courseId => userCourseIds.includes(courseId));
    }

    // If no specific targeting, show to all
    return true;
  });
};

export const getEventsForDate = (date: Date, userId?: string): CalendarEvent[] => {
  const events = userId ? getEventsForUser(userId) : loadEvents();
  return events.filter(event => 
    event.date.toDateString() === date.toDateString()
  );
};

export const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent => {
  const events = loadEvents();
  const newEvent: CalendarEvent = {
    ...eventData,
    id: Date.now().toString(),
    createdAt: new Date()
  };

  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const updateEvent = (eventId: string, updates: Partial<CalendarEvent>): boolean => {
  const events = loadEvents();
  const index = events.findIndex(e => e.id === eventId);
  
  if (index === -1) return false;

  events[index] = { ...events[index], ...updates };
  saveEvents(events);
  return true;
};

export const deleteEvent = (eventId: string): void => {
  const events = loadEvents();
  const updated = events.filter(e => e.id !== eventId);
  saveEvents(updated);

  // Remove user responses
  const responses = loadUserEventResponses();
  const updatedResponses = responses.filter(r => r.eventId !== eventId);
  saveUserEventResponses(updatedResponses);
};

export const respondToEvent = (userId: string, eventId: string, status: UserEventResponse['status']): void => {
  const responses = loadUserEventResponses();
  const existingIndex = responses.findIndex(r => r.userId === userId && r.eventId === eventId);

  if (existingIndex >= 0) {
    responses[existingIndex] = {
      ...responses[existingIndex],
      status,
      respondedAt: new Date()
    };
  } else {
    responses.push({
      userId,
      eventId,
      status,
      respondedAt: new Date()
    });
  }

  saveUserEventResponses(responses);
};

export const getEventBadgeColor = (type: string): string => {
  switch (type) {
    case 'workshop': return 'bg-blue-100 text-blue-800';
    case 'quiz': return 'bg-red-100 text-red-800';
    case 'live': return 'bg-green-100 text-green-800';
    case 'assignment': return 'bg-yellow-100 text-yellow-800';
    case 'meeting': return 'bg-purple-100 text-purple-800';
    case 'deadline': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};