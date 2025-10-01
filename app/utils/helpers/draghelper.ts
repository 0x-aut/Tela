import { ref } from 'vue';
import { updateUniforms } from '../webgl/render';
import { useGlobalStore } from '../../stores/global';
import { useShapeStore } from '../../stores/shapeStore'
import type { Shape } from '~/shared/types/ShapeTypes/Shape';
import type { Camera } from '../webgl/camera';



export function useDragHelper(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  renderFunction:() => void,
  camera?: Camera,
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
  const c_pos = ref("0,0") 
  var _key = ref("")

  function mousemove(event) {
    const rect = gl.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert to world coordinates if camera is available
    let worldX = mouseX;
    let worldY = mouseY;
    if (camera) {
      const worldPos = camera.screenToWorld(mouseX, mouseY);
      worldX = worldPos.x;
      worldY = worldPos.y;
    }

    if (!isDragging.value) {
      gl.canvas.style.cursor = "default";
      globalStore.change_pos(mouseX, mouseY);
      globalStore.changeTranslation(mouseX, mouseY);

      // Check if mouse is hovering over any shape (in world space)
      let hoveredShapeKey = "";
      for (const key in shapeStore.shapes) {
        if (!shapeStore.shapes[key]) continue;

        var shapeX = shapeStore.shapes[key].coordX;
        var shapeY = shapeStore.shapes[key].coordY;
        var shapeH = shapeStore.shapes[key].height;
        var shapeW = shapeStore.shapes[key].width;

        // Check if mouse is within shape bounds (world coordinates)
        if ((worldX >= (shapeX - shapeW/2)) && (worldX <= (shapeX + shapeW/2)) &&
            (worldY >= (shapeY - shapeH/2)) && (worldY <= (shapeY + shapeH/2))) {
          hoveredShapeKey = key;
        }
      }

      // Update hovered shape in store
      if (hoveredShapeKey) {
        shapeStore.setHoveredShape(hoveredShapeKey);
        gl.canvas.style.cursor = "pointer";
      } else {
        shapeStore.clearHoveredShape();
        gl.canvas.style.cursor = "default";
      }

      renderFunction();
    }
    if(isDragging.value) {
      // Use world coordinates for dragging
      shapeStore.editShape(_key.value, {coordX: worldX, coordY: worldY});
      renderFunction()
    }
  }

  function clearSelectedList() {
    var _length = Object.keys(selected_shapes.value).length;
    for (const key in selected_shapes.value) {
      delete selected_shapes.value[key] // check this later
    }
  }

  function mousedown(event) {
    const rect = gl.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert to world coordinates if camera is available
    let worldX = mouseX;
    let worldY = mouseY;
    if (camera) {
      const worldPos = camera.screenToWorld(mouseX, mouseY);
      worldX = worldPos.x;
      worldY = worldPos.y;
    }

    for (const key in shapeStore.shapes) {

      if (!shapeStore.shapes[key]) {
        console.log("Shapes from store has issues")
        return
      }

      var shapeX = shapeStore.shapes[key].coordX;
      var shapeY = shapeStore.shapes[key].coordY;
      var shapeH = shapeStore.shapes[key].height;
      var shapeW = shapeStore.shapes[key].width;


      // We need to filter the shapes based on the positions here (world coordinates)
      // Because of the center of the shape
      if ((worldX >= (shapeX - shapeW/2)) && (worldX <= (shapeX + shapeW/2)) && (worldY >= (shapeY - shapeH/2)) && (worldY <= (shapeY + shapeH/2))) {
        selected_shapes.value[key] = shapeStore.shapes[key]
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

    isDragging.value = true;
    gl.canvas.style.cursor = "pointer";


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
  }

  function mouseleave(event) {
    gl.canvas.style.cursor = "default";
    clearSelectedList();
    shapeStore.clearHoveredShape();
    isDragging.value = false;
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