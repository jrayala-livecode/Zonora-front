import { ref, computed } from 'vue';
import { useApiClient } from '~/composables/useApiClient';
import type { Event, PaginatedEvents } from '~/composables/useEvents';

export interface AdminEventStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pending_percentage: number;
  approved_percentage: number;
  rejected_percentage: number;
}

const events = ref<PaginatedEvents | null>(null);
const stats = ref<AdminEventStats | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export const useAdminEvents = () => {
  /**
   * Fetch all events for admin review with filters
   */
  const fetchAdminEvents = async (
    page: number = 1,
    limit: number = 15,
    status: 'all' | 'pending' | 'approved' | 'rejected' = 'all',
    search: string = ''
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        search
      });

      const response = await apiRequest(`/admin/events?${queryParams.toString()}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin events');
      }

      const data = await response.json();
      events.value = data.data;
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get event by ID for admin review
   */
  const getEventById = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/admin/events/${id}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Approve an event
   */
  const approveEvent = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/admin/events/${id}/approve`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve event');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Reject an event with a reason
   */
  const rejectEvent = async (id: number, rejectionReason: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/admin/events/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejection_reason: rejectionReason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject event');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Reset event status to pending
   */
  const resetEventToPending = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/admin/events/${id}/reset`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset event status');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get approval statistics
   */
  const fetchStats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/admin/events/stats', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      stats.value = data.data;
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Bulk approve events
   */
  const bulkApprove = async (eventIds: number[]) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/admin/events/bulk-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_ids: eventIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to bulk approve events');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Bulk reject events
   */
  const bulkReject = async (eventIds: number[], rejectionReason: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/admin/events/bulk-reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_ids: eventIds,
          rejection_reason: rejectionReason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to bulk reject events');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    events,
    stats,
    isLoading,
    error,
    fetchAdminEvents,
    getEventById,
    approveEvent,
    rejectEvent,
    resetEventToPending,
    fetchStats,
    bulkApprove,
    bulkReject
  };
};

