
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import PinkTreeParticles from './PinkTreeParticles';
import SnowParticles from './SnowParticles';
import BaseRings from './BaseRings';
import WishParticles from './WishParticles';
import { Wish } from '../types';

interface Props {
  wishes: Wish[];
  onWishArrive: () => void;
  treeBrightness: number;
}

const StarTop: React.FC<{ brightness: number }> = ({ brightness }) => {
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.6;
    const innerRadius = 0.25;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.15,
    bezelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 3
  };

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh position={[0, 7.5, 0]} rotation={[0, 0, 0]}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial 
          emissive="#ff80ab" 
          emissiveIntensity={8 * brightness} 
          color="#ff80ab" 
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
};

const PinkParticleTreeScene: React.FC<Props> = ({ wishes, onWishArrive, treeBrightness }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle constant rotation
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff80ab" />

      <group ref={groupRef}>
        {/* The Christmas Tree */}
        <PinkTreeParticles brightness={treeBrightness} />
        
        {/* Base Decorations */}
        <BaseRings />

        {/* Tree Top Star */}
        <StarTop brightness={treeBrightness} />
      </group>

      {/* Background & Interactive Elements */}
      <SnowParticles />
      
      {wishes.map((wish) => (
        <WishParticles 
          key={wish.id} 
          wish={wish} 
          onArrival={() => onWishArrive()} 
        />
      ))}

      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={30} 
        makeDefault 
      />
    </>
  );
};

export default PinkParticleTreeScene;
