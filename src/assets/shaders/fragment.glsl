precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  float a = smoothstep(-1.2, -0.8, vPosition.z);
  
  gl_FragColor = vec4(color.xyz, a);

  #include <colorspace_fragment>    
}