import { site, social } from "../config";
import { sidebar } from "./sidebar";
import { EMBEDDED_CSS } from "../styles/embed";

function accentCSS(): string {
  const h = site.accentHue;
  return `<style id="accent-css">
:root {
  --hue: ${h};
  --primary:    oklch(0.68 0.16 var(--hue));
  --primary-fg: oklch(0.99 0 0);
  --ring:       oklch(0.6 0.16 var(--hue));
  --chat-avatar-bg: oklch(0.68 0.16 var(--hue) / 0.12);
  --blob:       oklch(0.65 0.16 var(--hue) / 0.3);
}
.dark {
  --primary:    oklch(0.72 0.14 var(--hue));
  --ring:       oklch(0.65 0.14 var(--hue));
  --chat-avatar-bg: oklch(0.72 0.14 var(--hue) / 0.15);
  --blob:       oklch(0.6 0.14 var(--hue) / 0.25);
}
</style>`;
}

const themeScript = `(function(){
  var t=localStorage.getItem('theme')||'${site.defaultTheme}';
  if(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();`;

const mainScript = `
// -- theme --
function setTheme(dark,ox,oy){
  var r=document.documentElement,isDark=r.classList.contains('dark');
  if(dark===isDark)return;
  function apply(){
    if(dark)r.classList.add('dark');else r.classList.remove('dark');
    localStorage.setItem('theme',dark?'dark':'light');
    updateIcons(dark);
  }
  r.classList.add('no-transitions');
  setTimeout(function(){r.classList.remove('no-transitions')},600);
  if(document.startViewTransition){
    if(ox!==undefined){r.style.setProperty('--vt-origin-x',ox+'px');r.style.setProperty('--vt-origin-y',oy+'px')}
    document.startViewTransition(function(){apply()});
  }else apply();
}
function updateIcons(dark){
  document.querySelectorAll('.theme-switch').forEach(function(b){
    var m=b.querySelector('.icon-dark'),s=b.querySelector('.icon-light');
    if(m)m.style.display=dark?'none':'block';
    if(s)s.style.display=dark?'block':'none';
  });
}
function toggleMobileSidebar(){
  var sb=document.getElementById('sidebar'),ov=document.getElementById('sidebar-overlay');
  if(!sb||!ov)return;
  sb.classList.toggle('open');ov.classList.toggle('open');
  document.body.style.overflow=sb.classList.contains('open')?'hidden':'';
}

// -- SPA navigation --
var cache={};
async function navigateTo(url,push){
  var area=document.getElementById('content-area');
  if(!area)return;
  if(push===undefined)push=true;
  area.classList.add('loading');
  try{
    var html;
    if(cache[url]){ html=cache[url]; }
    else{
      var res=await fetch(url);
      html=await res.text();
      cache[url]=html;
    }
    var parser=new DOMParser();
    var doc=parser.parseFromString(html,'text/html');
    var newArea=doc.getElementById('content-area');
    var newTitle=doc.title;
    if(!newArea)throw new Error('No content-area in response');
    area.innerHTML=newArea.innerHTML;
    if(newTitle)document.title=newTitle;
    window.scrollTo({top:0,behavior:'smooth'});
    // Execute any script tags from the new content (e.g. Waline lazy load)
    area.querySelectorAll('script').forEach(function(s){
      var ns=document.createElement('script');
      Array.from(s.attributes).forEach(function(a){ns.setAttribute(a.name,a.value)});
      ns.textContent=s.textContent;
      s.replaceWith(ns);
    });
    if(push&&window.location.href!==url)history.pushState({url:url},'',url);
    initAfterSwap();
  }catch(e){
    console.error('SPA navigate error:',e);
    if(push)window.location.href=url;
  }finally{
    area.classList.remove('loading');
  }
}
window.addEventListener('popstate',function(e){
  if(e.state&&e.state.url)navigateTo(e.state.url,false);
});

// -- re-init after content swap --
function initAfterSwap(){
  document.querySelectorAll('.reveal').forEach(function(el){
    el.style.animationPlayState='running';
    var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.style.animationPlayState='running'})},{threshold:.1});
    obs.observe(el);
  });
  var toast=document.querySelector('.toast') || (function(){var t=document.createElement('div');t.className='toast';document.body.appendChild(t);return t})();
  function showToast(text){toast.innerHTML=text;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},2800);}
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.onclick=null;
    btn.addEventListener('click',function(){
      var code=btn.parentElement.querySelector('code');
      if(!code)return;
      navigator.clipboard.writeText(code.textContent||'').then(function(){
        btn.querySelector('.material-symbols-rounded').textContent='check';
        setTimeout(function(){btn.querySelector('.material-symbols-rounded').textContent='content_copy'},2000);
        showToast('已复制 <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" target=\"_blank\">CC BY-NC-SA 4.0</a>');
      });
    });
  });
  var sbt=document.getElementById('sidebar-toggle-btn'),sbo=document.getElementById('sidebar-overlay'),sbc=document.getElementById('sidebar-close-btn');
  if(sbt){sbt.onclick=null;sbt.addEventListener('click',toggleMobileSidebar)}
  if(sbo){sbo.onclick=null;sbo.addEventListener('click',toggleMobileSidebar)}
  if(sbc){sbc.onclick=null;sbc.addEventListener('click',toggleMobileSidebar)}
  var sbe=document.getElementById('sidebar-extra'),sbtb=document.getElementById('sidebar-toggle');
  if(sbtb&&sbe){sbtb.onclick=null;sbtb.addEventListener('click',function(){sbe.classList.toggle('open')})}
  initScrollTopBtn();
}

// -- full init on DOMContentLoaded --
document.addEventListener('DOMContentLoaded',function(){
  var bar=document.getElementById('loading-bar');
  if(bar){bar.style.width='100%';bar.style.opacity='1';setTimeout(function(){bar.style.opacity='0'},400)}
  var h=document.getElementById('hamburger'),n=document.getElementById('nav-links');
  if(h&&n)h.addEventListener('click',function(){n.classList.toggle('hidden');n.classList.toggle('flex');h.classList.toggle('open')});
  var sbt=document.getElementById('sidebar-toggle-btn'),sbo=document.getElementById('sidebar-overlay'),sbc=document.getElementById('sidebar-close-btn');
  if(sbt)sbt.addEventListener('click',toggleMobileSidebar);
  if(sbo)sbo.addEventListener('click',toggleMobileSidebar);
  if(sbc)sbc.addEventListener('click',toggleMobileSidebar);
  document.querySelectorAll('.theme-switch').forEach(function(b){
    b.addEventListener('click',function(e){setTheme(!document.documentElement.classList.contains('dark'),e.clientX,e.clientY)});
  });
  updateIcons(document.documentElement.classList.contains('dark'));
  var sbe=document.getElementById('sidebar-extra'),sbtb=document.getElementById('sidebar-toggle');
  if(sbtb&&sbe)sbtb.addEventListener('click',function(){sbe.classList.toggle('open')});
  var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.style.animationPlayState='running'})},{threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el)});

  // Code copy buttons with toast
  var toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);
  function showToast(text){toast.innerHTML=text;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},2800);}
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var code=btn.parentElement.querySelector('code');
      if(!code)return;
      navigator.clipboard.writeText(code.textContent||'').then(function(){
        btn.querySelector('.material-symbols-rounded').textContent='check';
        setTimeout(function(){btn.querySelector('.material-symbols-rounded').textContent='content_copy'},2000);
        showToast('已复制 <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" target=\"_blank\">CC BY-NC-SA 4.0</a>');
      });
    });
  });

  // General text copy listener
  document.addEventListener('copy',function(e){showToast('已复制 <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/\" target=\"_blank\">CC BY-NC-SA 4.0</a>')});

  // SPA: intercept internal link clicks
  document.body.addEventListener('click',function(e){
    var link=e.target.closest('a');
    if(!link)return;
    // Skip email-protector links (they have their own handler)
    if(link.classList.contains('email-protector'))return;
    var href=link.getAttribute('href')||'';
    if(!href||href.startsWith('http')||href.startsWith('//')||href.startsWith('#')||href.startsWith('mailto:')||link.getAttribute('target')==='_blank'||link.getAttribute('download')!==null||link.hasAttribute('data-secret'))return;
    e.preventDefault();
    navigateTo(href,true);
  });

  // Email obfuscation: XOR decrypt on click
  var key='nfp|:YSqW\"KbWeF~Gt\"Bva';
  document.body.addEventListener('click',function(e){
    var link=e.target.closest('.email-protector');
    if(!link)return;
    e.preventDefault();
    var secret=link.getAttribute('data-secret');
    if(!secret)return;
    var raw=atob(secret),r='';
    for(var i=0;i<raw.length;i++)r+=String.fromCharCode(raw.charCodeAt(i)^key.charCodeAt(i%key.length));
    window.location.href='mailto:'+r;
  });
  document.body.addEventListener('contextmenu',function(e){
    if(e.target.closest('.email-protector'))e.preventDefault();
  });

  // Scroll to top button with reading progress
  function updateScrollProgress(){
    var wrap=document.getElementById('scroll-top-wrap');
    if(!wrap)return;
    var scrollTop=window.scrollY;
    var docHeight=document.documentElement.scrollHeight-window.innerHeight;
    var pct=docHeight>0?Math.min(scrollTop/docHeight*100,100):0;
    wrap.style.setProperty('--progress',pct+'%');
    wrap.classList.toggle('visible',scrollTop>300);
  }
  window.addEventListener('scroll',updateScrollProgress);
  function initScrollTopBtn(){
    var btn=document.getElementById('scroll-top-btn');
    if(!btn)return;
    btn.onclick=null;
    btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
  }
  initScrollTopBtn();
  updateScrollProgress();
});`;

