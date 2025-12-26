import { forwardRef } from "react";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  scrollbarColor?: string;
  thumbHeight?: number;
  maxHeight?: string | number;
}

export const ERPScrollArea = forwardRef<HTMLDivElement, CustomScrollbarProps>(
  ({scrollbarColor = "219,223,225", className = '', children, thumbHeight = 20, maxHeight, ...props }, ref) => {
    const appState = useAppSelector(
      (state: RootState) => state.AppState?.appState
    );
    const scrollbarWidth = appState.scrollbarWidth === 'md' ? 'scrollbar' : 'scrollbar-thin';
    const formState = useAppSelector((state: RootState) => state.InventoryTransaction);

    return (
      <div
        ref={ref}
        className={`scrollbar ${scrollbarWidth} ${className} dark:[--scrollbar-thumb:rgb(75,85,99)] dark:[--scrollbar-track:rgb(30,41,59)]`}
        style={{
          maxHeight: maxHeight,
          "--scrollbar-thumb": `rgb(${formState.userConfig?.scrollbarColor ?? "219,223,225"})`,
          "--scrollbar-track": "rgb(241,245,249)",
          "--tw-scrollbar-thumb": `rgb(${formState.userConfig?.scrollbarColor ?? "219,223,225"})`,
          "--tw-scrollbar-track": "rgb(241,245,249)",
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);
