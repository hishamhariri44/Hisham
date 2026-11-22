(() => {
'use strict';
const {projects,sources}=window.PORTFOLIO;
const collectionLabel=p=>p.id==='sac'?'DOCUMENTARY':p.category.toUpperCase();
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const smallScreen=matchMedia('(max-width:700px)');const reduced=matchMedia('(prefers-reduced-motion:reduce)');let previewsPaused=reduced.matches;
const categories=[
 {id:'humanitarian',title:'People, <em>first.</em>',text:'Everyday stories, humanitarian field films and documentary work. Close to people. Attentive to place.'},
 {id:'architecture',title:'Spaces with <em>character.</em>',text:'Architecture, interiors and the details that turn a building into a place.'},
 {id:'commercial',title:'Made to be <em>seen.</em>',text:'Brand films, product stories and short-form campaigns. Different briefs, a considered point of view.'},
 {id:'automotive',title:'Every detail. <em>In motion.</em>',text:'Car films that move between design, texture, technology and the view from the driver’s seat.'},
 {id:'ai',title:'Beyond <em>the lens.</em>',text:'AI-generated and AI-assisted product films. Imagined worlds, made for a real brief.'},
 {id:'creative',title:'Room to <em>play.</em>',text:'Personal favourites, characters and ideas that take a different turn.'}
];
const duration=v=>{const n=v.youtube?({'-ZeFhCWGIxo':85,'DZMvUkjhRtc':54,'wt_UoMIbKeo':121,'LEaqMk4unzk':115,'jWksGUH0g3c':238,'6C1ZuvsPQA8':176}[v.youtube]||0):sources[v.key]?.duration||0;return n?`${Math.floor(Math.round(n)/60).toString().padStart(2,'0')}:${(Math.round(n)%60).toString().padStart(2,'0')}`:'FILM'};
const youtubeCovers = new Set(["-ZeFhCWGIxo","6C1ZuvsPQA8","DZMvUkjhRtc","LEaqMk4unzk","Qh6nJUlGNYE","Zx1g2aSiicI","eQ4VNscCdOk","jWksGUH0g3c","wt_UoMIbKeo"]);
const youtubePoster = id => youtubeCovers.has(id) ? `posters/youtube/${id}.jpg` : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const localPoster = key => `posters/${key}.jpg?v=6`;
const poster = ({versions:[version]}) => version.youtube ? youtubePoster(version.youtube) : localPoster(version.key);
const previewKey = key => ({dar:'dar-teaser', cafe:'cafe-teaser'}[key] ?? key);
function previewVideo(key) {
  return `<video class="card-preview" data-loop="media/previews/${esc(previewKey(key))}.mp4?v=6" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>`;
}
function card(p, versionIndex=0, standalone=false, editorial=false) {
  const v = p.versions[versionIndex];
  const portrait = v.portrait ?? p.portrait;
  const title = standalone ? v.label : p.title;
  const cover = poster({...p, versions:[v]});
  const launch = `data-project="${esc(p.id)}" data-start-version="${versionIndex}" aria-label="Watch ${esc(title)}"`;
  const image = `<img src="${cover}" alt="" loading="${standalone?'eager':'lazy'}" decoding="async">`;
  const watchLabel = !standalone && p.versions.length > 1 ? `${p.versions.length} FILMS / EXPLORE` : 'WATCH FILM';
  const overlay = `<span class="launch-overlay"><span>${watchLabel}</span><b class="launch-circle" aria-hidden="true">▶</b></span>`;
  const media = v.youtube
    ? `<div class="youtube-preview" data-youtube-preview="${esc(v.youtube)}" data-title="${esc(title)}"><button class="project-launch youtube-cover" ${launch}>${image}${overlay}</button></div>`
    : `<button class="project-launch" ${launch}>${image}${previewVideo(v.key)}${overlay}</button>`;
  const caption = v.youtube ? `<button class="youtube-launch" ${launch}>${esc(title)} <span aria-hidden="true">▶</span></button>` : esc(title);
  return `<article class="film-card ${portrait?'format-portrait':'format-landscape'}${p.featured?' featured-film':''}${editorial?' editorial-card':''}">${media}<div class="card-copy"><div class="card-topline"><h4>${caption}</h4><span>${duration(v)}</span></div><p class="card-subtitle">${esc(standalone?'Al-Ihsan / Colour study':p.subtitle)}</p>${editorial?`<p class="card-description">${esc(p.description)}</p>`:''}</div></article>`;
}
const filmGrid=(list,layout='')=>`<div class="project-grid ${layout}">${list.map(p=>card(p,0,false,layout.includes('single-landscape'))).join('')}</div>`;
const collectionFilms=(category,list)=>{
 if(category==='humanitarian'){
  const everyday=list.find(p=>p.id==='everyday');
  const field=list.filter(p=>p.id.startsWith('ihsan-'));
  const sac=list.find(p=>p.id==='sac');
  return `<div class="collection-group"><h4 class="group-heading">Everyday, in Syria <span>THREE COLOUR STUDIES</span></h4><div class="project-grid portrait-trio">${everyday.versions.map((v,i)=>card(everyday,i,true)).join('')}</div></div><div class="collection-group"><h4 class="group-heading">Humanitarian field films <span>AL-IHSAN</span></h4>${filmGrid(field,'landscape-grid centered-last')}</div><div class="collection-group documentary-brand"><h4 class="group-heading">Documentary for brands <span>SAC / AGRICULTURE</span></h4>${filmGrid([sac],'landscape-grid single-landscape')}</div>`;
 }
 if(category==='commercial'){
  const featured=['learning-trade','stand'].map(id=>list.find(p=>p.id===id));
  return filmGrid(featured,'landscape-grid featured-grid')+filmGrid(list.filter(p=>!featured.includes(p)),'portrait-grid');
 }
 if(category==='architecture'||category==='ai'){
  const portrait=list.filter(p=>p.portrait).sort((a,b)=>Number(a.id==='ems')-Number(b.id==='ems')),wide=list.filter(p=>!p.portrait);
  return category==='ai'?filmGrid(wide,'landscape-grid single-landscape ai-wide')+filmGrid(portrait,'portrait-grid'):filmGrid(portrait,'portrait-trio')+filmGrid(wide,'landscape-grid single-landscape');
 }
 return filmGrid(list);
};
const aiFeature=`<div class="ai-editorial"><div><p class="overline">AI product films</p><h2>Real products.<br><em>Unreal worlds.</em></h2><p>Energy in green. Candy in full colour. Furniture imagined from original photography. Explore the collection edits and the individual projects below.</p><span class="ai-tag">AI-GENERATED & AI-ASSISTED VISUALS</span></div><div class="ai-reels"><div class="ai-reel"><video class="ai-loop" data-loop="media/ai-energy.mp4?v=6" poster="${localPoster('ai-energy')}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><button data-reel="ai-energy" aria-label="Play Energy, Imagined — AI drinks reel"><span><strong>Energy, imagined.</strong><small>WEPS × BAISUN / 00:24</small></span><b>↗</b></button></div><div class="ai-reel"><video class="ai-loop" data-loop="media/ai-candy.mp4?v=6" poster="${localPoster('ai-candy')}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><button data-reel="ai-candy" aria-label="Play A World of Flavour — AI candy reel"><span><strong>A world of flavour.</strong><small>BEBETO / 00:20</small></span><b>↗</b></button></div></div></div><div class="ai-originals-label"><span>Campaigns & experiments</span></div>`;
const creative=p=>`<div class="creative-feature"><button class="project-launch" data-project="${p.id}" aria-label="Watch ${esc(p.title)}"><img src="${poster(p)}" alt="A character in a doorway under red light" loading="lazy">${previewVideo(p.versions[0].key)}<span class="launch-overlay"><span>A PERSONAL FAVOURITE</span><b class="launch-circle" aria-hidden="true">▶</b></span></button><div class="creative-copy"><p class="overline">A LITTLE OUT OF THE ORDINARY</p><h2>Not every idea<br><em>plays it straight.</em></h2><p>${esc(p.description)}</p><button class="reel-trigger" data-project="${p.id}"><span class="play-icon">▶</span><span>Adham — Office Affairs<small>CREATIVE / 00:34</small></span></button></div></div>`;
document.querySelector('#film-collections').innerHTML=categories.map(c=>{const list=projects.filter(p=>p.category===c.id);return `<section class="film-collection wrap" data-collection="${c.id}" id="${c.id}" aria-label="${c.id} films">${c.id==='ai'?aiFeature:`<div class="collection-heading"><h3>${c.title}</h3><p>${c.text}</p></div>`}${c.id==='creative'?creative(list[0]):collectionFilms(c.id,list)}</section>`}).join('');
// Gracefully handle a blocked external thumbnail without displaying a broken image.
document.querySelectorAll('.project-launch img').forEach(img=>img.addEventListener('error',()=>{if(!img.dataset.fallback){img.dataset.fallback='true';img.src='assets/cafe.jpg'}}));
const filterButtons = document.querySelectorAll('[data-category]');
const collections = [...document.querySelectorAll('[data-collection]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', selected);
  });
  collections.forEach(section => {
    section.hidden = button.dataset.category !== 'all' && button.dataset.category !== section.dataset.collection;
  });
  const first = collections.find(section => !section.hidden);
  const filterBottom = document.querySelector('.work-controls').getBoundingClientRect().bottom;
  if (first && first.getBoundingClientRect().top < filterBottom - 2) first.scrollIntoView({block:'start'});
}));

