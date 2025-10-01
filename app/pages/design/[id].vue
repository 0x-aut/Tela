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
import { drawCircle, getCircleVertexCount } from '../../utils/shapes/circle';
import { drawTriangle } from '../../utils/shapes/triangle';
import { drawLine } from '../../utils/shapes/line';
import { updateUniforms } from '../../utils/webgl/render';
import { Camera } from '../../utils/webgl/camera';
import { useCameraInput } from '../../composables/useCameraInput';
import { useDragHelper } from '../../utils/helpers/draghelper';
import vertexshader from '../../utils/shadersglsl/webgl/vertexshader.vert?raw';
import fragmentshader from '~/utils/shadersglsl/webgl/fragmentshader.frag?raw';
import { useGlobalStore } from '../../stores/global';
import { useShapeStore } from '../../stores/shapeStore';
import { useActionStateStore } from '../../stores/actionstates';
import { ActionState } from '../../shared/types/ActionState';
import { Shape } from '../../shared/types/ShapeTypes/Shape';
import { Circle } from '../../shared/types/ShapeTypes/Circle';
import { Triangle } from '../../shared/types/ShapeTypes/Triangle';
import { Line } from '../../shared/types/ShapeTypes/Line';

definePageMeta({
  layout: "none",
})

const globalStore = useGlobalStore();
const shapeStore = useShapeStore();
const actionStateStore = useActionStateStore();
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

  // Track line drawing state
  let isDrawingLine = false;
  let lineStartX = 0;
  let lineStartY = 0;

  // Add canvas click event handler for drawing shapes
  const handleCanvasClick = (event: MouseEvent) => {
    if (actionStateStore.action_state === ActionState.DRAWSHAPE) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Special handling for line: click-and-drag
      if (actionStateStore.selectedShape === 'line') {
        if (!isDrawingLine) {
          // Start drawing line
          isDrawingLine = true;
          lineStartX = clickX;
          lineStartY = clickY;
        }
      } else {
        // Default shape dimensions for other shapes
        const defaultSize = 100;
        // Draw shape at click position based on selected shape type
        drawShapeAtPosition(clickX, clickY, defaultSize, defaultSize, actionStateStore.selectedShape);
      }
    }
  };

  // Add mouse up handler for line drawing
  const handleCanvasMouseUp = (event: MouseEvent) => {
    if (actionStateStore.action_state === ActionState.DRAWSHAPE &&
        actionStateStore.selectedShape === 'line' &&
        isDrawingLine) {
      const rect = canvas.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;

      // Draw line from start to end
      drawLineFromPoints(lineStartX, lineStartY, endX, endY);
      isDrawingLine = false;
    }
  };

  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);

  if (Object.keys(shapeStore.shapes).length > 0) {
    console.log("Shapes exist")
    console.log(shapeStore.shapes)
    for (const key in shapeStore.shapes) {
      const render = () => {
        const shape = shapeStore.shapes[key];
        const shapeHeight = shape.height;
        const shapeWidth = shape.width;
        const shapeX = shape.coordX;
        const shapeY = shape.coordY;
        const shapeType = shape.type || 'rectangle';

        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        let vao;
        let vertexCount = 6;

        // Draw based on shape type
        if (shapeType === 'circle') {
          vao = drawCircle(gl, program, shapeX, shapeY, shapeWidth / 2);
          vertexCount = getCircleVertexCount();
        } else if (shapeType === 'triangle') {
          vao = drawTriangle(gl, program, shapeX, shapeY, shapeWidth, shapeHeight);
          vertexCount = 3;
        } else if (shapeType === 'line') {
          const lineShape = shape as any; // Cast to access line-specific properties
          if (lineShape.startX !== undefined) {
            vao = drawLine(gl, program, lineShape.startX, lineShape.startY, lineShape.endX, lineShape.endY, lineShape.thickness || 2);
          } else {
            // Fallback for old line format
            vao = drawLine(gl, program, shapeX - shapeWidth/2, shapeY, shapeX + shapeWidth/2, shapeY, shape.height);
          }
          vertexCount = 6;
        } else {
          vao = drawRectangle(gl, program, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight);
        }

        updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Pass camera view matrix
        // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

        // gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        requestAnimationFrame(render);
      }
      render()
      const { cleanup } = useDragHelper(gl, program, render);
    }

  } else {
    console.log("No shapes to render")
    console.log(shapeStore.shapes)
  }

  onUnmounted(() => {
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('mouseup', handleCanvasMouseUp);
  })
})

