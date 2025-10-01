import { Camera } from './camera';

export function updateUniforms(
  gl: WebGL2RenderingContext,
  resolutionUniformLocation: WebGLUniformLocation | null,
  viewMatrixUniformLocation: WebGLUniformLocation | null,
  camera?: Camera,
  canvas: HTMLCanvasElement | null = null,
  options: Record<any, any> | null = null
) {
  if (!resolutionUniformLocation || !viewMatrixUniformLocation) return
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  if (camera) {
    // Use camera's view matrix for infinite canvas
    const viewMatrix = camera.getViewMatrix();
    gl.uniformMatrix3fv(viewMatrixUniformLocation, false, viewMatrix);
  } else if (!options) {
    // Default view matrix (centered, no zoom)
    const viewMatrix = [
      1, 0, 0,
      0, 1, 0,
      gl.canvas.width/2, gl.canvas.height/2, 1
    ];
    gl.uniformMatrix3fv(viewMatrixUniformLocation, false, viewMatrix);
  } else {
    // Custom options-based view matrix (legacy support)
    const viewMatrix = [
      1, 0, 0,
      0, 1, 0,
      options.shapePosX, options.shapePosY, 1
    ]
    gl.uniformMatrix3fv(viewMatrixUniformLocation, false, viewMatrix);
  }
}