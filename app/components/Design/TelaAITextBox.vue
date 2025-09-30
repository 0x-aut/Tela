<script lang="ts" setup>
import { ArrowUp } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

// Reference to the textarea element
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const innerWrapper = ref<HTMLDivElement | null>(null);
const textareaValue = ref<string>('');

// Function to adjust textarea height to grow upward
const mainTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = '18px';
  }
}
const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    // textareaRef.value.style.height = '18px';
    textareaRef.value.style.transition = 'height 0.03s ease-out';
    const scrollHeight = textareaRef.value.scrollHeight;
    textareaRef.value.style.height = `${Math.max(scrollHeight, 18)}px`;
    console.log(scrollHeight);
    if (innerWrapper.value) {
      innerWrapper.value.style.borderRadius = '22.5px';
      innerWrapper.value.style.transition = 'border-radius 0.2s ease';
    }
    textareaRef.value.style.transformOrigin = 'bottom';
  }
};

watch(textareaValue, () => {
  adjustTextareaHeight();
});


// Handle input event to dynamically adjust height
const handleInput = () => {
  adjustTextareaHeight();
};

// Initialize and set up event listeners
onMounted(() => {
  if (textareaRef.value) {
    mainTextareaHeight(); // Set initial height
    textareaRef.value.addEventListener('input', handleInput);
  }
});

// Clean up event listeners
onUnmounted(() => {
  if (textareaRef.value) {
    textareaRef.value.removeEventListener('input', handleInput);
  }
});


</script>

<template>
  <div class="textbox-wrapper">
    <div ref="innerWrapper" class="inner-wrapper">
      <textarea
        ref="textareaRef"
        class="geist-regular"
        autofocus="true"
        placeholder="Edit your components with AI"
        v-model="textareaValue"
      ></textarea>
      <button>
        <ArrowUp
          :color="'#121212'"
          :size="18"
          :stroke-width="1.5"
          absoluteStrokeWidth
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.textbox-wrapper {
  display: flex;
  width: 100%;
  justify-content: center;
}

.inner-wrapper {
  display: flex;
  align-items: flex-end;
  column-gap: 10px;
  padding: 5px;
  background: #2c2c2c;
  border-radius: 30px;
  border: 1px solid rgba(240, 240, 240, 0.2);
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: stretch;
}

textarea {
  outline: 0;
  color: #ffffff;
  background: #2c2c2c;
  padding: 0px 5px 5px 5px;
  border-radius: inherit;
  height: 18px;
  border: 0px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  word-wrap: break-word; 
  flex: 1;
  resize: none; 
  scrollbar-width: none;
  -ms-overflow-style: none; 
  display: flex;
  align-items: center;
  line-height: 1.5;
  overflow-y: auto;
  font-size: 15px;
  transform-origin: bottom;
  box-sizing: border-box;
  overflow-anchor: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &::placeholder {
    color: #888;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: normal;
  }
}
button {
  all: unset;
  cursor: pointer;
  border-radius: 50%;
  background: #ffffff;
  width: 34px;
  height: 34px;
  min-width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
