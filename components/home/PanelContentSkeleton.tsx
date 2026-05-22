"use client";

export default function PanelContentSkeleton() {
  return (
    <>
      <div className="relative mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] md:mt-5 md:rounded-[28px]">
        <div className="relative h-56 sm:h-64 md:h-[320px]">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_24%_24%,rgba(255,255,255,0.1)_0%,transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7">
            <div className="h-3 w-20 rounded-full bg-white/12" />
            <div className="mt-3 h-9 w-56 max-w-[70%] rounded-full bg-white/14" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/10" />
            <div className="mt-2 h-4 w-[78%] max-w-xl rounded-full bg-white/8" />
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`panel-chip-skeleton-${index}`}
                  className="h-7 w-24 animate-pulse rounded-full bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 md:gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`panel-card-skeleton-${index}`}
            aria-hidden="true"
            className="h-[320px] animate-pulse rounded-[22px] border border-white/8 bg-white/[0.04]"
          />
        ))}
      </div>
    </>
  );
}
