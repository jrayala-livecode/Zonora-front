<template>
  <div 
    :class="[
      'bg-gray-800 rounded-lg p-6 border-2 transition',
      negotiation.status === 'approved' ? 'border-green-500' :
      negotiation.status === 'rejected' ? 'border-red-500' :
      'border-gray-700'
    ]"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <h3 class="text-lg font-semibold">{{ getTypeIcon(negotiation.type?.name) }} {{ negotiation.type?.display_name }}</h3>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold uppercase',
              negotiation.status === 'approved' ? 'bg-green-600 text-green-200' :
              negotiation.status === 'rejected' ? 'bg-red-600 text-red-200' :
              negotiation.status === 'pending' ? 'bg-yellow-600 text-yellow-200' :
              'bg-gray-600 text-gray-200'
            ]"
          >
            {{ negotiation.status }}
          </span>
        </div>
        <p class="text-sm text-gray-400">Proposed by {{ negotiation.proposed_by?.name }}</p>
      </div>
    </div>

    <!-- Value -->
    <div class="mb-4 p-4 bg-gray-900 rounded-lg">
      <p class="text-xl font-bold text-orange-500">
        {{ negotiation.formatted_value || formatValue(negotiation) }}
      </p>
    </div>

    <!-- Message -->
    <div v-if="negotiation.message" class="mb-4 p-4 bg-gray-750 rounded-lg border border-gray-600">
      <p class="text-sm text-gray-300 italic">"{{ negotiation.message }}"</p>
    </div>

    <!-- Voting Section -->
    <div v-if="negotiation.status === 'pending'" class="border-t border-gray-700 pt-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-400">Votes: {{ voteCount.yes }}/{{ totalNeeded }}</span>
        <div class="flex items-center space-x-2">
          <span 
            v-for="i in totalNeeded" 
            :key="i"
            :class="[
              'w-2 h-2 rounded-full',
              i <= voteCount.yes ? 'bg-green-500' : 'bg-gray-600'
            ]"
          ></span>
        </div>
      </div>

      <!-- User's Vote Status or Voting Buttons -->
      <div v-if="hasUserVoted">
        <div class="flex items-center space-x-2 text-sm">
          <span 
            :class="userVote?.vote === 'yes' ? 'text-green-400' : 'text-red-400'"
            class="font-semibold"
          >
            You voted {{ userVote?.vote === 'yes' ? '✓ YES' : '✗ NO' }}
          </span>
        </div>
      </div>
      <div v-else-if="canVote" class="flex space-x-3">
        <button
          @click="$emit('vote', negotiation.id, 'yes')"
          :disabled="votingLoading"
          class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ✓ Approve
        </button>
        <button
          @click="$emit('vote', negotiation.id, 'no')"
          :disabled="votingLoading"
          class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ✗ Reject
        </button>
      </div>
      <div v-else class="text-sm text-gray-500 italic">
        Waiting for other collaborators to vote...
      </div>
    </div>

    <!-- Approved/Rejected Info -->
    <div v-else-if="negotiation.status === 'approved'" class="border-t border-green-500/30 pt-4">
      <p class="text-sm text-green-400 font-semibold">✓ All collaborators voted YES</p>
      <p class="text-xs text-gray-400 mt-1">
        Approved {{ formatDate(negotiation.approved_at!) }}
      </p>
    </div>
    <div v-else-if="negotiation.status === 'rejected'" class="border-t border-red-500/30 pt-4">
      <p class="text-sm text-red-400 font-semibold">✗ At least one collaborator voted NO</p>
      <p class="text-xs text-gray-400 mt-1">
        Rejected {{ formatDate(negotiation.rejected_at!) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EventProposalNegotiation } from '../composables/types/types'

const props = defineProps<{
  negotiation: EventProposalNegotiation
  currentUserId: number
  totalNeeded: number
  canVote: boolean
  votingLoading?: boolean
}>()

defineEmits<{
  vote: [negotiationId: number, vote: 'yes' | 'no']
}>()

const { hasUserVoted: checkUserVoted, getUserVote, getVoteCount } = useProposalNegotiations()

const hasUserVoted = computed(() => 
  checkUserVoted(props.negotiation, props.currentUserId)
)

const userVote = computed(() => 
  getUserVote(props.negotiation, props.currentUserId)
)

const voteCount = computed(() => 
  getVoteCount(props.negotiation)
)

const getTypeIcon = (typeName?: string) => {
  const icons: Record<string, string> = {
    price: '💰',
    venue: '📍',
    date: '📅',
  }
  return icons[typeName || ''] || '📝'
}

const formatValue = (negotiation: EventProposalNegotiation) => {
  if (negotiation.type?.value_type === 'venue_id' && negotiation.venue) {
    return negotiation.venue.name
  }
  if (negotiation.type?.value_type === 'date' && negotiation.value_date) {
    return new Date(negotiation.value_date).toLocaleString()
  }
  if (negotiation.type?.value_type === 'number' && negotiation.value_number) {
    return '$' + negotiation.value_number.toLocaleString()
  }
  if (negotiation.type?.value_type === 'json' && negotiation.value_json) {
    return JSON.stringify(negotiation.value_json, null, 2)
  }
  return negotiation.value_text || 'N/A'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
</script>

