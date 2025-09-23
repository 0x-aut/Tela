<script lang="ts" setup>
import { MousePointer2, Frame, Square, ChevronDown, Type, MessageCircle, Sparkles } from 'lucide-vue-next';
</script>

<template>
  <div class="actions-menu-wrapper">
    <button title="Pointer" class="action-icon-container">
      <MousePointer2
        :size="20"
        :stroke-width="1"
      />
    </button>
    <button title="Frame" class="action-icon-container">
      <Frame
        :size="20"
        :stroke-width="1"
      />
    </button>
    <div class="action-icon-frame">
      <button title="Rectangle" class="action-icon-container">
        <Square
          :size="20"
          :stroke-width="1"
        />
      </button>
      <button title="more" class="more-icon-container">
        <ChevronDown 
          :size="18"
          :stroke-width="1"
        />
      </button>
    </div>
    <button title="Type" class="action-icon-container">
      <Type
        :size="20"
        :stroke-width="1"
      />
    </button>
    <button title="Type" class="action-icon-container">
      <MessageCircle
        :size="20"
        :stroke-width="1"
      />
    </button>
    <button title="Type" class="action-icon-container">
      <Sparkles
        :size="20"
        :stroke-width="1"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
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
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>