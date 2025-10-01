#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

in vec4 inColor;
in vec2 v_position;
uniform float u_opacity;
uniform float u_borderRadius;
uniform vec2 u_shapeSize;
// we need to declare an output for the fragment shader
out vec4 outColor;


float roundedBoxSDF(vec2 position, vec2 size, float radius) {
  return length(max(abs(position)-size+radius,0.0))-radius;
}

void main() {
  // Just set the output to a constant redish-purple
  // Calculate position relative to center of shape
  vec2 centerPos = v_position - u_shapeSize * 0.5;
  // Calculate distance to rounded rectangle edge
  float distance = roundedBoxSDF(centerPos, u_shapeSize * 0.5, u_borderRadius);

  // Apply anti-aliasing with smoothstep
  float alpha = 1.0 - smoothstep(-1.0, 1.0, distance);

  // Use opacity uniform for alpha channel
  outColor = vec4(0.7, 0.7, 1, alpha * u_opacity);
  // outColor = inColor;
}