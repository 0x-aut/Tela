<script lang="ts" setup>
import { ref } from 'vue';
import { MoveHorizontal, MoveVertical, Grip, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, AlignVerticalJustifyCenter, AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd, AlignHorizontalJustifyCenter } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'editTextProperties', data: {
    coordX: number,
    coordY: number,
    width: number,
    height: number,
    alignTop: boolean,
    alignBottom: boolean,
    alignCenter: boolean,
    justifyLeft: boolean,
    justifyRight: boolean,
    justifyCenter: boolean,
    opacity: number,
    fontFamily: string,
    fontSize: number,
    fontColor: string
  }): void
}>();

// Position
const _coordX = ref<number>(0);
const _coordY = ref<number>(0);

// Layout
const _width = ref<number>(200);
const _height = ref<number>(100);
const _alignTop = ref<boolean>(false);
const _alignBottom = ref<boolean>(false);
const _alignCenter = ref<boolean>(true);
const _justifyLeft = ref<boolean>(true);
const _justifyRight = ref<boolean>(false);
const _justifyCenter = ref<boolean>(false);

// Appearance
const _opacity = ref<number>(100);

// Text Style
const _fontFamily = ref<string>('Arial');
const _fontSize = ref<number>(16);
const _fontColor = ref<string>('#FFFFFF');

const setAlignment = (type: 'top' | 'bottom' | 'center') => {
  _alignTop.value = type === 'top';
  _alignBottom.value = type === 'bottom';
  _alignCenter.value = type === 'center';
  editTextProperties();
};

const setJustification = (type: 'left' | 'right' | 'center') => {
  _justifyLeft.value = type === 'left';
  _justifyRight.value = type === 'right';
  _justifyCenter.value = type === 'center';
  editTextProperties();
};

const editTextProperties = () => {
  emit('editTextProperties', {
    coordX: _coordX.value,
    coordY: _coordY.value,
    width: _width.value,
    height: _height.value,
    alignTop: _alignTop.value,
    alignBottom: _alignBottom.value,
    alignCenter: _alignCenter.value,
    justifyLeft: _justifyLeft.value,
    justifyRight: _justifyRight.value,
    justifyCenter: _justifyCenter.value,
    opacity: _opacity.value,
    fontFamily: _fontFamily.value,
    fontSize: _fontSize.value,
    fontColor: _fontColor.value
  });
};
</script>

