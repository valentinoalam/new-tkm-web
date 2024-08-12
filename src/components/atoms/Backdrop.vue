<template>
  <div
    :class="props.isOpen ? 'block' : 'hidden'"
    class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
    @click="closeBackdrop"
  />
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['update:isOpen']);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const closeBackdrop = () => {
  emit('update:isOpen', false);
};
</script>
