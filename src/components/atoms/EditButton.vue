<script setup>
const props = defineProps({
  id: Number,
});
</script>

<template>
  <a
    :href="`/users/${props.id}/edit`"
    class="text-indigo-600 hover:text-indigo-500"
    >Edit</a
  >
</template>
