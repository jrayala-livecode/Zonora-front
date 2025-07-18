<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gray-800 rounded-lg p-8 shadow-lg">
        <!-- Profile Header -->
        <div class="flex flex-col items-center mb-8">
          <img
            :src="user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'"
            :alt="user?.name"
            class="w-24 h-24 rounded-full mb-4"
          />
          <h1 class="text-3xl font-bold text-white">{{ user?.name }}</h1>
          <p class="text-gray-400">{{ user?.email }}</p>
          <p class="text-sm text-gray-500 mt-1">Se unió en {{ user?.joinedAt }}</p>
        </div>

        <!-- Update Password Section -->
        <div class="max-w-md mx-auto">
          <h2 class="text-lg font-semibold text-white mb-4">Actualizar Contraseña</h2>
          
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Nueva contraseña"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                class="input-field w-full"
                required
              />
            </div>

            <p v-if="passwordMismatch" class="text-red-500 text-sm">
              Las contraseñas no coinciden.
            </p>
            
            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="isUpdating || passwordMismatch"
            >
              <span v-if="isUpdating">Guardando cambios...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </form>
        </div>

        <!-- Footer Links -->
        <div class="flex justify-center space-x-8 mt-12 pt-8 border-t border-gray-700">
          <NuxtLink to="/terms" class="text-gray-400 hover:text-white text-sm">
            Términos de Servicio
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-gray-400 hover:text-white text-sm">
            Política de Privacidad
          </NuxtLink>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center space-x-4 mt-6">
          <!-- (los íconos sociales quedan igual) -->
          <a href="#" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <!-- demás íconos... -->
        </div>

        <!-- Copyright -->
        <div class="text-center mt-8 text-sm text-gray-500">
          © 2025 Zonora. Todos los derechos reservados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const { user } = useAuth();

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});

const isUpdating = ref(false);

// Computed para verificar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return passwordForm.confirmPassword.length > 0 && passwordForm.newPassword !== passwordForm.confirmPassword;
});

const updatePassword = async () => {
  if (passwordMismatch.value) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  isUpdating.value = true;
  
  try {
    // Simulación de actualización
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Contraseña actualizada correctamente');
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    isUpdating.value = false;
  }
};

// SEO
useHead({
  title: 'Perfil - Zonora',
  meta: [
    { name: 'description', content: 'Gestiona tu perfil de usuario en Zonora' }
  ]
});
</script>
