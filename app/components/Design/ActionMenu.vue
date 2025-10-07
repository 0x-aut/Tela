<script lang="ts" setup>
import { MousePointer2, Frame, Square, ChevronDown, Type, MessageCircle, Sparkles, Circle, Triangle, Minus } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import { ActionState } from '../../shared/types/ActionState';
import { useActionStateStore } from '../../stores/actionstates';
import { useGlobalStore } from '../../stores/global';


const globalStore = useGlobalStore();
const actionStateStore = useActionStateStore();
const isShapeDropdownOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);
const AITextbox = ref<HTMLDivElement| null>(null);

const textBox = () => {
  globalStore.changeAITextBoxStatus();
  if (globalStore.textbox_status) {
    if (!AITextBox.value) {
      throw new Error("Textbox for AI not found")
      return
    }
    AITextbox.value.style.transition = "0.2s ease";
    // AITextbox.value.style.transition = "0.2s ease";
  }
}

// const activeButton = computed((actionstate: ActionState) => ({
//   active: actionStateStore.action_state === actionstate
// }))

const _drawFrame = () => {
  actionStateStore.changeActionState(ActionState.FRAME);
}
const _Action = () => {
  actionStateStore.changeActionState(ActionState.POINTER);
}

// Do I add param to the function?? No
const _drawShape = (shapeType: string = 'rectangle') => {
  actionStateStore.selectedShape = shapeType; // Store in actionStateStore
  actionStateStore.changeActionState(ActionState.DRAWSHAPE);
  isShapeDropdownOpen.value = false;
}

const toggleShapeDropdown = () => {
  isShapeDropdownOpen.value = !isShapeDropdownOpen.value;
}

const _text = () => {
  actionStateStore.changeActionState(ActionState.TEXT)
}

const _comment = () => {
  actionStateStore.changeActionState(ActionState.COMMENT)
}

const _aiEdit = () => {
  actionStateStore.changeActionState(ActionState.AIEDIT)
}

// Close dropdown when clicking outside
const handleOutsideClick = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isShapeDropdownOpen.value = false;
  }
};

// Add and remove outside click listener
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

</script>

