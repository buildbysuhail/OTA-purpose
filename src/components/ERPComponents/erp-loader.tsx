import React from "react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface BlurLoaderProps {
  text: string;
  width?: number | string;
  height?: number | string;
}

const BlurLoader: React.FC<BlurLoaderProps> = ({
  text,
  width = 120,
  height = 120,
}) => {
  // Normalize width/height for style (if number => append "px")
  const normalizeSize = (size: number | string) =>
    typeof size === "number" ? `${size}px` : size;

  return (
    <>
      <style>
        {`
          :root {
            --loader-color: #4fc3f7;
            --loader-bg: rgba(111, 200, 255, 0.19);
            --overlay-bg: rgba(30, 30, 50, 0.28);
            --card-bg: rgba(36, 40, 56, 0.93);
            --card-border: rgba(143, 220, 250, 0.12);
            --text-color: #e5f7fe;
            --font-family: 'Ubuntu', sans-serif;
          }

          @keyframes blur-fade-in {
            0% { opacity: 0; transform: scale(1.03); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes loading-dots {
            0%   { content: ""; }
            25%  { content: "."; }
            50%  { content: ".."; }
            75%  { content: "..."; }
            100% { content: ""; }
          }

          .blur-loader-overlay {
            animation: blur-fade-in 0.35s cubic-bezier(0.4,0.2,0.1,1);
            backdrop-filter: blur(6px);
            background: var(--overlay-bg);
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: wait;
            padding: 1rem;
            box-sizing: border-box;
          }

          .lottie-wrapper {
            width: ${normalizeSize(width)};
            height: ${normalizeSize(height)};
            margin-bottom: 28px;
            user-select: none;
            /* Optional: add subtle glow shadow */
            filter: drop-shadow(0 0 10px var(--loader-color));
          }

          .blrloader-card {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.15rem 2.6rem;
            background: var(--card-bg);
            color: var(--text-color);
            border-radius: 16px;
            font-size: 26px;
            font-weight: 600;
            letter-spacing: 2.5px;
            box-shadow: 0 6px 36px 0 rgba(88, 188, 250, 0.07);
            border: 1.5px solid var(--card-border);
            font-family: var(--font-family);
            white-space: nowrap;
          }

          .blur-loader-dots::after {
            display: inline-block;
            margin-left: 6px;
            animation: loading-dots 1.3s steps(4, end) infinite;
            content: "";
          }
        `}
      </style>
      <div
        className="blur-loader-overlay"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="lottie-wrapper" aria-hidden="true">
          {/* <DotLottieReact
            autoplay
            loop
            src="https://lottie.host/9163bda5-cb32-4cf8-8354-ea549c27bb4b/ZbSrbFIMjE.lottie"
            // src="https://lottie.host/28a5bd0c-1d35-45d4-8758-13534f8e5f3a/QzhX59zfks.lottie"
            style={{ width: "100%", height: "100%" }}
          /> */}
        </div>

        <div className="blrloader-card">
          <span>{text}</span>
          {/* <span className="blur-loader-dots" /> */}
        </div>
      </div>
    </>
  );
};

export default BlurLoader;
