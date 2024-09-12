<template>
  <div>
    <h1 class="mt-2 mb-3 ml-2 text-2xl font-bold">Profile</h1>
    <FormKit
      type="form"
      @submit="handleFormSubmit"
      :value="userInfo"
      class="space-y-6"
    >
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="p-4 bg-white border-t-4 border-black rounded-lg shadow">
          <div class="flex flex-col items-center">
            <!-- Profile Picture -->
            <!-- <div class="relative">
              <div
                class="w-48 h-48 mt-12 mb-4 overflow-hidden border-2 border-gray-500 rounded-full"
              >
                <img
                  v-if="!image"
                  :src="`${path}${userInfo.profilePic}`"
                  alt="Uploaded Preview"
                  class="object-cover w-full h-full"
                />
                <img
                  v-if="image"
                  :src="image"
                  alt="Uploaded Preview"
                  class="object-cover w-full h-full cursor-move"
                />
              </div>
            </div> -->
            <!-- Name and Role -->
            <h2 class="text-2xl font-bold">{{ userInfo.username }}</h2>
            <!-- <p class="mb-4 text-lg">{{ userInfo.role }}</p> -->
            <!-- Edit Profile and Change Password Buttons -->
            <button
              type="submit"
              class="w-full py-2 mb-2 font-bold text-white bg-blue-700 rounded"
            >
              Edit Profile
            </button>
            <button
              @click="openPasswordModal"
              class="w-full py-2 font-bold text-white bg-red-700 rounded"
            >
              Ganti Password
            </button>
          </div>
        </div>
        <!-- Profile Form -->
        <div
          class="col-span-2 p-4 bg-white border-t-4 border-black rounded-lg shadow"
        >
          <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
            <!-- Name Field -->
            <div class="flex items-center col-span-4">
              <label class="w-1/4 text-lg font-bold">Name</label>
              <FormKit
                type="text"
                name="name"
                placeholder="Name"
                class="w-full bg-gray-100"
              />
            </div>
            <!-- Phone Field -->
            <div class="flex items-center col-span-4">
              <label class="w-1/4 text-lg font-bold">No.Telp</label>
              <FormKit
                type="text"
                name="phone"
                placeholder="No Telephon"
                class="w-full bg-gray-100"
                :attrs="{ readonly: true }"
              />
            </div>
            <!-- Address Field -->
            <div class="flex items-center col-span-4">
              <label class="w-1/4 text-lg font-bold">Alamat</label>
              <FormKit
                type="textarea"
                name="alamat"
                placeholder="Alamat..."
                rows="4"
                class="w-full bg-gray-100"
                :attrs="{ readonly: true }"
              />
            </div>
          </div>
        </div>
      </div>
    </FormKit>

    <!-- Edit Password Modal -->
    <EditPassword v-if="isOpen" @close="isOpen = false" />
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import EditPassword from './editPassword.vue';
// import * as UsersAPI from '@/service/userService';

export default {
  components: { EditPassword },
  setup() {
    // const store = useStore();
    const path = import.meta.env.VUE_APP_WBMS_BACKEND_IMG_URL;
    // const userInfo = store.state.app.userInfo;

    const isOpen = ref(false);
    const image = ref(null);
    const editedData = reactive({});

    const handleFormSubmit = values => {
      editedData.name = values.name;
      editedData.phone = values.phone;
      editedData.alamat = values.alamat;
      // UsersAPI.update(userInfo.id, editedData).then(res => {
      // store.commit('updateUser', res.data.user.records);
      // });
    };

    const openPasswordModal = () => {
      isOpen.value = true;
    };

    return {
      path,
      // userInfo,
      isOpen,
      image,
      handleFormSubmit,
      openPasswordModal,
    };
  },
};
</script>

<style scoped>
/* Add any necessary additional styling here */
</style>
