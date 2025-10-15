<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Loading State -->
    <div v-if="pageLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p class="text-gray-400">Loading proposal...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="pageError" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-red-400 mb-4">{{ pageError }}</p>
        <button 
          @click="loadProposal"
          class="text-orange-500 hover:text-orange-400 font-medium"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="proposal" class="flex" style="height: calc(100vh - 64px);">
      <!-- Left Sidebar - Proposal Info & Negotiations -->
      <div class="w-96 bg-gray-800 border-r border-gray-700 flex flex-col h-full overflow-y-auto">
        <div class="p-6">
          <!-- Back Button -->
          <NuxtLink 
            to="/event-proposals" 
            class="text-gray-400 hover:text-white inline-flex items-center mb-4 text-sm"
          >
            ← Back
          </NuxtLink>

          <!-- Proposal Header -->
          <div class="mb-6">
            <div class="flex items-start justify-between mb-2">
              <h1 class="text-2xl font-bold flex-1">{{ proposal.name }}</h1>
              <span
                :class="getStatusClass(proposal.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold uppercase ml-2"
              >
                {{ proposal.status }}
              </span>
            </div>
            <p v-if="proposal.description" class="text-gray-400 text-sm">
              {{ proposal.description }}
            </p>
          </div>

          <!-- Organizer Info -->
          <div class="mb-6 p-4 bg-gray-900 rounded-lg">
            <p class="text-xs text-gray-500 uppercase mb-1">Organizer</p>
            <p class="font-semibold">{{ proposal.organizer?.name }}</p>
            <p class="text-sm text-gray-400">{{ proposal.organizer_artist?.name }}</p>
          </div>

          <!-- Collaborators -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold">Collaborators</h3>
              <button
                v-if="isOrganizer"
                @click="showInviteModal = true"
                class="text-sm text-orange-500 hover:text-orange-400"
              >
                + Invite
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="collab in proposal.collaborators" 
                :key="collab.id"
                class="flex items-center justify-between p-3 bg-gray-900 rounded-lg text-sm"
              >
                <div>
                  <p class="font-medium">{{ collab.artist?.name }}</p>
                  <p class="text-xs text-gray-500">{{ collab.user?.name }}</p>
                </div>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs',
                    collab.status === 'accepted' ? 'bg-green-600/20 text-green-400' :
                    collab.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  ]"
                >
                  {{ collab.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Negotiations Summary -->
          <div class="mb-6">
            <h3 class="font-semibold mb-3">Negotiations</h3>
            <div class="space-y-2">
              <div 
                v-for="type in ['price', 'venue', 'date']" 
                :key="type"
                class="flex items-center justify-between p-3 bg-gray-900 rounded-lg text-sm"
              >
                <span>{{ getTypeIcon(type) }} {{ getTypeName(type) }}</span>
                <span 
                  v-if="getApprovedNegotiation(type)"
                  class="text-green-400 font-semibold"
                >
                  ✓ Approved
                </span>
                <span 
                  v-else-if="getPendingNegotiation(type)"
                  class="text-yellow-400"
                >
                  ⏳ Voting
                </span>
                <span v-else class="text-gray-500">
                  - Not set
                </span>
              </div>
            </div>
          </div>

          <!-- Create Event Button -->
          <button
            v-if="proposal.status === 'ready' && isOrganizer"
            @click="handleCreateEvent"
            :disabled="creatingEvent"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition"
          >
            {{ creatingEvent ? 'Creating Event...' : '✓ Create Event' }}
          </button>
        </div>
      </div>

      <!-- Right Side - Tabbed Content (Chat & Negotiations) -->
      <div class="flex-1 flex flex-col h-full">
        <!-- Tabs -->
        <div class="bg-gray-800 border-b border-gray-700 px-6 flex-shrink-0">
          <nav class="flex space-x-6">
            <button
              @click="activeTab = 'chat'"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition',
                activeTab === 'chat'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              ]"
            >
              💬 Chat
              <span v-if="unreadCount > 0" class="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {{ unreadCount }}
              </span>
            </button>
            <button
              @click="activeTab = 'negotiations'"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition',
                activeTab === 'negotiations'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              ]"
            >
              📊 Negotiations
            </button>
          </nav>
        </div>

        <!-- Chat Tab -->
        <div v-if="activeTab === 'chat'" class="flex-1 flex flex-col min-h-0">
          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            <div v-if="messagesLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            <div v-else-if="messages.length === 0" class="text-center py-16 text-gray-500">
              No messages yet. Start the conversation!
            </div>
            <div v-else>
              <div 
                v-for="message in messages" 
                :key="message.id"
                :class="[
                  'flex',
                  message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
                ]"
              >
                <div 
                  :class="[
                    'max-w-lg rounded-lg p-4',
                    message.message_type === 'system' ? 'bg-blue-900/30 border border-blue-500/30 text-center text-sm' :
                    message.message_type === 'proposal' || message.message_type === 'vote' ? 'bg-purple-900/30 border border-purple-500/30' :
                    message.user_id === currentUser?.id ? 'bg-orange-600' : 'bg-gray-700'
                  ]"
                >
                  <div v-if="message.message_type !== 'system'" class="flex items-center space-x-2 mb-2">
                    <span class="font-semibold text-sm">{{ message.sender?.name }}</span>
                    <span class="text-xs text-gray-400">
                      {{ formatMessageTime(message.created_at) }}
                    </span>
                  </div>
                  <p class="whitespace-pre-wrap">{{ message.body }}</p>
                </div>
              </div>
            </div>
            <div ref="messagesEnd"></div>
          </div>

          <!-- Message Input -->
          <div class="flex-shrink-0 p-6 bg-gray-800 border-t border-gray-700">
            <form @submit.prevent="sendChatMessage" class="flex space-x-3">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Type a message..."
                class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button
                type="submit"
                :disabled="!newMessage.trim() || sendingMessage"
                class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <!-- Negotiations Tab -->
        <div v-else-if="activeTab === 'negotiations'" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Submit New Proposal Form -->
          <ProposalNegotiationForm
            v-if="proposal.status !== 'completed' && proposal.status !== 'cancelled'"
            :proposal-id="proposal.id"
            :existing-negotiations="negotiations"
            :total-needed="totalCollaborators"
            @submitted="handleNegotiationSubmitted"
          />

          <!-- Existing Negotiations -->
          <div v-if="negotiations.length > 0" class="space-y-4">
            <h3 class="text-xl font-semibold">Active & Past Negotiations</h3>
            <ProposalNegotiationCard
              v-for="negotiation in negotiations"
              :key="negotiation.id"
              :negotiation="negotiation"
              :current-user-id="currentUser!.id"
              :total-needed="totalCollaborators"
              :can-vote="canVoteOnNegotiation(negotiation)"
              :voting-loading="votingNegotiationId === negotiation.id"
              @vote="handleVote"
            />
          </div>
          <div v-else class="text-center py-16 text-gray-500">
            <p>No negotiations submitted yet</p>
            <p class="text-sm mt-2">Submit your first proposal above to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Artists Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold mb-4">Invite Artists</h3>
        
        <!-- Artist Search/Select would go here -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Search Artists</label>
          <input
            v-model="inviteSearch"
            type="text"
            placeholder="Search by name..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 outline-none"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Message (optional)</label>
          <textarea
            v-model="inviteMessage"
            rows="3"
            placeholder="Add a personal message..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex space-x-3">
          <button
            @click="handleInvite"
            :disabled="invitingArtists || selectedArtistIds.length === 0"
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition"
          >
            {{ invitingArtists ? 'Inviting...' : `Invite ${selectedArtistIds.length} Artist(s)` }}
          </button>
          <button
            @click="showInviteModal = false"
            class="px-4 py-3 rounded-lg font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProposalChatMessage, EventProposalNegotiation } from '../../composables/types/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { user: currentUser } = useAuth()

