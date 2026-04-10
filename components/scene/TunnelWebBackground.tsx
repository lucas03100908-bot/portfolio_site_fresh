"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function buildTunnelWebPoints({
  rings,
  spokes,
  radius,
  seed,
}: {
  rings: number;
  spokes: number;
  radius: number;
  seed: number;
}) {
  const rand = (n: number) => {
    const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453123;
    return x - Math.floor(x);
  };

  const ringPoints: THREE.Vector3[][] = [];

  for (let r = 1; r <= rings; r++) {
    const ring: THREE.Vector3[] = [];
    const tR = r / rings;
    const ringRadius = radius * Math.pow(tR, 1.12);

    for (let s = 0; s < spokes; s++) {
      const tS = s / spokes;
      const angle = tS * Math.PI * 2;
      const waviness = 0.88 + rand(r * 100 + s) * 0.24;
      const localRadius = ringRadius * waviness;

      ring.push(
        new THREE.Vector3(
          Math.cos(angle) * localRadius,
          Math.sin(angle) * localRadius,
          0
        )
      );
    }

    ringPoints.push(ring);
  }

  const ringSegments: Float32Array[] = [];
  const spokeSegments: Float32Array[] = [];

  for (let r = 0; r < ringPoints.length; r++) {
    const pts = ringPoints[r];
    const sampled: number[] = [];
    for (let s = 0; s <= spokes; s++) {
      const p = pts[s % spokes];
      sampled.push(p.x, p.y, p.z);
    }
    ringSegments.push(new Float32Array(sampled));
  }

  for (let s = 0; s < spokes; s++) {
    const sampled: number[] = [0, 0, 0];
    for (let r = 0; r < ringPoints.length; r++) {
      const p = ringPoints[r][s];
      sampled.push(p.x, p.y, p.z);
    }
    spokeSegments.push(new Float32Array(sampled));
  }

  return { ringSegments, spokeSegments };
}

function TunnelWebLayer({
  z,
  scale,
  rotationZ,
  offsetX,
  offsetY,
  opacity,
  glowOpacity,
  speed,
  seed,
  dimmed,
}: {
  z: number;
  scale: number;
  rotationZ: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  glowOpacity: number;
  speed: number;
  seed: number;
  dimmed: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  const { ringSegments, spokeSegments } = useMemo(
    () =>
      buildTunnelWebPoints({
        rings: 9,
        spokes: 14,
        radius: 5.2,
        seed,
      }),
    [seed]
  );

  useFrame((state) => {
    if (!ref.current) return;

    const px = state.pointer.x;
    const py = state.pointer.y;

    ref.current.rotation.z =
      rotationZ +
      Math.sin(state.clock.elapsedTime * 0.12 + seed) * 0.04 +
      px * 0.08;

    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * speed + seed) * 0.06 + px * 0.05;

    ref.current.rotation.x = py * 0.05;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      offsetX + px * 0.22,
      0.05
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      offsetY + py * 0.18,
      0.05
    );
  });

  const finalOpacity = dimmed ? opacity * 0.28 : opacity;
  const finalGlowOpacity = dimmed ? glowOpacity * 0.22 : glowOpacity;

  return (
    <group ref={ref} position={[offsetX, offsetY, z]} scale={scale}>
      {ringSegments.map((seg, i) => (
        <group key={`ring-${i}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[seg, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#7fc6df"
              transparent
              opacity={finalGlowOpacity * 0.45}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[seg, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#b8d7e4"
              transparent
              opacity={finalOpacity * 0.42}
              depthWrite={false}
            />
          </line>
        </group>
      ))}

      {spokeSegments.map((seg, i) => (
        <group key={`spoke-${i}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[seg, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#7fc6df"
              transparent
              opacity={finalGlowOpacity * 0.38}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[seg, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#b8d7e4"
              transparent
              opacity={finalOpacity * 0.36}
              depthWrite={false}
            />
          </line>
        </group>
      ))}
    </group>
  );
}

export default function TunnelWebBackground({ dimmed }: { dimmed: boolean }) {
  const layers = [
    {
      z: -6,
      scale: 1.15,
      rotationZ: 0.02,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.08,
      glowOpacity: 0.022,
      speed: 0.18,
      seed: 1,
    },
    {
      z: -8.5,
      scale: 1.38,
      rotationZ: 0.08,
      offsetX: 0.08,
      offsetY: -0.04,
      opacity: 0.07,
      glowOpacity: 0.02,
      speed: 0.16,
      seed: 2,
    },
    {
      z: -11.5,
      scale: 1.7,
      rotationZ: 0.14,
      offsetX: -0.14,
      offsetY: 0.06,
      opacity: 0.06,
      glowOpacity: 0.018,
      speed: 0.14,
      seed: 3,
    },
    {
      z: -15,
      scale: 2.08,
      rotationZ: 0.22,
      offsetX: 0.16,
      offsetY: 0.02,
      opacity: 0.05,
      glowOpacity: 0.015,
      speed: 0.12,
      seed: 4,
    },
    {
      z: -19,
      scale: 2.55,
      rotationZ: 0.28,
      offsetX: -0.12,
      offsetY: -0.08,
      opacity: 0.04,
      glowOpacity: 0.012,
      speed: 0.1,
      seed: 5,
    },
    {
      z: -24,
      scale: 3.15,
      rotationZ: 0.34,
      offsetX: 0.06,
      offsetY: 0.05,
      opacity: 0.03,
      glowOpacity: 0.01,
      speed: 0.08,
      seed: 6,
    },
  ];

  return (
    <>
      {layers.map((layer) => (
        <TunnelWebLayer key={layer.seed} {...layer} dimmed={dimmed} />
      ))}
    </>
  );
}
