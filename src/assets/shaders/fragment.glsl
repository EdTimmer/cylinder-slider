precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Define inner and outer edges for the fade effect
  float innerEdge = 0.7;  // Start of fade
  float outerEdge = 0.95; // End of fade (discard beyond this)

  // Absolute Y-position to handle both edges
  float absY = abs(vPosition.y);

  // Discard fragments beyond the outer edge
  if (absY > outerEdge) {
    discard;
  }

  // Calculate opacity using smoothstep
  float opacity = smoothstep(outerEdge, innerEdge, absY);

  // Sample the texture
  vec4 color = texture2D(uTexture, vUv);

  // Apply opacity and premultiply RGB
  color.a *= opacity;
  color.rgb *= color.a;

  gl_FragColor = color;

  // Include color space conversion and tone mapping
  #include <colorspace_fragment>
}