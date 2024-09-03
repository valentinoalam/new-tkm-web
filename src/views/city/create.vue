<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
      <div
        class="flex items-center justify-between p-4 text-white bg-black rounded-t-lg"
      >
        <h2 class="text-xl">Tambah Data City</h2>
        <button @click="handleClose" class="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
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
      <formkit-form :form="form" @submit="handleSubmit" class="grid gap-4 p-4">
        <div class="flex flex-col">
          <label for="name" class="mb-2 font-semibold">Name</label>
          <formkit
            type="text"
            id="name"
            name="name"
            placeholder="Masukkan Name...."
            :validation="'required'"
            validation-label="Name"
            :classes="{
              input:
                'border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
            }"
          />
        </div>
        <div class="flex flex-col">
          <label for="provinceId" class="mb-2 font-semibold">Province</label>
          <formkit
            type="select"
            id="provinceId"
            name="provinceId"
            placeholder="-- Pilih Province --"
            :options="
              dtProvinces.map(province => ({
                value: province.id,
                label: province.name,
              }))
            "
            :validation="'required'"
            validation-label="Province"
            :classes="{
              select:
                'border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
            }"
          />
        </div>
        <div class="flex justify-between">
          <button
            @click="handleClose"
            class="px-4 py-2 text-white bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md"
          >
            Simpan
          </button>
        </div>
      </formkit-form>
    </div>
  </div>
</template>

<script>
import { useForm } from '@formkit/vue';
import { toast } from 'vue-toastification';
import * as yup from 'yup';
import * as CitiesAPI from '../../../api/citiesApi';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    dtProvinces: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const form = useForm({
      initialValues: {
        name: '',
        provinceId: '',
      },
      validationSchema: yup.object({
        name: yup.string().required('required'),
        provinceId: yup.string().required('required'),
      }),
    });

    const handleSubmit = async values => {
      try {
        const res = await CitiesAPI.create(values);
        toast.success('Data Berhasil Disimpan');
        form.reset();
        props.onClose('', false);
      } catch (error) {
        toast.error('Data Gagal Disimpan: ' + error.message);
      }
    };

    const handleClose = () => {
      form.reset();
      props.onClose('', false);
    };

    return { form, handleSubmit, handleClose };
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
