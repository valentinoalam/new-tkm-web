<template>
  <div class="flex flex-row items-center justify-center min-h-screen">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-md p-6 bg-white rounded shadow-md"
    >
      <p class="mb-2 text-center">
        <!-- <img src="assets/dsn.png" alt="Logo" class="w-48 h-24 mx-auto" /> -->
      </p>
      <p class="mb-4 text-4xl font-bold text-center title">
        <span>Tata Kelola</span> Masjid
      </p>

      <!-- Username Input -->
      <div class="mb-4">
        <label for="username" class="block mb-2 font-bold text-gray-700">
          Username
        </label>
        <div class="flex items-center border border-gray-300 rounded">
          <span class="px-3">
            <fa-icon :icon="['fas', 'user']" />
          </span>
          <input
            v-model="values.username"
            ref="userRef"
            id="username"
            name="username"
            type="text"
            class="w-full px-3 py-3 leading-tight focus:outline-none focus:border-blue-500"
            placeholder="Masukkan Username"
            autocomplete="username"
            required
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label for="password" class="block mb-2 font-bold text-gray-700">
          Password
        </label>
        <div class="flex items-center border border-gray-300 rounded">
          <span class="px-3">
            <fa-icon :icon="['fas', 'lock']" />
          </span>
          <input
            v-model="values.password"
            id="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full px-3 py-3 leading-tight focus:outline-none focus:border-blue-500"
            placeholder="Password"
            autocomplete="password"
            required
          />
          <button type="button" class="px-3" @click="togglePasswordVisibility">
            <fa-icon
              :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
            />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <p v-if="errMsg" class="mb-4 text-center text-red-600">{{ errMsg }}</p>
      <!-- <div class="flex items-center justify-between mt-4">
        <div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            />
            <span class="mx-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div>
          <a
            class="block text-sm text-indigo-700 fontme hover:underline"
            href="#"
            >Forgot your password?</a
          >
        </div>
      </div> -->
      <!-- Login Button -->
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        >
          LOGIN
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import authService from '@/service/authService';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const userRef = ref(null);

const initialValues = { username: '', password: '' };
const values = reactive({ ...initialValues });
const errMsg = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  const store = useAuth();
  try {
    const response = await authService.login(values.username, values.password); // Custom API call hook
    const { tokens, user } = response.data;
    // Store the token in local storage
    localStorage.setItem('tkm_at', tokens?.access_token);
    // Save user to store
    store.setCredentials(tokens, user);
    const from = route.query.from || '/';
    router.replace(from.toString());
  } catch (err) {
    console.error('Login failed:', err);
    errMsg.value = 'Login Failed. Please try again.';
    toast.error(errMsg.value);
  }
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
