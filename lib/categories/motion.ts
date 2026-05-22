import { CategoryInfo } from "@/lib/types";

const motion: CategoryInfo = {
  key: "motion",
  menuLabel: "Motion / 3D",
  name: "Motion / 3D",
  description:
    "Blender 기반 3D 모션, 시네마틱 무드, 비주얼 중심의 작업.",
  preview: ["Lighting", "Mood", "Cinematic"],
  transitionVideo: "/spider/green_Spider.mp4",
  hoverVideo: "/apple_locom.mp4",
  projects: [
    {
      title: "Kim Minho Hanja Graffiti",
      subtitle: "3D Modeling / Motion / Generative Artwork",
      description:
        "나의 이름 김민호의 한문 표기를 기반으로 Midjourney에 그라피티 아트워크를 생성한 뒤, 이를 3D 모델링으로 구체화하고 Blender로 모션까지 확장한 작업입니다. 텍스트 기반의 정체성을 시각적 조형 언어로 번역하고, 다시 움직이는 장면으로 발전시키는 과정을 담았습니다.",
      thumbnail: "/Graffiti.webp",
      externalLink: "https://www.threads.com/@minho_ya_01/post/C71AwkNPzw8?xmt=AQG0A_F-yFPK_WIcxbZXSPfJcxBG0LGwxreNyPB3vbBoxQ",
      linkLabel: "View on Threads",
      tools: ["Midjourney", "Blender"],
    },
    {
      title: "Bloom",
      subtitle: "3D Motion / Media Art",
      description:
        "대구 미디어아트 프로젝트 <Bloom>. 대구의 대표 축제인 달구벌 풍등축제에서 착안해, 풍등 하나하나에 대구의 매력적인 관광지를 담아 사람들이 이 도시를 직접 방문하길 바라는 의미를 담았습니다. 풍등이 소원을 실어 올리듯, 도시의 기억과 여행의 기대를 함께 띄워 보내는 3D 모션 작업입니다.",
      thumbnail: "https://img.youtube.com/vi/BvyQOmedkdY/maxresdefault.jpg",
      externalLink: "https://youtu.be/BvyQOmedkdY",
      linkLabel: "Watch Project",
      tools: ["Blender"],
    },
    {
      title: "AR PJ 1",
      subtitle: "3D Motion / Visual Experiment",
      description:
        "유튜브에 공개한 3D 비주얼 실험 작업. 공간감과 무드 연출에 집중해 짧은 시네마틱 장면을 구성한 모션 프로젝트입니다.",
      thumbnail: "https://img.youtube.com/vi/V-QcXbkdlkQ/maxresdefault.jpg",
      externalLink: "https://youtu.be/V-QcXbkdlkQ",
      linkLabel: "Watch Project",
    },
    {
      title: "Apple Commercial Redesign",
      subtitle: "Motion / 3D Experiment",
      description:
        "애플 맥북 네오가 출시된 후 그에 맞는 광고 영상. Blender로 Damonxart의 작품을 재구성하여 다이나믹함을 연출한 모션그래픽 실험.",
      thumbnail: "/apple_com.webp",
      externalLink: "https://www.instagram.com/reel/DWZSr7hEyzv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      tools: ["Blender"],
    },
    {
      title: "Eye Balls Motion Graphic",
      subtitle: "Motion / 3D",
      description:
        "눈알들이 빛을 따라다니고 동공들의 확장과 축소를 통해 디스플레이를 넘어 볼 수 있다는 컨셉으로 제작한 호러 장르의 3D 모션그래픽 작업.",
      thumbnail: "/eyes.webp",
      externalLink: "https://www.instagram.com/reel/DWaznDCk8Hx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      tools: ["Blender"],
    },
    {
      title: "Po-plot Land — World Art Expo 2025",
      subtitle: "3D Motion / Exhibition",
      description:
        "Po-plot 작가와 함께 코엑스 World Art Expo 2025에서 진행한 미디어아트 전시 기획. 20th Century Fox Records 오프닝에서 영감을 받아, Blender Particle 효과와 Mixamo의 10개 이상의 춤 동작을 활용해 춤추는 군중을 표현했습니다.",
      thumbnail: "/poplot.webp",
      externalLink: "https://www.threads.com/@minho_ya_01/post/DFceDnXPIEv?xmt=AQG0VjswFDp4ePd40zKikVt7KUezlF-063uynwWU5ixu5g",
      tools: ["Blender", "Mixamo"],
    },
    {
      title: "Avatar Level Design",
      subtitle: "3D Motion",
      description:
        "아바타2: 물의길 영화 개봉 후 판도라 행성의 환경을 구현해보고 싶었습니다. Blender와 Unreal Engine을 활용하여 판도라의 자연환경을 모티브로한 레벨디자인과 애니메이션을 제작한 프로젝트입니다",
      thumbnail: "/avatar2.webp",
      externalLink: "https://www.instagram.com/reel/DKu_KBsTGw3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      tools: ["Unreal Engine / Blender"],
    },
  ],
  color: "#00c96b",
  mid: "#19e28d",
  border: "border-emerald-400/40",
  glow: "shadow-[0_0_40px_rgba(0,201,107,0.28)]",
  backgroundGradient: ["#9dff67", "#00d46d", "#11b9ff", "#e3fff0"],
};

export default motion;