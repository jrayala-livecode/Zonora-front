<template>
  <div class="py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Crear Evento</h1>
        <p class="text-gray-400">Completa todos los campos para crear tu evento musical</p>
      </header>

      <!-- Step Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-6">
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
            ]">
              1
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 1 ? 'text-white' : 'text-gray-400'
            ]">
              Tipo de Evento
            </span>
          </div>
          
          <div class="w-12 h-1 bg-gray-700 rounded">
            <div 
              :class="[
                'h-full bg-orange-500 rounded transition-all duration-300',
                currentStep >= 2 ? 'w-full' : 'w-0'
              ]"
            ></div>
          </div>
          
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
            ]">
              2
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 2 ? 'text-white' : 'text-gray-400'
            ]">
              Información
            </span>
          </div>

          <div class="w-12 h-1 bg-gray-700 rounded">
            <div 
              :class="[
                'h-full bg-orange-500 rounded transition-all duration-300',
                currentStep >= 3 ? 'w-full' : 'w-0'
              ]"
            ></div>
          </div>
          
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
            ]">
              3
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 3 ? 'text-white' : 'text-gray-400'
            ]">
              Precios*
            </span>
          </div>

          <div class="w-12 h-1 bg-gray-700 rounded">
            <div 
              :class="[
                'h-full bg-orange-500 rounded transition-all duration-300',
                currentStep >= 4 ? 'w-full' : 'w-0'
              ]"
            ></div>
          </div>
          
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 4 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
            ]">
              4
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= 4 ? 'text-white' : 'text-gray-400'
            ]">
              Términos
            </span>
          </div>
        </div>
        <p class="text-center text-xs text-gray-500 mt-2">* Solo para eventos monetizados</p>
      </div>

      <!-- Step 1: Event Type Selection -->
      <div v-if="currentStep === 1" class="space-y-8">
        <div class="max-w-4xl mx-auto">
          <div class="card">
            <h2 class="text-2xl font-semibold text-white mb-6 text-center">
              ¿Qué tipo de evento quieres crear?
            </h2>
            
            <div class="space-y-4">
              <label class="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group">
                <input 
                  v-model="eventType" 
                  type="radio" 
                  value="free"
                  class="mt-1 w-5 h-5 text-orange-500 bg-gray-600 border-gray-500 focus:ring-orange-500 focus:ring-2"
                />
                <div class="flex-1">
                  <div class="font-medium text-white group-hover:text-orange-400 transition-colors">
                    Evento Gratuito
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    El evento es completamente gratuito. Los usuarios pueden obtener códigos QR y asistir sin costo.
                  </p>
                </div>
              </label>

              <label class="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group">
                <input 
                  v-model="eventType" 
                  type="radio" 
                  value="view_only"
                  class="mt-1 w-5 h-5 text-orange-500 bg-gray-600 border-gray-500 focus:ring-orange-500 focus:ring-2"
                />
                <div class="flex-1">
                  <div class="font-medium text-white group-hover:text-orange-400 transition-colors">
                    Evento Monetizado - Solo Visualización
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    Los usuarios pueden ver el precio pero no comprar boletos directamente en la app.
                  </p>
                </div>
              </label>

              <label class="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group">
                <input 
                  v-model="eventType" 
                  type="radio" 
                  value="pay_at_door"
                  class="mt-1 w-5 h-5 text-orange-500 bg-gray-600 border-gray-500 focus:ring-orange-500 focus:ring-2"
                />
                <div class="flex-1">
                  <div class="font-medium text-white group-hover:text-orange-400 transition-colors">
                    Pago en Puerta / Contactar Organizador
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    Los usuarios pueden contactarte para información de pago. Se redirigirán a tu Instagram.
                  </p>
                </div>
              </label>

              <label class="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group">
                <input 
                  v-model="eventType" 
                  type="radio" 
                  value="in_app"
                  class="mt-1 w-5 h-5 text-orange-500 bg-gray-600 border-gray-500 focus:ring-orange-500 focus:ring-2"
                />
                <div class="flex-1">
                  <div class="font-medium text-white group-hover:text-orange-400 transition-colors">
                    Compra Directa en la App
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    Los usuarios pueden comprar boletos directamente con transferencia bancaria. Requiere verificación.
                  </p>
                </div>
              </label>

              <label class="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer group">
                <input 
                  v-model="eventType" 
                  type="radio" 
                  value="not_mine"
                  class="mt-1 w-5 h-5 text-orange-500 bg-gray-600 border-gray-500 focus:ring-orange-500 focus:ring-2"
                />
                <div class="flex-1">
                  <div class="font-medium text-white group-hover:text-orange-400 transition-colors">
                    Este Evento No Es Mío
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    Estoy compartiendo un evento que encontré en la ciudad. No soy el organizador.
                  </p>
                </div>
              </label>
            </div>

            <!-- Step 1 Continue Button -->
            <div class="flex justify-center pt-8">
              <button 
                @click="nextStep"
                type="button"
                class="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!eventType"
                aria-label="Continuar al siguiente paso"
              >
                <span class="flex items-center">
                  Continuar
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
            
            <p v-if="!eventType" class="text-center text-sm text-orange-400 mt-4">
              Selecciona un tipo de evento para continuar
            </p>
          </div>
        </div>
      </div>

      <!-- Step 2: Event Information -->
      <div v-if="currentStep === 2" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Información Básica -->
          <section class="card" aria-labelledby="basic-info-heading">
            <h2 id="basic-info-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">1</span>
              </div>
              Información Básica
            </h2>
            
            <div class="space-y-4">
              <div>
                <label for="event-name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del Evento *</label>
                <input 
                  id="event-name"
                  v-model="form.name" 
                  type="text" 
                  placeholder="Ej: Festival de Rock 2024" 
                  class="input-field w-full" 
                  required 
                  aria-describedby="event-name-help"
                />
                <div id="event-name-help" class="sr-only">Ingresa el nombre que aparecerá como título del evento</div>
              </div>

              <div>
                <label for="event-description" class="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
                <textarea 
                  id="event-description"
                  v-model="form.description" 
                  rows="4" 
                  placeholder="Describe tu evento musical..." 
                  class="input-field w-full resize-none" 
                  required
                  aria-describedby="event-description-help"
                ></textarea>
                <div id="event-description-help" class="sr-only">Proporciona una descripción detallada del evento</div>
              </div>

              <div>
                <label for="event-hashtags" class="block text-sm font-medium text-gray-300 mb-2">Hashtags</label>
                <input 
                  id="event-hashtags"
                  v-model="form.hashtags" 
                  type="text" 
                  placeholder="Ej: #rock #festival #musica" 
                  class="input-field w-full"
                  aria-describedby="hashtags-help"
                />
                <p id="hashtags-help" class="text-xs text-gray-500 mt-1">Separa los hashtags con espacios</p>
              </div>

              <div>
                <label for="event-links" class="block text-sm font-medium text-gray-300 mb-2">Enlaces de Información</label>
                <input 
                  id="event-links"
                  v-model="form.information_links" 
                  type="url" 
                  placeholder="https://ejemplo.com" 
                  class="input-field w-full"
                  aria-describedby="links-help"
                />
                <div id="links-help" class="sr-only">Agrega enlaces adicionales con información del evento</div>
              </div>

              <!-- Event Source Field (only for "not_mine" events) -->
              <div v-if="eventType === 'not_mine'">
                <label for="event-source" class="block text-sm font-medium text-gray-300 mb-2">¿Cómo encontraste este evento? *</label>
                <select 
                  id="event-source"
                  v-model="form.event_source" 
                  class="input-field w-full"
                  required
                  aria-describedby="event-source-help"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="redes_sociales">Redes Sociales</option>
                  <option value="pagina_web">Página Web</option>
                  <option value="cartel">Cartel/Publicidad</option>
                  <option value="amigo">Amigo/Familiar</option>
                  <option value="otro">Otro</option>
                </select>
                <div id="event-source-help" class="sr-only">Indica cómo descubriste este evento</div>
              </div>
            </div>
          </section>

          <!-- Fecha y Hora -->
          <section class="card" aria-labelledby="datetime-heading">
            <h2 id="datetime-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">2</span>
              </div>
              Fecha y Hora
            </h2>
            
            <div class="space-y-4">
              <div>
                <label for="event-date" class="block text-sm font-medium text-gray-300 mb-2">Fecha del Evento *</label>
                <input 
                  id="event-date"
                  v-model="form.date" 
                  type="date" 
                  class="input-field w-full" 
                  required 
                  :min="new Date().toISOString().split('T')[0]"
                  aria-describedby="event-date-help"
                />
                <div id="event-date-help" class="sr-only">Selecciona la fecha en que se realizará el evento</div>
              </div>

              <div>
                <label for="event-time" class="block text-sm font-medium text-gray-300 mb-2">Hora de Inicio *</label>
                <input 
                  id="event-time"
                  v-model="form.time" 
                  type="time" 
                  class="input-field w-full" 
                  required
                  aria-describedby="event-time-help"
                />
                <div id="event-time-help" class="sr-only">Especifica la hora de inicio del evento</div>
              </div>

              <div v-if="eventType !== 'not_mine'">
                <label for="publish-date" class="block text-sm font-medium text-gray-300 mb-2">Fecha de Publicación</label>
                <input 
                  id="publish-date"
                  v-model="form.publish_date" 
                  type="datetime-local" 
                  class="input-field w-full"
                  aria-describedby="publish-date-help"
                />
                <p id="publish-date-help" class="text-xs text-gray-500 mt-1">Deja vacío para publicar inmediatamente</p>
              </div>

            </div>
          </section>

          <!-- Ubicación -->
          <section class="card lg:col-span-2" aria-labelledby="location-heading">
            <h2 id="location-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">3</span>
              </div>
              Ubicación
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label for="venue-name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del Lugar *</label>
                  <input 
                    id="venue-name"
                    v-model="form.location" 
                    type="text" 
                    placeholder="Ej: Teatro Nacional" 
                    class="input-field w-full" 
                    required
                    aria-describedby="venue-name-help"
                  />
                  <div id="venue-name-help" class="sr-only">Ingresa el nombre del lugar donde se realizará el evento</div>
                </div>

                <div>
                  <label for="venue-address" class="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
                  <input 
                    id="venue-address"
                    v-model="form.address" 
                    type="text" 
                    placeholder="Dirección completa" 
                    class="input-field w-full" 
                    required
                    aria-describedby="venue-address-help"
                  />
                  <div id="venue-address-help" class="sr-only">Proporciona la dirección completa del lugar</div>
                </div>

                <fieldset class="space-y-3">
                  <legend class="sr-only">Opciones de ubicación</legend>
                  <label class="flex items-center space-x-3">
                    <input 
                      v-model="form.hidden_location" 
                      type="checkbox" 
                      class="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                      aria-describedby="hidden-location-help"
                    />
                    <span class="text-gray-300">Ocultar ubicación hasta revelarla</span>
                  </label>
                  <div id="hidden-location-help" class="sr-only">Marca esta opción si quieres mantener la ubicación oculta hasta una fecha específica</div>

                  <div v-if="form.hidden_location" class="ml-7">
                    <label for="reveal-date" class="block text-sm font-medium text-gray-300 mb-2">Revelar ubicación el:</label>
                    <input 
                      id="reveal-date"
                      v-model="form.reveal_location_at" 
                      type="datetime-local" 
                      class="input-field w-full"
                      aria-describedby="reveal-date-help"
                    />
                    <div id="reveal-date-help" class="sr-only">Selecciona cuándo se revelará la ubicación del evento</div>
                  </div>
                </fieldset>
              </div>
              <ClientOnly>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar en el Mapa</label>
                  <MapSelector v-model="selectedMapLocation" aria-label="Selector de ubicación en mapa" />
                </div>
              </ClientOnly>
            </div>
          </section>

          <!-- Imagen del Evento -->
          <section class="card" aria-labelledby="image-heading">
            <h2 id="image-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">4</span>
              </div>
              Imagen del Evento
            </h2>
            
            <div class="space-y-4">
              <div v-if="imagePreview" class="relative">
                <img :src="imagePreview" alt="Vista previa de la imagen del evento" class="w-full h-48 object-cover rounded-lg" />
                <button 
                  @click="removeImage" 
                  type="button" 
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  aria-label="Eliminar imagen seleccionada"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div v-else class="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-600">
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <p class="text-gray-400 mb-4">Sube una imagen o selecciona una predeterminada</p>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="onImageSelected" 
                  class="mx-auto mb-4"
                  aria-label="Seleccionar archivo de imagen"
                />

                <div class="grid grid-cols-3 gap-2 mb-4">
                  
                </div>
              </div>
            </div>
          </section>

          <!-- Artistas -->
          <section class="card" aria-labelledby="artists-heading">
            <h2 id="artists-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">5</span>
              </div>
              Artistas del Evento
            </h2>
            
            <div class="space-y-4">
              <p class="text-sm text-gray-400">
                Asigna tus propios perfiles de artista a este evento. Solo puedes asignar artistas que te pertenecen.
              </p>
              
              <ArtistSelector v-model="form.artists" />
              
              <div v-if="form.artists.length === 0" class="p-4 bg-gray-700 rounded-lg text-center">
                <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p class="text-gray-400">No hay artistas asignados</p>
                <p class="text-sm text-gray-500 mt-1">Agrega artistas para mostrar quién participará en el evento</p>
              </div>
            </div>
          </section>

        </div>

        <!-- Step 2 Continue Button -->
        <div class="flex justify-center pt-8">
          <button 
            @click="nextStep"
            type="button"
            class="btn-primary text-lg px-12 py-4"
            aria-label="Continuar al siguiente paso"
          >
            <span class="flex items-center">
              Continuar
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Step 3: Pricing (Conditional) -->
      <div v-if="currentStep === 3" class="space-y-8">
        <form @submit.prevent="nextStep" novalidate>
          <div class="max-w-4xl mx-auto">
            <!-- Back Button -->
            <div class="mb-6">
              <button 
                @click="previousStep"
                type="button"
                class="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Volver al paso anterior"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver a la información del evento
              </button>
            </div>

            <!-- Pricing Section -->
            <div class="card">
              <h2 class="text-2xl font-semibold text-white mb-6 text-center">
                Configurar Precios
              </h2>
              
              <div class="space-y-6">
                <!-- Currency Selection -->
                <div>
                  <label for="currency" class="block text-sm font-medium text-gray-300 mb-2">
                    Moneda ({{ currencySymbol }} {{ form.currency }})
                  </label>
                  <select 
                    id="currency"
                    v-model="form.currency" 
                    class="input-field w-full"
                    aria-describedby="currency-help"
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="CLP">CLP - Peso Chileno</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="PEN">PEN - Sol Peruano</option>
                  </select>
                  <p id="currency-help" class="text-xs text-gray-500 mt-1">Selecciona la moneda para los precios</p>
                </div>

                <!-- Single Price for View Only -->
                <div v-if="eventType === 'view_only'">
                  <h3 class="text-lg font-medium text-white mb-4">Precio de Visualización</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="single-price-name" class="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Precio
                      </label>
                      <input 
                        id="single-price-name"
                        v-model="singlePriceName"
                        type="text" 
                        placeholder="Ej: General, VIP"
                        class="input-field w-full"
                        required
                        @blur="handleSinglePriceNameBlur"
                      />
                    </div>
                    <div>
                      <label for="single-price-amount" class="block text-sm font-medium text-gray-300 mb-2">
                        Precio ({{ currencySymbol }})
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ currencySymbol }}</span>
                        <input 
                          id="single-price-amount"
                          v-model="singlePriceAmount"
                          type="number" 
                          min="0" 
                          step="0.01"
                          :placeholder="currencyPlaceholder" 
                          class="input-field w-full pl-8"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Multiple Price Tiers for In-App Purchase -->
                <div v-else-if="eventType === 'in_app'">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-white">Niveles de Precio</h3>
                    <button 
                      type="button"
                      @click="addPriceTier"
                      class="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <Plus class="w-4 h-4 mr-1" />
                      Agregar Nivel
                    </button>
                  </div>

                  <div v-if="form.priceTiers.length === 0" class="text-center py-8 text-gray-400">
                    <div class="text-lg mb-2">No hay niveles de precio</div>
                    <div class="text-sm">Haz clic en "Agregar Nivel" para crear tu primer nivel de precio</div>
                  </div>

                  <div v-else class="space-y-4">
                    <div 
                      v-for="(tier, index) in form.priceTiers" 
                      :key="tier.id"
                      class="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div class="flex items-start justify-between mb-4">
                        <h4 class="text-white font-medium">Nivel {{ index + 1 }}</h4>
                        <button 
                          type="button"
                          @click="removePriceTier(index)"
                          class="text-red-400 hover:text-red-300 transition-colors duration-200"
                          :aria-label="`Eliminar nivel ${index + 1}`"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label :for="`tier-name-${index}`" class="block text-sm font-medium text-gray-300 mb-2">
                            Nombre del Nivel
                          </label>
                          <input 
                            :id="`tier-name-${index}`"
                            v-model="tier.name"
                            type="text" 
                            placeholder="Ej: General, VIP, Estudiantil"
                            class="input-field w-full"
                            required
                            @blur="handlePriceTierNameBlur(index)"
                          />
                        </div>

                        <div>
                          <label :for="`tier-price-${index}`" class="block text-sm font-medium text-gray-300 mb-2">
                            Precio ({{ currencySymbol }})
                          </label>
                          <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ currencySymbol }}</span>
                            <input 
                              :id="`tier-price-${index}`"
                              v-model="tier.price"
                              type="number" 
                              min="0" 
                              step="0.01"
                              :placeholder="currencyPlaceholder" 
                              class="input-field w-full pl-8"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div class="mt-4">
                        <label :for="`tier-description-${index}`" class="block text-sm font-medium text-gray-300 mb-2">
                          Descripción (Opcional)
                        </label>
                        <textarea 
                          :id="`tier-description-${index}`"
                          v-model="tier.description"
                          rows="2" 
                          placeholder="Ej: Incluye una bebida, Acceso a área VIP"
                          class="input-field w-full resize-none"
                        ></textarea>
                      </div>

                      <div class="mt-4 flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-300">Precio Activo</span>
                          <p class="text-xs text-gray-500">Este será el precio mostrado como principal</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input 
                            v-model="tier.active"
                            type="checkbox" 
                            class="sr-only peer"
                            @change="setActiveTier(index)"
                          />
                          <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3 Continue Button -->
              <div class="flex justify-center pt-8">
                <button 
                  type="submit"
                  class="btn-primary text-lg px-12 py-4"
                  aria-label="Continuar a términos y condiciones"
                >
                  <span class="flex items-center">
                    Continuar a Términos
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Step 4: Terms and Conditions -->
      <div v-if="currentStep === 4" class="space-y-8">
        <form @submit.prevent="createEventHandler" novalidate aria-label="Formulario de creación de evento">
          <div class="max-w-4xl mx-auto">
            <!-- Back Button -->
            <div class="mb-6">
              <button 
                @click="previousStep"
                type="button"
                class="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Volver al paso anterior"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver a la información del evento
              </button>
            </div>

            <!-- Descargo de Responsabilidad -->
            <div class="p-6 bg-gray-700 border border-gray-600 rounded-lg">
              <h2 class="text-2xl font-semibold text-orange-400 mb-6 flex items-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Descargo de Responsabilidad
              </h2>
              
              <!-- Special disclaimer for shared events -->
              <div v-if="eventType === 'not_mine'" class="mb-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                <h3 class="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Evento Compartido
                </h3>
                <p class="text-yellow-200 text-sm">
                  <strong>Importante:</strong> Estás compartiendo un evento que no es tuyo. Declaras que no eres el organizador 
                  y que toda la información proporcionada es verídica según tu conocimiento. La responsabilidad del evento 
                  recae completamente en los organizadores originales.
                </p>
              </div>
              
              <div class="space-y-4 text-gray-300">
                <p class="text-lg">Al continuar, confirmas que entiendes y aceptas que:</p>
                
                <ul class="list-disc list-inside space-y-3 pl-4 text-base">
                  <li>Esta aplicación actúa únicamente como plataforma de difusión de eventos creados por usuarios.</li>
                  <li>Los organizadores son plenamente responsables de la veracidad, seguridad y cumplimiento legal de los eventos que publican.</li>
                  <li>Los asistentes participan bajo su propio riesgo. La app y sus administradores no asumen responsabilidad por accidentes, daños, pérdidas o cualquier otro perjuicio ocurrido antes, durante o después del evento.</li>
                  <li>El uso de esta plataforma implica la aceptación total de estos términos y de la Política de Privacidad disponible en el sitio o aplicación.</li>
                  <li>En caso de incumplimiento o fraude, el usuario podrá ser suspendido o eliminado permanentemente de la plataforma.</li>
                </ul>
              </div>

              <div class="mt-8 pt-6 border-t border-gray-600">
                <label class="flex items-start space-x-4 cursor-pointer group">
                  <input 
                    v-model="termsAccepted" 
                    type="checkbox" 
                    class="mt-1 w-6 h-6 text-orange-500 bg-gray-600 border-gray-500 rounded focus:ring-orange-500 focus:ring-2"
                    required
                    aria-describedby="terms-help"
                  />
                  <span class="text-gray-200 group-hover:text-white transition-colors text-lg">
                    <strong>Acepto los términos y condiciones</strong> y el descargo de responsabilidad. Declaro que soy el organizador responsable de este evento y que toda la información proporcionada es verídica.
                  </span>
                </label>
                <div id="terms-help" class="sr-only">Debes aceptar los términos y condiciones para poder crear el evento</div>
                
                <p v-if="!termsAccepted" class="mt-3 text-orange-400">
                  * Debes aceptar los términos para poder publicar el evento
                </p>
              </div>
            </div>

            <!-- Step 2 Create Event Button -->
            <div class="flex flex-col items-center pt-8 space-y-3">
              <button 
                type="submit" 
                class="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed" 
                :disabled="isSubmitting || !termsAccepted"
                :aria-label="isSubmitting ? 'Creando evento, por favor espera' : !termsAccepted ? 'Debes aceptar los términos y condiciones' : 'Crear evento musical'"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
                  Creando evento...
                </span>
                <span v-else class="flex items-center">
                  <Calendar class="w-5 h-5 mr-2" aria-hidden="true" />
                  Crear Evento
                </span>
              </button>
              <p v-if="!termsAccepted && !isSubmitting" class="text-sm text-orange-400 text-center">
                Debes aceptar los términos y condiciones para poder publicar el evento
              </p>
            </div>
          </div>
        </form>
      </div>

      <!-- Verification Modal -->
      <VerificationModal 
        :is-open="showVerificationModal"
        @close="showVerificationModal = false"
        @verified="handleVerificationComplete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: 'auth'
});

