/* eslint-disable unused-imports/no-unused-vars */
import { ref, computed, inject, watch, provide, reactive, toRefs } from 'vue';
// import { useRoute } from 'vue-router';

interface Props {
  autoCollapse: boolean;
  collapsed: boolean;
  relative: boolean;
  width: string | number;
  widthCollapsed: string | number;
  rtl: boolean;
}

interface Context {
  emit: (event: string, ...args: unknown[]) => void;
}

export const initAwsomeRouter = (props: Props, context: Context) => {
  toRefs(props);
  const currentRoute = ref(window.location);

  function isSameUrl(url: string, location = currentRoute.value) {
    return (
      location.href === location.origin + url ||
      location.pathname + location.hash === url ||
      location.pathname + location.search === url ||
      location.href === url ||
      location.hash === url
    );
  }

  function extractChildrenRoutes(
    obj: Record<string, unknown> | null,
    keyToFind: string
  ): unknown[] {
    if (!obj) return [];
    return Object.entries(obj).reduce(
      (acc: unknown[], [key, value]: [string, unknown]) =>
        key === keyToFind
          ? acc.concat(value)
          : typeof value === 'object' && value !== null
            ? acc.concat(
                extractChildrenRoutes(
                  value as Record<string, unknown>,
                  keyToFind
                )
              )
            : acc,
      []
    );
  }

  const updateCurrentRoute = (val: Location) => {
    currentRoute.value = { ...val };
  };

  provide('currentRoute', currentRoute);
  provide('updateCurrentRoute', updateCurrentRoute);
  provide('isSameUrl', isSameUrl);
  provide('extractChildrenRoutes', extractChildrenRoutes);

  return {
    isSameUrl,
    extractChildrenRoutes,
    currentRoute,
    updateCurrentRoute,
  };
};
