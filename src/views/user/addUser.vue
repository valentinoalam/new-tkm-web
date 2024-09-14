<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="p-6 bg-white rounded-lg shadow-lg w-96">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold">Add User</h3>
        <XIcon
          @click="closeModal"
          class="w-5 h-5 text-gray-500 cursor-pointer"
        />
      </div>

      <!-- Form starts here -->
      <FormKit
        type="form"
        :actions="false"
        @submit.prevent="handleSubmit"
        :validation-schema="validationSchema"
      >
        <div class="space-y-3">
          <FormKit
            name="name"
            label="Name"
            type="text"
            placeholder="Enter name"
            validation="required"
            input-class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            label-class="block text-xs font-semibold text-gray-600"
            validation-label-class="text-xs text-red-500"
          />

          <FormKit
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            validation="required|email"
            input-class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            label-class="block text-xs font-semibold text-gray-600"
            validation-label-class="text-xs text-red-500"
          />

          <FormKit
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            validation="required|min:6"
            input-class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            label-class="block text-xs font-semibold text-gray-600"
            validation-label-class="text-xs text-red-500"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm px-3 py-1.5 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md"
          >
            Add User
          </button>
        </div>
      </FormKit>
      <!-- Form ends here -->
    </div>
  </div>
</template>

<script>
import { FormKit } from '@formkit/vue';
import { XIcon } from 'lucide-vue-next';
// import * as yup from 'yup';

export default {
  components: {
    XIcon,
    FormKit,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleSubmit(values) {
      console.log('Form submitted:', values);
      // Call API or perform action here
      this.closeModal();
    },
  },
};
</script>

<style scoped>
/* You can add custom styles if needed */
</style>