import MapSelector from '~/components/MapSelector.vue';
import ArtistSelector from '~/components/ArtistSelector.vue';
import { Upload, X, Calendar, Plus, Trash2 } from 'lucide-vue-next';
import { reactive, ref, watch } from 'vue';
import { useEvents } from '~/composables/useEvents';
import { useModal } from '~/composables/useModal';
import { useVerification } from '~/composables/useVerification';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';
import type { Artist } from '~/composables/types/types';
import VerificationModal from '~/components/VerificationModal.vue';

const router = useRouter();
const { isAuthenticated } = useAuth();
const { createEvent } = useEvents();
const { checkVerificationStatus, isVerificationApproved } = useVerification();
const token = useUserStore().token;
const config = useRuntimeConfig();

/*
if (!isAuthenticated.value) {
  router.push('/events');
}
  */

// Price tier interface
interface PriceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

const form = reactive({
  name: '',
  description: '',
  date: '',
  time: '',
  location: '',
  address: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  hidden_location: false,
  reveal_location_at: '',
  image: '',
  hashtags: '',
  information_links: '',
  publish_date: '',
  category: 'Música',
  // Artists field
  artists: [] as Artist[],
  // Pricing fields
  show_prices: false,
  priceTiers: [] as PriceTier[],
  currency: 'USD',
  // New monetization fields
  event_source: '',
});

