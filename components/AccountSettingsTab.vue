<template>
  <div class="space-y-6">
    <!-- Basic Info Section -->
    <div class="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-4">Información de Cuenta</h2>
      
      <div class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Nombre Completo
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Tu nombre completo"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <!-- Email (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            :value="user?.email"
            type="email"
            disabled
            class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
          />
          <p class="text-xs text-gray-400 mt-1">El email no se puede cambiar</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="1000"
            placeholder="Descripción personal..."
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          ></textarea>
          <p class="text-xs text-gray-400 mt-1">{{ form.description?.length || 0 }}/1000 caracteres</p>
        </div>
      </div>
    </div>

    <!-- Password Change Section -->
    <div class="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-4">Cambiar Contraseña</h2>
      
      <div class="space-y-4">
        <!-- Current Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña Actual
          </label>
          <input
            v-model="form.current_password"
            type="password"
            placeholder="Ingresa tu contraseña actual"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Nueva Contraseña
          </label>
          <input
            v-model="form.new_password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- Confirm New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <input
            v-model="form.new_password_confirmation"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <p class="text-sm text-gray-400">
          Deja los campos de contraseña vacíos si no deseas cambiarla
        </p>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="handleSave"
        :disabled="isSaving"
        class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSaving">Guardando...</span>
        <span v-else>Guardar Cambios</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const emit = defineEmits<{
  success: [message: string];
  error: [message: string];
}>();

const { updateMyProfile, fetchMyProfile } = useMyProfile();
const { user } = useAuth();

const isSaving = ref(false);

const form = reactive({
  name: '',
  description: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

onMounted(async () => {
  try {
    const profile = await fetchMyProfile();
    form.name = profile.name || user.value?.name || '';
    form.description = profile.description || user.value?.description || '';
  } catch (error) {
    if (user.value) {
      form.name = user.value.name || '';
      form.description = user.value.description || '';
    }
  }
});

const handleSave = async () => {
  isSaving.value = true;

  try {
    const updateData: any = {
      name: form.name,
      description: form.description,
    };

    // Only include password fields if user is trying to change password
    if (form.current_password && form.new_password) {
      if (form.new_password !== form.new_password_confirmation) {
        emit('error', 'Las contraseñas no coinciden');
        return;
      }

      updateData.current_password = form.current_password;
      updateData.new_password = form.new_password;
      updateData.new_password_confirmation = form.new_password_confirmation;
    }

    await updateMyProfile(updateData);

    emit('success', '¡Perfil actualizado exitosamente!');

    // Clear password fields
    form.current_password = '';
    form.new_password = '';
    form.new_password_confirmation = '';
  } catch (error: any) {
    emit('error', error.message || 'Error al actualizar el perfil');
  } finally {
    isSaving.value = false;
  }
};
</script>

