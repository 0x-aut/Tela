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
      :stroke-width="2.5"
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

.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Apply the animation to an element */
.load-icon {
animation: rotate 1s linear infinite;
}
</style>