precision mediump float;

uniform float progress;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.1415926535897932384626433832795;

vec3 rotateX(vec3 pos, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
        pos.x,
        c * pos.y - s * pos.z,
        s * pos.y + c * pos.z
    );
}

void main() {    
    vUv = uv;
    vec3 pos = position;

    pos.y += progress;
    // pos = rotateX(pos, progress);
    pos = rotateX(pos, cos(smoothstep(-2.0, 2.0, pos.y) * PI));
    vPosition = pos;

    // vec3 vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    // vPosition = vWorldPosition;

    // vWorldPosition.z += 0.2 * sin(vWorldPosition.y * 2.0);

    vec3 vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);  
}