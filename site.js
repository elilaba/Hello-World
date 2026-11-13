// Shared by every page. Content lives in projects.json.
(function(){
var page=document.body.dataset.page,reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,
$=function(i){return document.getElementById(i)},
G=["radial-gradient(50% 80% at 25% 55%,#d8b27a,transparent 60%),linear-gradient(120deg,#16242b,#38535a 60%,#6b7d78)","radial-gradient(45% 70% at 70% 30%,#7fb3c8,transparent 65%),linear-gradient(160deg,#0b1620,#1d3a4c)","radial-gradient(40% 60% at 50% 70%,#c4607e,transparent 65%),linear-gradient(180deg,#140c1c,#2c1a38)","radial-gradient(60% 60% at 30% 30%,#e8d5a8,transparent 60%),linear-gradient(140deg,#3a5568,#8aa0ac)"];
function el(t,x,c){var e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;return e}
function link(t,h,c){var a=el("a",t,c);a.href=h;return a}
function bg(f,src,i){f.style.backgroundImage=G[i%G.length];if(!src)return;var m=new Image();m.onload=function(){f.style.backgroundImage="url('"+src+"')"};m.src=src}
function embed(u){if(!u)return null;var m=u.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-f0-9]+))?/i);if(m)return"https://player.vimeo.com/video/"+m[1]+"?dnt=1"+(m[2]?"&h="+m[2]:"");m=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);return m?"https://www.youtube-nocookie.com/embed/"+m[1]+"?rel=0":null}
function reel(box,u){var s=embed(u);if(s){var f=el("iframe");f.src=s;f.title="Demo reel";f.loading="lazy";f.allow="autoplay; fullscreen; picture-in-picture";f.allowFullscreen=true;box.append(f);return}
var p=u?link("",u,"ph"):el("div","","ph");if(u){p.target="_blank";p.rel="noopener"}p.append(el("span","","play"),el("span",u?"Watch the demo reel":"Demo reel coming soon"));box.append(p)}
function reveal(){var n=document.querySelectorAll(".reveal");if(reduced||!window.IntersectionObserver){n.forEach(function(x){x.classList.add("in")});return}
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");o.unobserve(e.target)}})},{rootMargin:"0px 0px -12% 0px",threshold:.05});n.forEach(function(x){o.observe(x)})}
function chrome(name){var n=$("nav"),w=el("div","","in"),l=el("div","","links");
[["Work","index.html#work"],["About","about.html"],["Contact","contact.html"]].forEach(function(x){var a=link(x[0],x[1]);if(location.pathname.slice(-x[1].length)===x[1])a.setAttribute("aria-current","page");l.append(a)});
w.append(link(name,"index.html","me"),l);n.append(w);n.classList.add("show");
$("foot").textContent="© "+new Date().getFullYear()+" "+name}
function home(d){var s=d.site,o=$("top"),r=$("reel"),n=$("nav"),t=0;
$("name").textContent=s.name;$("role").textContent=s.role;reel(r,s.reel);
var g=$("grid");d.projects.forEach(function(p,i){var a=link("","project.html?p="+p.slug,"reveal"+(p.wide?" wide":"")),f=el("div","","frame");
f.style.aspectRatio=(p.ar||1.78)+" / 1";f.setAttribute("role","img");f.setAttribute("aria-label","Still from "+p.title);bg(f,p.image,i);
var h=el("h3",p.title+" ");h.append(el("span",p.year||""));a.append(f,h,el("p",p.role||"","meta"));g.append(a)});
function up(){t=0;var b=r.getBoundingClientRect().bottom,v=innerHeight,s0=v*.55,e0=v*.05;
var k=reduced?(b<e0?1:0):Math.min(1,Math.max(0,(s0-b)/(s0-e0)));if(!reduced)o.style.opacity=1-k;o.style.visibility=k>=1&&!reduced?"hidden":"visible";n.classList.toggle("scrolled",k>.5)}
addEventListener("scroll",function(){if(!t){t=1;requestAnimationFrame(up)}},{passive:true});addEventListener("resize",up);up()}
function project(d){var q=new URLSearchParams(location.search).get("p"),L=d.projects,i=L.findIndex(function(p){return p.slug===q}),b=$("pj");
if(i<0){b.append(el("h1","Project not found","pg"),link("Back to selected work","index.html#work"));return}
var p=L[i];document.title=p.title+" — "+d.site.name;b.append(el("h1",p.title,"pg"));
var m=el("p","","meta2");[p.year,p.role,p.tech].forEach(function(x){if(x)m.append(el("span",String(x)))});b.append(m);
if(p.description)b.append(el("p",p.description,"desc"));
var s=el("div","","stills");(p.stills||[]).forEach(function(src,k){var f=el("div","","frame reveal");f.style.aspectRatio=(p.ar||1.78)+" / 1";f.setAttribute("role","img");f.setAttribute("aria-label",p.title+", still "+(k+1));bg(f,src,i+k);s.append(f)});b.append(s);
var n=el("div","","pn");n.append(link("Previous: "+L[(i+L.length-1)%L.length].title,"project.html?p="+L[(i+L.length-1)%L.length].slug),link("Next: "+L[(i+1)%L.length].title,"project.html?p="+L[(i+1)%L.length].slug));b.append(n)}
function about(d){var s=d.site;$("intro").textContent=s.intro;s.about.forEach(function(t){$("txt").append(el("p",t))})}
function contact(d){var s=d.site,e=$("email"),m=$("imdb");e.textContent=s.email;e.href="mailto:"+s.email;m.textContent="IMDb";m.href=s.imdb}
fetch("projects.json").then(function(r){return r.json()}).then(function(d){chrome(d.site.name);({home:home,project:project,about:about,contact:contact})[page](d);reveal()})
.catch(function(){var m=document.querySelector("main")||document.body;m.append(el("p","Could not load projects.json. Check that it is in the same folder as the pages and is valid JSON."))});
})();
