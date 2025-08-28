import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ERPToast from '../../../components/ERPComponents/erp-toast';

interface SavingOverlayProps {
  saving: boolean;
  saveCompleted: boolean;
  savingSwitchAction: any;
}

const SavingOverlay: React.FC<SavingOverlayProps> = ({ 
  saving = false, 
  saveCompleted = false, 
  savingSwitchAction 
}) => {
  const showOverlay = saving || saveCompleted;
  const showLoading = saving && !saveCompleted;
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (saveCompleted) {
      setShowSuccess(true);
      if (savingSwitchAction) {
        dispatch(savingSwitchAction);
        ERPToast.show("Transaction Saved Successfully", "success");
      }
    } else {
      setShowSuccess(false);
    }
  }, [saveCompleted, dispatch, savingSwitchAction]);

  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.4)', // Dark semi-transparent background
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    opacity: showOverlay ? 1 : 0,
    visibility: showOverlay ? 'visible' : 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
  };

  const contentCardStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px 50px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '300px',
    transform: showOverlay ? 'scale(1)' : 'scale(0.9)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const loaderStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    position: 'relative',
    marginBottom: '30px',
  };

  const loaderCircleStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: '3px solid #e2e8f0',
    borderTopColor: '#6366f1',
    borderRightColor: '#8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
  };

  const savingTextStyles: React.CSSProperties = {
    color: '#374151',
    fontSize: '20px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.025em',
    marginBottom: '8px',
  };

  const savingSubtextStyles: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '400',
    opacity: 0.8,
  };

  const dotsContainerStyles: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '8px',
  };

  const dotStyles = (delay: string): React.CSSProperties => ({
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    margin: '0 2px',
    animation: `dots 1.6s infinite ease-in-out both`,
    animationDelay: delay,
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
  });

  const checkmarkContainerStyles: React.CSSProperties = {
    width: '100px',
    height: '100px',
    marginBottom: '30px',
    position: 'relative',
    animation: showSuccess ? 'pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' : 'none',
  };

  const successTextStyles: React.CSSProperties = {
    color: '#059669',
    fontSize: '22px',
    fontWeight: '700',
    animation: showSuccess ? 'fade-in 0.5s ease 0.4s forwards' : 'none',
    opacity: 0,
    letterSpacing: '-0.025em',
    marginBottom: '8px',
  };

  const successSubtextStyles: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '400',
    animation: showSuccess ? 'fade-in 0.5s ease 0.6s forwards' : 'none',
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
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(-90deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes fade-in {
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
          }
          50% { 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
          }
        }
        
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2.5;
          stroke: #10b981;
          fill: rgba(16, 185, 129, 0.1);
          animation: stroke 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
        }
        
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #10b981;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        .success-container {
          transform: translateY(10px);
        }
      `}</style>

      <div style={overlayStyles}>
        <div style={contentCardStyles}>
          {showLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={loaderStyles}>
                <div style={loaderCircleStyles}></div>
              </div>
              <div style={savingTextStyles}>
                Saving Transaction
                <div style={dotsContainerStyles}>
                  <span style={dotStyles('-0.4s')}></span>
                  <span style={dotStyles('-0.2s')}></span>
                  <span style={dotStyles('0s')}></span>
                </div>
              </div>
              <div style={savingSubtextStyles}>
                Please wait while we process your request
              </div>
            </div>
          )}

          {showSuccess && (
            <div 
              className="success-container"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={checkmarkContainerStyles}>
                <svg 
                  style={{ width: '100%', height: '100%' }} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 52 52"
                >
                  <circle 
                    className="checkmark-circle" 
                    cx="26" 
                    cy="26" 
                    r="25" 
                  />
                  <path 
                    className="checkmark-check" 
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <div style={successTextStyles}>Transaction Saved!</div>
              <div style={successSubtextStyles}>
                Your changes have been saved successfully
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavingOverlay;