import React, { useEffect } from "react";

const Nodevwatermark: React.FC = () => {
  useEffect(() => {
    // Variable to store the interval ID
    let interval: NodeJS.Timeout;

    // Function to find and click the element
    const clickElement = () => {
      interval = setInterval(() => {
        const element = document.querySelector(
          "body > dx-license > div:nth-child(2)"
        );

        if (element instanceof HTMLElement) {
          element.click();
          console.log("Element clicked successfully.");
          clearInterval(interval); // Stop checking once the element is found and clicked
        } else {
          console.warn("Element not found, retrying...");
        }
      }, 500); // Retry every 500ms
    };

    // Call the function when the component mounts
    clickElement();

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      {/* <h1>Auto Clicker</h1>
      <p>The component will attempt to click the specified element on mount.</p> */}
    </div>
  );
};

export default Nodevwatermark;
