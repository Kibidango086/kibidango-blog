export function notFoundPage() {
  return `<div class="notfound-page">
  <div class="notfound-orb"></div>
  <div class="notfound-content reveal d1">
    <span class="notfound-code">4</span>
    <span class="notfound-code notfound-code-accent">0</span>
    <span class="notfound-code">4</span>
  </div>
  <p class="notfound-sub reveal d2">这片区域什么也没有……</p>
  <p class="notfound-hint reveal d3">可能页面已被移除，或是你输错了地址</p>
  <a href="/" class="btn-primary notfound-btn reveal d4">
    <span class="material-symbols-rounded" style="font-size:20px">home</span>
    <span>返回首页</span>
  </a>
</div>`;
}
