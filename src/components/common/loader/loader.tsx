import React, { useState, useEffect } from 'react';
import './loader.scss';

interface PolosysLoaderProps {
  isOnline: boolean;
}

const PolosysLoader: React.FC<PolosysLoaderProps> = ({ isOnline }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing System...');
 
  const loadingStages = [
    'Initializing System...',
    'Loading Core Modules...',
    'Connecting to Database...',
    'Authenticating User...',
    'Loading Dashboard...',
    'Finalizing Setup...'
  ];

  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute rounded-full blur-3xl animate-pulse"
            style={{
              top: '25%',
              left: '25%',
              width: '16rem',
              height: '16rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }}
          ></div>
          <div 
            className="absolute rounded-full blur-2xl animate-pulse"
            style={{
              bottom: '25%',
              right: '25%',
              width: '12rem',
              height: '12rem',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              animationDelay: '2s'
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center space-y-12">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Main Logo */}
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <div 
                    className="w-4 h-4 rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, #2563eb 0%, #0891b2 100%)'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Scanning Line Effect */}
              <div className="absolute inset-0 w-16 h-16 rounded-xl overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full animate-scan"
                  style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="text-center">
              <h1 
                className="text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(90deg, #ffffff 0%, #dbeafe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Polosys
              </h1>
              <p 
                className="text-sm font-medium tracking-widest uppercase"
                style={{ color: '#93c5fd' }}
              >
                Enterprise Resource Planning
              </p>
            </div>
          </div>

          {/* Professional Line Loader */}
          <div className="flex flex-col items-center space-y-8">
            
            {/* Main Progress Lines */}
            <div className="flex flex-col space-y-4">
              {/* Primary Loading Line */}
              <div 
                className="relative w-80 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
              >
                <div 
                  className="absolute inset-0 rounded-full animate-slide"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6 0%, #22d3ee 50%, #3b82f6 100%)'
                  }}
                ></div>
              </div>
              
              {/* Secondary Loading Line */}
              <div 
                className="relative w-64 mx-auto rounded-full overflow-hidden"
                style={{ 
                  height: '2px',
                  backgroundColor: 'rgba(51, 65, 85, 0.3)' 
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full animate-pulse-slide"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #67e8f9 50%, transparent 100%)'
                  }}
                ></div>
              </div>
              
              {/* Tertiary Loading Line */}
              <div 
                className="relative w-48 mx-auto rounded-full overflow-hidden"
                style={{ 
                  height: '2px',
                  backgroundColor: 'rgba(51, 65, 85, 0.2)' 
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full animate-reverse-slide"
                  style={{
                    background: 'linear-gradient(90deg, #60a5fa 0%, #67e8f9 100%)'
                  }}
                ></div>
              </div>
            </div>
{isOnline &&
(
  <>
            {/* Loading Text */}
            <div className="text-center">
              <p 
                className="text-lg font-medium h-6 flex items-center justify-center"
                style={{ color: '#ffffff' }}
              >
                {loadingText}
              </p>
            </div>

            {/* Minimal Status Indicators */}
            <div className="flex space-x-8">
              {[
                { label: 'Core', active: true },
                { label: 'Auth', active: true },
                { label: 'Data', active: false },
                { label: 'UI', active: false }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-2 h-8 rounded-full transition-all duration-1000 animate-pulse"
                    style={{
                      background: item.active 
                        ? 'linear-gradient(180deg, #3b82f6 0%, #22d3ee 100%)' 
                        : '#475569',
                      animationDelay: `${index * 0.5}s`
                    }}
                  ></div>
                  <span 
                    className="text-xs font-medium"
                    style={{
                      color: item.active ? '#93c5fd' : '#64748b'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
</>)}
          </div>

          {/* System Status */}
          <div 
            className="flex items-center space-x-3 text-sm"
            style={{ color: '#93c5fd' }}
          >
           
            {isOnline ? (
             <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-4 rounded-full animate-wave"
                  style={{
                    backgroundColor: '#4ade80',
                    animationDelay: `${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
          ) : (
            /* Offline Animation */
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-4 rounded-full"
                  style={{
                    backgroundColor: '#ef4444',
                    animationDelay: `${i * 0.2}s`,
                    animation: 'fade 2s ease-in-out infinite'
                  }}
                ></div>
              ))}
            </div>
          )}
           
    {isOnline?  (
      <span className="font-medium">System Online </span>
    ): <span className="font-medium">System Offline</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolosysLoader;