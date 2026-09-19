const heroData = [
  { title: "Coordinación y ejecución", meta: "Construcción · Interiores" },
  { title: "Casa de descanso en la playa", meta: "Puerto de San José · 700 m²" },
  { title: "Urbanización Villas del Tejar", meta: "Chimaltenango · 50 lotes" },
  { title: "Rotulación e identidad", meta: "Comercial · Señalización" }
];


const toThumb = path => path.replace("assets/", "assets/thumbs/");
const toMobile = path => path.replace("assets/", "assets/mobile/");
const isMobileViewport = () => window.matchMedia("(max-width: 820px)").matches;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const constrainedConnection = Boolean(connection?.saveData || /(^|-)2g$|3g/.test(connection?.effectiveType || ""));
const HERO_PRELOAD_DELAY = constrainedConnection ? 3800 : 1800;

const projects = [
  {
    title: "Urbanización Villas del Tejar",
    category: "urbanismo",
    categoryLabel: "Urbanismo",
    image: "assets/gdu-proyecto-villas-tejar.webp",
    width: 1439, height: 1088,
    short: "Planificación y ejecución de una urbanización de 50 lotes residenciales.",
    text: "Proyecto de urbanización con planificación y ejecución de obra, movimiento de tierra e implementación de sistemas de drenajes y electricidad.",
    location: "Chimaltenango",
    area: "50 lotes residenciales",
    scope: "Planificación, obra, movimiento de tierra, drenajes y electricidad.",
    role: "Planificación y ejecución de obra.",
    meta: ["Urbanismo", "Drenajes", "Electricidad"],
    layout: "wide"
  },
  {
    title: "Centro de Conveniencia Real",
    category: "comercial",
    categoryLabel: "Infraestructura comercial",
    image: "assets/gdu-proyecto-centro-conveniencia-01.webp",
    width: 808, height: 608,
    short: "Desarrollo integral de 1,500 m² y 16 locales comerciales.",
    text: "Desarrollo integral de locales comerciales con calles, drenajes, bordillos e instalaciones hidráulicas y eléctricas sobre el Boulevard principal de San Cristóbal.",
    location: "Villa San Cristóbal, Mixco",
    area: "1,500 m² · 16 locales",
    scope: "Locales comerciales, calles, drenajes, bordillos e instalaciones hidráulicas y eléctricas.",
    role: "Desarrollo integral y ejecución.",
    meta: ["Comercial", "Infraestructura", "Instalaciones"],
    layout: "wide"
  },
  {
    title: "Condominio Real Villa",
    category: "residencial",
    categoryLabel: "Residencial",
    image: "assets/gdu-proyecto-condominio-real-villa.webp",
    width: 1440, height: 1077,
    short: "Proyecto habitacional de 40 casas desde planificación hasta ejecución completa.",
    text: "Proyecto habitacional desarrollado bajo un modelo constructivo eficiente y estandarizado, priorizando diseño, funcionalidad de los ambientes y calidad constructiva.",
    location: "San Cristóbal, Mixco",
    area: "40 casas",
    scope: "Planificación, ejecución completa y estandarización constructiva.",
    role: "Desarrollo habitacional integral.",
    meta: ["Residencial", "Construcción", "Vivienda"]
  },
  {
    title: "Casa de descanso en la playa",
    category: "residencial",
    categoryLabel: "Residencial",
    image: "assets/gdu-proyecto-casa-playa.webp",
    width: 1440, height: 1080,
    short: "Desarrollo residencial de alto nivel con 700 m² de construcción.",
    text: "Residencia bajo un concepto arquitectónico mediterráneo, con espacios de doble altura, amplitud y luz natural. La obra se ejecutó desde la planificación hasta los acabados, incorporando áreas sociales y piscina con cascada.",
    location: "Puerto de San José, Escuintla",
    area: "700 m²",
    scope: "Planificación, construcción, acabados, áreas sociales y piscina.",
    role: "Obra completa desde planificación hasta acabados.",
    meta: ["Residencial", "Acabados", "Obra completa"],
    layout: "wide"
  },
  {
    title: "Jardinización de exteriores DIGA-USAC",
    category: "institucional",
    categoryLabel: "Institucional",
    image: "assets/gdu-proyecto-diga-usac.webp",
    width: 1152, height: 864,
    short: "Intervención de áreas exteriores y paisajismo institucional.",
    text: "Proyecto de jardinización de exteriores realizado para DIGA-USAC, integrando vegetación y elementos de paisaje en áreas de circulación.",
    scope: "Jardinización y adecuación de exteriores.",
    role: "Paisajismo y ejecución exterior.",
    meta: ["DIGA-USAC", "Jardinización", "Exterior"]
  },
  {
    title: "Rectoría USAC · Mesa de reuniones",
    category: "institucional",
    categoryLabel: "Institucional",
    image: "assets/gdu-proyecto-rectoria-usac.webp",
    width: 1280, height: 959,
    short: "Mobiliario y adecuación interior para espacio de reuniones.",
    text: "Proyecto de mesa de reuniones y adecuación interior presentado dentro del portafolio institucional de Grupo de Desarrollo Urbano.",
    scope: "Mesa de reuniones, mobiliario y adecuación interior.",
    role: "Carpintería y acabados interiores.",
    meta: ["Rectoría USAC", "Carpintería", "Interiores"]
  },
  {
    title: "Instalaciones eléctricas y técnicas",
    category: "especialidades",
    categoryLabel: "Electricidad",
    image: "assets/gdu-electricidad-02.webp",
    width: 800, height: 1600,
    short: "Canalización, cableado e integración de instalaciones en obra.",
    text: "Trabajos de instalación eléctrica y coordinación técnica durante procesos de adecuación y construcción interior.",
    scope: "Canalización, cableado e integración con cielos y muros.",
    role: "Ejecución de instalaciones técnicas.",
    meta: ["Electricidad", "Instalaciones", "Obra"],
    layout: "tall"
  },
  {
    title: "Tabla yeso y cielos interiores",
    category: "especialidades",
    categoryLabel: "Tabla yeso",
    image: "assets/gdu-tablayeso-01.webp",
    width: 1600, height: 900,
    short: "Cielos, detalles y acabados interiores en sistemas livianos.",
    text: "Ejecución de soluciones en tabla yeso para cielos, detalles arquitectónicos, iluminación e integración de acabados.",
    scope: "Cielos, divisiones, detalles arquitectónicos y acabados.",
    role: "Instalación y terminación de tabla yeso.",
    meta: ["Tabla yeso", "Cielos", "Acabados"]
  },
  {
    title: "Carpintería y mobiliario a medida",
    category: "especialidades",
    categoryLabel: "Carpintería",
    image: "assets/gdu-carpinteria-03.webp",
    width: 1200, height: 1600,
    short: "Mobiliario, revestimientos y soluciones de madera para interiores.",
    text: "Proyectos de carpintería para espacios residenciales y corporativos, incluyendo muebles, revestimientos, cocinas y elementos fabricados a medida.",
    scope: "Mobiliario, revestimientos, cocinas y piezas a medida.",
    role: "Fabricación e instalación de carpintería.",
    meta: ["Carpintería", "Mobiliario", "Acabados"]
  },
  {
    title: "Rotulación comercial y señalización",
    category: "comercial",
    categoryLabel: "Rotulación",
    image: "assets/gdu-rotulacion-05.webp",
    width: 864, height: 1152,
    short: "Letras corpóreas, rótulos luminosos, señalización e identidad visual.",
    text: "Fabricación e instalación de soluciones de rotulación para fachadas, comercios, señalización y comunicación visual.",
    scope: "Letras corpóreas, rótulos luminosos y señalización.",
    role: "Fabricación e instalación de rotulación.",
    meta: ["Rotulación", "Señalización", "Fachada"],
    layout: "tall"
  }
];

