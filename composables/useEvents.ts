export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  image: string;
  category: string;
  attendees?: number;
}

export const useEvents = () => {
  const events = ref<Event[]>([
    {
      id: '1',
      title: 'Rhythmic Pulse Festival: A Night of Electronic Music',
      description: 'Join us for an electrifying night at the Rhythmic Pulse Festival! Featuring a lineup of renowned DJs, state-of-the-art sound systems, and mesmerizing light shows, this event promises an unforgettable experience for all electronic music enthusiasts.',
      date: '2024-08-10',
      time: '8:00 PM - 3:00 AM',
      location: 'The Warehouse',
      address: '789 Industrial Ave, Los Angeles, CA',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música',
      attendees: 2500
    },
    {
      id: '2',
      title: 'Electronic Beats Festival',
      description: 'Una noche increíble de música electrónica con los mejores DJs internacionales.',
      date: '2024-07-15',
      time: '7:00 PM',
      location: 'Club Central',
      address: 'Downtown LA',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    },
    {
      id: '3',
      title: 'Summer Rhythms Concert',
      description: 'Concierto de verano con artistas locales e internacionales.',
      date: '2024-08-05',
      time: '6:00 PM',
      location: 'Outdoor Stage',
      address: 'Central Park',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    },
    {
      id: '4',
      title: 'Acoustic Nights Showcase',
      description: 'Una noche íntima con música acústica y talentos emergentes.',
      date: '2024-09-12',
      time: '8:00 PM',
      location: 'Intimate Venue',
      address: 'Arts District',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    },
    {
      id: '5',
      title: 'Indie Rock Marathon',
      description: 'Maratón de rock indie con bandas locales.',
      date: '2024-10-19',
      time: '9:00 AM',
      location: 'Rock Venue',
      address: 'Music Row',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    },
    {
      id: '6',
      title: 'Jazz Fusion Fair',
      description: 'Feria de jazz fusion con músicos reconocidos.',
      date: '2024-11-22',
      time: '5:00 PM',
      location: 'Jazz Club',
      address: 'Historic District',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    },
    {
      id: '7',
      title: 'Holiday Harmonies Market',
      description: 'Mercado navideño con música en vivo y artesanías.',
      date: '2024-12-13',
      time: '10:00 AM',
      location: 'Holiday Market',
      address: 'Main Square',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Música'
    }
  ]);

  const searchQuery = ref('');
  const selectedLocation = ref('');

  const filteredEvents = computed(() => {
    let filtered = events.value;

    if (searchQuery.value) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    if (selectedLocation.value) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(selectedLocation.value.toLowerCase())
      );
    }

    return filtered;
  });

  const getEventById = (id: string) => {
    return events.value.find(event => event.id === id);
  };

  const createEvent = async (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    
    events.value.push(newEvent);
    return newEvent;
  };

  return {
    events: readonly(events),
    filteredEvents,
    searchQuery,
    selectedLocation,
    getEventById,
    createEvent
  };
};