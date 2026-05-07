"use client";

import { memo } from "react";
import CosmicSpectrum from "@/components/scene/CosmicSpectrum";

interface ProfileSectionProps {
  isTouchLayout: boolean;
}

const ABOUT_METRICS = [
  { label: "Interactive", value: "Realtime installations and responsive prototyping" },
  { label: "UX/UI", value: "Flows shaped around behavior and clarity" },
  { label: "3D Motion", value: "Cinematic form and lighting storytelling" },
];

const SOCIAL_LINKS = [
  { href: "https://youtu.be/pVmaOwbiX9w?si=2sQeQX7UZIs3K1Tt", label: "YouTube" },
  { href: "https://www.instagram.com/mho.xxv/", label: "Instagram" },
  { href: "https://www.threads.com/@minho_ya_01", label: "Threads" },
];

const ProfileSection = ({ isTouchLayout }: ProfileSectionProps) => {
  return (
    <section id="about" className="relative min-h-[200svh] bg-[#0c0c0c]">
      {/* Background Transition Element */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end">
        <div className="atmosphere-overlay absolute inset-0 bg-[#f5f5f5] opacity-0 pointer-events-none z-0 transition-opacity duration-1000" />
        <CosmicSpectrum color="blue-black" blur={true} />
      </div>

      {/* Content Overlay */}
      <div
        className={`relative z-10 -mt-[100svh] flex flex-col items-center px-4 ${
          isTouchLayout ? "py-20" : "py-24"
        } sm:px-6 md:px-12`}
      >
        <div className="w-full max-w-5xl">
          <div className="rounded-[40px] border border-white/5 bg-black/60 p-8 backdrop-blur-2xl md:p-12">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40">Profile / Designer</p>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-7xl">
              Kim Minho
            </h2>
            <p className="mt-8 max-w-3xl text-2xl font-medium leading-tight text-white/90 md:text-4xl">
              I build immersive experiences that connect human emotion with digital motion.
            </p>
            
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <p className="text-lg leading-relaxed text-white/60">
                디지털 미디어 디자이너 김민호입니다. 실시간 인터랙티브 설치와 3D 모션을 통해 사용자의 감각이 반응하는 지점을 설계합니다.
              </p>
              <p className="text-lg leading-relaxed text-white/50">
                정적인 디자인을 넘어, 시선과 움직임이 어떻게 몰입으로 이어지는지에 집중하며 기억에 남는 장면을 만듭니다.
              </p>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {ABOUT_METRICS.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-colors hover:bg-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/30">{item.label}</p>
                  <p className="mt-4 text-sm leading-snug text-white/70">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap gap-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold uppercase tracking-tighter text-white/40 transition-colors hover:text-white md:text-3xl"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProfileSection);
