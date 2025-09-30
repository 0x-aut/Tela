<script lang="ts" setup>
import { Shape } from '../../Shared/types/ShapeTypes/Shape';
import { useGlobalStore } from '../../stores/global';
import { useActionStateStore } from '../../stores/actionstates';
import { useShapeStore } from '../../stores/shapeStore';
import { ref } from 'vue';
import { MoveHorizontal, MoveVertical } from 'lucide-vue-next';


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
    <div class="position-area areadiv">
      <span class="geist-regular areadiv-header">Position</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <label for="x">
          <span class="geist-regular">X</span>
          </label>
          <input class="geist-medium" placeholder="300" type="text" v-model="_coordX" />
        </div>
        <div class="coords-input-wrapper">
          <label for="x">
          <span class="geist-medium">Y</span>
          </label>
          <input placeholder="300" type="text" v-model="_coordX" />
        </div>
      </div>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <label for="resize">
          <span class="geist-regular">X</span>
          </label>
          <input class="geist-regular" placeholder="90deg" type="text" v-model="_coordX" />
        </div>
      </div>
    </div>
    <!-- A lot of things confusing here but i'll allow it -->
     <div class="position-area areadiv">
      <span class="geist-regular areadiv-header">Size</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <MoveVertical
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="input-icon"
          />
          <input class="geist-medium" placeholder="300" type="text" v-model="_coordX" />
        </div>
        <div class="coords-input-wrapper">
          <MoveHorizontal
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="input-icon"
          />
          <input placeholder="300" type="text" v-model="_coordX" />
        </div>
      </div>
      <div class="coords-wrapper">
        <button class="area-button-long">
          <span class="geist-regular">Connect both size parts</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shape-edit-wrapper {
  display: flex;
  flex-direction: column;
  // border: 1px solid blue;
  .areadiv {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 10px 0px 10px 0px;
    // border-top: 1px solid rgba(240, 240, 240, 0.2);
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);
    .areadiv-header {
      padding-left: 15px;
      font-size: 13px;
    }
  }
  .position-area {
    // border: 1px solid blue;
    .coords-wrapper {
      width: stretch;
      // border: 1px solid white;
      overflow: hidden;
      padding: 0px 15px;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      column-gap: 7.5px;
      .area-button-long {
        all: unset;
        // border: 1px solid white;
        width: 167.5px;
        padding: 5px 10px;
        background: rgba(240, 240, 240, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s ease-out;
        span {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
        &:active {
          background: rgba(240, 240, 240, 0.3)
          span {
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }
      .coords-input-wrapper {
        width: 80px;
        display: flex;
        align-items: center;
        overflow-x: hidden;
        background: rgba(240, 240, 240, 0.2);
        border-radius: 5px;
        padding: 2.5px 5px;
        column-gap: 5px;
        transition: 0.2s ease-out;
        &:focus {
          background: rgba(240, 240, 240, 0.7);
        }
        .input-icon {
          color: rgba(255, 255, 255, 0.7);
        }
        label {
          display: flex;
          span {
            font-size: 12px;
            color: #FFFFFF;
            opacity: 0.7;
          }
        }
        input {
          all: unset;
          // border: 1px solid white;
          display: flex;
          align-items: center;
          height: stretch;
          width: 100%;
          // margin-top: -1px;
          margin-bottom: 1px;
          border-radius: 0px inherit 0px inherit; 
          font-size: 13px;
          font-family: "geist-regular";
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.2s ease-out;
          &:focus {
            color: #FFFFFF;
          }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.7)
        }
      }
    }
  }
}
</style>