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
import { drawBorder, drawCircleBorder, getCircleBorderVertexCount } from '../../utils/shapes/border';
import { updateUniforms } from '../../utils/webgl/render';
import { Camera } from '../../utils/webgl/camera';
import { useCameraInput } from '../../composables/useCameraInput';
import { useDragHelper } from '../../utils/helpers/draghelper';
import vertexshader from '../../utils/shadersglsl/webgl/vertexshader.vert?raw';
import fragmentshader from '~/utils/shadersglsl/webgl/fragmentshader.frag?raw';
import borderVertexShader from '../../utils/shadersglsl/webgl/borderVertexShader.vert?raw';
import borderFragmentShader from '../../utils/shadersglsl/webgl/borderFragmentShader.frag?raw';
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
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // Create border shader program
  var borderVShader = createShader(gl, gl.VERTEX_SHADER, borderVertexShader);
  var borderFShader = createShader(gl, gl.FRAGMENT_SHADER, borderFragmentShader);
  var borderProgram = createProgram(gl, borderVShader, borderFShader);
  const borderResolutionUniformLocation = gl.getUniformLocation(borderProgram, "u_resolution");
  const borderColorLocation = gl.getUniformLocation(borderProgram, "u_color");

  const color = [0.9, 0.9, 0.9, 1];
  const borderColor = [0.2, 0.5, 1.0, 1.0]; // Blue border color
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

  // Unified render loop for all shapes
  const render = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Render all shapes
    for (const key in shapeStore.shapes) {
      const shape = shapeStore.shapes[key];
      if (!shape) continue;

      const shapeHeight = shape.height;
      const shapeWidth = shape.width;
      const shapeX = shape.coordX;
      const shapeY = shape.coordY;
      const shapeType = shape.type || 'rectangle';
      const shapeColor = shape.color || [1.0, 1.0, 1.0, 1.0];

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

      updateUniforms(gl, resolutionUniformLocation, viewMatrixLocation);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform4fv(colorLocation, shapeColor);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

      // Draw blue border if shape is hovered
      if (shapeStore.hovered_shape === key) {
        gl.useProgram(borderProgram);

        let borderVao;
        let borderVertexCount = 24; // 4 rectangles * 6 vertices

        if (shapeType === 'circle') {
          borderVao = drawCircleBorder(gl, borderProgram, shapeX, shapeY, shapeWidth / 2, 3);
          borderVertexCount = getCircleBorderVertexCount();
        } else if (shapeType === 'rectangle') {
          borderVao = drawBorder(gl, borderProgram, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight, 3);
        } else if (shapeType === 'triangle') {
          // For triangle, draw a rectangular border around it
          borderVao = drawBorder(gl, borderProgram, shapeX-shapeWidth/2, shapeY-shapeHeight/2, shapeWidth, shapeHeight, 3);
        }
        // Note: Lines don't get borders as they're already thin

        if (borderVao) {
          gl.bindVertexArray(borderVao);
          gl.uniform2f(borderResolutionUniformLocation, gl.canvas.width, gl.canvas.height);
          gl.uniform4fv(borderColorLocation, borderColor);
          gl.drawArrays(gl.TRIANGLES, 0, borderVertexCount);
        }
      }
    }

    requestAnimationFrame(render);
  };

  if (Object.keys(shapeStore.shapes).length > 0) {
    console.log("Shapes exist")
    console.log(shapeStore.shapes)
  } else {
    console.log("No shapes to render")
    console.log(shapeStore.shapes)
  }

  render();
  const { cleanup } = useDragHelper(gl, program, render);

  onUnmounted(() => {
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('mouseup', handleCanvasMouseUp);
  })
})

const drawShapeAtPosition = (clickX: number, clickY: number, width: number, height: number, shapeType: string = 'rectangle') => {
  try {
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
    console.log("Error adding shape: ", error.message)
  }
}

const drawLineFromPoints = (startX: number, startY: number, endX: number, endY: number, thickness: number = 2) => {
  try {
    // Add line shape to store
    shapeStore.addShape(new Line("Line", startX, startY, endX, endY, thickness));

    console.log("Line added from:", startX, startY, "to:", endX, endY);
    console.log(shapeStore.shapes)
  } catch(error: any) {
    console.log("Error adding line: ", error.message)
  }
}

const _drawFrameRectangle = (width: number, height: number) => {
  const windowWidthCenter = window.innerWidth / 2;
  const windowHeightCenter = window.innerHeight / 2;

  try {
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
    console.log("Error adding shape: ", error.message)
  }
}

const deleteShape = (id: string) => {
  shapeStore.removeShape(id);
  console.log("Shape removed:", id);
}

const editProperties = (coordX: number, coordY: number, sizeWidth: number, sizeHeight: number, color: number[]) => {
  shapeStore.editShape(shapeStore.select_shape, {
    coordX: Number(coordX), coordY: Number(coordY),
    width: Number(sizeWidth), height: Number(sizeHeight),
    color: color
  });

  const shape = shapeStore.shapes[shapeStore.select_shape];
  console.log("new shape")
  console.log(shape)
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