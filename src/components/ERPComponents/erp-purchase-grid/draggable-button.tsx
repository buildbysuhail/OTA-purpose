import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Plus } from "lucide-react";

function DraggablePlusButton() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const buttonSize = 56;
  

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!buttonRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  }, [position]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setHasMoved(true);

      const newX = clientX - dragStartRef.current.x;
      const newY = clientY - dragStartRef.current.y;
      const maxX = window.innerWidth - buttonSize;
      const maxY = window.innerHeight - buttonSize;

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: boundedX, y: boundedY });
    });
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Add & clean up global listeners
  useEffect(() => {
    if (!isDragging) return;

    const mouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    alert("Add button clicked!");
  };

  useEffect(() => {
  console.log("DraggablePlusButton mounted");
  return () => console.log("DraggablePlusButton unmounted");
}, []);

  return (
    <button
      ref={buttonRef}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }}
      onClick={handleClick}
      className={`fixed w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white 
        rounded-full shadow-lg flex items-center justify-center 
        transition-transform duration-200 pointer-events-auto 
        ${isDragging ? "scale-110 shadow-2xl" : "scale-100"}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
        zIndex: 9999,
      }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
}

export default memo(DraggablePlusButton);
