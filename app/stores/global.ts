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

    // Camera state based on Steve Ruiz's zoom UI approach
    const camera_state = ref({
      x: 0, // Horizontal position on canvas
      y: 0, // Vertical position on canvas
      z: 1  // Zoom level (1 = 100%, 0.5 = 50%, 2 = 200%)
    })

    function setCameraState(x: number, y: number, z: number) {
      camera_state.value = { x, y, z };
    }

    function updateCameraPosition(x: number, y: number) {
      camera_state.value.x = x;
      camera_state.value.y = y;
    }

    function updateCameraZoom(z: number) {
      camera_state.value.z = z;
    }

    // Legacy 3D camera state for WebGL
    const camera_3d_state = ref({
      camFieldOfView: 60, // In degrees
      camPosX: 0,
      camPosY: 0,
      camPosZ: -200,
      near: 1,
      far: 2000
    })

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
      camera_state, setCameraState, updateCameraPosition, updateCameraZoom,
      camera_3d_state,
      textbox_status, changeAITextBoxStatus
    }
  },
  {
    persist: true,
  },
)