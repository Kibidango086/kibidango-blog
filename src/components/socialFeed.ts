import { site } from "../config";
import type { FeedItem } from "../utils/rss";

function feedItemHTML(item: FeedItem, i: number) {
  const img = item.image
    ? `<a href="${item.image}" data-fancybox="gallery" class="feed-thumb-link"><img src="${item.image}" class="feed-thumb" loading="lazy" alt=""></a>`
    : "";
  return `<div class="chat-msg chat-me reveal-feed" style="animation-delay:${i * 100}ms">
    <span class="chat-avatar">${item.source[0] || "R"}</span>
    <div>${img}<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="feed-link">${item.title}</a><span class="feed-meta">${item.date} · ${item.source}</span></div>
  </div>`;
}

export function socialFeed(items: FeedItem[]): string {
  const hasItems = items.length > 0;

  const bodyHTML =
    items.length === 0
      ? `<div class="chat-msg chat-me"><span class="chat-avatar">K</span><div>Ciallo～(∠・ω&lt; )⌒★</div></div>
         <div class="chat-thinking"><span>●●●</span> Loading...</div>`
      : items.map((item, i) => feedItemHTML(item, i)).join("");

  return `<div class="chat-window reveal d5" id="feed-window">
  <div class="chat-titlebar">
    <div class="chat-dots"><span></span><span></span><span></span></div>
    <span class="chat-title-text">${site.name}@social:~</span>
    <span class="chat-status">${hasItems ? "Live" : "Offline"}</span>
  </div>
  <div class="chat-body feed-body" id="feed-body">
    ${bodyHTML}
  </div>
  <div class="chat-inputbar">
    <div class="chat-input-fake">RSS 社交动态</div>
    <div class="chat-send-btn"><span class="material-symbols-rounded" style="font-size:16px">rss_feed</span></div>
  </div>
  <script>
    (function(){
      var body=document.getElementById('feed-body');
      var win=document.getElementById('feed-window');
      if(!body||!win)return;
      var status=win.querySelector('.chat-status');
      var input=win.querySelector('.chat-input-fake');
      fetch('/api/feed').then(function(r){return r.json()}).then(function(feed){
        if(feed&&feed.length){
          if(status)status.textContent='Live';
          body.innerHTML=feed.map(function(item,i){
            var img=item.image?'<a href="'+item.image+'" data-fancybox="gallery" class="feed-thumb-link"><img src="'+item.image+'" class="feed-thumb" loading="lazy"></a>':'';
            return '<div class="chat-msg chat-me reveal-feed" style="animation-delay:'+(i*100)+'ms"><span class="chat-avatar">'+(item.source[0]||'R')+'</span><div>'+img+'<a href="'+item.link+'" target="_blank" rel="noopener noreferrer" class="feed-link">'+item.title+'</a><span class="feed-meta">'+item.date+' · '+item.source+'</span></div></div>';
          }).join('');
        }else{
          if(status)status.textContent='Idle';
          if(input)input.textContent='RSS 源暂无数据，请检查 config.ts';
        }
      }).catch(function(){
        if(status)status.textContent='Error';
        if(input)input.textContent='RSS 获取失败，请检查 config.ts';
      });
    })();
  </script>
</div>`;
}
