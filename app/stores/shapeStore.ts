// This will serve as a global store for the rendered shapes and their functions
// This is to connect them to the backend, I estimate like 4 hours tops to make this work 
// with drag included in the demo - INPROGRESS
// Then we work on resizing the shape: 2 hours tops
// Then we work on login and signup
// Then we work on saving the shapes to convex and pulling them from convex to be drawn
// Then we work on creating a dynamic link

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Shape } from '../shared/types/ShapeTypes/Shape';
import { Rectangle } from '../shared/types/ShapeTypes/Rectangle';

export const useShapeStore = defineStore(
  'shapeStore',
  () => {
    const shapes = ref<Record<string, Shape|Rectangle>>({});
    const select_shape = ref<string>(""); // Or it could simply be a string pointing to the shapes
    // Shapes will be something like: { "rect-1": Shape(x, y, h, w), }

    function selectShape(shape_id: string) {
      select_shape.value = shape_id;
    }

    function addShape(shape: Shape|Rectangle) {
      console.log(`${shape.coordX}, ${shape.coordY}`)
      var _length = Object.keys(shapes.value).length;
      shapes.value[`${shape.id}-${_length+1}`] = shape
    }

    function editShape(shape_id: string, partial_shape: Partial<Shape> | Partial<Rectangle>) {
      if (!shapes.value[shape_id]) {
        console.log("Shape with id not found")
        return
      }
      Object.assign(shapes.value[shape_id], partial_shape)
      console.log("changed shape coords")
    }

    function removeShape(shape_id: string) {
      // if (Object.keys(shapes.value).length === 0) {
      //   shapes.value = {};
      // }
      if(shapes.value[shape_id]) {
        delete shapes.value[shape_id];
      }
    }

    function deleteAllShapes() {
      for (const key in shapes.value) {
        delete shapes.value[key];
      }
    }

    return { 
      shapes, addShape, deleteAllShapes, removeShape, editShape, select_shape, selectShape
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(), // We will use indexedDB later but this works for now.
    }
  }
)