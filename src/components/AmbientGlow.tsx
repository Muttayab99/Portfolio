export function AmbientGlow() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div className="glow-blob glow-blob--1" />
      <div className="glow-blob glow-blob--2" />
      <div className="glow-blob glow-blob--3" />
      <style>{`
        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.8;
          animation: waveAnimation 12s infinite alternate ease-in-out;
          will-change: transform;
          transform: translateZ(0);
        }

        .glow-blob--1 {
          width: 60vw;
          height: 60vw;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, rgba(0,0,0,0) 60%);
          animation-delay: 0s;
        }

        .glow-blob--2 {
          width: 70vw;
          height: 50vw;
          bottom: -10%;
          right: -10%;
          background: radial-gradient(circle, rgba(148, 163, 184, 0.2) 0%, rgba(0,0,0,0) 60%);
          animation-delay: -4s;
          animation-duration: 15s;
        }

        .glow-blob--3 {
          width: 50vw;
          height: 80vw;
          top: 10%;
          left: 10%;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, rgba(0,0,0,0) 60%);
          animation-delay: -8s;
          animation-duration: 18s;
        }

        @keyframes waveAnimation {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(15%, 20%) scale(1.15);
          }
          66% {
            transform: translate(-15%, 15%) scale(0.85);
          }
          100% {
            transform: translate(20%, -15%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
