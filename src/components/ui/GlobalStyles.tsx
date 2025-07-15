import React from 'react';

export const GlobalStyles: React.FC = () => (
  <style jsx>{`
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in {
      animation: fade-in 0.6s ease-out forwards;
      opacity: 0;
    }
    
    .animate-slide-down {
      animation: slide-down 0.6s ease-out forwards;
      opacity: 0;
    }
    
    .animate-slide-up {
      animation: slide-up 0.6s ease-out forwards;
      opacity: 0;
    }
  `}</style>
);