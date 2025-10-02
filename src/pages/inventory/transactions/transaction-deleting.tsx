import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ERPToast from '../../../components/ERPComponents/erp-toast';
import { useTranslation } from 'react-i18next';

interface DeletingOverlayProps {
  deleting: boolean;
  deleteCompleted: boolean;
  deletingSwitchAction: any;
}

const DeletingOverlay: React.FC<DeletingOverlayProps> = ({
  deleting = false,
  deleteCompleted = false,
  deletingSwitchAction
}) => {
  const showOverlay = deleting || deleteCompleted;
  const showLoading = deleting && !deleteCompleted;
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { t } = useTranslation('transaction');
  useEffect(() => {
    if (deleteCompleted) {
      setShowSuccess(true);
      if (deletingSwitchAction) {
        dispatch(deletingSwitchAction);
        ERPToast.show("Transaction Deleted Successfully", "success");
      }
    } else {
      setShowSuccess(false);
    }
  }, [deleteCompleted, dispatch, deletingSwitchAction]);

  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
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
    border: '3px solid #fee2e2',
    borderTopColor: '#ef4444',
    borderRightColor: '#dc2626',
    borderRadius: '50%',
    animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
  };

  const deletingTextStyles: React.CSSProperties = {
    color: '#374151',
    fontSize: '20px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.025em',
    marginBottom: '8px',
  };

  const deletingSubtextStyles: React.CSSProperties = {
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
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    margin: '0 2px',
    animation: `dots 1.6s infinite ease-in-out both`,
    animationDelay: delay,
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
  });

  const trashContainerStyles: React.CSSProperties = {
    width: '100px',
    height: '100px',
    marginBottom: '30px',
    position: 'relative',
    animation: showSuccess ? 'pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' : 'none',
  };

  const successTextStyles: React.CSSProperties = {
    color: '#dc2626',
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
        
        @keyframes trash-lid {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-5px) rotate(-15deg); }
          60% { transform: translateY(-5px) rotate(15deg); }
        }
        
        .trash-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2.5;
          stroke: #dc2626;
          fill: rgba(220, 38, 38, 0.1);
          animation: stroke 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          filter: drop-shadow(0 4px 8px rgba(220, 38, 38, 0.3));
        }
        
        .trash-icon {
          transform-origin: 50% 50%;
          stroke: #dc2626;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: fade-in 0.4s ease 0.8s forwards;
          opacity: 0;
        }
        
        .trash-lid {
          animation: trash-lid 0.6s ease 1.2s;
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
              <div style={deletingTextStyles}>
                {t('deleting_transaction')}
                <div style={dotsContainerStyles}>
                  <span style={dotStyles('-0.4s')}></span>
                  <span style={dotStyles('-0.2s')}></span>
                  <span style={dotStyles('0s')}></span>
                </div>
              </div>
              <div style={deletingSubtextStyles}>
                {t('please_wait_while_we_process_your_request')}
              </div>
            </div>
          )}

          {showSuccess && (
            <div
              className="success-container"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={trashContainerStyles}>
                <svg
                  style={{ width: '100%', height: '100%' }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="trash-circle"
                    cx="26"
                    cy="26"
                    r="25"
                  />
                  <g className="trash-icon">
                    {/* Trash can body */}
                    <path d="M18 20 L18 36 C18 37.5 19 38 20 38 L32 38 C33 38 34 37.5 34 36 L34 20" />
                    {/* Trash can lines */}
                    <line x1="22" y1="24" x2="22" y2="34" />
                    <line x1="26" y1="24" x2="26" y2="34" />
                    <line x1="30" y1="24" x2="30" y2="34" />
                    {/* Top rim */}
                    <path d="M16 20 L36 20" strokeWidth="2.5" />
                    {/* Lid */}
                    <path className="trash-lid" d="M22 16 L22 14 C22 13 23 12 24 12 L28 12 C29 12 30 13 30 14 L30 16" />
                  </g>
                </svg>
              </div>
              <div style={successTextStyles}>{t('transaction_deleted')}</div>
              <div style={successSubtextStyles}>
                {t('the_transaction_has_been_removed_successfully')}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeletingOverlay;