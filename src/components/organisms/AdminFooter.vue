<template>
  <footer class="box-border pb-1 mt-2 text-center xl:max-w-6xl xl:mx-auto">
    <BaseLevel class="flex">
      <div class="flex-1 text-center md:text-left">
        <b
          >&copy;{{ year }},
          <a href="https://assalamjs.online/" target="_blank"
            >assalamjs.online</a
          >.</b
        >
        <slot />
      </div>
      <div class="md:py-2">
        <a href="https://justboil.me">
          <Logo class="w-auto h-8 md:h-6" />
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
<script setup>
import BaseLevel from '@/components/atoms/BaseLevel.vue';
import Logo from '@/components/molecules/layouts/Logo.vue';
import { containerMaxW } from '@/configs/config';

const year = new Date().getFullYear();
</script>
