import * as React from "react";

interface ERPDisableEnableProps {
  targetCount?: number;
  onSuccess?: () => void; // Made optional in case it's not needed
  children?: (isDisabled: boolean) => React.ReactNode; // Render prop to pass `disabled` state
}

const ERPDisableEnable: React.FC<ERPDisableEnableProps> = ({
  targetCount,
  onSuccess,
  children,
}) => {
  const [clickCount, setClickCount] = React.useState(0);
  const [active, setActive] = React.useState<boolean>(true);
  const [lastClickTime, setLastClickTime] = React.useState<number | null>(null);
  const [hasPermitted, setHasPermitted] = React.useState(true); // Initial state is disabled
  const clickTimeWindow = 3000; // 3 seconds

  React.useEffect(() => {
    if(active){
      if (clickCount >= (targetCount??0)) {
        setHasPermitted(false); // Enable component after the required clicks
        if (onSuccess) onSuccess();
        setActive(false);
        setClickCount(0); // Reset click count after success
      }
  
      if (lastClickTime) {
        const timer = setTimeout(() => {
          setClickCount(0);
          setLastClickTime(null);
        }, clickTimeWindow);
  
        return () => clearTimeout(timer);
      }
    }
  }, [clickCount, lastClickTime, targetCount, onSuccess,active]);

  const handleClick = () => {
    const currentTime = Date.now();
    if (lastClickTime && currentTime - lastClickTime > clickTimeWindow) {
      setClickCount(1); // Reset count if time window has passed
    } else {
      setClickCount((prevCount) => prevCount + 1);
    }
    setLastClickTime(currentTime);
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {children && children(hasPermitted)} {/* Pass disabled state to children */}
     
    </div>
  );
};

export default ERPDisableEnable;