const dialog=document.querySelector('#film-dialog'),player=document.querySelector('#player-container'),versionList=document.querySelector('#version-list');let currentProject=null,lastFocus=null;
const reels={showreel:{title:'A personal perspective',description:'A balanced selection of documentary, architecture, commercial, automotive, AI and creative work.',client:'Hisham Hariri / Selected work',category:'Showreel',key:smallScreen.matches?'showreel-mobile':'showreel',portrait:smallScreen.matches},'ai-energy':{title:'Energy, imagined.',description:'A colour-led edit of WEPS and Baisun product films. Green laboratories and athletic motion give way to neon-blue product worlds.',client:'Made for Alkhalaf',category:'AI collection reel',key:'ai-energy',portrait:true},'ai-candy':{title:'A world of flavour.',description:'Candy worlds, gummy races and cola imagery from the Bebeto series, brought together in one short collection edit.',client:'Made for Alkhalaf',category:'AI collection reel',key:'ai-candy',portrait:true}};
function stopPlayer(){player.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});player.replaceChildren()}
function pauseBackgrounds(){document.querySelectorAll('.hero-film,.ai-loop,.card-preview').forEach(v=>v.pause()); stopYouTubePreview()}
function prepareDialog(){lastFocus=document.activeElement;pauseBackgrounds();document.body.classList.add('body-dialog');if(!dialog.open)dialog.showModal()}
function setPlayer(version){stopPlayer();const external=document.querySelector('#external-film');external.hidden=true;player.classList.remove('portrait');
 if(version.youtube){const id=version.youtube;player.classList.toggle('portrait',version.portrait??false);player.innerHTML=`<div class="youtube-shell"><img src="${youtubePoster(id)}" alt=""><div><p>Watch the complete film.</p><button id="load-youtube">Play on this page ▶</button><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Or open on YouTube ↗</a></div></div>`;external.href=`https://www.youtube.com/watch?v=${id}`;external.hidden=false;document.querySelector('#load-youtube').addEventListener('click',()=>{const iframe=document.createElement('iframe');iframe.title=document.querySelector('#film-title').textContent;iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;player.replaceChildren(iframe)});return}
 const info=sources[version.key];player.classList.toggle('portrait',version.portrait??info?.portrait??true);const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.poster=localPoster(version.key);const mediaKey=version.key==='showreel'?'hero-desktop':version.key==='showreel-mobile'?'hero-mobile':version.key;video.src=version.mediaUrl??`media/${mediaKey}.mp4${version.isReel?'?v=6':''}`;video.setAttribute('aria-label',document.querySelector('#film-title').textContent);if(version.isReel){video.muted=true;video.loop=true}video.addEventListener('error',()=>{const p=document.createElement('p');p.className='playback-error';p.textContent='This film could not load. Please try reopening it.';player.append(p)});player.append(video);video.play().catch(()=>{});
}
function openProject(id,startIndex=0){const p=projects.find(p=>p.id===id);if(!p)return;startIndex=Math.max(0,Math.min(startIndex,p.versions.length-1));currentProject=p;document.querySelector('#film-title').textContent=p.title;document.querySelector('#film-description').textContent=p.description;document.querySelector('#film-client').textContent=p.client;document.querySelector('#film-category').textContent=`${collectionLabel(p)} / ${p.versions.length>1?p.versions.length+' FILMS':'SELECTED FILM'}`;document.querySelector('#film-credit').textContent=p.id==='stand'?'Video editing — Hisham Hariri':'A film by Hisham Hariri';versionList.innerHTML=p.versions.length>1?p.versions.map((v,i)=>`<button class="${i===startIndex?'active':''}" data-version="${i}" aria-pressed="${i===startIndex}">${esc(v.label)}</button>`).join(''):'';versionList.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{versionList.querySelectorAll('button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});setPlayer(p.versions[Number(b.dataset.version)])}));prepareDialog();setPlayer(p.versions[startIndex])}
function openReel(id){const p={...reels[id]};if(id==='showreel'){p.key=smallScreen.matches?'showreel-mobile':'showreel';p.portrait=smallScreen.matches}document.querySelector('#film-title').textContent=p.title;document.querySelector('#film-description').textContent=p.description;document.querySelector('#film-client').textContent=p.client;document.querySelector('#film-category').textContent=p.category.toUpperCase();document.querySelector('#film-credit').innerHTML='Hisham Hariri<span class="reel-note">Silent website edit. Full project films retain their original audio.</span>';versionList.replaceChildren();prepareDialog();setPlayer({...p,isReel:true})}
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project,Number(b.dataset.startVersion||0))));
document.querySelectorAll('[data-reel]').forEach(b=>b.addEventListener('click',()=>openReel(b.dataset.reel)));
dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{stopPlayer();document.body.classList.remove('body-dialog');lastFocus?.focus();resumeVisible()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

const photos=[['citadel','Citadel under the stars','Night skies','Star trails above illuminated stone walls.'],['girl','A quiet gaze','People','A close portrait in soft light.'],['cafe','An ordinary afternoon','People','An everyday scene inside a café, lit by tall windows.'],['milkyway','The Milky Way','Night skies','Stars and dark dust lanes across the Milky Way.'],['craft','Hands at work','People','A craftsman shaping glowing metal as sparks fly.'],['street','Streets and traces','Places','Stone façades and a winding street.'],['ihsan20','A moment of warmth','People','A smiling woman in purple against a textured wall.'],['field','Across the field','Places','A tractor crossing a field, leaving a trail of dust.'],['chair','What remains','Places','An old street sign resting on a wooden chair.'],['ihsan21','In the light','People','A young girl holding two bottles in warm light.'],['road','Along the way','Places','Road signs framed by trees.']];
document.querySelector('#photo-grid').innerHTML=photos.map((p,i)=>`<button class="photo-card" data-photo="${i}" data-type="${p[2]}" aria-label="View ${p[1]}"><img src="assets/${p[0]}.jpg" alt="${p[3]}" loading="lazy" decoding="async"><span>${p[1]}<small>${p[2]} ↗</small></span></button>`).join('');
const photoDialog=document.querySelector('#photo-dialog');let currentPhoto=0,photoFocus=null;
function showPhoto(i){currentPhoto=(i+photos.length)%photos.length;const p=photos[currentPhoto];document.querySelector('#photo-image').src=`assets/${p[0]}.jpg`;document.querySelector('#photo-image').alt=p[3];document.querySelector('#photo-title').textContent=p[1];document.querySelector('#photo-category').textContent=p[2].toUpperCase();document.querySelector('#photo-counter').textContent=`${currentPhoto+1} / ${photos.length}`}
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{photoFocus=b;showPhoto(Number(b.dataset.photo));pauseBackgrounds();document.body.classList.add('body-dialog');photoDialog.showModal()}));document.querySelectorAll('[data-photo-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-photo-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});document.querySelectorAll('.photo-card').forEach(x=>x.hidden=b.dataset.photoFilter!=='all'&&x.dataset.type!==b.dataset.photoFilter)}));
photoDialog.querySelector('.photo-close').addEventListener('click',()=>photoDialog.close());document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(currentPhoto-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(currentPhoto+1));photoDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(currentPhoto+1);if(e.key==='ArrowLeft')showPhoto(currentPhoto-1)});photoDialog.addEventListener('close',()=>{document.body.classList.remove('body-dialog');photoFocus?.focus();resumeVisible()});