const selectedMapLocation = ref<{ lat: number; lng: number } | null>(null)

watch(selectedMapLocation, (location) => {
  if (location) {
    form.latitude = location.lat
    form.longitude = location.lng
  }
})

// Currency formatting
const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'CLP': '$',
    'MXN': '$',
    'ARS': '$',
    'COP': '$',
    'PEN': 'S/'
  }
  return symbols[form.currency] || '$'
})

const currencyName = computed(() => {
  const names: Record<string, string> = {
    'USD': 'Dólar Estadounidense',
    'EUR': 'Euro',
    'CLP': 'Peso Chileno',
    'MXN': 'Peso Mexicano',
    'ARS': 'Peso Argentino',
    'COP': 'Peso Colombiano',
    'PEN': 'Sol Peruano'
  }
  return names[form.currency] || 'Dólar Estadounidense'
})

const currencyPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    'USD': '0.00',
    'EUR': '0,00',
    'CLP': '0',
    'MXN': '0.00',
    'ARS': '0.00',
    'COP': '0.00',
    'PEN': '0.00'
  }
  return placeholders[form.currency] || '0.00'
})

const isSubmitting = ref(false);
const selectedFile = ref<File | null>(null);
const imagePreview = ref(form.image || '');
const termsAccepted = ref(false);
const currentStep = ref(1);
const eventType = ref('');
const singlePriceName = ref('');
const singlePriceAmount = ref(0);
const showVerificationModal = ref(false);

