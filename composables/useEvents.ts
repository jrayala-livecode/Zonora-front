import { ref, computed, readonly } from 'vue';
import { useRuntimeConfig } from '#app';
import { useUserStore } from '~/store/user'; // importa tu store

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  image_url: string;
  category: string;
  attendees?: number;
  venue_id?: number; // opcional si el evento puede no tener un venue
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

  const image_url = apiEvent.image_url || '';

  return {
    id: apiEvent.id.toString(),
    title: apiEvent.name || 'Evento sin título',
    description: apiEvent.description || '',
    date,
    time,
    location,
    address,
    image_url,
    category,
    attendees: undefined
  };
}
export const fetchUserEvents = async () => {
  const events = ref<Event[]>([]);
  const isLoading = ref(false);
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const token = computed(() => userStore.token);
  isLoading.value = true;
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/events/my-events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Error fetching user events: ${res.status}`);

    const json = await res.json();
    const apiEvents = json.data.data || json.data;

    // Opcional: podés usar un array separado si no querés mezclar con "todos"
    events.value = apiEvents.map(mapApiEventToEvent);
  } catch (error) {
    console.error('Error al obtener eventos del usuario:', error);
    events.value = [];
  }
  isLoading.value = false;
};

export const useEvents = () => {
  const events = ref<Event[]>([]);
  const searchQuery = ref('');
  const selectedLocation = ref('');
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  const userStore = useUserStore(); // instancia del store
  const token = computed(() => userStore.token); // accede de forma reactiva

  const fetchEventsFromApi = async () => {
    isLoading.value = true;
    try {
      const res = await fetch(`${config.public.apiBaseUrl}/events`);
      if (!res.ok) throw new Error('Error fetching events');

      const json = await res.json();
      const apiEvents = json.data.data;
      events.value = apiEvents.map(mapApiEventToEvent);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      events.value = [];
    }
    isLoading.value = false;
  };

  const createEvent = async (eventData: FormData | any) => {
  console.log('Token desde el store en create events:', token.value);
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/events`, {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${token.value}`,
  'Accept': 'application/json'
},

      body: eventData instanceof FormData ? eventData : JSON.stringify(eventData)
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('Respuesta de error del servidor:', text);
      throw new Error(`Error creando evento: ${res.status} - ${text}`);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError, '\nRespuesta recibida:', text);
      throw new Error('Respuesta del servidor no es un JSON válido');
    }

    if (json.data) {
      const newEvent = mapApiEventToEvent(json.data);
      events.value.push(newEvent);
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
    fetchUserEvents,
    searchQuery,
    selectedLocation,
    getEventById,
    createEvent,
    isLoading
  };
};
