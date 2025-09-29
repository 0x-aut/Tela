<script lang="ts" setup>
import { Shape } from '../../Shared/types/ShapeTypes/Shape';
import { useGlobalStore } from '../../stores/global';
import { useActionStateStore } from '../../stores/actionstates';
import { useShapeStore } from '../../stores/shapeStore';
import { ref } from 'vue';


const globalStore = useGlobalStore();
const actionStore = useActionStateStore();
const shapeStore = useShapeStore();

var _coordX = ref("");
var _coordY = ref("");


</script>


<template>
  <!-- This entire comp is to edit the shape according to the id of the shape gotten from the store
    This makes us able to edit the size of the shape together with the coordinates of the said shape.
  -->
  <div class="shape-edit-wrapper">
    <!-- 
    Has three things: position area (coords, rotate area)
    Size area (height, width)
    Appearance area (border-radius)
    Effect area - To be implemented later actually (border(stroke))
    -->
    <div class="position-area">
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <label for="x">
          <span class="geist-regular">X</span>
          </label>
          <input class="geist-medium" placeholder="300" type="text" v-model="_coordX" />
        </div>
        <div class="coords-input-wrapper">
          <label for="x">
          <span>Y</span>
          </label>
          <input placeholder="300" type="text" v-model="_coordX" />
        </div>
      </div>
      <div class="rotate-wrapper"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shape-edit-wrapper {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 10px 0px;
    border-top: 1px solid rgba(240, 240, 240, 0.2);
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);
  }
  .position-area {
    .coords-wrapper {
      width: stretch;
      margin: 0px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .coords-input-wrapper {
        width: 150px;
        display: flex;
        align-items: center;
        background: rgba(240, 240, 240, 0.4);
        border-radius: 7.5px;
        padding: 0px 5px;
        label {
          display: flex;
          span {
            font-size: 13px;
          }
        }
        input {
          all: unset;
          width: stretch;
          font-size: 15px;
          font-family: "geist-medium";
          overflow-x: hidden;
          color: rgba(250, 250, 250, 0.5);
          transition: color 0.2s ease-out;
          &:focus {
            color: #FFFFFF;
          }
        }
      }
    }
  }
}
</style>