import { forwardRef } from "react";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  thumbHeight?: number;
  maxHeight?: string | number;
}

export const ERPScrollArea = forwardRef<HTMLDivElement, CustomScrollbarProps>(({ className = '', children, thumbHeight = 20, maxHeight, ...props }, ref) => {
  const appState = useAppSelector((state: RootState) => state.AppState?.appState);
  const scrollbarThumbColor = appState.mode === 'dark' ? "107,114,128" : "219,223,225";
  const scrollbarTrackColor = appState.mode === 'dark' ? "31,41,55" : "241,245,249";
  const scrollbarWidth = appState.scrollbarWidth === 'md' ? 'scrollbar' : 'scrollbar-thin';
  return (
    <div
      ref={ref}
      className={`scrollbar ${scrollbarWidth} ${className} ${appState.mode === 'dark' ? 'dark' : ''}`}
      style={
        {
          maxHeight: maxHeight,
          "--scrollbar-thumb": `rgb(${scrollbarThumbColor})`,
          "--scrollbar-track": `rgb(${scrollbarTrackColor})`,
          "--tw-scrollbar-thumb": `rgb(${scrollbarThumbColor})`,
          "--tw-scrollbar-track": `rgb(${scrollbarTrackColor})`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
);
