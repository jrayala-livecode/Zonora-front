export const useModal = () => {
  const modalState = useState('modal', () => ({
    show: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    showCancel: false,
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    onConfirm: null as (() => void) | null
  }));

  const showModal = (options: {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => {
    modalState.value = {
      show: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      showCancel: options.showCancel || false,
      confirmText: options.confirmText || 'Aceptar',
      cancelText: options.cancelText || 'Cancelar',
      onConfirm: options.onConfirm || null
    };
  };

  const hideModal = () => {
    modalState.value.show = false;
  };

  const triggerConfirm = () => {
    try {
      if (modalState.value.onConfirm) {
        modalState.value.onConfirm();
      }
    } catch (error) {
      console.error('Error executing onConfirm:', error);
    }
  };

  const showSuccess = (title: string, message: string) => {
    showModal({ title, message, type: 'success' });
  };

  const showError = (title: string, message: string) => {
    showModal({ title, message, type: 'error' });
  };

  const showWarning = (title: string, message: string) => {
    showModal({ title, message, type: 'warning' });
  };

  const showInfo = (title: string, message: string) => {
    showModal({ title, message, type: 'info' });
  };

  return {
    modalState: readonly(modalState),
    showModal,
    hideModal,
    triggerConfirm,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};