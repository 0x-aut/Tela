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

export function setOpacityUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  opacity: number
) {
  const opacityLocation = gl.getUniformLocation(program, "u_opacity");
  if (opacityLocation) {
    gl.uniform1f(opacityLocation, opacity);
  }
}


export function setBorderRadiusUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  borderRadius: number
) {
  const borderRadiusLocation = gl.getUniformLocation(program, "u_borderRadius");
  if (borderRadiusLocation) {
    gl.uniform1f(borderRadiusLocation, borderRadius);
  }
}

export function setShapeSizeUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  width: number,
  height: number
) {
  const shapeSizeLocation = gl.getUniformLocation(program, "u_shapeSize");
  if (shapeSizeLocation) {
    gl.uniform2f(shapeSizeLocation, width, height);
  }
}