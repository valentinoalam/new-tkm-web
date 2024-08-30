import { ref } from 'vue';

const isShow = ref(false);
export function useBackdrop() {
  function isVisible() {
    return isShow.value;
  }

  function show() {
    isShow.value = true;
  }

  function hide() {
    isShow.value = false;
  }

  function toggle() {
    isShow.value = !isShow.value;
  }

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
}
