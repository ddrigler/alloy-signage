// point directly to your real playlist on GitHub Pages
const PLAYLIST_URL = 'https://ddrigler.github.io/alloy-signage/playlist.json';

const app = document.getElementById('app');
const captionEl = document.getElementById('caption');

let slides = [];
let index = -1;
let defaultDuration = 10;

async function loadPlaylist() {
  const res = await fetch(PLAYLIST_URL + '?t=' + Date.now());
  if (!res.ok) {
    throw new Error('Could not load playlist.json');
  }
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

  const duration = slide.duration ? Number(slide.duration) : defaultDuration;

  // detect video by extension or by type
  const isVideo =
    slide.type === 'video' ||
    (slide.src && slide.src.match(/\.(mp4|webm|ogg)$/i));

  if (isVideo) {
    const video = document.createElement('video');
    video.src = slide.src;
    video.autoplay = true;
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.style.maxWidth = '100%';
    video.style.maxHeight = '100%';
    app.appendChild(video);
    setTimeout(nextSlide, duration * 1000);
  } else {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.caption || '';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    app.appendChild(img);
    setTimeout(nextSlide, duration * 1000);
  }
}

function nextSlide() {
  if (!slides.length) {
    app.innerHTML = '<div>No slides to show</div>';
    return;
  }
  index = (index + 1) % slides.length;
  showSlide(slides[index]);
}

async function start() {
  try {
    await loadPlaylist();
    if (!slides.length) {
      app.innerHTML = '<div>Playlist is empty</div>';
      return;
    }
    nextSlide();
    // refresh playlist every 10 minutes
    setInterval(loadPlaylist, 10 * 60 * 1000);
  } catch (err) {
    console.error(err);
    app.innerHTML = '<div>Error loading playlist</div>';
  }
}

start();
