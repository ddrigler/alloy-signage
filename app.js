const PLAYLIST_URL = 'playlist.json';

const app = document.getElementById('app');
const captionEl = document.getElementById('caption');

let slides = [];
let index = -1;
let defaultDuration = 10;

async function loadPlaylist() {
  const res = await fetch(PLAYLIST_URL + '?t=' + Date.now());
  const data = await res.json();
  slides = data.slides || [];
  defaultDuration = data.defaultDuration || 10;
}

function showSlide(slide) {
  app.innerHTML = '';

  const hasCaption = slide.caption && slide.caption.trim().length > 0;
  if (hasCaption) {
    captionEl.style.display = 'block';
    captionEl.textContent = slide.caption;
  } else {
    captionEl.style.display = 'none';
  }

  const duration = (slide.duration && Number(slide.duration)) ? Number(slide.duration) : defaultDuration;

  if (slide.type === 'video' || (slide.src && slide.src.match(/\.(mp4|webm|ogg)$/i))) {
    const video = document.createElement('video');
    video.src = slide.src;
    video.autoplay = true;
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.style.background = '#000';
    app.appendChild(video);
    setTimeout(nextSlide, duration * 1000);
  } else {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.caption || '';
    app.appendChild(img);
    setTimeout(nextSlide, duration * 1000);
  }
}

function nextSlide() {
  if (!slides.length) return;
  index = (index + 1) % slides.length;
  showSlide(slides[index]);
}

async function start() {
  try {
    await loadPlaylist();
    if (!slides.length) {
      app.innerHTML = '<div>No slides in playlist.json</div>';
      return;
    }
    nextSlide();
    // refresh playlist every 10 minutes
    setInterval(loadPlaylist, 10 * 60 * 1000);
  } catch (e) {
    app.innerHTML = '<div>Error loading playlist</div>';
    console.error(e);
  }
}

start();
