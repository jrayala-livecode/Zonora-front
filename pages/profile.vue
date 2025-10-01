<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Profile Header -->
      <div class="bg-gray-800 rounded-xl shadow-xl mb-8">
        <div class="px-8 py-8">
          <div class="flex flex-col items-center">
            <ClientOnly>
              <img
                :src="user?.avatar || 'https://www.gravatar.com/avatar/default?d=identicon&s=96'"
                :alt="user?.name || 'Usuario'"
                class="w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg mb-4"
                @error="handleAvatarError"
              />
              <template #fallback>
                <div class="w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg mb-4 bg-gray-700 animate-pulse"></div>
              </template>
            </ClientOnly>
            <ClientOnly>
              <h1 class="text-3xl font-bold text-white">{{ user?.name || 'Usuario' }}</h1>
              <template #fallback>
                <div class="h-9 bg-gray-700 rounded animate-pulse mb-2 w-48"></div>
              </template>
            </ClientOnly>
            <ClientOnly>
              <p class="text-gray-400 mt-1">{{ user?.email || 'usuario@ejemplo.com' }}</p>
              <template #fallback>
                <div class="h-5 bg-gray-700 rounded animate-pulse mb-2 w-64"></div>
              </template>
            </ClientOnly>
            <ClientOnly>
              <p class="text-gray-500 text-sm mt-2">Se unió en {{ user?.joinedAt || 'Fecha de registro' }}</p>
              <template #fallback>
                <div class="h-4 bg-gray-700 rounded animate-pulse w-40"></div>
              </template>
            </ClientOnly>
            
            <!-- Active Artist Indicator -->
            <div v-if="hasActiveArtist" class="mt-4 p-3 bg-orange-900/20 border border-purple-700/30 rounded-lg">
              <div class="flex items-center justify-center">
                <div class="flex items-center space-x-2">
                  <span class="text-white-300 text-sm">Perfil Activo:</span>
                  <span class="text-white font-medium">{{ activeArtist?.stage_name }}</span>
                </div>
                <button
                  @click="clearActiveArtist()"
                  class="ml-4 px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors duration-200"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-gray-800 rounded-xl shadow-xl mb-8">
        <div class="border-b border-gray-700">
          <nav class="flex space-x-8 px-8">
            <button
              @click="activeTab = 'profile'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Configuración Principal
              </div>
            </button>
            <button
              @click="activeTab = 'artist'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'artist'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Página de Artista
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'profile'">
        <!-- Profile Form -->
        <form @submit.prevent="saveProfile" class="space-y-8">
        <!-- Personal Information Section -->
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h2>
          </div>
          <div class="p-8 space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                autocomplete="name"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <!-- Email Field (Read-only) -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <ClientOnly>
                <input
                  id="email"
                  :value="user?.email || ''"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  readonly
                  disabled
                />
                <template #fallback>
                  <div class="w-full h-12 bg-gray-600 border border-gray-600 rounded-lg animate-pulse"></div>
                </template>
              </ClientOnly>
              <p class="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar</p>
            </div>

            <!-- Description Field -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                Descripción del Perfil
                <span class="text-gray-500 font-normal">(Opcional)</span>
              </label>
              <textarea
                id="description"
                v-model="profileForm.description"
                placeholder="Cuéntanos sobre ti, tus intereses, experiencia con eventos, etc..."
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="4"
                maxlength="1000"
              ></textarea>
              <div class="flex justify-between items-center mt-2">
                <p class="text-xs text-gray-500">Comparte información sobre ti para que otros usuarios te conozcan mejor</p>
                <ClientOnly>
                  <span class="text-xs text-gray-400">{{ profileForm.description.length }}/1000</span>
                  <template #fallback>
                    <span class="text-xs text-gray-400">0/1000</span>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguridad
            </h2>
          </div>
          <div class="p-8 space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Contraseña Actual
              </label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu contraseña actual"
              />
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Nueva contraseña"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirma tu nueva contraseña"
              />
              <p v-if="passwordMismatch" class="text-red-400 text-sm mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Las contraseñas no coinciden
              </p>
            </div>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message.text" class="mb-6">
          <div 
            :class="[
              'rounded-lg p-4 border-l-4',
              message.type === 'success' 
                ? 'bg-green-900/20 border-green-500 text-green-300' 
                : 'bg-red-900/20 border-red-500 text-red-300'
            ]"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg v-if="message.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">{{ message.text }}</p>
              </div>
              <div class="ml-auto pl-3">
                <button @click="clearMessage" class="inline-flex text-current opacity-70 hover:opacity-100">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            :disabled="isSaving"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSaving || passwordMismatch"
          >
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
      </div>

      <!-- Artist Tab Content -->
      <div v-if="activeTab === 'artist'">
        <!-- My Artists Section -->
        <div 
          v-if="!isArtistsSectionCollapsed" 
          class="bg-gray-800 rounded-xl shadow-xl mb-8 overflow-hidden transition-all duration-300 ease-in-out"
          :class="{ 'opacity-0 max-h-0': isArtistsSectionCollapsed, 'opacity-100 max-h-[800px]': !isArtistsSectionCollapsed }"
        >
            <div class="px-8 py-6 border-b border-gray-700">
              <h2 class="text-xl font-semibold text-white flex items-center">
                <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Mis Perfiles de Artista
              </h2>
            </div>
            <div class="p-8">
            <!-- Loading State -->
            <div v-if="loadingArtists" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span class="ml-3 text-gray-400">Cargando artistas...</span>
            </div>

            <!-- No Artists State -->
            <div v-else-if="myArtists.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <h3 class="text-lg font-medium text-gray-300 mb-2">No tienes perfiles de artista</h3>
              <p class="text-gray-400 mb-6">
                Crea tu primer perfil de artista para comenzar a buscar eventos, crear eventos con tus amigos
                y mostrar tu música.
              </p>
              <button
                @click="toggleCreateArtistForm"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Perfil de Artista
              </button>
            </div>

            <!-- Artists List -->
            <div v-else class="space-y-4">
              <div v-for="artist in myArtists" :key="artist.id" class="bg-gray-700 rounded-lg p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="relative group">
                      <img
                        :src="$convertImageUrl(artist.profile_picture_url) || 'https://www.gravatar.com/avatar/default?d=identicon&s=64'"
                        :alt="artist.stage_name"
                        class="w-12 h-12 rounded-full"
                        @error="handleAvatarError"
                      />
                      
                      <!-- Hidden file input -->
                      <input
                        :id="`profile-picture-${artist.id}`"
                        type="file"
                        accept="image/*"
                        @change="handleProfilePictureUpload($event, artist.id)"
                        class="hidden"
                      />
                      
                      <!-- Hover overlay with change button -->
                      <label
                        :for="`profile-picture-${artist.id}`"
                        :class="[
                          'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200',
                          uploadingProfilePictures.has(artist.id.toString()) ? 'pointer-events-none' : ''
                        ]"
                      >
                        <span class="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-1">
                          Cambiar Avatar
                        </span>
                      </label>
                      
                      <!-- Loading overlay -->
                      <div 
                        v-if="uploadingProfilePictures.has(artist.id.toString())"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                      >
                        <svg class="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">{{ artist.stage_name }}</h3>
                      <a
                        @click.prevent="openEditModal(artist)"
                        href="#"
                        class="text-xs font-medium underline text-orange-400 hover:text-orange-300 transition-colors duration-200 cursor-pointer"
                      >
                        Editar
                      </a>
                      <p class="text-gray-400 text-sm mt-1">{{ artist.bio }}</p>
                      <div class="flex items-center mt-1">
                        <span 
                          :class="[
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            artist.is_public 
                              ? 'bg-green-900/20 text-green-300' 
                              : 'bg-red-900/20 text-red-300'
                          ]"
                        >
                          {{ artist.is_public ? 'Público' : 'Privado' }}
                        </span>
                        <span v-if="artist.has_active_subscription" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-900/20 text-orange-300">
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <!-- Visibility Toggle -->
                    <div class="text-center">
                      <a
                        @click.prevent="toggleArtistProfileVisibility(artist.id)"
                        href="#"
                        :class="[
                          'text-xs font-medium underline transition-colors duration-200 cursor-pointer',
                          artist.is_public 
                            ? 'text-gray-400 hover:text-gray-300' 
                            : 'text-orange-400 hover:text-orange-300'
                        ]"
                      >
                        {{ artist.is_public ? 'Ocultar' : 'Mostrar' }}
                      </a>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ artist.is_public ? 'Ocultar perfil del público' : 'Hacer perfil público' }}
                      </p>
                    </div>

                    <!-- Active Status -->
                    <div class="text-center">
                      <a
                        v-if="!isActiveArtist(artist.id)"
                        @click.prevent="setArtistAsActive(artist)"
                        href="#"
                        class="text-xs font-medium underline text-purple-400 hover:text-purple-300 transition-colors duration-200 cursor-pointer"
                      >
                        Activar
                      </a>
                      <a
                        v-else
                        @click.prevent="clearActiveArtist()"
                        href="#"
                        class="text-xs font-medium underline text-yellow-400 hover:text-yellow-300 transition-colors duration-200 cursor-pointer"
                      >
                        Activo
                      </a>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ isActiveArtist(artist.id) ? 'Perfil activo para eventos' : 'Activar para crear eventos' }}
                      </p>
                    </div>

                    <!-- View Profile -->
                    <div class="text-center">
                      <NuxtLink
                        :to="`/artists/${artist.id}`"
                        class="text-xs font-medium underline text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Ver
                      </NuxtLink>
                      <p class="text-xs text-gray-400 mt-1">
                        Ver perfil público
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Create New Artist Button -->
              <div class="pt-4">
                <button
                  @click="toggleCreateArtistForm"
                  class="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nuevo Perfil de Artista
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Artist Form -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2000px]"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-[2000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="showCreateArtistForm" class="bg-gray-800 rounded-xl shadow-xl mb-8 overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-700">
              <h2 class="text-xl font-semibold text-white flex items-center">
                <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Perfil de Artista
              </h2>
            </div>
            <form @submit.prevent="createArtistProfile" class="p-8">
            <div class="space-y-6">
              <!-- Stage Name -->
              <div>
                <label for="stage_name" class="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Artístico
                </label>
                <input
                  id="stage_name"
                  v-model="artistForm.stage_name"
                  type="text"
                  autocomplete="username"
                  required
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tu nombre artístico"
                />
              </div>

              <!-- Bio -->
              <div>
                <label for="bio" class="block text-sm font-medium text-gray-300 mb-2">
                  Biografía
                </label>
                <textarea
                  id="bio"
                  v-model="artistForm.bio"
                  rows="4"
                  required
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cuéntanos sobre tu música, estilo y experiencia..."
                ></textarea>
              </div>

              <!-- Genres -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Géneros Musicales
                </label>
                
                <!-- Genre Tags Display -->
                <div class="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 bg-gray-700 border border-gray-600 rounded-lg">
                  <div
                    v-for="(genre, index) in createGenreTags"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 bg-orange-600 text-white text-sm rounded-full"
                  >
                    <span>{{ genre }}</span>
                    <button
                      type="button"
                      @click="removeCreateGenre(index)"
                      class="ml-2 text-orange-200 hover:text-white transition-colors duration-200"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Add Genre Input -->
                  <input
                    ref="createGenreInput"
                    v-model="newCreateGenre"
                    @input="parseCreateGenres"
                    @keydown.enter.prevent="addCurrentCreateGenre"
                    @keydown.comma.prevent="addCurrentCreateGenre"
                    @blur="addCurrentCreateGenre"
                    type="text"
                    class="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Agregar género..."
                    maxlength="100"
                  />
                </div>
                
                <p class="text-xs text-gray-500">Presiona Enter o escribe una coma para agregar géneros</p>
              </div>

              <!-- Social Links -->
              <div>
                <label for="social_links" class="block text-sm font-medium text-gray-300 mb-2">
                  Enlaces Sociales
                </label>
                <input
                  id="social_links"
                  v-model="artistForm.social_links"
                  type="text"
                  autocomplete="url"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: https://spotify.com/artist, https://instagram.com/artist"
                />
                <p class="text-gray-400 text-sm mt-1">Separa los enlaces con comas</p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
              <button
                type="button"
                @click="toggleCreateArtistForm"
                class="px-6 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            <button
              type="submit"
                :disabled="isCreatingArtist"
                class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg v-if="isCreatingArtist" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isCreatingArtist ? 'Creando...' : 'Crear Artista' }}
            </button>
            </div>
          </form>
        </div>
        </Transition>
      </div>
    </div>

    <!-- Artist Edit Modal -->
    <ArtistEditModal
      :is-open="isEditModalOpen"
      :artist="selectedArtist"
      @close="closeEditModal"
      @updated="handleArtistUpdated"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

