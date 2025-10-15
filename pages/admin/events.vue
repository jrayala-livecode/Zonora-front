<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ClientOnly>
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white">Event <span class="text-orange-500">Moderation</span></h1>
          <p class="mt-2 text-gray-300">Review and approve events before they go live</p>
        </div>
        <button
          @click="handleManualReload"
          :disabled="isLoading"
          class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Reload</span>
        </button>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-400">Total Events</p>
              <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-yellow-600">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-yellow-400">Pending Review</p>
              <p class="text-2xl font-bold text-yellow-300">{{ stats.pending }}</p>
              <p class="text-xs text-yellow-500 mt-1">{{ stats.pending_percentage }}%</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-600">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-green-400">Approved</p>
              <p class="text-2xl font-bold text-green-300">{{ stats.approved }}</p>
              <p class="text-xs text-green-500 mt-1">{{ stats.approved_percentage }}%</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-600">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-red-400">Rejected</p>
              <p class="text-2xl font-bold text-red-300">{{ stats.rejected }}</p>
              <p class="text-xs text-red-500 mt-1">{{ stats.rejected_percentage }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
            <select
              v-model="selectedStatus"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              @change="handleFilterChange"
            >
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              @input="handleSearchInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Per Page</label>
            <select
              v-model="perPage"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              @change="handleFilterChange"
            >
              <option :value="15">15</option>
              <option :value="30">30</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-orange-400 text-lg animate-pulse">Loading events...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
        <p class="text-red-200">{{ error }}</p>
      </div>

      <!-- Batch Actions Bar -->
      <div v-if="selectedEventIds.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 border border-orange-500 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-white font-medium">{{ selectedEventIds.length }} event(s) selected</span>
          <button
            @click="clearSelection"
            class="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Clear selection
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="handleBatchApprove"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Approve Selected</span>
          </button>
          <button
            @click="openBatchRejectModal"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Reject Selected</span>
          </button>
        </div>
      </div>

      <!-- Events Table -->
      <div v-if="!isLoading && !error && events && events.data.length > 0" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="w-4 h-4 bg-gray-700 border-gray-600 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Event
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Organizer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="event in events.data" :key="event.id" class="hover:bg-gray-750 transition-colors">
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedEventIds.includes(Number(event.id))"
                  @change="toggleEventSelection(Number(event.id))"
                  class="w-4 h-4 bg-gray-700 border-gray-600 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img
                    v-if="event.image_url"
                    :src="event.image_url"
                    :alt="event.title || (event as any).name || 'Event'"
                    class="h-12 w-12 rounded object-cover mr-4"
                  />
                  <div>
                    <div class="text-sm font-medium text-white">{{ event.title || (event as any).name }}</div>
                    <div class="text-sm text-gray-400">{{ event.venue?.name || 'No venue' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-white">{{ event.organizer?.name || (event as any).user?.name || 'Unknown' }}</div>
                <div class="text-sm text-gray-400">{{ (event as any).user?.email || '' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-300">{{ formatDate(event.date || '') }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(event.approval_status || 'pending')"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ event.approval_status || 'pending' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex space-x-2">
                  <button
                    v-if="event.approval_status !== 'approved'"
                    @click="handleApprove(Number(event.id))"
                    class="text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    v-if="event.approval_status !== 'rejected'"
                    @click="openRejectModal(event)"
                    class="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    v-if="event.approval_status !== 'pending'"
                    @click="handleReset(Number(event.id))"
                    class="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    @click="openViewModal(Number(event.id))"
                    class="text-gray-400 hover:text-gray-300 font-medium transition-colors"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="events" class="bg-gray-900 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <div class="text-sm text-gray-300">
            Showing {{ events.from || 0 }} to {{ events.to || 0 }} of {{ events.total || 0 }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="!events.next_page_url"
              class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-700">
        <p class="text-gray-400 text-lg">No events found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
      </ClientOnly>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click.self="closeRejectModal"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-4">Reject <span class="text-orange-500">{{ isBatchReject ? 'Events' : 'Event' }}</span></h3>
        <p class="text-sm text-gray-300 mb-4">
          <template v-if="isBatchReject">
            Please provide a reason for rejecting {{ selectedEventIds.length }} event(s)
          </template>
          <template v-else>
            Please provide a reason for rejecting "{{ selectedEvent?.title || selectedEvent?.name }}"
          </template>
        </p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          placeholder="Reason for rejection..."
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
        ></textarea>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeRejectModal"
            class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleRejectConfirm"
            :disabled="!rejectionReason.trim()"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isBatchReject ? `Reject ${selectedEventIds.length} Event(s)` : 'Reject Event' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Event Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="closeViewModal"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full mx-4 my-8 shadow-2xl">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 class="text-2xl font-bold text-white">Event <span class="text-orange-500">Details</span></h3>
          <button
            @click="closeViewModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingEvent" class="p-12 text-center">
          <div class="text-orange-400 text-lg animate-pulse">Loading event details...</div>
        </div>

        <!-- Event Details -->
        <div v-else-if="viewingEvent" class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Event Image -->
          <div v-if="viewingEvent.image_url" class="mb-6">
            <img
              :src="viewingEvent.image_url"
              :alt="viewingEvent.title || viewingEvent.name"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <!-- Event Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <p class="text-white text-lg font-semibold">{{ viewingEvent.title || viewingEvent.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Date</label>
                <p class="text-white">{{ formatDate(viewingEvent.date || '') }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                <p class="text-white">{{ viewingEvent.venue?.name || 'No venue' }}</p>
                <p v-if="viewingEvent.venue?.address" class="text-gray-400 text-sm">{{ viewingEvent.venue.address }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Approval Status</label>
                <span
                  :class="getStatusClass(viewingEvent.approval_status || 'pending')"
                  class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                >
                  {{ viewingEvent.approval_status || 'pending' }}
                </span>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Organizer</label>
                <p class="text-white">{{ viewingEvent.organizer?.name || viewingEvent.user?.name || 'Unknown' }}</p>
                <p class="text-gray-400 text-sm">{{ viewingEvent.user?.email || '' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
                <p class="text-white">{{ viewingEvent.capacity || 'Not specified' }}</p>
              </div>

              <div v-if="viewingEvent.genre">
                <label class="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                <p class="text-white">{{ viewingEvent.genre.name }}</p>
              </div>

              <div v-if="viewingEvent.type">
                <label class="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <p class="text-white">{{ viewingEvent.type.name }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="viewingEvent.description" class="mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <div class="bg-gray-700 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">{{ viewingEvent.description }}</div>
          </div>

          <!-- Artists/Lineup -->
          <div v-if="viewingEvent.artists && viewingEvent.artists.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-2">Lineup</label>
            <div class="space-y-2">
              <div
                v-for="artist in viewingEvent.artists"
                :key="artist.id"
                class="flex items-center space-x-3 bg-gray-700 rounded-lg p-3"
              >
                <img
                  v-if="artist.profile_image_url"
                  :src="artist.profile_image_url"
                  :alt="artist.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="flex-1">
                  <p class="text-white font-medium">{{ artist.name }}</p>
                  <p v-if="artist.genre" class="text-gray-400 text-sm">{{ artist.genre.name }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ticket Tiers -->
          <div v-if="viewingEvent.ticket_tiers && viewingEvent.ticket_tiers.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-2">Ticket Tiers</label>
            <div class="space-y-2">
              <div
                v-for="tier in viewingEvent.ticket_tiers"
                :key="tier.id"
                class="flex justify-between items-center bg-gray-700 rounded-lg p-3"
              >
                <div>
                  <p class="text-white font-medium">{{ tier.name }}</p>
                  <p v-if="tier.description" class="text-gray-400 text-sm">{{ tier.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-white font-semibold">${{ tier.price }}</p>
                  <p class="text-gray-400 text-sm">{{ tier.quantity }} available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejection Reason -->
          <div v-if="viewingEvent.approval_status === 'rejected' && viewingEvent.rejection_reason" class="mb-6">
            <label class="block text-sm font-medium text-red-400 mb-2">Rejection Reason</label>
            <div class="bg-red-900 border border-red-700 rounded-lg p-4 text-red-200">{{ viewingEvent.rejection_reason }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              v-if="viewingEvent.approval_status !== 'approved'"
              @click="handleApproveFromModal"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Approve
            </button>
            <button
              v-if="viewingEvent.approval_status !== 'rejected'"
              @click="handleRejectFromModal"
              class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Reject
            </button>
            <button
              v-if="viewingEvent.approval_status !== 'pending'"
              @click="handleResetFromModal"
              class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
            >
              Reset to Pending
            </button>
            <button
              @click="closeViewModal"
              class="px-6 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
import { useAdminEvents } from '~/composables/useAdminEvents';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
});

const router = useRouter();
const userStore = useUserStore();
const {
  events,
  stats,
  isLoading,
  error,
  fetchAdminEvents,
  approveEvent,
  rejectEvent,
  resetEventToPending,
  fetchStats,
  getEventById
} = useAdminEvents();

onMounted(async () => {
  // Load events and stats
  await loadData();
});

const selectedStatus = ref<'all' | 'pending' | 'approved' | 'rejected'>('pending');
const searchQuery = ref('');
const perPage = ref(15);
const currentPage = ref(1);

const showRejectModal = ref(false);
const selectedEvent = ref<any>(null);
const rejectionReason = ref('');
const isBatchReject = ref(false);
const selectedEventIds = ref<number[]>([]);

const showViewModal = ref(false);
const viewingEvent = ref<any>(null);
const isLoadingEvent = ref(false);

let searchTimeout: NodeJS.Timeout | null = null;

const loadData = async () => {
  try {
    await Promise.all([
      fetchAdminEvents(currentPage.value, perPage.value, selectedStatus.value, searchQuery.value),
      fetchStats()
    ]);
  } catch (err) {
    console.error('Failed to load admin events:', err);
  }
};

const handleFilterChange = async () => {
  currentPage.value = 1;
  clearSelection();
  await loadData();
};

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    currentPage.value = 1;
    clearSelection();
    await loadData();
  }, 500);
};

const goToPage = async (page: number) => {
  if (page < 1) return;
  currentPage.value = page;
  clearSelection();
  await loadData();
};

const handleApprove = async (eventId: number) => {
  if (!confirm('Are you sure you want to approve this event?')) return;

  try {
    await approveEvent(eventId);
    removeEventFromList(eventId, 'approved');
  } catch (err) {
    alert('Failed to approve event');
  }
};

const openRejectModal = (event: any) => {
  selectedEvent.value = event;
  isBatchReject.value = false;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  selectedEvent.value = null;
  rejectionReason.value = '';
  isBatchReject.value = false;
};

const handleReset = async (eventId: number) => {
  if (!confirm('Are you sure you want to reset this event to pending?')) return;

  try {
    await resetEventToPending(eventId);
    removeEventFromList(eventId, 'pending');
  } catch (err) {
    alert('Failed to reset event status');
  }
};

const removeEventFromList = (eventId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
  if (!events.value) return;

  // Find the event to get its old status
  const eventIndex = events.value.data.findIndex((e: any) => e.id === eventId);
  if (eventIndex === -1) return;

  const oldStatus = events.value.data[eventIndex].approval_status || 'pending';

  // Remove from list if filtering by status and status changed
  if (selectedStatus.value === 'all' || selectedStatus.value === newStatus) {
    // Update the event status in place if showing all or the new status
    events.value.data[eventIndex].approval_status = newStatus;
  } else {
    // Remove from list if we're filtering and it no longer matches
    events.value.data.splice(eventIndex, 1);
    events.value.total -= 1;
  }

  // Update stats locally
  if (stats.value) {
    // Decrement old status count
    if (oldStatus === 'pending') stats.value.pending -= 1;
    else if (oldStatus === 'approved') stats.value.approved -= 1;
    else if (oldStatus === 'rejected') stats.value.rejected -= 1;

    // Increment new status count
    if (newStatus === 'pending') stats.value.pending += 1;
    else if (newStatus === 'approved') stats.value.approved += 1;
    else if (newStatus === 'rejected') stats.value.rejected += 1;

    // Recalculate percentages
    if (stats.value.total > 0) {
      stats.value.pending_percentage = parseFloat(((stats.value.pending / stats.value.total) * 100).toFixed(2));
      stats.value.approved_percentage = parseFloat(((stats.value.approved / stats.value.total) * 100).toFixed(2));
      stats.value.rejected_percentage = parseFloat(((stats.value.rejected / stats.value.total) * 100).toFixed(2));
    }
  }
};

const handleManualReload = async () => {
  await loadData();
};

// Batch selection functions
const isAllSelected = computed(() => {
  if (!events.value || events.value.data.length === 0) return false;
  return events.value.data.every((e: any) => selectedEventIds.value.includes(Number(e.id)));
});

const toggleSelectAll = () => {
  if (!events.value) return;
  
  if (isAllSelected.value) {
    selectedEventIds.value = [];
  } else {
    selectedEventIds.value = events.value.data.map((e: any) => Number(e.id));
  }
};

const toggleEventSelection = (eventId: number) => {
  const index = selectedEventIds.value.indexOf(eventId);
  if (index > -1) {
    selectedEventIds.value.splice(index, 1);
  } else {
    selectedEventIds.value.push(eventId);
  }
};

const clearSelection = () => {
  selectedEventIds.value = [];
};

// Batch operations
const handleBatchApprove = async () => {
  if (selectedEventIds.value.length === 0) return;
  
  if (!confirm(`Are you sure you want to approve ${selectedEventIds.value.length} event(s)?`)) return;

  try {
    // Process all approvals
    await Promise.all(
      selectedEventIds.value.map(eventId => approveEvent(eventId))
    );
    
    // Remove all approved events from list
    selectedEventIds.value.forEach(eventId => {
      removeEventFromList(eventId, 'approved');
    });
    
    clearSelection();
  } catch (err) {
    alert('Failed to approve some events');
  }
};

const openBatchRejectModal = () => {
  if (selectedEventIds.value.length === 0) return;
  isBatchReject.value = true;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const handleRejectConfirm = async () => {
  if (!rejectionReason.value.trim()) return;

  if (isBatchReject.value) {
    // Batch reject
    try {
      await Promise.all(
        selectedEventIds.value.map(eventId => rejectEvent(eventId, rejectionReason.value))
      );
      
      selectedEventIds.value.forEach(eventId => {
        removeEventFromList(eventId, 'rejected');
      });
      
      closeRejectModal();
      clearSelection();
    } catch (err) {
      alert('Failed to reject some events');
    }
  } else {
    // Single reject
    if (!selectedEvent.value) return;
    
    try {
      await rejectEvent(selectedEvent.value.id, rejectionReason.value);
      const eventId = selectedEvent.value.id;
      closeRejectModal();
      removeEventFromList(eventId, 'rejected');
    } catch (err) {
      alert('Failed to reject event');
    }
  }
};

const formatDate = (dateString: string) => {
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

const openViewModal = async (eventId: number) => {
  showViewModal.value = true;
  isLoadingEvent.value = true;
  viewingEvent.value = null;

  try {
    const event = await getEventById(eventId);
    viewingEvent.value = event;
  } catch (err) {
    alert('Failed to load event details');
    closeViewModal();
  } finally {
    isLoadingEvent.value = false;
  }
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewingEvent.value = null;
  isLoadingEvent.value = false;
};

const handleApproveFromModal = async () => {
  if (!viewingEvent.value) return;
  if (!confirm('Are you sure you want to approve this event?')) return;

  try {
    await approveEvent(viewingEvent.value.id);
    removeEventFromList(viewingEvent.value.id, 'approved');
    closeViewModal();
  } catch (err) {
    alert('Failed to approve event');
  }
};

const handleRejectFromModal = () => {
  if (!viewingEvent.value) return;
  selectedEvent.value = viewingEvent.value;
  rejectionReason.value = '';
  showRejectModal.value = true;
  closeViewModal();
};

const handleResetFromModal = async () => {
  if (!viewingEvent.value) return;
  if (!confirm('Are you sure you want to reset this event to pending?')) return;

  try {
    await resetEventToPending(viewingEvent.value.id);
    removeEventFromList(viewingEvent.value.id, 'pending');
    closeViewModal();
  } catch (err) {
    alert('Failed to reset event status');
  }
};
</script>

