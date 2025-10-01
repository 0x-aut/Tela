<script lang="ts" setup>
import { useGlobalStore } from '../../stores/global';
import { Trash } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const globalStore = useGlobalStore();
const shareWrapper = ref<HTMLDivElement | null>(null);
/*
Too pressed for time to implement dynamic v-modelng so we will have 3 collabs
*/

var first_access = ref("");
var second_access = ref("");
var third_access = ref("");


const handleOutsideClick = (event: MouseEvent) => {
  if (shareWrapper.value && !shareWrapper.value.contains(event.target as Node)) {
    globalStore.changeShareOpen({ state: false });
  }
};

onMounted(() => {
  // Use setTimeout to ensure the click event that opened the modal doesn't immediately close it
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 0);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

</script>

<template>
  <div class="share-wrapper" ref="shareWrapper" @click.stop>
    <section class="share-link-header">
      <span class="geist-regular header">Invite collaborators</span>
      <button class="copy-link-button">
        <span class="geist-regular">Copy link to view</span>
      </button>
    </section>
    <section class="collaborators-list-wrapper">
      <div class="collaborator">
        <input 
          type="email" 
          placeholder="Collaborator Email"
          class="geist-regular"
        />
        <ReusablesDropdown
          v-model="first_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button class="send-invite-button">
          <span class="geist-medium">Send invite</span>
        </button>
        <!-- <button class="remove-collaborator-button">
          <Trash
            :size="16"
            :stroke-width="1"
            absoluteStrokeWidth
            class="remove-icon"
          />
        </button> -->
      </div>
      <div class="collaborator">
        <input 
          type="email" 
          placeholder="Collaborator Email"
          class="geist-regular"
        />
        <ReusablesDropdown
          v-model="second_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button class="send-invite-button">
          <span class="geist-medium">Send invite</span>
        </button>
        <!-- <button class="remove-collaborator-button">
          <Trash
            :size="16"
            :stroke-width="1"
            absoluteStrokeWidth
            class="remove-icon"
          />
        </button> -->
      </div>
      <div class="collaborator">
        <input 
          type="email" 
          placeholder="Collaborator Email"
          class="geist-regular"
        />
        <ReusablesDropdown
          v-model="third_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button class="send-invite-button">
          <span class="geist-medium">Send invite</span>
        </button>
        <!-- <button class="remove-collaborator-button">
          <Trash
            :size="16"
            :stroke-width="1"
            absoluteStrokeWidth
            class="remove-icon"
          />
        </button> -->
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.share-wrapper {
  background: #2c2c2c;
  border: 1px solid rgba(240,240,240,0.2);
  border-radius: 15px;
  box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  transition: height 0.3s ease;
  .share-link-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);
    padding: 10px;
    button {
      all: unset;
      cursor: pointer;
      width: fit-content;
      padding: 5px 10px;
      border-radius: 5px;
      background: #FFFFFF;
      box-shadow: inset 1px 1px 2px 0.5px rgba(0, 0, 0, 0.3);
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 13px;
      }
    }
    .header {
      font-size: 15px;
    }
  }
  .collaborators-list-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 10px;
    transition: height 0.2s ease;
    .collaborator {
      display: flex;
      align-items: center;
      column-gap: 10px;
      input {
        all: unset;
        border: 1px solid rgba(240, 240, 240, 0.2);
        padding: 2.5px 5px;
        border-radius: 5px;
        height: 24px;
        font-size: 13px;
        font-family: 'geist-regular';
        width: 175px;
      }
      .send-invite-button {
        all: unset;
        background: #0D99FF;
        border-radius: 5px;
        padding: 5px 10px;
        height: 19px;
        display: flex;
        align-content: center;
        justify-content: center;
        color: #FFFFFF;
        cursor: pointer;
        span {
          font-size: 13px;
        }
      }
      .remove-collaborator-button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 20px;
        width: 20px;
        padding: 5px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        transition: 0.2s ease-out;
        cursor: pointer;
        .remove-icon {
          color: #FFFFFF;
          opacity: 0.5;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          .remove-icon {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>