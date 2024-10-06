import { ref, onUnmounted } from 'vue';

const isShow = ref(false);
export function useBackdrop() {
  const menu = ref<HTMLElement | null>(null);
  function isVisible() {
    return isShow.value;
  }

  function show() {
    isShow.value = true;
    // Add event listeners when showing the modal
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('keydown', handleEscKey);
    }, 0);
  }

  function hide() {
    isShow.value = false;
    // Remove event listeners when hiding the modal
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleEscKey);
  }

  function toggle() {
    isShow.value = !isShow.value;
  }

  // Close on click outside
  function handleClickOutside(event: MouseEvent) {
    if (menu.value && !menu.value.contains(event.target as Node)) {
      hide();
    }
  }

  function handleEscKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      hide(); // Close modal if the Esc key is pressed
    }
  }
  // Clean up event listeners on component unmount
  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleEscKey);
  });
  return {
    isVisible,
    show,
    hide,
    toggle,
    menu,
  };
}
