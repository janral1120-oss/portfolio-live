import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, Smartphone } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { heroPortrait } from '@/lib/portfolioData';
import { ParticleSphere } from '@/components/portfolio/ParticleSphere';

export function Hero() {
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label}: ${text}`,
      duration: 2000,
    });
  };

  const TEL = "13898171261";
  const contacts = [
    { icon: <Phone className="w-5 h-5" />, label: "电话", value: TEL, isTel: true },
    { icon: <Smartphone className="w-5 h-5" />, label: "小红书", value: "@Lululune", isTel: false },
    { icon: <MessageCircle className="w-5 h-5" />, label: "微信", value: "jrlune", isTel: false },
    { icon: <Mail className="w-5 h-5" />, label: "邮箱", value: "13898171261@163.com", isTel: false },
  ];

  return (
    <section id="hero" className="relative flex flex-col justify-center overflow-hidden">
      {/* Soft radial gradient so sphere blends into the dark bg */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_60%_80%_at_28%_50%,transparent_35%,rgba(12,10,7,0.55)_80%)]" />
      <div className="container mx-auto px-6 z-10">
        <div className="hero-layout">
          <header className="hero-heading">
            <p className="hero-kicker">BRAND MARKETING · CULTURAL IP · EXPERIENCE</p>
            <h1>品牌营销策划<span>文化IP与空间体验</span></h1>
          </header>
          <div className="hero-person">
            <figure className="hero-identity">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-portrait relative flex-shrink-0"
              >
                <ParticleSphere className="z-0" />
                {/* Deep amber glow */}
                <div className="absolute inset-[-12%] rounded-full bg-primary/15 blur-3xl" />

                {/* Slow-spin outer dashed orbit */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-8px] rounded-full pointer-events-none"
                  style={{
                    border: '1px dashed rgba(230,161,87,0.30)',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Static thin solid ring */}
                <div
                  className="absolute inset-[-4px] rounded-full pointer-events-none"
                  style={{ border: '1px solid rgba(230,161,87,0.18)', boxSizing: 'border-box' }}
                />

                {/* Diamond accent marks at compass positions */}
                {[0, 90, 180, 270].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 pointer-events-none"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateY(-142%) translateX(-50%) rotate(45deg)`,
                      background: 'rgba(230,161,87,0.75)',
                      boxSizing: 'border-box',
                    }}
                  />
                ))}

                {/* Portrait — octagonal clip via clip-path for editorial crop */}
                <div className="absolute inset-0 overflow-hidden rounded-full shadow-2xl">
                  <img 
                    src={heroPortrait} 
                    alt="王静茹 Jingru Wang"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 18%' }}
                  />
                  {/* subtle warm inner vignette */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-primary/15 shadow-[inset_0_0_32px_rgba(12,10,7,0.45)]" />
                </div>

                {/* Amber arc segments: two short arcs at top-left / bottom-right */}
                <svg
                  className="absolute inset-[-12px] pointer-events-none"
                  viewBox="0 0 320 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="160" cy="160" r="152"
                    stroke="#e6a157" strokeWidth="1.5" strokeOpacity="0.45"
                    strokeDasharray="48 208"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  <circle cx="160" cy="160" r="152"
                    stroke="#e6a157" strokeWidth="1.5" strokeOpacity="0.25"
                    strokeDasharray="48 208"
                    strokeDashoffset="128"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <figcaption>王静茹 · <i lang="en">Jingru Wang</i></figcaption>
            </figure>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hero-contacts"
            >
              <TooltipProvider>
                {contacts.map((contact, idx) => (
                  <Tooltip key={idx} delayDuration={80}>
                    <TooltipTrigger asChild>
                      {contact.isTel ? (
                        <a
                          href={`tel:${contact.value}`}
                          className="p-3 rounded-full bg-card border border-primary/50 hover:border-primary hover:bg-primary/15 transition-all duration-300 interactive-glow group"
                          aria-label={`拨打 ${contact.value}`}
                        >
                          <span className="text-primary group-hover:text-primary transition-colors">
                            {contact.icon}
                          </span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleCopy(contact.value, contact.label)}
                          className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 interactive-glow group"
                          aria-label={contact.label}
                        >
                          <span className="text-foreground group-hover:text-primary transition-colors">
                            {contact.icon}
                          </span>
                        </button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-foreground font-sans">
                      <p className="text-sm font-medium">{contact.label}</p>
                      {contact.isTel ? (
                        <>
                          <p className="text-base font-mono font-bold text-primary tracking-wider mt-1">
                            138 9817 1261
                          </p>
                          <p className="text-[10px] text-primary/70 mt-1">点击直接拨打</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">{contact.value}</p>
                          <p className="text-[10px] text-primary/70 mt-1">Click to copy</p>
                        </>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </motion.div>
          </div>
          <p className="hero-expertise"><span>品牌定位 · 原创IP开发</span><span className="hero-separator"> · </span><span>整合营销 · 体验产品策划</span></p>
          <dl className="hero-experience">
            <div>
              <dt>2023—2025｜爱乐汇</dt>
              <dd>原创音乐IP开发、艺术空间开业营销及新媒体业务搭建。</dd>
            </div>
            <div>
              <dt>2026—至今｜阿那亚</dt>
              <dd>多目的地酒店活动统筹与品牌体验内容开发。</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
}