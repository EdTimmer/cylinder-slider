import { useEffect, useRef, useState } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
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
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const planeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    const virtualScroll = new VirtualScroll();

    const handleScroll = (event: any) => {
      const newScrollY = scrollY + event.deltaY;
      setScrollProgress(event.deltaY / 100); // Track scroll progress

      setScrollY(newScrollY); // Track scroll position
  
      // Update progress based on scroll
      planeRefs.current.forEach((plane, index) => {
        if (plane) {
          const material = plane.material as THREE.ShaderMaterial;
          // material.wireframe = true; // Enable wireframe mode
  
          // Update the "progress" uniform based on scroll delta
          if (material.uniforms.progress) {
            material.uniforms.progress.value = newScrollY * 0.001 + 2.5 * index; // Adjust value based on scroll position
          }
        }
      });
    };

    virtualScroll.on(handleScroll);
  
    return () => {
      virtualScroll.off(handleScroll); // Correctly remove the event listener
    };
  }, [scrollY]);

  // Update the plane position in the `useFrame` hook
  // useFrame(() => {
  //   planeRefs.current.forEach((plane, index) => {
  //     if (plane) {
  //       const initialY = 3 - index * 2.5; // Spacing the planes vertically
  //       plane.position.y = initialY + scrollY * 0.001; // Scroll moves planes up/down
  //     }
  //   });
  // });

  const planePositions: [number, number, number][] = [
    [0, 8, 0],   // First plane (highest)
    [0, 4, 0],   // Second plane (middle)
    [0, 0, 0],   // Third plane (lowest)
  ];
  // make empty array with 3 elements
  const planes = new Array(5).fill(null);
  console.log('scrollProgress :>> ', scrollProgress);
  return (
    <>
      {planes.map((_, index) => (
        <mesh
          key={index}
          // position={[0, 6 - index * 2.5, 0]}
          ref={(ref) => (planeRefs.current[index] = ref)} // Store ref for each plane
        >
          <planeGeometry args={[3, 1.6, 100, 100]} />
          <planeMaterial attach="material" />
        </mesh>
      ))}
    </>
  );
}

export default PlaneComponent;
