import { ref } from 'vue';
import type { ShareLinkResponse } from './types/types';

export const useEventShare = () => {
  const shareLink = ref<string>('');
  const shareToken = ref<string>('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  const generateShareLink = async (eventId: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const apiBaseUrl = config.public.apiBaseUrl as string;
      const token = localStorage.getItem('zonora_token');

      const response = await fetch(`${apiBaseUrl}/events/${eventId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar el enlace');
      }

      const data: ShareLinkResponse = await response.json();
      shareLink.value = data.share_url;
      shareToken.value = data.token;
    } catch (e: any) {
      error.value = e.message || 'Error al generar el enlace de compartir';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for insecure contexts (http)
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (err) {
      return false;
    }
  };

  return {
    shareLink,
    shareToken,
    loading,
    error,
    generateShareLink,
    copyToClipboard,
  };
};

