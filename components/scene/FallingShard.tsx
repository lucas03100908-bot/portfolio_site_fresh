"use client";

import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FallingShardData } from "@/lib/types";

const ThreeLine = extend(THREE.Line);

export default function FallingShard({
  shard,
  onDone,
}: {
  shard: FallingShardData;
  onDone: (id: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const velocityRef = useRef<[number, number, number]>([...shard.velocity]);

  const positions = useMemo(() => {
    const arr = new Float32Array(shard.points.length * 3);
    shard.points.forEach((p, i) => {
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    return arr;
  }, [shard.points]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    const elapsedMs = clock.elapsedTime * 1000 - shard.createdAt;
    const lifeT = Math.max(0, 1 - elapsedMs / shard.lifeMs);

    if (lifeT <= 0) {
      onDone(shard.id);
      return;
    }

    const v = velocityRef.current;
    ref.current.position.x += v[0] * delta;
    ref.current.position.y += v[1] * delta;
    ref.current.position.z += v[2] * delta;

    v[1] -= 2.5 * delta;

    ref.current.rotation.x += shard.spin[0] * delta;
    ref.current.rotation.y += shard.spin[1] * delta;
    ref.current.rotation.z += shard.spin[2] * delta;

    const line = ref.current.children[0] as THREE.Line;
    const mat = line.material as THREE.LineBasicMaterial;
    mat.opacity = lifeT * 0.95;
  });

  return (
    <group ref={ref}>
      <ThreeLine>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#f4fbff" transparent opacity={0.95} />
      </ThreeLine>
    </group>
  );
}
