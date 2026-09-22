/* app.js — Grupo de Desarrollo Urbano S.A.
   Hero carousel, portfolio + specialty gallery rendering, modal, theme
   toggle, and GSAP-based progressive-enhancement animations. Bilingual
   strings are read from the `translations` object defined in i18n.js
   (loaded before this file). */

function currentLang(){
  return document.documentElement.getAttribute("lang") === "en" ? "en" : "es";
}
function t(key){
  const table = window.translations || (typeof translations !== "undefined" ? translations : null);
  const dict = (table && (table[currentLang()] || table.es)) || {};
  return Object.prototype.hasOwnProperty.call(dict,key) ? dict[key] : key;
}

const toThumb = path => path.replace("assets/", "assets/thumbs/");
const toMobile = path => path.replace("assets/", "assets/mobile/");
const isMobileViewport = () => window.matchMedia("(max-width: 820px)").matches;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const constrainedConnection = Boolean(connection?.saveData || /(^|-)2g$|3g/.test(connection?.effectiveType || ""));
const HERO_PRELOAD_DELAY = constrainedConnection ? 3800 : 1800;

/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById("themeToggle");
function applyThemeColor(theme){
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", theme === "dark" ? "#0b0c0d" : "#111214");
}
function setTheme(theme, persist=true){
  document.documentElement.setAttribute("data-theme", theme);
  applyThemeColor(theme);
  if(persist){ try{ localStorage.setItem("gdu-theme", theme); }catch(e){} }
}
(function initTheme(){
  let theme = document.documentElement.getAttribute("data-theme");
  if(theme !== "light" && theme !== "dark"){
    let saved = null;
    try{ saved = localStorage.getItem("gdu-theme"); }catch(e){}
    theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  setTheme(theme, false);
})();
themeToggle?.addEventListener("click", ()=>{
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next, true);
});

/* ============ HERO ROTATING "ÁREA DESTACADA" (independent of slide index) ============ */
function getHeroData(){
  const items = [];
  for(let i=1;i<=11;i++){
    items.push({ title: t(`hero.rot.${i}.title`), meta: t(`hero.rot.${i}.meta`) });
  }
  return items;
}

