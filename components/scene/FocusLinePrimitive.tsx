"use client";

import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneMode } from "@/lib/types";

const ThreeLine = extend(THREE.Line);

export default function FocusLinePrimitive({
  start,
  sceneMode,
  transitionRef,
}: {
  start: [number, number, number];
  sceneMode: SceneMode;
  transitionRef: React.RefObject<number>;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...start), [start]);
  
  const positionsRef = useRef(new Float32Array(6));

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(positionsRef.current, 3)
      );
    }
  }, []);

  useFrame(() => {
    if (!lineRef.current || !geometryRef.current) return;

    const rawT = transitionRef.current ?? 0;
    const t = rawT * rawT * (3 - 2 * rawT);

    if (sceneMode === "line-focus") {
      endVec.set(
        THREE.MathUtils.lerp(startVec.x, 0, t),
        THREE.MathUtils.lerp(startVec.y, 0, t),
        THREE.MathUtils.lerp(startVec.z, 0, t)
      );
    } else if (sceneMode === "core-birth" || sceneMode === "focused") {
      endVec.set(0, 0, 0);
    } else {
      endVec.copy(startVec);
    }

    const pos = positionsRef.current;
    pos[0] = startVec.x;
    pos[1] = startVec.y;
    pos[2] = startVec.z;
    pos[3] = endVec.x;
    pos[4] = endVec.y;
    pos[5] = endVec.z;

    const attr = geometryRef.current.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    
    if (attr) {
      attr.needsUpdate = true;
    }

    const material = lineRef.current.material as THREE.LineBasicMaterial;

    const targetOpacity =
      sceneMode === "line-focus"
        ? THREE.MathUtils.lerp(0, 0.95, t)
        : sceneMode === "core-birth"
        ? THREE.MathUtils.lerp(0.95, 0.28, t)
        : sceneMode === "focused"
        ? 0.18
        : 0;

    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      targetOpacity,
      0.18
    );
  });

  return (
    <ThreeLine ref={lineRef}>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color="#ffffff" transparent opacity={0} />
    </ThreeLine>
  );
}
