"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const defaultVideoUrl = "https://www.youtube.com/embed/o8OgzQdA70c?autoplay=1";

export function BlogVideoModalTrigger({ image, title = "Dental education video", videoUrl = defaultVideoUrl }: { image: string; title?: string; videoUrl?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return <>
    <div className="source-blog-video" style={{ backgroundImage: `linear-gradient(rgba(14,29,76,.18), rgba(14,29,76,.18)), url('${image}')` }}>
      <button type="button" className="source-blog-play" aria-label="Play video" onClick={() => setOpen(true)}><span>▶</span></button>
    </div>
    {open ? <div className="video-modal" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
      <div className="video-dialog" onClick={(event) => event.stopPropagation()}>
        <button className="video-close" type="button" aria-label="Close video" onClick={() => setOpen(false)}><Icon name="close" size={24} /></button>
        <div className="video-frame"><iframe src={videoUrl} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
      </div>
    </div> : null}
  </>;
}
