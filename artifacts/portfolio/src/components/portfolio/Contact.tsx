import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const contacts = [
  {
    icon: MessageCircle,
    label: 'WeChat',
    value: 'jrlune',
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '138 9817 1261',
    href: 'tel:13898171261',
  },
  {
    icon: Mail,
    label: 'Email',
    value: '13898171261@163.com',
    href: 'mailto:13898171261@163.com',
  },
] as const;

function TeaCupIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* steam wisps */}
      <motion.path
        d="M18 10 Q19 7 18 4"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M24 9 Q25 5.5 24 2"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.path
        d="M30 10 Q31 7 30 4"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      {/* cup body */}
      <path
        d="M10 16 L14 40 H34 L38 16 Z"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"
      />
      {/* saucer */}
      <path
        d="M6 40 Q24 46 42 40"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* handle */}
      <path
        d="M38 20 Q46 22 44 30 Q42 36 36 35"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

// 底部建筑线稿：深棕底 + 低饱和暖金单线。滚动进入视口后缓缓绘制，约 3 秒定型后保持完整轮廓。
// 桌面/平板用横向完整构图；移动端用窄比例独立 SVG（两侧建筑 + 中央拱形），不裁切、不压缩桌面版。
function ContactSketch() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDrawn(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`contact-sketch${drawn ? ' is-drawn' : ''}`} aria-hidden="true">
      {/* 桌面 / 平板：完整横向线稿（主轮廓 sk-main / 次要轮廓 sk-sub / 地平与曲线 sk-ground·sk-curve） */}
      <svg className="sk-desktop" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
        {/* 流动曲线：一条向远处延伸的腰线 */}
        <path data-draw className="sk-curve" pathLength={1} style={{ animationDelay: '1.2s' }}
          d="M1440 322 C1180 352 1000 300 720 300 S 300 292 0 300" />
        <path data-draw className="sk-curve sk-sub" pathLength={1} style={{ animationDelay: '1.5s' }}
          d="M1440 338 C1100 356 720 322 380 306" />
        {/* 地平线基准 */}
        <path data-draw className="sk-ground" pathLength={1} style={{ animationDelay: '0s' }}
          d="M0 300 H1440" />

        {/* 左侧：简洁现代商业建筑群（主轮廓 + 窗格次轮廓） */}
        <g className="sk-left">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.1s' }} d="M80 300 V230 H150 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.25s' }} d="M115 300 V230 M80 265 H150" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.15s' }} d="M170 300 V190 H240 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.3s' }} d="M205 300 V190 M170 245 H240" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.2s' }} d="M260 300 V250 H330 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.35s' }} d="M295 300 V250 M260 275 H330" />
        </g>

        {/* 左—中低矮连廊（次轮廓） */}
        <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.5s' }} d="M330 290 H560" />

        {/* 中间：艺术展演属性的文化空间 + 拱形入口 */}
        <g className="sk-center">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.4s' }} d="M560 300 V210 M880 300 V210" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.55s' }} d="M560 210 Q720 120 880 210" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.7s' }} d="M580 300 H860 M580 286 H860" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.8s' }} d="M650 248 H790 M720 210 V182" />
        </g>

        {/* 中—右低矮连廊（次轮廓） */}
        <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.6s' }} d="M880 290 H1060" />

        {/* 右侧：现代商业建筑轮廓 */}
        <g className="sk-right">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.7s' }} d="M1060 300 V210 H1130 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.85s' }} d="M1095 300 V210 M1060 256 H1130" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.75s' }} d="M1150 300 V240 H1220 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.9s' }} d="M1185 300 V240" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.8s' }} d="M1240 300 V200 H1320 V300" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.95s' }} d="M1280 300 V200 M1240 250 H1320" />
        </g>

        {/* 局部窗口微弱暖光（仅少量，不整栋发光） */}
        <g className="sk-glow">
          <rect x="196" y="206" width="12" height="18" />
          <circle cx="720" cy="178" r="3.5" />
        </g>

        {/* 极低频呼吸光点（仅 1 个，极弱） */}
        <g className="sk-dot">
          <circle cx="470" cy="170" r="2.2" className="sk-d1" />
        </g>
      </svg>

      {/* 移动端：窄屏友好的简化线稿（左侧建筑 + 中央拱形 + 右侧建筑 + 流动曲线），不裁切 */}
      <svg className="sk-mobile" viewBox="0 0 390 230" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
        <path data-draw className="sk-curve" pathLength={1} style={{ animationDelay: '1.2s' }}
          d="M390 214 C300 228 200 202 0 206" />
        <path data-draw className="sk-ground" pathLength={1} style={{ animationDelay: '0s' }} d="M0 196 H390" />

        {/* 左侧建筑 */}
        <g className="sk-left">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.1s' }} d="M28 196 V120 H78 V196" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.25s' }} d="M53 196 V120 M28 158 H78" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.18s' }} d="M88 196 V150 H118 V196" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.3s' }} d="M103 196 V150" />
        </g>

        {/* 中间拱形文化空间 */}
        <g className="sk-center">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.4s' }} d="M150 196 V130 M270 196 V130" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.55s' }} d="M150 130 Q210 64 270 130" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.7s' }} d="M168 196 H252 M168 182 H252" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.8s' }} d="M210 130 V104" />
        </g>

        {/* 右侧建筑 */}
        <g className="sk-right">
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.5s' }} d="M285 196 V132 H325 V196" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.65s' }} d="M305 196 V132 M285 164 H325" />
          <path data-draw className="sk-main" pathLength={1} style={{ animationDelay: '0.58s' }} d="M335 196 V155 H368 V196" />
          <path data-draw className="sk-sub" pathLength={1} style={{ animationDelay: '0.72s' }} d="M351 196 V155" />
        </g>

        {/* 局部窗口微弱暖光（仅少量） */}
        <g className="sk-glow">
          <rect x="40" y="138" width="9" height="14" />
          <circle cx="210" cy="98" r="3" />
        </g>
      </svg>
    </div>
  );
}

