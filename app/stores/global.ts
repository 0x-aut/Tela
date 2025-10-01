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

    const zoom = ref(1.0);
    const cameraPosition = ref({ x: 0, y: 0 });

    function setZoom(value: number) {
      zoom.value = Math.max(0.1, Math.min(10, value)); // Clamp between 0.1 and 10
    }

    function setCameraPosition(x: number, y: number) {
      cameraPosition.value = { x, y };
    }

    return {
      cursor_position, change_pos,
      translation, changeTranslation,
      deleteTrans,
      changeShareOpen, shared_state,
      zoom, setZoom,
      cameraPosition, setCameraPosition
    }
  },
  {
    persist: true,
  },
)