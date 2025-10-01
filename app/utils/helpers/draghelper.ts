import { ref } from 'vue';
import { updateUniforms } from '../webgl/render';
import { useGlobalStore } from '../../stores/global';
import { useShapeStore } from '../../stores/shapeStore'
import type { Shape } from '~/shared/types/ShapeTypes/Shape';

// Type for resize edge detection
type ResizeEdge = 'top' | 'right' | 'bottom' | 'left' | null;

// Border threshold for resize detection (in pixels)
const RESIZE_THRESHOLD = 8;

/**
 * Detects if the mouse is near an edge of a shape for resizing
 * @param mouseX - Mouse X position
 * @param mouseY - Mouse Y position
 * @param shape - The shape to check
 * @returns The edge the mouse is near, or null if not near any edge
 */
function detectResizeEdge(mouseX: number, mouseY: number, shape: Shape): ResizeEdge {
  const shapeX = shape.coordX;
  const shapeY = shape.coordY;
  const shapeH = shape.height;
  const shapeW = shape.width;

  const left = shapeX - shapeW / 2;
  const right = shapeX + shapeW / 2;
  const top = shapeY - shapeH / 2;
  const bottom = shapeY + shapeH / 2;

  // Check if mouse is within the shape bounds
  const isInBounds = mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
  if (!isInBounds) return null;

  // Check if mouse is near any edge (within threshold)
  const nearLeft = mouseX >= left && mouseX <= left + RESIZE_THRESHOLD;
  const nearRight = mouseX >= right - RESIZE_THRESHOLD && mouseX <= right;
  const nearTop = mouseY >= top && mouseY <= top + RESIZE_THRESHOLD;
  const nearBottom = mouseY >= bottom - RESIZE_THRESHOLD && mouseY <= bottom;

  // Priority: sides before top/bottom for corner cases
  if (nearLeft) return 'left';
  if (nearRight) return 'right';
  if (nearTop) return 'top';
  if (nearBottom) return 'bottom';

  return null;
}

/**
 * Gets the appropriate cursor style for a resize edge
 * @param edge - The edge being resized
 * @returns The CSS cursor style
 */
function getResizeCursor(edge: ResizeEdge): string {
  switch (edge) {
    case 'top':
    case 'bottom':
      return 'ns-resize';
    case 'left':
    case 'right':
      return 'ew-resize';
    default:
      return 'default';
  }
}

