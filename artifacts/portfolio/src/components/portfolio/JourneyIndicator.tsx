import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'hero',       num: '01', act: 'PROLOGUE',       label: '首页' },
  { id: 'sectors',    num: '02', act: 'CORE CAPABILITIES',    label: '核心能力' },
  { id: 'projects', num: '03', act: 'FEATURED PROJECTS', label: '代表项目' },
  { id: 'social-ops', num: '04', act: 'SOCIAL LAB', label: '新媒体' },
  { id: 'career', num: '05', act: 'CAREER', label: '工作经历' },
  { id: 'manifesto', num: '06', act: 'MANIFESTO', label: '个人理念' },
  { id: 'tools', num: '07', act: 'ADDITIONAL PRACTICE', label: '其他实践' },
  { id: 'contact',    num: '08', act: 'CONTACT',      label: '联系方式' },
] as const;

const BOTTOM_IDS = ['hero', 'sectors', 'projects', 'career', 'contact'] as const;

type NavId = typeof NAV_ITEMS[number]['id'];

function getSectionTops(): Record<NavId, number> {
  const result: Partial<Record<NavId, number>> = {};
  for (const item of NAV_ITEMS) {
    const el = document.getElementById(item.id);
    result[item.id] = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }
  return result as Record<NavId, number>;
}

function getActive(tops: Record<NavId, number>): NavId {
  const scrollY = window.scrollY;
  const viewH = window.innerHeight;
  if (scrollY + viewH >= document.documentElement.scrollHeight - 2) return "contact";
  const threshold = scrollY + Math.min(120, viewH * 0.14);

  let current: NavId = NAV_ITEMS[0].id;
  for (const item of NAV_ITEMS) {
    if (tops[item.id] <= threshold) {
      current = item.id;
    }
  }
  return current;
}

