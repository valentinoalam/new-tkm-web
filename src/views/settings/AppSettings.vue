<template>
  <div>
    <h1>Pengaturan Aplikasi</h1>
    <!-- Form untuk mengelola pengaturan aplikasi -->
    <form @submit.prevent="updateSettings">
      <div>
        <label for="theme">Tema:</label>
        <select v-model="theme" id="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div>
        <label for="language">Bahasa:</label>
        <select v-model="language" id="language">
          <option value="en">English</option>
          <option value="id">Bahasa Indonesia</option>
        </select>
      </div>
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

import { useMainStore } from '@/stores/main';

export default {
  name: 'AppSettings',
  setup() {
    const store = useMainStore();
    const theme = ref(store.theme);
    const language = ref(store.language);

    const updateSettings = () => {
      // Logic untuk memperbarui pengaturan aplikasi
      store.updateSettings({ theme: theme.value, language: language.value });
    };

    return { theme, language, updateSettings };
  },
};
</script>
