<template>
  <div class="flex justify-center">
    <div
      class="flex justify-center w-full p-2 m-1 text-white bg-blue-400 rounded-lg"
    >
      <button
        @click="handleView(value)"
        class="text-white cursor-pointer focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM8 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
          />
        </svg>
      </button>
    </div>

    <div
      class="flex justify-center w-full p-2 m-1 text-white bg-green-400 rounded-lg"
    >
      <button
        @click="handleEdit(value)"
        class="text-white cursor-pointer focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M11 4a2 2 0 0 1 2 2v3h-1V6a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.354.854l7.146 7.146a.5.5 0 0 0 .708-.708l-7.146-7.146A2 2 0 0 1 11 4zM4 14a2 2 0 0 1 2-2h3v1H6a1 1 0 0 0-1 1v3h1v-1h5v-2a2 2 0 0 1 2-2h3v1H14a1 1 0 0 0-1 1v5h1v-1h-5v-2H4v3H3v-3z"
          />
        </svg>
      </button>
    </div>

    <div
      class="flex justify-center w-full p-2 m-1 text-white bg-red-500 rounded-lg"
    >
      <button
        @click="handleDelete(value)"
        class="text-white cursor-pointer focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10 2a2 2 0 0 1 2 2h3a1 1 0 0 1 0 2h-1v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6H3a1 1 0 1 1 0-2h3a2 2 0 0 1 2-2h2zM6 6v10h8V6H6zm4-3a1 1 0 0 0-1 1v1h2V4a1 1 0 0 0-1-1z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    handleView(id) {
      console.log('Viewing item with id:', id);
    },
    handleEdit(id) {
      console.log('Editing item with id:', id);
    },
    handleDelete(id) {
      console.log('Deleting item with id:', id);
    },
  },
};
</script>
