// ============================================================
// LOADER
// ============================================================
let loadProgress = 0;
const loaderPct = document.getElementById('loaderPct');
const loaderInterval = setInterval(() => {
  loadProgress += Math.random() * 18;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loaderInterval);
  }
  loaderPct.textContent = `LOADING ${Math.floor(loadProgress)}%`;
}, 180);

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 2300);
});

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
let ringX = mouseX, ringY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing(){
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .service-card, .project-card, .testi-dot, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorRing.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
});

// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObserver.observe(el));

// ============================================================
// RENDER DYNAMIC CONTENT
// ============================================================
function renderSkills(){
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = SKILLS.map(s => `
    <div class="skill-card reveal-scale">
      <span class="skill-icon">${s.icon}</span>
      <div class="skill-name">${s.name}</div>
      <div class="skill-cat">${s.cat}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.reveal-scale').forEach(el => revealObserver.observe(el));
}

function renderServices(){
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = SERVICES.map((s, i) => `
    <div class="service-card reveal">
      <div class="service-num">0${i+1}</div>
      <div class="service-title">${s.title}</div>
      <div class="service-desc">${s.desc}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

const PROJECT_GRADIENTS = {
  c1: 'linear-gradient(155deg, rgba(255,107,0,0.35), rgba(20,20,20,0.9))',
  c2: 'linear-gradient(155deg, rgba(180,74,0,0.4), rgba(20,20,20,0.9))',
  c3: 'linear-gradient(155deg, rgba(255,178,122,0.25), rgba(20,20,20,0.9))',
  c4: 'linear-gradient(155deg, rgba(255,107,0,0.2), rgba(40,20,10,0.9))',
  c5: 'linear-gradient(155deg, rgba(255,140,50,0.3), rgba(20,20,20,0.9))',
  c6: 'linear-gradient(155deg, rgba(210,120,60,0.3), rgba(20,20,20,0.9))',
};

function renderProjects(){
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="project-card reveal" onclick="openModal(${i})">
     <div class="project-media" style="background-image:url('${p.img}'); background-size:cover; background-position:center;">
</div>
        <span class="proj-mark">${p.title.split(' ').map(w=>w[0]).join('')}</span>
      </div>
      <div class="project-info">
        <div class="project-top">
          <div class="project-title">${p.title}</div>
          <div class="project-cat">${p.cat}</div>
        </div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tech">${p.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function renderTimeline(){
  const list = document.getElementById('timelineList');
  list.innerHTML = TIMELINE.map(t => `
    <div class="timeline-item reveal">
      <div class="timeline-year">${t.year}</div>
      <div class="timeline-role">${t.role}</div>
      <div class="timeline-desc">${t.desc}</div>
    </div>
  `).join('');
  list.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

let testiIndex = 0;
function renderTestimonials(){
  const track = document.getElementById('testiTrack');
  const dots = document.getElementById('testiDots');
  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <div class="testi-stars">${'★'.repeat(t.rating)}</div>
      <div class="testi-quote">"${t.quote}"</div>
      <div class="testi-person">
        <div class="testi-avatar">${t.name.split(' ').map(w=>w[0]).join('')}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
  dots.innerHTML = TESTIMONIALS.map((_, i) => `<div class="testi-dot ${i===0?'active':''}" onclick="gotoTesti(${i})"></div>`).join('');
}

function gotoTesti(i){
  testiIndex = i;
  const track = document.getElementById('testiTrack');
  track.style.transform = `translateX(-${i * 100}%)`;
  document.querySelectorAll('.testi-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
}

let testiAutoplay = setInterval(() => {
  testiIndex = (testiIndex + 1) % TESTIMONIALS.length;
  gotoTesti(testiIndex);
}, 5000);

renderSkills();
renderServices();
renderProjects();
renderTimeline();
renderTestimonials();

// ============================================================
// PROJECT MODAL
// ============================================================
function openModal(i){
  const p = PROJECTS[i];
  document.getElementById('modalCat').textContent = p.cat;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalTech').innerHTML = p.tech.map(t => `<span class="tech-chip">${t}</span>`).join('');
  document.getElementById('project-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  document.getElementById('project-modal').classList.remove('open');
  document.body.style.overflow = 'auto';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ============================================================
// CONTACT FORM
// ============================================================
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojornln";

function handleSubmit(e){
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const btn = document.getElementById('submitBtn');

  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = 'Sending...';
  note.style.display = 'none';

  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok){
      note.textContent = "Thanks — I'll get back to you soon.";
      note.style.color = 'var(--orange)';
      note.style.display = 'block';
      form.reset();
    } else {
      throw new Error('Submission failed');
    }
  })
  .catch(() => {
    note.textContent = "Something went wrong — please try again or email me directly.";
    note.style.color = '#ff5555';
    note.style.display = 'block';
  })
  .finally(() => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Send Message';
  });

  return false;
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    el.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
});

// ============================================================
// FOOTER LOGO REVEAL
// ============================================================
const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      footerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
footerObserver.observe(document.getElementById('footerLogo'));

// ============================================================
// THREE.JS HERO SCENE — floating metallic BMS logo
// ============================================================
(function initHero(){
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b0b, 0.035);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambient = new THREE.AmbientLight(0x443322, 0.6);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xff6b00, 3.5, 40);
  keyLight.position.set(6, 4, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xff9955, 2.2, 40);
  rimLight.position.set(-8, -3, -4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffffff, 0.8, 40);
  fillLight.position.set(0, 6, 6);
  scene.add(fillLight);

  // ---- Central group: floating "BMS" built from extruded-look boxes ----
  const group = new THREE.Group();
  scene.add(group);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.9, roughness: 0.25,
    emissive: 0xff6b00, emissiveIntensity: 0.06,
  });
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xff6b00, metalness: 0.6, roughness: 0.3,
    emissive: 0xff6b00, emissiveIntensity: 0.9,
  });

  // Build simple blocky letterforms using boxes (stylized monogram, not text geometry)
  function makeBar(w,h,d){ return new THREE.BoxGeometry(w,h,d); }

  function letterB(x){
    const g = new THREE.Group();
    const spine = new THREE.Mesh(makeBar(0.35,3,0.35), metalMat); spine.position.set(x,0,0); g.add(spine);
    const bump1 = new THREE.Mesh(new THREE.TorusGeometry(0.55,0.16,12,24,Math.PI), metalMat);
    bump1.rotation.z = -Math.PI/2; bump1.position.set(x+0.5,0.75,0); g.add(bump1);
    const bump2 = new THREE.Mesh(new THREE.TorusGeometry(0.55,0.16,12,24,Math.PI), metalMat);
    bump2.rotation.z = -Math.PI/2; bump2.position.set(x+0.5,-0.75,0); g.add(bump2);
    return g;
  }
  function letterM(x){
    const g = new THREE.Group();
    const l1 = new THREE.Mesh(makeBar(0.32,3,0.35), metalMat); l1.position.set(x-0.9,0,0); g.add(l1);
    const l2 = new THREE.Mesh(makeBar(0.32,3,0.35), metalMat); l2.position.set(x+0.9,0,0); g.add(l2);
    const m1 = new THREE.Mesh(makeBar(0.3,1.9,0.35), edgeMat); m1.position.set(x-0.35,0.5,0); m1.rotation.z = Math.PI/3.6; g.add(m1);
    const m2 = new THREE.Mesh(makeBar(0.3,1.9,0.35), edgeMat); m2.position.set(x+0.35,0.5,0); m2.rotation.z = -Math.PI/3.6; g.add(m2);
    return g;
  }
  function letterS(x){
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.TorusGeometry(0.55,0.16,12,24,Math.PI*1.35), edgeMat);
    top.position.set(x,0.72,0); top.rotation.z = Math.PI*0.75; g.add(top);
    const bot = new THREE.Mesh(new THREE.TorusGeometry(0.55,0.16,12,24,Math.PI*1.35), edgeMat);
    bot.position.set(x,-0.72,0); bot.rotation.z = -Math.PI*0.25; g.add(bot);
    return g;
  }

  const B = letterB(-3.4);
  const M = letterM(0);
  const S = letterS(3.4);
  group.add(B, M, S);
  group.scale.set(0.95,0.95,0.95);

  // Floating geometric particles/objects
  const floaters = new THREE.Group();
  scene.add(floaters);
  const floaterGeo = [
    new THREE.IcosahedronGeometry(0.18,0),
    new THREE.OctahedronGeometry(0.16,0),
    new THREE.TetrahedronGeometry(0.2,0),
  ];
  const floaterMat = new THREE.MeshStandardMaterial({ color:0xff6b00, metalness:0.7, roughness:0.3, emissive:0xff6b00, emissiveIntensity:0.4 });
  const floaterMeshes = [];
  for (let i=0;i<40;i++){
    const geo = floaterGeo[i % floaterGeo.length];
    const mesh = new THREE.Mesh(geo, floaterMat);
    const radius = 6 + Math.random()*8;
    const theta = Math.random()*Math.PI*2;
    const y = (Math.random()-0.5)*10;
    mesh.position.set(Math.cos(theta)*radius, y, Math.sin(theta)*radius - 4);
    mesh.userData = { speed: 0.1 + Math.random()*0.3, offset: Math.random()*Math.PI*2 };
    floaters.add(mesh);
    floaterMeshes.push(mesh);
  }

  // Particle field (points)
  const particleCount = 500;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount*3);
  for (let i=0;i<particleCount;i++){
    positions[i*3] = (Math.random()-0.5)*40;
    positions[i*3+1] = (Math.random()-0.5)*40;
    positions[i*3+2] = (Math.random()-0.5)*40 - 10;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const particleMat = new THREE.PointsMaterial({ color:0xff6b00, size:0.045, transparent:true, opacity:0.5 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse parallax
  let targetRotX = 0, targetRotY = 0;
  let camTargetX = 0, camTargetY = 0;
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    targetRotY = nx * 0.4;
    targetRotX = ny * 0.25;
    camTargetX = nx * 1.2;
    camTargetY = -ny * 0.8;
  });

  // Camera fly-in on load
  let flyProgress = 0;
  const flyStartZ = 26;
  camera.position.z = flyStartZ;

  function resize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Camera fly-in easing
    if (flyProgress < 1){
      flyProgress += 0.008;
      const eased = 1 - Math.pow(1 - Math.min(flyProgress,1), 3);
      camera.position.z = flyStartZ + (14 - flyStartZ) * eased;
    }

    // Smooth mouse-based rotation
    group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
    group.rotation.y += 0.0015; // slow autonomous rotation

    camera.position.x += (camTargetX - camera.position.x) * 0.03;
    camera.position.y += (camTargetY - camera.position.y) * 0.03;
    camera.lookAt(0,0,0);

    // Bobbing
    group.position.y = Math.sin(t*0.6) * 0.25;

    // Floaters drift
    floaterMeshes.forEach(m => {
      m.rotation.x += m.userData.speed * 0.01;
      m.rotation.y += m.userData.speed * 0.008;
      m.position.y += Math.sin(t*m.userData.speed + m.userData.offset) * 0.003;
    });
    floaters.rotation.y = t * 0.02;

    // Particle drift
    particles.rotation.y = t * 0.01;

    // Light pulse
    keyLight.intensity = 3.5 + Math.sin(t*1.5)*0.5;

    renderer.render(scene, camera);
  }
  animate();
})();
