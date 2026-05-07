import { CategoryInfo } from "@/lib/types";

const uxui: CategoryInfo = {
  key: "uxui",
  menuLabel: "UX/UI",
  name: "UX/UI Design",
  description:
    "리서치 기반의 사용자 경험 설계와 인터페이스 디자인 프로젝트.",
  preview: ["Research", "Flow", "Interface"],
  transitionVideo: "/spider/navy_Spider.mp4",
  hoverVideo: "/Pixafe.mp4",
  projects: [
    {
      title: "Campus Utility App",
      subtitle: "Web UX/UI",
      description:
        "발달장애인의 감정 표현과 소통을 돕기 위한 인터페이스를 주제로 진행했습니다. 사용자의 표정과 머무는 시간을 기반으로 감정 흐름을 파악하고, 이를 감정 디스플레이와 대시보드, 관리자 화면으로 설계했습니다. 특히 인사이드아웃 캐릭터를 활용해 감정을 더 직관적이고 친숙하게 전달하고자 했습니다. 복잡한 설명보다, 누구나 쉽게 이해할 수 있는 감정 경험을 만드는 데 집중한 프로젝트입니다.",
      thumbnail: "/Insidefeel.webp",
      externalLink: "https://www.instagram.com/p/DNa0bJwyaIs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      tools: ["Veo3", "Adobe XD"],
    },
    {
      title: "Pixafe",
      subtitle: "Experience Design",
      description:
        "이번 프로젝트는 디지털 시대의 저작권 문제를 더 쉽고 직관적으로 전달하기 위해 기획한 작업입니다. 디즈니를 연결한 이유는, 상상력의 상징이면서 동시에 콘텐츠 보호의 대표적인 사례라고 생각했기 때문입니다. 그래서 ‘Respect Imagination’이라는 메시지를 중심으로, 저작권 인식 캠페인과 NFT 기반 보호 서비스 UX/UI를 함께 설계했습니다. 창작의 가치는 소비되는 것에서 끝나는 게 아니라, 제대로 보호받을 때 더 오래 이어질 수 있다고 생각했습니다.",
      thumbnail: "/pixafe.webp",
      externalLink: "https://www.instagram.com/p/DFVaTZey2FQ/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
      tools: ["Blender", "Adobe XD"],
    },
    {
      title: "SUP",
      subtitle: "UI System",
      description:
        "이번 UX/UI 프로젝트는 같은 취미와 관심사를 가진 사람들이 더 편하게 연결될 수 있도록 기획한 매칭 서비스입니다.단순히 사람을 이어주는 것이 아니라, 새로운 만남의 어색함과 불안을 줄이고 공통의 취향을 통해 자연스럽게 대화를 시작할 수 있는 흐름을 설계했습니다. 특히 S’UP이라는 이름에는 같은 관심사로 연결되고, 가볍게 관계를 시작한다는 의미를 담았습니다.",
      thumbnail: "/sup.webp",
      externalLink: "https://www.instagram.com/p/DFNyfcgSp5K/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
      tools: ["Blender", "Adobe XD"],
    },
  ],
  color: "#2b6fff",
  mid: "#4f8dff",
  border: "border-blue-400/40",
  glow: "shadow-[0_0_40px_rgba(43,111,255,0.28)]",
  backgroundGradient: ["#66d9ff", "#2b6fff", "#5a54ff", "#d9f0ff"],
};

export default uxui;