<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-300">
      Géneros Musicales
    </label>
    
    <!-- Selected Genres (Tags/Chips) -->
    <div v-if="selectedGenres.length > 0" class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="(genre, index) in selectedGenres"
        :key="index"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-500 text-white transition-colors duration-200"
      >
        {{ genre }}
        <button
          @click="removeGenre(index)"
          type="button"
          class="ml-2 hover:text-gray-200 focus:outline-none"
          :aria-label="`Eliminar ${genre}`"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <!-- Input with Autocomplete -->
    <div class="relative">
      <input
        v-model="inputValue"
        @input="handleInput"
        @keydown.enter.prevent="handleEnter"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrevious"
        @keydown.escape="closeSuggestions"
        @focus="showSuggestionsDropdown"
        @blur="handleBlur"
        type="text"
        :placeholder="selectedGenres.length === 0 ? 'Escribe un género o selecciona de la lista' : 'Agregar otro género...'"
        class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
      />

      <!-- Loading Indicator -->
      <div
        v-if="isLoading"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
      </div>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <button
          v-for="(genre, index) in filteredSuggestions"
          :key="genre.id"
          @mousedown.prevent="selectGenre(genre.name)"
          type="button"
          class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700"
          :class="{ 'bg-gray-700': index === highlightedIndex }"
        >
          {{ genre.name }}
        </button>
      </div>

      <!-- No Results Message -->
      <div
        v-if="showSuggestions && inputValue.length > 0 && filteredSuggestions.length === 0"
        class="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 text-center"
      >
        <p class="text-gray-400 text-sm mb-2">
          No se encontró "{{ inputValue }}"
        </p>
        <button
          @mousedown.prevent="createNewGenre"
          type="button"
          class="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors duration-200"
        >
          Presiona Enter para agregarlo como nuevo género
        </button>
      </div>
    </div>

    <!-- Helper Text -->
    <p class="text-xs text-gray-400">
      Escribe y presiona Enter para agregar. También puedes seleccionar de las sugerencias.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGenres } from '~/composables/useGenres'
import type { Genre } from '~/composables/useGenres'

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [genres: string[]]
}>()

const { genres, isLoading, fetchGenres, getSuggestions } = useGenres()

// Local state
const inputValue = ref('')
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const selectedGenres = ref<string[]>([...props.modelValue])

// Computed
const filteredSuggestions = computed(() => {
  if (!inputValue.value) {
    return genres.value.slice(0, 10) // Show top 10 when input is empty
  }
  
  const suggestions = getSuggestions(inputValue.value, 10)
  
  // Filter out already selected genres
  return suggestions.filter(genre => 
    !selectedGenres.value.some(selected => 
      selected.toLowerCase() === genre.name.toLowerCase()
    )
  )
})

// Methods
const handleInput = () => {
  showSuggestions.value = true
  highlightedIndex.value = -1
}

const showSuggestionsDropdown = () => {
  showSuggestions.value = true
}

const closeSuggestions = () => {
  showSuggestions.value = false
  highlightedIndex.value = -1
}

const handleBlur = () => {
  // Delay to allow click events on suggestions
  setTimeout(() => {
    closeSuggestions()
  }, 200)
}

const handleEnter = () => {
  if (highlightedIndex.value >= 0 && filteredSuggestions.value[highlightedIndex.value]) {
    selectGenre(filteredSuggestions.value[highlightedIndex.value].name)
  } else if (inputValue.value.trim()) {
    createNewGenre()
  }
}

const highlightNext = () => {
  if (highlightedIndex.value < filteredSuggestions.value.length - 1) {
    highlightedIndex.value++
  }
}

const highlightPrevious = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

const selectGenre = (genreName: string) => {
  const trimmedGenre = genreName.trim()
  
  if (!trimmedGenre) return
  
  // Check if already selected (case-insensitive)
  const alreadySelected = selectedGenres.value.some(
    selected => selected.toLowerCase() === trimmedGenre.toLowerCase()
  )
  
  if (!alreadySelected) {
    selectedGenres.value.push(trimmedGenre)
    emit('update:modelValue', selectedGenres.value)
  }
  
  inputValue.value = ''
  closeSuggestions()
}

const createNewGenre = () => {
  selectGenre(inputValue.value)
}

const removeGenre = (index: number) => {
  selectedGenres.value.splice(index, 1)
  emit('update:modelValue', selectedGenres.value)
}

// Load genres on mount
onMounted(async () => {
  await fetchGenres()
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedGenres.value = [...newValue]
}, { deep: true })
</script>

<style scoped>
/* Custom scrollbar for suggestions dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>