// Helper function to capitalize words for preview
const capitalizeWordsPreview = (str: string): string => {
  return str.trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Blur handlers for price name capitalization preview
const handleSinglePriceNameBlur = () => {
  if (singlePriceName.value) {
    singlePriceName.value = capitalizeWordsPreview(singlePriceName.value);
  }
};

const handlePriceTierNameBlur = (index: number) => {
  if (form.priceTiers[index].name) {
    form.priceTiers[index].name = capitalizeWordsPreview(form.priceTiers[index].name);
  }
};

// Price tier management
let priceTierIdCounter = 0;

const addPriceTier = () => {
  const newTier: PriceTier = {
    id: `tier_${++priceTierIdCounter}`,
    name: '',
    price: 0,
    description: '',
    active: form.priceTiers.length === 0 // First tier is active by default
  };
  form.priceTiers.push(newTier);
};

const removePriceTier = (index: number) => {
  form.priceTiers.splice(index, 1);
  // If we removed the active tier, make the first remaining tier active
  if (form.priceTiers.length > 0 && !form.priceTiers.some(tier => tier.active)) {
    form.priceTiers[0].active = true;
  }
};

const setActiveTier = (index: number) => {
  // Deactivate all other tiers
  form.priceTiers.forEach((tier, i) => {
    tier.active = i === index;
  });
};

// Step navigation
const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!eventType.value) {
      useModal().showError('Error de validación', 'Debes seleccionar un tipo de evento.');
      return;
    }
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (validateStep2()) {
      // Skip pricing step for certain event types
      if (shouldSkipPricingStep()) {
        currentStep.value = 4; // Go directly to terms
      } else {
        currentStep.value = 3; // Go to pricing
      }
    }
  } else if (currentStep.value === 3) {
    const isValid = await validateStep3();
    if (isValid) {
      currentStep.value = 4;
    }
  }
};

