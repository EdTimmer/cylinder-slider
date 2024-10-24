precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  
  float a = smoothstep(-0.7, 0.0, vPosition.z);
  
  gl_FragColor = vec4(vPosition, a);

  #include <colorspace_fragment>    
}