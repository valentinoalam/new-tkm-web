<template>
  <div>
    <h1>Pengaturan Akun</h1>
    <!-- Form untuk mengelola akun pengguna -->
    <form @submit.prevent="updateAccount">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" />
      </div>
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

import { useMainStore } from '@/stores/main';

export default {
  name: 'AccountSettings',
  setup() {
    const store = useMainStore();
    const username = ref(store.username);
    const email = ref(store.email);
    const password = ref('');

    const updateAccount = () => {
      // Logic untuk memperbarui akun pengguna
      store.updateAccount({
        username: username.value,
        email: email.value,
        password: password.value,
      });
    };

    return { username, email, password, updateAccount };
  },
};
</script>
