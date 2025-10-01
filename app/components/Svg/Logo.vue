<script lang="ts" setup>
const props = defineProps({
  height: {
    type: String,
    default: "100"
  },
  width: {
    type: String,
    default: "123"
  }
})
</script>

<template>
  <div>
    <svg :width="props.width" :height="props.height" viewBox="0 0 123 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="60" width="60" height="38" rx="2.5" transform="rotate(-90 0 60)" fill="white"/>
      <rect x="85" y="45" width="45" height="37.5" rx="2.5" transform="rotate(-90 85 45)" fill="white"/>
      <rect x="42.5" y="100" width="100" height="37.5" rx="2.5" transform="rotate(-90 42.5 100)" fill="white"/>
    </svg>
  </div>
</template>