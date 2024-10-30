import { forwardRef, useEffect, useRef, useState } from 'react';
import { shaderMaterial, useCursor } from '@react-three/drei';
import { extend, ReactThreeFiber, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh } from 'three';
import planeVertexShader from '../../assets/shaders/vertex.glsl?raw';
import planeFragmentShader from '../../assets/shaders/fragment.glsl?raw';
import VirtualScroll from 'virtual-scroll';

const PanelMaterial = shaderMaterial(
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

// Set default material properties on the prototype
Object.assign(PanelMaterial.prototype, {
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  premultipliedAlpha: true,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneMinusSrcAlphaFactor,
});

// Make shader material available in JSX
extend({ PanelMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      panelMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof PanelMaterial>;
    }
  }
}

interface Props {
  index: number;
  position: [number, number, number];
  handlePlaneClick: (e: ThreeEvent<MouseEvent>) => void;
}

const Panel = forwardRef<Mesh, Props>(({ index, position, handlePlaneClick }: Props, ref) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh
      key={index}
      position={position}
      ref={ref}
      onClick={handlePlaneClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[2.2, 1.2, 100, 100]} />
      <panelMaterial attach="material" />
    </mesh>
  );
});

export default Panel;

