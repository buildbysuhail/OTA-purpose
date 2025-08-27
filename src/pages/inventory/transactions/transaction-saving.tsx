import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface SavingOverlayProps {
  saving: boolean;
  saveCompleted: boolean;
  savingSwitchAction: any;
}

const SavingOverlay: React.FC<SavingOverlayProps> = ({ saving = false, saveCompleted = false, savingSwitchAction }) => {
  const showOverlay = saving;
  const showLoading = saving;
  const [showSuccess, setShowSuccess] = useState<boolean>(saveCompleted);
  const dispatch = useDispatch()
  useEffect(() => {
    setShowSuccess(saveCompleted)

    if (saveCompleted && savingSwitchAction) {
      const timer = setTimeout(() => {
        dispatch(savingSwitchAction)
      }, 1200)

      return () => clearTimeout(timer) // cleanup on unmount or re-run
    }
  }, [saveCompleted, dispatch])
  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    opacity: showOverlay ? 1 : 0,
    visibility: showOverlay ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    zIndex: 1000,
  };

  const loaderStyles: React.CSSProperties = {
    width: '60px',
    height: '60px',
    position: 'relative',
    marginBottom: '20px',
  };

  const loaderCircleStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: '4px solid #e5e7eb',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const savingTextStyles: React.CSSProperties = {
    color: '#6366f1',
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  };

  const dotsContainerStyles: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '5px',
  };

  const dotStyles = (delay: string): React.CSSProperties => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#6366f1',
    margin: '0 2px',
    animation: `dots 1.4s infinite ease-in-out both`,
    animationDelay: delay,
  });

  const checkmarkStyles: React.CSSProperties = {
    width: '60px',
    height: '60px',
    marginBottom: '20px',
    animation: showSuccess ? 'pop-in 0.5s ease forwards' : 'none',
  };

  const successTextStyles: React.CSSProperties = {
    color: '#10b981',
    fontSize: '18px',
    fontWeight: '600',
    animation: showSuccess ? 'fade-in 0.4s ease 0.8s forwards' : 'none',
    opacity: 0,
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes dots {
          0%, 80%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes fade-in {
          to { opacity: 1; }
        }
        
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke: #10b981;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #10b981;
          stroke-width: 3;
          fill: none;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }
      `}</style>

      <div style={overlayStyles}>
        {showLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={loaderStyles}>
              <div style={loaderCircleStyles}></div>
            </div>
            <div style={savingTextStyles}>
              Saving
              <div style={dotsContainerStyles}>
                <span style={dotStyles('-0.32s')}></span>
                <span style={dotStyles('-0.16s')}></span>
                <span style={dotStyles('0s')}></span>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg style={checkmarkStyles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div style={successTextStyles}>Saved Successfully!</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavingOverlay;
