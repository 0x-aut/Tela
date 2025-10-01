#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

in vec4 inColor;
uniform float u_opacity;
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Use opacity uniform for alpha channel
  outColor = vec4(1, 1, 1, u_opacity);
  // outColor = inColor;
}
