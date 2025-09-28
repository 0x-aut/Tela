<script lang="ts" setup>
import { MousePointer2, Frame, Square, ChevronDown, Type, MessageCircle, Sparkles } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
// import { definePageMeta } from '#imports'; We need to make this work without squiggly lines
import { initializeWebGL } from '../../utils/webgl/initwebgl';
import { setupBuffer } from '../../utils/webgl/setbuffer';
import { resizeCanvas } from '../../utils/webgl/resizecanvas';
import { 
  createShader, createProgram,
  getShaderLogs, getProgramLogs,
  deleteShader, deleteProgram
} from '../../utils/webgl/shaders';
import { drawRectangle } from '../../utils/shapes/rectangle';
import { updateUniforms } from '../../utils/webgl/render';
import { Camera } from '../../utils/camera';
import { useCameraInput } from '../../composables/useCameraInput';
import { useDragHelper } from '../../utils/helpers/draghelper';
import vertexshader from '../../utils/shadersglsl/webgl/vertexshader.vert?raw';
import fragmentshader from '~/utils/shadersglsl/webgl/fragmentshader.frag?raw';
import { useGlobalStore } from '../../stores/global';

definePageMeta({
  layout: "none",
})

const globalStore = useGlobalStore();
var cursor_position = ref('0,0')
const canvasref = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = canvasref.value;
  if (!canvas) {
    throw new Error("Canvas not found")
  }

  // const camera = new Camera(canvas);
  // useCameraInput(camera);

  // Why cant i just put this in its own seperate file so that we can pass the canvas as a way to it?

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
  // var colorLocation = gl.getUniformLocation(program, "u_color");


  var translation = [300, 50];
  var width = 200;
  var height = 200;
  const color = [0.9, 0.9, 0.9, 1];
  

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    const vao = drawRectangle(gl, program, globalStore.translation[0]-width/2, globalStore.translation[1]-height/2, width, height);

    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Pass camera view matrix
    // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

    // gl.uniform4fv(colorLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Re-render on changes (add watch later for reactivity)
    requestAnimationFrame(render);
  };

  const { cleanup } = useDragHelper(gl, program, render, {
    shapeWidth: width,
    shapeHeight: height,
    shapePosX: globalStore.translation[0],
    shapePosY: globalStore.translation[1]
  });


  render();

  // onUnmounted(() => {
  //   // gl.canvas.removeEventListener('mousemove', mousemove)
  // })
})

const _drawFrameRectangle = (width: number, height: number) => {
  const canvas = canvasref.value;
  if (!canvas) return

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
  // var colorLocation = gl.getUniformLocation(program, "u_color");

  // var translation = [500, 70];
  var width = width;
  var height = height;
  const color = [1, 1, 1, 1];
  

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    const vao = drawRectangle(gl, program, globalStore.translation[0]-width/2, globalStore.translation[1]-height/2, width, height)

    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Pass camera view matrix
    // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

    gl.bindVertexArray(vao);
    // gl.uniform4fv(colorLocation, color); // This is to set color, will change later on to be more dynamic
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Re-render on changes (add watch later for reactivity)
    requestAnimationFrame(render);
  };

  const { cleanup } = useDragHelper(gl, program, render, {
    shapeWidth: width,
    shapeHeight: height,
    shapePosX: globalStore.translation[0],
    shapePosY: globalStore.translation[1]
  });

  render();

}

</script>

<template>
  <main class="design-page">
    <div class="page-details-part">
      <DesignPageDetail />
    </div>
    <div class="element-property-part">
      <DesignElementProperties
        @draw-frameRectangle="_drawFrameRectangle"
      />
    </div>
    <canvas
      class="gfx-main" 
      ref="canvasref" 
      id="c"
    ></canvas>
    <div class="action-menu-part">
      <DesignActionMenu />
    </div>
  </main>
</template>


<style lang="scss" scoped>
main {
  background: #1E1E1E;
  height: 100vh;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  .gfx-main {
    display: block;
    width: 100%;
    height: 100%;
    background: #1E1E1E;
  }
  .action-menu-part {
    display: flex;
    width: fit-content;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }
  .page-details-part {
    position: fixed;
    top: 20px;
    left: 20px;
    height: fit-content;
    width: fit-content;
    z-index: 100;
  }
  .element-property-part {
    position: fixed;
    top: 20px;
    right: 20px;
    height: fit-content;
    width: fit-content;
    z-index: 100;
  }
}
main::-webkit-scrollbar {
  display: none;
}
</style>