import { formatDate } from "../utils/helpers";
import type { Post } from "../utils/posts";

export function archivePage(posts: Post[]) {
  const items = posts
    .map((p, i) => {
      const isLeft = i % 2 === 0;
      return `<div class="timeline-item reveal d${Math.min(i + 2, 5)}">
    <div class="post-card"><div class="post-card-body">
      <div class="post-card-meta">
        <span class="material-symbols-rounded" style="font-size:14px">calendar_today</span>
        <span>${formatDate(p.meta.date)}</span>
        ${p.meta.tags && p.meta.tags.length > 0 ? `<span class="post-card-sep">·</span><span class="post-card-tags">${p.meta.tags.slice(0, 2).join(", ")}</span>` : ""}
      </div>
      <h3><a href="/posts/${p.slug}" style="text-decoration:none;color:inherit">${p.meta.title}</a></h3>
      <p>${p.meta.description || ""}</p>
    </div></div>
  </div>`;
    })
    .join("");

  return `<div class="page-header reveal d1">
    <h1>归档</h1>
    <p>全部 ${posts.length} 篇文章</p>
  </div>
  <div class="timeline">${items}</div>`;
}