<template>
  <div class="tot-action-wrapper">
    <div class="ai-wrapper" ref="AITextbox">
      <DesignTelaAITextBox />
    </div>
    <div class="actions-menu-wrapper">
      <button title="Pointer"
        class="action-icon-container"
        :class="{ 'active': (ActionState.POINTER === actionStateStore.action_state), 'inactive': (ActionState.POINTER !== actionStateStore.action_state) }"
        @click="_Action"
      >
        <MousePointer2
          :size="20"
          :stroke-width="1"
        />
      </button>
      <button 
        title="Frame"
        class="action-icon-container"
        :class="{ 'active': (ActionState.FRAME === actionStateStore.action_state), 'inactive': (ActionState.FRAME !== actionStateStore.action_state) }"
        @click="_drawFrame"
      >
        <Frame
          :size="20"
          :stroke-width="1"
        />
      </button>
      <div class="action-icon-frame" ref="dropdownRef">
        <button
          :title="actionStateStore.selectedShape === 'rectangle' ? 'Rectangle' : actionStateStore.selectedShape === 'circle' ? 'Circle' : actionStateStore.selectedShape === 'triangle' ? 'Triangle' : 'Line'"
          :class="{ 'active': (ActionState.DRAWSHAPE === actionStateStore.action_state), 'inactive': (ActionState.DRAWSHAPE !== actionStateStore.action_state) }"
          class="action-icon-container"
          @click="_drawShape(actionStateStore.selectedShape)"
        >
          <Square v-if="actionStateStore.selectedShape === 'rectangle'" :size="20" :stroke-width="1" />
          <Circle v-else-if="actionStateStore.selectedShape === 'circle'" :size="20" :stroke-width="1" />
          <Triangle v-else-if="actionStateStore.selectedShape === 'triangle'" :size="20" :stroke-width="1" />
          <!-- <Minus v-else-if="actionStateStore.selectedShape === 'line'" :size="20" :stroke-width="1" /> -->
        </button>
        <button title="More shapes" class="more-icon-container" @click="toggleShapeDropdown">
          <ChevronDown
            :size="18"
            :stroke-width="1"
          />
        </button>
        <div v-if="isShapeDropdownOpen" class="shape-dropdown-menu">
          <div class="shape-dropdown-item" @click="_drawShape('rectangle')">
            <Square :size="13" :stroke-width="1" absoluteStrokeWidth />
            <span class="geist-regular">Rectangle</span>
          </div>
          <div class="shape-dropdown-item" @click="_drawShape('circle')">
            <Circle :size="13" :stroke-width="1" absoluteStrokeWidth />
            <span class="geist-regular">Circle</span>
          </div>
          <div class="shape-dropdown-item" @click="_drawShape('triangle')">
            <Triangle :size="13" :stroke-width="1" absoluteStrokeWidth />
            <span class="geist-regular">Triangle</span>
          </div>
          <!-- <div class="shape-dropdown-item" @click="_drawShape('line')">
            <Minus :size="13" :stroke-width="1" absoluteStrokeWidth />
            <span class="geist-regular">Line</span>
          </div> -->
        </div>
      </div>
      <button
        title="Text"
        :class="{ 'active': (ActionState.TEXT === actionStateStore.action_state), 'inactive': (ActionState.TEXT !== actionStateStore.action_state) }"
        class="action-icon-container"
        @click="_text"
      >
        <Type
          :size="20"
          :stroke-width="1"
        />
      </button>
      <button 
        title="Comment"
        :class="{ 'active': (ActionState.COMMENT === actionStateStore.action_state), 'inactive': (ActionState.COMMENT !== actionStateStore.action_state) }" 
        class="action-icon-container"
        @click="_comment"
      >
        <MessageCircle
          :size="20"
          :stroke-width="1"
        />
      </button>
      <button
        title="Edit with AI"
        :class="{ 'active': (ActionState.AIEDIT === actionStateStore.action_state), 'inactive': (ActionState.AIEDIT !== actionStateStore.action_state) }"
        class="action-icon-container"
        @click="_aiEdit"
      >
        <Sparkles
          :size="20"
          :stroke-width="1"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tot-action-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 7.5px;
  .ai-wrapper {
    display: flex;
    animation: Up 0.9s ease-out;
  }
}
@keyframes Up{
  0% {
    opacity: 0;
    transform: translateY(70px);
  }
  55% {
    opacity: 0.3;
    transform: translateY(0px);
  }
  100% {
    opacity: 1;
  }
}
.inactive {
  background-color: transparent;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.active {
  background: #0D99FF;
}
.actions-menu-wrapper {
  display: flex;
  border: 1px solid rgba(240,240,240,0.2);
  color: #FFFFFF;
  background: #2C2C2C;
  border-radius: 15px;
  // position: fixed;
  // bottom: 20px;
  // left: 50%;
  // transform: translateX(-50%);
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
  filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.5));
  height: 54px;
  padding: 0 10px;
  align-items: center;
  column-gap: 10px;

  .action-icon-frame {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 0px;
    .more-icon-container {
      all: unset;
      height: 36px;
      border: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .shape-dropdown-menu {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      min-width: 140px;
      background: #2c2c2c;
      border-radius: 8px;
      border: 1px solid rgba(240, 240, 240, 0.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      overflow: hidden;
      animation: fadeIn 0.2s ease;

      .shape-dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        color: #ffffff;
        font-size: 13px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background: #4a4a4a;
        }

        svg {
          color: #ffffff;
        }
      }
    }
  }

  .action-icon-container {
    border: 0;
    outline: 0;
    color: #FFFFFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;   
  }
}
</style>