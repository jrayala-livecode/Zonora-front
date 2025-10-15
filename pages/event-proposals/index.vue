<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Event Proposals</h1>
          <p class="text-gray-400 mt-2">Collaborate with artists to plan events</p>
        </div>
        <NuxtLink
          to="/event-proposals/create"
          class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          + New Proposal
        </NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'my-proposals'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'my-proposals'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            ]"
          >
            My Proposals ({{ myProposals.length }})
          </button>
          <button
            @click="activeTab = 'collaborating'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'collaborating'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            ]"
          >
            Collaborating ({{ collaboratingProposals.length }})
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p class="mt-4 text-gray-400">Loading proposals...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <p class="text-red-400">{{ error }}</p>
        <button 
          @click="loadProposals"
          class="mt-4 text-orange-500 hover:text-orange-400 font-medium"
        >
          Try Again
        </button>
      </div>

      <!-- My Proposals Tab -->
      <div v-else-if="activeTab === 'my-proposals'">
        <div v-if="myProposals.length === 0" class="text-center py-16">
          <div class="text-gray-500 text-6xl mb-4">📋</div>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No proposals yet</h3>
          <p class="text-gray-400 mb-6">Start collaborating by creating your first event proposal</p>
          <NuxtLink
            to="/event-proposals/create"
            class="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Create Proposal
          </NuxtLink>
        </div>

        <div v-else class="grid gap-4">
          <NuxtLink
            v-for="proposal in myProposals"
            :key="proposal.id"
            :to="`/event-proposals/${proposal.id}`"
            class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition border border-gray-700 hover:border-orange-500/50"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">{{ proposal.name }}</h3>
                <p v-if="proposal.description" class="text-gray-400 text-sm line-clamp-2">
                  {{ proposal.description }}
                </p>
              </div>
              <span
                :class="getStatusClass(proposal.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {{ proposal.status }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4 text-gray-400">
                <span>👥 {{ (proposal.collaborators?.filter(c => c.status === 'accepted').length || 0) + 1 }} collaborators</span>
                <span>📊 {{ proposal.negotiations?.filter(n => n.status === 'approved').length || 0 }}/3 approved</span>
                <span v-if="proposal.unread_count && proposal.unread_count > 0" class="text-orange-500 font-semibold">
                  💬 {{ proposal.unread_count }} unread
                </span>
              </div>
              <span class="text-gray-500">
                {{ formatDate(proposal.last_activity_at || proposal.created_at) }}
              </span>
            </div>

            <div v-if="proposal.last_message" class="mt-4 pt-4 border-t border-gray-700">
              <p class="text-sm text-gray-400">
                <span class="font-semibold">{{ proposal.last_message.sender?.name || 'System' }}:</span>
                {{ truncate(proposal.last_message.body, 100) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Collaborating Tab -->
      <div v-else-if="activeTab === 'collaborating'">
        <div v-if="collaboratingProposals.length === 0" class="text-center py-16">
          <div class="text-gray-500 text-6xl mb-4">🤝</div>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No collaborations yet</h3>
          <p class="text-gray-400">You haven't been invited to any proposals</p>
        </div>

        <div v-else class="grid gap-4">
          <NuxtLink
            v-for="proposal in collaboratingProposals"
            :key="proposal.id"
            :to="`/event-proposals/${proposal.id}`"
            class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition border border-gray-700 hover:border-orange-500/50"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">{{ proposal.name }}</h3>
                <p class="text-gray-400 text-sm">
                  Organized by: <span class="text-orange-500">{{ proposal.organizer?.name }}</span>
                </p>
                <p v-if="proposal.description" class="text-gray-400 text-sm mt-2 line-clamp-2">
                  {{ proposal.description }}
                </p>
              </div>
              <span
                :class="getStatusClass(proposal.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {{ proposal.status }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4 text-gray-400">
                <span>👥 {{ (proposal.collaborators?.filter(c => c.status === 'accepted').length || 0) + 1 }} collaborators</span>
                <span>📊 {{ proposal.negotiations?.filter(n => n.status === 'approved').length || 0 }}/3 approved</span>
                <span v-if="proposal.unread_count && proposal.unread_count > 0" class="text-orange-500 font-semibold">
                  💬 {{ proposal.unread_count }} unread
                </span>
              </div>
              <span class="text-gray-500">
                {{ formatDate(proposal.last_activity_at || proposal.created_at) }}
              </span>
            </div>

            <div v-if="proposal.last_message" class="mt-4 pt-4 border-t border-gray-700">
              <p class="text-sm text-gray-400">
                <span class="font-semibold">{{ proposal.last_message.sender?.name || 'System' }}:</span>
                {{ truncate(proposal.last_message.body, 100) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { 
  loading, 
  error, 
  myProposals, 
  collaboratingProposals, 
  fetchMyProposals 
} = useEventProposals()

const activeTab = ref<'my-proposals' | 'collaborating'>('my-proposals')

const loadProposals = async () => {
  try {
    await fetchMyProposals()
  } catch (err) {
    console.error('Failed to load proposals:', err)
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    }
    return `${hours}h ago`
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const truncate = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

onMounted(() => {
  loadProposals()
})
</script>

