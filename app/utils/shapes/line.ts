import { setupBuffer } from '../webgl/setbuffer';

export function drawLine(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  thickness: number = 2
): WebGLVertexArrayObject {
  // Calculate the direction vector
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    // If start and end are the same, draw a small horizontal line
    endX = startX + 100;
  }

  // Calculate perpendicular vector for thickness
  const angle = Math.atan2(endY - startY, endX - startX);
  const perpAngle = angle + Math.PI / 2;
  const halfThickness = thickness / 2;
  const offsetX = Math.cos(perpAngle) * halfThickness;
  const offsetY = Math.sin(perpAngle) * halfThickness;

  // Calculate the four corners of the line rectangle
  const x1 = startX + offsetX;
  const y1 = startY + offsetY;
  const x2 = startX - offsetX;
  const y2 = startY - offsetY;
  const x3 = endX + offsetX;
  const y3 = endY + offsetY;
  const x4 = endX - offsetX;
  const y4 = endY - offsetY;

  // Create two triangles to form rectangle
  const positions = new Float32Array([
    x1, y1, // Top-left of start
    x2, y2, // Bottom-left of start
    x3, y3, // Top-left of end
    x2, y2, // Bottom-left of start
    x4, y4, // Bottom-left of end
    x3, y3, // Top-left of end
  ]);

  const vao = setupBuffer(gl, program, positions);

  return vao;
}
