<template>
  <div class="toggle-container">
    <FormKit
      type="radio"
      :value="modelValue"
      :config="{
        label: false,
        icon: false,
        decorator: false,
        decoratorIcon: false,
      }"
    >
      <template #input="slotProps">
        <label :for="slotProps.node.props.id" class="toggle-label">
          <input
            v-bind="slotProps.attributes"
            type="checkbox"
            :id="slotProps.node.props.id"
            class="toggle-input"
            @change="updateValue($event.target.checked)"
          />
          <span class="toggle-slider"></span>
        </label>
      </template>
    </FormKit>
  </div>
</template>

<script>
export default {
  name: 'CustomToggle',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style scoped>
.toggle-container {
  display: inline-block;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-input:checked + .toggle-slider {
  background-color: #4caf50;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(26px);
}
</style>
