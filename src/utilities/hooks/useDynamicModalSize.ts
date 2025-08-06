// useDynamicModalSize.ts
import { useRef, useState, useEffect, useCallback } from 'react';

export const useDynamicModalSize = (minWidth = 400, minHeight = 200, padding = 40) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: minWidth, height: minHeight + 80 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const measureContent = useCallback(() => {
    if (contentRef.current) {
      // Force a reflow to get accurate measurements
      contentRef.current.style.height = 'auto';
      contentRef.current.style.width = 'auto';
      
      const { scrollWidth, scrollHeight, offsetWidth, offsetHeight } = contentRef.current;
      
      // Use the larger of scroll or offset dimensions
      const contentWidth = Math.max(scrollWidth, offsetWidth);
      const contentHeight = Math.max(scrollHeight, offsetHeight);

      // Only update if size actually changed
      if (lastSizeRef.current.width !== contentWidth || lastSizeRef.current.height !== contentHeight) {
        lastSizeRef.current = { width: contentWidth, height: contentHeight };
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Increased maximum constraints for larger content
        const maxModalWidth = Math.min(windowWidth - 60, 1200); // Increased from 800
        const maxModalHeight = Math.min(windowHeight - 60, 800); // Increased from 600
        
        const calculatedWidth = Math.min(
          Math.max(contentWidth + padding, minWidth),
          maxModalWidth
        );
        
        const calculatedHeight = Math.min(
          Math.max(contentHeight + 120, minHeight), // Increased padding for header/footer
          maxModalHeight
        );
        
        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight
        });
      }
    }
  }, [minWidth, minHeight, padding]);

  useEffect(() => {
    if (contentRef.current) {
      // Initial measurement with delay to ensure content is rendered
      // setTimeout(measureContent, 50);
      // setTimeout(measureContent, 200); // Second measurement for dynamic content
      // setTimeout(measureContent, 500); // Third measurement for slower loading content
      
      // // Polling approach for content changes
      // intervalRef.current = setInterval(measureContent, 200); // Increased frequency
      
      // // Window resize handler
      // const handleResize = () => measureContent();
      // window.addEventListener('resize', handleResize);
      
      // // MutationObserver for content changes
      // const mutationObserver = new MutationObserver(() => {
      //   setTimeout(measureContent, 50);
      // });
      
      // mutationObserver.observe(contentRef.current, {
      //   childList: true,
      //   subtree: true,
      //   attributes: true,
      //   characterData: true,
      //   attributeFilter: ['style', 'class']
      // });
      
      // return () => {
      //   if (intervalRef.current) {
      //     clearInterval(intervalRef.current);
      //   }
      //   window.removeEventListener('resize', handleResize);
      //   mutationObserver.disconnect();
      // };
      // measureContent();
    }
  }, [measureContent]);

  return { contentRef, dimensions, measureContent };
};
