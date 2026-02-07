"use client";

import { useEffect } from "react";

interface Props {
  slug: string;
}

export function PostViewCounter({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;

    const key = `viewed-post-${slug}`;
    const now = Date.now();
    const TTL = 30 * 60 * 1000;

    const lastView = sessionStorage.getItem(key);

    if (lastView && now - Number(lastView) < TTL) return;

    sessionStorage.setItem(key, now.toString());

    fetch(`/api/posts/${slug}/view`, {
      method: "POST",
    }).catch(console.error);
  }, [slug]);

  return null;
}
