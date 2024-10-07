<script setup>
const props = defineProps({
  btnType: String,
  link: String,
  class: {
    type: String,
    default: 'text-sm sm:text-md md:text-base',
  },
});
</script>

<template>
  <a
    v-if="btnType === 'primary'"
    :href="link"
    v-smooth-scroll
    :class="props.class"
    class="px-6 py-2 mr-5 font-medium text-white transition duration-200 border-2 border-transparent rounded shadow-md cursor-pointer font-theme-heading bg-theme-primary hover:bg-white hover:border-theme-primary hover:text-theme-primary"
  >
    <slot></slot>
  </a>
  <a
    v-if="btnType === 'muted'"
    :href="link"
    v-smooth-scroll
    :class="props.class"
    class="px-6 py-2 font-medium text-gray-500 transition duration-200 bg-gray-100 border-2 border-transparent rounded shadow-md cursor-pointer font-theme-heading hover:bg-white hover:border-theme-grayish-blue hover:text-theme-grayish-blue"
  >
    <slot></slot>
  </a>
</template>
