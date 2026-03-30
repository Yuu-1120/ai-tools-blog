'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface RibbonsProps {
  colors?: string[];
  baseThickness?: number;
  speedMultiplier?: number;
}

const Ribbons: React.FC<RibbonsProps> = ({
  colors = ['#D5BDAF', '#E3D5CA', '#D5BDAF', '#E3D5CA'],
  baseThickness = 30,
  speedMultiplier = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const ribbonElements = colors.map((color, index) => (
    <motion.div
      key={index}
      className='absolute left-0 right-0 h-full'
      style={{
        top: `${15 + index * 18}%`,
        background: `linear-gradient(90deg, 
          ${color}00 0%, 
          ${color}40 25%, 
          ${color}80 50%, 
          ${color}40 75%, 
          ${color}00 100%)`,
        height: baseThickness,
        filter: `blur(${baseThickness / 4}px)`
      }}
      animate={{
        x: [0, 30, -30, 0],
        scaleY: [1, 1.2, 0.9, 1],
        opacity: [0.3, 0.6, 0.4, 0.3]
      }}
      transition={{
        duration: 8 / speedMultiplier + index,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.5
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      className='absolute inset-0 overflow-hidden pointer-events-none'
      style={{ background: 'transparent' }}
    >
      {ribbonElements}

      <motion.div
        className='absolute inset-0'
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(245,235,224,0.3) 100%)'
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default Ribbons;
