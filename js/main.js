/* =====================================================
   ELITEFORCE FITNESS — main.js
===================================================== */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nm-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nm-link[href="#${id}"]`);
    if (!link) return;
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
});

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
    else { el.textContent = Math.floor(current).toLocaleString(); }
  }, 16);
}

const counters = document.querySelectorAll('.hs-num[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ── GALLERY LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── BMI CALCULATOR ── */
document.getElementById('bmiCalc').addEventListener('click', () => {
  const height = parseFloat(document.getElementById('bmiHeight').value);
  const weight = parseFloat(document.getElementById('bmiWeight').value);

  if (!height || !weight || height < 100 || weight < 20) {
    alert('Please enter valid height and weight values.');
    return;
  }

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  let label, advice, fillPercent, color;

  if (bmi < 18.5) {
    label = 'Underweight'; color = '#3498db';
    advice = '⚡ You need to build lean muscle mass. Our trainers recommend a structured weight training program with a high-calorie diet plan. Book a free consultation today!';
    fillPercent = (bmi / 40) * 100 * 0.6;
  } else if (bmi < 25) {
    label = 'Normal Weight ✓'; color = '#2ecc71';
    advice = '💪 Great job! Your BMI is in the healthy range. Our trainers can help you build strength, tone your body and reach peak performance with a customised plan!';
    fillPercent = 30 + ((bmi - 18.5) / 6.5) * 25;
  } else if (bmi < 30) {
    label = 'Overweight'; color = '#f39c12';
    advice = '🔥 Our certified trainers specialise in fat-loss programs tailored for your body type. Combined with a proper diet plan, you can see results within 60 days!';
    fillPercent = 55 + ((bmi - 25) / 5) * 20;
  } else {
    label = 'Obese'; color = '#e74c3c';
    advice = '❤️ Don\'t worry — EliteForce trainers have helped hundreds of members successfully transform their health. Start with a FREE trial session, no commitment!';
    fillPercent = Math.min(90, 75 + ((bmi - 30) / 10) * 15);
  }

  const resultEl  = document.getElementById('bmiResult');
  const scoreEl   = document.getElementById('brScore');
  const labelEl   = document.getElementById('brLabel');
  const fillEl    = document.getElementById('brFill');
  const adviceEl  = document.getElementById('brAdvice');

  scoreEl.textContent  = bmi;
  scoreEl.style.color  = color;
  labelEl.textContent  = label;
  labelEl.style.color  = color;
  adviceEl.textContent = advice;

  resultEl.style.display = 'block';
  setTimeout(() => { fillEl.style.marginLeft = Math.min(96, fillPercent) + '%'; }, 100);
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ── WHATSAPP FLOAT hide on top ── */
window.addEventListener('scroll', () => {
  const waFloat   = document.getElementById('waFloat');
  const callFloat = document.getElementById('callFloat');
  if (!waFloat) return;
  if (window.scrollY < 300) {
    waFloat.style.opacity   = '0';
    waFloat.style.pointerEvents = 'none';
    callFloat.style.opacity = '0';
    callFloat.style.pointerEvents = 'none';
  } else {
    waFloat.style.opacity   = '1';
    waFloat.style.pointerEvents = 'auto';
    callFloat.style.opacity = '1';
    callFloat.style.pointerEvents = 'auto';
  }
});