export function base(pageTitle: string, content: string, pageDesc?: string) {
  const title = `${pageTitle} - ${site.title}`;
  const desc = pageDesc || site.description;
  const twitterUser = social.twitter.split("/").pop() || "";

  return `<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="author" content="${site.name}">
  <meta name="keywords" content="博客,技术,开发,${site.name},柚子社,编程,AI">
  <link rel="canonical" href="${site.url}">
  <link rel="alternate" type="application/rss+xml" title="${site.title}" href="${site.url}/rss.xml">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="${site.url}/sitemap.xml">
  <meta property="og:site_name" content="${site.title}">
  <meta property="og:url" content="${site.url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_CN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:creator" content="@${twitterUser}">
  <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon/avatar-round-32.png">
  <link rel="icon" type="image/png" sizes="128x128" href="/public/favicon/avatar-round.png">
  <link rel="shortcut icon" href="/public/favicon/favicon.ico">
  <link rel="apple-touch-icon" href="${site.avatar}">
  <style>${EMBEDDED_CSS}</style>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css">
  ${accentCSS()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=JetBrains+Mono:wght@400..600&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"${site.title}","url":"${site.url}","description":"${desc}","author":{"@type":"Person","name":"${site.name}"}}</script>
  <script>${themeScript}</script>
</head>
<body>
  <div class="loading-bar" id="loading-bar" aria-hidden="true"></div>
  ${nav()}
  <div class="home-layout">
    ${sidebar()}
    <main class="home-main">
      <div id="content-area">${content}</div>
    </main>
  </div>
  ${footer()}
  <script>${mainScript}</script>
  <script type="module" data-no-rerun>
    (function(){
      var overlay=document.createElement('div');
      overlay.className='lightbox-overlay';
      overlay.innerHTML='<div class="lightbox-toolbar"><button class="lightbox-btn" data-action="zoom-in" title="放大"><span class="material-symbols-rounded">zoom_in</span></button><button class="lightbox-btn" data-action="zoom-out" title="缩小"><span class="material-symbols-rounded">zoom_out</span></button><button class="lightbox-btn" data-action="rotate" title="旋转"><span class="material-symbols-rounded">rotate_right</span></button><button class="lightbox-btn" data-action="open" title="新标签页打开"><span class="material-symbols-rounded">open_in_new</span></button><button class="lightbox-btn" data-action="close" title="关闭"><span class="material-symbols-rounded">close</span></button></div><img class="lightbox-img" src="" alt="">';
      document.body.appendChild(overlay);

      var img=overlay.querySelector('.lightbox-img');
      var scale=1, rotate=0;

      function open(src) { img.src=src; scale=1; rotate=0; update(); overlay.classList.add('open'); document.body.style.overflow='hidden'; }
      function close() { overlay.classList.remove('open'); document.body.style.overflow=''; setTimeout(function(){img.src='';scale=1;rotate=0},300); }
      function update() { img.style.transform='scale('+scale+') rotate('+rotate+'deg)'; }

      overlay.addEventListener('click', function(e) {
        if(e.target===overlay) close();
        var btn=e.target.closest('[data-action]');
        if(!btn) return;
        var act=btn.getAttribute('data-action');
        if(act==='close') close();
        else if(act==='zoom-in') { scale=Math.min(scale*1.3,5); update(); }
        else if(act==='zoom-out') { scale=Math.max(scale/1.3,0.2); update(); }
        else if(act==='rotate') { rotate=(rotate+90)%360; update(); }
        else if(act==='open') { window.open(img.src,'_blank'); }
      });
      document.addEventListener('keydown', function(e) { if(e.key==='Escape') close(); });

      document.addEventListener('click', function(e) {
        var link=e.target.closest('[data-fancybox="gallery"]');
        if(!link) return;
        e.preventDefault();
        open(link.getAttribute('href'));
      });
    })();
  </script>
</body>
</html>`;
}

