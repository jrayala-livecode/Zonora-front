import { ref, computed, readonly } from 'vue';

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

function mapApiEventToEvent(apiEvent: any): Event {
  const dateObj = new Date(apiEvent.date);
  const date = dateObj.toISOString().split('T')[0];
  const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  

  let location = '';
  if (apiEvent.venue?.name) {
    location = apiEvent.venue.name;
  } else if (apiEvent.latitude && apiEvent.longitude) {
    location = `Lat: ${apiEvent.latitude}, Lng: ${apiEvent.longitude}`;
  } else {
    location = 'Ubicación no disponible';
  }

  const address = apiEvent.venue?.address || '';
  
  let category = '';
  if (Array.isArray(apiEvent.hashtags)) {
    category = apiEvent.hashtags[0]?.replace(/^#/, '') || '';
  } else if (typeof apiEvent.hashtags === 'string') {
    category = apiEvent.hashtags.replace(/^#/, '').split(' ')[0];
  }

  const image = apiEvent.image_url || '';

  return {
    id: apiEvent.id.toString(),
    title: apiEvent.name || 'Evento sin título',
    description: apiEvent.description || '',
    date,
    time,
    location,
    address,
    image,
    category,
    attendees: undefined
  };
}

export const useEvents = () => {
  const events = ref<Event[]>([]);
  const searchQuery = ref('');
  const selectedLocation = ref('');
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  const fetchEventsFromApi = async () => {
      isLoading.value = true;
    try {
      const res = await fetch(`${config.public.apiBaseUrl}/events`);
      if (!res.ok) throw new Error('Error fetching events');
      
      const json = await res.json();
      const apiEvents = json.data.data; // importante: .data.data
      events.value = apiEvents.map(mapApiEventToEvent);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      events.value = [];
      
    }
      isLoading.value = false;
  };

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

  return {
    events: readonly(events),
    fetchEventsFromApi,
    filteredEvents,
    searchQuery,
    selectedLocation,
    getEventById,
    isLoading
  };
};
