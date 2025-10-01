<script lang="ts" setup>
import { PanelRight, ChevronRight, Plus, Square, Trash } from 'lucide-vue-next';
import { computed } from 'vue';
import { useShapeStore } from '../../stores/shapeStore';
import { useActionStateStore } from '../../stores/actionstates';
import { ActionState } from '../../shared/types/ActionState';

const emit = defineEmits<{
  (e: 'deleteShape', id: string): void
}>();

const shapeStore = useShapeStore();
const actionStore = useActionStateStore();

const props = defineProps<{
  zoom?: number
}>();

const openShapeProperties = (shape_id: string) => {
  actionStore.changeActionState(ActionState.SHAPE);
  shapeStore.selectShape(shape_id);
}

// We need to pass this as an emit since we need the render function basically
const deleteShape = (id: string) => {
  emit('deleteShape', id)
}

const zoomPercentage = computed(() => {
  return Math.round((props.zoom || 1) * 100);
});

</script>


<template>
  <div class="page-detail-wrapper">
    <div class="header-wrapper">
      <div class="logo-title">
        <div class="logo"></div>
        <input class="design-title geist-medium" placeholder="First design" />
      </div>
      <button class="action-icon">
        <PanelRight
          :stroke-width="1.5"
          :size="20"
          :color="'#FFFFFF'"
        />
      </button>
    </div>
    <div class="pages-wrapper">
      <button class="pages-ec-wrapper">
        <ChevronRight
          :size="16"
          :stroke-width="1"
          :color="'#F0F0F0'"
        />
        <span class="geist-regular">Pages</span>
      </button>
      <button class="action-icon">
        <Plus
          :size="20"
          :stroke-width="1"
          :color="'#FFFFFF'"
        />
      </button>
    </div>
    <!-- There is no nesting feature for now -->
    <div class="shapes">
      <div class="shapes-list" v-for="(shape, id) in shapeStore.shapes" :key="id">
        <div
          :class="[{ 'active': (shapeStore.select_shape === id), 'not-active': (shapeStore.select_shape !== id) }, 'shape-view']"
        >
          <button
            class="shape-it"
            @click="openShapeProperties(id)">
            <Square
              :size="13"
              :stroke-width="1"
              absoluteStrokeWidth
              class="shape-icon"
            />
            <span class="geist-medium">{{ id }}</span>
          </button>
          <button
            class="delete-button"
            @click="deleteShape(id)"
          >
            <Trash
              :size="13"
              :stroke-width="1"
              absoluteStrokeWidth
              class="delete-icon"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="zoom-controls">
      <div class="zoom-header">
        <span class="zoom-label geist-regular">Zoom</span>
        <span class="zoom-value geist-medium">{{ zoomPercentage }}%</span>
      </div>
      <div class="zoom-instruction geist-regular">
        Scroll to zoom • Shift+drag to pan
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.active {
  background: rgba(13, 153, 255, 0.8);
  .shape-it {
    span {
      opacity: 1;
      color: #FFFFFF;
    }
    .shape-icon {
      color: rgba(255, 255, 255, 1);
      opacity: 1
    }
  }
}
.inactive {
  background-color: transparent;
  &:hover {
    background: rgba(240, 240, 240, 0.1);
    .shape-it {
      span {
        opacity: 1;
      }
      .shape-icon {
        opacity: 1;
      }
    }
  }
}

.action-icon {
  all:unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
.page-detail-wrapper {
  border: 1px solid rgba(240,240,240,0.2);
  color: #FFFFFF;
  background: #2C2C2C;
  border-radius: 15px;
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
  filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.5));
  width: 250px;
  // height: fit-content;
  height: calc(100vh - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  .header-wrapper {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(240,240,240,0.2);
    .logo-title {
      display: flex;
      align-items: center;
      gap: 10px;
      .logo {
        width: 32px;
        height: 32px;
        background: #505050;
        border-radius: 4px;
      }
      .design-title {
        all: unset;
        width: 150px;
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        font-family: 'geist-medium';
      }
      .design-title::placeholder {
        font-family: 'geist-medium';
        color: #FFFFFF;
      }
    }
  }
  .pages-wrapper {
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(240,240,240,0.2);
    .pages-ec-wrapper {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      column-gap: 5px;
      font-size: 14px;
      color: #F0F0F0;
      // &:hover {
      //   text-decoration: underline;
      // }
    }
  }
  .shapes {
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    margin-top: 10px;
    flex: 1;
    overflow-y: auto;
  }
  .shapes-list {
    display: flex;
    .shape-view {
      justify-content: space-between;
      cursor: pointer;
      display: flex;
      align-items: center;
      width: stretch;
      border-radius: 7.5px;
      padding: 5px 10px;
      transition: all 0.2s ease-out;
      .shape-it {
        color: #FFFFFF;
        border: 0;
        outline: 0;
        background:transparent;
        width: stretch;
        display: flex;
        align-items: center;
        column-gap: 10px;
        transition: background-color 0.2s ease-in-out;
        .shape-icon {
          color: #FFFFFF;
          opacity: 0.7;
        }
        span {
          font-size: 13px;
          opacity: 0.7;
          display: flex;
          align-items: center;
          transition: 0.4s ease-out;
        }
      }
      .delete-button {
        border: 0;
        outline: 0;
        padding: 2.5px 5px;
        border-radius: 2.5px;
        background: transparent;
        cursor: pointer;
        color: rgba(240, 240, 240, 0.6);
        transition: 0.2s ease-in;
        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .zoom-controls {
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: auto;
    border-top: 1px solid rgba(240,240,240,0.2);
    .zoom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .zoom-label {
        font-size: 13px;
        color: rgba(240, 240, 240, 0.7);
      }
      .zoom-value {
        font-size: 13px;
        color: #FFFFFF;
      }
    }
    .zoom-instruction {
      font-size: 11px;
      color: rgba(240, 240, 240, 0.5);
      text-align: center;
    }
  }
}
</style>