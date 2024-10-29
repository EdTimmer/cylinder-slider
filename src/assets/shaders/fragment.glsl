precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // // Define inner and outer edges for the fade effect
  // float innerEdge = 0.7;  // Y-position where opacity starts to decrease
  // float outerEdge = 0.75; // Y-position where fragments are fully discarded

  // // Calculate the absolute Y-position to handle both top and bottom edges
  // float absY = abs(vPosition.y);

  // // Discard fragments beyond the outer edge
  // if (absY > outerEdge) {
  //   discard;
  // }

  // // Calculate opacity using smoothstep between inner and outer edges
  // float opacity = smoothstep(outerEdge, innerEdge, absY);

  // // Sample the texture at the given UV coordinates
  // vec4 color = texture2D(uTexture, vUv);

  // // Apply the calculated opacity to the fragment color
  // gl_FragColor = vec4(color.rgb, color.a * opacity);

  // // Include color space conversion and tone mapping
  // #include <colorspace_fragment>
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