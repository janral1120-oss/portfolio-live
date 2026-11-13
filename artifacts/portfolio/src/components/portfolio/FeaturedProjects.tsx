import { useState, MouseEvent, useEffect, Fragment, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import rawProjects from '@/lib/p0Projects.json';
import { featuredProjects as archive } from '@/lib/portfolioData';
import changyingPress from "@assets/（三）新空间开业操盘_·_业态矩阵进化佐证：常营爱乐汇开业发布_1777460275826.jpg";
import wukesongPress from "@assets/（三）新空间开业操盘_·_业态矩阵进化佐证：五棵松爱乐汇开业发布截图1_1777460275829.jpg";
import { ReadingDialog } from './ReadingDialog';
import { ArrowUpRight, X } from 'lucide-react';

type MediaImage = { src: string; caption: string; orientation: string; fit?: string };
type MediaGroup = { anchor: string; title: string; layout: string; images: MediaImage[] };
type Action = { no: string; title: string; detail: string; part: string };
type Result = { label: string; text: string };
type Destination = { name: string; status: string; statusNote: string; detail: string };
type ProjectCase = {
  id: string; no: string; title: string; tags: string[]; date: string; image: string;
  coverPosition?: string;
  tagline: string; role: string; summary: string[]; judgment: string[];
  keyResults: { value: string; label: string }[]; keyResultsNote: string;
  actions: Action[]; results: Result[]; review: string[]; dataNotes: string[];
  destinations: Destination[]; media: MediaGroup[]; hideResults?: boolean; hideStatus?: boolean;
};

const cardSummaries: Record<string, string> = {
  '01': '以原创独立音乐IP建立空间内容特色，探索系列演出、音乐人合作与持续运营机制。',
  '02': '针对两种空间形态与客群场景，制定差异化开业策略，整合演出内容与品牌传播资源。',
  '03': '从内容运营、达人合作到票务直播，建立传播与销售协同的营销机制。',
  '04': '结合目的地文化与酒店定位，开发在地体验活动及可持续运营的内容产品。',
};

const projects = rawProjects as unknown as ProjectCase[];

// 保留原有素材：两张开业报道截图、五棵松乐团合影（沿用旧案例图，不新增文件）
// 注：原 AI 生成的空间内景图已从页面展示移除，源文件仍保留在 src/assets/
const orchestraGroup = archive.find(p => p.id === 'case-3')?.image ?? '';
const assetMap: Record<string, string> = {
  'asset:orchestraGroup': orchestraGroup,
  'asset:changyingPress': changyingPress,
  'asset:wukesongPress': wukesongPress,
};
const resolveSrc = (src: string) => assetMap[src] ?? src;

function ProjectCard({ project, index, onOpen }: { project: ProjectCase; index: number; onOpen: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({ x: -((e.clientY - rect.top) / rect.height - 0.5) * 4, y: ((e.clientX - rect.left) / rect.width - 0.5) * 4 });
  };
  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      onClick={onOpen}
      className="group relative cursor-pointer rounded-2xl overflow-hidden border border-border/70 bg-card transition-all duration-500 hover:border-primary/60 hover:shadow-[0_25px_80px_-20px_rgba(230,161,87,0.35)] flex flex-col"
      style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 250ms ease-out, border-color 400ms, box-shadow 600ms' }}
    >
      <div className="relative overflow-hidden aspect-[5/3]">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out group-hover:scale-[1.08]"
          style={{ backgroundImage: `url(${resolveSrc(project.image)})`, backgroundPosition: project.coverPosition ?? 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 mix-blend-overlay opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
        <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"160\\" height=\\"160\\"><filter id=\\"n\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"2\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23n)\\" opacity=\\"0.7\\"/></svg>")' }} />

        <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md border border-border/60">
          <span className="font-mono text-[10px] tracking-[0.22em] text-primary">№ {project.no}</span>
          <span className="w-1 h-1 rounded-full bg-primary/60" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Case Study</span>
        </div>
        <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-md border border-border/60 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/90 group-hover:border-primary group-hover:rotate-45">
          <ArrowUpRight className="w-4 h-4 text-foreground/80 group-hover:text-background transition-colors" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/65 backdrop-blur-sm border border-border/50 text-foreground/85">{tag}</span>
          ))}
        </div>
      </div>

      <div className="relative p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl md:text-[22px] text-balance leading-tight text-foreground group-hover:text-primary transition-colors duration-500 tracking-tight">
          {project.title}
        </h3>
        <div className="mt-5 pt-5 border-t border-dashed border-border/60">
          <p className="text-[10px] tracking-[0.22em] text-muted-foreground/70 uppercase font-mono mb-2">项目时间</p>
          <p className="text-foreground/95 font-medium text-[15px] leading-relaxed">{project.date}</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{cardSummaries[project.no]}</p>
        <div className="mt-auto pt-6 flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase font-mono text-muted-foreground group-hover:text-primary transition-all duration-300">
          <span>阅读项目</span><span className="flex-1 h-px bg-border group-hover:bg-primary/60 transition-colors" />
        </div>
      </div>
    </motion.article>
  );
}

