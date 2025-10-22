import { ref } from 'vue';
import type { Genre } from './useEvents';

// Singleton state - defined OUTSIDE the composable
const genres = ref<Genre[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

export const useGenres = () => {
  const { apiRequest } = useApiClient();
  const config = useRuntimeConfig();

  /**
   * Fetch all genres from the API
   */
  const fetchGenres = async (): Promise<void> => {
    if (genres.value.length > 0) {
      // Already loaded, skip fetching
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${config.public.apiBaseUrl}/genres`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }

      const json = await response.json();
      genres.value = json.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error fetching genres';
      console.error('Error fetching genres:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new genre
   */
  const createGenre = async (name: string): Promise<Genre | null> => {
    if (!name || name.trim().length === 0) {
      error.value = 'Genre name is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiRequest('/genres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create genre');
      }

      const json = await response.json();
      const newGenre = json.data;

      // Add to local cache
      genres.value.push(newGenre);

      return newGenre;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error creating genre';
      console.error('Error creating genre:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Find a genre by name (case insensitive)
   */
  const findGenreByName = (name: string): Genre | undefined => {
    return genres.value.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
  };

  /**
   * Get or create a genre by name
   * Returns the existing genre if found, otherwise creates a new one
   */
  const getOrCreateGenre = async (name: string): Promise<Genre | null> => {
    const existing = findGenreByName(name);
    if (existing) {
      return existing;
    }
    return await createGenre(name);
  };

  return {
    genres: readonly(genres),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchGenres,
    createGenre,
    findGenreByName,
    getOrCreateGenre,
  };
};
