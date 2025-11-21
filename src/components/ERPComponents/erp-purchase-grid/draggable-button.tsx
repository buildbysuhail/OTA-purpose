import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Plus } from "lucide-react";

interface DraggablePlusButtonProps {
  onClick?: () => void;
}

const DraggablePlusButton: React.FC<DraggablePlusButtonProps> = ({ onClick }) => {
  const buttonSize = 56;
  const rightOffset = 20;
  const bottomOffset = 100;

  const [position, setPosition] = useState(() => ({
    x: window.innerWidth - buttonSize - rightOffset,
    y: window.innerHeight - buttonSize - bottomOffset,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      setHasMoved(false);
      dragStartRef.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      };
    },
    [position]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        setHasMoved(true);

        const newX = clientX - dragStartRef.current.x;
        const newY = clientY - dragStartRef.current.y;

        const maxX = window.innerWidth - buttonSize;
        const maxY = window.innerHeight - buttonSize;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      });
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const mouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      handleMove(t.clientX, t.clientY);
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      return; // prevent click after drag
    }
    onClick?.(); // call parent onClick
  };

  return (
    <button
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        const t = e.touches[0];
        handleStart(t.clientX, t.clientY);
      }}
      onClick={handleClick}
      className={`fixed w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white
        rounded-full shadow-xl flex items-center justify-center
        transition-transform duration-200
        ${isDragging ? "scale-110" : "scale-100"}
      `}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
        zIndex: 9999,
      }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
};

export default memo(DraggablePlusButton);
