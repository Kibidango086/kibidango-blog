import { formatDate } from "../utils/helpers";
import type { Post } from "../utils/posts";

function dnaScript(): string {
  return `<script type="module">
(function(){
var dna=document.getElementById('dna-helix');
if(!dna)return;
var COUNT=25,SPACING=24,RADIUS=20,SPEED=0.3,time=0,rungs=[],running=true,frame=0;
for(var i=0;i<COUNT;i++){
  var rung=document.createElement('div');rung.className='rung';
  var left=document.createElement('div');left.className='base left';
  var right=document.createElement('div');right.className='base right';
  var link=document.createElement('div');link.className='link';
  rung.appendChild(link);rung.appendChild(left);rung.appendChild(right);
  dna.appendChild(rung);
  rungs.push({el:rung,left,right,link,offset:i*SPACING});
}
dna.style.width=(RADIUS*2+20)+'px';
function animate(){
  if(!running)return;
  time+=SPEED;
  frame++;
  var total=COUNT*SPACING;
  var skip=frame%2===0;
  for(var j=0;j<COUNT;j++){
    var item=rungs[j];
    var y=(item.offset+time)%total;
    var angle=y*0.08;
    var x=Math.sin(angle)*RADIUS;
    var z=Math.cos(angle);
    var scale=0.6+(z+1)*0.25;
    var op=0.2+(z+1)*0.35;
    if(skip){
      item.left.style.opacity=op;
      item.right.style.opacity=op;
      item.link.style.opacity=op*0.6;
      continue;
    }
    item.el.style.top=(y-SPACING)+'px';
    item.left.style.left=(-x)+'px';
    item.right.style.left=x+'px';
    item.left.style.transform='translateY(-50%) scale('+scale+')';
    item.right.style.transform='translateY(-50%) scale('+scale+')';
    item.link.style.left=(-x)+'px';
    item.link.style.width=(x*2)+'px';
    item.el.style.zIndex=Math.floor((z+1)*50);
  }
  requestAnimationFrame(animate);
}
animate();
document.addEventListener('visibilitychange',function(){running=!document.hidden;if(running)animate();});
})();
</script>`;
}

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
  <div class="timeline">
    <div id="dna-helix"></div>
    ${items}
  </div>
  ${dnaScript()}`;
}
