precision mediump float;

// uniform float progress;

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
    // vUv = uv;
    // vec3 pos = position;

    // // Get the mesh's world position
    // vec3 meshPosition = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    // // Convert vertex position to world space
    // vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;


    // vec3 localPos = pos;
    // // localPos = rotateX(localPos, cos(smoothstep(-2.0, 2.0, localPos.y) * PI * 1.1));

    // vPosition = localPos;

    // // Convert back to world space by adding meshPosition
    // vec3 finalPos = pos + meshPosition - vec3(0.0, 0.0, 0.0);

    // gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);  

    vUv = uv;

    // Compute the world position of the vertex
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    // Parameters for the bulge effect
    float bulgeAmount = 4.0;    // Adjust this to control bulge depth
    float bulgeCenterY = 0.0;   // Y-coordinate in world space where bulge is centered
    float bulgeWidth = 1.2;     // Controls how wide the bulge effect is along the Y-axis

    // Calculate the distance from the bulge center along the Y-axis
    float yDistance = worldPosition.y - bulgeCenterY;

    // // Compute the bulge factor using a Gaussian function for smoothness
    // float bulgeFactor = bulgeAmount * exp(-pow(yDistance / bulgeWidth, 2.0));

    // Compute the bulge factor using a semicircular profile
    float ratio = yDistance / bulgeWidth;
    float bulgeFactor = bulgeAmount * sqrt(max(0.0, 1.0 - ratio * ratio));

    // Apply the bulge effect to the Z-coordinate in world space
    worldPosition.z += bulgeFactor;

    // Store the modified position for potential use in the fragment shader
    vPosition = worldPosition.xyz;

    // Transform the modified world position to clip space
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}

