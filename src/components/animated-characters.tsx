'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface CharacterConfig {
  scale?: number;
  mouseSensitivityX?: number;
  mouseSensitivityY?: number;
  bodySkewSensitivity?: number;
  pupilFollowFactor?: number;
  blinkMinInterval?: number;
  blinkRandomRange?: number;
  blinkDuration?: number;
  transitionDuration?: number;
  purpleColor?: string;
  blackColor?: string;
  orangeColor?: string;
  yellowColor?: string;
  errorRecoverDelay?: number;
  peekMinInterval?: number;
  peekRandomRange?: number;
}

interface AnimatedCharactersProps {
  config?: CharacterConfig;
  focusedField?: 'none' | 'email' | 'password' | 'other';
  isPasswordVisible?: boolean;
  passwordLength?: number;
  isLoginError?: boolean;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function AnimatedCharacters({
  config = {},
  focusedField = 'none',
  isPasswordVisible = false,
  passwordLength = 0,
  isLoginError = false
}: AnimatedCharactersProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isOrangeBlinking, setIsOrangeBlinking] = useState(false);
  const [isYellowBlinking, setIsYellowBlinking] = useState(false);

  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const purplePeekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lookingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  const c = useMemo(
    () => ({
      scale: config.scale ?? 0.88,
      mouseSensitivityX: config.mouseSensitivityX ?? 20,
      mouseSensitivityY: config.mouseSensitivityY ?? 30,
      bodySkewSensitivity: config.bodySkewSensitivity ?? 120,
      pupilFollowFactor: config.pupilFollowFactor ?? 0.35,
      blinkMinInterval: config.blinkMinInterval ?? 2500,
      blinkRandomRange: config.blinkRandomRange ?? 3500,
      blinkDuration: config.blinkDuration ?? 140,
      transitionDuration: config.transitionDuration ?? 0.7,
      purpleColor: config.purpleColor ?? '#6C3FF5',
      blackColor: config.blackColor ?? '#171717',
      orangeColor: config.orangeColor ?? '#FF8433',
      yellowColor: config.yellowColor ?? '#E6CA0A',
      errorRecoverDelay: config.errorRecoverDelay ?? 2000,
      peekMinInterval: config.peekMinInterval ?? 2000,
      peekRandomRange: config.peekRandomRange ?? 3000
    }),
    []
  );

  const schedulePurplePeek = useCallback(() => {
    if (purplePeekTimerRef.current) clearTimeout(purplePeekTimerRef.current);
    purplePeekTimerRef.current = setTimeout(
      () => {
        setIsPurplePeeking(true);
        purplePeekTimerRef.current = setTimeout(() => {
          setIsPurplePeeking(false);
          if (isPasswordVisible && passwordLength > 0) schedulePurplePeek();
        }, 800);
      },
      Math.random() * c.peekRandomRange + c.peekMinInterval
    );
  }, [c.peekRandomRange, c.peekMinInterval, isPasswordVisible, passwordLength]);

  useEffect(() => {
    if (isPasswordVisible && passwordLength > 0) {
      schedulePurplePeek();
    } else {
      if (purplePeekTimerRef.current) clearTimeout(purplePeekTimerRef.current);
      setIsPurplePeeking(false);
    }
    return () => {
      if (purplePeekTimerRef.current) clearTimeout(purplePeekTimerRef.current);
    };
  }, [isPasswordVisible, passwordLength, schedulePurplePeek]);

  useEffect(() => {
    if (isLoginError) {
      setInternalError(true);
      if (loginErrorTimerRef.current) clearTimeout(loginErrorTimerRef.current);
      loginErrorTimerRef.current = setTimeout(() => {
        setInternalError(false);
      }, c.errorRecoverDelay);
    } else {
      if (loginErrorTimerRef.current) clearTimeout(loginErrorTimerRef.current);
      setInternalError(false);
    }
    return () => {
      if (loginErrorTimerRef.current) clearTimeout(loginErrorTimerRef.current);
    };
  }, [isLoginError, c.errorRecoverDelay]);

