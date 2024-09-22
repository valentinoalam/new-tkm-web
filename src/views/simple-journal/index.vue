<template>
  <div v-if="isLoading" class="flex items-center justify-center w-full h-full">
    <looping-rhombuses-spinner
      :animation-duration="2500"
      :rhombus-size="15"
      color="#CAFFBF"
    />
  </div>
  <div v-else>
    <div class="space-y-7">
      <slot />
    </div>
  </div>
</template>

<script setup>
// import/no-extraneous-dependencies
// import chroma from 'chroma-js';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const isLoading = ref(false);

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

onMounted(async () => {
  isLoading.value = true;
});

onBeforeUnmount(() => {});
</script>
<style></style>
