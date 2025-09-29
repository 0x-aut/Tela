<script lang="ts" setup>
import { ArrowUp } from 'lucide-vue-next';
</script>

<template>
  <div class="textbox-wrapper">
    <div class="textbox-wrapper">
      <textarea autofocus="true" rows="1" columns="1" placeholder="Edit your component with TelaAI"></textarea>
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
  align-items: center;
  width: stretch;
  // border: 1px solid blue;
  .textbox-wrapper {
    width: stretch;
    display: flex;
    align-items: end;
    padding: 2.5px 2.5px 2.5px 0px;
    background: #2c2c2c;
    border-radius: 30px;
    overflow: hidden;
    border: 1px solid rgba(240,240,240,0.2);
    box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
    textarea {
      all: unset;
      color: #FFFFFF;
      border-radius: inherit;
      background: #2c2c2c;
      padding: 5px 10px;
      // border: 1px solid white;
      min-height: 25px;
      width: stretch; 
      resize: none;
      flex: 1;
    }
    button {
      flex: 0.05;
      all: unset;
      cursor: pointer;
      border-radius: 50%;
      background: #FFFFFF;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// @keyframes UpAndLong {
//   0% {
//     transform: translateY(-40px);
//   }
// }
</style>