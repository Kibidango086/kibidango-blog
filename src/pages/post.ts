import { formatDate } from "../utils/helpers";
import { waline } from "../config";
import type { Post } from "../utils/posts";

function walineSection(): string {
  if (!waline.serverURL) return "";
  return `<section class="comments-section reveal d4">
  <h2 class="comments-heading">评论</h2>
  <div id="waline"></div>
  <script type="module">
    (function(){
      var el=document.getElementById('waline');
      if(!el)return;
      var loaded=false;
      var observer=new IntersectionObserver(function(entries){
        if(entries[0].isIntersecting&&!loaded){
          loaded=true;
          observer.disconnect();
          var link=document.createElement('link');
          link.rel='stylesheet';
          link.href='https://unpkg.com/@waline/client@v3/dist/waline.css';
          document.head.appendChild(link);
          import('https://unpkg.com/@waline/client@v3/dist/waline.js').then(function(m){
            m.init({
              el:'#waline',
              serverURL:'${waline.serverURL}',
              dark:'html.dark',
              lang:'zh-CN',
              path:window.location.pathname
            });
          });
        }
      },{rootMargin:'200px'});
      observer.observe(el);
    })();
  </script>
</section>`;
}

export function postPage(post: Post) {
  const { meta } = post;
  return `<article class="post-article">
    <div class="reveal d1">
      <a href="/archive" class="back-link">
        <span class="material-symbols-rounded" style="font-size:16px">arrow_back</span>
        返回归档
      </a>
    </div>
    <header class="post-header reveal d1">
      <h1>${meta.title}</h1>
      <div class="post-meta">
        <span class="material-symbols-rounded" style="font-size:14px">calendar_today</span>
        <span>${formatDate(meta.date)}</span>
        ${meta.category ? `<span class="post-meta-sep">·</span><span>${meta.category}</span>` : ""}
        ${meta.tags && meta.tags.length > 0 ? `<span class="post-meta-sep">·</span>${meta.tags.map(t => `<span class="post-tag">${t}</span>`).join("")}` : ""}
      </div>
    </header>
    <div class="post-content reveal d2">
      ${post.html}
    </div>
  </article>
  ${walineSection()}
  <div class="reveal d3 post-back">
    <a href="/" class="back-link">
      <span class="material-symbols-rounded" style="font-size:16px">arrow_back</span>
      返回首页
    </a>
  </div>
  <div class="scroll-top-wrap" id="scroll-top-wrap" style="--progress: 0%">
    <button class="scroll-top-btn" id="scroll-top-btn" aria-label="回到顶部">
      <span class="material-symbols-rounded">arrow_upward</span>
    </button>
  </div>`;
}
