<script lang="ts" setup>
import { ChevronDown, Plus } from 'lucide-vue-next';
import { useActionStateStore } from '../../stores/actionstates';
import { ActionState } from '../../shared/types/ActionState';
import { useSession } from '../../lib/auth-client';
import { useGlobalStore } from '../../stores/global';
import { computed, onMounted, onUnmounted } from 'vue';
import { useQuery, useMutation } from 'convex-vue';
import { api } from '../../../convex/_generated/api';

const props = defineProps<{
  designFileId?: string;
}>();

const actionStateStore = useActionStateStore();
const globalStore = useGlobalStore();
const { data: session } = useSession();

// Get user initial from session
const userInitial = computed(() => {
  if (session.value?.user?.name) {
    return session.value.user.name.charAt(0).toUpperCase();
  }
  if (session.value?.user?.email) {
    return session.value.user.email.charAt(0).toUpperCase();
  }
  return 'U';
});

// Get active collaborators
const activeCollaborators = useQuery(
  api.designFiles.getActiveCollaborators,
  props.designFileId ? { designFileId: props.designFileId as any } : 'skip'
);

const markActive = useMutation(api.designFiles.markCollaboratorActive);

// Mark user as active periodically
let activeInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  if (props.designFileId && session.value?.user?.email) {
    // Mark active immediately
    markActive({
      designFileId: props.designFileId as any,
      email: session.value.user.email,
      name: session.value.user.name || session.value.user.email,
    });

    // Mark active every 15 seconds
    activeInterval = setInterval(() => {
      if (session.value?.user?.email) {
        markActive({
          designFileId: props.designFileId as any,
          email: session.value.user.email,
          name: session.value.user.name || session.value.user.email,
        });
      }
    }, 15000);
  }
});

onUnmounted(() => {
  if (activeInterval) {
    clearInterval(activeInterval);
  }
});

// Generate color for avatar based on email
const getAvatarColor = (email: string) => {
  const colors = ['#FF7237', '#0D99FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Filter out current user from active collaborators
const otherCollaborators = computed(() => {
  if (!activeCollaborators.value || !session.value?.user?.email) return [];
  return activeCollaborators.value.filter(c => c.email !== session.value.user.email);
});

// There will be another order magnitude emit here to go to the parent [id].vue
const emit = defineEmits<{
  (e: 'draw-frameRectangle', width: number, height: number): void,
  (e: 'editProperties', coordX: number, coordY: number, sizeWidth: number, sizeHeight: number): void,
}>();

const _drawFrameRectangle = (width: number, height: number) => {
  emit('draw-frameRectangle', width, height);
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number) => {
  emit('editProperties', coordX, coordY, sizeWidth, sizeHeight)
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
          <!-- Current user profile -->
          <div
            class="profile geist-medium"
            :style="{ background: getAvatarColor(session?.user?.email || 'default') }"
            :title="session?.user?.name || session?.user?.email"
          >
            {{ userInitial }}
          </div>
          <!-- Active collaborators -->
          <div
            v-for="(collaborator, index) in otherCollaborators.slice(0, 3)"
            :key="collaborator.email"
            class="profile geist-medium"
            :style="{
              background: getAvatarColor(collaborator.email),
              marginLeft: '-15px',
              zIndex: 10 - index
            }"
            :title="collaborator.name"
          >
            {{ collaborator.name.charAt(0).toUpperCase() }}
          </div>
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
        .profile {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: normal;
          font-size: 16px;
          color: #FFFFFF;
          border: 2px solid #2C2C2C;
          position: relative;
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