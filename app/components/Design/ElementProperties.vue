<script lang="ts" setup>
import { ChevronDown, Plus } from 'lucide-vue-next';
</script>

<template>
  <div class="element-properties-wrapper">
    <div class="account-share-header">
      <div class="profile-wrapper">
        <div class="profiles">
          <div class="profile">M</div>
        </div>
        <button class="profile-icon">
          <ChevronDown
            :size="16"
            :stroke-width="1"
            :color="'#FFFFFF'"
          />
        </button>
      </div>
      <button class="share-button">
        <span>Share</span>
      </button>
    </div>
    <div class="element-type-wrapper">
      <span class="element-text">Frame</span>
    </div>
    <div class="export-wrapper">
      <span class="export-text">Export</span>
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
          font-weight: 600;
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
    }
  }
  .element-type-wrapper {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(240,240,240,0.2);
    span {
      font-size: 16px;
    }
  }
  .export-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 15px;
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);
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