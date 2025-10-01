import { setupBuffer } from '../webgl/setbuffer';

export function drawTriangle(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  positionX: number,
  positionY: number,
  width: number = 100,
  height: number = 100
): WebGLVertexArrayObject {
  // Create an equilateral-ish triangle
  // Top vertex
  const topX = positionX;
  const topY = positionY - height / 2;

  // Bottom left vertex
  const bottomLeftX = positionX - width / 2;
  const bottomLeftY = positionY + height / 2;

  // Bottom right vertex
  const bottomRightX = positionX + width / 2;
  const bottomRightY = positionY + height / 2;

  const positions = new Float32Array([
    topX, topY,
    bottomLeftX, bottomLeftY,
    bottomRightX, bottomRightY,
  ]);

  const vao = setupBuffer(gl, program, positions);

  return vao;
}