const previousStep = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1;
  } else if (currentStep.value === 3) {
    currentStep.value = 2;
  } else if (currentStep.value === 4) {
    // Go back to pricing if it exists, otherwise to step 2
    if (shouldSkipPricingStep()) {
      currentStep.value = 2;
    } else {
      currentStep.value = 3;
    }
  }
};

const shouldSkipPricingStep = () => {
  return ['free', 'pay_at_door', 'not_mine'].includes(eventType.value);
};

const validateStep2 = () => {
  // Validate required fields for step 2
  if (!form.name.trim()) {
    useModal().showError('Error de validación', 'El nombre del evento es requerido.');
    return false;
  }
  if (!form.description.trim()) {
    useModal().showError('Error de validación', 'La descripción del evento es requerida.');
    return false;
  }
  if (!form.date) {
    useModal().showError('Error de validación', 'La fecha del evento es requerida.');
    return false;
  }
  if (!form.time) {
    useModal().showError('Error de validación', 'La hora del evento es requerida.');
    return false;
  }
  if (!form.location.trim()) {
    useModal().showError('Error de validación', 'El nombre del lugar es requerido.');
    return false;
  }
  if (!form.address.trim()) {
    useModal().showError('Error de validación', 'La dirección es requerida.');
    return false;
  }
  // Validate event source for "not_mine" events
  if (eventType.value === 'not_mine' && !form.event_source) {
    useModal().showError('Error de validación', 'Debes indicar cómo encontraste este evento.');
    return false;
  }
  return true;
};

