<template>
  <div>
    <div class="grid gap-4">
      <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl">Data City</h2>
          <button
            @click="isOpen = true"
            class="px-4 py-2 font-bold text-white bg-blue-800 rounded"
          >
            <AddIcon class="mr-2" /> Tambah Data
          </button>
        </div>
        <hr />
        <div class="flex justify-end mb-4">
          <div class="flex items-center border border-gray-300 rounded-lg">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              class="px-3 py-2 outline-none"
              placeholder="Search"
            />
            <button @click="handleSearch" class="p-2">
              <SearchIcon class="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <Tables :columns="columns" :data="filteredData" ref="gridRef" />
      </div>
    </div>

    <!-- Create -->
    <CreateCities
      :isOpen="isOpen"
      @close="isOpen = false"
      :dtProvinces="dtProvinces"
    />

    <!-- Edit -->
    <EditCities
      :isEditOpen="isEditOpen"
      @close="isEditOpen = false"
      :dtProvinces="dtProvinces"
      :dtCity="selectedCity"
    />

    <!-- View -->
    <ViewCities
      :isViewOpen="isViewOpen"
      @close="isViewOpen = false"
      :dtCity="selectedCity"
    />
  </div>
</template>

<script>
import AddIcon from '@heroicons/vue/outline/PlusIcon';
import SearchIcon from '@heroicons/vue/outline/SearchIcon';
import { LucideEdit, LucideView } from 'lucide-vue-next';
import { ref, computed, onMounted, h } from 'vue';
import { toast } from 'vue-sonner';
import { useSwal } from 'vue-swal';
import CreateCities from './CreateCities.vue';
import EditCities from './EditCities.vue';
import Tables from './Tables.vue';
import ViewCities from './ViewCities.vue';
import { ProvinceApi, CitiesApi } from '@/api'; // Adjust the import according to your API structure
import IconDelete from '@/components/atoms/icons/delete.vue';

export default {
  components: {
    AddIcon,
    SearchIcon,
    CreateCities,
    EditCities,
    ViewCities,
    Tables,
  },
  setup() {
    const gridRef = ref(null);
    const isOpen = ref(false);
    const isEditOpen = ref(false);
    const isViewOpen = ref(false);
    const dtProvinces = ref([]);
    const selectedCity = ref(null);
    const searchQuery = ref('');

    const swal = useSwal();
    const fetcher = () => CitiesApi.getAll().then(res => res.data.city.records);

    // Fetch provinces data on mount
    onMounted(() => {
      ProvinceApi.getAll().then(res => {
        dtProvinces.value = res.data.province.records;
      });
    });

    // Fetch cities data
    const dtCity = ref([]);
    fetcher().then(data => {
      dtCity.value = data;
    });

    // Filtered data based on search query
    const filteredData = computed(() => {
      if (!searchQuery.value) return dtCity.value;
      return dtCity.value.filter(city =>
        Object.values(city)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const handleSearch = () => {
      gridRef.value.setRowData(filteredData.value);
    };

    // Columns definition
    const columns = ref([
      {
        accessorKey: 'no',
        header: 'No',
        cell: info => info.row.index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Nama',
      },
      {
        accessorKey: 'province.name',
        header: 'Provinsi',
      },
      {
        header: 'Action',
        cell: ({ row }) => {
          const city = row.original;

          return h('div', { class: 'flex justify-center space-x-2' }, [
            h(
              'button',
              {
                class: 'bg-indigo-700 text-white p-2 rounded',
                onClick: () => {
                  selectedCity.value = city;
                  isViewOpen.value = true;
                },
              },
              [h(LucideView, { class: 'w-5 h-5' })]
            ),
            h(
              'button',
              {
                class: 'bg-orange-600 text-white p-2 rounded',
                onClick: () => {
                  selectedCity.value = city;
                  isEditOpen.value = true;
                },
              },
              [h(LucideEdit, { class: 'w-5 h-5' })]
            ),
            h(
              'button',
              {
                class: 'bg-red-800 text-white p-2 rounded',
                onClick: () => deleteById(city.id, city.name),
              },
              [h(IconDelete, { class: 'w-5 h-5' })]
            ),
          ]);
        },
      },
    ]);

    const deleteById = (id, name) => {
      swal
        .fire({
          title: h(
            'div',
            { style: 'font-weight: bold; font-size: 28px;' },
            `Yakin Ingin Menghapus?`
          ),
          html: h(
            'span',
            { style: 'font-weight: bold; font-size: 28px;' },
            `"${name}"`
          ),
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonColor: '#D80B0B',
          cancelButtonColor: 'grey',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Hapus',
        })
        .then(result => {
          if (result.isConfirmed) {
            CitiesApi.deleteById(id)
              .then(res => {
                console.log('Data berhasil dihapus:', res.data);
                toast.success('Data berhasil dihapus');
                dtCity.value = dtCity.value.filter(city => city.id !== id);
              })
              .catch(error => {
                console.error('Data Gagal dihapus:', error);
                toast.error('Data Gagal dihapus');
              });
          }
        });
    };

    return {
      isOpen,
      isEditOpen,
      isViewOpen,
      dtProvinces,
      selectedCity,
      searchQuery,
      filteredData,
      columns,
      gridRef,
      handleSearch,
      deleteById,
    };
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
