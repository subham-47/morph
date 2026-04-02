import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface CrystalSceneProps {
  activeSystem: string;
  showAxes: boolean;
  showPlanes: boolean;
  showRotation: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const CrystalMesh = ({ activeSystem, isPlaying, setIsPlaying }: any) => {
  const crystalRef = useRef<THREE.Mesh>(null);

  // Animate the rotation when the user clicks "Animate C4"
  useEffect(() => {
    if (isPlaying && crystalRef.current) {
      gsap.to(crystalRef.current.rotation, {
        y: crystalRef.current.rotation.y + Math.PI / 2, // Rotate exactly 90 degrees
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => setIsPlaying(false) // Reset button when done
      });
    }
  }, [isPlaying, setIsPlaying]);

  // Determine the shape based on the crystal system
  let geometry;
  switch (activeSystem) {
    case 'tetragonal':
      geometry = <boxGeometry args={[1.5, 3, 1.5]} />;
      break;
    case 'orthorhombic':
      geometry = <boxGeometry args={[1.5, 3, 2]} />;
      break;
    case 'hexagonal':
      geometry = <cylinderGeometry args={[1.5, 1.5, 3, 6]} />;
      break;
    case 'isometric':
    default:
      geometry = <boxGeometry args={[2, 2, 2]} />;
      break;
  }

  return (
    <mesh ref={crystalRef}>
      {geometry}
      {/* Translucent Glass Material */}
      <meshPhysicalMaterial 
        color="#a0c0ff"
        transmission={0.9} 
        opacity={1}
        transparent
        roughness={0.1}
        metalness={0.1}
        ior={1.5} 
        side={THREE.DoubleSide}
      />
      <Edges scale={1} threshold={15} color="#1e3a8a" /> 
    </mesh>
  );
};

export default function CrystalScene({ 
  activeSystem, showAxes, showPlanes, showRotation, isPlaying, setIsPlaying 
}: CrystalSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
        
        {/* WE WRAPPED EVERYTHING IN SUSPENSE TO PREVENT THE CRASH! */}
        <Suspense fallback={null}>
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" /> 
          
          <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={10} />

          <group>
            <CrystalMesh activeSystem={activeSystem} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

            {showAxes && (
              <group>
                <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 4]} /><meshBasicMaterial color="#ef4444" /></mesh>
                <mesh><cylinderGeometry args={[0.02, 0.02, 4]} /><meshBasicMaterial color="#22c55e" /></mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 4]} /><meshBasicMaterial color="#3b82f6" /></mesh>
              </group>
            )}

            {showPlanes && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.5, 3.5]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
                <Edges scale={1} color="#059669" />
              </mesh>
            )}

            {showRotation && (
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 5]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
            )}
          </group>

        </Suspense>
      </Canvas>
    </div>
  );
}
