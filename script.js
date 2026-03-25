
// --- Global Intersection Observer for simple reveals ---
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('vis'); 
      // If it's a staggered container, trigger children
      if (e.target.classList.contains('blur-text')) {
        e.target.querySelectorAll('.blur-word').forEach((word, i) => {
          setTimeout(() => word.classList.add('vis'), i * 60);
        });
      }
    } 
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fi, .scroll-reveal, .blur-text').forEach(el => io.observe(el));

// --- Beams Background Animation ---
class Beams {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.beamCount = options.beamCount || 8;
    this.beamColor = options.beamColor || "#00E5A0"; // reviveai.tech accent
    this.beamOpacity = options.beamOpacity || 0.12;
    this.beams = [];
    this.animFrame = null;

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 229, b: 160 };
    };
    this.rgb = hexToRgb(this.beamColor);

    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    this.initBeams();
  }

  initBeams() {
    this.beams = Array.from({ length: this.beamCount }, (_, i) => ({
      x: (this.canvas.width / this.beamCount) * i + Math.random() * 100 - 50,
      width: Math.random() * 80 + 40,
      height: this.canvas.height + 600,
      angle: Math.random() * 30 - 15,
      opacity: Math.random() * this.beamOpacity + 0.03,
      drift: (Math.random() - 0.5) * 0.4,
    }));
  }

  init() {
    this.resize();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { r, g, b } = this.rgb;

    this.beams.forEach((beam) => {
      this.ctx.save();
      this.ctx.translate(beam.x + beam.width / 2, this.canvas.height / 2);
      this.ctx.rotate((beam.angle * Math.PI) / 180);
      
      const grad = this.ctx.createLinearGradient(0, -beam.height / 2, 0, beam.height / 2);
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${beam.opacity})`);
      grad.addColorStop(0.7, `rgba(${r},${g},${b},${beam.opacity})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(-beam.width / 2, -beam.height / 2, beam.width, beam.height);
      this.ctx.restore();

      beam.x += beam.drift;
      if (beam.x > this.canvas.width + 100) beam.x = -100;
      if (beam.x < -100) beam.x = this.canvas.width + 100;
    });

    this.animFrame = requestAnimationFrame(() => this.draw());
  }
}

// --- ScrambleText Utility ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function scrambleText(element, speed = 40) {
  const finalSource = element.getAttribute('data-text') || element.innerText;
  let iteration = 0;
  const interval = setInterval(() => {
    element.innerText = finalSource.split("")
      .map((char, index) => {
        if (char === " " || char === "→") return char;
        if (index < iteration) return finalSource[index];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    
    iteration += 1/3;
    if (iteration >= finalSource.length) clearInterval(interval);
  }, speed);
}

// --- TrueFocus Utility ---
function initTrueFocus(element, interval = 2000) {
  const words = element.innerText.split(/\s+/);
  element.innerHTML = '';
  element.classList.add('true-focus-container');
  
  const wordSpans = words.map(word => {
    const span = document.createElement('span');
    span.className = 'focus-word';
    span.innerText = word;
    element.appendChild(span);
    return span;
  });

  const ring = document.createElement('span');
  ring.className = 'focus-ring';
  element.appendChild(ring);

  let currentIndex = 0;
  
  const updateFocus = () => {
    wordSpans.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
    const activeSpan = wordSpans[currentIndex];
    const rect = activeSpan.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    
    ring.style.width = `${rect.width + 12}px`;
    ring.style.height = `${rect.height + 6}px`;
    ring.style.left = `${activeSpan.offsetLeft - 6}px`;
    ring.style.top = `${activeSpan.offsetTop - 3}px`;
    
    currentIndex = (currentIndex + 1) % wordSpans.length;
  };

  updateFocus();
  setInterval(updateFocus, interval);
}

// --- Existing Counter Animation Logic ---
function animateCounters() {
  const metrics = [
    { el: document.querySelector('.term-metrics .tm:nth-child(1) .tm-val'), target: '3.8', suffix: 's', decimals: 1 },
    { el: document.querySelector('.term-metrics .tm:nth-child(2) .tm-val'), target: '100', suffix: '%', decimals: 0 },
  ];
  metrics.forEach(({ el, target, suffix, decimals }) => {
    if (!el) return;
    let start = 0; const end = parseFloat(target);
    const dur = 900; const step = 16;
    const inc = end / (dur / step);
    const timer = setInterval(() => {
      start = Math.min(start + inc, end);
      el.innerHTML = start.toFixed(decimals) + `<em>${suffix}</em>`;
      if (start >= end) clearInterval(timer);
    }, step);
  });
}

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  // 1. Beams
  new Beams('beams-canvas');

  // 2. Blur Text (Auto-wrapped in HTML, handled by generic IO)
  
  // 3. Scramble Text (On intersection)
  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        scrambleText(e.target);
        scrambleObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.scramble-on-view').forEach(el => scrambleObserver.observe(el));

  // 4. True Focus
  const statsRow = document.querySelector('.term-metrics');
  if (statsRow) {
      // We'll target the text line inside term-body for TrueFocus as per user request
      // But user said "stat row" - let's do it for the metric labels or the success line.
      // Actually, user said: "3.8s · 100% · 6/6 · 0 human steps" - this is the success line in term-body.
      const okLine = document.querySelector('.tl .ok')?.parentElement;
      if (okLine) {
          // Remove the ✓ and cursor before initializing to keep it clean
          const content = okLine.innerText.replace('✓', '').replace('DONE', '').trim();
          // okLine.innerText = content; // We'll keep the OK for context but focus the stats
          // Let's create a specific container for the stats to focus on
          const statsContent = okLine.querySelector('.dim');
          if (statsContent) initTrueFocus(statsContent, 2200);
      }
  }

  // Mouse Move tracking for cards
  document.querySelectorAll('.p3-card, .how-card, .why-card, .trust-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Term Box Counters
  const termBox = document.querySelector('.term-box');
  if (termBox) {
    const termObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounters(); termObs.disconnect(); } });
    }, { threshold: 0.3 });
    termObs.observe(termBox);
  }
});