const validateStep3 = async () => {
  // Validate pricing step
  if (eventType.value === 'view_only') {
    if (!singlePriceName.value.trim() || singlePriceAmount.value <= 0) {
      useModal().showError('Error de validación', 'Debes completar el precio de visualización.');
      return false;
    }
  } else if (eventType.value === 'in_app') {
    if (form.priceTiers.length === 0) {
      useModal().showError('Error de validación', 'Debes agregar al menos un precio.');
      return false;
    }
    // Validate that all price tiers have required fields
    for (const tier of form.priceTiers) {
      if (!tier.name.trim()) {
        useModal().showError('Error de validación', 'Todos los precios deben tener un nombre.');
        return false;
      }
      if (tier.price < 0) {
        useModal().showError('Error de validación', 'Los precios no pueden ser negativos.');
        return false;
      }
    }
    
    // Check verification status for in-app purchases
    try {
      const verificationStatus = await checkVerificationStatus();
      if (!isVerificationApproved()) {
        useModal().showError(
          'Verificación Requerida',
          'Para crear eventos con compra directa en la app, necesitas verificar tu identidad primero.'
        );
        showVerificationModal.value = true;
        return false;
      }
    } catch (error) {
      useModal().showError('Error', 'No se pudo verificar el estado de verificación.');
      return false;
    }
  }
  return true;
};