const proposalId = computed(() => parseInt(route.params.id as string))

// Proposal Management
const { 
  loading: pageLoading, 
  error: pageError, 
  currentProposal: proposal,
  fetchProposal,
  inviteArtists,
  createEventFromProposal,
} = useEventProposals()

// Chat Management
const {
  loading: messagesLoading,
  messages,
  unreadCount,
  fetchMessages,
  sendMessage,
  markAsRead,
  addMessageToList,
} = useProposalChat()

// Negotiations Management
const {
  loading: negotiationsLoading,
  negotiations,
  fetchNegotiations,
  voteOnNegotiation,
  hasUserVoted,
} = useProposalNegotiations()

// UI State
const activeTab = ref<'chat' | 'negotiations'>('chat')
const newMessage = ref('')
const sendingMessage = ref(false)
const messagesEnd = ref<HTMLElement | null>(null)
const votingNegotiationId = ref<number | null>(null)
const creatingEvent = ref(false)
const showInviteModal = ref(false)
const inviteSearch = ref('')
const inviteMessage = ref('')
const selectedArtistIds = ref<number[]>([])
const invitingArtists = ref(false)

// Echo/WebSocket
const { $echo } = useNuxtApp() as any

// Computed
const isOrganizer = computed(() => 
  proposal.value?.organizer_user_id === currentUser.value?.id
)

const totalCollaborators = computed(() => 
  1 + (proposal.value?.collaborators?.filter(c => c.status === 'accepted').length || 0)
)

const canVoteOnNegotiation = (negotiation: EventProposalNegotiation) => {
  return negotiation.status === 'pending' && !hasUserVoted(negotiation, currentUser.value!.id)
}