const hero=document.querySelector('#hero-film'),heroControl=document.querySelector('#hero-toggle');let heroUserPaused=reduced.matches;
function setHeroSource(){hero.src=smallScreen.matches?'media/hero-mobile.mp4?v=6':'media/hero-desktop.mp4?v=6';hero.poster=localPoster(smallScreen.matches?'showreel-mobile':'showreel');resumeVisible();}
function heroLabel(){heroControl.innerHTML=hero.paused?'▶ <span>Play</span>':'Ⅱ <span>Pause</span>';heroControl.setAttribute('aria-label',hero.paused?'Play background film':'Pause background film')}
heroControl.addEventListener('click',()=>{heroUserPaused=!hero.paused;if(hero.paused)hero.play().catch(()=>{});else hero.pause()});hero.addEventListener('play',heroLabel);hero.addEventListener('pause',heroLabel);hero.addEventListener('error',()=>{heroControl.hidden=true});smallScreen.addEventListener('change',setHeroSource);heroLabel();
const chapters = ['EVERYDAY STORIES','SPACES WITH CHARACTER','FROM THE FIELD','DESIGN IN MOTION','PHOTOGRAPHY MEETS AI','ENERGY, IMAGINED','LIFE IN THE DETAILS','A SENSE OF PLACE','A WORLD OF FLAVOUR','PEOPLE & THEIR WORK','ROOM TO PLAY','A PERSONAL PERSPECTIVE'];
const heroChapter = document.querySelector('#hero-chapter');
let chapterIndex = 0;
hero.addEventListener('timeupdate', () => {
  const nextIndex = Math.min(chapters.length - 1, Math.floor(hero.currentTime / 3));
  if (nextIndex === chapterIndex) return;
  chapterIndex = nextIndex;
  heroChapter.textContent = `${String(chapterIndex + 1).padStart(2,'0')} / ${chapters[chapterIndex]}`;
  if (!reduced.matches) {
    heroChapter.animate([{opacity:.18,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}], {duration:1150,easing:'ease-out'});
  }
});
const previewToggle = document.querySelector('#preview-toggle');
const loops = document.querySelectorAll('.hero-film,.ai-loop,.card-preview');
const youtubeCards = [...document.querySelectorAll('[data-youtube-preview]')];
const visibleLoops = new Set();
const visibleYouTube = new Set();
const unavailableYouTube = new WeakSet();
const youtubePositions = new WeakMap();
let activeYouTube = null;
let youtubeAPI;

