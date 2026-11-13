import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function TungstenBulbSVG({ lit }: { lit: boolean }) {
  const col = lit ? '#e6a157' : 'rgba(230,161,87,0.55)';
  const fillGlow = lit ? 'rgba(230,161,87,0.30)' : 'rgba(230,161,87,0.06)';
  const glow = lit
    ? 'drop-shadow(0 0 5px rgba(230,161,87,0.85)) drop-shadow(0 0 12px rgba(230,161,87,0.45))'
    : 'none';
  return (
    <svg viewBox="0 0 26 42" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 22, height: 36, filter: glow, transition: 'filter 0.5s ease' }}>
      {/* Bulb glass */}
      <ellipse cx="13" cy="14" rx="9" ry="10" fill={fillGlow} stroke={col} strokeWidth="1.2" />
      {/* Tungsten filament coils */}
      <path d="M9 14 Q10 11 11 14 Q12 17 13 14 Q14 11 15 14 Q16 17 17 14"
        stroke={lit ? 'rgba(255,213,100,0.85)' : 'rgba(230,161,87,0.30)'}
        strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Neck */}
      <rect x="10.5" y="23" width="5" height="3.5" rx="1" fill={fillGlow} stroke={col} strokeWidth="1" />
      {/* Base ridges */}
      <rect x="10" y="26" width="6" height="1.2" rx="0.4" fill={col} opacity="0.7" />
      <rect x="10.5" y="28" width="5" height="1.2" rx="0.4" fill={col} opacity="0.55" />
      <rect x="11" y="30" width="4" height="1.2" rx="0.4" fill={col} opacity="0.4" />
      {/* Contact tip */}
      <rect x="12" y="31.5" width="2" height="2" rx="0.5" fill={col} opacity="0.65" />
    </svg>
  );
}

export function TheaterEasterEgg() {
  const [lit, setLit] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const swingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lamp = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const scene = useRef<HTMLIFrameElement>(null);
  const pullTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (pullTimer.current) clearTimeout(pullTimer.current);
    if (swingTimerRef.current) clearTimeout(swingTimerRef.current);
  }, []);
  useEffect(() => {
    const overlay = dialog.current;
    if (!lit || !overlay) return;
    const root = document.documentElement;
    const prior = root.style.overflow;
    root.style.overflow = 'hidden';
    overlay.showModal();
    function onStageMessage(event: MessageEvent) {
      if (event.origin === location.origin && event.source === scene.current?.contentWindow &&
          event.data === 'portfolio-stage:close') setLit(false);
    }
    window.addEventListener('message', onStageMessage);
    return () => {
      window.removeEventListener('message', onStageMessage);
      overlay.close();
      root.style.overflow = prior;
      lamp.current?.focus({preventScroll: true});
    };
  }, [lit]);

  const handleClick = () => {
    if (pullTimer.current || lit) return;
    setSwinging(false);
    setPulling(true);
    pullTimer.current = setTimeout(() => {
      pullTimer.current = null;
      setPulling(false);
      setLit(true);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
  };

  const handleHover = () => {
    if (swingTimerRef.current) clearTimeout(swingTimerRef.current);
    setSwinging(true);
    swingTimerRef.current = setTimeout(() => setSwinging(false), 2000);
  };

  const CORD_HEIGHT = 72;

  return (
    <>
      {/* ── Top-left pull-chain cord ── */}
      <div className="fixed z-[1000]" style={{ top: 0, left: 'clamp(2rem, 4vw, 4rem)' }}>
        <motion.div
          style={{ transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          animate={
            swinging
              ? { rotate: [0, 5, -4, 3, -2, 1.2, -0.8, 0] }
              : pulling
              ? { y: [0, 18, 0] }
              : { rotate: 0, y: 0 }
          }
          transition={
            swinging
              ? { duration: 1.8, ease: 'easeOut' }
              : pulling
              ? { duration: 0.36, ease: [0.22, 0.8, 0.36, 1], times: [0, 0.3, 1] }
              : { duration: 0.3 }
          }
        >
          {/* Cord line */}
          <div style={{
            width: '1.5px',
            height: CORD_HEIGHT,
            background: 'linear-gradient(to bottom, rgba(230,161,87,0.45), rgba(230,161,87,0.80))',
            borderRadius: '1px',
          }} />

          {/* Tungsten Bulb button */}
          <button
            ref={lamp} aria-expanded={lit} aria-haspopup="dialog"
            onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)}
            onClick={handleClick}
            onMouseEnter={handleHover}
            aria-label={lit ? '关灯' : '开灯 · 探索彩蛋'}
            className="relative flex flex-col items-center focus:outline-none group"
            style={{ marginTop: '-1px', touchAction: 'none', minWidth: 44, minHeight: 44 }}
          >
            <div className="group-hover:scale-110 active:scale-90 transition-transform duration-200">
              <TungstenBulbSVG lit={lit} />
            </div>
            {/* PULL label */}
            <AnimatePresence>
              {!lit && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.25, 0.5, 0.25] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-7 top-2 font-mono italic text-[8px] tracking-[0.22em] text-primary/55 select-none pointer-events-none whitespace-nowrap"
                >
                  PULL
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {lit && (
        <dialog ref={dialog} aria-label="纸艺剧场 × 文化城市"
          onCancel={event => {event.preventDefault(); setLit(false)}}
          className="fixed inset-0 m-0 h-full w-full max-h-none max-w-none overflow-hidden border-0 p-0"
          style={{background: '#171110', color: '#e4c9a0'}}>
          <button autoFocus onClick={() => setLit(false)}
            className="absolute right-3 top-2 z-10 inline-flex min-h-11 items-center gap-2 rounded px-3 text-sm focus-visible:outline"
            style={{background: '#171110'}}>
            <X size={15} aria-hidden="true"/>返回作品集
          </button>
          <iframe ref={scene} title="文化城市剧场动画" tabIndex={-1}
            src={`${import.meta.env.BASE_URL}stage-preview/index.html?lamp`}
            className="block h-full w-full border-0" />
        </dialog>
      )}
    </>
  );
}
