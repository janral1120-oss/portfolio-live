import { CursorGlow } from "@/components/portfolio/CursorGlow";
import { BackgroundNoise } from "@/components/portfolio/BackgroundNoise";
import { Hero } from "@/components/portfolio/Hero";
import { CoreSectors } from "@/components/portfolio/CoreSectors";
import { CareerJourney } from "@/components/portfolio/CareerJourney";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { Contact } from "@/components/portfolio/Contact";
import { CareerAmbience } from "@/components/portfolio/CareerAmbience";
import { JourneyIndicator } from "@/components/portfolio/JourneyIndicator";
import { TheaterEasterEgg } from "@/components/portfolio/TheaterEasterEgg";

import { SocialOps } from "@/components/portfolio/SocialOps";
import { Manifesto } from "@/components/portfolio/Manifesto";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <BackgroundNoise />
      <CursorGlow />
      <CareerAmbience />
      <JourneyIndicator />
      <TheaterEasterEgg />

      <div className="relative z-10 flex flex-col max-w-[1920px] mx-auto">
        <Hero />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-40" />

        <CoreSectors />

        <FeaturedProjects />
        <SocialOps />
        <CareerJourney />
        <Manifesto />
        <section id="tools" className="container mx-auto px-6 py-10">
          <h2 className="text-primary font-serif font-bold mb-3">其他相关实践</h2>
          <h3 className="mt-4 font-bold">数字工具与工作方法</h3>
          <p>使用AI工具辅助资料研究、内容整理、方案推演及工作流程优化，探索更高效的内容生产与项目协作方式。</p>
          <h3 className="mt-4 font-bold">个人兴趣与观察</h3>
          <p>长期关注音乐、艺术、户外徒步与目的地文化，从真实生活体验中积累内容观察与创作灵感。</p>
        </section>
        <Contact />
      </div>
    </main>
  );
}
