<template>
  <div class="min-h-screen bg-gray-900">
    <TheHeader />
    <main>
      <slot />
    </main>
    
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
  </div>
</template>

<script setup lang="ts">
const { modalState, hideModal, triggerConfirm } = useModal();
</script>