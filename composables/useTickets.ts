import type { Ticket, TicketPurchaseRequest, EventTicketsResponse } from './types/types'

// Singleton state (outside the composable function)
const myTickets = ref<Ticket[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useTickets = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  /**
   * Fetch user's tickets
   */
  const fetchMyTickets = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets`)
      
      if (!response.ok) {
        throw new Error('Error al obtener los tickets')
      }

      const data = await response.json()
      myTickets.value = data.data || []
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al obtener tickets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Purchase tickets (free or paid with bank transfer)
   */
  const purchaseTicket = async (eventId: number, quantity: number, receipt?: File) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      
      const formData = new FormData()
      formData.append('event_id', eventId.toString())
      formData.append('quantity', quantity.toString())
      
      if (receipt) {
        formData.append('receipt', receipt)
      }

      console.log('Purchasing ticket with:', {
        event_id: eventId,
        quantity: quantity,
        has_receipt: !!receipt
      })

      // Don't set Content-Type header - let browser set it with boundary for FormData
      const response = await apiRequest(`${API_URL}/tickets/purchase`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Purchase failed:', errorData)
        throw new Error(errorData.message || 'Error al comprar tickets')
      }

      const data = await response.json()
      console.log('Purchase successful:', data)
      
      // Refresh tickets list
      await fetchMyTickets()
      
      return data
    } catch (err: any) {
      console.error('Purchase error:', err)
      error.value = err.message || 'Error al comprar tickets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get single ticket details
   */
  const getTicket = async (ticketId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/${ticketId}`)
      
      if (!response.ok) {
        throw new Error('Error al obtener el ticket')
      }

      const data = await response.json()
      return data.data
    } catch (err: any) {
      error.value = err.message || 'Error al obtener ticket'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get QR code URL for a ticket
   */
  const getQrCodeUrl = (ticketId: number) => {
    return `${API_URL}/qr-ticket/${ticketId}`
  }

  /**
   * Mark ticket as used (for organizers)
   */
  const markTicketAsUsed = async (ticketId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/${ticketId}/use`, {
        method: 'PUT'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al marcar ticket como usado')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al marcar ticket'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get all tickets for an event (organizer view)
   */
  const getEventTickets = async (eventId: number): Promise<EventTicketsResponse> => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/events/${eventId}/tickets`)
      
      if (!response.ok) {
        throw new Error('Error al obtener tickets del evento')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al obtener tickets del evento'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Validate receipt (organizer only)
   */
  const validateReceipt = async (ticketId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/${ticketId}/validate-receipt`, {
        method: 'PUT'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al validar recibo')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al validar recibo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reject receipt (organizer only)
   */
  const rejectReceipt = async (ticketId: number, reason?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/${ticketId}/reject-receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al rechazar recibo')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al rechazar recibo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Search tickets by email (organizer at entrance)
   */
  const searchTicketsByEmail = async (eventId: number, email: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/events/${eventId}/tickets/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 404) {
          return { found: false, message: errorData.message }
        }
        throw new Error(errorData.message || 'Error al buscar tickets')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al buscar tickets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verify ticket by QR code
   */
  const verifyTicket = async (token: string, qrCode: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/verify-ticket?token=${token}&qr=${qrCode}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al verificar ticket')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al verificar ticket'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if user has pending receipt for an event
   */
  const hasPendingReceipt = (eventId: number): boolean => {
    return myTickets.value.some(
      ticket => 
        ticket.event_id === eventId && 
        ticket.receipt_validation_status === 'pending'
    )
  }

  /**
   * Check if user has free ticket for an event
   */
  const hasFreeTicket = (eventId: number): boolean => {
    return myTickets.value.some(
      ticket => 
        ticket.event_id === eventId && 
        ticket.payment_method === 'free' &&
        (ticket.status === 'active' || ticket.status === 'used')
    )
  }

  /**
   * Get user's tickets for a specific event
   */
  const getTicketsForEvent = (eventId: number): Ticket[] => {
    return myTickets.value.filter(ticket => ticket.event_id === eventId)
  }

  /**
   * Validate all tickets in a purchase group (bulk approval)
   */
  const validateReceiptGroup = async (purchaseGroupId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/group/${purchaseGroupId}/validate-receipt`, {
        method: 'PUT'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al validar grupo de recibos')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al validar grupo de recibos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reject all tickets in a purchase group (bulk rejection)
   */
  const rejectReceiptGroup = async (purchaseGroupId: string, reason?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`${API_URL}/tickets/group/${purchaseGroupId}/reject-receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al rechazar grupo de recibos')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al rechazar grupo de recibos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    myTickets,
    isLoading,
    error,

    // Methods
    fetchMyTickets,
    purchaseTicket,
    getTicket,
    getQrCodeUrl,
    markTicketAsUsed,
    getEventTickets,
    validateReceipt,
    rejectReceipt,
    validateReceiptGroup,
    rejectReceiptGroup,
    searchTicketsByEmail,
    verifyTicket,
    
    // Helpers
    hasPendingReceipt,
    hasFreeTicket,
    getTicketsForEvent
  }
}

