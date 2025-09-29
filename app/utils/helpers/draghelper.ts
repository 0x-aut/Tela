import { ref } from 'vue';
import { updateUniforms } from '../webgl/render';
import { useGlobalStore } from '../../stores/global';



export function useDragHelper(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  renderFunction:() => void,
  options: Record<any, any> = {}
) {
  const globalStore = useGlobalStore()
  // We get position of retangle to drag
  const shapePosX = ref<number>(options.shapePosX);
  const shapePosY = ref<number>(options.shapePosY);
  var newShapePosX = shallowRef(shapePosX.value);
  var newShapePosY = shallowRef(shapePosY.value);
  const shapeHeight = ref<number>(options.shapeHeight);
  const shapeWidth = ref<number>(options.shapeWidth);

  // We want to make the drag function so we can drag
  // Drag function will change the positioning which we have to return
  const isDragging = ref<boolean>(false);
  const c_pos = ref("0,0") 

  function mousemove(event) {
    if (!isDragging.value) return
    // First we get the mouse coordinates
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    globalStore.change_pos(mouseX, mouseY);
    globalStore.changeTranslation(mouseX, mouseY);
    renderFunction()
  }

  function mousedown(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (mouseX >= (shapePosX.value - shapeWidth.value/2) && mouseX <= shapePosX.value + (shapeWidth.value/2) &&
      mouseY >= (shapePosY.value -shapeHeight.value/2) && mouseY <= shapePosY.value + (shapeHeight.value/2)) {
        isDragging.value = true
        gl.canvas.style.cursor = "pointer";
        // alert(`shape pos: ${shapePosX.value} ${shapePosY.value}`)
        // alert("clicked box")
        console.log(`isDragging: ${isDragging.value}`)
        newShapePosX.value = mouseX
        newShapePosY.value = mouseY
    } else {
      isDragging.value = false
      gl.canvas.style.cursor = "default"
      // alert("clicked no box")
    }
    // alert(`isdrag: ${isDragging.value}`)
    // alert(`mouse pos: ${mouseX} ${mouseY}`)
    // alert(`shape pos: ${shapePosX.value} ${shapePosY.value}`)
  }

  function mouseup(event) {
    // alert("mouseup triggered")
    isDragging.value = false;
  }

  function mouseleave(event) {
    // alert("mouseleave triggered")
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