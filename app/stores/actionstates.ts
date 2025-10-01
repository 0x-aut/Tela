import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ActionState } from '~/shared/types/ActionState';

export const useActionStateStore = defineStore(
  'actionstate',
  () => {

    const action_state = ref<ActionState>(ActionState.POINTER);
    const selectedShape = ref<string>('rectangle');

    function changeActionState(new_state: ActionState) {
      action_state.value = new_state;
    }

    return { action_state, changeActionState, selectedShape }
  },{
    persist: true
  }
)