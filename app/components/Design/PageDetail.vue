<script lang="ts" setup>
import { PanelRight, ChevronRight, Plus } from 'lucide-vue-next';
</script>


<template>
  <div class="page-detail-wrapper">
    <div class="header-wrapper">
      <div class="logo-title">
        <div class="logo"></div>
        <div class="design-title">First design</div>
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
        <span>Pages</span>
      </button>
      <button class="action-icon">
        <Plus
          :size="20"
          :stroke-width="1"
          :color="'#FFFFFF'"
        />
      </button>
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
        font-size: 16px;
        font-weight: 500;
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
}
</style>