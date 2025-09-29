export function setupBuffer(gl: WebGL2RenderingContext, program: WebGLProgram, positions: Float32Array): WebGLVertexArrayObject {
  
  const positionAttributeLocation: number = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var vao = gl.createVertexArray();

  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset
  )

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  
  return vao
}