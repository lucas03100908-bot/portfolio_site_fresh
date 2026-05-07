import { CategoryInfo } from "@/lib/types";

const planning: CategoryInfo = {
  key: "planning",
  menuLabel: "Planning",
  name: "Concept / Planning",
  description:
    "콘텐츠 기획, 경험 흐름 설계, 전시 및 포트폴리오 구조 기획.",
  preview: ["Concept", "Narrative", "Structure"],
  transitionVideo: "/spider/purple_Spider.mp4",
  projects: [
    {
      title: "Media Art Proposal",
      subtitle: "Planning",
      description:
        "미디어아트 프로젝트를 위한 컨셉 제안과 구성 기획 작업.",
      thumbnail: "/avatar2.webp",
      tools: ["Keynote", "Figma"],
    },
    {
      title: "Portfolio Strategy",
      subtitle: "Positioning",
      description:
        "포트폴리오의 구조와 포지셔닝을 설계한 전략 기획 작업.",
      tools: ["Notion"],
    },
    {
      title: "Exhibition Scenario",
      subtitle: "Experience Planning",
      description:
        "전시의 전체 흐름과 관람자 경험을 중심으로 구성한 시나리오 설계.",
      tools: ["Figma", "Notion"],
    },
  ],
  color: "#8d32ff",
  mid: "#a85cff",
  border: "border-violet-400/40",
  glow: "shadow-[0_0_40px_rgba(141,50,255,0.28)]",
  backgroundGradient: ["#f1a3d8", "#9d56ff", "#6c8cff", "#f6e8ff"],
};

export default planning;