function Section({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`p0-section ${className}`}>
    <h3 className="p0-section-title">{title}</h3>
    {children}
  </section>;
}

function MediaBlock({ group, onZoom }: { group: MediaGroup; onZoom: (img: MediaImage) => void }) {
  return <div className="p0-media">
    {group.title && <p className="p0-media-title">{group.title}</p>}
    <div className="p0-media-grid" data-layout={group.layout}>
      {group.images.map(img => (
        <figure key={img.src} className="p0-figure" data-orientation={img.orientation} data-fit={img.fit}>
          <button type="button" onClick={() => onZoom(img)} aria-label={'放大查看：' + img.caption}>
            <img src={resolveSrc(img.src)} alt={img.caption} loading="lazy" />
          </button>
          <figcaption>{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  </div>;
}

function groupActions(actions: Action[]) {
  const groups: { label: string; items: Action[] }[] = [];
  for (const action of actions) {
    const label = action.part || '';
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(action);
    else groups.push({ label, items: [action] });
  }
  return groups;
}

function ProjectDetail({ project, onZoom }: { project: ProjectCase; onZoom: (img: MediaImage) => void }) {
  const mediaFor = (anchor: string) => project.media.filter(group => group.anchor === anchor);

  return <div className="p0-detail">
    {/* 首屏：名称 / 定位 / 职责 / 关键成果 */}
    <header className="p0-hero">
      <div className="p0-hero-meta">
        <span className="font-mono tracking-[0.22em] text-primary">№ {project.no}</span>
        <span className="font-mono tracking-[0.18em] text-muted-foreground">{project.date}</span>
      </div>
      <h2 className="p0-hero-title">{project.title}</h2>
      <div className="p0-hero-tags">
        {project.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      <p className="p0-hero-tagline">{project.tagline}</p>

      <div className="p0-role">
        <span className="p0-role-label">我的职责</span>
        <p>{project.role}</p>
      </div>

      {project.keyResults.length > 0 && <>
        <div className="p0-keyresults">
          {project.keyResults.map(k => <div key={k.value}>
            <strong>{k.value}</strong><span>{k.label}</span>
          </div>)}
        </div>
        {project.keyResultsNote && <p className="p0-inline-note">{project.keyResultsNote}</p>}
      </>}
      {project.keyResults.length === 0 && !project.hideStatus && <div className="p0-highlights">
        <span className="p0-role-label">关键成果</span>
        <div>{project.results.map(r => <span key={r.label} className="p0-highlight-chip">{r.label}</span>)}</div>
      </div>}
    </header>

    <Section title="项目速览">
      {project.summary.map((line, i) => <p key={i} className="p0-para">{line}</p>)}
      {mediaFor('summary').map(g => <MediaBlock key={g.anchor + g.title} group={g} onZoom={onZoom} />)}
    </Section>

    <Section title="策略判断">
      {project.judgment.map((line, i) => <p key={i} className={i === 0 ? 'p0-judgment-lead' : 'p0-para'}>{line}</p>)}
    </Section>

    <Section title="关键行动">
      {groupActions(project.actions).map((group, gi) => <div key={gi} className="p0-action-group">
        {group.label && <h4 className="p0-action-group-title">{group.label}</h4>}
        {group.items.map(action => <Fragment key={action.no}>
          <div className="p0-action">
            <span className="p0-action-no">{action.no}</span>
            <div>
              <strong>{action.title}</strong>
              {action.detail && <p>{action.detail}</p>}
            </div>
          </div>
          {mediaFor('action:' + action.no).map(g => <MediaBlock key={g.anchor + g.title} group={g} onZoom={onZoom} />)}
        </Fragment>)}
      </div>)}
    </Section>

    {project.destinations.length > 0 && <Section title={project.hideStatus ? '目的地内容' : '目的地内容与项目状态'}>
      <div className="p0-dest-list">
        {project.destinations.map(dest => <Fragment key={dest.name}>
          <article className="p0-dest">
            <div className="p0-dest-head">
              <h4>{dest.name}</h4>
              {!project.hideStatus && <span className="p0-status">{dest.status}</span>}
            </div>
            <p>{dest.detail}</p>
            {!project.hideStatus && <p className="p0-status-note">{dest.statusNote}</p>}
          </article>
          {mediaFor('destination:' + dest.name).map(g => <MediaBlock key={g.anchor + g.title} group={g} onZoom={onZoom} />)}
        </Fragment>)}
      </div>
    </Section>}

    {!project.hideResults && <Section title="项目成果">
      <div className="p0-results">
        {project.results.map(r => <div key={r.label} className="p0-result">
          <strong>{r.label}</strong><p>{r.text}</p>
        </div>)}
      </div>
    </Section>}

    {project.review.length > 0 && <Section title="项目复盘" className="p0-review">
      {project.review.map((line, i) => <p key={i} className="p0-para">{line}</p>)}
    </Section>}

    {project.dataNotes.length > 0 && <Section title="数据口径说明" className="p0-notes">
      {project.dataNotes.map((line, i) => <p key={i} className="p0-para">{line}</p>)}
    </Section>}
  </div>;
}

export function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<ProjectCase | null>(null);
  const [zoom, setZoom] = useState<MediaImage | null>(null);
  const [zoomLarge, setZoomLarge] = useState(false);

  useEffect(() => { if (!zoom) setZoomLarge(false); }, [zoom]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setZoom(null); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoom]);

  const close = () => { setZoom(null); setSelectedProject(null); };

  return (
    <section className="py-24" id="projects">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-14 flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
              代表项目 <span className="text-primary">Featured Projects</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md">
              四个代表项目，记录从品牌定位、内容开发到营销传播与体验落地的不同实践。
            </p>
          </div>
          <div className="hidden md:block font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground/70">
            Four Cases · 2023 — 2026
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      {selectedProject && <ReadingDialog drawer title={selectedProject.title} closeLabel="关闭项目" onClose={close}>
        <ProjectDetail project={selectedProject} onZoom={setZoom} />
        {zoom && <div className="p0-lightbox" data-large={zoomLarge ? 'true' : 'false'} onClick={() => setZoom(null)} role="dialog" aria-modal="true" aria-label={zoom.caption}>
          <div className="p0-lightbox-tools" onClick={e => e.stopPropagation()}>
            <button type="button" className="p0-lightbox-zoom" onClick={() => setZoomLarge(v => !v)}>{zoomLarge ? '适应窗口' : '放大看数据'}</button>
            <button type="button" className="p0-lightbox-close" aria-label="关闭图片" onClick={() => setZoom(null)}><X size={20} /></button>
          </div>
          <div className="p0-lightbox-stage">
            <img src={resolveSrc(zoom.src)} alt={zoom.caption} onClick={e => { e.stopPropagation(); setZoomLarge(v => !v); }} />
          </div>
          <p>{zoom.caption}</p>
        </div>}
      </ReadingDialog>}
    </section>
  );
}
