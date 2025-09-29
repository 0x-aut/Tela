<script lang="ts" setup>
const props = defineProps({
  width: {
    type: String,
    default: "500"
  },
  height: {
    type: String,
    default: "450"
  }
})
</script>


<template>
  <div>
    <svg :width="props.width" :height="props.height" viewBox="0 0 667 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="126.087" y="101.449" width="94.2029" height="144.928" fill="white"/>
      <rect width="94.2029" height="144.928" fill="white"/>
      <rect x="572.464" width="94.2029" height="144.928" fill="white"/>
      <rect y="150.725" width="94.2029" height="144.928" fill="white"/>
      <rect x="572.464" y="150.725" width="94.2029" height="144.928" fill="white"/>
      <rect y="301.449" width="94.2029" height="144.928" fill="white"/>
      <rect x="572.464" y="301.449" width="94.2029" height="144.928" fill="white"/>
      <rect y="452" width="94" height="148" fill="white"/>
      <rect x="572" y="452" width="95" height="148" fill="white"/>
      <rect x="285.507" y="101.449" width="94.2029" height="144.928" fill="white"/>
      <rect x="285.507" y="355.073" width="94.2029" height="144.928" fill="white"/>
      <rect x="443.478" y="355.073" width="94.2029" height="144.928" fill="white"/>
      <rect x="444.927" y="101.449" width="94.2029" height="144.928" fill="white"/>
      <rect x="101.449" y="94.2029" width="94.2029" height="144.928" transform="rotate(-90 101.449 94.2029)" fill="white"/>
      <rect x="101.449" y="600" width="94.2029" height="144.928" transform="rotate(-90 101.449 600)" fill="white"/>
      <rect x="260.87" y="347.826" width="94.2029" height="144.928" transform="rotate(-90 260.87 347.826)" fill="white"/>
      <rect x="260.87" y="94.2029" width="94.2029" height="144.928" transform="rotate(-90 260.87 94.2029)" fill="white"/>
      <rect x="260.87" y="600" width="94.2029" height="144.928" transform="rotate(-90 260.87 600)" fill="white"/>
      <rect x="420.29" y="94.2029" width="94.2029" height="144.928" transform="rotate(-90 420.29 94.2029)" fill="white"/>
      <rect x="420.29" y="600" width="94.2029" height="144.928" transform="rotate(-90 420.29 600)" fill="white"/>
      <rect x="220.29" y="500" width="94.2029" height="144.928" transform="rotate(-180 220.29 500)" fill="white"/>
    </svg>
  </div>
</template>