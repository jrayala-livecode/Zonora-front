<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-gray-300">
        Proficiencias
      </label>
      <button
        v-if="!showDropdown"
        type="button"
        @click="showDropdown = true"
        class="text-xs text-orange-400 hover:text-orange-300 transition"
      >
        + Agregar
      </button>
    </div>

    <!-- Selected Proficiencies -->
    <div v-if="selectedProficiencies.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="prof in selectedProficiencies"
        :key="prof.id"
        class="inline-flex items-center px-3 py-1 bg-purple-900/30 text-purple-300 text-sm font-medium rounded-md border border-purple-700/40"
      >
        {{ prof.proficiency }}
        <button
          type="button"
          @click="removeProficiency(prof.id)"
          class="ml-2 text-purple-400 hover:text-purple-200 transition"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <p v-else class="text-xs text-gray-500 italic">
      No se han seleccionado proficiencias
    </p>

    <!-- Dropdown -->
    <div v-if="showDropdown" class="relative">
      <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600 space-y-2">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar proficiencia..."
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
          <p class="text-xs text-gray-400 mt-2">Cargando proficiencias...</p>
        </div>

        <!-- Proficiencies List -->
        <div v-else-if="filteredProficiencies.length > 0" class="max-h-48 overflow-y-auto space-y-1">
          <button
            v-for="prof in filteredProficiencies"
            :key="prof.id"
            type="button"
            @click="addProficiency(prof)"
            :disabled="isProficiencySelected(prof.id)"
            class="w-full text-left px-3 py-2 text-sm text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'bg-gray-600': isProficiencySelected(prof.id) }"
          >
            {{ prof.proficiency }}
            <span v-if="isProficiencySelected(prof.id)" class="float-right text-green-400">✓</span>
          </button>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-4">
          <p class="text-xs text-gray-400">No se encontraron proficiencias</p>
        </div>

        <!-- Close Button -->
        <button
          type="button"
          @click="showDropdown = false"
          class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProficiencies } from '~/composables/useProficiencies';
import type { Proficiency } from '~/composables/types/types';

interface Props {
  modelValue: Proficiency[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [proficiencies: Proficiency[]];
}>();

const { fetchProficiencies } = useProficiencies();

const allProficiencies = ref<Proficiency[]>([]);
const selectedProficiencies = ref<Proficiency[]>([...props.modelValue]);
const showDropdown = ref(false);
const searchQuery = ref('');
const isLoading = ref(false);

const filteredProficiencies = computed(() => {
  if (!searchQuery.value) {
    return allProficiencies.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return allProficiencies.value.filter(prof =>
    prof.proficiency.toLowerCase().includes(query)
  );
});

const isProficiencySelected = (proficiencyId: number) => {
  return selectedProficiencies.value.some(p => p.id === proficiencyId);
};

const addProficiency = (proficiency: Proficiency) => {
  if (!isProficiencySelected(proficiency.id)) {
    selectedProficiencies.value.push(proficiency);
    emit('update:modelValue', selectedProficiencies.value);
  }
};

const removeProficiency = (proficiencyId: number) => {
  selectedProficiencies.value = selectedProficiencies.value.filter(p => p.id !== proficiencyId);
  emit('update:modelValue', selectedProficiencies.value);
};

const loadProficiencies = async () => {
  isLoading.value = true;
  try {
    allProficiencies.value = await fetchProficiencies();
  } catch (error) {
    console.error('Error loading proficiencies:', error);
  } finally {
    isLoading.value = false;
  }
};

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  selectedProficiencies.value = [...newVal];
}, { deep: true });

onMounted(() => {
  loadProficiencies();
});
</script>

