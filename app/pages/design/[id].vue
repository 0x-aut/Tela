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

// Global camera instance
let camera: Camera | null = null;

onMounted(() => {
  const canvas = canvasref.value;
  if (!canvas) {
    throw new Error("Canvas not found")
  }

  // Initialize camera
  camera = new Camera(canvas);

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
      // Special handling for line: click-and-drag
      if (actionStateStore.selectedShape === 'line') {
        if (!isDrawingLine) {
          // Start drawing line - store client coords
          isDrawingLine = true;
          lineStartX = event.clientX;
          lineStartY = event.clientY;
        }
      } else {
        // Default shape dimensions for other shapes
        const defaultSize = 100;
        // Draw shape at click position based on selected shape type
        drawShapeAtPosition(event.clientX, event.clientY, defaultSize, defaultSize, actionStateStore.selectedShape);
      }
    }
  };

  // Add mouse up handler for line drawing
  const handleCanvasMouseUp = (event: MouseEvent) => {
    if (actionStateStore.action_state === ActionState.DRAWSHAPE &&
        actionStateStore.selectedShape === 'line' &&
        isDrawingLine) {
      // Draw line from start to end - pass client coords
      drawLineFromPoints(lineStartX, lineStartY, event.clientX, event.clientY);
      isDrawingLine = false;
    }
  };

  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);

  // Unified render loop with camera and culling
  const renderAllShapes = () => {
    if (!camera) return;

    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    // Update uniforms with camera
    updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation, camera);

    // Render all shapes with culling
    for (const key in shapeStore.shapes) {
      const shape = shapeStore.shapes[key];
      const shapeHeight = shape.height;
      const shapeWidth = shape.width;
      const shapeX = shape.coordX;
      const shapeY = shape.coordY;
      const shapeType = shape.type || 'rectangle';

      // Culling: Skip shapes outside camera view
      if (!camera.isShapeVisible(shapeX, shapeY, shapeWidth, shapeHeight)) {
        continue;
      }

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
        const lineShape = shape as any;
        if (lineShape.startX !== undefined) {
          vao = drawLine(gl, program, lineShape.startX, lineShape.startY, lineShape.endX, lineShape.endY, lineShape.thickness || 2);
        } else {
          vao = drawLine(gl, program, shapeX - shapeWidth/2, shapeY, shapeX + shapeWidth/2, shapeY, shape.height);
        }
        vertexCount = 6;
      } else {
        vao = drawRectangle(gl, program, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight);
      }

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    requestAnimationFrame(renderAllShapes);
  };

  // Start render loop
  renderAllShapes();

  // Setup camera input handlers
  useCameraInput(camera, renderAllShapes);

  // Setup drag helper with new render function
  const { cleanup } = useDragHelper(gl, program, renderAllShapes);

  onUnmounted(() => {
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('mouseup', handleCanvasMouseUp);
  })
})

const drawShapeAtPosition = (clickX: number, clickY: number, width: number, height: number, shapeType: string = 'rectangle') => {
  if (!camera) return;

  // Convert screen coordinates to world coordinates
  const worldPos = camera.screenToWorld(clickX, clickY);

  try {
    // Add shape based on type (rendering is handled by main loop)
    if (shapeType === 'circle') {
      shapeStore.addShape(new Circle("Circle", worldPos.x, worldPos.y, width / 2));
    } else if (shapeType === 'triangle') {
      shapeStore.addShape(new Triangle("Triangle", height, width, worldPos.x, worldPos.y));
    } else {
      shapeStore.addShape(new Shape("Rectangle", height, width, worldPos.x, worldPos.y, 'rectangle'));
    }

    console.log("Shape added at position:", worldPos.x, worldPos.y);
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error adding shape: ", error.message)
  }
}

const drawLineFromPoints = (startX: number, startY: number, endX: number, endY: number, thickness: number = 2) => {
  if (!camera) return;

  // Convert screen coordinates to world coordinates
  const worldStart = camera.screenToWorld(startX, startY);
  const worldEnd = camera.screenToWorld(endX, endY);

  try {
    // Add line shape to store (rendering is handled by main loop)
    shapeStore.addShape(new Line("Line", worldStart.x, worldStart.y, worldEnd.x, worldEnd.y, thickness));

    console.log("Line added from:", worldStart.x, worldStart.y, "to:", worldEnd.x, worldEnd.y);
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error adding line: ", error.message)
  }
}

const _drawFrameRectangle = (width: number, height: number) => {
  if (!camera || !canvasref.value) return;

  // Get center of viewport in screen coordinates
  const windowWidthCenter = window.innerWidth / 2;
  const windowHeightCenter = window.innerHeight / 2;

  // Convert to world coordinates
  const worldPos = camera.screenToWorld(windowWidthCenter, windowHeightCenter);

  try {
    // Add shape (rendering is handled by main loop)
    shapeStore.addShape(new Shape(
      "Rectangle",
      height,
      width,
      worldPos.x,
      worldPos.y,
      'rectangle'
    ));
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error adding shape: ", error.message)
  }
}

const deleteShape = (id: string) => {
  // Simply remove the shape - the unified render loop will handle the rest
  shapeStore.removeShape(id);
  console.log("Shape deleted:", id);
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number) => {
  // Simply update the shape properties - the unified render loop will handle rendering
  shapeStore.editShape(shapeStore.select_shape, {
    coordX: Number(coordX), coordY: Number(coordY),
    width: Number(sizeWidth), height: Number(sizeHeight)
  });

  const shape = shapeStore.shapes[shapeStore.select_shape];
  console.log("Shape properties updated:");
  console.log(shape);
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