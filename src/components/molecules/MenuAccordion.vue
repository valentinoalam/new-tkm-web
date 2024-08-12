<template>
  <button
    @click="toggleAccordion()"
    class="box-border flex items-center w-full p-3 px-6 py-2 mt-4 text-left text-gray-500 duration-200 border-l-4 border-gray-900 rounded-md hover:bg-opacity-25 hover:text-gray-100 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
    :aria-expanded="isOpen"
    :aria-controls="`collapse${_uid}`"
    :class="{
      ' text-gray-100/20 border-yellow-500': isOpen && isActive,
      'text-gray-100 border-yellow-500/30': !isOpen && isActive,
      ' bg-transparent': !isOpen && !isActive,
      'bg-gray-600 bg-opacity-25': isActive,
    }"
  >
    <span class="mr-3 text-xl">
      <slot name="icon"></slot>
    </span>
    <span class="w-full">
      <slot name="title" />
    </span>
    <span
      class="box-border mt-1 text-gray-500 transition-all dark:text-gray-500"
      :class="{
        'rotate-180': isOpen,
        'rotate-0': !isOpen,
      }"
    >
      <span class="float-right">
        <Icon icon="fa6-solid:angle-down" />
      </span>
    </span>
  </button>

  <div
    class="mt-2 text-gray-800 transition-all rounded-md bg-gray-100/10 dark:bg-gray-900"
    v-show="isOpen"
    :class="{ 'h-auto': isOpen, 'h-0': !isOpen }"
    :id="`collapse${_uid}`"
  >
    <slot name="content" />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    },
  },
  components: {
    Icon,
  },
};
</script>
