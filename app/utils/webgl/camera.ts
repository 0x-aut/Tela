/* This is camera code for making an infinite canvas work
here we are going to have the zoom, position and offset values for the user
this will be maniuplated via events on the mouse and all of that
*/

export function Camera(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  resolutionUniformLocation: WebGLUniformLocation | null,
  viewMatrixUniformLocation: WebGLUniformLocation | null,
  canvas: HTMLCanvasElement | null = null, // An optional param
  options: Record<any, any> | null = null
) {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.SCISSOR_TEST);

  //Compute perspective projection matrix
  

}