import { reactive, ref, computed, watch } from 'vue';
import { useUserStore } from '~/store/user';
import { useActiveArtistStore } from '~/store/activeArtist';
import ArtistEditModal from '~/components/ArtistEditModal.vue';
import { useRuntimeConfig } from '#app';

const { user } = useAuth();
const userStore = useUserStore();
const { getMyArtists, createArtist, toggleArtistVisibility } = useArtists();
const { activeArtist, hasActiveArtist, setActiveArtist, clearActiveArtist, isActiveArtist } = useActiveArtistStore();

// Tab management
const activeTab = ref('profile');

// Artist management
const myArtists = ref<any[]>([]);
const loadingArtists = ref(false);
const showCreateArtistForm = ref(false);
const isCreatingArtist = ref(false);
const isArtistsSectionCollapsed = ref(false);
const uploadingProfilePictures = ref<Set<string>>(new Set());

// Edit modal management
const isEditModalOpen = ref(false);
const selectedArtist = ref<any>(null);

// Create artist genre tags management
const createGenreTags = ref<string[]>([]);
const newCreateGenre = ref('');
const createGenreInput = ref<HTMLInputElement | null>(null);

// Form data
const profileForm = reactive({
  name: '',
  description: ''
});

// Artist form data
const artistForm = reactive({
  stage_name: '',
  bio: '',
  genres: '',
  social_links: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// UI state
const isSaving = ref(false);
const message = reactive({
  text: '',
  type: 'success' as 'success' | 'error'
});

// Initialize form with user data
watch(user, (newUser) => {
  if (newUser) {
    profileForm.name = newUser.name || '';
    profileForm.description = newUser.description || '';
  }
}, { immediate: true });

// Computed for password validation
const passwordMismatch = computed(() => {
  return passwordForm.confirmPassword.length > 0 && passwordForm.newPassword !== passwordForm.confirmPassword;
});

// Message handling
const showMessage = (text: string, type: 'success' | 'error') => {
  message.text = text;
  message.type = type;
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }
};

const clearMessage = () => {
  message.text = '';
};

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=96';
  }
};