const projects = [
  {
    category: "urbanismo", image: "assets/gdu-proyecto-villas-tejar.webp", width: 1439, height: 1088, layout: "wide",
    location: "Chimaltenango",
    es: { title:"Urbanización Villas del Tejar", categoryLabel:"Urbanismo", short:"Planificación y ejecución de una urbanización de 50 lotes residenciales.", text:"Proyecto de urbanización con planificación y ejecución de obra, movimiento de tierra e implementación de sistemas de drenajes y electricidad.", area:"50 lotes residenciales", scope:"Planificación, obra, movimiento de tierra, drenajes y electricidad.", role:"Planificación y ejecución de obra.", meta:["Urbanismo","Drenajes","Electricidad"] },
    en: { title:"Villas del Tejar Subdivision", categoryLabel:"Urban planning", short:"Planning and execution of a 50-lot residential subdivision.", text:"Subdivision project with planning and execution of the works, earthmoving, and implementation of drainage and electrical systems.", area:"50 residential lots", scope:"Planning, construction, earthmoving, drainage and electrical.", role:"Planning and execution of the works.", meta:["Urban planning","Drainage","Electrical"] }
  },
  {
    category: "comercial", image: "assets/gdu-proyecto-centro-conveniencia-01.webp", width: 808, height: 608, layout: "wide",
    location: "Villa San Cristóbal, Mixco",
    es: { title:"Centro de Conveniencia Real", categoryLabel:"Infraestructura comercial", short:"Desarrollo integral de 1,500 m² y 16 locales comerciales.", text:"Desarrollo integral de locales comerciales con calles, drenajes, bordillos e instalaciones hidráulicas y eléctricas sobre el Boulevard principal de San Cristóbal.", area:"1,500 m² · 16 locales", scope:"Locales comerciales, calles, drenajes, bordillos e instalaciones hidráulicas y eléctricas.", role:"Desarrollo integral y ejecución.", meta:["Comercial","Infraestructura","Instalaciones"] },
    en: { title:"Centro de Conveniencia Real", categoryLabel:"Commercial infrastructure", short:"Comprehensive development of 1,500 m² and 16 commercial units.", text:"Comprehensive development of commercial units with streets, drainage, curbs, and hydraulic and electrical installations along the main Boulevard of San Cristóbal.", area:"1,500 m² · 16 units", scope:"Commercial units, streets, drainage, curbs, and hydraulic and electrical installations.", role:"Comprehensive development and execution.", meta:["Commercial","Infrastructure","Installations"] }
  },
  {
    category: "residencial", image: "assets/gdu-proyecto-condominio-real-villa.webp", width: 1440, height: 1077,
    location: "San Cristóbal, Mixco",
    es: { title:"Condominio Real Villa", categoryLabel:"Residencial", short:"Proyecto habitacional de 40 casas desde planificación hasta ejecución completa.", text:"Proyecto habitacional desarrollado bajo un modelo constructivo eficiente y estandarizado, priorizando diseño, funcionalidad de los ambientes y calidad constructiva.", area:"40 casas", scope:"Planificación, ejecución completa y estandarización constructiva.", role:"Desarrollo habitacional integral.", meta:["Residencial","Construcción","Vivienda"] },
    en: { title:"Condominio Real Villa", categoryLabel:"Residential", short:"40-home housing project from planning through full execution.", text:"Housing project developed under an efficient, standardized construction model, prioritizing design, functional layouts and construction quality.", area:"40 homes", scope:"Planning, full execution and construction standardization.", role:"Comprehensive housing development.", meta:["Residential","Construction","Housing"] }
  },
  {
    category: "residencial", image: "assets/gdu-proyecto-casa-playa.webp", width: 1440, height: 1080, layout: "wide",
    location: "Puerto de San José, Escuintla",
    es: { title:"Casa de descanso en la playa", categoryLabel:"Residencial", short:"Desarrollo residencial de alto nivel con 700 m² de construcción.", text:"Residencia bajo un concepto arquitectónico mediterráneo, con espacios de doble altura, amplitud y luz natural. La obra se ejecutó desde la planificación hasta los acabados, incorporando áreas sociales y piscina con cascada.", area:"700 m²", scope:"Planificación, construcción, acabados, áreas sociales y piscina.", role:"Obra completa desde planificación hasta acabados.", meta:["Residencial","Acabados","Obra completa"] },
    en: { title:"Beach House", categoryLabel:"Residential", short:"High-end residential development with 700 m² of construction.", text:"Residence built around a Mediterranean architectural concept, with double-height spaces, openness and natural light. The work was carried out from planning through finishes, including social areas and a pool with a waterfall.", area:"700 m²", scope:"Planning, construction, finishes, social areas and pool.", role:"Full project from planning through finishes.", meta:["Residential","Finishes","Full project"] }
  },
  {
    category: "institucional", image: "assets/gdu-proyecto-diga-usac.webp", width: 1152, height: 864,
    location: "Universidad de San Carlos de Guatemala",
    es: { title:"Jardinización de exteriores DIGA-USAC", categoryLabel:"Institucional", short:"Intervención de áreas exteriores y paisajismo institucional.", text:"Proyecto de jardinización de exteriores realizado para DIGA-USAC, integrando vegetación y elementos de paisaje en áreas de circulación.", scope:"Jardinización y adecuación de exteriores.", role:"Paisajismo y ejecución exterior.", meta:["DIGA-USAC","Jardinización","Exterior"] },
    en: { title:"DIGA-USAC Exterior Landscaping", categoryLabel:"Institutional", short:"Exterior landscaping and institutional grounds work.", text:"Exterior landscaping project carried out for DIGA-USAC, integrating vegetation and landscape elements into circulation areas.", scope:"Landscaping and exterior grounds work.", role:"Landscaping and outdoor execution.", meta:["DIGA-USAC","Landscaping","Exterior"] }
  },
  {
    category: "institucional", image: "assets/gdu-proyecto-rectoria-usac.webp", width: 1280, height: 959,
    location: "Universidad de San Carlos de Guatemala",
    es: { title:"Rectoría USAC · Mesa de reuniones", categoryLabel:"Institucional", short:"Mobiliario y adecuación interior para espacio de reuniones.", text:"Proyecto de mesa de reuniones y adecuación interior presentado dentro del portafolio institucional de Grupo de Desarrollo Urbano.", scope:"Mesa de reuniones, mobiliario y adecuación interior.", role:"Carpintería y acabados interiores.", meta:["Rectoría USAC","Carpintería","Interiores"] },
    en: { title:"USAC Rectory · Meeting Table", categoryLabel:"Institutional", short:"Furniture and interior remodeling for a meeting space.", text:"Meeting table and interior remodeling project featured in Grupo de Desarrollo Urbano's institutional portfolio.", scope:"Meeting table, furniture and interior remodeling.", role:"Carpentry and interior finishes.", meta:["USAC Rectory","Carpentry","Interiors"] }
  },
  {
    category: "institucional", image: "assets/gdu-lab-robotica-05.webp", width: 1448, height: 1086, layout: "wide",
    gallery: [
      {image:"assets/gdu-lab-robotica-01.webp",width:1600,height:1200},
      {image:"assets/gdu-lab-robotica-02.webp",width:1086,height:1448},
      {image:"assets/gdu-lab-robotica-03.webp",width:1448,height:1086},
      {image:"assets/gdu-lab-robotica-04.webp",width:1200,height:1600},
      {image:"assets/gdu-lab-robotica-05.webp",width:1448,height:1086}
    ],
    location: "Universidad de San Carlos de Guatemala · Quinto nivel",
    es: { title:"Laboratorio de Robótica USAC", categoryLabel:"Institucional", short:"Adecuación institucional en ejecución para laboratorio de robótica.", text:"Proyecto institucional en proceso que integra estructura metálica, plataforma técnica, canalizaciones, adecuación interior e instalaciones para el laboratorio de robótica en el quinto nivel.", scope:"Estructura metálica, plataforma técnica, instalaciones, adecuación interior y acabados.", role:"Ejecución y coordinación de obra institucional.", meta:["USAC","Laboratorio de Robótica","Obra institucional"] },
    en: { title:"USAC Robotics Laboratory", categoryLabel:"Institutional", short:"Institutional fit-out in progress for a robotics laboratory.", text:"Institutional project in progress integrating steel framing, technical platform, conduits, interior fit-out and installations for the robotics laboratory on the fifth level.", scope:"Steel structure, technical platform, installations, interior fit-out and finishes.", role:"Execution and coordination of institutional works.", meta:["USAC","Robotics Laboratory","Institutional"] }
  },
  {
    category: "institucional", image: "assets/gdu-herreria-02.webp", width: 899, height: 1599,
    gallery: [
      {image:"assets/gdu-herreria-01.webp",width:1600,height:900},
      {image:"assets/gdu-herreria-02.webp",width:899,height:1599},
      {image:"assets/gdu-herreria-03.webp",width:900,height:1600}
    ],
    es: { title:"Herrería institucional y estructuras metálicas", categoryLabel:"Institucional · Herrería", short:"Fabricación e instalación de estructuras y elementos metálicos a medida.", text:"Trabajos de herrería institucional que incluyen fabricación, montaje e instalación de estructuras, barandales, elementos metálicos y soluciones a medida para obra nueva y adecuaciones.", scope:"Fabricación, soldadura, montaje, barandales y estructuras metálicas.", role:"Herrería, fabricación e instalación.", meta:["Herrería","Institucional","Estructuras metálicas"] },
    en: { title:"Institutional Ironwork and Steel Structures", categoryLabel:"Institutional · Ironwork", short:"Fabrication and installation of custom steel structures and metal elements.", text:"Institutional ironwork including fabrication, assembly and installation of structures, railings, metal components and custom solutions for new construction and remodeling.", scope:"Fabrication, welding, assembly, railings and steel structures.", role:"Ironwork fabrication and installation.", meta:["Ironwork","Institutional","Steel structures"] }
  }
];
function P(project){
  const langData = project[currentLang()] || project.es;
  return Object.assign({}, project, langData);
}