// HERO CAROUSEL: 4 imágenes, primera prioritaria y siguientes cargadas bajo demanda.
const slides = [...document.querySelectorAll(".hero-slide")];
const heroTitle = document.getElementById("heroProjectTitle");
const heroMeta = document.getElementById("heroProjectMeta");
const heroDots = document.getElementById("heroDots");
const heroProgressBar = document.getElementById("heroProgressBar");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
let heroIndex = 0;
let heroTimer;
const HERO_DELAY = 5000;

function ensureSlideLoaded(index){
  const slide = slides[(index + slides.length) % slides.length];
  const img = slide?.querySelector("img[data-src]");
  if(img){
    if(img.dataset.srcset) img.srcset = img.dataset.srcset;
    if(img.dataset.sizes) img.sizes = img.dataset.sizes;
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
    img.removeAttribute("data-srcset");
    img.removeAttribute("data-sizes");
  }
}

function buildHeroDots(){
  if(!heroDots) return;
  heroDots.innerHTML = slides.map((_,i)=>`<button class="hero-dot ${i===0?"active":""}" aria-label="Ir a imagen ${i+1}" data-hero-index="${i}"></button>`).join("");
  heroDots.querySelectorAll(".hero-dot").forEach(dot=>dot.addEventListener("click",()=>goToHero(Number(dot.dataset.heroIndex), true)));
}

