"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import PreviewBridge from "@/components/ui/PreviewBridge";
import ProjectMediaCard from "@/components/ui/ProjectMediaCard";
import AnimatedGradientBackground from "@/components/scene/AnimatedGradientBackground";
import DepthBackdrop from "@/components/scene/DepthBackdrop";
import AtmosphereParticles from "@/components/scene/AtmosphereParticles";
import TunnelWebBackground from "@/components/scene/TunnelWebBackground";
import FallingShardLayer from "@/components/scene/FallingShardLayer";
import FocusLinePrimitive from "@/components/scene/FocusLinePrimitive";
import {
  categoryMap,
  categoryOrder,
  categorySpinMap,
  mainCategories,
  menuToCategory,
} from "@/lib/constants";
import {
  CategoryInfo,
  CategoryKey,
  EdgeType,
  FallingShardData,
  HoverPreviewState,
  NodeType,
  SceneMode,
} from "@/lib/types";

const ThreeLine = extend(THREE.Line);

function CameraDirector({
  sceneMode,
  transitionRef,
}: {
  sceneMode: SceneMode;
  transitionRef: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 7), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    const t = transitionRef.current ?? 0;

    if (sceneMode === "camera-in") {
      target.set(0, 0, THREE.MathUtils.lerp(7, 1.85, t));
    } else if (sceneMode === "line-focus") {
      target.set(0, 0, 1.85);
    } else if (sceneMode === "core-birth") {
      target.set(0, 0, 1.42);
    } else if (sceneMode === "focused") {
      target.set(0, 0, 1.22);
    } else {
      target.set(0, 0, 7);
    }

    camera.position.lerp(target, 0.06);
    camera.lookAt(lookTarget);
  });

  return null;
}

function makeBezierSamples(
  start: THREE.Vector3,
  end: THREE.Vector3,
  sceneMode: SceneMode
) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const downward = new THREE.Vector3(0, -1, 0);
  const dist = start.distanceTo(end);
  const control = mid.addScaledVector(
    downward,
    dist * (sceneMode === "idle" ? 0.28 : 0.16)
  );

  const out: [number, number, number][] = [];
  const sample = new THREE.Vector3();

  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    sample.set(0, 0, 0);
    sample.addScaledVector(start, (1 - t) * (1 - t));
    sample.addScaledVector(control, 2 * (1 - t) * t);
    sample.addScaledVector(end, t * t);
    out.push([sample.x, sample.y, sample.z]);
  }

  return out;
}

function createSphereNodes(count: number, radius: number): NodeType[] {
  const arr: NodeType[] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const category = categoryOrder[i % categoryOrder.length];

    arr.push({
      id: i,
      surfacePosition: [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ],
      category,
    });
  }
  return arr;
}

function createEdges(nodes: NodeType[], neighborCount: number): EdgeType[] {
  const result: EdgeType[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    const aVec = new THREE.Vector3(...nodes[i].surfacePosition);

    const neighbors = nodes
      .map((node, j) => {
        if (i === j) return null;
        const bVec = new THREE.Vector3(...node.surfacePosition);
        return { index: j, dist: aVec.distanceTo(bVec) };
      })
      .filter((item): item is { index: number; dist: number } => item !== null)
      .sort((x, y) => x.dist - y.dist)
      .slice(0, neighborCount);

    for (const n of neighbors) {
      const j = n.index;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const a = nodes[i];
      const b = nodes[j];

      result.push({
        id: key,
        a,
        b,
        mid: [
          (a.surfacePosition[0] + b.surfacePosition[0]) / 2,
          (a.surfacePosition[1] + b.surfacePosition[1]) / 2,
          (a.surfacePosition[2] + b.surfacePosition[2]) / 2,
        ],
      });
    }
  }

  return result;
}

