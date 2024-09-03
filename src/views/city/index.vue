<template>
  <div>
    <div class="header">
      <h2>Data City</h2>
      <button @click="isOpen = true" class="add-button">Tambah Data</button>
    </div>
    <hr />
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        @input="filterData"
      />
    </div>
    <tanstack-table :columns="columns" :data="filteredData" />

    <CreateCities
      v-if="isOpen"
      v-model:is-open="isOpen"
      :dt-provinces="dtProvinces"
    />
    <EditCities
      v-if="isEditOpen"
      v-model:is-open="isEditOpen"
      :dt-city="selectedCity"
      :dt-provinces="dtProvinces"
    />
    <ViewCities
      v-if="isViewOpen"
      v-model:is-open="isViewOpen"
      :dt-city="selectedCity"
      :dt-provinces="dtProvinces"
    />
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted, computed, h } from 'vue';
import { toast } from 'vue-toastification';
import { CitiesApi, ProvinceApi } from '../../../api/citiesApi';
import CreateCities from './CreateCities.vue';
import EditCities from './EditCities.vue';
import ViewCities from './ViewCities.vue';

const isOpen = ref(false);
const isEditOpen = ref(false);
const isViewOpen = ref(false);
const dtProvinces = ref([]);
const selectedCity = ref(null);
const searchQuery = ref('');

const columns = [
  { accessor: 'no', Header: 'No' },
  { accessor: 'name', Header: 'Nama' },
  { accessor: 'province.name', Header: 'Provinsi' },
  {
    accessor: 'actions',
    Header: 'Action',
    Cell: ({ row }) =>
      h('div', { class: 'flex justify-around' }, [
        h(
          'button',
          {
            class: 'btn-view',
            onClick: () => viewCity(row.original),
          },
          'View'
        ),
        h(
          'button',
          {
            class: 'btn-edit',
            onClick: () => editCity(row.original),
          },
          'Edit'
        ),
        h(
          'button',
          {
            class: 'btn-delete',
            onClick: () => deleteCity(row.original.id, row.original.name),
          },
          'Delete'
        ),
      ]),
  },
];

const dtCity = ref([]);

onMounted(async () => {
  dtProvinces.value = await ProvinceApi.getAll().then(
    res => res.data.province.records
  );
  dtCity.value = await CitiesApi.getAll().then(res => res.data.city.records);
});

const filteredData = computed(() => {
  if (searchQuery.value) {
    return dtCity.value.filter(city =>
      city.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return dtCity.value;
});

const deleteCity = (id, name) => {
  Swal.fire({
    title: `Yakin Ingin Menghapus?`,
    html: `<span style="font-weight: bold; font-size: 28px;">"${name}"</span>`,
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: '#D80B0B',
    cancelButtonColor: 'grey',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Hapus',
  }).then(async result => {
    if (result.isConfirmed) {
      try {
        await CitiesApi.deleteById(id);
        toast.success('Data berhasil dihapus');
        dtCity.value = dtCity.value.filter(city => city.id !== id);
      } catch (error) {
        toast.error('Data Gagal dihapus');
      }
    }
  });
};

const viewCity = city => {
  selectedCity.value = city;
  isViewOpen.value = true;
};

const editCity = city => {
  selectedCity.value = city;
  isEditOpen.value = true;
};

const filterData = () => {
  filteredData.value = dtCity.value.filter(city =>
    city.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};
</script>

<style>
/* Add your styles here */
</style>
