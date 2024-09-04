<template>
  <div>
    <label for="autocomplete" class="block text-sm font-medium text-gray-700">
      Select an Option
    </label>
    <v-select
      v-model="selectedOption"
      :options="options"
      :filterable="true"
      :searchable="true"
      :clearable="true"
      placeholder="Type to search..."
      @input="handleSelect"
      label="name"
      class="block w-full mt-1"
    />
  </div>
</template>

<script>
import { ref } from 'vue';

import vSelect from 'vue-select';

import 'vue-select/dist/vue-select.css';

export default {
  components: {
    vSelect,
  },
  setup() {
    const selectedOption = ref(null);
    const options = ref([
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' },
      // Add more options as needed
    ]);

    const handleSelect = option => {
      console.log('Selected option:', option);
      // Handle the selected option
    };

    return {
      selectedOption,
      options,
      handleSelect,
    };
  },
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
