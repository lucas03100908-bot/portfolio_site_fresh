export type CategoryKey = "interactive" | "uxui" | "motion" | "planning";

export type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  thumbnail?: string;
  video?: string;
  externalLink?: string;
  linkLabel?: string;
  tools?: string[];
};

export type CategoryInfo = {
  key: CategoryKey;
  menuLabel: string;
  name: string;
  description: string;
  preview: string[];
  transitionVideo?: string;
  hoverVideo?: string;
  projects: ProjectItem[];
  color: string;
  mid: string;
  border: string;
  glow: string;
  backgroundGradient: [string, string, string, string];
};