export function useDragHelper(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  renderFunction:() => void,
  options: Record<any, any> = {}
) {
  const globalStore = useGlobalStore();
  const shapeStore = useShapeStore();
  const selected_shapes = ref<Record<string, Shape>>({}); //We could decide to only have one selected shape
  // We get position of retangle to drag
  const shapePosX = ref<number>(options.shapePosX);
  const shapePosY = ref<number>(options.shapePosY);
  var newShapePosX = shallowRef(shapePosX.value);
  var newShapePosY = shallowRef(shapePosY.value);
  const shapeHeight = ref<number>(options.shapeHeight);
  const shapeWidth = ref<number>(options.shapeWidth);

  // We want to pass in the shapes record for all shapes
  // When i hit box I will check through all shapes in the record
  /*
    A for loop is suboptimal as heck but we can stick with it? especially since there is no need to scale now?
    Or we can filter the record if possible right? to only have the shapes in a new list with the necessary stuff
  */

  // We want to make the drag function so we can drag
  // Drag function will change the positioning which we have to return
  const isDragging = ref<boolean>(false);
  const isResizing = ref<boolean>(false);
  const resizeEdge = ref<ResizeEdge>(null);
  const c_pos = ref("0,0")
  var _key = ref("")

  // Store initial dimensions for resize
  const initialWidth = ref<number>(0);
  const initialHeight = ref<number>(0);
  const initialMouseX = ref<number>(0);
  const initialMouseY = ref<number>(0);

  function mousemove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Handle resizing
    if (isResizing.value && _key.value && resizeEdge.value) {
      const shape = shapeStore.shapes[_key.value];
      if (!shape) return;

      const deltaX = mouseX - initialMouseX.value;
      const deltaY = mouseY - initialMouseY.value;

      let newWidth = initialWidth.value;
      let newHeight = initialHeight.value;
      let newCoordX = shape.coordX;
      let newCoordY = shape.coordY;

      // Apply resize based on edge
      switch (resizeEdge.value) {
        case 'right':
          newWidth = Math.max(20, initialWidth.value + deltaX);
          newCoordX = shape.coordX - initialWidth.value / 2 + newWidth / 2;
          break;
        case 'left':
          newWidth = Math.max(20, initialWidth.value - deltaX);
          newCoordX = shape.coordX + initialWidth.value / 2 - newWidth / 2;
          break;
        case 'bottom':
          newHeight = Math.max(20, initialHeight.value + deltaY);
          newCoordY = shape.coordY - initialHeight.value / 2 + newHeight / 2;
          break;
        case 'top':
          newHeight = Math.max(20, initialHeight.value - deltaY);
          newCoordY = shape.coordY + initialHeight.value / 2 - newHeight / 2;
          break;
      }

      shapeStore.editShape(_key.value, {
        width: newWidth,
        height: newHeight,
        coordX: newCoordX,
        coordY: newCoordY
      });
      renderFunction();
      return;
    }

    // Handle dragging
    if (isDragging.value) {
      var coordX = mouseX;
      var coordY = mouseY;
      shapeStore.editShape(_key.value, {coordX: coordX, coordY: coordY});
      renderFunction();
      return;
    }

    // Handle hover detection and cursor changes
    if (!isDragging.value && !isResizing.value) {
      gl.canvas.style.cursor = "default";
      globalStore.change_pos(mouseX, mouseY);
      globalStore.changeTranslation(mouseX, mouseY);

      // Check if mouse is hovering over any shape
      let hoveredShapeKey = "";
      let detectedEdge: ResizeEdge = null;

      for (const key in shapeStore.shapes) {
        if (!shapeStore.shapes[key]) continue;

        const shape = shapeStore.shapes[key];
        var shapeX = shape.coordX;
        var shapeY = shape.coordY;
        var shapeH = shape.height;
        var shapeW = shape.width;

        // Check if mouse is within shape bounds
        if ((mouseX >= (shapeX - shapeW/2)) && (mouseX <= (shapeX + shapeW/2)) &&
            (mouseY >= (shapeY - shapeH/2)) && (mouseY <= (shapeY + shapeH/2))) {
          hoveredShapeKey = key;

          // If shape is selected or hovered, check for resize edges
          if (key === shapeStore.select_shape || key === shapeStore.hovered_shape) {
            detectedEdge = detectResizeEdge(mouseX, mouseY, shape);
          }
        }
      }

      // Update cursor based on detected edge
      if (detectedEdge) {
        gl.canvas.style.cursor = getResizeCursor(detectedEdge);
      } else if (hoveredShapeKey) {
        shapeStore.setHoveredShape(hoveredShapeKey);
        gl.canvas.style.cursor = "pointer";
      } else {
        shapeStore.clearHoveredShape();
        gl.canvas.style.cursor = "default";
      }

      renderFunction();
    }
  }

  function clearSelectedList() {
    var _length = Object.keys(selected_shapes.value).length;
    for (const key in selected_shapes.value) {
      delete selected_shapes.value[key] // check this later
    }
  }

  function mousedown(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (const key in shapeStore.shapes) {

      if (!shapeStore.shapes[key]) {
        console.log("Shapes from store has issues")
        return
      }

      const shape = shapeStore.shapes[key];
      var shapeX = shape.coordX;
      var shapeY = shape.coordY;
      var shapeH = shape.height;
      var shapeW = shape.width;


      // We need to filter the shapes based on the positions here
      // Because of the center of the shape
      if ((mouseX >= (shapeX - shapeW/2)) && (mouseX <= (shapeX + shapeW/2)) && (mouseY >= (shapeY - shapeH/2)) && (mouseY <= (shapeY + shapeH/2))) {
        selected_shapes.value[key] = shape;
      } else {
        shapeStore.clearSelectShape();
      }
    }

    console.log(`Selected`);
    console.log(selected_shapes.value)

    // As it works fine we want to pick the top most shape to change the position.
    const selected_shapes_keys = Object.keys(selected_shapes.value);
    const select_key = selected_shapes_keys[selected_shapes_keys.length - 1];

    if (!select_key) {
      console.log("No select key found")
      return
    }

    _key.value = select_key;
    shapeStore.selectShape(_key.value)

    console.log("Selected key with record")
    console.log(selected_shapes.value[select_key]);

    // Check if we're clicking on a resize edge
    const shape = shapeStore.shapes[_key.value];
    const edge = detectResizeEdge(mouseX, mouseY, shape);

    if (edge) {
      // Start resizing
      isResizing.value = true;
      resizeEdge.value = edge;
      initialWidth.value = shape.width;
      initialHeight.value = shape.height;
      initialMouseX.value = mouseX;
      initialMouseY.value = mouseY;
      gl.canvas.style.cursor = getResizeCursor(edge);
    } else {
      // Start dragging
      isDragging.value = true;
      gl.canvas.style.cursor = "pointer";
    }


    // if (Object.keys(selected_shapes.value).length) {
    //   isDragging.value = true
    //   gl.canvas.style.cursor = "pointer";
    // }


    // if (mouseX >= (shapePosX.value - shapeWidth.value/2) && mouseX <= shapePosX.value + (shapeWidth.value/2) &&
    //   mouseY >= (shapePosY.value -shapeHeight.value/2) && mouseY <= shapePosY.value + (shapeHeight.value/2)) {
    //     isDragging.value = true
    //     gl.canvas.style.cursor = "pointer";
    //     console.log(`isDragging: ${isDragging.value}`)
    //     newShapePosX.value = mouseX
    //     newShapePosY.value = mouseY
    // } else {
    //   isDragging.value = false
    //   gl.canvas.style.cursor = "default"
    // }
  }

  function mouseup(event) {
    gl.canvas.style.cursor = "default";
    clearSelectedList();
    isDragging.value = false;
    isResizing.value = false;
    resizeEdge.value = null;
  }

  function mouseleave(event) {
    gl.canvas.style.cursor = "default";
    clearSelectedList();
    shapeStore.clearHoveredShape();
    isDragging.value = false;
    isResizing.value = false;
    resizeEdge.value = null;
  }

  gl.canvas.addEventListener('mousemove', mousemove);
  gl.canvas.addEventListener('mousedown', mousedown);
  gl.canvas.addEventListener('mouseleave', mouseleave);
  gl.canvas.addEventListener('mouseup', mouseup);


  function cleanup() {
    gl.canvas.removeEventListener('mousemove', mousemove);
    // gl.canvas.removeEventListener('dragstart', drag);
    gl.canvas.removeEventListener('mousedown', drag);
    // gl.canvas.removeEventListener('mousemove', onMouseMove);
    // gl.canvas.removeEventListener('mouseup', onMouseUp);
    // gl.canvas.removeEventListener('mouseleave', onMouseLeave);
    // window.removeEventListener('resize', onResize);
  }

  return {
    newShapePosX: newShapePosX.value,
    newShapePosY: newShapePosY.value,
    c_pos: c_pos.value,
    cleanup
  };
}