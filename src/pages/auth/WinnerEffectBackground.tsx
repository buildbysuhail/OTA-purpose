import React, { useRef, useEffect } from "react";

interface WinnerEffectBackgroundProps {
  isActive?: boolean;
  duration?: number;
  overlayText?: string;
}

const WinnerEffectBackground: React.FC<WinnerEffectBackgroundProps> = ({
  isActive = false,
  duration = 5000,
//   overlayText = "Winner!",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const confetti: {
      x: number;
      y: number;
      r: number;
      color: string;
      tilt: number;
      tiltAngleIncrement: number;
      tiltAngle: number;
    }[] = [];

    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];
    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        r: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      });
    }

    let animationFrame: number;
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncrement;
        c.y += (Math.cos(c.tiltAngle) + 3 + c.r / 2) * 0.7;
        c.x += Math.sin(c.tiltAngle);
        c.tilt = Math.sin(c.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = c.r / 2;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 3);
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    const stopTimeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(stopTimeout);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      {isActive && (
        <div className="absolute text-6xl font-extrabold text-yellow-400 drop-shadow-lg animate-pulse">
          {/* {overlayText} */}
        </div>
      )}
    </div>
  );
};

export default WinnerEffectBackground;