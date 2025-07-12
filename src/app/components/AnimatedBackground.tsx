import React from 'react';
import { useAnimatedBackground } from '../hooks/useAnimateBackground';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useAnimatedBackground(isDarkMode);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ position: 'fixed' }}
    />
  );
};