function restartHeroProgress(){
  if(!heroProgressBar) return;
  heroProgressBar.classList.remove("animate");
  void heroProgressBar.offsetWidth;
  heroProgressBar.classList.add("animate");
}

function goToHero(index, resetTimer=false){
  if(!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  ensureSlideLoaded(heroIndex);
  slides.forEach((slide,i)=>slide.classList.toggle("active",i===heroIndex));
  document.querySelectorAll(".hero-dot").forEach((dot,i)=>dot.classList.toggle("active",i===heroIndex));
  if(heroTitle) heroTitle.textContent = heroData[heroIndex]?.title || "Proyecto";
  if(heroMeta) heroMeta.textContent = heroData[heroIndex]?.meta || "";
  restartHeroProgress();
  window.setTimeout(()=>ensureSlideLoaded(heroIndex+1), HERO_PRELOAD_DELAY);
  if(resetTimer) startHeroTimer();
}

function startHeroTimer(){
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>goToHero(heroIndex+1), HERO_DELAY);
}

buildHeroDots();
goToHero(0);
window.setTimeout(()=>ensureSlideLoaded(1), HERO_PRELOAD_DELAY);
startHeroTimer();
heroPrev?.addEventListener("click",()=>goToHero(heroIndex-1,true));
heroNext?.addEventListener("click",()=>goToHero(heroIndex+1,true));
// Rotación continua: cada imagen permanece 5 segundos.
// Solo se pausa si la pestaña del navegador deja de estar visible.
document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(heroTimer):startHeroTimer());

// PORTFOLIO
const portfolioGrid = document.getElementById("portfolioGrid");
const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalDetails = document.getElementById("modalDetails");
const modalMeta = document.getElementById("modalMeta");
const modalCounter = document.getElementById("modalCounter");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
let currentVisible = projects.map((_,i)=>i);
let currentModalPosition = 0;
let lastFocusedCard = null;
let touchStartX = 0;
let touchStartY = 0;