function backgroundsAllowed() {
  return !document.hidden && !dialog.open && !photoDialog.open;
}

function getYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  youtubeAPI ??= new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    const timeout = setTimeout(() => resolve(null), 8000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve(window.YT);
    };
    script.addEventListener('error', () => {
      clearTimeout(timeout);
      resolve(null);
    }, {once:true});
    document.head.append(script);
  });
  return youtubeAPI;
}

function stopYouTubePreview(completed = false) {
  if (!activeYouTube) return;
  const {element, frame, player, timeout, started} = activeYouTube;
  activeYouTube = null;
  clearTimeout(timeout);
  if (completed) youtubePositions.delete(element);
  else if (started) {
    const position = player.getCurrentTime();
    if (Number.isFinite(position)) youtubePositions.set(element, position);
  }
  element.classList.remove('preview-playing');
  player?.destroy();
  frame?.remove();
}

async function startYouTubePreview(element) {
  const playback = {element};
  activeYouTube = playback;
  const api = await getYouTubeAPI();
  if (activeYouTube !== playback) return;
  const fail = () => {
    if (activeYouTube !== playback) return;
    unavailableYouTube.add(element);
    stopYouTubePreview();
    syncYouTube();
  };
  if (!api) {
    fail();
    return;
  }
  const id = element.dataset.youtubePreview;
  const frame = document.createElement('iframe');
  const options = new URLSearchParams({enablejsapi:'1', origin:location.origin, playsinline:'1', rel:'0'});
  const position = Math.floor(youtubePositions.get(element) ?? 0);
  if (position > 0) options.set('start', String(position));
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?${options}`;
  frame.title = `${element.dataset.title} preview`;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.tabIndex = -1;
  element.append(frame);
  playback.frame = frame;
  playback.timeout = setTimeout(fail, 12000);
  try {
    playback.player = new api.Player(frame, {events:{
      onReady: ({target}) => {
        if (activeYouTube !== playback) return;
        target.mute();
        target.playVideo();
      },
      onStateChange: ({data}) => {
        if (activeYouTube !== playback) return;
        if (data === api.PlayerState.PLAYING) {
          clearTimeout(playback.timeout);
          playback.started = true;
          element.classList.add('preview-playing');
        } else if (data === api.PlayerState.ENDED) {
          const cards = eligibleYouTubeCards();
          const next = cards[(cards.indexOf(element) + 1) % cards.length];
          stopYouTubePreview(true);
          if (next) startYouTubePreview(next);
        }
      },
      onError: fail,
      onAutoplayBlocked: fail
    }});
  } catch {
    fail();
  }
}

function eligibleYouTubeCards() {
  return youtubeCards.filter(element => visibleYouTube.has(element) && !unavailableYouTube.has(element));
}

function syncYouTube() {
  const enabled = backgroundsAllowed() && !previewsPaused && /^https?:$/.test(location.protocol);
  if (activeYouTube && enabled && visibleYouTube.has(activeYouTube.element)) return;
  stopYouTubePreview();
  if (!enabled) return;
  const [next] = eligibleYouTubeCards();
  if (next) startYouTubePreview(next);
}

function resumeVisible() {
  const allowed = backgroundsAllowed();
  loops.forEach(video => {
    if (!allowed || !visibleLoops.has(video) || (video === hero ? heroUserPaused : previewsPaused)) {
      if (!video.paused) video.pause();
      return;
    }
    if (video.dataset.loop && !video.hasAttribute('src')) video.src = video.dataset.loop;
    if (video.paused && !video.error) video.play().catch(() => {});
  });
  syncYouTube();
}

document.querySelectorAll('.card-preview').forEach(video => {
  video.addEventListener('playing', () => video.classList.add('preview-playing'));
  video.addEventListener('error', () => video.classList.remove('preview-playing'));
});

function updatePreviewControl() {
  previewToggle.textContent = previewsPaused ? 'Play previews' : 'Pause previews';
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const {target, intersectionRatio} of entries) {
      const isYouTube = target.hasAttribute('data-youtube-preview');
      const visible = isYouTube ? visibleYouTube : visibleLoops;
      if (intersectionRatio >= (isYouTube ? .55 : .2)) visible.add(target);
      else visible.delete(target);
    }
    resumeVisible();
  }, {threshold:[.2,.55]});
  loops.forEach(video => observer.observe(video));
  youtubeCards.forEach(element => observer.observe(element));

  const reveal = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      target.classList.add('motion-enter');
      reveal.unobserve(target);
    }
  }, {threshold:.12});
  document.querySelector('.introduction')?.classList.add('has-intro-motion');
  document.querySelectorAll('.intro-reveal,.collection-heading,.ai-editorial,.film-card,.creative-feature,.photo-card,.photo-intro,.about-photo,.about-copy h2,.contact-title').forEach(element => reveal.observe(element));
  previewToggle.hidden = false;
} else {
  visibleLoops.add(hero);
}

previewToggle.addEventListener('click', () => {
  previewsPaused = !previewsPaused;
  if (previewsPaused) document.querySelectorAll('.card-preview').forEach(video => video.classList.remove('preview-playing'));
  updatePreviewControl();
  resumeVisible();
});
document.addEventListener('visibilitychange', resumeVisible);
reduced.addEventListener('change', () => {
  heroUserPaused = reduced.matches;
  previewsPaused = reduced.matches;
  updatePreviewControl();
  resumeVisible();
});
updatePreviewControl();
setHeroSource();
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('#mobile-nav');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',!expanded);mobileNav.hidden=expanded;menu.setAttribute('aria-label',expanded?'Open navigation':'Close navigation')});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}));document.querySelector('#year').textContent=new Date().getFullYear();
})();
