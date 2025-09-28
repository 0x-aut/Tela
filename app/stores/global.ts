import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const cursor_position = ref('0,0');
    function change_pos(x: number, y: number) {
      cursor_position.value = `${x}, ${y}`
    }

    const translation = ref([0, 0])
    function changeTranslation(x: number, y: number) {
      translation.value = [x, y];
    }
    return { cursor_position, change_pos, translation, changeTranslation }
  },
  {
    persist: true,
  },
)