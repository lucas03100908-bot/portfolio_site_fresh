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