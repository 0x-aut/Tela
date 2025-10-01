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

  // Create triangle fan for circle
  // Center point
  const centerX = positionX;
  const centerY = positionY;

  // Generate vertices around the circle
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      // First triangle
      positions.push(centerX, centerY);
      positions.push(x, y);
    } else if (i < segments) {
      // Middle triangles
      positions.push(centerX, centerY);
      const prevAngle = ((i - 1) / segments) * Math.PI * 2;
      const prevX = centerX + Math.cos(prevAngle) * radius;
      const prevY = centerY + Math.sin(prevAngle) * radius;
      positions.push(prevX, prevY);
      positions.push(x, y);
    } else {
      // Last triangle to close the circle
      positions.push(centerX, centerY);
      const prevAngle = ((i - 1) / segments) * Math.PI * 2;
      const prevX = centerX + Math.cos(prevAngle) * radius;
      const prevY = centerY + Math.sin(prevAngle) * radius;
      positions.push(prevX, prevY);
      const firstAngle = 0;
      const firstX = centerX + Math.cos(firstAngle) * radius;
      const firstY = centerY + Math.sin(firstAngle) * radius;
      positions.push(firstX, firstY);
    }
  }

  const positionsArray = new Float32Array(positions);
  const vao = setupBuffer(gl, program, positionsArray);

  return vao;
}

export function getCircleVertexCount(segments: number = 64): number {
  return segments * 3; // Each segment creates a triangle (3 vertices)
}
