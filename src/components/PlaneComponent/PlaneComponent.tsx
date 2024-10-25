import { useEffect, useRef, useState } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import planeVertexShader from '../../assets/shaders/vertex.glsl?raw';
import planeFragmentShader from '../../assets/shaders/fragment.glsl?raw';
import VirtualScroll from 'virtual-scroll';

const PlaneMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.0, 0.0, 0.0),
    progress: 0.0,
    pos: 0.0,
    uTexture: null,
  },
  planeVertexShader,
  planeFragmentShader
);

// Make shader material available in JSX
extend({ PlaneMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      planeMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof PlaneMaterial>;
    }
  }
}

const PlaneComponent = () => {
  const initialScrollY = 0;
  const [scrollY, setScrollY] = useState(initialScrollY);
  const [clickedPlane, setClickedPlane] = useState<number | null>(null);


  const planeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const texturePaths = [
    '/images/water_01.jpg',
    '/images/landscape_01.jpg',
    '/images/forest_01.jpg',
    '/images/water_02.jpg',
  ];

  const textures = useLoader(THREE.TextureLoader, texturePaths);

  const planeSpacing = 1.8;
  const totalPlanes = texturePaths.length;

  // Calculate the scroll boundaries (based on the number of planes)
  const minScroll = -6000; // No scroll beyond the first plane
  // const maxScroll = (totalPlanes - 1) * planeSpacing * 3000; // Max scroll amount based on the total number of planes
  
  // TO DO: Replace next line with a formula that calculates the max scroll based on the total number of planes
  const maxScroll = 320;

  useEffect(() => {
    if (textures) {
      // Once the texture is loaded, assign it to each plane's material and set isTextureReady to true
      planeRefs.current.forEach((plane, index) => {
        if (plane) {
          const material = plane.material as THREE.ShaderMaterial;
          material.uniforms.uTexture.value = textures[index]; // Set texture as uniform
          material.uniforms.progress.value = -1.0 * (initialScrollY * 0.001 + planeSpacing * index);
          material.needsUpdate = true; // Force update to re-render

          // Store the plane's index in userData
          plane.userData = { index };
          console.log('plane.userData.index :>> ', plane.userData.index);
        }
      });
    }
  }, [textures]);

  useEffect(() => {
    const virtualScroll = new VirtualScroll({
   
      mouseMultiplier: 0.5,
      touchMultiplier: 2.5,
      firefoxMultiplier: 30,

    });

    const handleScroll = (event: any) => {
      const newScrollY = scrollY + event.deltaY;

      // Clamp the scrollY value to prevent scrolling beyond the first and last plane
      const clampedScrollY = Math.min(Math.max(newScrollY, minScroll), maxScroll);

      setScrollY(clampedScrollY); // Track scroll position
  
      // Update progress based on scroll
      planeRefs.current.forEach((plane, index) => {
        if (plane) {
          const material = plane.material as THREE.ShaderMaterial;
          // material.uniforms.uTexture.value = texture;
          // material.wireframe = true; // Enable wireframe mode
  
          // Update the "progress" uniform based on scroll delta
          if (material.uniforms.progress) {
            material.uniforms.progress.value = -1.0 * (clampedScrollY * 0.001 + planeSpacing * index);
          }
        }
      });
    };

    virtualScroll.on(handleScroll);
  
    return () => {
      virtualScroll.off(handleScroll); // Correctly remove the event listener
    };
  }, [scrollY]);


  // make empty array with 5 elements
  const planes = new Array(texturePaths.length).fill(null);
  // console.log('scrollProgress :>> ', scrollProgress);
  // console.log('scrollY :>> ', scrollY);

  // Handle plane click event
  const handlePlaneClick = (event: ThreeEvent<MouseEvent>, num: number) => {
    event.stopPropagation();

    // Retrieve the plane's index from userData
    const clickedIndex = event.object.userData.index; // Use object.userData to access the correct index
    setClickedPlane(clickedIndex);

    console.log(`Plane ${num} clicked`);
  };

  return (
    <>
      {planes.map((_, index) => (
        <mesh
          key={index}
          // position={[0, 6 - index * 2.5, 0]}
          // position={[0, 6 - index * planeSpacing, 0]}
          ref={(ref) => (planeRefs.current[index] = ref)} // Store ref for each plane
          onClick={(e) => handlePlaneClick(e, planeRefs.current[index]?.userData.index)}         
        >
          <planeGeometry args={[3, 1.6, 100, 100]} />
          <planeMaterial attach="material" />
        </mesh>
      ))}
    </>
  );
}

export default PlaneComponent;

