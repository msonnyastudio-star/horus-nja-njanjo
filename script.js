// ===== Lecteur musique (API YouTube) : lecture sur le site + enchaînement automatique =====
const buttons = [...document.querySelectorAll('#tracklist button')];
const nowTitle = document.getElementById('now-title');
let current = 0;
let ytPlayer = null;

function markActive(i) {
  buttons.forEach((b, n) => {
    b.classList.toggle('active', n === i);
    b.querySelector('span').textContent = n === i ? '♫' : '▶';
  });
  nowTitle.textContent = buttons[i].dataset.title;
}

function playIndex(i, autoplay = true) {
  current = (i + buttons.length) % buttons.length;
  const id = buttons[current].dataset.video;
  markActive(current);
  if (ytPlayer && ytPlayer.loadVideoById) {
    autoplay ? ytPlayer.loadVideoById(id) : ytPlayer.cueVideoById(id);
  } else {
    // Secours si l'API YouTube ne charge pas : simple iframe
    document.getElementById('player').outerHTML =
      `<iframe id="player" src="https://www.youtube.com/embed/${id}?rel=0${autoplay ? '&autoplay=1' : ''}" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  }
}

buttons.forEach((b, i) => b.addEventListener('click', () => playIndex(i)));

// Boutons "Écouter" ailleurs sur la page
document.querySelectorAll('[data-play]').forEach(el => el.addEventListener('click', () => {
  const i = buttons.findIndex(b => b.dataset.video === el.dataset.play);
  playIndex(i < 0 ? 0 : i);
  document.getElementById('musique').scrollIntoView({ behavior: 'smooth' });
}));

window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player('player', {
    videoId: buttons[0].dataset.video,
    playerVars: { rel: 0, playsinline: 1 },
    events: {
      onStateChange: e => { if (e.data === YT.PlayerState.ENDED) playIndex(current + 1); }
    }
  });
  markActive(0);
};
const api = document.createElement('script');
api.src = 'https://www.youtube.com/iframe_api';
api.onerror = () => playIndex(0, false);
document.head.appendChild(api);

// ===== Galerie : agrandir une photo =====
const lightbox = document.getElementById('lightbox');
const lightImg = lightbox.querySelector('img');
document.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => {
  lightImg.src = img.src;
  lightImg.alt = img.alt;
  lightbox.showModal();
}));
lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('close')) lightbox.close(); });

// ===== Animations au d�filement (Scroll Reveal) =====
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));


// ===== Parallax Hero =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroImg = document.querySelector('.hero-figure');
  if(heroImg && scrollY < window.innerHeight) {
    heroImg.style.transform = "translateY(px) scale()";
  }
});

