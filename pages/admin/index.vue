<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">
          Admin <span class="text-orange-500">Dashboard</span>
        </h1>
        <p class="text-gray-300">Manage and moderate platform content</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Total Events</p>
              <p class="text-3xl font-bold text-white mt-2">-</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-yellow-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-yellow-400">Pending Events</p>
              <p class="text-3xl font-bold text-yellow-300 mt-2">-</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-orange-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-orange-400">Pending Verifications</p>
              <p class="text-3xl font-bold text-orange-300 mt-2">-</p>
            </div>
            <div class="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-400">Total Users</p>
              <p class="text-3xl font-bold text-green-300 mt-2">-</p>
            </div>
            <div class="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Event Moderation -->
        <NuxtLink
          to="/admin/events"
          class="group bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-orange-500 transition-all duration-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Event Moderation</h3>
            <p class="text-gray-400 text-sm mb-4">Review and approve events before they go live on the platform</p>
            <div class="flex items-center text-sm text-blue-400">
              <span>Manage Events</span>
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Organizer Verifications -->
        <NuxtLink
          to="/admin/verifications"
          class="group bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-orange-500 transition-all duration-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Organizer Verifications</h3>
            <p class="text-gray-400 text-sm mb-4">Review identity documents and approve organizers for in-app purchases</p>
            <div class="flex items-center text-sm text-orange-400">
              <span>Review Verifications</span>
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- User Management - Coming Soon -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-50 cursor-not-allowed overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">Coming Soon</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">User Management</h3>
            <p class="text-gray-400 text-sm mb-4">Manage user accounts, roles, and permissions</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>Not Available</span>
            </div>
          </div>
        </div>

        <!-- Venue Management - Coming Soon -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-50 cursor-not-allowed overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">Coming Soon</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Venue Management</h3>
            <p class="text-gray-400 text-sm mb-4">Manage venues, locations, and venue administrators</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>Not Available</span>
            </div>
          </div>
        </div>

        <!-- Artist Management - Coming Soon -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-50 cursor-not-allowed overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-pink-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">Coming Soon</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Artist Management</h3>
            <p class="text-gray-400 text-sm mb-4">Manage artist profiles, genres, and proficiencies</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>Not Available</span>
            </div>
          </div>
        </div>

        <!-- Reports & Analytics - Coming Soon -->
        <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-50 cursor-not-allowed overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">Coming Soon</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Reports & Analytics</h3>
            <p class="text-gray-400 text-sm mb-4">View platform statistics, user activity, and financial reports</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>Not Available</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            to="/admin/events"
            class="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <svg class="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="text-white">Review Pending Events</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/verifications"
            class="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
          >
            <svg class="w-5 h-5 text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white">Review Verifications</span>
          </NuxtLink>

          <button
            disabled
            class="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 opacity-50 cursor-not-allowed"
          >
            <svg class="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-gray-500">Manage Users (Soon)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// You can add composables here to fetch real stats later
// const { stats } = useAdminStats()
</script>



