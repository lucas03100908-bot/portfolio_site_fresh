"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function AtmosphereParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 460;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    let seed = 123;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      const r = 5 + random() * 11;
      const theta = random() * Math.PI * 2;
      const spreadY = (random() - 0.5) * 8;
      const z = -2.5 - random() * 18;

      pos[i * 3] = Math.cos(theta) * r * (0.45 + random() * 0.75);
      pos[i * 3 + 1] = spreadY;
      pos[i * 3 + 2] = z;

      const mix = random();
      color.setRGB(0.68 + mix * 0.18, 0.82 + mix * 0.12, 0.95 + mix * 0.05);

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.06) * 0.04;
    pointsRef.current.rotation.y += 0.0002;
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.14) * 0.08;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}
