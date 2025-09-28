<script lang="ts" setup>
import { LoaderCircle } from 'lucide-vue-next';

const props = defineProps({
  size: {
    type: Number,
    default: 24
  }
})

</script>


<template>
  <div class="loader-wrapper">
    <LoaderCircle
      :size="props.size"
      :color="'#000000'"
      :stroke-width="1"
      absoluteStrokeWidth
      class="load-icon"
    />
  </div>
</template>


<style lang="scss" scoped>
/* Define the keyframes for the rotation */
@keyframes rotate {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}

/* Apply the animation to an element */
.load-icon {
animation: rotate 2s linear infinite;
}
</style>