const drawShapeAtPosition = (clickX: number, clickY: number, width: number, height: number, shapeType: string = 'rectangle') => {
  const canvas = canvasref.value;
  if (!canvas) return

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    gl.useProgram(program);

    let vao;
    let vertexCount = 6;

    // Draw based on shape type (line is handled separately with drawLineFromPoints)
    if (shapeType === 'circle') {
      vao = drawCircle(gl, program, clickX, clickY, width / 2);
      vertexCount = getCircleVertexCount();
    } else if (shapeType === 'triangle') {
      vao = drawTriangle(gl, program, clickX, clickY, width, height);
      vertexCount = 3;
    } else {
      vao = drawRectangle(gl, program, clickX-width/2, clickY-height/2, width, height);
    }

    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    requestAnimationFrame(render);
  };

  try {
    render();
    const { cleanup } = useDragHelper(gl, program, render);

    // Add shape based on type (line is handled separately)
    if (shapeType === 'circle') {
      shapeStore.addShape(new Circle("Circle", clickX, clickY, width / 2));
    } else if (shapeType === 'triangle') {
      shapeStore.addShape(new Triangle("Triangle", height, width, clickX, clickY));
    } else {
      shapeStore.addShape(new Shape("Rectangle", height, width, clickX, clickY, 'rectangle'));
    }

    console.log("Shape added at position:", clickX, clickY);
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error rendering shape: ", error.message)
  }
}

const drawLineFromPoints = (startX: number, startY: number, endX: number, endY: number, thickness: number = 2) => {
  const canvas = canvasref.value;
  if (!canvas) return

  const gl = initializeWebGL(canvas)

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
  var program = createProgram(gl, vertexShader, fragmentShader);

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");

  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    gl.useProgram(program);

    const vao = drawLine(gl, program, startX, startY, endX, endY, thickness);
    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  };

  try {
    render();
    const { cleanup } = useDragHelper(gl, program, render);

    // Add line shape to store
    shapeStore.addShape(new Line("Line", startX, startY, endX, endY, thickness));

    console.log("Line added from:", startX, startY, "to:", endX, endY);
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error rendering line: ", error.message)
  }
}

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
    shapeStore.addShape(new Shape(
      "Rectangle",
      height,
      width,
      windowWidthCenter,
      windowHeightCenter,
      'rectangle'
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
        const shape = shapeStore.shapes[key];
        const shapeHeight = shape.height;
        const shapeWidth = shape.width;
        const shapeX = shape.coordX;
        const shapeY = shape.coordY;
        const shapeType = shape.type || 'rectangle';

        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        let vao;
        let vertexCount = 6;

        // Draw based on shape type
        if (shapeType === 'circle') {
          vao = drawCircle(gl, program, shapeX, shapeY, shapeWidth / 2);
          vertexCount = getCircleVertexCount();
        } else if (shapeType === 'triangle') {
          vao = drawTriangle(gl, program, shapeX, shapeY, shapeWidth, shapeHeight);
          vertexCount = 3;
        } else if (shapeType === 'line') {
          const lineShape = shape as any; // Cast to access line-specific properties
          if (lineShape.startX !== undefined) {
            vao = drawLine(gl, program, lineShape.startX, lineShape.startY, lineShape.endX, lineShape.endY, lineShape.thickness || 2);
          } else {
            // Fallback for old line format
            vao = drawLine(gl, program, shapeX - shapeWidth/2, shapeY, shapeX + shapeWidth/2, shapeY, shape.height);
          }
          vertexCount = 6;
        } else {
          vao = drawRectangle(gl, program, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight);
        }

        updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Pass camera view matrix
        // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

        // gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        requestAnimationFrame(render);
      }
      render()
      const { cleanup } = useDragHelper(gl, program, render);
    }
  }
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number) => {
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
    width: Number(sizeWidth), height: Number(sizeHeight)
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

    const shapeType = shape.type || 'rectangle';
    let vao;
    let vertexCount = 6;

    // Draw based on shape type
    if (shapeType === 'circle') {
      vao = drawCircle(gl, program, shape.coordX, shape.coordY, shape.width / 2);
      vertexCount = getCircleVertexCount();
    } else if (shapeType === 'triangle') {
      vao = drawTriangle(gl, program, shape.coordX, shape.coordY, shape.width, shape.height);
      vertexCount = 3;
    } else if (shapeType === 'line') {
      vao = drawLine(gl, program, shape.coordX, shape.coordY, shape.width, shape.height, 45);
      vertexCount = 6;
    } else {
      vao = drawRectangle(gl, program, shape.coordX-shape.width/2, shape.coordY-shape.height/2, shape.width, shape.height);
    }

    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Pass camera view matrix
    // gl.uniformMatrix3fv(viewMatrixLocation, false, camera.getViewMatrix());

    gl.bindVertexArray(vao);
    // gl.uniform4fv(colorLocation, color); // This is to set color, will change later on to be more dynamic
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

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