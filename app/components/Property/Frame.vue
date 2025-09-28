<script lang="ts" setup>
import { Frames } from '../../shared/types/Frames';

const frames = Frames;

const emit = defineEmits<{
  (e: 'draw-frame-rectangle', width: number, height: number): void
}>();

const _drawFrameRectangle = (width: number, height: number) => {
  emit('draw-frame-rectangle', width, height);
}


</script>

<template>
  <div class="frame-property-wrapper">
    <div v-for="(value, key) in frames" :key="key" class="frames-wrapper">
      <span class="geist-medium key-text">{{ key }}</span>
      <div v-for="(frame_num, frame_type) in value" :key="frame_type" class="frames-type">
        <button class="frame-option" @click="_drawFrameRectangle(frame_num[0], frame_num[1])">
          <span class="geist-regular">{{ frame_type }}</span>
          <span class="geist-regular">{{ frame_num[0] }}x{{ frame_num[1] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.frame-property-wrapper {
  display: flex;
  flex-direction: column;
  width: stretch;
  row-gap: 15px;
  .frames-wrapper {
    display: flex;
    flex-direction: column;
    .key-text {
      color: #FFFFFF;
      font-size: 12px;
      margin-bottom: 10px;
    }
    div {
      display: flex;
      flex-direction: column;
      row-gap: 0;
      button {
        all: unset;
        display: flex;
        width: stretch;
        align-items: center;
        border-radius: 7.5px;
        justify-content: space-between;
        padding: 5px 10px;
        color: white;
        transition: 0.2s ease-out;
        cursor: pointer;
        span {
          font-size: 13px;
          opacity: 0.7;
          display: flex;
          align-items: center;
          transition: 0.4s ease-out;
        }
        &:hover {
          background: rgba(240, 240, 240, 0.1);
          span {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>