const getApprovedNegotiation = (typeName: string) => {
  return negotiations.value.find(n => n.type?.name === typeName && n.status === 'approved')
}

const getPendingNegotiation = (typeName: string) => {
  return negotiations.value.find(n => n.type?.name === typeName && n.status === 'pending')
}

// Methods
const loadProposal = async () => {
  try {
    await fetchProposal(proposalId.value)
    await Promise.all([
      fetchMessages(proposalId.value),
      fetchNegotiations(proposalId.value)
    ])
    
    if (proposal.value?.conversation_id) {
      markAsRead(proposalId.value)
    }
  } catch (err) {
    console.error('Failed to load proposal:', err)
  }
}

const sendChatMessage = async () => {
  if (!newMessage.value.trim()) return
  
  sendingMessage.value = true
  try {
    await sendMessage(proposalId.value, newMessage.value)
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  } finally {
    sendingMessage.value = false
  }
}

const handleVote = async (negotiationId: number, vote: 'yes' | 'no') => {
  votingNegotiationId.value = negotiationId
  try {
    await voteOnNegotiation(proposalId.value, negotiationId, vote)
    await fetchProposal(proposalId.value) // Refresh proposal status
  } catch (err) {
    console.error('Failed to vote:', err)
  } finally {
    votingNegotiationId.value = null
  }
}

const handleNegotiationSubmitted = async () => {
  await Promise.all([
    fetchNegotiations(proposalId.value),
    fetchMessages(proposalId.value), // Refresh to see system message
  ])
  
  // Switch to chat to see the proposal message
  activeTab.value = 'chat'
  await nextTick()
  scrollToBottom()
}

const handleCreateEvent = async () => {
  if (!confirm('Create event from this proposal? This will finalize all negotiations.')) {
    return
  }
  
  creatingEvent.value = true
  try {
    const event = await createEventFromProposal(proposalId.value)
    alert('Event created successfully!')
    router.push(`/events/${event.id}`)
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to create event')
  } finally {
    creatingEvent.value = false
  }
}

const handleInvite = async () => {
  // This would use actual selected artists
  // For now, placeholder
  invitingArtists.value = true
  try {
    await inviteArtists(proposalId.value, selectedArtistIds.value, inviteMessage.value || undefined)
    showInviteModal.value = false
    inviteSearch.value = ''
    inviteMessage.value = ''
    selectedArtistIds.value = []
    await loadProposal()
  } catch (err) {
    console.error('Failed to invite artists:', err)
  } finally {
    invitingArtists.value = false
  }
}

const scrollToBottom = () => {
  if (messagesEnd.value) {
    messagesEnd.value.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-600 text-gray-200',
    negotiating: 'bg-blue-600 text-blue-200',
    ready: 'bg-green-600 text-green-200',
    completed: 'bg-purple-600 text-purple-200',
    cancelled: 'bg-red-600 text-red-200',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-600 text-gray-200'
}

const getTypeIcon = (typeName: string) => {
  const icons: Record<string, string> = {
    price: '💰',
    venue: '📍',
    date: '📅',
  }
  return icons[typeName] || '📝'
}

const getTypeName = (typeName: string) => {
  const names: Record<string, string> = {
    price: 'Artist Fee',
    venue: 'Venue',
    date: 'Event Date',
  }
  return names[typeName] || typeName
}

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// WebSocket Setup
const setupWebSocket = () => {
  if (!proposal.value?.conversation_id || !$echo) return

  const channel = $echo.private(`conversation.${proposal.value.conversation_id}`)
  
  channel.listen('.ProposalMessageSent', (data: any) => {
    const newMsg: ProposalChatMessage = {
      id: data.message.id,
      body: data.message.body,
      user_id: data.message.user_id,
      conversation_id: data.message.conversation_id,
      participation_id: data.message.participation_id,
      type: data.message.type,
      message_type: data.message_type,
      related_negotiation_id: data.related_negotiation_id,
      related_vote_id: data.related_vote_id,
      data: data.message.data,
      created_at: data.message.created_at,
      updated_at: data.message.updated_at,
      sender: data.message.sender,
    }
    
    addMessageToList(newMsg)
    
    nextTick(() => {
      scrollToBottom()
    })
    
    // Refresh negotiations if it's a proposal or vote message
    if (data.message_type === 'proposal' || data.message_type === 'vote') {
      fetchNegotiations(proposalId.value)
      fetchProposal(proposalId.value) // Update status
    }
  })
}

// Lifecycle
onMounted(async () => {
  await loadProposal()
  setupWebSocket()
  
  nextTick(() => {
    scrollToBottom()
  })
})

// Watch for tab changes to mark messages as read
watch(activeTab, (newTab) => {
  if (newTab === 'chat' && proposal.value?.conversation_id) {
    markAsRead(proposalId.value)
  }
})
</script>