function PrismNode({
  info,
  isDimmed,
  isSelected,
}: {
  info: CategoryInfo;
  isDimmed: boolean;
  isSelected: boolean;
}) {
  const mainOpacity = isDimmed ? 0.14 : isSelected ? 1 : 0.96;
  const shellOpacity = isDimmed ? 0.06 : isSelected ? 0.55 : 0.48;
  const glowOpacity = isDimmed ? 0.04 : isSelected ? 0.22 : 0.16;
  const emissive = isDimmed ? 0.12 : isSelected ? 1.5 : 1.2;
  const rimEmissive = isDimmed ? 0.08 : isSelected ? 0.9 : 0.65;

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.05, 18, 18]} />
        <meshPhysicalMaterial
          color={isDimmed ? "#5f6770" : info.core}
          emissive={isDimmed ? "#3a4148" : info.mid}
          emissiveIntensity={emissive}
          roughness={0.08}
          metalness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transmission={isDimmed ? 0.06 : 0.42}
          thickness={0.7}
          ior={1.25}
          iridescence={isDimmed ? 0.12 : 1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 380]}
          transparent
          opacity={mainOpacity}
        />
      </mesh>

      <mesh scale={[1.28, 1.28, 1.28]} rotation={[0.6, 0.8, 0.2]}>
        <icosahedronGeometry args={[0.042, 0]} />
        <meshPhysicalMaterial
          color={isDimmed ? "#6c7480" : info.rim}
          emissive={isDimmed ? "#3b4248" : info.mid}
          emissiveIntensity={rimEmissive}
          roughness={0.02}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transmission={isDimmed ? 0.04 : 0.25}
          thickness={0.3}
          ior={1.35}
          iridescence={isDimmed ? 0.08 : 1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[180, 520]}
          transparent
          opacity={shellOpacity}
        />
      </mesh>

      <mesh scale={[0.58, 0.58, 0.58]} position={[-0.014, 0.015, 0.018]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isDimmed ? 0.03 : 0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[1.55, 1.55, 1.55]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial
          color={isDimmed ? "#55606c" : info.rim}
          transparent
          opacity={glowOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function DepthNode({
  node,
  camera,
  size,
  hoveredCategory,
  selectedCategory,
  menuHoveredCategory,
  sceneMode,
  setHoveredCategory,
  setHoverPreview,
  onNodeClick,
  suppressClickRef,
  pointerDriftRef,
}: {
  node: NodeType;
  camera: THREE.Camera;
  size: { width: number; height: number };
  hoveredCategory: CategoryKey | null;
  selectedCategory: CategoryKey | null;
  menuHoveredCategory: CategoryKey | null;
  sceneMode: SceneMode;
  setHoveredCategory: (category: CategoryKey | null) => void;
  setHoverPreview: (value: HoverPreviewState) => void;
  onNodeClick: (category: CategoryKey) => void;
  suppressClickRef: React.RefObject<boolean>;
  pointerDriftRef: React.RefObject<THREE.Vector2>;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const prismShellRef = useRef<THREE.Mesh>(null);
  const info = categoryMap[node.category];
  const surfacePosition = useMemo(
    () => new THREE.Vector3(...node.surfacePosition),
    [node.surfacePosition]
  );

  const tempWorld = useMemo(() => new THREE.Vector3(), []);
  const tempCam = useMemo(() => new THREE.Vector3(), []);
  const tempProjected = useMemo(() => new THREE.Vector3(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const wobbleSeed = useMemo(
    () => (node.id * 0.1234) % (Math.PI * 2),
    [node.id]
  );

  const isSelected = selectedCategory === node.category;
  const isDimmed = sceneMode !== "idle" && !isSelected;

  const updatePreviewPosition = useCallback(() => {
    if (!rootRef.current) return;

    rootRef.current.getWorldPosition(tempWorld);
    tempProjected.copy(tempWorld).project(camera);

    const x = (tempProjected.x * 0.5 + 0.5) * size.width;
    const y = (-tempProjected.y * 0.5 + 0.5) * size.height;
    const side: "left" | "right" = x > size.width * 0.55 ? "left" : "right";

    setHoverPreview({
      category: node.category,
      x,
      y,
      side,
    });
  }, [
    camera,
    node.category,
    setHoverPreview,
    size.height,
    size.width,
    tempProjected,
    tempWorld,
  ]);

  useFrame((state) => {
    if (!rootRef.current) return;

    const drift = pointerDriftRef.current;
    const wobbleMul = isDimmed ? 0.4 : 1;
    const wobbleX =
      (Math.sin(state.clock.elapsedTime * 2.0 + wobbleSeed) * 0.02 +
        drift.x * 0.055) *
      wobbleMul;
    const wobbleY =
      (Math.cos(state.clock.elapsedTime * 1.6 + wobbleSeed * 1.7) * 0.02 +
        drift.y * 0.055) *
      wobbleMul;
    const wobbleZ =
      Math.sin(state.clock.elapsedTime * 1.3 + wobbleSeed * 0.8) *
      0.012 *
      wobbleMul;

    rootRef.current.position.set(
      surfacePosition.x + wobbleX,
      surfacePosition.y + wobbleY,
      surfacePosition.z + wobbleZ
    );

    rootRef.current.rotation.x =
      (Math.sin(state.clock.elapsedTime * 1.4 + wobbleSeed) * 0.35 +
        drift.y * 0.9) *
      wobbleMul;
    rootRef.current.rotation.y =
      (Math.cos(state.clock.elapsedTime * 1.25 + wobbleSeed * 0.7) * 0.35 +
        drift.x * 0.9) *
      wobbleMul;
    rootRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 1.1 + wobbleSeed * 1.2) *
      0.25 *
      wobbleMul;

    if (prismShellRef.current) {
      prismShellRef.current.rotation.x += isDimmed ? 0.004 : 0.014;
      prismShellRef.current.rotation.y += isDimmed ? 0.006 : 0.018;
      prismShellRef.current.rotation.z += isDimmed ? 0.003 : 0.01;
    }

    const isHovered = hoveredCategory === node.category;
    const isMenuActive = menuHoveredCategory === node.category;
    const menuMode = menuHoveredCategory !== null && sceneMode === "idle";

    rootRef.current.getWorldPosition(tempWorld);
    camera.getWorldPosition(tempCam);

    const distance = tempCam.distanceTo(tempWorld);
    const proximity = THREE.MathUtils.clamp(1 - (distance - 2.1) / 3.7, 0, 1);

    let scale = THREE.MathUtils.lerp(0.88, 1.12, proximity);

    if (menuMode) {
      if (isMenuActive) {
        scale *= 1.18;
      } else {
        scale *= 0.9;
      }
    }

    if (sceneMode !== "idle") {
      if (isSelected) {
        scale *= 1.14;
      } else {
        scale *= 0.62;
      }
    } else if (isHovered) {
      scale *= 1.18;
    }

    scale *=
      1 +
      Math.min(
        isDimmed ? 0.04 : 0.14,
        drift.length() * (isDimmed ? 0.08 : 0.28)
      );
    tempScale.setScalar(scale);
    rootRef.current.scale.lerp(tempScale, 0.18);
  });

  return (
    <group
      ref={rootRef}
      position={node.surfacePosition}
      onPointerOver={() => {
        if (sceneMode !== "idle") return;
        setHoveredCategory(node.category);
        updatePreviewPosition();
      }}
      onPointerMove={() => {
        if (sceneMode !== "idle") return;
        updatePreviewPosition();
      }}
      onPointerOut={() => {
        if (sceneMode !== "idle") return;
        setHoveredCategory(null);
        setHoverPreview(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (sceneMode !== "idle") return;
        if (suppressClickRef.current) return;
        onNodeClick(node.category);
      }}
    >
      <PrismNode info={info} isDimmed={isDimmed} isSelected={isSelected} />
      <mesh
        ref={prismShellRef}
        scale={[1.28, 1.28, 1.28]}
        rotation={[0.6, 0.8, 0.2]}
      >
        <icosahedronGeometry args={[0.042, 0]} />
        <meshPhysicalMaterial
          color={isDimmed ? "#6c7480" : info.rim}
          emissive={isDimmed ? "#3b4248" : info.mid}
          emissiveIntensity={isDimmed ? 0.04 : isSelected ? 0.5 : 0.35}
          roughness={0.01}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transmission={isDimmed ? 0.03 : 0.18}
          thickness={0.2}
          ior={1.35}
          iridescence={isDimmed ? 0.05 : 1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[180, 520]}
          transparent
          opacity={isDimmed ? 0.04 : isSelected ? 0.28 : 0.22}
        />
      </mesh>
    </group>
  );
}

function CurvedWebLine({
  edge,
  sceneMode,
  selectedCategory,
  menuHoveredCategory,
  brokenUntilRef,
  pointerDriftRef,
}: {
  edge: EdgeType;
  sceneMode: SceneMode;
  selectedCategory: CategoryKey | null;
  menuHoveredCategory: CategoryKey | null;
  brokenUntilRef: React.RefObject<Map<string, number>>;
  pointerDriftRef: React.RefObject<THREE.Vector2>;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const glowRef = useRef<THREE.Line>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const glowGeometryRef = useRef<THREE.BufferGeometry>(null);

  const aVec = useMemo(
    () => new THREE.Vector3(...edge.a.surfacePosition),
    [edge.a.surfacePosition]
  );
  const bVec = useMemo(
    () => new THREE.Vector3(...edge.b.surfacePosition),
    [edge.b.surfacePosition]
  );

  const positions = useMemo(() => new Float32Array(36), []);
  const glowPositions = useMemo(() => new Float32Array(36), []);

  const wobbleSeed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < edge.id.length; i++) {
      hash = (hash << 5) - hash + edge.id.charCodeAt(i);
      hash |= 0;
    }
    return (((Math.abs(hash) % 1000) / 1000) * Math.PI * 2);
  }, [edge.id]);

  useFrame((state) => {
    if (
      !lineRef.current ||
      !glowRef.current ||
      !geometryRef.current ||
      !glowGeometryRef.current
    ) {
      return;
    }

    const drift = pointerDriftRef.current;
    const samplePts = makeBezierSamples(
      aVec,
      bVec,
      sceneMode === "idle" ? "idle" : sceneMode
    );

    const edgeSelected =
      selectedCategory !== null &&
      edge.a.category === selectedCategory &&
      edge.b.category === selectedCategory;

    const dimMul = sceneMode !== "idle" && !edgeSelected ? 0.18 : 1;

    for (let i = 0; i < samplePts.length; i++) {
      const p = samplePts[i];
      const t = i / (samplePts.length - 1);
      const centerFade = Math.sin(t * Math.PI) * dimMul;

      const wobbleX =
        Math.sin(state.clock.elapsedTime * 2.3 + wobbleSeed + i * 0.32) *
          0.02 *
          centerFade +
        drift.x * 0.07 * centerFade;

      const wobbleY =
        Math.cos(
          state.clock.elapsedTime * 1.95 + wobbleSeed * 0.7 + i * 0.25
        ) *
          0.02 *
          centerFade +
        drift.y * 0.07 * centerFade;

      // eslint-disable-next-line react-hooks/immutability
      positions[i * 3] = p[0] + wobbleX;
      positions[i * 3 + 1] = p[1] + wobbleY;
      positions[i * 3 + 2] = p[2];

      // eslint-disable-next-line react-hooks/immutability
      glowPositions[i * 3] = p[0] + wobbleX;
      glowPositions[i * 3 + 1] = p[1] + wobbleY;
      glowPositions[i * 3 + 2] = p[2];
    }

    (
      geometryRef.current.getAttribute("position") as THREE.BufferAttribute
    ).needsUpdate = true;
    (
      glowGeometryRef.current.getAttribute("position") as THREE.BufferAttribute
    ).needsUpdate = true;

    const material = lineRef.current.material as THREE.LineBasicMaterial;
    const glowMaterial = glowRef.current.material as THREE.LineBasicMaterial;

    const brokenUntil = brokenUntilRef.current.get(edge.id) ?? 0;
    const isBroken = performance.now() < brokenUntil;

    if (isBroken) {
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.22);
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        0,
        0.22
      );
      return;
    }

    const menuFactor =
      menuHoveredCategory &&
      (edge.a.category === menuHoveredCategory ||
        edge.b.category === menuHoveredCategory) &&
      sceneMode === "idle"
        ? 1
        : menuHoveredCategory && sceneMode === "idle"
        ? 0.48
        : 1;

    let focusFactor = 1;

    if (sceneMode !== "idle" && selectedCategory) {
      focusFactor = edgeSelected ? 1 : 0.04;
    }

    const movementBoost =
      sceneMode === "idle" ? Math.min(0.16, drift.length() * 0.6) : 0;
    const baseOpacity =
      sceneMode === "idle" ? 0.58 + movementBoost * 0.7 : 0.16;
    const glowBaseOpacity =
      sceneMode === "idle" ? 0.24 + movementBoost * 0.55 : 0.06;

    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      baseOpacity * menuFactor * focusFactor,
      0.14
    );
    glowMaterial.opacity = THREE.MathUtils.lerp(
      glowMaterial.opacity,
      glowBaseOpacity * menuFactor * focusFactor,
      0.14
    );
  });

  return (
    <>
      <ThreeLine ref={glowRef}>
        <bufferGeometry ref={glowGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[glowPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#cfefff"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </ThreeLine>

      <ThreeLine ref={lineRef}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#eefaff" transparent opacity={0.62} />
      </ThreeLine>
    </>
  );
}

function DepthLines({
  edges,
  sceneMode,
  selectedCategory,
  menuHoveredCategory,
  brokenUntilRef,
  pointerDriftRef,
}: {
  edges: EdgeType[];
  sceneMode: SceneMode;
  selectedCategory: CategoryKey | null;
  menuHoveredCategory: CategoryKey | null;
  brokenUntilRef: React.RefObject<Map<string, number>>;
  pointerDriftRef: React.RefObject<THREE.Vector2>;
}) {
  return (
    <>
      {edges.map((edge) => (
        <CurvedWebLine
          key={edge.id}
          edge={edge}
          sceneMode={sceneMode}
          selectedCategory={selectedCategory}
          menuHoveredCategory={menuHoveredCategory}
          brokenUntilRef={brokenUntilRef}
          pointerDriftRef={pointerDriftRef}
        />
      ))}
    </>
  );
}

function FocusMergeLines({
  nodes,
  selectedCategory,
  sceneMode,
  transitionRef,
}: {
  nodes: NodeType[];
  selectedCategory: CategoryKey | null;
  sceneMode: SceneMode;
  transitionRef: React.RefObject<number>;
}) {
  const selectedNodes = useMemo(
    () => nodes.filter((n) => n.category === selectedCategory),
    [nodes, selectedCategory]
  );

  if (
    !selectedCategory ||
    (sceneMode !== "line-focus" &&
      sceneMode !== "core-birth" &&
      sceneMode !== "focused")
  ) {
    return null;
  }

  return (
    <>
      {selectedNodes.map((node) => (
        <FocusLinePrimitive
          key={node.id}
          start={node.surfacePosition}
          sceneMode={sceneMode}
          transitionRef={transitionRef}
        />
      ))}
    </>
  );
}

function MergedCore({
  selectedCategory,
  sceneMode,
  transitionRef,
}: {
  selectedCategory: CategoryKey | null;
  sceneMode: SceneMode;
  transitionRef: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scaleVec = useMemo(() => new THREE.Vector3(), []);
  const glowScaleVec = useMemo(() => new THREE.Vector3(), []);
  const info = selectedCategory ? categoryMap[selectedCategory] : null;

  useFrame(() => {
    if (!meshRef.current || !glowRef.current) return;

    const t = transitionRef.current ?? 0;

    let s = 0.001;
    let glowS = 0.001;
    let opacity = 0;
    let glowOpacity = 0;
    let emissiveIntensity = 0;

    if (info) {
      if (sceneMode === "core-birth") {
        s = THREE.MathUtils.lerp(0.01, 0.24, t);
        glowS = THREE.MathUtils.lerp(0.02, 0.34, t);
        opacity = THREE.MathUtils.lerp(0.0, 1, t);
        glowOpacity = THREE.MathUtils.lerp(0.0, 0.32, t);
        emissiveIntensity = THREE.MathUtils.lerp(0.3, 1.9, t);
      } else if (sceneMode === "focused") {
        s = 0.24;
        glowS = 0.34;
        opacity = 1;
        glowOpacity = 0.32;
        emissiveIntensity = 1.9;
      }
    }

    scaleVec.setScalar(s);
    glowScaleVec.setScalar(glowS);
    meshRef.current.scale.lerp(scaleVec, 0.18);
    glowRef.current.scale.lerp(glowScaleVec, 0.18);

    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;

    mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.18);
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      emissiveIntensity,
      0.18
    );
    glowMat.opacity = THREE.MathUtils.lerp(
      glowMat.opacity,
      glowOpacity,
      0.18
    );

    if (info) {
      mat.color.set(info.core);
      mat.emissive.set(info.mid);
      glowMat.color.set(info.rim);
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[0.001, 0.001, 0.001]}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshPhysicalMaterial
          color={info?.core ?? "#ffffff"}
          emissive={info?.mid ?? "#ffffff"}
          emissiveIntensity={0}
          roughness={0.06}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={0.25}
          thickness={0.6}
          ior={1.3}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[140, 420]}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, 0]} scale={[0.001, 0.001, 0.001]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={info?.rim ?? "#ffffff"}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function NetworkSphere({
  onNodeClick,
  setSceneMode,
  selectedCategory,
  hoveredCategory,
  menuHoveredCategory,
  sceneMode,
  transitionRef,
  setHoveredCategory,
  setHoverPreview,
}: {
  onNodeClick: (category: CategoryKey) => void;
  setSceneMode: (mode: SceneMode) => void;
  selectedCategory: CategoryKey | null;
  hoveredCategory: CategoryKey | null;
  menuHoveredCategory: CategoryKey | null;
  sceneMode: SceneMode;
  transitionRef: React.RefObject<number>;
  setHoveredCategory: (category: CategoryKey | null) => void;
  setHoverPreview: (value: HoverPreviewState) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size, gl, pointer } = useThree();
  const targetScaleVec = useMemo(() => new THREE.Vector3(), []);
  const rotationTarget = useRef(new THREE.Vector2(0, 0));
  const rotationVel = useRef(new THREE.Vector2(0, 0));
  const passivePrev = useRef(new THREE.Vector2(0, 0));
  const passiveVelocity = useRef(new THREE.Vector2(0, 0));
  const pointerDriftRef = useRef(new THREE.Vector2(0, 0));

  const suppressClickRef = useRef(false);
  const brokenUntilRef = useRef<Map<string, number>>(new Map());
  const lastBreakAtRef = useRef(0);
  const [shards, setShards] = useState<FallingShardData[]>([]);

  const dragState = useRef({
    active: false,
    moved: false,
    x: 0,
    y: 0,
  });

  const nodes = useMemo<NodeType[]>(() => createSphereNodes(84, 1.92), []);
  const edges = useMemo<EdgeType[]>(() => createEdges(nodes, 9), [nodes]);

  const breakEdgesNearPointer = useCallback(
    (clientX: number, clientY: number, dx: number, dy: number) => {
      if (!groupRef.current) return;
      const now = performance.now();
      if (now - lastBreakAtRef.current < 120) return;
      lastBreakAtRef.current = now;

      const candidates = edges
        .map((edge) => {
          const midLocal = new THREE.Vector3(...edge.mid);
          const midWorld = groupRef.current!.localToWorld(midLocal.clone());
          const projected = midWorld.project(camera);

          const sx = (projected.x * 0.5 + 0.5) * size.width;
          const sy = (-projected.y * 0.5 + 0.5) * size.height;

          const dist2 =
            (sx - clientX) * (sx - clientX) + (sy - clientY) * (sy - clientY);

          return { edge, dist2 };
        })
        .filter((c) => c.dist2 < 190 * 190)
        .sort((a, b) => a.dist2 - b.dist2)
        .slice(0, 6);

      if (!candidates.length) return;

      const newShards: FallingShardData[] = [];

      candidates.forEach(({ edge }, idx) => {
        const alreadyBrokenUntil = brokenUntilRef.current.get(edge.id) ?? 0;
        if (performance.now() < alreadyBrokenUntil) return;

        brokenUntilRef.current.set(edge.id, performance.now() + 1000);

        const aVec = new THREE.Vector3(...edge.a.surfacePosition);
        const bVec = new THREE.Vector3(...edge.b.surfacePosition);
        const samples = makeBezierSamples(aVec, bVec, "idle");

        const chunkA = samples.slice(0, 6);
        const chunkB = samples.slice(6, 12);

        const vx = dx * 0.006 + (idx % 2 === 0 ? -0.18 : 0.18);
        const vy = -0.15 - Math.random() * 0.15;
        const vz = dy * 0.006 + (idx % 2 === 0 ? 0.12 : -0.12);

        newShards.push(
          {
            id: `${edge.id}-a-${now}-${idx}`,
            points: chunkA,
            velocity: [vx, vy, vz],
            spin: [
              0.8 + Math.random(),
              0.4 + Math.random(),
              0.6 + Math.random(),
            ],
            createdAt: now,
            lifeMs: 850,
          },
          {
            id: `${edge.id}-b-${now}-${idx}`,
            points: chunkB,
            velocity: [-vx * 0.9, vy - 0.05, -vz * 0.8],
            spin: [
              0.6 + Math.random(),
              0.8 + Math.random(),
              0.5 + Math.random(),
            ],
            createdAt: now,
            lifeMs: 900,
          }
        );
      });

      if (newShards.length) {
        setShards((prev) => [...prev, ...newShards]);
      }
    },
    [camera, edges, size.height, size.width]
  );

  useEffect(() => {
    const el = gl.domElement;

    const onPointerMovePassive = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const dx = nx - passivePrev.current.x;
      const dy = ny - passivePrev.current.y;

      passiveVelocity.current.x += dx * 1.3;
      passiveVelocity.current.y += dy * 1.3;
      passivePrev.current.set(nx, ny);

      if (dragState.current.active && sceneMode === "idle") {
        const pixelDx = e.clientX - dragState.current.x;
        const pixelDy = e.clientY - dragState.current.y;

        dragState.current.x = e.clientX;
        dragState.current.y = e.clientY;

        if (Math.abs(pixelDx) > 2 || Math.abs(pixelDy) > 2) {
          dragState.current.moved = true;
          suppressClickRef.current = true;
        }

        rotationVel.current.x += pixelDx * 0.00042;
        rotationVel.current.y += pixelDy * 0.00042;

        if (Math.abs(pixelDx) + Math.abs(pixelDy) > 7) {
          breakEdgesNearPointer(e.clientX, e.clientY, pixelDx, pixelDy);
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (sceneMode !== "idle") return;
      dragState.current.active = true;
      dragState.current.moved = false;
      dragState.current.x = e.clientX;
      dragState.current.y = e.clientY;
      suppressClickRef.current = false;
    };

    const onPointerUp = () => {
      dragState.current.active = false;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    };

    const onPointerLeave = () => {
      dragState.current.active = false;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    };

    el.addEventListener("pointermove", onPointerMovePassive);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMovePassive);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [breakEdgesNearPointer, gl, sceneMode]);

  useEffect(() => {
    if (sceneMode !== "idle") {
      rotationVel.current.set(0, 0);
      passiveVelocity.current.set(0, 0);
      pointerDriftRef.current.set(0, 0);
      suppressClickRef.current = true;
    }
  }, [sceneMode]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (sceneMode === "camera-in") {
      transitionRef.current = Math.min(
        1,
        (transitionRef.current ?? 0) + delta * 0.9
      );
      if ((transitionRef.current ?? 0) >= 1) {
        transitionRef.current = 0;
        setSceneMode("line-focus");
      }
    } else if (sceneMode === "line-focus") {
      transitionRef.current = Math.min(
        1,
        (transitionRef.current ?? 0) + delta * 0.32
      );
      if ((transitionRef.current ?? 0) >= 1) {
        transitionRef.current = 0;
        setSceneMode("core-birth");
      }
    } else if (sceneMode === "core-birth") {
      transitionRef.current = Math.min(
        1,
        (transitionRef.current ?? 0) + delta * 1.2
      );
      if ((transitionRef.current ?? 0) >= 1) {
        transitionRef.current = 1;
        setSceneMode("focused");
      }
    } else if (sceneMode === "idle") {
      transitionRef.current = 0;
    }

    const menuMode = menuHoveredCategory !== null && sceneMode === "idle";

    const targetScale =
      sceneMode === "idle"
        ? menuMode
          ? 1.01
          : 0.95
        : sceneMode === "camera-in"
        ? 0.82
        : sceneMode === "line-focus"
        ? 0.76
        : sceneMode === "core-birth"
        ? 0.7
        : 0.66;

    const targetZ =
      sceneMode === "idle"
        ? menuMode
          ? 0.14
          : 0
        : sceneMode === "camera-in"
        ? -0.18
        : sceneMode === "line-focus"
        ? -0.32
        : sceneMode === "core-birth"
        ? -0.42
        : -0.48;

    targetScaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(targetScaleVec, 0.055);
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.055
    );

    passiveVelocity.current.multiplyScalar(0.82);
    pointerDriftRef.current.lerp(passiveVelocity.current, 0.22);

    if (sceneMode === "idle") {
      rotationVel.current.multiplyScalar(0.91);
      rotationTarget.current.add(rotationVel.current);
      rotationTarget.current.x += passiveVelocity.current.x * 0.05;
      rotationTarget.current.y += passiveVelocity.current.y * 0.05;
    } else {
      rotationTarget.current.lerp(new THREE.Vector2(0, 0), 0.16);
      rotationVel.current.multiplyScalar(0.82);
    }

    const autoSpin =
      sceneMode === "idle"
        ? 0.0009 +
          (menuMode
            ? 0.016 *
              (menuHoveredCategory ? categorySpinMap[menuHoveredCategory] : 1)
            : 0)
        : sceneMode === "camera-in"
        ? 0.0006
        : sceneMode === "line-focus"
        ? 0.00035
        : 0.00016;

    const drift = pointerDriftRef.current;

    const desiredX =
      sceneMode === "idle"
        ? pointer.y * 0.18 + rotationTarget.current.y * 0.65 + drift.y * 0.9
        : rotationTarget.current.y * 0.16;

    const desiredY =
      groupRef.current.rotation.y +
      autoSpin +
      (sceneMode === "idle"
        ? pointer.x * 0.12 + rotationTarget.current.x * 0.035 + drift.x * 0.55
        : 0);

    const desiredZ =
      sceneMode === "idle"
        ? rotationTarget.current.x * 0.32 + pointer.x * 0.08 + drift.x * 0.7
        : rotationTarget.current.x * 0.06;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      drift.x * 0.22,
      0.07
    );

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      (sceneMode === "idle"
        ? Math.sin(state.clock.elapsedTime * 0.45) * 0.045
        : 0) + drift.y * 0.18,
      0.07
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      desiredX,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      desiredY,
      0.06
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      desiredZ,
      0.08
    );

    const now = performance.now();
    brokenUntilRef.current.forEach((until, key) => {
      if (now >= until) brokenUntilRef.current.delete(key);
    });
  });

  return (
    <group ref={groupRef}>
      <DepthLines
        edges={edges}
        sceneMode={sceneMode}
        selectedCategory={selectedCategory}
        menuHoveredCategory={menuHoveredCategory}
        brokenUntilRef={brokenUntilRef}
        pointerDriftRef={pointerDriftRef}
      />

      <FallingShardLayer shards={shards} setShards={setShards} />

      <FocusMergeLines
        nodes={nodes}
        selectedCategory={selectedCategory}
        sceneMode={sceneMode}
        transitionRef={transitionRef}
      />

      {nodes.map((node) => (
        <DepthNode
          key={node.id}
          node={node}
          camera={camera}
          size={size}
          hoveredCategory={hoveredCategory}
          selectedCategory={selectedCategory}
          menuHoveredCategory={menuHoveredCategory}
          sceneMode={sceneMode}
          setHoveredCategory={setHoveredCategory}
          setHoverPreview={setHoverPreview}
          onNodeClick={onNodeClick}
          suppressClickRef={suppressClickRef}
          pointerDriftRef={pointerDriftRef}
        />
      ))}

      <MergedCore
        selectedCategory={selectedCategory}
        sceneMode={sceneMode}
        transitionRef={transitionRef}
      />
    </group>
  );
}

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState>(null);
  const [activeMenu, setActiveMenu] = useState("");
  const [sceneMode, setSceneMode] = useState<SceneMode>("idle");
  const [showPanel, setShowPanel] = useState(false);

  const transitionRef = useRef(0);

  useEffect(() => {
    setShowPanel(sceneMode === "focused");
  }, [sceneMode]);

  const menuHoveredCategory =
    sceneMode === "idle" && activeMenu ? menuToCategory[activeMenu] : null;

  const selectedData = selectedCategory ? categoryMap[selectedCategory] : null;
  const panelOpen =
    sceneMode === "focused" && showPanel && selectedData !== null;

  const handleNodeClick = (category: CategoryKey) => {
    setSelectedCategory(category);
    setShowPanel(false);
    setHoverPreview(null);
    setHoveredCategory(null);
    setActiveMenu("");
    transitionRef.current = 0;
    setSceneMode("camera-in");
  };

  const handleClose = () => {
    setShowPanel(false);
    setSceneMode("idle");
    setSelectedCategory(null);
    transitionRef.current = 0;
    setHoverPreview(null);
    setHoveredCategory(null);
    setActiveMenu("");
  };

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#02060b] text-white">
      <DepthBackdrop />
      <AnimatedGradientBackground
        category={menuHoveredCategory ?? selectedCategory}
      />

      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <CameraDirector sceneMode={sceneMode} transitionRef={transitionRef} />

          <ambientLight intensity={0.58} />
          <pointLight position={[6, 5, 5]} intensity={1.55} color="#ffffff" />
          <pointLight
            position={[-5, -4, -5]}
            intensity={0.72}
            color="#bfe8ff"
          />
          <pointLight position={[0, 0, 3]} intensity={0.42} color="#ffffff" />
          <spotLight
            position={[0, -3, 4]}
            intensity={1.08}
            angle={0.52}
            penumbra={1}
            color="#ffffff"
          />

          <AtmosphereParticles />
          <TunnelWebBackground dimmed={sceneMode !== "idle"} />

          <NetworkSphere
            selectedCategory={selectedCategory}
            hoveredCategory={hoveredCategory}
            menuHoveredCategory={menuHoveredCategory}
            sceneMode={sceneMode}
            transitionRef={transitionRef}
            setSceneMode={setSceneMode}
            setHoveredCategory={setHoveredCategory}
            setHoverPreview={setHoverPreview}
            onNodeClick={handleNodeClick}
          />

          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.22}
              luminanceSmoothing={0.16}
              intensity={0.75}
            />
          </EffectComposer>
        </Canvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 20%, rgba(0,0,0,0.34) 52%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <div
        className={`pointer-events-none absolute inset-0 transition duration-500 ${
          panelOpen ? "backdrop-blur-md bg-black/28" : ""
        }`}
      />

      <div className="absolute left-4 right-4 top-4 z-30 max-w-none md:left-10 md:right-auto md:top-10 md:max-w-[560px]">
        <p className="text-xs uppercase tracking-[0.32em] text-white/38 md:text-sm md:tracking-[0.42em]">
          Portfolio
        </p>

        <h1 className="mt-3 text-3xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-4xl md:mt-4 md:text-6xl">
          Kim Minho
        </h1>

        <p className="mt-[0.1rem] text-base leading-[1.2] tracking-[-0.03em] text-white/60 sm:text-lg md:mt-0.5 md:text-2xl">
          Digital Media Designer
        </p>

        <div
          className="mt-6 flex flex-col items-start gap-2 md:mt-10 md:gap-3"
          onMouseLeave={() => setActiveMenu("")}
        >
          {mainCategories.map((item) => {
            const isActive = activeMenu === item;
            const categoryKey = menuToCategory[item];

            return (
              <button
                key={item}
                onMouseEnter={() => {
                  if (sceneMode !== "idle") return;
                  setActiveMenu((prev) => (prev === item ? prev : item));
                }}
                onClick={() => handleNodeClick(categoryKey)}
                className="group relative text-left"
              >
                <span
                  className={`block text-[26px] leading-none tracking-[-0.05em] transition-all duration-300 sm:text-[32px] md:text-[40px] ${
                    isActive
                      ? "translate-x-2 scale-[1.04] text-white"
                      : "text-white/34 group-hover:translate-x-2 group-hover:scale-[1.04] group-hover:text-white/85"
                  }`}
                >
                  {item}
                </span>

                <span
                  className={`mt-2 block h-[2px] origin-left bg-white transition-all duration-300 ${
                    isActive
                      ? "w-full scale-x-100 opacity-100"
                      : "w-full scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:block">
        <PreviewBridge hoverPreview={hoverPreview} panelOpen={panelOpen} />
      </div>

      {selectedData && panelOpen && (
        <div
          className={`absolute left-3 right-3 bottom-3 top-[22%] z-30 overflow-y-auto rounded-[24px] border bg-black/50 p-4 text-white backdrop-blur-2xl transition duration-500 sm:left-4 sm:right-4 sm:top-[20%] sm:p-5 md:inset-y-[6%] md:left-auto md:right-[4%] md:w-[60%] md:rounded-[34px] md:p-8 ${selectedData.border} ${selectedData.glow}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/38">
                Category
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl md:mt-3 md:text-4xl">
                {selectedData.name}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 md:mt-4 md:text-base md:leading-7">
                {selectedData.description}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/68 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 md:gap-5 xl:grid-cols-3">
            {selectedData.projects.map((project) => (
              <ProjectMediaCard
                key={project.title}
                project={project}
                accentColor={selectedData.color}
                accentMid={selectedData.mid}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
