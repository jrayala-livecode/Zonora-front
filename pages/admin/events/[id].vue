<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Modal Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full mx-4 my-8 shadow-2xl">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 text-center">
          <div class="text-orange-400 text-lg animate-pulse">Loading event details...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-400 text-lg mb-4">{{ error }}</div>
          <button
            @click="goBackToList"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Events List
          </button>
        </div>

        <!-- Event Details -->
        <div v-else-if="event">
          <!-- Modal Header - Different for Approved vs Pending/Rejected -->
          <div class="flex justify-between items-center p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <!-- Green checkmark icon for approved events -->
              <svg
                v-if="isApproved"
                class="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="text-2xl font-bold text-white">
                {{ isApproved ? 'Event Approved' : 'Event Details' }}
              </h3>
            </div>
            <button
              @click="goBackToList"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Approved Event - Concise View -->
          <div v-if="isApproved" class="p-6">
            <!-- Event Image (if available) -->
            <div v-if="event.image_url" class="mb-6">
              <img
                :src="event.image_url"
                :alt="event.name"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <!-- Success Message -->
            <div class="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
              <p class="text-green-300 text-center">
                This event has been approved and is now visible to users.
              </p>
            </div>

            <!-- Concise Event Info -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                <p class="text-white text-xl font-semibold">{{ event.name }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                  <p class="text-white">{{ formatDate(event.date) }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                  <p class="text-white">{{ event.venue?.name || 'No venue specified' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Organizer</label>
                  <p class="text-white">{{ event.user?.name || 'Unknown' }}</p>
                  <p v-if="event.user?.email" class="text-gray-400 text-sm">{{ event.user.email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span
                    :class="getStatusClass(event.approval_status)"
                    class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                  >
                    {{ event.approval_status }}
                  </span>
                </div>
              </div>

              <!-- Additional Info if available -->
              <div v-if="event.description" class="mt-4">
                <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <p class="text-gray-300 text-sm">{{ event.description }}</p>
              </div>

              <div v-if="event.approved_at" class="mt-4">
                <label class="block text-sm font-medium text-gray-400 mb-1">Approved On</label>
                <p class="text-gray-300 text-sm">{{ formatDate(event.approved_at) }}</p>
              </div>
            </div>

            <!-- Close Button -->
            <div class="mt-6 flex justify-end">
              <button
                @click="goBackToList"
                class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          <!-- Pending/Rejected Event - Full Details with Actions -->
          <div v-else class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <!-- Event Image -->
            <div v-if="event.image_url" class="mb-6">
              <img
                :src="event.image_url"
                :alt="event.name"
                class="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <!-- Event Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                  <p class="text-white text-lg font-semibold">{{ event.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <p class="text-white">{{ formatDate(event.date) }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                  <p class="text-white">{{ event.venue?.name || 'No venue specified' }}</p>
                  <p v-if="event.venue?.address" class="text-gray-400 text-sm">{{ event.venue.address }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Approval Status</label>
                  <span
                    :class="getStatusClass(event.approval_status)"
                    class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                  >
                    {{ event.approval_status }}
                  </span>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Organizer</label>
                  <p class="text-white">{{ event.user?.name || 'Unknown' }}</p>
                  <p v-if="event.user?.email" class="text-gray-400 text-sm">{{ event.user.email }}</p>
                </div>

                <div v-if="event.venue?.capacity">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Venue Capacity</label>
                  <p class="text-white">{{ event.venue.capacity }}</p>
                </div>

                <div v-if="event.genres && event.genres.length > 0">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Genres</label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="genre in event.genres"
                      :key="genre.id"
                      class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {{ genre.name }}
                    </span>
                  </div>
                </div>

                <div v-if="event.prices && event.prices.length > 0">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Prices</label>
                  <p class="text-white">{{ event.price_range || 'See details' }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="event.description" class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <div class="bg-gray-700 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">{{ event.description }}</div>
            </div>

            <!-- Artists/Lineup -->
            <div v-if="event.artists && event.artists.length > 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2">Lineup</label>
              <div class="space-y-2">
                <div
                  v-for="artist in event.artists"
                  :key="artist.id"
                  class="flex items-center space-x-3 bg-gray-700 rounded-lg p-3"
                >
                  <img
                    v-if="artist.profile_picture_url"
                    :src="artist.profile_picture_url"
                    :alt="artist.stage_name || artist.name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <p class="text-white font-medium">{{ artist.stage_name || artist.name }}</p>
                    <p v-if="artist.genres && artist.genres.length > 0" class="text-gray-400 text-sm">
                      {{ artist.genres.map(g => g.name).join(', ') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bands (if any) -->
            <div v-if="event.bands && event.bands.length > 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2">Bands</label>
              <div class="space-y-2">
                <div
                  v-for="band in event.bands"
                  :key="band.id"
                  class="flex items-center space-x-3 bg-gray-700 rounded-lg p-3"
                >
                  <div class="flex-1">
                    <p class="text-white font-medium">{{ band.name }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rejection Reason (if rejected) -->
            <div v-if="event.rejection_reason" class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2">Rejection Reason</label>
              <div class="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
                {{ event.rejection_reason }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
              <button
                v-if="event.approval_status !== 'approved'"
                @click="handleApprove"
                :disabled="isActionLoading"
                class="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve Event
              </button>
              <button
                v-if="event.approval_status !== 'rejected'"
                @click="showRejectModal = true"
                :disabled="isActionLoading"
                class="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Event
              </button>
              <button
                v-if="event.approval_status !== 'pending'"
                @click="handleReset"
                :disabled="isActionLoading"
                class="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset to Pending
              </button>
              <button
                @click="goBackToList"
                :disabled="isActionLoading"
                class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
      @click.self="showRejectModal = false"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-white mb-4">Reject Event</h3>
        <p class="text-gray-300 mb-4">Please provide a reason for rejecting this event:</p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          placeholder="Enter rejection reason..."
        ></textarea>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRejectModal = false"
            :disabled="isActionLoading"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleRejectConfirm"
            :disabled="!rejectionReason.trim() || isActionLoading"
            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminEvents } from '~/composables/useAdminEvents';

definePageMeta({
  middleware: 'auth',
  layout: false
});

const route = useRoute();
const router = useRouter();

const {
  getEventById,
  approveEvent,
  rejectEvent,
  resetEventToPending
} = useAdminEvents();

const event = ref<any>(null);
const isLoading = ref(false);
const isActionLoading = ref(false);
const error = ref<string | null>(null);
const showRejectModal = ref(false);
const rejectionReason = ref('');

const isApproved = computed(() => event.value?.approval_status === 'approved');

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-900 text-green-300 border border-green-700';
    case 'rejected':
      return 'bg-red-900 text-red-300 border border-red-700';
    case 'pending':
      return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
    default:
      return 'bg-gray-700 text-gray-300 border border-gray-600';
  }
};

const goBackToList = () => {
  router.push('/admin/events');
};

const loadEvent = async () => {
  const eventId = route.params.id;
  
  if (!eventId) {
    error.value = 'Invalid event ID';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const eventData = await getEventById(Number(eventId));
    event.value = eventData;
  } catch (err: any) {
    error.value = err.message || 'Failed to load event details';
  } finally {
    isLoading.value = false;
  }
};

const handleApprove = async () => {
  if (!event.value || !confirm('Are you sure you want to approve this event?')) return;

  isActionLoading.value = true;
  try {
    await approveEvent(event.value.id);
    // Reload event to get updated status
    await loadEvent();
  } catch (err: any) {
    alert(err.message || 'Failed to approve event');
  } finally {
    isActionLoading.value = false;
  }
};

const handleRejectConfirm = async () => {
  if (!event.value || !rejectionReason.value.trim()) return;

  isActionLoading.value = true;
  try {
    await rejectEvent(event.value.id, rejectionReason.value);
    showRejectModal.value = false;
    // Reload event to get updated status
    await loadEvent();
  } catch (err: any) {
    alert(err.message || 'Failed to reject event');
  } finally {
    isActionLoading.value = false;
  }
};

const handleReset = async () => {
  if (!event.value || !confirm('Are you sure you want to reset this event to pending?')) return;

  isActionLoading.value = true;
  try {
    await resetEventToPending(event.value.id);
    // Reload event to get updated status
    await loadEvent();
  } catch (err: any) {
    alert(err.message || 'Failed to reset event status');
  } finally {
    isActionLoading.value = false;
  }
};

onMounted(() => {
  loadEvent();
});
</script>

