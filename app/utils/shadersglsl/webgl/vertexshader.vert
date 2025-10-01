#version 300 es
in vec2 a_position; // This is the input position in array we want our shape to have
uniform vec2 u_resolution;
uniform mat3 u_viewMatrix;
out vec2 v_position;


// void main() {
//   vec2 transformedPosition = (u_viewMatrix * vec3(a_position, 1.0)).xy;
//   vec2 zeroToOne = transformedPosition / u_resolution;
//   vec2 zeroToTwo = zeroToOne * 2.0;
//   vec2 clipSpace = zeroToTwo - 1.0;
//   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // Flip Y-axis
// }

void main() {
  // Pass position to fragment shader
  v_position = a_position;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}