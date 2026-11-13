import { motion, useReducedMotion } from 'framer-motion';

export function Manifesto() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="manifesto" className="relative pt-20 md:pt-28 pb-8 overflow-hidden">
      {/* faint amber wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <span aria-hidden className="absolute -left-2 -top-6 md:-left-6 md:-top-10 font-serif text-primary/30 text-7xl md:text-9xl leading-none select-none">
              &ldquo;
            </span>
            <span aria-hidden className="absolute -right-2 -bottom-12 md:-right-6 md:-bottom-16 font-serif text-primary/30 text-7xl md:text-9xl leading-none select-none">
              &rdquo;
            </span>

            <motion.blockquote className="font-serif"
              initial={reducedMotion ? false : 'hidden'}
              whileInView="visible" viewport={{ once: true, amount: 0.45 }}>
              {['好的内容不止于被看见，', '也值得被体验、被记住，', '并形成持续生长的价值。'].map((line, index) => (
                <motion.span key={line}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  animate={reducedMotion ? 'visible' : undefined}
                  transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : index * 0.28, ease: 'easeOut' }}>
                  {line}
                </motion.span>
              ))}
            </motion.blockquote>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground/70">
            <span className="h-px w-10 bg-primary/40" />

            <span className="h-px w-10 bg-primary/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