// Form methods
const resetForm = () => {
  if (user.value) {
    profileForm.name = user.value.name || '';
    profileForm.description = user.value.description || '';
  }
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  clearMessage();
};

const saveProfile = async () => {
  if (passwordMismatch.value) {
    showMessage('Las contraseñas no coinciden', 'error');
    return;
  }

  isSaving.value = true;
  clearMessage();
  
  try {
    const config = useRuntimeConfig();
    
    if (!userStore.token) {
      showMessage('No estás autenticado. Por favor, inicia sesión nuevamente.', 'error');
      await navigateTo('/login');
      return;
    }

    // Prepare update data
    const updateData: any = {
      name: profileForm.name,
      description: profileForm.description
    };

    // Only include password fields if they're provided
    if (passwordForm.currentPassword || passwordForm.newPassword) {
      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        showMessage('Debes proporcionar tanto la contraseña actual como la nueva', 'error');
        return;
      }
      updateData.current_password = passwordForm.currentPassword;
      updateData.new_password = passwordForm.newPassword;
    }
    
    const response = await fetch(`${config.public.apiBaseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Update the user object with the new data
      if (user.value) {
        user.value.name = data.data.name;
        user.value.description = data.data.description;
      }
      
      // Clear password fields on success
      passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
      
      showMessage('Perfil actualizado correctamente', 'success');
    } else {
      const error = await response.json();
      showMessage(error.message || 'No se pudo actualizar el perfil', 'error');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Error al actualizar el perfil. Inténtalo de nuevo.', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Artist methods
const loadMyArtists = async () => {
  loadingArtists.value = true;
  try {
    myArtists.value = await getMyArtists();
  } catch (error) {
    console.error('Error loading artists:', error);
  } finally {
    loadingArtists.value = false;
  }
};

const createArtistProfile = async () => {
  isCreatingArtist.value = true;
  try {
    const artistData = {
      stage_name: artistForm.stage_name,
      bio: artistForm.bio,
      genres: createGenreTags.value,
      social_links: artistForm.social_links ? artistForm.social_links.split(',').map(l => l.trim()).filter(l => l) : []
    };

    await createArtist(artistData);
    showMessage('Perfil de artista creado exitosamente', 'success');
    toggleCreateArtistForm(); // This will animate the form closure
    await loadMyArtists();
  } catch (error) {
    console.error('Error creating artist:', error);
    showMessage('Error al crear el perfil de artista', 'error');
  } finally {
    isCreatingArtist.value = false;
  }
};

const toggleArtistProfileVisibility = async (artistId: string) => {
  try {
    await toggleArtistVisibility(artistId);
    showMessage('Visibilidad del artista actualizada', 'success');
    await loadMyArtists();
  } catch (error) {
    console.error('Error toggling artist visibility:', error);
    showMessage('Error al actualizar la visibilidad del artista', 'error');
  }
};

const setArtistAsActive = (artist: any) => {
  setActiveArtist(artist);
  showMessage(`${artist.stage_name} establecido como perfil activo`, 'success');
};

// Image compression function
const compressImage = (file: File, maxSizeKB: number = 1500): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to fit within maxSizeKB
      let { width, height } = img;
      const maxDimension = 1200; // Max width/height
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to get under maxSizeKB
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const sizeKB = blob.size / 1024;
          
          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            quality -= 0.1;
            tryCompress();
          }
        }, 'image/jpeg', quality);
      };
      
      tryCompress();
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const handleProfilePictureUpload = async (event: Event, artistId: string) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Check if already uploading for this artist
  if (uploadingProfilePictures.value.has(artistId.toString())) {
    return;
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showMessage('Por favor selecciona una imagen válida', 'error');
    return;
  }
  
  // Add to loading state
  uploadingProfilePictures.value.add(artistId.toString());
  
  try {
    // Compress image if it's too large
    let processedFile = file;
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showMessage('Comprimiendo imagen...', 'success');
      processedFile = await compressImage(file);
    }
    const formData = new FormData();
    formData.append('profile_picture', processedFile);
    
    // Prepare form data
    
    const config = useRuntimeConfig();
    const token = localStorage.getItem('zonora_token');
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000';
    const apiUrl = `${baseUrl}/artists/${artistId}/profile-picture`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      let errorMessage = 'Error al subir la imagen';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    // Update the artist in the local array
    const artistIndex = myArtists.value.findIndex(a => a.id === artistId);
    if (artistIndex !== -1) {
      myArtists.value[artistIndex].profile_picture_url = result.data.profile_picture_url;
    }
    
    const compressionMessage = file.size !== processedFile.size 
      ? ` (comprimida de ${(file.size / 1024 / 1024).toFixed(1)}MB a ${(processedFile.size / 1024 / 1024).toFixed(1)}MB)`
      : '';
    showMessage(`Foto de perfil actualizada exitosamente${compressionMessage}`, 'success');
    
    // Clear the file input
    target.value = '';
    
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    showMessage(error.message || 'Error al subir la imagen', 'error');
  } finally {
    // Remove from loading state
    uploadingProfilePictures.value.delete(artistId.toString());
  }
};

const resetArtistForm = () => {
  artistForm.stage_name = '';
  artistForm.bio = '';
  artistForm.genres = '';
  artistForm.social_links = '';
  createGenreTags.value = [];
  newCreateGenre.value = '';
};

const toggleCreateArtistForm = () => {
  if (showCreateArtistForm.value) {
    // Closing form - expand artists section
    isArtistsSectionCollapsed.value = false;
    setTimeout(() => {
      showCreateArtistForm.value = false;
      resetArtistForm();
    }, 150);
  } else {
    // Opening form - collapse artists section
    showCreateArtistForm.value = true;
    setTimeout(() => {
      isArtistsSectionCollapsed.value = true;
    }, 250);
  }
};

// Edit modal functions
const openEditModal = (artist: any) => {
  selectedArtist.value = artist;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedArtist.value = null;
};

const handleArtistUpdated = async (updatedArtist: any) => {
  // Update the artist in the local array
  const artistIndex = myArtists.value.findIndex(a => a.id === updatedArtist.id);
  if (artistIndex !== -1) {
    myArtists.value[artistIndex] = updatedArtist;
  }
  
  // If this is the active artist, update the active artist store
  if (activeArtist.value && activeArtist.value.id === updatedArtist.id) {
    setActiveArtist(updatedArtist);
  }
  
  // Refresh user data to ensure local storage is up to date
  await refreshUserData();
  
  showMessage('Perfil artístico actualizado exitosamente', 'success');
};

// Function to refresh user data from server
const refreshUserData = async () => {
  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.public.apiBaseUrl as string;
    
    if (!userStore.token) return;
    
    const userData = await $fetch('/me', {
      baseURL: apiBaseUrl,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });

    // Update user data with fresh data from server
    const user = (userData as any).user || userData;
    const normalizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url || user.avatar || '',
      description: user.description ?? '',
      joinedAt: user.created_at ?? '',
    };

    userStore.setUser(normalizedUser);
  } catch (error) {
    console.error('Error refreshing user data:', error);
  }
};

// Create artist genre management functions
const parseCreateGenres = () => {
  const text = newCreateGenre.value
  const parts = text.split(',')
  
  // If we have more than one part, it means there's at least one comma
  if (parts.length > 1) {
    // Add all complete parts (before the last comma) as tags
    for (let i = 0; i < parts.length - 1; i++) {
      const genre = parts[i].trim()
      if (genre && !createGenreTags.value.includes(genre) && createGenreTags.value.length < 10) {
        createGenreTags.value.push(genre)
      }
    }
    
    // Keep only the last part (after the last comma) in the input
    newCreateGenre.value = parts[parts.length - 1].trim()
  }
}

const addCurrentCreateGenre = () => {
  const genre = newCreateGenre.value.trim();
  if (genre && !createGenreTags.value.includes(genre) && createGenreTags.value.length < 10) {
    createGenreTags.value.push(genre);
    newCreateGenre.value = '';
  }
};

const removeCreateGenre = (index: number) => {
  createGenreTags.value.splice(index, 1);
};

// Watch for tab changes to load artists when needed
watch(activeTab, (newTab) => {
  if (newTab === 'artist' && myArtists.value.length === 0) {
    loadMyArtists();
  }
});

// Watch for active artist changes to update the UI
watch(activeArtist, (newActiveArtist) => {
  if (newActiveArtist) {
    // Active artist changed
  }
}, { deep: true });

// SEO
useHead({
  title: 'Perfil - Zonora',
  meta: [
    { name: 'description', content: 'Gestiona tu perfil de usuario en Zonora' }
  ]
});
</script>
