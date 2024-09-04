<script lang="ts" setup>
import { ChevronRight } from 'lucide-vue-next';
import {
  RangeCalendarNext,
  type RangeCalendarNextProps,
  useForwardProps,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils';

const props = defineProps<
  RangeCalendarNextProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <RangeCalendarNext
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronRight class="w-4 h-4" />
    </slot>
  </RangeCalendarNext>
</template>
