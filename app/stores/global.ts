import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const cursor_position = ref('0,0');
    function change_pos(x: number, y: number) {
      cursor_position.value = `${x}, ${y}`
    }

    // const shareOpen = ref(false);
    const shared_state = ref({state: false})

    function changeShareOpen(id: {state:boolean}) {
      shared_state.value = id
    }

    const translation = ref<Array<number>>([0, 0]);
    function changeTranslation(x: number, y: number) {
      translation.value = [x, y];
      console.log("translate store changed to: ")
      console.log(translation.value[1])
    }

    function deleteTrans() {
      translation.value = [0, 0];
    }

    const camera_state = ref({
      camFieldOfView: ref(60), // In degrees
      camPosX: ref(0),
      camPosY: ref(0),
      camPosZ: ref(-200),
      near: ref(1),
      far: ref(2000)
    }) // Ref is used for individual reactivity - will fact check and see perf hits later

    const textbox_status = ref(false);
    function changeAITextBoxStatus(status: boolean | null = null) {
      if (!status) {
        textbox_status.value = !textbox_status
      }else {
        textbox_status.value = status
      }
    }
    return { 
      cursor_position, change_pos, 
      translation, changeTranslation,
      deleteTrans,
      changeShareOpen, shared_state,
      textbox_status, changeAITextBoxStatus
    }
  },
  {
    persist: true,
  },
)