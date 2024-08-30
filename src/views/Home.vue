<template>
  <div class="flex flex-col">
    <h1>Welcome to Financial Report App</h1>
    <Modal />
  </div>
</template>

<script>
import Modal from '@/components/molecules/Modal.vue';

export default {
  components: { Modal },
  name: 'Home',
};
</script>
