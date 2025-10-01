<script lang="ts" setup>
import { useGlobalStore } from '../../stores/global';
import { Trash } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import { useMutation } from 'convex-vue';
import { api } from '../../../convex/_generated/api';

const props = defineProps<{
  designFileId: string;
  shareLink: string;
}>();

const globalStore = useGlobalStore();
const shareWrapper = ref<HTMLDivElement | null>(null);

// Collaborator emails and access levels
var first_email = ref("");
var second_email = ref("");
var third_email = ref("");

var first_access = ref("edit");
var second_access = ref("edit");
var third_access = ref("edit");

// Button states
var first_button_disabled = ref(false);
var second_button_disabled = ref(false);
var third_button_disabled = ref(false);

// Loading states
var first_loading = ref(false);
var second_loading = ref(false);
var third_loading = ref(false);

const addCollaborator = useMutation(api.designFiles.addCollaborator);

const sendInvite = async (email: string, buttonIndex: number) => {
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }

  // Set loading state
  if (buttonIndex === 1) first_loading.value = true;
  else if (buttonIndex === 2) second_loading.value = true;
  else if (buttonIndex === 3) third_loading.value = true;

  try {
    // Add collaborator to Convex
    await addCollaborator({
      designFileId: props.designFileId as any,
      email: email,
      name: email.split('@')[0], // Use email prefix as name
    });

    // Send email via Resend
    const response = await $fetch('/api/invite/send', {
      method: 'POST',
      body: {
        email: email,
        shareLink: props.shareLink,
      },
    });

    // Disable button after successful send
    if (buttonIndex === 1) first_button_disabled.value = true;
    else if (buttonIndex === 2) second_button_disabled.value = true;
    else if (buttonIndex === 3) third_button_disabled.value = true;

    alert('Invite sent successfully!');
  } catch (error: any) {
    alert(error.message || 'Failed to send invite');
  } finally {
    // Clear loading state
    if (buttonIndex === 1) first_loading.value = false;
    else if (buttonIndex === 2) second_loading.value = false;
    else if (buttonIndex === 3) third_loading.value = false;
  }
};

// Watch for email changes to re-enable buttons
const handleEmailChange = (buttonIndex: number) => {
  if (buttonIndex === 1) first_button_disabled.value = false;
  else if (buttonIndex === 2) second_button_disabled.value = false;
  else if (buttonIndex === 3) third_button_disabled.value = false;
};

const copyLink = async () => {
  const link = `https://tela-delta.vercel.app/design/${props.shareLink}`;
  try {
    await navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  } catch (error) {
    alert('Failed to copy link');
  }
};

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
      <button class="copy-link-button" @click="copyLink">
        <span class="geist-regular">Copy link to view</span>
      </button>
    </section>
    <section class="collaborators-list-wrapper">
      <div class="collaborator">
        <input
          v-model="first_email"
          type="email"
          placeholder="Collaborator Email"
          class="geist-regular"
          @input="handleEmailChange(1)"
        />
        <ReusablesDropdown
          v-model="first_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button
          class="send-invite-button"
          :class="{ disabled: first_button_disabled || first_loading }"
          :disabled="first_button_disabled || first_loading"
          @click="sendInvite(first_email, 1)"
        >
          <span class="geist-medium">{{ first_loading ? 'Sending...' : 'Send invite' }}</span>
        </button>
      </div>
      <div class="collaborator">
        <input
          v-model="second_email"
          type="email"
          placeholder="Collaborator Email"
          class="geist-regular"
          @input="handleEmailChange(2)"
        />
        <ReusablesDropdown
          v-model="second_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button
          class="send-invite-button"
          :class="{ disabled: second_button_disabled || second_loading }"
          :disabled="second_button_disabled || second_loading"
          @click="sendInvite(second_email, 2)"
        >
          <span class="geist-medium">{{ second_loading ? 'Sending...' : 'Send invite' }}</span>
        </button>
      </div>
      <div class="collaborator">
        <input
          v-model="third_email"
          type="email"
          placeholder="Collaborator Email"
          class="geist-regular"
          @input="handleEmailChange(3)"
        />
        <ReusablesDropdown
          v-model="third_access"
          :options="[{ value: 'edit', label: 'Edit' }, { value: 'view', label: 'View' }]"
        />
        <button
          class="send-invite-button"
          :class="{ disabled: third_button_disabled || third_loading }"
          :disabled="third_button_disabled || third_loading"
          @click="sendInvite(third_email, 3)"
        >
          <span class="geist-medium">{{ third_loading ? 'Sending...' : 'Send invite' }}</span>
        </button>
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
        transition: all 0.2s ease;
        span {
          font-size: 13px;
        }
        &.disabled {
          background: #666666;
          cursor: not-allowed;
          opacity: 0.5;
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