export function JourneyIndicator() {
  const [activeId, setActiveId] = useState<NavId>('hero');
  const [opacity, setOpacity] = useState(0.22);
  const [hovering, setHovering] = useState(false);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topsRef = useRef<Record<NavId, number>>({} as Record<NavId, number>);

  // compute section tops once layout settles, and on resize
  const refreshTops = useCallback(() => {
    topsRef.current = getSectionTops();
    setActiveId(getActive(topsRef.current));
  }, []);

  useEffect(() => {
    refreshTops();
    // slight delay for layout to stabilise
    const t = setTimeout(refreshTops, 600);

    const onScroll = () => {
      setActiveId(getActive(topsRef.current));
      setOpacity(1);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!hovering) setOpacity(0.22);
      }, 1800);
    };

    const observer = new ResizeObserver(refreshTops);
    observer.observe(document.body);
    const onResize = () => refreshTops();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      observer.disconnect();
      clearTimeout(t);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [refreshTops, hovering]);

  const navigation = useRef<AbortController | null>(null);
  useEffect(() => () => navigation.current?.abort(), []);

  const scrollTo = (id: NavId) => {
    const el = document.getElementById(id);
    if (!el) return;
    navigation.current?.abort();
    const controller = new AbortController();
    navigation.current = controller;
    const options = { signal: controller.signal, passive: true };
    const cancel = () => controller.abort();
    for (const event of ['wheel', 'touchstart', 'keydown']) {
      window.addEventListener(event, cancel, options);
    }
    const startingTop = el.getBoundingClientRect().top + window.scrollY;
    const settle = () => {
      controller.abort();
      if (Math.abs(el.getBoundingClientRect().top + window.scrollY - startingTop) > 2) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      refreshTops();
    };
    document.addEventListener('scrollend', settle, options);
    const fallback = window.setTimeout(settle, 1200);
    controller.signal.addEventListener('abort', () => clearTimeout(fallback), { once: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeIndex = NAV_ITEMS.findIndex(n => n.id === activeId);
  // slider Y position: 0% (top node) to 100% (bottom node) along the line
  const sliderPct = NAV_ITEMS.length > 1 ? (activeIndex / (NAV_ITEMS.length - 1)) * 100 : 0;

  const LINE_TOP_PX  = 20;   // px gap at top before first node
  const LINE_BOT_PX  = 20;   // px gap at bottom after last node
  const NODE_GAP_PX  = 40;   // space between nodes
  const totalHeight  = LINE_TOP_PX + (NAV_ITEMS.length - 1) * NODE_GAP_PX + LINE_BOT_PX;

  return (
    <>
      {/* ─── Desktop: vertical right rail ─── */}
      <motion.nav
        className="fixed right-1 w-8 top-1/2 -translate-y-1/2 z-[96] hidden md:flex flex-col items-center"
        style={{ opacity, height: totalHeight }}
        animate={{ opacity }}
        transition={{ duration: 0.6 }}
        onMouseEnter={() => { setHovering(true);  setOpacity(1); }}
        onMouseLeave={() => { setHovering(false); setOpacity(0.22); }}
        aria-label="Page navigation"
      >
        {/* Amber thread line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px rounded-full"
          style={{
            top: LINE_TOP_PX,
            height: (NAV_ITEMS.length - 1) * NODE_GAP_PX,
            background: 'linear-gradient(to bottom, rgba(230,161,87,0.18), rgba(230,161,87,0.45), rgba(230,161,87,0.18))',
          }}
        />

        {/* Amber sliding cursor */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-10 pointer-events-none"
          style={{
            top: LINE_TOP_PX - 5,
            background: '#e6a157',
            boxShadow: '0 0 8px rgba(230,161,87,0.75)',
          }}
          animate={{ y: sliderPct / 100 * (NAV_ITEMS.length - 1) * NODE_GAP_PX }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        />

        {/* Nodes + labels */}
        {NAV_ITEMS.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <motion.button
              key={item.id}
              aria-current={isActive ? "location" : undefined} onClick={() => scrollTo(item.id)}
              className="absolute flex items-center justify-center w-8 h-8 -mt-4 group focus-visible:outline-primary"
              style={{ top: LINE_TOP_PX + i * NODE_GAP_PX, left: '50%', transform: 'translateX(-50%)' }}

              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              aria-label={`Go to ${item.act}`}
            >
              {/* Node dot */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                animate={{
                  scale: isActive ? 1.5 : 1,
                  background: isActive ? '#e6a157' : 'rgba(230,161,87,0.35)',
                  boxShadow: isActive ? '0 0 6px rgba(230,161,87,0.7)' : 'none',
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Label — appears to the left, right-aligned */}
              <div
                className="absolute right-4 flex flex-col items-end pointer-events-none"
                style={{ whiteSpace: 'nowrap' }}
              >
                <span
                  className="font-mono text-[7px] tracking-[0.28em] uppercase transition-all duration-300"
                  style={{ color: isActive ? 'rgba(230,161,87,0.9)' : 'rgba(245,240,232,0.28)', letterSpacing: '0.28em' }}
                >
                  {item.num} {item.act}
                </span>
                <motion.span
                  className="font-mono text-[8px] tracking-widest transition-all duration-300"
                  style={{ color: isActive ? 'rgba(230,161,87,0.55)' : 'rgba(245,240,232,0.15)' }}
                  animate={{ filter: isActive ? 'drop-shadow(0 0 4px rgba(230,161,87,0.45))' : 'none' }}
                >
                  {item.label}
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </motion.nav>

      {/* ─── Mobile: bottom horizontal bar ─── */}
      <nav aria-label="章节导航"
        className="fixed bottom-0 left-0 right-0 z-[96] md:hidden"
        style={{
          background: 'rgba(12,10,7,0.88)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(230,161,87,0.15)',
        }}
      >
        <div className="flex items-center justify-center gap-[clamp(2px,1.7vw,12px)] pb-[env(safe-area-inset-bottom)]">
          {BOTTOM_IDS.map(id => {
            const item = NAV_ITEMS.find(section => section.id === id)!;
            const active = activeId === id;
            return (
              <button key={id} aria-current={active ? 'location' : undefined}
                onClick={() => scrollTo(id)}
                className="min-h-11 min-w-11 px-1.5 text-[11px] tracking-wide whitespace-nowrap text-[#b5a89a] aria-[current=location]:text-[#efd6b4] focus-visible:outline-primary">
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
