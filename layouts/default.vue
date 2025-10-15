<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter v-if="!isChatRoute" />
    
    <!-- Global Modal -->
    <AppModal
      :show="modalState.show"
      :title="modalState.title"
      :message="modalState.message"
      :type="modalState.type"
      :show-cancel="modalState.showCancel"
      :confirm-text="modalState.confirmText"
      :cancel-text="modalState.cancelText"
      @close="hideModal"
      @confirm="triggerConfirm"
    />

    <!-- Global Loading -->
    <GlobalLoading
      :is-loading="isLoading"
      :loading-message="loadingMessage"
    />
  </div>
</template>

<script setup lang="ts">
const { modalState, hideModal, triggerConfirm } = useModal();
const { isLoading, loadingMessage } = useLoading();

// Check if current route is a chat or event-proposals route
const route = useRoute()
const isChatRoute = computed(() => {
  return route.path.startsWith('/chat') || route.path.startsWith('/event-proposals/')
})
</script>