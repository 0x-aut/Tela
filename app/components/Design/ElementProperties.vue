<script lang="ts" setup>
import { ChevronDown, Plus } from 'lucide-vue-next';
import { useActionStateStore } from '../../stores/actionstates';
import { ActionState } from '../../shared/types/ActionState';
import { useSession } from '../../lib/auth-client';
import { useGlobalStore } from '../../stores/global';


const actionStateStore = useActionStateStore();
const globalStore = useGlobalStore();

// There will be another order magnitude emit here to go to the parent [id].vue
const emit = defineEmits<{
  (e: 'draw-frameRectangle', width: number, height: number): void,
  (e: 'editProperties', coordX: number, coordY: number, sizeWidth: number, sizeHeight: number): void,
  (e: 'editTextProperties', data: {
    coordX: number,
    coordY: number,
    width: number,
    height: number,
    alignTop: boolean,
    alignBottom: boolean,
    alignCenter: boolean,
    justifyLeft: boolean,
    justifyRight: boolean,
    justifyCenter: boolean,
    opacity: number,
    fontFamily: string,
    fontSize: number,
    fontColor: string
  }): void,
}>();

const _drawFrameRectangle = (width: number, height: number) => {
  emit('draw-frameRectangle', width, height);
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number) => {
  emit('editProperties', coordX, coordY, sizeWidth, sizeHeight)
}

const editTextProperties = (data: {
  coordX: number,
  coordY: number,
  width: number,
  height: number,
  alignTop: boolean,
  alignBottom: boolean,
  alignCenter: boolean,
  justifyLeft: boolean,
  justifyRight: boolean,
  justifyCenter: boolean,
  opacity: number,
  fontFamily: string,
  fontSize: number,
  fontColor: string
}) => {
  emit('editTextProperties', data)
}

const openShare = () => {
  // Open the share toast
  globalStore.changeShareOpen({ state: true });
  console.log(globalStore.shared_state)
}

</script>

<template>
  <div class="element-properties-wrapper">
    <div class="account-share-header">
      <div class="profile-wrapper">
        <div class="profiles">
          <div class="profile geist-medium">M</div>
        </div>
        <button class="profile-icon">
          <ChevronDown
            :size="16"
            :stroke-width="1"
            :color="'#FFFFFF'"
          />
        </button>
      </div>
      <button class="share-button" @click="openShare">
        <span class="geist-medium">Share</span>
      </button>
    </div>
    <div class="element-type-wrapper">
      <span class="element-text geist-regular">{{ actionStateStore.action_state }}</span>
    </div>
    <!-- In retrospect, it will be a component that changes so we can have the buttons work without doing too much -->
    <div class="frame-wrapper wrapper-animation" v-if="actionStateStore.action_state == ActionState.FRAME">
      <span class="geist-regular">Frames</span>
      <PropertyFrame
        @draw-frame-rectangle="_drawFrameRectangle"
      />
    </div>
    <div class="shape-wrapper wrapper-animation" v-if="actionStateStore.action_state == ActionState.SHAPE">
      <PropertyShape
        @editProperties="editProperties"
      />
    </div>
    <div class="text-wrapper wrapper-animation" v-if="actionStateStore.action_state == ActionState.TEXT">
      <PropertyText
        @editTextProperties="editTextProperties"
      />
    </div>
    <div class="export-wrapper">
      <span class="export-text geist-regular">Export</span>
      <button class="export-button">
        <Plus
          :size="16"
          :color="'#FFFFFF'"
          :stroke-width="1"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper-animation {
  animation: fadeIn 0.1s linear;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(5px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
.element-properties-wrapper {
  border: 1px solid rgba(240,240,240,0.2);
  color: #FFFFFF;
  background: #2C2C2C;
  border-radius: 15px;
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
  filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.5));
  width: 250px;
  height: calc(100vh - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  .account-share-header {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(240,240,240,0.2);
    .profile-wrapper {
      display: flex;
      align-items: center;
      column-gap: 0px;
      .profiles {
        display: flex;
        position: relative;
        .profile:nth-child(n) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FF7237;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: normal;
          font-size: 16px;
          color: #FFFFFF;
        }
        .profile:nth-child(2) {
          margin-left: -15px;
        }
      }
      .profile-icon {
        all:unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width:10px;
        height: 32px;
        border-radius: 6px;
        padding: 0px 5px;
        transition: all 0.2s ease-in-out;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    .share-button {
      all: unset;
      background: #0D99FF;
      border-radius: 8px;
      padding: 4px 16px;
      font-size: 14px;
      height: 24px;
      cursor: pointer;
    }
  }
  .element-type-wrapper {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(240,240,240,0.2);
    span {
      font-size: 15px;
    }
  }
  .frame-wrapper {
    width: stretch;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 10px 15px;
    span {
      font-size: 13px;
    }
  }
  .shape-wrapper {
    // border: 1px solid white;
    display: flex;
    flex-direction: column;
    width: stretch;
    span {
      font-size: 13px;
    }
  }
  .text-wrapper {
    display: flex;
    flex-direction: column;
    width: stretch;
    span {
      font-size: 13px;
    }
  }
  .export-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 15px;
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);
    .export-text {
      font-size: 15px;
    }
    .export-button {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>