// ========== DAGAR INGENIERÍA ==========

// Cursor
const cp = document.getElementById('cursor-punto');
const cc = document.getElementById('cursor-circulo');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cp.style.left=mx+'px';cp.style.top=my+'px'});
function animCursor(){cx+=(mx-cx)*.15;cy+=(my-cy)*.15;cc.style.left=cx+'px';cc.style.top=cy+'px';requestAnimationFrame(animCursor)}
animCursor();
document.querySelectorAll('a,button,.disc-card,.proy-card,.cert-item,.ind-bloque').forEach(el=>{
  el.addEventListener('mouseenter',()=>cc.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cc.classList.remove('hover'));
});

// Pantalla de carga
const prog = document.getElementById('carga-progreso');
const cont = document.getElementById('carga-conteo');
const pant = document.getElementById('pantalla-carga');
let p=0;
const iv = setInterval(()=>{
  p += Math.random()*8+3;
  if(p>=100){p=100;clearInterval(iv);setTimeout(()=>pant.classList.add('oculto'),400)}
  prog.style.width=p+'%';
  cont.textContent=Math.floor(p)+'%';
},90);

// Partículas verdes en el hero
(function(){
  const cv = document.getElementById('particulas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let w,h,parts;
  const N = 70;
  function resize(){
    w = cv.width = cv.offsetWidth;
    h = cv.height = cv.offsetHeight;
  }
  function init(){
    parts = Array.from({length:N},()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4 - .15,
      r:Math.random()*2.2+.4,
      o:Math.random()*.5+.25,
      hue:Math.random()<.5?'108,180,44':'143,208,74'
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const p of parts){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<-10) p.y=h; if(p.y>h+10) p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue},${p.o})`;
      ctx.shadowColor = `rgba(${p.hue},.9)`;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  resize(); init(); tick();
  window.addEventListener('resize',()=>{resize();init()});
})();

// Nav siempre en estado "scroll" (frosted claro)
document.getElementById('nav').classList.add('scroll');

// Hero: animar palabra por palabra
(function(){
  const lineas = document.querySelectorAll('.hero-linea');
  let delay = 2400;
  lineas.forEach(linea=>{
    const palabras = linea.textContent.trim().split(/\s+/);
    linea.innerHTML = '';
    palabras.forEach(p=>{
      const s = document.createElement('span');
      s.className = 'hero-palabra';
      s.textContent = p;
      s.style.animationDelay = delay + 'ms';
      linea.appendChild(s);
      linea.appendChild(document.createTextNode(' '));
      delay += 180;
    });
    delay += 100;
  });
})();

// Storytelling: dividir titulares en frases y animar al entrar
document.querySelectorAll('.storytelling').forEach(el=>{
  const partes = [];
  const flush = (txt)=>{
    const t = txt.trim();
    if(!t) return;
    const s = document.createElement('span');
    s.className='frase';
    s.textContent = t;
    partes.push(s);
  };
  Array.from(el.childNodes).forEach(n=>{
    if(n.nodeType===3){
      const trozos = n.textContent.split(/(?<=[,.;])\s+/);
      trozos.forEach(flush);
    } else if(n.nodeType===1){
      if(n.tagName==='BR'){ partes.push(document.createElement('br')); return; }
      const s = document.createElement('span');
      s.className='frase';
      s.appendChild(n.cloneNode(true));
      partes.push(s);
    }
  });
  el.innerHTML='';
  partes.forEach((p,i)=>{
    el.appendChild(p);
    const next = partes[i+1];
    if(next && p.tagName!=='BR' && next.tagName!=='BR'){
      el.appendChild(document.createTextNode(' '));
    }
  });
});

const storyObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    storyObs.unobserve(e.target);
    e.target.classList.add('visible');
    e.target.querySelectorAll('.frase').forEach((f,i)=>{
      f.style.transitionDelay = (i*240)+'ms';
    });
  });
},{threshold:.25});
document.querySelectorAll('.storytelling').forEach(el=>storyObs.observe(el));

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('section > .cont-grande > *, .disc-card, .proy-card, .cert-item').forEach(el=>{
  el.classList.add('reveal');observer.observe(el);
});
