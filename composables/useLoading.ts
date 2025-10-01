import { ref, readonly } from 'vue'

const isLoading = ref(false)
const loadingMessage = ref('Cargando...')

export const useLoading = () => {
  const showLoading = (message: string = 'Cargando...') => {
    isLoading.value = true
    loadingMessage.value = message
  }

  const hideLoading = () => {
    isLoading.value = false
  }

  const setLoadingMessage = (message: string) => {
    loadingMessage.value = message
  }

  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    showLoading,
    hideLoading,
    setLoadingMessage
  }
}
