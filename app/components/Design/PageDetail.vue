<script lang="ts" setup>
import { PanelRight, ChevronRight, Plus, Square } from 'lucide-vue-next';
import { useShapeStore } from '../../stores/shapeStore';
import { useActionStateStore } from '../../stores/actionstates';
import { ActionState } from '../../shared/types/ActionState';


const shapeStore = useShapeStore();
const actionStore = useActionStateStore();

const openShapeProperties = (shape_id: string) => {
  actionStore.changeActionState(ActionState.DRAWSHAPE);
}


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
        <button 
          class="shape-view"
          @click="openShapeProperties(id)"
        >
          <Square 
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="shape-icon"
          />
          <span class="geist-medium">{{ id }}</span>
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
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
  }
  .shapes-list {
    display: flex;
    .shape-view {
      all: unset;
      column-gap: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      width: stretch;
      border-radius: 7.5px;
      padding: 5px 10px;
      transition: all 0.2s ease-out;
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
      &:hover {
        background: rgba(240, 240, 240, 0.1);
        span {
          opacity: 1;
        }
        .shape-icon {
          opacity: 1;
        }
      }
    }
  }
}
</style>