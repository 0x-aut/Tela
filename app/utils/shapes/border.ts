import { setupBuffer } from '../webgl/setbuffer';

export function drawBorder(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  positionX: number,
  positionY: number,
  width: number,
  height: number,
  borderWidth: number = 2
): WebGLVertexArrayObject {
  const halfBorder = borderWidth / 2;

  // Outer rectangle (with border)
  const outerX1 = positionX - halfBorder;
  const outerX2 = positionX + width + halfBorder;
  const outerY1 = positionY - halfBorder;
  const outerY2 = positionY + height + halfBorder;

  // Inner rectangle (without border)
  const innerX1 = positionX + halfBorder;
  const innerX2 = positionX + width - halfBorder;
  const innerY1 = positionY + halfBorder;
  const innerY2 = positionY + height - halfBorder;

  // Create border as 4 rectangles (top, right, bottom, left)
  const positions = new Float32Array([
    // Top border
    outerX1, outerY1,
    outerX2, outerY1,
    outerX1, innerY1,
    outerX1, innerY1,
    outerX2, outerY1,
    outerX2, innerY1,

    // Right border
    innerX2, innerY1,
    outerX2, innerY1,
    innerX2, outerY2,
    innerX2, outerY2,
    outerX2, innerY1,
    outerX2, outerY2,

    // Bottom border
    outerX1, innerY2,
    outerX2, innerY2,
    outerX1, outerY2,
    outerX1, outerY2,
    outerX2, innerY2,
    outerX2, outerY2,

    // Left border
    outerX1, innerY1,
    innerX1, innerY1,
    outerX1, outerY2,
    outerX1, outerY2,
    innerX1, innerY1,
    innerX1, outerY2,
  ]);

  const vao = setupBuffer(gl, program, positions);
  return vao;
}

export function drawCircleBorder(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  centerX: number,
  centerY: number,
  radius: number,
  borderWidth: number = 2,
  segments: number = 60
): WebGLVertexArrayObject {
  const positions: number[] = [];
  const outerRadius = radius + borderWidth / 2;
  const innerRadius = radius - borderWidth / 2;

  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    // Outer points
    const outerX1 = centerX + Math.cos(angle1) * outerRadius;
    const outerY1 = centerY + Math.sin(angle1) * outerRadius;
    const outerX2 = centerX + Math.cos(angle2) * outerRadius;
    const outerY2 = centerY + Math.sin(angle2) * outerRadius;

    // Inner points
    const innerX1 = centerX + Math.cos(angle1) * innerRadius;
    const innerY1 = centerY + Math.sin(angle1) * innerRadius;
    const innerX2 = centerX + Math.cos(angle2) * innerRadius;
    const innerY2 = centerY + Math.sin(angle2) * innerRadius;

    // First triangle
    positions.push(outerX1, outerY1);
    positions.push(outerX2, outerY2);
    positions.push(innerX1, innerY1);

    // Second triangle
    positions.push(innerX1, innerY1);
    positions.push(outerX2, outerY2);
    positions.push(innerX2, innerY2);
  }

  const positionsArray = new Float32Array(positions);
  const vao = setupBuffer(gl, program, positionsArray);
  return vao;
}

export function getCircleBorderVertexCount(segments: number = 60): number {
  return segments * 6; // 6 vertices per segment (2 triangles)
}
