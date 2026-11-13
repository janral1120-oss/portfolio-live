const scenes = import.meta.glob<string>('/src/assets/work-scenes/*.webp', { eager: true, query: '?url', import: 'default' });

export function WorkImageSlot({ file, label, description }: { file: string; label: string; description: string }) {
  const src = scenes['/src/assets/work-scenes/' + file + '.webp'];
  return <figure className="work-slot">
    <figcaption>{label}</figcaption>
    {src ? <img src={src} alt={description} loading="lazy"/> : <span>{description}</span>}
  </figure>;
}