<template>
  <div class="text-edit-wrapper">
    <!-- Position Area -->
    <div class="position-area areadiv">
      <span class="geist-regular areadiv-header">Position</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <label for="x">
            <span class="geist-regular">X</span>
          </label>
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="0" type="text" v-model="_coordX" />
        </div>
        <div class="coords-input-wrapper">
          <label for="y">
            <span class="geist-medium">Y</span>
          </label>
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="0" type="text" v-model="_coordY" />
        </div>
      </div>
    </div>

    <!-- Layout Area -->
    <div class="layout-area areadiv">
      <span class="geist-regular areadiv-header">Layout</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <MoveVertical
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="input-icon"
          />
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="100" type="text" v-model="_height" />
        </div>
        <div class="coords-input-wrapper">
          <MoveHorizontal
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="input-icon"
          />
          <input placeholder="200" @keyup.enter="editTextProperties" type="text" v-model="_width" />
        </div>
      </div>
      <!-- Alignment Buttons -->
      <div class="coords-wrapper">
        <button
          title="Align Top"
          class="area-button"
          :class="{ 'active': _alignTop }"
          @click="setAlignment('top')"
        >
          <AlignVerticalJustifyStart
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
        <button
          title="Align Center"
          class="area-button"
          :class="{ 'active': _alignCenter }"
          @click="setAlignment('center')"
        >
          <AlignVerticalJustifyCenter
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
        <button
          title="Align Bottom"
          class="area-button"
          :class="{ 'active': _alignBottom }"
          @click="setAlignment('bottom')"
        >
          <AlignVerticalJustifyEnd
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
      </div>
      <!-- Justification Buttons -->
      <div class="coords-wrapper">
        <button
          title="Justify Left"
          class="area-button"
          :class="{ 'active': _justifyLeft }"
          @click="setJustification('left')"
        >
          <AlignHorizontalJustifyStart
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
        <button
          title="Justify Center"
          class="area-button"
          :class="{ 'active': _justifyCenter }"
          @click="setJustification('center')"
        >
          <AlignHorizontalJustifyCenter
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
        <button
          title="Justify Right"
          class="area-button"
          :class="{ 'active': _justifyRight }"
          @click="setJustification('right')"
        >
          <AlignHorizontalJustifyEnd
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
          />
        </button>
      </div>
    </div>

    <!-- Appearance Area -->
    <div class="appearance-area areadiv">
      <span class="geist-regular areadiv-header">Appearance</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <Grip
            :size="13"
            :stroke-width="1"
            absoluteStrokeWidth
            class="input-icon"
          />
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="100" type="text" v-model="_opacity" />
        </div>
      </div>
    </div>

    <!-- Text Style Area -->
    <div class="text-style-area areadiv">
      <span class="geist-regular areadiv-header">Text Style</span>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper">
          <label for="font-family">
            <span class="geist-regular">Font</span>
          </label>
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="Arial" type="text" v-model="_fontFamily" />
        </div>
        <div class="coords-input-wrapper">
          <label for="font-size">
            <span class="geist-regular">Size</span>
          </label>
          <input class="geist-medium" @keyup.enter="editTextProperties" placeholder="16" type="text" v-model="_fontSize" />
        </div>
      </div>
      <div class="coords-wrapper">
        <div class="coords-input-wrapper color-input">
          <label for="font-color">
            <span class="geist-regular">Color</span>
          </label>
          <input class="geist-medium" @change="editTextProperties" type="color" v-model="_fontColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-edit-wrapper {
  display: flex;
  flex-direction: column;

  .areadiv {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 10px 0px 10px 0px;
    border-bottom: 1px solid rgba(240, 240, 240, 0.2);

    .areadiv-header {
      padding-left: 15px;
      font-size: 13px;
    }
  }

  .coords-wrapper {
    width: stretch;
    overflow: hidden;
    padding: 0px 15px;
    display: flex;
    align-items: center;
    column-gap: 7.5px;

    .area-button {
      all: unset;
      width: 48px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(240, 240, 240, 0.15);
      border-radius: 5px;
      cursor: pointer;
      transition: 0.2s ease-out;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background: rgba(240, 240, 240, 0.25);
        color: rgba(255, 255, 255, 0.9);
      }

      &.active {
        background: #0D99FF;
        color: #FFFFFF;
      }
    }

    .coords-input-wrapper {
      width: 80px;
      display: flex;
      align-items: center;
      overflow-x: hidden;
      background: rgba(240, 240, 240, 0.2);
      border-radius: 5px;
      padding: 2.5px 5px;
      column-gap: 5px;
      transition: 0.2s ease-out;

      &.color-input {
        width: 167.5px;
      }

      &:focus-within {
        background: rgba(240, 240, 240, 0.3);
      }

      .input-icon {
        color: rgba(255, 255, 255, 0.7);
      }

      label {
        display: flex;
        span {
          font-size: 12px;
          color: #FFFFFF;
          opacity: 0.7;
        }
      }

      input {
        all: unset;
        display: flex;
        align-items: center;
        height: stretch;
        width: 100%;
        margin-bottom: 1px;
        border-radius: 0px inherit 0px inherit;
        font-size: 13px;
        font-family: "geist-regular";
        color: rgba(255, 255, 255, 0.9);
        transition: color 0.2s ease-out;

        &:focus {
          color: #FFFFFF;
        }

        &[type="color"] {
          height: 24px;
          cursor: pointer;
        }
      }

      input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>
