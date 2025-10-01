import { setupBuffer } from '../webgl/setbuffer';

export function drawCircle(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  positionX: number,
  positionY: number,
  radius: number = 50
): WebGLVertexArrayObject {
  const segments = 64; // Number of segments to approximate circle
  const positions: number[] = [];

  const centerX = positionX;
  const centerY = positionY;

  // Create triangles to form a complete circle
  for (let i = 0; i < segments; i++) {
    // Center point
    positions.push(centerX, centerY);

    // First point on the circle
    const angle1 = (i / segments) * Math.PI * 2;
    const x1 = centerX + Math.cos(angle1) * radius;
    const y1 = centerY + Math.sin(angle1) * radius;
    positions.push(x1, y1);

    // Second point on the circle
    const angle2 = ((i + 1) / segments) * Math.PI * 2;
    const x2 = centerX + Math.cos(angle2) * radius;
    const y2 = centerY + Math.sin(angle2) * radius;
    positions.push(x2, y2);
  }

  const positionsArray = new Float32Array(positions);
  const vao = setupBuffer(gl, program, positionsArray);

  return vao;
}

export function getCircleVertexCount(segments: number = 64): number {
  return segments * 3; // Each segment creates a triangle (3 vertices)
}
