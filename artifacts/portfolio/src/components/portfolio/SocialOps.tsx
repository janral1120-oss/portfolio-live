import { useState } from 'react';
import { socialOps } from '@/lib/portfolioData';
import { ReadingDialog } from './ReadingDialog';

export function SocialOps() {
  const [image, setImage] = useState<{src: string; title: string} | null>(null);
  return <section id="social-ops" className="py-20 bg-card/15">
    <div className="container mx-auto px-6">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3"><span className="whitespace-nowrap">个人内容创作</span> <span className="text-primary">Personal Notes</span></h2>
      <p className="mb-6 text-muted-foreground">工作之外，我也喜欢记录演出、旅行和日常生活。偶尔分享一些有趣的发现，也把自己的审美和想法慢慢整理成内容。</p>
      <div className="social-pair">{socialOps.slice(1).map(account =>
        <article key={account.id}>
          {account.id === 'social-2' ? <>
            <h3>Lune 演艺手册</h3>
            <p>喜欢发现有趣的文化与商业，也喜欢记录美好发生的瞬间。</p>
          </> : <>
            <h3>{account.account}</h3>
            <p>一家好吃的店、一段旅行路上的风景，或者一次特别的体验，都可能成为我想记录和分享的内容。</p>
          </>}
          <div className="social-thumbs">{account.screenshots?.slice(0,3).map((src, i) => {
            const title = account.account + ' · 内容截图 ' + (i + 1);
            return <button key={src} aria-label={'查看' + title} onClick={() => setImage({src, title})}>
              <img loading="lazy" src={src} alt={title}/>
            </button>;
          })}</div>
        </article>
      )}</div>
    </div>
    {image && <ReadingDialog title={image.title} closeLabel="关闭图片" onClose={() => setImage(null)}>
      <img className="full-evidence" src={image.src} alt={image.title}/>
    </ReadingDialog>}
  </section>;
}