function renderProjects(filter="todos"){
  if(!portfolioGrid) return;
  currentVisible = projects.map((project,index)=>({project,index}))
    .filter(({project})=>filter==="todos"||project.category===filter)
    .map(({index})=>index);

  portfolioGrid.innerHTML = currentVisible.map(index=>{
    const p = projects[index];
const classes = ["project-card","reveal","visible"];
    return `
      <article class="${classes.join(" ")}" data-index="${index}" tabindex="0" role="button" aria-label="Ver ficha de ${p.title}">
        <img src="${toThumb(p.image)}" width="720" height="540" alt="${p.title}" loading="lazy" decoding="async" fetchpriority="low" />
        <span class="project-open" aria-hidden="true">↗</span>
        <div class="project-overlay">
          <span class="project-tag">${p.categoryLabel}</span>
          <h3>${p.title}</h3>
          <p>${p.short}</p>
        </div>
      </article>`;
  }).join("");

  portfolioGrid.querySelectorAll(".project-card").forEach(card=>{
    const open=()=>openProject(Number(card.dataset.index), card);
    card.addEventListener("click",open);
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
}

function openProject(projectIndex, sourceCard=null){
  if(!modal) return;
  lastFocusedCard = sourceCard || document.activeElement;
  currentModalPosition = Math.max(0,currentVisible.indexOf(projectIndex));
  showModalProject();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  modal.querySelector(".modal-close")?.focus();
}

function showModalProject(){
  const projectIndex = currentVisible[currentModalPosition];
  const p = projects[projectIndex];
  if(!p) return;
  modalImage.src=isMobileViewport()?toMobile(p.image):p.image;
  modalImage.width=p.width;
  modalImage.height=p.height;
  modalImage.alt=p.title;
  modalCategory.textContent=p.categoryLabel;
  modalTitle.textContent=p.title;
  modalText.textContent=p.text;
  modalCounter.textContent=`${currentModalPosition+1} / ${currentVisible.length}`;
  const details = [
    ["Ubicación", p.location],
    ["Año", p.year],
    ["Área", p.area],
    ["Alcance", p.scope],
    ["Rol", p.role]
  ].filter(([,value])=>value);
  modalDetails.innerHTML=details.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  modalMeta.innerHTML=p.meta.map(item=>`<span>${item}</span>`).join("");
}

function moveModal(step){
  if(!currentVisible.length) return;
  currentModalPosition=(currentModalPosition+step+currentVisible.length)%currentVisible.length;
  showModalProject();
}

function closeModal(){
  if(!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  if(lastFocusedCard && typeof lastFocusedCard.focus === "function") lastFocusedCard.focus();
}

document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
modalPrev?.addEventListener("click",()=>moveModal(-1));
modalNext?.addEventListener("click",()=>moveModal(1));

document.addEventListener("keydown",e=>{
  if(modal?.classList.contains("open")){
    if(e.key==="Escape") closeModal();
    if(e.key==="ArrowLeft") moveModal(-1);
    if(e.key==="ArrowRight") moveModal(1);
  }
});

const modalImageWrap = document.querySelector(".modal-image-wrap");
modalImageWrap?.addEventListener("touchstart",e=>{
  const t=e.changedTouches[0]; touchStartX=t.clientX; touchStartY=t.clientY;
},{passive:true});
modalImageWrap?.addEventListener("touchend",e=>{
  const t=e.changedTouches[0];
  const dx=t.clientX-touchStartX; const dy=t.clientY-touchStartY;
  if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.25) moveModal(dx<0?1:-1);
},{passive:true});

function setFilter(filter){
  document.querySelectorAll(".filter-btn").forEach(btn=>{
    const active=btn.dataset.filter===filter;
    btn.classList.toggle("active",active);
    btn.setAttribute("aria-pressed",String(active));
  });
  renderProjects(filter);
}

document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>setFilter(btn.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach(link=>link.addEventListener("click",()=>setFilter(link.dataset.filterLink)));


// GALERÍA DE ESPECIALIDADES
const workPhotos = [
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-01.webp", width:800, height:1600, alt:"Instalaciones eléctricas y cableado en proceso de obra"},
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-02.webp", width:800, height:1600, alt:"Ejecución de cableado e instalaciones técnicas"},
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-03.webp", width:800, height:1600, alt:"Instalaciones integradas en muros y acabados"},
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-04.webp", width:1200, height:1600, alt:"Instalaciones técnicas integradas en cielo interior"},
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-05.webp", width:1600, height:900, alt:"Estructura e instalaciones técnicas de cielo"},
  {category:"electricidad", label:"Electricidad", image:"assets/gdu-electricidad-06.webp", width:800, height:1600, alt:"Trabajo técnico en muro interior"},
  {category:"tablayeso", label:"Tabla yeso", image:"assets/gdu-tablayeso-01.webp", width:1600, height:900, alt:"Cielo decorativo terminado con detalles de tabla yeso"},
  {category:"tablayeso", label:"Tabla yeso", image:"assets/gdu-tablayeso-02.webp", width:1600, height:720, alt:"Espacio interior terminado con cielo e iluminación integrada"},
  {category:"tablayeso", label:"Tabla yeso", image:"assets/gdu-tablayeso-03.webp", width:1600, height:720, alt:"Adecuación interior de sala de reuniones"},
  {category:"tablayeso", label:"Tabla yeso", image:"assets/gdu-tablayeso-04.webp", width:1600, height:720, alt:"Acabados y adecuación de sala de reuniones"},
  {category:"carpinteria", label:"Carpintería", image:"assets/gdu-carpinteria-01.webp", width:1599, height:899, alt:"Mesa de madera fabricada para interior"},
  {category:"carpinteria", label:"Carpintería", image:"assets/gdu-carpinteria-02.webp", width:1600, height:1600, alt:"Mesa de comedor de madera a medida"},
  {category:"carpinteria", label:"Carpintería", image:"assets/gdu-carpinteria-03.webp", width:1200, height:1600, alt:"Mueble de entretenimiento y revestimiento de madera"},
  {category:"carpinteria", label:"Carpintería", image:"assets/gdu-carpinteria-04.webp", width:1080, height:810, alt:"Cocina con gabinetes y carpintería en madera"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-01.webp", width:1600, height:900, alt:"Rótulo de Electrónica Panamericana"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-02.webp", width:1131, height:1441, alt:"Señalización de acceso restringido"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-03.webp", width:1200, height:1600, alt:"Figura promocional fabricada para marca comercial"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-04.webp", width:1600, height:1200, alt:"Letras iluminadas de Guadalupe"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-05.webp", width:864, height:1152, alt:"Instalación de rotulación corporativa en fachada"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-06.webp", width:1600, height:1200, alt:"Rótulo luminoso GTC Planet"},
  {category:"rotulacion", label:"Rotulación", image:"assets/gdu-rotulacion-07.webp", width:1600, height:1204, alt:"Rótulo luminoso Jetour instalado en fachada"}
];

const workGallery=document.getElementById("workGallery");
function renderWorkGallery(filter="electricidad"){
  if(!workGallery) return;
  const visible=workPhotos.filter(item=>item.category===filter);
  workGallery.innerHTML=visible.map((item,index)=>{
    return `<figure class="work-photo reveal visible">
      <div class="work-photo-media"><img src="${toThumb(item.image)}" width="720" height="540" alt="${item.alt}" loading="lazy" decoding="async" fetchpriority="low" /></div>
      <figcaption><span>${item.label}</span><small>Trabajo realizado</small></figcaption>
    </figure>`;
  }).join("");
}

document.querySelectorAll(".work-filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".work-filter").forEach(b=>{
    const active=b===btn;
    b.classList.toggle("active",active);
    b.setAttribute("aria-pressed",String(active));
  });
  renderWorkGallery(btn.dataset.workFilter);
}));
renderWorkGallery();

// MOBILE NAV
const menuToggle=document.querySelector(".menu-toggle");
const mainNav=document.querySelector(".main-nav");
if(menuToggle&&mainNav){
  menuToggle.addEventListener("click",()=>{
    const open=mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded",String(open));
  });
  mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
  }));
}

// REVEAL
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
  });
},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// FORM FALLBACK PARA PRUEBA LOCAL; EN NETLIFY EL FORMULARIO SE PROCESA CON NETLIFY FORMS.
const leadForm=document.getElementById("leadForm");
leadForm?.addEventListener("submit",e=>{
  if(location.protocol!=="file:") return;
  e.preventDefault();
  const data=new FormData(leadForm);
  const subject=encodeURIComponent("Solicitud de información - Grupo de Desarrollo Urbano");
  const body=encodeURIComponent(`Nombre: ${data.get("nombre")}\nTeléfono: ${data.get("telefono")}\nTipo de proyecto: ${data.get("tipo-proyecto")}\n\nMensaje:\n${data.get("mensaje")||""}`);
  window.location.href=`mailto:Grupodedesarrollourbanosa@gmail.com?subject=${subject}&body=${body}`;
});

const year=document.getElementById("year");
if(year) year.textContent=new Date().getFullYear();
renderProjects();
