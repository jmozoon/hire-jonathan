'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

interface Orb3DProps {
  state: 'idle' | 'listening' | 'speaking';
  volume?: number;
  className?: string;
}

const noise3D = createNoise3D();

function AnimatedSphere({ state: orbState, volume = 0 }: { state: string; volume: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Create icosahedron geometry with more detail for smoother deformation
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1, 4); // radius 1, detail 4
  }, []);

  // Store original positions for morphing
  const originalPositions = useMemo(() => {
    return geometry.attributes.position.array.slice();
  }, [geometry]);

  // Animation state
  const time = useRef(0);
  const targetIntensity = useRef(0);
  const currentIntensity = useRef(0);

  useFrame((frameState, delta) => {
    if (!meshRef.current) return;

    time.current += delta;
    
    // Update target intensity based on state and volume
    switch (orbState) {
      case 'idle':
        targetIntensity.current = 0.05;
        break;
      case 'listening':
        targetIntensity.current = 0.15 + (volume * 0.3);
        break;
      case 'speaking':
        targetIntensity.current = 0.25 + (volume * 0.5);
        break;
      default:
        targetIntensity.current = 0.05;
    }

    // Smooth intensity interpolation
    currentIntensity.current = THREE.MathUtils.lerp(
      currentIntensity.current,
      targetIntensity.current,
      delta * 2
    );

    // Apply noise-based deformation
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];
      const z = originalPositions[i + 2];

      // Create organic movement with noise
      const noiseScale = 0.5;
      const timeScale = orbState === 'speaking' ? 2.0 : 1.0;
      
      const noise = noise3D(
        x * noiseScale,
        y * noiseScale + time.current * timeScale,
        z * noiseScale
      );

      const displacement = noise * currentIntensity.current;
      
      // Apply displacement along the normal (radial direction)
      const length = Math.sqrt(x * x + y * y + z * z);
      positions[i] = x + (x / length) * displacement;
      positions[i + 1] = y + (y / length) * displacement;
      positions[i + 2] = z + (z / length) * displacement;
    }

    geometry.attributes.position.needsUpdate = true;

    // Rotation based on state
    if (orbState === 'speaking') {
      meshRef.current.rotation.y += delta * 0.5;
    } else {
      meshRef.current.rotation.y += delta * 0.1;
    }
    
    meshRef.current.rotation.x += delta * 0.05;
  });

  // Scale based on viewport for responsiveness
  const scale = Math.min(viewport.width, viewport.height) * 0.3;

  return (
    <mesh ref={meshRef} geometry={geometry} scale={[scale, scale, scale]}>
      <meshBasicMaterial 
        color="#ffffff" 
        wireframe 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
}

function Scene({ state, volume }: { state: string; volume: number }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Main animated sphere */}
      <AnimatedSphere state={state} volume={volume} />
      
      {/* Background particles for additional visual interest */}
      <Stars />
    </>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 200;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a sphere around the orb
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial 
        color="#ffffff" 
        size={0.02} 
        transparent 
        opacity={0.3}
      />
    </points>
  );
}

export default function AnimatedOrb3D({ state, volume = 0, className = '' }: Orb3DProps) {
  return (
    <div className={`w-96 h-96 ${className}`}>
      <Canvas
        camera={{ 
          position: [0, 0, 4], 
          fov: 45,
          near: 0.1,
          far: 100
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          premultipliedAlpha: false
        }}
      >
        <Scene state={state} volume={volume} />
      </Canvas>
    </div>
  );
}