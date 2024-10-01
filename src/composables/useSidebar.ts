import { ref, watch } from 'vue';

const storedValue = localStorage.getItem('sidebar-open');
const isOpen = ref(storedValue ? JSON.parse(storedValue) : true);

export function useSidebar() {
  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };

  const openSidebar = () => {
    isOpen.value = true;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  // Watch the isOpen variable and update localStorage when it changes
  watch(isOpen, newVal => {
    localStorage.setItem('sidebar-open', JSON.stringify(newVal));
  });

  // Return the state and function from the composable
  return {
    isOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };
}
