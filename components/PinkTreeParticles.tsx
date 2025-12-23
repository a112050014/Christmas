
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_CONFIG } from '../constants';

const vertexShader = `
  uniform float uTime;
  uniform float uBrightness;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aRandom; // 新增隨機屬性
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    
    // 增加粒子的隨機閃爍感
    float flicker = sin(uTime * (1.0 + aRandom * 2.0) + position.y * 2.0) * 0.3 + 0.7;
    vOpacity = flicker * uBrightness * (0.6 + aRandom * 0.4);

    // 微弱的螺旋上升感
    vec3 pos = position;
    float angle = uTime * 0.2 + position.y * 0.5;
    pos.x += sin(angle) * 0.05;
    pos.z += cos(angle) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // 縮小粒子尺寸，讓它們看起來像細碎的星塵
    gl_PointSize = aSize * (150.0 / -mvPosition.z) * flicker;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    // 讓粒子邊緣更乾淨，中心更實，避免模糊成團
    if (r > 0.5) discard;
    
    float strength = pow(1.0 - r * 2.0, 2.5);
    gl_FragColor = vec4(vColor, strength * vOpacity);
  }
`;

interface Props {
  brightness: number;
}

const PinkTreeParticles: React.FC<Props> = ({ brightness }) => {
  const meshRef = useRef<THREE.Points>(null);
  const count = TREE_CONFIG.count;

  const { positions, sizes, colors, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const c = new Float32Array(count * 3);
    const r = new Float32Array(count);

    const colorCore = new THREE.Color(TREE_CONFIG.colorCore);
    const colorHighlight = new THREE.Color(TREE_CONFIG.colorHighlight);
    const colorEdge = new THREE.Color(TREE_CONFIG.colorEdge);

    for (let i = 0; i < count; i++) {
      // 樹狀分佈
      const h = Math.random() * 7.5;
      const radius = (1 - h / 7.5) * 3.2 * Math.pow(Math.random(), 0.6);
      const angle = Math.random() * Math.PI * 2;

      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = h - 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      s[i] = Math.random() * 1.5 + 0.5; // 減小粒子基礎大小
      r[i] = Math.random();

      const mixRatio = Math.random();
      const finalColor = new THREE.Color();
      if (mixRatio < 0.7) {
        finalColor.lerpColors(colorCore, colorHighlight, Math.random());
      } else {
        finalColor.lerpColors(colorHighlight, colorEdge, Math.random());
      }
      
      c[i * 3 + 0] = finalColor.r;
      c[i * 3 + 1] = finalColor.g;
      c[i * 3 + 2] = finalColor.b;
    }
    return { positions: pos, sizes: s, colors: c, randoms: r };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBrightness: { value: 1.0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uBrightness.value = brightness;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default PinkTreeParticles;