const onImageSelected = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    imagePreview.value = URL.createObjectURL(selectedFile.value);
    form.image = '';
  }
};

const selectDefaultImage = (img: string) => {
  form.image = img;
  imagePreview.value = img;
  selectedFile.value = null;
};

const removeImage = () => {
  selectedFile.value = null;
  form.image = '';
  imagePreview.value = '';
};

const handleVerificationComplete = () => {
  showVerificationModal.value = false;
  // Continue to terms step
  currentStep.value = 4;
};

const createEventHandler = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('title', form.name);
    formData.append('description', form.description);
    formData.append('date', form.date);
    formData.append('time', form.time);
    formData.append('location', form.location);
    formData.append('address', form.address);
    formData.append('latitude', form.latitude?.toString() || '');
    formData.append('longitude', form.longitude?.toString() || '');
    formData.append('hidden_location', form.hidden_location ? '1' : '0');
    formData.append('reveal_location_at', form.reveal_location_at || '');

    // Add new monetization fields
    formData.append('monetization_type', eventType.value);
    if (form.event_source) {
      formData.append('event_source', form.event_source);
    }

    form.hashtags
      .split(' ')
      .filter(tag => tag.trim() !== '')
      .forEach(tag => formData.append('hashtags[]', tag));

    form.information_links
      .split(',')
      .map(link => link.trim())
      .filter(link => link !== '')
      .forEach(link => formData.append('information_links[]', link));

    // status_id and commune_id are handled internally by the system
    formData.append('category', form.category);

    // Artists data
    form.artists.forEach(artist => {
      formData.append('artists[]', artist.id.toString());
    });

    // Helper function to capitalize first letter of each word
    const capitalizeWords = (str: string): string => {
      return str.trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Pricing data based on event type
    if (eventType.value === 'view_only') {
      // Single price for view only
      const singlePrice = {
        name: capitalizeWords(singlePriceName.value),
        price: parseFloat(singlePriceAmount.value.toString()),
        currency: form.currency,
        active: true,
        info: 'Precio solo para visualización'
      };
      formData.append('prices', JSON.stringify([singlePrice]));
    } else if (eventType.value === 'in_app') {
      // Multiple price tiers for in-app purchase
      const prices = form.priceTiers.map(tier => ({
        name: capitalizeWords(tier.name),
        price: parseFloat(tier.price.toString()),
        currency: form.currency,
        active: tier.active,
        info: tier.description || undefined
      }));
      formData.append('prices', JSON.stringify(prices));
    } else if (eventType.value === 'free') {
      // Free event
      const freePrice = {
        name: 'Gratis',
        price: 0,
        currency: form.currency,
        active: true,
        info: 'Evento gratuito'
      };
      formData.append('prices', JSON.stringify([freePrice]));
    }
    // For 'pay_at_door' and 'not_mine', no pricing data needed

    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    } else if (form.image) {
      formData.append('image_url', form.image);
    }

    const createdEvent = await createEvent(formData);

    useModal().showSuccess(
      '¡Evento creado exitosamente!',
      `${form.name} ha sido creado. Ahora puedes invitar artistas a participar.`
    );

    // Redirect to invitation page
    router.push(`/events/${createdEvent.id}/invite`);
  } catch (error) {
    console.error(error);
    useModal().showError('Error al crear evento', 'Por favor verifica los datos e inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};

// SEO and structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Crear Evento Musical - Zonora",
  "description": "Crea y publica tu evento musical en Zonora. Completa el formulario para compartir tu evento con la comunidad.",
  "url": `${config.public.baseUrl}/create`,
  "mainEntity": {
    "@type": "WebApplication",
    "name": "Formulario de Creación de Eventos",
    "applicationCategory": "EventManagement",
    "operatingSystem": "Web Browser"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": config.public.baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Crear Evento",
        "item": `${config.public.baseUrl}/create`
      }
    ]
  }
};

useHead({
  title: 'Crear Evento Musical - Zonora | Publica tu Evento',
  meta: [
    {
      name: 'description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos, festivales y eventos culturales. Conecta con tu audiencia.'
    },
    {
      name: 'keywords',
      content: 'crear evento, publicar evento, organizador eventos, conciertos, festivales, música, Zonora'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Crear Evento Musical - Zonora'
    },
    {
      property: 'og:description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos, festivales y eventos culturales.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${config.public.baseUrl}/create`
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: 'Crear Evento Musical - Zonora'
    },
    {
      name: 'twitter:description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos y festivales.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${config.public.baseUrl}/create`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData)
    }
  ]
});
</script>
