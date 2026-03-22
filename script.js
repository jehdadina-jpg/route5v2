
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } });
}, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
document.querySelectorAll('.fi').forEach(el => io.observe(el));
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
const termBox = document.querySelector('.term-box');
if (termBox) {
  const termObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); termObs.disconnect(); } });
  }, { threshold: 0.3 });
  termObs.observe(termBox);
}
let typed = false;
const lastLine = document.querySelectorAll('.tl');
if (lastLine.length) {
  const lastObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !typed) {
        typed = true;
        const cursor = document.querySelector('.cursor');
        if (cursor) { cursor.style.animationDuration = '0.4s'; setTimeout(() => { cursor.style.animationDuration = '1s'; }, 2000); }
      }
    });
  }, { threshold: 0.8 });
  lastObs.observe(lastLine[lastLine.length - 1]);
}
document.querySelectorAll('.p3-card, .how-card, .why-card, .trust-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
