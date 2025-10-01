<script lang="ts" setup>
import { MousePointer2, Frame, Square, ChevronDown, Type, MessageCircle, Sparkles } from 'lucide-vue-next';
import { ActionState } from '../../shared/types/ActionState';
import { useActionStateStore } from '../../stores/actionstates';


const actionStateStore = useActionStateStore();

// const activeButton = computed((actionstate: ActionState) => ({
//   active: actionStateStore.action_state === actionstate
// }))

const _drawFrame = () => {
  actionStateStore.changeActionState(ActionState.FRAME);
}
const _Action = () => {
  actionStateStore.changeActionState(ActionState.POINTER);
}


const _drawShape = () => {
  actionStateStore.changeActionState(ActionState.DRAWSHAPE)
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

</script>

<template>
  <div class="tot-action-wrapper">
    <div class="ai-wrapper">
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
      <div class="action-icon-frame">
        <button
          title="Rectangle"
          :class="{ 'active': (ActionState.DRAWSHAPE === actionStateStore.action_state), 'inactive': (ActionState.DRAWSHAPE !== actionStateStore.action_state) }"
          class="action-icon-container"
          @click="_drawShape"
        >
          <Square
            :size="20"
            :stroke-width="1"
          />
        </button>
        <button title="More" class="more-icon-container">
          <ChevronDown 
            :size="18"
            :stroke-width="1"
          />
        </button>
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

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
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