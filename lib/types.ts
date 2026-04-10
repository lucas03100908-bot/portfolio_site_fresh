export type CategoryKey = "interactive" | "uxui" | "motion" | "planning";

export type SceneMode =
  | "idle"
  | "camera-in"
  | "line-focus"
  | "core-birth"
  | "focused";

export type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  thumbnail?: string;
  video?: string;
  externalLink?: string;
  linkLabel?: string;
  images: string[];
  tools?: string[];
};

export type CategoryInfo = {
  key: CategoryKey;
  name: string;
  description: string;
  preview: string[];
  hoverImage?: string;
  hoverVideo?: string;
  projects: ProjectItem[];
  color: string;
  core: string;
  mid: string;
  rim: string;
  border: string;
  glow: string;
  backgroundGradient: string[];
};

export type NodeType = {
  id: number;
  surfacePosition: [number, number, number];
  category: CategoryKey;
};

export type EdgeType = {
  id: string;
  a: NodeType;
  b: NodeType;
  mid: [number, number, number];
};

export type FallingShardData = {
  id: string;
  points: [number, number, number][];
  velocity: [number, number, number];
  spin: [number, number, number];
  createdAt: number;
  lifeMs: number;
};

export type HoverPreviewState = {
  category: CategoryKey;
  x: number;
  y: number;
  side: "left" | "right";
} | null;
