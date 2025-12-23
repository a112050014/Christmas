
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BaseRings: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z += 0.005 * (i + 1);
      });
    }
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      {[3.5, 4.2, 5.0].map((radius, i) => (
        <mesh key={i}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}
    </group>
  );
};

export default BaseRings;
