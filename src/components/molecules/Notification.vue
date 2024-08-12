<template>
  <div
    :class="['notification', isRead ? 'animate-enter' : 'animate-leave']"
    :style="{ width: 'max-content', marginTop: '25px' }"
  >
    <div class="notification-container">
      <div class="notification-wrapper">
        <div class="image-container">
          <img :src="`${path}${photo}`" alt="" />
        </div>
        <div class="message">
          <p class="sender">{{ sender }}</p>
          <p class="message" :style="{ marginTop: '1rem' }">{{ message }}</p>
        </div>
      </div>
    </div>
    <div class="notification-close" v-if="!isRead">
      <button @click="onClick" class="close-button">Close</button>
    </div>
  </div>
</template>

<script>
// import { ref } from 'vue';
// const notificationOpen = ref(false);
// export default {
//   name: 'Notification',
//   props: {
//     message: {
//       type: String,
//       required: true,
//     },
//     isRead: {
//       type: Boolean,
//       required: true,
//     },
//     sender: {
//       type: String,
//       required: true,
//     },
//     photo: {
//       type: String,
//       required: true,
//     },
//     onClick: {
//       type: Function,
//       required: true,
//     },
//   },
//   data() {
//     return {
//       path: process.env.VUE_APP_WBMS_BACKEND_IMG_URL,
//     };
//   },
// };
</script>

<style scoped>
@import './styles/index.css';
/* Add any other styles here if needed */
</style>
