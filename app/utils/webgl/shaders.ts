export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  var shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader
  } else {
    throw new Error("An error occured while compiling the shader")
  }
  
}

export function getShaderLogs(gl: WebGL2RenderingContext, shader: WebGLShader) {
  console.log(gl.getShaderInfoLog(shader));
}

export function deleteShader(gl: WebGL2RenderingContext, shader: WebGLShader) {
  gl.deleteShader(shader);
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  var program = gl.createProgram();
    if (!program) throw new Error("Cannot find program")
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program
    } else {
      throw new Error("An error occured while compiling the program")
    }
  
}

export function getProgramLogs(gl: WebGL2RenderingContext, program: WebGLProgram) {
  console.log(gl.getProgramInfoLog(program))
}

export function deleteProgram(gl: WebGL2RenderingContext, program: WebGLProgram) {
  gl.deleteProgram(program);
}

