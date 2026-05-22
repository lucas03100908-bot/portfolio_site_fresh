import { CategoryInfo } from "@/lib/types";

const planning: CategoryInfo = {
  key: "planning",
  menuLabel: "Ai Lab",
  name: "Ai Lab",
  description:
    "콘텐츠 기획, 경험 흐름 설계, 전시 및 포트폴리오 구조 기획.",
  preview: ["Concept", "Narrative", "Structure"],
  transitionVideo: "/spider/purple_Spider.mp4",
  projects: [
    {
      title: "NAJEON SPIDER",
      subtitle: "Collectible Mechanical Sculpture / AI Concept Design",
      description:
        "나전(螺鈿) 기법에서 영감을 받아 AI로 구현한 수집형 기계 조각 콘셉트. 티타늄 합금과 자개 인레이, 나노 필라멘트를 소재로 한국의 전통 문화유산을 미래지향적 산업 디자인으로 재해석했습니다. 정밀 공학과 자연의 우아함이 교차하는 지점에서 탄생한 리미티드 에디션 오브제입니다.",
      thumbnail: "/najeonS.webp",
      externalLink: "https://www.instagram.com/p/DX7G9CWkydp/",
      linkLabel: "View on Instagram",
      tools: ["Midjourney", "Adobe Firefly"],
    },
    {
      title: "Veo — Cinematic AI Story",
      subtitle: "AI Video Direction / Generative Storytelling",
      description:
        "Google Veo를 활용하여 AI 영상 스토리 및 연출을 시도한 작업. 한국 전통 건축(한옥)과 SF적 우주복 캐릭터를 조합해 시공간을 초월하는 시네마틱 씬을 생성했습니다. 텍스트 프롬프트만으로 카메라 앵글, 분위기, 내러티브 흐름을 연출하며 AI 영상 디렉팅의 가능성을 탐색한 실험입니다.",
      thumbnail: "/Kplanet.webp",
      externalLink: "https://www.threads.com/@minho_ya_01/post/DMFm2bNh6b9",
      linkLabel: "View on Threads",
      tools: ["Veo"],
    },
    {
      title: "진도아리랑_Suno",
      subtitle: "AI Music / Generative Content Experiment",
      description:
        "진도아리랑을 모티브로 Suno 기반 생성형 사운드와 AI 콘텐츠 제작 가능성을 탐색한 YouTube Shorts 작업입니다. 전통적인 정서를 디지털 생성 도구로 재해석해 짧은 포맷 안에서 분위기와 리듬을 실험했습니다.",
      thumbnail: "https://img.youtube.com/vi/VP4Zvyo2hdc/maxresdefault.jpg",
      externalLink: "https://youtube.com/shorts/VP4Zvyo2hdc",
      linkLabel: "Watch Project",
      tools: ["Suno"],
    },
    {
      title: "JAPA TO THE RAVE_SUNO",
      subtitle: "AI Music / Generative Content Experiment",
      description:
        "Suno를 활용해 리듬감과 장르 무드를 실험한 YouTube 작업입니다. 짧은 포맷 안에서 생성형 사운드의 에너지와 전개감을 테스트하며 AI 기반 음악 콘텐츠의 표현 가능성을 탐색했습니다.",
      thumbnail: "https://img.youtube.com/vi/YnSaK2a2XGs/maxresdefault.jpg",
      externalLink: "https://youtu.be/YnSaK2a2XGs",
      linkLabel: "Watch Project",
      tools: ["Suno"],
    },
  ],
  color: "#8d32ff",
  mid: "#a85cff",
  border: "border-violet-400/40",
  glow: "shadow-[0_0_40px_rgba(141,50,255,0.28)]",
  backgroundGradient: ["#f1a3d8", "#9d56ff", "#6c8cff", "#f6e8ff"],
};

export default planning;