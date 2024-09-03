<template>
  <div
    v-if="isViewOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div
        class="flex justify-between items-center p-4 bg-black text-white rounded-t-lg"
      >
        <h2 class="text-xl">Detail Data City</h2>
        <button @click="handleClose" class="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="p-4">
        <formkit-form :form="form" class="grid gap-4">
          <div class="flex flex-col">
            <label for="name" class="mb-2 font-semibold">Name</label>
            <formkit
              type="text"
              id="name"
              name="name"
              :value="dtCity.name"
              :disabled="true"
              :classes="{
                input:
                  'border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
              }"
            />
          </div>
          <div class="flex flex-col">
            <label for="provinceId" class="mb-2 font-semibold">Province</label>
            <formkit
              type="text"
              id="provinceId"
              name="provinceId"
              :value="dtCity.province.name"
              :disabled="true"
              :classes="{
                input:
                  'border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
              }"
            />
          </div>
        </formkit-form>
      </div>
    </div>
  </div>
</template>

<script>
import { useForm } from '@formkit/vue';

export default {
  props: {
    isViewOpen: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    dtCity: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const form = useForm({
      initialValues: props.dtCity,
    });

    const handleClose = () => {
      props.onClose('', false);
    };

    return { form, handleClose };
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