  useEffect(() => {
    if (lookingTimerRef.current) clearTimeout(lookingTimerRef.current);
    const wasNonText = focusedField === 'password' || focusedField === 'none';
    const isNowText = focusedField !== 'password' && focusedField !== 'none';
    if (wasNonText && isNowText) {
      setIsLookingAtEachOther(true);
      lookingTimerRef.current = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [focusedField]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [isPasswordVisible]);

  const attachMouse = useCallback(() => {
    if (mouseMoveHandlerRef.current) return;
    mouseMoveHandlerRef.current = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', mouseMoveHandlerRef.current);
  }, []);

  const detachMouse = useCallback(() => {
    if (mouseMoveHandlerRef.current) {
      window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      mouseMoveHandlerRef.current = null;
    }
  }, []);

  const setDefaultMouse = useCallback(() => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setMouseX(r.left + r.width * 0.5);
    setMouseY(r.top + r.height * 0.48);
  }, []);

  const startBlinking = useCallback(() => {
    const schedule = (setter: (v: boolean) => void) => {
      const t = setTimeout(
        () => {
          setter(true);
          setTimeout(() => {
            setter(false);
            schedule(setter);
          }, c.blinkDuration);
        },
        Math.random() * c.blinkRandomRange + c.blinkMinInterval
      );
      blinkTimersRef.current.push(t);
    };
    schedule((v) => setIsPurpleBlinking(v));
    schedule((v) => setIsBlackBlinking(v));
    schedule((v) => setIsOrangeBlinking(v));
    schedule((v) => setIsYellowBlinking(v));
  }, [c.blinkDuration, c.blinkRandomRange, c.blinkMinInterval]);

  useEffect(() => {
    attachMouse();
    startBlinking();
    setDefaultMouse();
    return () => {
      detachMouse();
      blinkTimersRef.current.forEach((t) => clearTimeout(t));
      if (lookingTimerRef.current) clearTimeout(lookingTimerRef.current);
      if (purplePeekTimerRef.current) clearTimeout(purplePeekTimerRef.current);
    };
  }, [attachMouse, detachMouse, startBlinking, setDefaultMouse]);

  const isRevealState = passwordLength > 0 && isPasswordVisible;
  const isNonPasswordFocused = focusedField !== 'password' && focusedField !== 'none';
  const isTiltState = isNonPasswordFocused || (passwordLength > 0 && !isPasswordVisible);

  const mouseOffset = useMemo(() => {
    if (!wrapRef.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = wrapRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: clamp(dx / c.mouseSensitivityX, -15, 15),
      faceY: clamp(dy / c.mouseSensitivityY, -10, 10),
      bodySkew: clamp(-dx / c.bodySkewSensitivity, -6, 6)
    };
  }, [mouseX, mouseY, c.mouseSensitivityX, c.mouseSensitivityY, c.bodySkewSensitivity]);

  const pf = c.pupilFollowFactor;

  const purpleStyle = useMemo(() => {
    const { bodySkew } = mouseOffset;
    if (internalError && !isPasswordVisible) return { transform: 'translateX(0px)', height: '440px' };
    if (isRevealState) return { transform: 'skewX(0deg)', height: isNonPasswordFocused ? '460px' : '420px' };
    if (isTiltState) return { transform: `skewX(${(bodySkew || 0) - 12}deg) translateX(40px)`, height: '460px' };
    return { transform: `skewX(${bodySkew || 0}deg)`, height: '420px' };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, isNonPasswordFocused, isTiltState]);

  const blackStyle = useMemo(() => {
    const { bodySkew } = mouseOffset;
    if (isRevealState) return { transform: 'skewX(0deg)', height: '290px' };
    if (isLookingAtEachOther) return { transform: 'skewX(10deg) translateX(15px)', height: '290px' };
    if (isTiltState) return { transform: `skewX(${(bodySkew || 0) * 1.5}deg)`, height: '290px' };
    return { transform: `skewX(${bodySkew || 0}deg)`, height: '290px' };
  }, [mouseOffset, isRevealState, isLookingAtEachOther, isTiltState]);

  const orangeStyle = useMemo(() => {
    if (internalError && !isPasswordVisible)
      return {
        transform: 'skewX(-4deg) scaleX(0.96) scaleY(0.92)',
        transformOrigin: 'bottom center',
        borderRadius: '92px 166px 0 0'
      };
    if (isRevealState)
      return {
        transform: 'skewX(0deg) scaleX(1) scaleY(1)',
        borderRadius: '120px 120px 0 0',
        transformOrigin: 'bottom center'
      };
    const { faceX, faceY } = mouseOffset;
    const squash = faceY * 0.011;
    const pull = Math.abs(faceX) * 0.004;
    const sx = 1 + squash + pull;
    const sy = 1 - squash - pull * 0.45;
    const skew = -faceX * 0.56;
    const lr = clamp(138 + faceX * 3.5 + faceY * 1.1, 100, 200);
    const rr = clamp(138 - faceX * 3.5 + faceY * 1.1, 100, 200);
    return {
      transform: `skewX(${skew.toFixed(2)}deg) scaleX(${sx.toFixed(3)}) scaleY(${sy.toFixed(3)})`,
      transformOrigin: 'bottom center',
      borderRadius: `${lr}px ${rr}px 0 0`
    };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState]);

  const yellowStyle = useMemo(() => {
    if (isRevealState) return { transform: 'skewX(0deg)' };
    return { transform: `skewX(${mouseOffset.bodySkew || 0}deg)` };
  }, [mouseOffset, isRevealState]);

  const purpleEyesStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError && !isPasswordVisible) return { left: `${195 + faceX}px`, top: `${38 + faceY}px` };
    if (isRevealState) return { left: '131px', top: '35px' };
    if (isLookingAtEachOther) return { left: '166px', top: '65px' };
    return { left: `${156 + faceX}px`, top: `${40 + faceY}px` };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, isLookingAtEachOther]);

  const blackEyesStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (isRevealState) return { left: '20px', top: '28px' };
    if (isLookingAtEachOther) return { left: '42px', top: '12px' };
    return { left: `${46 + faceX}px`, top: `${32 + faceY}px` };
  }, [mouseOffset, isRevealState, isLookingAtEachOther]);

  const orangeEyesStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError && !isPasswordVisible)
      return {
        left: `${153 + faceX * 1.8}px`,
        top: `${100 + faceY * 1.3 - faceX * 0.18}px`,
        transform: `rotate(${(faceX * 0.34).toFixed(2)}deg)`
      };
    if (isRevealState)
      return {
        left: `${36 + faceX * 0.7}px`,
        top: `${88 + faceY * 0.6 - faceX * 0.14}px`,
        transform: `rotate(${(faceX * 0.28).toFixed(2)}deg)`
      };
    return {
      left: `${85 + faceX * 2.4}px`,
      top: `${90 + faceY * 1.45 - faceX * 0.24}px`,
      transform: `rotate(${(faceX * 0.42).toFixed(2)}deg)`
    };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState]);

  const yellowEyesStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (isRevealState) return { left: '22px', top: '39px' };
    return { left: `${59 + faceX}px`, top: `${55 + faceY}px` };
  }, [mouseOffset, isRevealState]);

  const purpleMouthStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError) {
      if (!isPasswordVisible)
        return {
          width: '26px',
          height: '13px',
          borderRadius: '50% 50% 0 0',
          background: 'transparent',
          borderTop: '3.5px solid #2D2D2D',
          transform: 'translateX(-50%)',
          opacity: '1',
          left: `${215 + faceX}px`,
          top: `${78 + faceY}px`
        };
      return {
        width: '26px',
        height: '13px',
        borderRadius: '50% 50% 0 0',
        background: 'transparent',
        borderTop: '3.5px solid #2D2D2D',
        transform: 'translateX(-50%)',
        opacity: '1',
        left: '155px',
        top: '72px'
      };
    }
    if (isRevealState)
      return {
        width: '18px',
        height: '8px',
        borderRadius: '50% 50% 0 0',
        background: '#2D2D2D',
        left: '155px',
        top: '72px',
        transform: 'translateX(-50%)',
        opacity: '1'
      };
    if (isTiltState)
      return {
        width: '6px',
        height: '14px',
        borderRadius: '3px',
        background: '#2D2D2D',
        left: `${180 + faceX}px`,
        top: `${82 + faceY}px`,
        transform: 'translateX(-50%)',
        opacity: '1'
      };
    return {
      width: '16px',
      height: '4px',
      borderRadius: '2px',
      background: '#2D2D2D',
      left: `${180 + faceX}px`,
      top: `${80 + faceY}px`,
      transform: 'translateX(-50%)',
      opacity: '1'
    };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, isTiltState]);

  const orangeMouthStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError) {
      if (!isPasswordVisible)
        return {
          width: '24px',
          height: '12px',
          borderRadius: '50% 50% 0 0',
          background: 'transparent',
          borderTop: '3px solid #2D2D2D',
          transform: `translateX(-50%) rotate(${(faceX * 0.34).toFixed(2)}deg)`,
          left: `${181 + faceX * 1.8}px`,
          top: `${123 + faceY * 1.3 - faceX * 0.12}px`
        };
      return {
        width: '24px',
        height: '12px',
        borderRadius: '50% 50% 0 0',
        background: 'transparent',
        borderTop: '3px solid #2D2D2D',
        transform: `translateX(-50%) rotate(${(faceX * 0.3).toFixed(2)}deg)`,
        left: `${67 + faceX * 0.9}px`,
        top: `${113 + faceY * 0.7 - faceX * 0.1}px`
      };
    }
    if (isRevealState)
      return {
        width: '22px',
        height: '10px',
        borderRadius: '22px 22px 0 0',
        background: '#2D2D2D',
        left: `${67 + faceX * 0.8}px`,
        top: `${113 + faceY * 0.8 - faceX * 0.14}px`,
        transform: `translateX(-50%) rotate(${(faceX * 0.3).toFixed(2)}deg)`
      };
    const isPassHidden = focusedField === 'password' && !isPasswordVisible;
    if (isPassHidden)
      return {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#2D2D2D',
        left: `${113 + faceX * 2.1}px`,
        top: `${117 + faceY * 1.55 - faceX * 0.14}px`,
        transform: `translateX(-50%) rotate(${(faceX * 0.26).toFixed(2)}deg)`
      };
    return {
      width: '24px',
      height: '12px',
      borderRadius: '0 0 24px 24px',
      background: '#2D2D2D',
      left: `${113 + faceX * 2.2}px`,
      top: `${117 + faceY * 1.6 - faceX * 0.16}px`,
      transform: `translateX(-50%) rotate(${(faceX * 0.34).toFixed(2)}deg)`
    };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, focusedField]);

  const yellowMouthStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError) {
      if (!isPasswordVisible)
        return {
          left: '50%',
          top: '98px',
          width: '50px',
          height: '10px',
          borderRadius: '50% 50% 0 0',
          transform: `translateX(-50%) translate(${faceX * 0.5}px, ${faceY * 0.5}px)`
        };
      return {
        left: '14px',
        top: '100px',
        width: '60px',
        height: '12px',
        borderRadius: '0',
        border: 'none',
        background:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='12'%3E%3Cpath d='M0 6 Q15 0 30 6 Q45 12 60 6' stroke='%232D2D2D' stroke-width='3' fill='none'/%3E%3C/svg%3E\") no-repeat center",
        transform: 'none'
      };
    }
    if (isRevealState) return { left: '14px', top: '100px', transform: 'none' };
    return { transform: `translateX(-50%) translate(${faceX * 0.5}px, ${faceY * 0.5}px)` };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState]);

  const purplePupilStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError && !isPasswordVisible) return { transform: 'translate3d(0px, 5px, 0)' };
    if (isRevealState)
      return isPurplePeeking ? { transform: 'translate3d(4px, 5px, 0)' } : { transform: 'translate3d(-4px, -4px, 0)' };
    if (isLookingAtEachOther) return { transform: 'translate3d(3px, 4px, 0)' };
    return { transform: `translate3d(${faceX * pf}px, ${faceY * pf}px, 0)` };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, isPurplePeeking, isLookingAtEachOther, pf]);

  const pupilWhiteStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError && !isPasswordVisible) return { transform: 'translate3d(0px, 5px, 0)' };
    if (isRevealState) return { transform: 'translate3d(-4px, -4px, 0)' };
    if (isLookingAtEachOther) return { transform: 'translate3d(0px, -4px, 0)' };
    return { transform: `translate3d(${faceX * pf}px, ${faceY * pf}px, 0)` };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, isLookingAtEachOther, pf]);

  const pupilDarkStyle = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (internalError && !isPasswordVisible) return { transform: 'translate3d(0px, 3px, 0)' };
    if (isRevealState) return { transform: 'translate3d(-5px, -4px, 0)' };
    return { transform: `translate3d(${faceX * pf}px, ${faceY * pf}px, 0)` };
  }, [mouseOffset, internalError, isPasswordVisible, isRevealState, pf]);

  const purpleSunglassesStyle = useMemo(() => {
    const { faceX } = mouseOffset;
    const eyes = purpleEyesStyle;
    const el = parseFloat(eyes.left as string);
    const et = parseFloat(eyes.top as string);
    const tilt = 3 + faceX * 0.25;
    if (internalError && !isPasswordVisible)
      return {
        left: `${el - 38}px`,
        top: `${et - 36}px`,
        transform: `perspective(300px) rotateX(12deg) rotateZ(${(tilt - 18).toFixed(2)}deg)`
      };
    return {
      left: `${el - 42}px`,
      top: `${et - 42}px`,
      transform: `perspective(300px) rotateX(12deg) rotateZ(${tilt.toFixed(2)}deg)`
    };
  }, [mouseOffset, purpleEyesStyle, internalError, isPasswordVisible]);

  const blackBlushConfig = useMemo(() => {
    const isPassHidden = focusedField === 'password' && !isPasswordVisible;
    if (internalError && !isPasswordVisible) return { size: 22, opacity: 0.75, blur: 6 };
    if (isPassHidden) return { size: 28, opacity: 0.9, blur: 6 };
    if (isRevealState) return { size: 16, opacity: 0.5, blur: 4 };
    if (isNonPasswordFocused) return { size: 20, opacity: 0.6, blur: 5 };
    return { size: 18, opacity: 0.55, blur: 4 };
  }, [internalError, isPasswordVisible, focusedField, isRevealState, isNonPasswordFocused]);

  const blackBlushBase = useMemo(() => {
    const { faceX, faceY } = mouseOffset;
    if (isRevealState) return { x: 44, y: 52 };
    if (isLookingAtEachOther) return { x: 66, y: 36 };
    return { x: 70 + faceX, y: 56 + faceY };
  }, [mouseOffset, isRevealState, isLookingAtEachOther]);

  const blackBlushLeftStyle = useMemo(() => {
    const { x, y } = blackBlushBase;
    const bc = blackBlushConfig;
    return {
      left: `${x - 22}px`,
      top: `${y}px`,
      width: `${bc.size}px`,
      height: `${Math.round(bc.size * 0.65)}px`,
      opacity: String(bc.opacity),
      filter: `blur(${bc.blur}px)`,
      transform: 'translateX(-50%)'
    };
  }, [blackBlushBase, blackBlushConfig]);

  const blackBlushRightStyle = useMemo(() => {
    const { x, y } = blackBlushBase;
    const bc = blackBlushConfig;
    return {
      left: `${x + 22}px`,
      top: `${y}px`,
      width: `${bc.size}px`,
      height: `${Math.round(bc.size * 0.65)}px`,
      opacity: String(bc.opacity),
      filter: `blur(${bc.blur}px)`,
      transform: 'translateX(-50%)'
    };
  }, [blackBlushBase, blackBlushConfig]);

  const wrapStyle = {
    transform: `scale(${c.scale})`,
    transformOrigin: 'bottom center',
    '--ac-purple': c.purpleColor,
    '--ac-black': c.blackColor,
    '--ac-orange': c.orangeColor,
    '--ac-yellow': c.yellowColor,
    '--ac-transition': `${c.transitionDuration}s`,
    '--ac-pupil-transition': `${Math.max(c.transitionDuration, 0.75)}s`
  } as React.CSSProperties;

  return (
    <div ref={wrapRef} className='ac-wrap' style={wrapStyle}>
      <style jsx>{`
        .ac-wrap {
          width: 520px;
          height: 420px;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .ac-figure {
          position: absolute;
          transition:
            transform var(--ac-transition, 0.7s) ease-in-out,
            height var(--ac-transition, 0.7s) ease-in-out,
            clip-path var(--ac-transition, 0.7s) ease-in-out,
            border-radius var(--ac-transition, 0.7s) ease-in-out;
          will-change: transform, height, clip-path, border-radius;
        }
        .ac-purple {
          left: -20px;
          bottom: 0;
          width: 360px;
          height: 420px;
          background: var(--ac-purple, #6c3ff5);
          border-radius: 10px 10px 0 0;
          transform-origin: bottom center;
          clip-path: inset(0 68px 0 68px round 10px 10px 0 0);
        }
        .ac-black {
          left: 230px;
          bottom: 0;
          width: 140px;
          height: 290px;
          background: var(--ac-black, #171717);
          border-radius: 8px 8px 0 0;
        }
        .ac-orange {
          left: 6px;
          bottom: 0;
          width: 240px;
          height: 204px;
          background: var(--ac-orange, #ff8433);
          border-radius: 120px 120px 0 0;
          z-index: 4;
          transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            height var(--ac-transition, 0.7s) ease-in-out,
            clip-path var(--ac-transition, 0.7s) ease-in-out,
            border-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ac-yellow {
          left: 324px;
          bottom: 0;
          width: 160px;
          height: 220px;
          background: var(--ac-yellow, #e6ca0a);
          border-radius: 82px 82px 0 0;
          z-index: 4;
        }
        .ac-eyes {
          position: absolute;
          display: flex;
          gap: 12px;
          align-items: center;
          transition:
            left var(--ac-transition, 0.7s) ease-in-out,
            top var(--ac-transition, 0.7s) ease-in-out;
        }
        .ac-orange .ac-eyes {
          gap: 36px;
        }
        .ac-black .ac-eyes {
          z-index: 3;
        }
        .ac-eye {
          position: relative;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
          transition: all 0.2s ease;
          z-index: 2;
          flex: 0 0 auto;
        }
        .ac-eye-dark {
          background: #111 !important;
          box-shadow: none !important;
          width: 12px !important;
          height: 12px !important;
        }
        .ac-eye.blink {
          height: 2px !important;
          margin-top: 8px;
        }
        .ac-pupil {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #111;
          top: 5px;
          left: 5px;
          transition: transform var(--ac-pupil-transition, 0.75s) cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .ac-pupil-dark {
          top: 4px;
          left: 4px;
        }
        .ac-mouth {
          position: absolute;
          width: 74px;
          height: 4px;
          border-radius: 8px;
          background: #2d2d2d;
          left: 50%;
          top: 104px;
          transform: translateX(-50%);
          transition:
            transform 0.5s ease-in-out,
            left 0.5s ease-in-out,
            top 0.5s ease-in-out,
            border-radius 0.4s ease,
            width 0.4s ease,
            height 0.4s ease,
            opacity 0.3s ease,
            background 0.3s ease;
        }
        .ac-yellow .ac-mouth {
          width: 86px;
        }
        .ac-purple .ac-mouth {
          width: 16px;
          height: 4px;
          border-radius: 2px;
          background: #2d2d2d;
          top: 80px;
          left: 69px;
          transform: translateX(-50%);
          opacity: 1;
        }
        .ac-orange .ac-mouth {
          width: 24px;
          height: 12px;
          border-radius: 0 0 24px 24px;
          background: #2d2d2d;
          left: 109px;
          top: 121px;
          transform: translateX(-50%);
        }
        .ac-sg-anchor {
          position: absolute;
          left: -20px;
          bottom: 0;
          width: 360px;
          height: 420px;
          transform-origin: bottom center;
          pointer-events: none;
          z-index: 10;
          transition:
            transform var(--ac-transition, 0.7s) ease-in-out,
            height var(--ac-transition, 0.7s) ease-in-out;
        }
        .ac-pixel-sg {
          position: absolute;
          display: flex;
          align-items: center;
          z-index: 10;
          transition:
            left var(--ac-transition, 0.7s) ease-in-out,
            top var(--ac-transition, 0.7s) ease-in-out,
            transform 0.5s ease-in-out;
          pointer-events: none;
        }
        .psg-arm {
          width: 10px;
          height: 5px;
          background: #1a1a1a;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .psg-lens {
          width: 38px;
          height: 24px;
          background: #1a1a1a;
          border-radius: 4px;
          position: relative;
        }
        .psg-lens::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          bottom: 4px;
          border-radius: 2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
        }
        .psg-bridge {
          width: 16px;
          height: 6px;
          background: #1a1a1a;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .ac-blush {
          position: absolute;
          background: #ff6b9d;
          border-radius: 50%;
        }
      `}</style>

      <div className='ac-sg-anchor' style={{ ...purpleStyle, pointerEvents: 'none' }}>
        <div className='ac-pixel-sg' style={purpleSunglassesStyle}>
          <div className='psg-arm' />
          <div className='psg-lens' />
          <div className='psg-bridge' />
          <div className='psg-lens' />
          <div className='psg-arm' />
        </div>
      </div>

      <div
        className={`ac-figure ac-purple ${internalError && !isPasswordVisible ? 'is-error' : ''}`}
        style={purpleStyle}
      >
        <div className='ac-eyes' style={purpleEyesStyle}>
          <span className={`ac-eye ${isPurpleBlinking ? 'blink' : ''}`}>
            {!isPurpleBlinking && <span className='ac-pupil' style={purplePupilStyle} />}
          </span>
          <span className={`ac-eye ${isPurpleBlinking ? 'blink' : ''}`}>
            {!isPurpleBlinking && <span className='ac-pupil' style={purplePupilStyle} />}
          </span>
        </div>
        <span className='ac-mouth' style={purpleMouthStyle} />
      </div>

      <div className={`ac-figure ac-black ${internalError && !isPasswordVisible ? 'is-error' : ''}`} style={blackStyle}>
        <div className='ac-eyes' style={blackEyesStyle}>
          <span className={`ac-eye ${isBlackBlinking ? 'blink' : ''}`}>
            {!isBlackBlinking && <span className='ac-pupil' style={pupilWhiteStyle} />}
          </span>
          <span className={`ac-eye ${isBlackBlinking ? 'blink' : ''}`}>
            {!isBlackBlinking && <span className='ac-pupil' style={pupilWhiteStyle} />}
          </span>
        </div>
        <div className='ac-blush ac-blush-l' style={blackBlushLeftStyle} />
        <div className='ac-blush ac-blush-r' style={blackBlushRightStyle} />
      </div>

      <div
        className={`ac-figure ac-orange ${internalError && !isPasswordVisible ? 'is-error' : ''}`}
        style={orangeStyle}
      >
        <div className='ac-eyes' style={orangeEyesStyle}>
          <span className={`ac-eye ac-eye-dark ${isOrangeBlinking ? 'blink' : ''}`}>
            {!isOrangeBlinking && <span className='ac-pupil ac-pupil-dark' style={pupilDarkStyle} />}
          </span>
          <span className={`ac-eye ac-eye-dark ${isOrangeBlinking ? 'blink' : ''}`}>
            {!isOrangeBlinking && <span className='ac-pupil ac-pupil-dark' style={pupilDarkStyle} />}
          </span>
        </div>
        <span className='ac-mouth' style={orangeMouthStyle} />
      </div>

      <div className='ac-figure ac-yellow' style={yellowStyle}>
        <div className='ac-eyes' style={yellowEyesStyle}>
          <span className={`ac-eye ac-eye-dark ${isYellowBlinking ? 'blink' : ''}`}>
            {!isYellowBlinking && <span className='ac-pupil ac-pupil-dark' style={pupilDarkStyle} />}
          </span>
          <span className={`ac-eye ac-eye-dark ${isYellowBlinking ? 'blink' : ''}`}>
            {!isYellowBlinking && <span className='ac-pupil ac-pupil-dark' style={pupilDarkStyle} />}
          </span>
        </div>
        <span className='ac-mouth' style={yellowMouthStyle} />
      </div>
    </div>
  );
}
