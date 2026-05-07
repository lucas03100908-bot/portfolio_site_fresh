import { CategoryInfo } from "@/lib/types";

const interactive: CategoryInfo = {
  key: "interactive",
  menuLabel: "Interactive",
  name: "Interactive Realtime",
  description:
    "TouchDesigner, Unity, Unreal 기반의 실시간 인터랙티브 프로젝트.",
  preview: ["Gesture", "Realtime", "Responsive"],
  transitionVideo: "/spider/orange_Spider.mp4",
  hoverVideo: "/Prototype_1.mp4",
  projects: [
    {
      title: "Dog Follow Prototype",
      subtitle: "Branding / Interactive Media Art / UX Design",
      description:
        "사용자의 위치 데이터를 기반으로 캐릭터가 실시간으로 반응하는 인터랙티브 프로토타입. 석사 졸업작품입니다. 현재 옥외광고의 문제점을 도출해내고 해결하기위해 공익광고를 제작 시도. 홍대입구를 기반으로 사용자가 더 몰입과 반응할 수 있도록 UX를 설계한 프로젝트",
      thumbnail: "/dog_proto.webp",
      externalLink: "https://youtu.be/pVmaOwbiX9w?si=2sQeQX7UZIs3K1Tt",
      linkLabel: "Watch Project",
      tools: ["TouchDesigner", "Unreal Engine"],
    },
    {
      title: "The Flare",
      subtitle: "Realtime Visual",
      description:
        "오마주를 주제로 한 실시간 인터랙티브 작업. 불타는 자신을 투영하여 영화'Whiplash'를 메인으로 오마주 시도. Unity와 Arduino를 활용하여 바람 센서 대신 마이크센서로 사용자가 실제 싸여진 통나무들에 힘들게 부채질을 하여 불곷이 커지게합니다. 이를 카운트 하여 일정 카운트 넘어가면 전부 타버려 재만 남아 연기가 날 수 있도록 구현한 프로젝트",
      thumbnail: "/BGE_PNU.webp",
      externalLink: "https://youtu.be/UwFO-dlauN0?si=Ulr2jR778ofTha63",
      tools: ["Unity", "Arduino"],
    },
    {
      title: "Emotion Track",
      subtitle: "Interactive Visual",
      description:
        "IDAS 김보연 교수님 이론을 반영했습니다. Design is to V(디자인은 동사다) 라는 이론으로 접근하여 Design is to Attract로 시작했음. 무표정사회라는 문제점을 해결하기 위해 디지털 옥외광고 메체를 가져와 지나가는 사람이 보고 웃을 수 있도록 유도. 부산 사투리를 사용해 다소 건방진 말투를 보여줌으로 관객에게있어서 피식 웃을 수 있게끔 유도하는것이 최종 목표. 웃거나, 슬플거나 화날때 표정 값을 가져와 각각 다른 비주얼을 보여주고 피식이 아니라 더 크게 웃는다면 다른 비주얼을 볼 수 있음 ",
      thumbnail: "/Emotion_TD.webp",
      externalLink: "https://www.threads.com/@minho_ya_01/post/DJPCmufhkbI?xmt=AQF02ww3hEPdsK5PkzoaFUWyh1wDrwAUc5x3UE6Yqr4Lgg",
      tools: ["TouchDesigner"],
    },
    {
      title: "Project BYEOLGOT(별것)",
      subtitle: "Interactive Installation / Realtime Experience",
      description:
        "안국역 근처 바이브아트센터에서 팀전시를 진행했습니다. 누군가에겐 별게아닐 수 있다는 관점으로 시작했습니다. 그래서 우주라는 매체로 세계관을 표현하였고, 웃으며 살자는 메세지를 담았습니다. 티셔츠과 굿즈를 제작하여 웃음을 유도 할 수 있었고 손으로 우주를 컨트롤하고 웃음과 동시에 우주가 터지며 화려한 비주얼을 보여주는 인터랙티브 설치 작업",
      thumbnail: "/Starboom.webp",
      externalLink: "https://youtu.be/I-KgWFnuZFg",
      tools: ["TouchDesigner"],
    },
  ],
  color: "#ff6a00",
  mid: "#ff8a1a",
  border: "border-orange-400/40",
  glow: "shadow-[0_0_40px_rgba(255,106,0,0.28)]",
  backgroundGradient: ["#ffbb66", "#ff7a00", "#ff4d6d", "#ffe5b8"],
};

export default interactive;