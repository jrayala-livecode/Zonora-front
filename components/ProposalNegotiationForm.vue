<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h3 class="text-lg font-semibold mb-4">Submit New Proposal</h3>

    <form @submit.prevent="handleSubmit">
      <!-- Negotiation Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          What would you like to propose? <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.type"
          required
          @change="handleTypeChange"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
        >
          <option value="">Select type...</option>
          <option 
            v-for="type in availableTypes" 
            :key="type.id" 
            :value="type.name"
          >
            {{ getTypeIcon(type.name) }} {{ type.display_name }}
          </option>
        </select>
      </div>

      <!-- Price Input (JSON format for ticket tiers) -->
      <div v-if="form.type === 'price'" class="mb-4">
        <label class="block text-sm font-medium mb-2">
          Artist Fee <span class="text-red-500">*</span>
        </label>
        <div class="space-y-3">
          <div v-for="(tier, index) in priceTiers" :key="index" class="flex items-center space-x-3">
            <input
              v-model="tier.name"
              type="text"
              placeholder="Tier name (e.g., General)"
              class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 outline-none"
            />
            <input
              v-model.number="tier.price"
              type="number"
              placeholder="Price"
              min="0"
              class="w-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 outline-none"
            />
            <button
              v-if="priceTiers.length > 1"
              type="button"
              @click="removePriceTier(index)"
              class="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            @click="addPriceTier"
            class="text-sm text-orange-500 hover:text-orange-400"
          >
            + Add Tier
          </button>
        </div>
      </div>

      <!-- Venue Selection -->
      <div v-if="form.type === 'venue'" class="mb-4">
        <label class="block text-sm font-medium mb-2">
          Venue <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.value_reference_id"
          required
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
        >
          <option value="">Select a venue...</option>
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">
            {{ venue.name }} - {{ venue.city }}
          </option>
        </select>
      </div>

      <!-- Date Selection -->
      <div v-if="form.type === 'date'" class="mb-4">
        <label class="block text-sm font-medium mb-2">
          Event Date & Time <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.value_date"
          type="datetime-local"
          required
          :min="minDate"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
        />
      </div>

      <!-- Message -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          Message (optional)
        </label>
        <textarea
          v-model="form.message"
          rows="3"
          placeholder="Explain your proposal..."
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3">
        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          {{ loading ? 'Submitting...' : 'Submit Proposal' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 rounded-lg font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition"
        >
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EventProposalNegotiationType } from '../composables/types/types'

const props = defineProps<{
  proposalId: number
  existingNegotiations: any[]
  totalNeeded: number
}>()

const emit = defineEmits<{
  submitted: []
}>()

const { loading, error, submitNegotiation } = useProposalNegotiations()
const { venues, fetchVenues } = useVenues()

const form = ref({
  type: '',
  value_reference_id: '',
  value_date: '',
  message: '',
})

const priceTiers = ref([
  { name: 'General', price: 0 }
])

const negotiationTypes = ref<EventProposalNegotiationType[]>([
  { id: 1, name: 'price', display_name: 'Artist Fee', value_type: 'json', description: '', is_active: true, requires_approval: true, created_at: '', updated_at: '' },
  { id: 2, name: 'venue', display_name: 'Venue', value_type: 'venue_id', description: '', is_active: true, requires_approval: true, created_at: '', updated_at: '' },
  { id: 3, name: 'date', display_name: 'Event Date', value_type: 'date', description: '', is_active: true, requires_approval: true, created_at: '', updated_at: '' },
])

const availableTypes = computed(() => {
  return negotiationTypes.value.filter(type => {
    const existing = props.existingNegotiations.find(n => n.type?.name === type.name)
    return !existing || existing.status !== 'pending'
  })
})

const canSubmit = computed(() => {
  if (!form.value.type) return false
  if (form.value.type === 'venue') return !!form.value.value_reference_id
  if (form.value.type === 'date') return !!form.value.value_date
  if (form.value.type === 'price') return priceTiers.value.some(t => t.price > 0)
  return false
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().slice(0, 16)
})

const addPriceTier = () => {
  priceTiers.value.push({ name: `Tier ${priceTiers.value.length + 1}`, price: 0 })
}

const removePriceTier = (index: number) => {
  priceTiers.value.splice(index, 1)
}

const handleTypeChange = () => {
  // Reset values when type changes
  form.value.value_reference_id = ''
  form.value.value_date = ''
  priceTiers.value = [{ name: 'General', price: 0 }]
}

const resetForm = () => {
  form.value = {
    type: '',
    value_reference_id: '',
    value_date: '',
    message: '',
  }
  priceTiers.value = [{ name: 'General', price: 0 }]
}

const handleSubmit = async () => {
  try {
    const typeObj = negotiationTypes.value.find(t => t.name === form.value.type)
    if (!typeObj) return

    const payload: any = {
      negotiation_type_id: typeObj.id,
      message: form.value.message || undefined,
    }

    if (form.value.type === 'venue') {
      payload.value_reference_id = parseInt(form.value.value_reference_id)
    } else if (form.value.type === 'date') {
      payload.value_date = form.value.value_date
    } else if (form.value.type === 'price') {
      const priceObj: Record<string, any> = {}
      priceTiers.value.forEach(tier => {
        if (tier.price > 0) {
          priceObj[tier.name.toLowerCase()] = { name: tier.name, price: tier.price }
        }
      })
      payload.value_json = priceObj
    }

    await submitNegotiation(props.proposalId, payload)
    resetForm()
    emit('submitted')
  } catch (err) {
    console.error('Failed to submit negotiation:', err)
  }
}

const getTypeIcon = (typeName: string) => {
  const icons: Record<string, string> = {
    price: '💰',
    venue: '📍',
    date: '📅',
  }
  return icons[typeName] || '📝'
}

onMounted(async () => {
  await fetchVenues()
})
</script>

