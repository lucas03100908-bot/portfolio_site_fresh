import { CategoryKey, CategoryInfo } from "./types";

export const categoryOrder: CategoryKey[] = [
  "interactive",
  "uxui",
  "motion",
  "planning",
];

export const categorySpinMap: Record<CategoryKey, number> = {
  interactive: 1,
  uxui: -1,
  motion: 1,
  planning: -1,
};

export const categoryMap: Record<CategoryKey, CategoryInfo> = {
  interactive: {
    key: "interactive",
    name: "Interactive Realtime",
    description:
      "TouchDesigner, Unity, Unreal 기반의 실시간 인터랙티브 프로젝트.",
    preview: ["Gesture", "Realtime", "Responsive"],
    hoverVideo: "/Prototype_1.mp4",
    projects: [
      {
        title: "Dog Follow Prototype",
        subtitle: "Branding / Interactive Media Art / UX Design",
        description:
          "사용자의 위치 데이터를 기반으로 캐릭터가 실시간으로 반응하는 인터랙티브 프로토타입. 석사 졸업작품입니다. 현재 옥외광고의 문제점을 도출해내고 해결하기위해 공익광고를 제작 시도. 홍대입구를 기반으로 사용자가 더 몰입과 반응할 수 있도록 UX를 설계한 프로젝트",
        thumbnail: "/dog_proto.jpg",
        externalLink: "https://youtu.be/pVmaOwbiX9w?si=2sQeQX7UZIs3K1Tt",
        linkLabel: "Watch Project",
        images: [],
        tools: ["TouchDesigner", "Unreal Engine"],
      },
      {
        title: "The Flare",
        subtitle: "Realtime Visual",
        description:
          "오마주를 주제로 한 실시간 인터랙티브 작업. 불타는 자신을 투영하여 영화'Whiplash'를 메인으로 오마주 시도. Unity와 Arduino를 활용하여 바람 센서 대신 마이크센서로 사용자가 실제 싸여진 통나무들에 힘들게 부채질을 하여 불곷이 커지게합니다. 이를 카운트 하여 일정 카운트 넘어가면 전부 타버려 재만 남아 연기가 날 수 있도록 구현한 프로젝트",
        thumbnail: "/BGE_PNU.jpg",
        externalLink: "https://youtu.be/UwFO-dlauN0?si=Ulr2jR778ofTha63",
        images: [],
        tools: ["Unity", "Arduino"],
      },
      {
        title: "Emotion Track",
        subtitle: "Interactive Visual",
        description:
          "IDAS 김보연 교수님 이론을 반영했습니다. Design is to V(디자인은 동사다) 라는 이론으로 접근하여 Design is to Attract로 시작했음. 무표정사회라는 문제점을 해결하기 위해 디지털 옥외광고 메체를 가져와 지나가는 사람이 보고 웃을 수 있도록 유도. 부산 사투리를 사용해 다소 건방진 말투를 보여줌으로 관객에게있어서 피식 웃을 수 있게끔 유도하는것이 최종 목표. 웃거나, 슬플거나 화날때 표정 값을 가져와 각각 다른 비주얼을 보여주고 피식이 아니라 더 크게 웃는다면 다른 비주얼을 볼 수 있음 ",
        thumbnail: "/Emotion_TD.jpg",
        externalLink: "https://www.threads.com/@minho_ya_01/post/DJPCmufhkbI?xmt=AQF02ww3hEPdsK5PkzoaFUWyh1wDrwAUc5x3UE6Yqr4Lgg",
        images: [],
        tools: ["TouchDesigner"],
      },
       {
      title: "Project BYEOLGOT(별것)",
      subtitle: "Interactive Installation / Realtime Experience",
      description:
        "안국역 근처 바이브아트센터에서 팀전시를 진행했습니다. 누군가에겐 별게아닐 수 있다는 관점으로 시작했습니다. 그래서 우주라는 매체로 세계관을 표현하였고, 웃으며 살자는 메세지를 담았습니다. 티셔츠과 굿즈를 제작하여 웃음을 유도 할 수 있었고 손으로 우주를 컨트롤하고 웃음과 동시에 우주가 터지며 화려한 비주얼을 보여주는 인터랙티브 설치 작업",
      thumbnail: "/Starboom.jpg",
      externalLink: "https://youtu.be/I-KgWFnuZFg",
      images: [],
      tools: ["TouchDesigner"]
    },
    ],
    color: "#ff6a00",
    core: "#ff5a00",
    mid: "#ff8a1a",
    rim: "#ffd08a",
    border: "border-orange-400/40",
    glow: "shadow-[0_0_40px_rgba(255,106,0,0.28)]",
    backgroundGradient: ["#ffbb66", "#ff7a00", "#ff4d6d", "#ffe5b8"],
  },

  uxui: {
    key: "uxui",
    name: "UX/UI Design",
    description:
      "리서치 기반의 사용자 경험 설계와 인터페이스 디자인 프로젝트.",
    preview: ["Research", "Flow", "Interface"],
    hoverVideo: "/Pixafe.mp4",
    projects: [
      {
        title: "Campus Utility App",
        subtitle: "Web UX/UI",
        description:
          "발달장애인의 감정 표현과 소통을 돕기 위한 인터페이스를 주제로 진행했습니다. 사용자의 표정과 머무는 시간을 기반으로 감정 흐름을 파악하고, 이를 감정 디스플레이와 대시보드, 관리자 화면으로 설계했습니다. 특히 인사이드아웃 캐릭터를 활용해 감정을 더 직관적이고 친숙하게 전달하고자 했습니다. 복잡한 설명보다, 누구나 쉽게 이해할 수 있는 감정 경험을 만드는 데 집중한 프로젝트입니다.",
        thumbnail: "/Insidefeel.jpg",
        externalLink: "https://www.instagram.com/p/DNa0bJwyaIs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        images: [],
        tools: ["Veo3", "Adobe XD"],
      },
      {
        title: "Pixafe",
        subtitle: "Experience Design",
        description:
          "이번 프로젝트는 디지털 시대의 저작권 문제를 더 쉽고 직관적으로 전달하기 위해 기획한 작업입니다. 디즈니를 연결한 이유는, 상상력의 상징이면서 동시에 콘텐츠 보호의 대표적인 사례라고 생각했기 때문입니다. 그래서 ‘Respect Imagination’이라는 메시지를 중심으로, 저작권 인식 캠페인과 NFT 기반 보호 서비스 UX/UI를 함께 설계했습니다. 창작의 가치는 소비되는 것에서 끝나는 게 아니라, 제대로 보호받을 때 더 오래 이어질 수 있다고 생각했습니다.",
        thumbnail: "/pixafe.jpg",
        externalLink: "https://www.instagram.com/p/DFVaTZey2FQ/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
        images: [],
        tools: ["Blender", "Adobe XD"],
      },
      {
        title: "SUP",
        subtitle: "UI System",
        description:
          "이번 UX/UI 프로젝트는 같은 취미와 관심사를 가진 사람들이 더 편하게 연결될 수 있도록 기획한 매칭 서비스입니다.단순히 사람을 이어주는 것이 아니라, 새로운 만남의 어색함과 불안을 줄이고 공통의 취향을 통해 자연스럽게 대화를 시작할 수 있는 흐름을 설계했습니다. 특히 S’UP이라는 이름에는 같은 관심사로 연결되고, 가볍게 관계를 시작한다는 의미를 담았습니다.",
        thumbnail: "/sup.png",
        externalLink: "https://www.instagram.com/p/DFNyfcgSp5K/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
        images: [],
        tools: ["Blender", "Adobe XD"],
      },
    ],
    color: "#2b6fff",
    core: "#215dff",
    mid: "#4f8dff",
    rim: "#b8d6ff",
    border: "border-blue-400/40",
    glow: "shadow-[0_0_40px_rgba(43,111,255,0.28)]",
    backgroundGradient: ["#66d9ff", "#2b6fff", "#5a54ff", "#d9f0ff"],
  },

  motion: {
    key: "motion",
    name: "Motion / 3D",
    description:
      "Blender 기반 3D 모션, 시네마틱 무드, 비주얼 중심의 작업.",
    preview: ["Lighting", "Mood", "Cinematic"],
    hoverVideo: "/apple_locom.mp4",
    projects: [
      {
        title: "Apple Commercial Redesign",
        subtitle: "Motion / 3D Experiment",
        description:
          "애플 맥북 네오가 출시된 후 그에 맞는 광고 영상. Blender로 Damonxart의 작품을 재구성하여 다이나믹함을 연출한 모션그래픽 실험.",
        thumbnail: "/apple_com.jpg",
        externalLink: "https://www.instagram.com/reel/DWZSr7hEyzv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        images: [],
        tools: ["Blender"],
      },
      {
        title: "Eye Balls Motion Graphic",
        subtitle: "Motion / 3D",
        description:
          "눈알들이 빛을 따라다니고 동공들의 확장과 축소를 통해 디스플레이를 넘어 볼 수 있다는 컨셉으로 제작한 호러 장르의 3D 모션그래픽 작업.",
        thumbnail: "/eyes.png",
        externalLink: "https://www.instagram.com/reel/DWaznDCk8Hx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        images: [],
        tools: ["Blender"],
      },
      {
        title: "Avatar Level Design",
        subtitle: "3D Motion",
        description:
          "아바타2: 물의길 영화 개봉 후 판도라 행성의 환경을 구현해보고 싶었습니다. Blender와 Unreal Engine을 활용하여 판도라의 자연환경을 모티브로한 레벨디자인과 애니메이션을 제작한 프로젝트입니다",
        thumbnail: "/avatar2.jpg",
        externalLink: "https://www.instagram.com/reel/DKu_KBsTGw3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        images: [],
        tools: ["Unreal Engine / Blender"],
      },
    ],
    color: "#00c96b",
    core: "#00b85f",
    mid: "#19e28d",
    rim: "#b7ffd9",
    border: "border-emerald-400/40",
    glow: "shadow-[0_0_40px_rgba(0,201,107,0.28)]",
    backgroundGradient: ["#9dff67", "#00d46d", "#11b9ff", "#e3fff0"],
  },

  planning: {
    key: "planning",
    name: "Concept / Planning",
    description:
      "콘텐츠 기획, 경험 흐름 설계, 전시 및 포트폴리오 구조 기획.",
    preview: ["Concept", "Narrative", "Structure"],
    hoverImage: "/portfolio/planning/hover.jpg",
    projects: [
      {
        title: "Media Art Proposal",
        subtitle: "Planning",
        description:
          "미디어아트 프로젝트를 위한 컨셉 제안과 구성 기획 작업.",
        thumbnail: "/avatar2.jpg",
        images: [],
        tools: ["Keynote", "Figma"],
      },
      {
        title: "Portfolio Strategy",
        subtitle: "Positioning",
        description:
          "포트폴리오의 구조와 포지셔닝을 설계한 전략 기획 작업.",
        thumbnail: "/portfolio/planning/portfolio-strategy/thumb.jpg",
        images: [],
        tools: ["Notion"],
      },
      {
        title: "Exhibition Scenario",
        subtitle: "Experience Planning",
        description:
          "전시의 전체 흐름과 관람자 경험을 중심으로 구성한 시나리오 설계.",
        thumbnail: "/portfolio/planning/exhibition-scenario/thumb.jpg",
        images: [],
        tools: ["Figma", "Notion"],
      },
    ],
    color: "#8d32ff",
    core: "#7b22f2",
    mid: "#a85cff",
    rim: "#dec3ff",
    border: "border-violet-400/40",
    glow: "shadow-[0_0_40px_rgba(141,50,255,0.28)]",
    backgroundGradient: ["#f1a3d8", "#9d56ff", "#6c8cff", "#f6e8ff"],
  },
};

export const mainCategories = [
  "Interactive",
  "UX/UI",
  "Motion / 3D",
  "Planning",
];

export const menuToCategory: Record<string, CategoryKey> = {
  Interactive: "interactive",
  "UX/UI": "uxui",
  "Motion / 3D": "motion",
  Planning: "planning",
};

export const layers = [
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
