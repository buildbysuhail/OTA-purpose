import { forwardRef } from "react";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    thumbHeight?: number;
    customStyle?:string;
  }
  
  export const ERPScrollArea = forwardRef<HTMLDivElement, CustomScrollbarProps>(
    ({ className = '', children,thumbHeight = 20, customStyle, ...props }, ref) => {
      const appState = useAppSelector(
        (state: RootState) => state.AppState?.appState
      );
      const scrollbarWidth = appState.scrollbarWidth === 'md' ? 'scrollbar' : 'scrollbar-thin';
      return (
        <div
          ref={ref}
          className={` scrollbar ${scrollbarWidth}  ${className}`}
          style={
            {
              maxHeight:`${customStyle}`,
                "--scrollbar-thumb": `rgb(${appState.scrollbarColor ?? "219,223,225"})`,
                "--scrollbar-track": "rgb(241,245,249)",
                "--tw-scrollbar-thumb": `rgb(${appState.scrollbarColor ?? "219,223,225"})`,
                "--tw-scrollbar-track": "rgb(241,245,249)",
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      );
    }
  );



     