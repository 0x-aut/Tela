export function updateUniforms(
  gl: WebGL2RenderingContext,
  resolutionUniformLocation: WebGLUniformLocation | null,
  viewMatrixUniformLocation: WebGLUniformLocation | null,
  canvas: HTMLCanvasElement | null = null, // An optional param
  options: Record<any, any> | null = null
) {
  if (!resolutionUniformLocation || !viewMatrixUniformLocation) return
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)


  if (!options) {
    const viewMatrix = [
      1, 0, 0,
      0, 1, 0,
      gl.canvas.width/2, gl.canvas.height/2, 1 
    ];
    gl.uniformMatrix3fv(viewMatrixUniformLocation, false, viewMatrix);
  } else {
    const viewMatrix = [
      1, 0, 0,
      0, 1, 0,
      options.shapePosX, options.shapePosY 
    ]
    console.log(`Options: ${options.shapePosX} ${options.shapePosY}`)
    // gl.uniformMatrix3fv(viewMatrixUniformLocation, false, viewMatrix);
  }
}