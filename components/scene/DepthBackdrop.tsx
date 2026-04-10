export default function DepthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(144,230,255,0.10) 0%, rgba(76,154,217,0.06) 10%, rgba(12,22,34,0.12) 24%, rgba(0,0,0,0) 42%),
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 34%, rgba(0,0,0,0.54) 72%, rgba(0,0,0,0.94) 100%)
          `,
        }}
      />
    </div>
  );
}