export function Contact() {
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0c0a07]">
      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60%] max-w-xl h-48 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center pt-16 md:pt-24">
        {/* Handwriting accent */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 select-none"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 400,
            color: 'rgba(180,120,45,0.65)',
            transform: 'rotate(-1.5deg)',
            display: 'inline-block',
            letterSpacing: '0.02em',
          }}
        >
          CONTACT
        </motion.p>

        {/* main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight tracking-tight mb-5"
        >
          让文化发生，<br />
          <span className="text-primary">让城市生长。</span>
        </motion.h2>

        {/* english subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-muted-foreground/75 text-lg md:text-xl tracking-wide mb-3"
        >
          Where Culture Flourishes, Cities Thrive.
        </motion.p>

        {/* tea cup CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "收起联系方式" : "喝杯咖啡？显示联系方式"} aria-expanded={open}
            className="relative mt-1 w-14 h-14 text-primary hover:text-primary/80 transition-colors focus:outline-none"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span className="block h-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}><TeaCupIcon /></motion.span>
            {/* glow ring when open */}
            {open && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 rounded-full bg-primary/15 blur-md -z-10"
              />
            )}
          </motion.button>
          <motion.span
            initial={false}
            animate={{ height: open ? 0 : 'auto', opacity: open ? 0 : 1 }}
            transition={{ duration: 0.36, ease: 'easeInOut' }}
            aria-hidden={open}
            className="overflow-hidden text-primary/70 text-xs font-mono tracking-widest"
          >
            <span className="block pt-2">喝杯咖啡？</span>
          </motion.span>
        </motion.div>

        {/* contacts revealed on click */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.35, 0, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5 pt-2 pb-4">
                {contacts.map(({ icon: Icon, label, value, href }, i) => {
                  const inner = (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-primary/20 bg-transparent transition-all duration-300 hover:border-primary/45 hover:bg-primary/[0.04] hover:-translate-y-0.5"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 group-hover:border-primary/40 transition-colors">
                        <Icon className="w-4 h-4 text-primary" strokeWidth={1.7} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] tracking-[0.22em] font-mono uppercase text-muted-foreground/55 mb-0.5">
                          {label}
                        </p>
                        <p className="font-medium text-foreground/85 group-hover:text-primary transition-colors text-sm md:text-base">
                          {value}
                        </p>
                      </div>
                    </motion.div>
                  );
                  return href ? (
                    <a key={label} href={href} className="block">{inner}</a>
                  ) : (
                    <div key={label}>{inner}</div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 建筑线稿：作为 Slogan 的视觉延伸，位于联系方式下方 */}
      <ContactSketch />

      {/* 版权信息位于页面最底部，不横在建筑上方 */}
      <div className="contact-copyright container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground/40 text-xs font-mono tracking-widest pt-6 border-t border-border/15">
          <span>© {year} 王静茹 (Jingru Wang)</span>
          <span>品牌营销策划</span>
        </div>
      </div>
    </footer>
  );
}
