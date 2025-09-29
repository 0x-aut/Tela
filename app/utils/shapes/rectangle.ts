import { setupBuffer } from '../webgl/setbuffer';

export function drawRectangle(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  positionX: number,
  positionY: number,
  width: number = 100,
  height: number = 100
): WebGLVertexArrayObject {
  var x1 = positionX;
  var x2 = positionX + width;
  var y1 = positionY;
  var y2 = positionY + height;
  const positions = new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ])
  // const positions = new Float32Array([
  //   -50, -50, // Bottom-left
  //   50, -50, // Bottom-right
  //   -50, 50, // Top-left
  //   -50, 50, // Top-left (triangle 2)
  //   50, -50, // Bottom-right (triangle 2)
  //   50, 50, // Top-right
  // ]);
  const vao = setupBuffer(gl, program, positions);

  return vao
}