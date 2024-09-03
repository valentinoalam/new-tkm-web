<template>
  <div v-if="isEditOpen" class="dialog">
    <div class="dialog-title">
      Edit Data City
      <button class="close-button" @click="closeDialog">X</button>
    </div>
    <div class="dialog-content">
      <FormKit
        type="form"
        @submit="handleFormSubmit"
        :validation-schema="validationSchema"
        :value="dtCity"
      >
        <FormKit
          name="name"
          label="Name"
          validation="required"
          placeholder="Masukkan Name...."
          :value="dtCity.name"
        />
        <FormKit
          name="provinceId"
          label="Province"
          validation="required"
          :options="dtProvinces"
          placeholder="Pilih Province"
          type="select"
        />
        <div class="button-group">
          <button type="button" @click="closeDialog">Cancel</button>
          <button type="submit">Simpan</button>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-toastification';
import * as yup from 'yup';
import { CitiesApi } from '../../../api/citiesApi';

const props = defineProps({
  isEditOpen: Boolean,
  dtCity: Object,
  dtProvinces: Array,
});

const emit = defineEmits(['close']);

const validationSchema = yup.object().shape({
  name: yup.string().required('required'),
  provinceId: yup.string().required('required'),
});

const closeDialog = () => {
  emit('close', false);
};

const handleFormSubmit = async values => {
  try {
    await CitiesApi.update(values);
    toast.success('Data Berhasil Diperbarui');
    emit('close', false);
  } catch (error) {
    toast.error('Data Gagal Diperbarui: ' + error.message);
  }
};
</script>

<style>
/* Add your styles here */
</style>
