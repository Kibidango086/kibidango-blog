import type { Post } from "../utils/posts";
import { formatDate } from "../utils/helpers";

export function postCard(post: Post) {
  const { meta, slug } = post;
  return `<a href="/posts/${slug}" class="post-card reveal d3">
  <div class="post-card-body">
    <div class="post-card-meta">
      <span class="material-symbols-rounded" style="font-size:14px">calendar_today</span>
      <span>${formatDate(meta.date)}</span>
      ${meta.tags && meta.tags.length > 0 ? `<span class="post-card-sep">·</span><span class="post-card-tags">${meta.tags.slice(0, 2).join(", ")}</span>` : ""}
    </div>
    <h3>${meta.title}</h3>
    <p>${meta.description || ""}</p>
  </div>
</a>`;
}

export function postList(posts: Post[], limit?: number, showViewAll = true) {
  const display = limit ? posts.slice(0, limit) : posts;
  const cards = display.map((p) => postCard(p)).join("");

  return `<section class="section posts-section">
  <div class="section-header reveal d3">
    <h2>最新文章</h2>
    <p>最近的博客文章</p>
  </div>
  <div class="posts-grid">
    ${cards || '<div class="text-center py-8 text-muted-foreground col-span-full">No posts yet.</div>'}
  </div>
  ${showViewAll && posts.length > (limit || 0) ? `
  <div class="text-center reveal d4 mt-6">
    <a href="/archive" class="btn-outline">查看全部 ${posts.length} 篇文章 <span class="material-symbols-rounded" style="font-size:16px">arrow_forward</span></a>
  </div>` : ""}
</section>`;
}
