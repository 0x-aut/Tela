import { setupBuffer } from '../webgl/setbuffer';

export function drawLine(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  positionX: number,
  positionY: number,
  length: number = 100,
  thickness: number = 2,
  angle: number = 45 // Default 45 degrees
): WebGLVertexArrayObject {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;

  // Calculate half dimensions
  const halfLength = length / 2;
  const halfThickness = thickness / 2;

  // Calculate the four corners of the line rectangle (rotated)
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Unrotated corners relative to center
  const corners = [
    { x: -halfLength, y: -halfThickness }, // Bottom-left
    { x: halfLength, y: -halfThickness },  // Bottom-right
    { x: -halfLength, y: halfThickness },  // Top-left
    { x: halfLength, y: halfThickness },   // Top-right
  ];

  // Rotate and translate corners
  const rotatedCorners = corners.map(corner => ({
    x: positionX + (corner.x * cos - corner.y * sin),
    y: positionY + (corner.x * sin + corner.y * cos),
  }));

  // Create two triangles to form rectangle
  const positions = new Float32Array([
    rotatedCorners[0].x, rotatedCorners[0].y, // Bottom-left
    rotatedCorners[1].x, rotatedCorners[1].y, // Bottom-right
    rotatedCorners[2].x, rotatedCorners[2].y, // Top-left
    rotatedCorners[2].x, rotatedCorners[2].y, // Top-left
    rotatedCorners[1].x, rotatedCorners[1].y, // Bottom-right
    rotatedCorners[3].x, rotatedCorners[3].y, // Top-right
  ]);

  const vao = setupBuffer(gl, program, positions);

  return vao;
}
