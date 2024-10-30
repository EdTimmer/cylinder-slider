import { useEffect, useRef, useState } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import planeVertexShader from '../../assets/shaders/vertex.glsl?raw';
import planeFragmentShader from '../../assets/shaders/fragment.glsl?raw';
import VirtualScroll from 'virtual-scroll';
import Panel from '../Panel/Panel';

// const ScrollCylinderMaterial = shaderMaterial(
//   {
//     time: 0,
//     color: new THREE.Color(0.0, 0.0, 0.0),
//     progress: 0.0,
//     pos: 0.0,
//     uTexture: null,
//   },
//   planeVertexShader,
//   planeFragmentShader
// );

// // Set default material properties on the prototype
// Object.assign(ScrollCylinderMaterial.prototype, {
//   transparent: true,
//   depthWrite: false,
//   blending: THREE.CustomBlending,
//   premultipliedAlpha: true,
//   blendEquation: THREE.AddEquation,
//   blendSrc: THREE.OneFactor,
//   blendDst: THREE.OneMinusSrcAlphaFactor,
// });

// // Make shader material available in JSX
// extend({ PlaneMaterial: ScrollCylinderMaterial });

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       planeMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof ScrollCylinderMaterial>;
//     }
//   }
// }

interface Props {
  setSelectedPlane: (index: number) => void;
}

const ScrollCylinder = ({setSelectedPlane}: Props) => {
  const initialScrollY = 0;
  const [scrollY, setScrollY] = useState(initialScrollY);
  // const [clickedPlane, setClickedPlane] = useState<number | null>(null);
  const [clmpScrollY, setClmpScrollY] = useState(initialScrollY);


  const planeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const texturePaths = [
    '/images/water_01.jpg',
    '/images/landscape_01.jpg',
    '/images/forest_01.jpg',
    '/images/water_02.jpg',
  ];

  const textures = useLoader(THREE.TextureLoader, texturePaths);

  const planeSpacing = 1.3;
  const totalPlanes = texturePaths.length;

  // Calculate the scroll boundaries (based on the number of planes)
  const minScroll = -6000; // No scroll beyond the first plane
  // const maxScroll = (totalPlanes - 1) * planeSpacing * 3000; // Max scroll amount based on the total number of planes
  
  // TO DO: Replace next line with a formula that calculates the max scroll based on the total number of planes
  const maxScroll = 6000;

  useEffect(() => {
    if (textures) {
      // Once the texture is loaded, assign it to each plane's material and set isTextureReady to true
      planeRefs.current.forEach((plane, index) => {
        if (plane) {
          const material = plane.material as THREE.ShaderMaterial;
          material.uniforms.uTexture.value = textures[index]; // Set texture as uniform
          // Align first plane with initial scroll position
          material.uniforms.progress.value = -1.0 * (initialScrollY * 0.001 + planeSpacing * index);
          
          material.needsUpdate = true; // Force update to re-render

          // Store the plane's index in userData
          plane.userData = { index };
          // console.log('plane.userData.index :>> ', plane.userData.index);
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
      setClmpScrollY(clampedScrollY);
      
      setScrollY(clampedScrollY); // Track scroll position
  
      // Update progress based on scroll
      planeRefs.current.forEach((plane, index) => {
        if (plane) {
          const material = plane.material as THREE.ShaderMaterial;
          // material.wireframe = true; // Enable wireframe mode
  
          // Update the "progress" uniform based on scroll delta
          if (material.uniforms.progress) {
            material.uniforms.progress.value = -1.0 * (clampedScrollY * 0.001 + planeSpacing * index);
            // plane.position.y = -clampedScrollY * 0.001 + index * planeSpacing;
            // console.log('plane.position.y :>> ', plane.position.y);
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
  // const planes = new Array(texturePaths.length).fill(null);
  const planes = [1, 2, 3, 4]
  // console.log('scrollProgress :>> ', scrollProgress);
  // console.log('scrollY :>> ', scrollY);

  // Handle plane click event
  // const handlePlaneClick = (event: ThreeEvent<MouseEvent>) => {
  //   event.stopPropagation();
  //   // console.log('event :>> ', event);
  //   // console.log('event.object.material.uniforms.uTexture.value.source.data.currentSrc :>> ', event.object.material.uniforms.uTexture.value.source.data.currentSrc);

  //   const clickedIndex = event.object.userData.index;
  //   console.log('clickedIndex :>> ', clickedIndex);

  // };
  const handlePlaneClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const clickedIndex = event.eventObject.userData.index;
    setSelectedPlane(clickedIndex);
  };

  return (
    <>
      {planes.map((plane, index) => {
        // const positionY = 0; // Keep Y position same if desired
        const positionY = -clmpScrollY * 0.001 + planeSpacing * index;
        const position: [number, number, number] = [0, positionY, index * 0.01]; // Slightly offset in Z to prevent z-fighting

        return (
          <Panel
            key={index}
            index={index}
            position={position}
            handlePlaneClick={handlePlaneClick}
            ref={(ref) => {
              planeRefs.current[index] = ref;
              if (ref) {
                ref.userData.index = index;
              }
            }}
          />
        );
      })}
    </>
  );
}

export default ScrollCylinder;

