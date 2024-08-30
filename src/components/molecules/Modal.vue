<script setup lang="ts">
import { useBackdrop } from '@/composables/useBackdrop';

const backdrop = useBackdrop();
const modalOpen = () => {
  backdrop.show();
};
const modalClose = () => {
  backdrop.hide();
};
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Modal</h3>
    <button
      class="px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
      @click="modalOpen"
    >
      Open Modal
    </button>

    <div
      :class="`modal ${
        !backdrop.isVisible() && 'opacity-0 pointer-events-none'
      } fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal -->
        <div class="px-6 py-4 text-left modal-content">
          <!-- Title -->
          <div class="flex items-center justify-between pb-3">
            <p class="text-2xl font-bold">Modal Title</p>
            <div class="z-50 cursor-pointer modal-close" @click="modalClose">
              <svg
                class="text-black fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!-- Body -->
          <p>Modal content.</p>

          <!-- Footer -->
          <div class="flex justify-end pt-2">
            <button
              class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
              @click="modalClose"
            >
              Close
            </button>
            <button
              class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              @click="modalClose"
            >
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
