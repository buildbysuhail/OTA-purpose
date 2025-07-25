import React from "react";

interface BlurLoaderProps {
  text: string;
}

const BlurLoader: React.FC<BlurLoaderProps> = ({ text }) => {
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
          }

          @keyframes blur-fade-in {
            0% { opacity: 0; transform: scale(1.03); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes spinner-rotate {
            0% { transform: rotate(0); }
            100% { transform: rotate(360deg); }
          }

          @keyframes spinner-glow {
            0%, 100% {
              box-shadow: 0 0 10px 2px var(--loader-color);
            }
            50% {
              box-shadow: 0 0 20px 6px var(--loader-color);
            }
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
          }

          .blur-loader-spinner {
            animation: spinner-rotate 1.5s ease-in-out infinite, spinner-glow 2.8s ease-in-out infinite;
            border: 6px solid var(--loader-bg);
            border-top: 6px solid var(--loader-color);
            border-radius: 50%;
            width: 56px;
            height: 56px;
            margin-bottom: 26px;
            transform-origin: center;
            will-change: transform, box-shadow;
          }

          .blrloader-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 1.15rem 2.6rem;
            background: var(--card-bg);
            color: var(--text-color);
            border-radius: 16px;
            font-size: 26px;
            font-weight: 600;
            letter-spacing: 2.5px;
            box-shadow: 0 6px 36px 0 rgba(88,188,250,0.07);
            border: 1.5px solid var(--card-border);
            position: relative;
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
        <div className="blur-loader-spinner" />
        <div className="blrloader-card">
          <span>{text}</span>
          <span className="blur-loader-dots" />
        </div>
      </div>
    </>
  );
};

export default BlurLoader;
