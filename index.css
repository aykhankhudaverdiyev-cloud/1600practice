import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGeometry({ position, color, speed, size, type }: {
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
  type: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torus' | 'torusKnot';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
    meshRef.current.rotation.y += speed * 0.003;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.2;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'icosahedron': return <icosahedronGeometry args={[size, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[size, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[size, 0]} />;
      case 'torus': return <torusGeometry args={[size, size * 0.4, 16, 32]} />;
      case 'torusKnot': return <torusKnotGeometry args={[size * 0.7, size * 0.2, 64, 16]} />;
    }
  }, [size, type]);

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 600;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const hue = 0.6 + Math.random() * 0.15;
      color.setHSL(hue, 0.8, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);
  const colAttr = useMemo(() => new THREE.BufferAttribute(colors, 3), [colors]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
        <primitive attach="attributes-color" object={colAttr} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <MeshWobbleMaterial
        color="#4f46e5"
        transparent
        opacity={0.04}
        wireframe
        factor={0.3}
        speed={1}
      />
    </mesh>
  );
}

export default function Scene3D({ variant = 'hero' }: { variant?: 'hero' | 'background' | 'minimal' }) {
  const shapes: Array<{
    position: [number, number, number];
    color: string;
    speed: number;
    size: number;
    type: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torus' | 'torusKnot';
  }> = variant === 'hero' ? [
    { position: [-4, 2, -2], color: '#818cf8', speed: 1.2, size: 0.8, type: 'icosahedron' },
    { position: [4, -1, -3], color: '#a78bfa', speed: 0.8, size: 1.0, type: 'octahedron' },
    { position: [-3, -2, -1], color: '#c084fc', speed: 1.0, size: 0.6, type: 'dodecahedron' },
    { position: [3, 2.5, -2], color: '#60a5fa', speed: 0.6, size: 0.7, type: 'torus' },
    { position: [0, -3, -4], color: '#34d399', speed: 0.9, size: 0.5, type: 'torusKnot' },
    { position: [-5, 0, -5], color: '#f472b6', speed: 0.7, size: 0.9, type: 'icosahedron' },
    { position: [5, 1, -4], color: '#22d3ee', speed: 1.1, size: 0.4, type: 'octahedron' },
  ] : [
    { position: [-6, 3, -5], color: '#818cf8', speed: 0.5, size: 0.5, type: 'icosahedron' },
    { position: [6, -2, -6], color: '#a78bfa', speed: 0.3, size: 0.7, type: 'octahedron' },
    { position: [0, 4, -7], color: '#60a5fa', speed: 0.4, size: 0.4, type: 'dodecahedron' },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#818cf8" />
      <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#a78bfa" />

      <ParticleField />
      {variant === 'hero' && <GlowingSphere />}

      {shapes.map((shape, i) => (
        <FloatingGeometry key={i} {...shape} />
      ))}
    </Canvas>
  );
}
