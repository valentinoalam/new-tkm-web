import { ref } from 'vue';

const isOpen = ref(false);

export function useSidebar() {
  // try {
  //   const storedValue = localStorage.getItem('sidebar-open');
  //   if (storedValue) {
  //     isOpen.value = JSON.parse(storedValue);
  //   }
  // } catch (error) {
  //   console.error('Error parsing sidebar-open:', error);
  // }

  // // Function to toggle the sidebar state
  // const toggleSidebar = () => {
  //   isOpen.value = !isOpen.value;
  // };

  // // Watch the isOpen variable and update localStorage when it changes
  // watch(isOpen, newVal => {
  //   localStorage.setItem('sidebar-open', JSON.stringify(newVal));
  // });

  // Return the state and function from the composable
  return {
    isOpen,
    // toggleSidebar,
  };
}
