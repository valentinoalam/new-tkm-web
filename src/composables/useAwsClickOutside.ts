import { onBeforeUnmount, onMounted, watch, ref } from 'vue';

export function useClickOutSide(target: any, callBack: any, isCollapsed: any) {
  if (!target) return;

  const listner = (event: any) => {
    if (isCollapsed.value) {
      removeSideBarListner();
      return;
    }
    if (
      event.target == target.value ||
      event.composedPath().includes(target.value)
    ) {
      return;
    }
    callBack();
  };
  const removeSideBarListner = () => {
    window.removeEventListener('click', listner);
  };
  const addSideBarListner = () => {
    removeSideBarListner();
    setTimeout(() => {
      //push this to the end of call stack
      window.addEventListener('click', listner);
    }, 0);
  };

  onBeforeUnmount(removeSideBarListner);

  return { removeSideBarListner, addSideBarListner };
}

export function useAutoCollapse(
  target: number,
  callBack: (collapsed: boolean) => void
) {
  if (!target) return;

  // Call the callback with the initial window width check
  callBack(target > window.innerWidth);

  let initialWidth = window.innerWidth;

  // Define the resize listener
  const listener = () => {
    if (initialWidth !== window.innerWidth) {
      // Call the callback whenever the window size changes
      callBack(target > window.innerWidth);
      initialWidth = window.innerWidth;
    }
  };

  // Add the resize event listener
  window.addEventListener('resize', listener);

  // Cleanup the listener when the component is unmounted
  onBeforeUnmount(() => {
    window.removeEventListener('resize', listener);
  });
}
