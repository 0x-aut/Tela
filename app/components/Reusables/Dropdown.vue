<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

// Props for options and v-model
defineProps<{
  options: Array<{ value: string; label: string }>; // List of options
  modelValue: string; // v-model binding for selected value
}>();

// Emits for v-model
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Track dropdown open state
const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);


// Toggle dropdown visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Select an option and close dropdown
const selectOption = (value: string) => {
  isOpen.value = false;
  emit('update:modelValue', value);
};

// Close dropdown when clicking outside
const handleOutsideClick = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Add and remove outside click listener
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div class="dropdown-wrapper" ref="dropdownRef">
    <div class="dropdown-trigger" @click="toggleDropdown">
      <span class="geist-regular">{{ options.find(opt => opt.value === modelValue)?.label || 'Select...' }}</span>
      <ChevronDown :size="15" :stroke-width="1.5" :color="'#888'" />
    </div>
    <div v-if="isOpen" class="dropdown-menu">
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click="selectOption(option.value)"
      >
        <span class="geist-regular">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
  align-items: center;
  justify-content: center;
  width: 85px;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #3a3a3a;
  border-radius: 5px;
  padding: 2.5px 10px; // 10px padding all around
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  height: 23px; // Height adapts to content
  border: 1px solid rgba(240, 240, 240, 0.2);
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);

  &:hover {
    background: #4a4a4a;
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #2c2c2c;
  border-radius: 8px;
  border: 1px solid rgba(240, 240, 240, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px; // 10px padding all around
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #4a4a4a;
  }
}
</style>
