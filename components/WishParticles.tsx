
import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Wish } from '../types';

interface Props {
  wish: Wish;
  onArrival: () => void;
}

const WishParticles: React.FC<Props> = ({ wish, onArrival }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [arrived, setArrived] = useState(false);
  const startTime = useRef(Date.now());
  const duration = 3000; // 3 seconds flight

  const count = 200;
  const { positions, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      off[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      off[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      off[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions: pos, offsets: off };
  }, []);

  useFrame(() => {
    if (arrived) return;
    const elapsed = Date.now() - startTime.current;
    const t = Math.min(elapsed / duration, 1);

    // Ease-in-out quintic
    const easedT = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

    // Arc trajectory from bottom [5, -5, 5] to top [0, 7.5, 0]
    const startPos = new THREE.Vector3(5, -2, 5);
    const endPos = new THREE.Vector3(0, 7.5, 0);
    const controlPoint = new THREE.Vector3(10, 8, 0);

    // Quadratic Bezier
    const currentBase = new THREE.Vector3()
      .copy(startPos).multiplyScalar(Math.pow(1 - easedT, 2))
      .add(new THREE.Vector3().copy(controlPoint).multiplyScalar(2 * (1 - easedT) * easedT))
      .add(new THREE.Vector3().copy(endPos).multiplyScalar(Math.pow(easedT, 2)));

    if (pointsRef.current) {
      const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 0] = currentBase.x + offsets[i * 3 + 0];
        array[i * 3 + 1] = currentBase.y + offsets[i * 3 + 1];
        array[i * 3 + 2] = currentBase.z + offsets[i * 3 + 2];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (t >= 1 && !arrived) {
      setArrived(true);
      onArrival();
    }
  });

  if (arrived) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        color="#ffffff" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default WishParticles;
