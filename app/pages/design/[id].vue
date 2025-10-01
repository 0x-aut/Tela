<script lang="ts" setup>
import { MousePointer2, Frame, Square, ChevronDown, Type, MessageCircle, Sparkles } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, watch } from 'vue';
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
import { updateUniforms, setOpacityUniform } from '../../utils/webgl/render';
import { Camera } from '../../utils/webgl/camera';
import { useCameraInput } from '../../composables/useCameraInput';
import { useDragHelper } from '../../utils/helpers/draghelper';
import vertexshader from '../../utils/shadersglsl/webgl/vertexshader.vert?raw';
import fragmentshader from '~/utils/shadersglsl/webgl/fragmentshader.frag?raw';
import { useGlobalStore } from '../../stores/global';
import { useShapeStore } from '../../stores/shapeStore';
import { Shape } from '../../shared/types/ShapeTypes/Shape';
import { Rectangle } from '../../shared/types/ShapeTypes/Rectangle';

definePageMeta({
  layout: "none",
})

const globalStore = useGlobalStore();
const shapeStore = useShapeStore();
var cursor_position = ref('0,0');
const canvasref = ref<HTMLCanvasElement | null>(null);



onMounted(() => {
  const canvas = canvasref.value;
  if (!canvas) {
    throw new Error("Canvas not found")
  }

  // const camera = new Camera(canvas);
  // useCameraInput(camera);

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
  // var colorLocation = gl.getUniformLocation(program, "u_color");

  const color = [0.9, 0.9, 0.9, 1];
  // globalStore.deleteTrans();

  if (Object.keys(shapeStore.shapes).length > 0) {
    console.log("Shapes exist")
    console.log(shapeStore.shapes)
    for (const key in shapeStore.shapes) {
      const render = () => {
        const shapeHeight = shapeStore.shapes[key].height;
        const shapeWidth = shapeStore.shapes[key].width;
        const shapeX = shapeStore.shapes[key].coordX;
        const shapeY = shapeStore.shapes[key].coordY;
        const shapeOpacity = shapeStore.shapes[key].opacity;

        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        const vao = drawRectangle(gl, program, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight);

        updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
        setOpacityUniform(gl, program, shapeOpacity);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Pass camera view matrix
        // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

        // gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      render()
      const { cleanup } = useDragHelper(gl, program, render);
    }
    
  } else {
    console.log("No shapes to render")
    console.log(shapeStore.shapes)
  }

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

  const color = [1, 1, 1, 1];
  

  const windowWidthCenter = window.innerWidth / 2;
  const windowHeightCenter = window.innerHeight / 2;

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    const vao = drawRectangle(gl, program, windowWidthCenter-width/2, windowHeightCenter-height/2, width, height) // Center of the shape here
    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
    setOpacityUniform(gl, program, 1.0);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Pass camera view matrix
    // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

    gl.bindVertexArray(vao);
    // gl.uniform4fv(colorLocation, color); // This is to set color, will change later on to be more dynamic
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Re-render on changes (add watch later for reactivity)
    requestAnimationFrame(render);
  };

  try {
    render();
    const { cleanup } = useDragHelper(gl, program, render);
    shapeStore.addShape(new Rectangle(
      "Rectangle",
      height,
      width,
      windowWidthCenter,
      windowHeightCenter,
      1.0,
      0
    ));
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error rendering shape: ", error.message)
  }

}

const deleteShape = (id: string) => {
  const canvas = canvasref.value;
  if (!canvas) return

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");

  shapeStore.removeShape(id)

  if (Object.keys(shapeStore.shapes).length == 0) {
    const rerender = () => {
      resizeCanvas(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      requestAnimationFrame(rerender);
    }
    rerender()
  }

  if (Object.keys(shapeStore.shapes).length > 0) {
    console.log("Shapes exist")
    console.log(shapeStore.shapes)
    for (const key in shapeStore.shapes) {
      const render = () => {
        const shapeHeight = shapeStore.shapes[key].height;
        const shapeWidth = shapeStore.shapes[key].width;
        const shapeX = shapeStore.shapes[key].coordX;
        const shapeY = shapeStore.shapes[key].coordY;
        const shapeOpacity = shapeStore.shapes[key].opacity;

        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        const vao = drawRectangle(gl, program, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight);

        updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
        setOpacityUniform(gl, program, shapeOpacity);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Pass camera view matrix
        // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

        // gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      render()
      const { cleanup } = useDragHelper(gl, program, render);
    }
  }
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number, opacity: number, borderRadius: number) => {
  const canvas = canvasref.value
  if (!canvas) return

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");

  shapeStore.editShape(shapeStore.select_shape, {
    coordX: Number(coordX), coordY: Number(coordY),
    width: Number(sizeWidth), height: Number(sizeHeight),
    opacity: Number(opacity), borderRadius: Number(borderRadius)
  })

  const shape = shapeStore.shapes[shapeStore.select_shape];

  console.log("new shape")
  console.log(shape)

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    const vao = drawRectangle(gl, program, shape.coordX-shape.width/2, shape.coordY-shape.height/2, shape.width, shape.height) // Center of the shape here
    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
    setOpacityUniform(gl, program, shape.opacity);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Pass camera view matrix
    // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

    gl.bindVertexArray(vao);
    // gl.uniform4fv(colorLocation, color); // This is to set color, will change later on to be more dynamic
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Re-render on changes (add watch later for reactivity)
    requestAnimationFrame(render);
  };

  render()
  const { cleanup } = useDragHelper(gl, program, render);
}


</script>

<template>
  <main class="design-page">
    <div class="share" v-if="globalStore.shared_state.state">
      <ToastsShare />
    </div>
    <div class="page-details-part">
      <DesignPageDetail
        @deleteShape="deleteShape"
      />
    </div>
    <div class="element-property-part">
      <DesignElementProperties
        @draw-frameRectangle="_drawFrameRectangle"
        @editProperties="editProperties"
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
  .share {
    position: fixed;
    height: stretch;
    width: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    background: rgba(18, 18, 18, 0.4);
    backdrop-filter: blur(1px);     /* apply blur to whatever is behind */
    -webkit-backdrop-filter: blur(1px);
    animation: fadeIn 0.3s ease;
  }
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
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>