function nav() {
  return `<nav class="top-nav">
  <div class="flex items-center gap-3">
    <button id="sidebar-toggle-btn" class="sidebar-toggle-btn" aria-label="Sidebar">
      <span class="material-symbols-rounded">menu_open</span>
    </button>
    <a href="/" class="nav-brand">
      <img src="${site.avatar}" alt="" class="nav-avatar" width="30" height="30" loading="lazy">
      <span>${site.name}</span>
    </a>
  </div>
  <div id="nav-links" class="nav-links">
    <a href="/" class="nav-link">首页</a>
    <a href="/archive" class="nav-link">归档</a>
  </div>
  <div class="nav-right">
    <button class="theme-switch" title="Toggle theme" aria-label="Toggle theme">
      <span class="material-symbols-rounded icon-dark">dark_mode</span>
      <span class="material-symbols-rounded icon-light">light_mode</span>
    </button>
    <button id="hamburger" class="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;
}

export function footer() {
  return `<footer class="site-footer">
  Powered by <a href="https://bun.sh">Bun</a> + <a href="https://elysiajs.com">ElysiaJS</a> on <a href="https://vercel.com">Vercel</a>.
  &copy; ${new Date().getFullYear()} ${site.name}. <a href="/LICENSE">MIT</a> / <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>.
</footer>`;
}