/* ============ HERO CAROUSEL ============ */
const slides = [...document.querySelectorAll(".hero-slide")];
const heroTitle = document.getElementById("heroProjectTitle");
const heroMeta = document.getElementById("heroProjectMeta");
const heroDots = document.getElementById("heroDots");
const heroProgressBar = document.getElementById("heroProgressBar");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
let heroIndex = 0;
let heroDataIndex = 0;
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
  heroDots.innerHTML = slides.map((_,i)=>`<button class="hero-dot ${i===0?"active":""}" aria-label="${t("hero.nextImg")} ${i+1}" data-hero-index="${i}"></button>`).join("");
  heroDots.querySelectorAll(".hero-dot").forEach(dot=>dot.addEventListener("click",()=>goToHero(Number(dot.dataset.heroIndex), true)));
}

function restartHeroProgress(){
  if(!heroProgressBar) return;
  heroProgressBar.classList.remove("animate");
  void heroProgressBar.offsetWidth;
  heroProgressBar.classList.add("animate");
}

function renderHeroCardText(){
  const data = getHeroData();
  const item = data[heroDataIndex % data.length];
  if(heroTitle) heroTitle.textContent = item?.title || "";
  if(heroMeta) heroMeta.textContent = item?.meta || "";
}

function goToHero(index, resetTimer=false){
  if(!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  heroDataIndex = (heroDataIndex + 1) % getHeroData().length;
  ensureSlideLoaded(heroIndex);
  slides.forEach((slide,i)=>slide.classList.toggle("active",i===heroIndex));
  document.querySelectorAll(".hero-dot").forEach((dot,i)=>dot.classList.toggle("active",i===heroIndex));
  renderHeroCardText();
  restartHeroProgress();
  window.setTimeout(()=>ensureSlideLoaded(heroIndex+1), HERO_PRELOAD_DELAY);
  if(resetTimer) startHeroTimer();
}

function startHeroTimer(){
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>goToHero(heroIndex+1), HERO_DELAY);
}

