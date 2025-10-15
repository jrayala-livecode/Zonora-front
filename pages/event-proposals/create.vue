<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink 
          to="/event-proposals" 
          class="text-gray-400 hover:text-white inline-flex items-center mb-4"
        >
          ← Back to Proposals
        </NuxtLink>
        <h1 class="text-3xl font-bold">Create Event Proposal</h1>
        <p class="text-gray-400 mt-2">Start planning an event with other artists</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-gray-800 rounded-lg p-8">
        <!-- Artist Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            Your Artist Profile <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.organizer_artist_id"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          >
            <option value="">Select an artist profile...</option>
            <option 
              v-for="artist in userArtists" 
              :key="artist.id" 
              :value="artist.id"
            >
              {{ artist.name }}
            </option>
          </select>
          <p class="text-xs text-gray-400 mt-2">This artist will be the organizer of the event</p>
        </div>

        <!-- Proposal Name -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            Event Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g., Electronic Night Vol. 1"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Describe your event proposal..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
          ></textarea>
          <p class="text-xs text-gray-400 mt-2">Explain what kind of event you're planning</p>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h4 class="font-semibold mb-2 text-blue-400">What happens next?</h4>
          <ul class="text-sm text-gray-300 space-y-1">
            <li>✓ A group chat will be created automatically</li>
            <li>✓ You can invite other artists to collaborate</li>
            <li>✓ Together you'll negotiate price, venue, and date</li>
            <li>✓ Once everyone agrees, you can create the event</li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="loading || !form.organizer_artist_id || !form.name"
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <span v-if="loading">Creating...</span>
            <span v-else>Create Proposal</span>
          </button>
          <NuxtLink
            to="/event-proposals"
            class="px-6 py-3 rounded-lg font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { loading, error, createProposal } = useEventProposals()
const { artists: userArtists, fetchUserArtists } = useArtists()

const form = ref({
  organizer_artist_id: '',
  name: '',
  description: '',
})

const handleSubmit = async () => {
  try {
    const proposal = await createProposal({
      organizer_artist_id: parseInt(form.value.organizer_artist_id),
      name: form.value.name,
      description: form.value.description || undefined,
    })
    
    // Redirect to the new proposal
    router.push(`/event-proposals/${proposal.id}`)
  } catch (err) {
    console.error('Failed to create proposal:', err)
  }
}

onMounted(async () => {
  await fetchUserArtists()
  
  // Pre-select if only one artist
  if (userArtists.value.length === 1) {
    form.value.organizer_artist_id = userArtists.value[0].id.toString()
  }
})
</script>

