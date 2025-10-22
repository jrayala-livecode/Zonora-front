export const usePinata = () => {
  /**
   * Upload a file to Pinata IPFS
   */
  const uploadFile = async (file: File, folder?: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (folder) {
        formData.append('folder', folder)
      }

      const { apiRequest } = useApiClient()
      const response = await apiRequest('/pinata/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al subir archivo')
      }

      const data = await response.json()
      return {
        success: true,
        cid: data.cid || data.IpfsHash,
        url: data.url
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get Pinata gateway URL for a CID
   */
  const getImageUrl = (cid: string) => {
    if (!cid) return null
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:8000/api'
    return `${apiBase}/pinata/${cid}`
  }

  return {
    uploadFile,
    getImageUrl
  }
}