buildHeroDots();
renderHeroCardText();
goToHero(0);
window.setTimeout(()=>ensureSlideLoaded(1), HERO_PRELOAD_DELAY);
startHeroTimer();
heroPrev?.addEventListener("click",()=>goToHero(heroIndex-1,true));
heroNext?.addEventListener("click",()=>goToHero(heroIndex+1,true));
document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(heroTimer):startHeroTimer());

/* ============ PORTFOLIO ============ */
const portfolioGrid = document.getElementById("portfolioGrid");
const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalDetails = document.getElementById("modalDetails");
const modalMeta = document.getElementById("modalMeta");
const modalCounter = document.getElementById("modalCounter");
const modalGallery = document.getElementById("modalGallery");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
let currentVisible = projects.map((_,i)=>i);
let currentModalPosition = 0;
let lastFocusedCard = null;
let touchStartX = 0;
let touchStartY = 0;
let currentProjectGalleryIndex = 0;
let activeFilter = "todos";

function renderProjects(filter=activeFilter){
  activeFilter = filter;
  if(!portfolioGrid) return;
  currentVisible = projects.map((project,index)=>({project,index}))
    .filter(({project})=>filter==="todos"||project.category===filter)
    .map(({index})=>index);

  portfolioGrid.innerHTML = currentVisible.map(index=>{
    const p = P(projects[index]);
    const classes = ["project-card","reveal","visible"];
    if(projects[index].layout) classes.push(projects[index].layout);
    return `
      <article class="${classes.join(" ")}" data-index="${index}" tabindex="0" role="button" aria-label="${p.title}">
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
  if(window.ScrollTrigger) window.ScrollTrigger.refresh();
}

function openProject(projectIndex, sourceCard=null){
  if(!modal) return;
  lastFocusedCard = sourceCard || document.activeElement;
  currentModalPosition = Math.max(0,currentVisible.indexOf(projectIndex));
  currentProjectGalleryIndex = 0;
  showModalProject();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  modal.querySelector(".modal-close")?.focus();
}

function projectGallery(p){
  return (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : [{image:p.image,width:p.width,height:p.height}];
}
function setModalGalleryImage(p,index){
  const gallery=projectGallery(p);
  currentProjectGalleryIndex=(index+gallery.length)%gallery.length;
  const item=gallery[currentProjectGalleryIndex];
  modalImage.src=isMobileViewport()?toMobile(item.image):item.image;
  modalImage.width=item.width||p.width;
  modalImage.height=item.height||p.height;
  modalImage.alt=`${p.title} · ${currentProjectGalleryIndex+1}`;
  modalGallery?.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===currentProjectGalleryIndex));
}
function renderModalGallery(p){
  if(!modalGallery) return;
  const gallery=projectGallery(p);
  if(gallery.length<=1){modalGallery.hidden=true;modalGallery.innerHTML="";return;}
  modalGallery.hidden=false;
  modalGallery.innerHTML=gallery.map((item,i)=>`<button type="button" class="${i===0?"active":""}" aria-label="Ver fotografía ${i+1} de ${gallery.length}"><img src="${toThumb(item.image)}" width="120" height="90" alt="" loading="lazy" decoding="async"></button>`).join("");
  modalGallery.querySelectorAll("button").forEach((btn,i)=>btn.addEventListener("click",()=>setModalGalleryImage(p,i)));
}
function showModalProject(){
  const projectIndex = currentVisible[currentModalPosition];
  const p = P(projects[projectIndex]);
  if(!p) return;
  currentProjectGalleryIndex=0;
  renderModalGallery(p);
  setModalGalleryImage(p,0);
  modalCategory.textContent=p.categoryLabel;
  modalTitle.textContent=p.title;
  modalText.textContent=p.text;
  modalCounter.textContent=`${currentModalPosition+1} / ${currentVisible.length}`;
  const details = [
    [t("modal.ubicacion"), p.location],
    [t("modal.anio"), p.year],
    [t("modal.area"), p.area],
    [t("modal.alcance"), p.scope],
    [t("modal.rol"), p.role]
  ].filter(([,value])=>value);
  modalDetails.innerHTML=details.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  modalMeta.innerHTML=(p.meta||[]).map(item=>`<span>${item}</span>`).join("");
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
  if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.25){
    const p=P(projects[currentVisible[currentModalPosition]]);
    const gallery=projectGallery(p);
    if(gallery.length>1) setModalGalleryImage(p,currentProjectGalleryIndex+(dx<0?1:-1));
    else moveModal(dx<0?1:-1);
  }
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


/* ============ GALERÍA DE ESPECIALIDADES ============ */
const workPhotos = [
  {category:"electricidad", image:"assets/gdu-electricidad-01.webp", width:800, height:1600, es:{label:"Electricidad", alt:"Instalaciones eléctricas y cableado en proceso de obra"}, en:{label:"Electrical", alt:"Electrical installations and wiring in progress"}},
  {category:"electricidad", image:"assets/gdu-electricidad-02.webp", width:800, height:1600, es:{label:"Electricidad", alt:"Ejecución de cableado e instalaciones técnicas"}, en:{label:"Electrical", alt:"Wiring and technical installation work"}},
  {category:"electricidad", image:"assets/gdu-electricidad-03.webp", width:800, height:1600, es:{label:"Electricidad", alt:"Instalaciones integradas en muros y acabados"}, en:{label:"Electrical", alt:"Installations integrated into walls and finishes"}},
  {category:"electricidad", image:"assets/gdu-electricidad-04.webp", width:1200, height:1600, es:{label:"Electricidad", alt:"Instalaciones técnicas integradas en cielo interior"}, en:{label:"Electrical", alt:"Technical installations integrated into an interior ceiling"}},
  {category:"electricidad", image:"assets/gdu-electricidad-05.webp", width:1600, height:900, es:{label:"Electricidad", alt:"Estructura e instalaciones técnicas de cielo"}, en:{label:"Electrical", alt:"Ceiling structure and technical installations"}},
  {category:"electricidad", image:"assets/gdu-electricidad-06.webp", width:800, height:1600, es:{label:"Electricidad", alt:"Trabajo técnico en muro interior"}, en:{label:"Electrical", alt:"Technical work on an interior wall"}},
  {category:"electricidad", image:"assets/gdu-electricidad-07.webp", width:1200, height:1600, es:{label:"Electricidad", alt:"Iluminación e instalación eléctrica en parqueo"}, en:{label:"Electrical", alt:"Lighting and electrical installation in parking area"}},
  {category:"electricidad", image:"assets/gdu-electricidad-08.webp", width:1200, height:1600, es:{label:"Electricidad", alt:"Canalización técnica y bandejas portacables"}, en:{label:"Electrical", alt:"Technical conduit and cable tray installation"}},
  {category:"electricidad", image:"assets/gdu-electricidad-09.webp", width:1600, height:1200, es:{label:"Electricidad", alt:"Iluminación general de parqueo subterráneo"}, en:{label:"Electrical", alt:"General lighting in an underground parking facility"}},

  {category:"tablayeso", image:"assets/gdu-tablayeso-01.webp", width:1600, height:900, es:{label:"Tabla yeso", alt:"Cielo decorativo terminado con detalles de tabla yeso"}, en:{label:"Drywall", alt:"Finished decorative ceiling with drywall details"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-02.webp", width:1600, height:720, es:{label:"Tabla yeso", alt:"Espacio interior terminado con cielo e iluminación integrada"}, en:{label:"Drywall", alt:"Finished interior space with integrated ceiling and lighting"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-03.webp", width:1600, height:720, es:{label:"Tabla yeso", alt:"Adecuación interior de sala de reuniones"}, en:{label:"Drywall", alt:"Interior remodel of a meeting room"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-04.webp", width:1600, height:720, es:{label:"Tabla yeso", alt:"Acabados y adecuación de sala de reuniones"}, en:{label:"Drywall", alt:"Finishes and remodel of a meeting room"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-05.webp", width:1448, height:1086, es:{label:"Tabla yeso", alt:"Equipo de trabajo aplicando acabados de tabla yeso en lobby moderno"}, en:{label:"Drywall", alt:"Crew applying drywall finishes in a modern lobby"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-06.webp", width:800, height:450, es:{label:"Tabla yeso", alt:"Cielo decorativo de tabla yeso con paneles de colores"}, en:{label:"Drywall", alt:"Decorative drywall ceiling with colorful panels"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-07.webp", width:800, height:360, es:{label:"Tabla yeso", alt:"Sala de reuniones con acabados de tabla yeso y nicho para pantalla"}, en:{label:"Drywall", alt:"Meeting room with drywall finishes and TV niche"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-08.webp", width:800, height:360, es:{label:"Tabla yeso", alt:"Área corporativa en proceso de acabados interiores y mobiliario fijo"}, en:{label:"Drywall", alt:"Corporate area under interior finishing with fixed furniture"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-09.webp", width:1122, height:1402, es:{label:"Tabla yeso", alt:"Personal uniformado instalando canalizaciones en muro de tabla yeso"}, en:{label:"Drywall", alt:"Uniformed personnel installing conduits on a drywall wall"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-10.webp", width:1122, height:1402, es:{label:"Tabla yeso", alt:"Personal de Grupo de Desarrollo Urbano trabajando sobre muro de tabla yeso"}, en:{label:"Drywall", alt:"Grupo de Desarrollo Urbano crew working on a drywall wall"}},
  {category:"tablayeso", image:"assets/gdu-tablayeso-11.webp", width:1600, height:720, es:{label:"Tabla yeso", alt:"Sala terminada con iluminación perimetral y acabados de tabla yeso"}, en:{label:"Drywall", alt:"Finished room with perimeter lighting and drywall finishes"}},

  {category:"herreria", image:"assets/gdu-herreria-01.webp", width:1600, height:900, es:{label:"Herrería", alt:"Fabricación de estructura metálica a medida"}, en:{label:"Ironwork", alt:"Custom steel structure fabrication"}},
  {category:"herreria", image:"assets/gdu-herreria-02.webp", width:899, height:1599, es:{label:"Herrería", alt:"Barandal metálico y estructura exterior"}, en:{label:"Ironwork", alt:"Metal railing and exterior structure"}},
  {category:"herreria", image:"assets/gdu-herreria-03.webp", width:900, height:1600, es:{label:"Herrería", alt:"Instalación de estructura metálica por personal uniformado"}, en:{label:"Ironwork", alt:"Steel structure installation by uniformed staff"}},

  {category:"carpinteria", image:"assets/gdu-carpinteria-01.webp", width:1080, height:810, es:{label:"Carpintería", alt:"Cocina con gabinetes de madera fabricados a medida"}, en:{label:"Carpentry", alt:"Kitchen with custom wood cabinetry"}},
  {category:"carpinteria", image:"assets/gdu-carpinteria-02.webp", width:1599, height:899, es:{label:"Carpintería", alt:"Mesa de comedor de madera exhibida en sala de ventas"}, en:{label:"Carpentry", alt:"Wood dining table displayed in a showroom"}},
  {category:"carpinteria", image:"assets/gdu-carpinteria-03.webp", width:1600, height:1600, es:{label:"Carpintería", alt:"Mesa de comedor de madera sólida en ambiente residencial"}, en:{label:"Carpentry", alt:"Solid wood dining table in a residential setting"}},
  {category:"carpinteria", image:"assets/gdu-carpinteria-04.webp", width:1200, height:1600, es:{label:"Carpintería", alt:"Panel decorativo de madera con mueble flotante para televisión"}, en:{label:"Carpentry", alt:"Decorative wood slat wall with floating TV cabinet"}},
  {category:"carpinteria", image:"assets/gdu-carpinteria-05.webp", width:800, height:599, es:{label:"Carpintería", alt:"Mesa corporativa con acabados de carpintería y revestimientos de madera"}, en:{label:"Carpentry", alt:"Corporate table with carpentry finishes and wood cladding"}},

  {category:"jardinizacion", image:"assets/gdu-jardinizacion-01.webp", width:1600, height:1200, es:{label:"Jardinización", alt:"Paisajismo y áreas verdes en proyecto residencial"}, en:{label:"Landscaping", alt:"Landscaping and green areas in a residential project"}},
  {category:"jardinizacion", image:"assets/gdu-jardinizacion-02.webp", width:1448, height:1086, es:{label:"Jardinización", alt:"Personal uniformado realizando mantenimiento de áreas verdes"}, en:{label:"Landscaping", alt:"Uniformed crew performing green area maintenance"}},
  {category:"jardinizacion", image:"assets/gdu-jardinizacion-03.webp", width:1448, height:1086, es:{label:"Jardinización", alt:"Personal uniformado trabajando en poda ornamental de jardín"}, en:{label:"Landscaping", alt:"Uniformed crew performing ornamental garden pruning"}},
  {category:"jardinizacion", image:"assets/gdu-jardinizacion-04.webp", width:1200, height:1600, es:{label:"Jardinización", alt:"Piscina con integración paisajística y rocalla decorativa"}, en:{label:"Landscaping", alt:"Pool with integrated landscaping and decorative rock feature"}},
  {category:"jardinizacion", image:"assets/gdu-jardinizacion-05.webp", width:1200, height:1600, es:{label:"Jardinización", alt:"Jardín tropical junto a piscina en proyecto residencial"}, en:{label:"Landscaping", alt:"Tropical garden beside a residential pool"}},
  {category:"jardinizacion", image:"assets/gdu-jardinizacion-06.webp", width:638, height:480, es:{label:"Jardinización", alt:"Césped y áreas verdes en mantenimiento"}, en:{label:"Landscaping", alt:"Lawn and green areas under maintenance"}},

  {category:"rotulacion", image:"assets/gdu-rotulacion-01.webp", width:1600, height:900, es:{label:"Rotulación", alt:"Fachada de Electrónica Panamericana con rótulo corporativo"}, en:{label:"Signage", alt:"Electrónica Panamericana corporate facade sign"}},
  {category:"rotulacion", image:"assets/gdu-rotulacion-02.webp", width:1131, height:1441, es:{label:"Rotulación", alt:"Señalización de acceso restringido"}, en:{label:"Signage", alt:"Restricted-access signage"}},
  {category:"rotulacion", image:"assets/gdu-rotulacion-04.webp", width:1600, height:1200, es:{label:"Rotulación iluminada", alt:"Letras iluminadas de Guadalupe Micoope"}, en:{label:"Illuminated signage", alt:"Guadalupe Micoope illuminated letters"}},
  {category:"rotulacion", image:"assets/gdu-rotulacion-05.webp", width:864, height:1152, es:{label:"Rotulación", alt:"Instalación de rotulación corporativa en fachada comercial"}, en:{label:"Signage", alt:"Corporate signage installation on a commercial facade"}},
  {category:"rotulacion", image:"assets/gdu-rotulacion-06.webp", width:1600, height:1200, es:{label:"Rotulación", alt:"Directorio y señalización para plaza comercial"}, en:{label:"Signage", alt:"Directory and signage for a commercial plaza"}},
  {category:"rotulacion", image:"assets/gdu-rotulacion-08.webp", width:1600, height:1204, es:{label:"Rotulación", alt:"Fachada comercial con panel ACM y letras corpóreas"}, en:{label:"Signage", alt:"Commercial facade with ACM cladding and dimensional letters"}}
];

const workGallery=document.getElementById("workGallery");
let activeWorkFilter = "electricidad";
function renderWorkGallery(filter=activeWorkFilter){
  activeWorkFilter = filter;
  if(!workGallery) return;
  const lang = currentLang();
  const visible=workPhotos.filter(item=>item.category===filter);
  workGallery.innerHTML=visible.map((item)=>{
    const d = item[lang] || item.es;
    return `<figure class="work-photo reveal visible">
      <div class="work-photo-media"><img src="${toThumb(item.image)}" data-full-src="${item.image}" width="720" height="540" alt="${d.alt}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.onerror=null;this.src=this.dataset.fullSrc" /></div>
      <figcaption><span>${d.label}</span><small>${t("work.trabajoRealizado")}</small></figcaption>
    </figure>`;
  }).join("");
  if(window.ScrollTrigger) window.ScrollTrigger.refresh();
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

/* Re-render dynamic content when the language toggle fires */
document.addEventListener("gdu:language-changed", ()=>{
  renderHeroCardText();
  renderProjects(activeFilter);
  renderWorkGallery(activeWorkFilter);
  if(modal?.classList.contains("open")) showModalProject();
});

/* ============ MOBILE NAV ============ */
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

/* ============ REVEAL (IntersectionObserver fallback; GSAP enhances below) ============ */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
  });
},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* ============ GSAP PROGRESSIVE ENHANCEMENT ============ */
window.addEventListener("load", ()=>{
  if(!window.gsap) return;
  gsap.registerPlugin(window.ScrollTrigger);

  // Hero entrance stagger
  const heroTimeline = gsap.timeline({defaults:{ease:"power3.out"}});
  heroTimeline
    .from(".hero-brand-lockup", {opacity:0, y:22, duration:.8})
    .from(".hero-copy .eyebrow", {opacity:0, y:14, duration:.6}, "-=0.45")
    .from(".hero-copy h1", {opacity:0, y:22, duration:.75}, "-=0.4")
    .from(".hero-lead", {opacity:0, y:16, duration:.6}, "-=0.45")
    .from(".hero-actions .btn", {opacity:0, y:14, stagger:.1, duration:.5}, "-=0.35")
    .from(".hero-chip", {opacity:0, y:10, stagger:.05, duration:.4}, "-=0.3")
    .from(".hero-project-card", {opacity:0, x:24, duration:.7}, "-=0.7");

  // Scroll-based reveals: take over from the basic IO for a nicer, staggered motion.
  const groups = [
    ".services-grid .service-card", ".work-gallery .work-photo", ".portfolio-grid .project-card",
    ".process-line .process-step", ".credential-list article", ".faq-list .faq-item"
  ];
  groups.forEach(sel=>{
    ScrollTrigger.batch(sel, {
      start:"top 88%",
      onEnter: batch => gsap.to(batch, {opacity:1, y:0, stagger:0.09, duration:.65, ease:"power2.out"}),
      once:true
    });
    gsap.set(sel, {opacity:1}); // keep content visible even before batch fires (avoids blank grids on dynamic re-render)
  });

  gsap.utils.toArray(".reveal").forEach(el=>{
    if(el.classList.contains("visible")) return;
    ScrollTrigger.create({
      trigger: el, start:"top 90%", once:true,
      onEnter: ()=> el.classList.add("visible")
    });
  });

  gsap.from(".slogan-inner", {
    opacity:0, y:26, duration:.8, ease:"power2.out",
    scrollTrigger:{trigger:".slogan-banner", start:"top 75%", once:true}
  });
});

/* ============ WHATSAPP FORM BRIDGE ============ */
const leadForm=document.getElementById("leadForm");
const formWhatsappBtn = document.getElementById("formWhatsappBtn");
function buildWhatsappMessage(){
  const data = new FormData(leadForm);
  const nombre = (data.get("nombre")||"").toString().trim();
  const telefono = (data.get("telefono")||"").toString().trim();
  const tipo = (data.get("tipo-proyecto")||"").toString().trim();
  const mensaje = (data.get("mensaje")||"").toString().trim();
  const lines = currentLang()==="en"
    ? ["Hello Grupo de Desarrollo Urbano, I would like a quote.",
       nombre && `Name: ${nombre}`, telefono && `Phone: ${telefono}`,
       tipo && `Project type: ${tipo}`, mensaje && `Message: ${mensaje}`]
    : ["Hola Grupo de Desarrollo Urbano, quiero solicitar una cotización.",
       nombre && `Nombre: ${nombre}`, telefono && `Teléfono: ${telefono}`,
       tipo && `Tipo de proyecto: ${tipo}`, mensaje && `Mensaje: ${mensaje}`];
  return lines.filter(Boolean).join("\n");
}
formWhatsappBtn?.addEventListener("click", ()=>{
  const text = encodeURIComponent(buildWhatsappMessage());
  window.open(`https://wa.me/50236498783?text=${text}`, "_blank", "noopener");
});

/* Form fallback for local testing; on Netlify the form posts via Netlify Forms. */
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
