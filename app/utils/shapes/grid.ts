import { Camera } from '../webgl/camera';

export function drawGrid(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  camera: Camera,
  gridSpacing: number = 50,
  lineThickness: number = 1
): WebGLVertexArrayObject | null {
  const bounds = camera.getVisibleBounds();
  const canvasWidth = gl.canvas.width;
  const canvasHeight = gl.canvas.height;

  // Calculate grid line positions in world space
  const startX = Math.floor(bounds.minX / gridSpacing) * gridSpacing;
  const startY = Math.floor(bounds.minY / gridSpacing) * gridSpacing;
  const endX = Math.ceil(bounds.maxX / gridSpacing) * gridSpacing;
  const endY = Math.ceil(bounds.maxY / gridSpacing) * gridSpacing;

  const vertices: number[] = [];

  // Vertical lines
  for (let x = startX; x <= endX; x += gridSpacing) {
    // Each line is a thin rectangle (2 triangles = 6 vertices)
    const x1 = x - lineThickness / 2;
    const x2 = x + lineThickness / 2;
    const y1 = bounds.minY;
    const y2 = bounds.maxY;

    // Triangle 1
    vertices.push(x1, y1);
    vertices.push(x2, y1);
    vertices.push(x1, y2);
    // Triangle 2
    vertices.push(x1, y2);
    vertices.push(x2, y1);
    vertices.push(x2, y2);
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSpacing) {
    const x1 = bounds.minX;
    const x2 = bounds.maxX;
    const y1 = y - lineThickness / 2;
    const y2 = y + lineThickness / 2;

    // Triangle 1
    vertices.push(x1, y1);
    vertices.push(x2, y1);
    vertices.push(x1, y2);
    // Triangle 2
    vertices.push(x1, y2);
    vertices.push(x2, y1);
    vertices.push(x2, y2);
  }

  if (vertices.length === 0) return null;

  // Create VAO and buffer
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Create color buffer (light gray)
  const colors: number[] = [];
  const gridColor = [0.3, 0.3, 0.3, 0.3]; // Subtle gray color
  for (let i = 0; i < vertices.length / 2; i++) {
    colors.push(...gridColor);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

  return vao;
}

export function getGridVertexCount(camera: Camera, gridSpacing: number = 50): number {
  const bounds = camera.getVisibleBounds();

  const startX = Math.floor(bounds.minX / gridSpacing) * gridSpacing;
  const endX = Math.ceil(bounds.maxX / gridSpacing) * gridSpacing;
  const startY = Math.floor(bounds.minY / gridSpacing) * gridSpacing;
  const endY = Math.ceil(bounds.maxY / gridSpacing) * gridSpacing;

  const verticalLines = Math.floor((endX - startX) / gridSpacing) + 1;
  const horizontalLines = Math.floor((endY - startY) / gridSpacing) + 1;

  return (verticalLines + horizontalLines) * 6; // 6 vertices per line (2 triangles)
}
