import './App.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import PlaneComponent from './components/PlaneComponent/PlaneComponent';
import { useState } from 'react';

function App() {
  const [selectedPlane, setSelectedPlane] = useState<number | null>(null);
  return (
    <div className='page-container'>
      <div className="plane">
        <Canvas gl={{ antialias: true }}> 
          <PerspectiveCamera makeDefault fov={20} position={[0, 0, 13]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 10]} />
          <PlaneComponent setSelectedPlane={setSelectedPlane} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      <div className="info">{selectedPlane !== null ? `Plane ${selectedPlane} selected` : 'No plane selected'}</div>
      
    </div>
  )
}

export default App;
