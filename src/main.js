import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SplitType from 'split-type';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin);

// Lenis Slower & Silky Smooth Scroll Setup
const lenis = new Lenis({
  duration: 1.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.65, // Reduces scroll speed for a slower, smooth scroll experience
  touchMultiplier: 1.2
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Force 3D rendering
gsap.config({ force3D: true });

// Preloader Curtain Reveal
function Er() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  const curtainTop = loader.children[0];
  const curtainBottom = loader.children[1];
  const progressEl = document.querySelector('.progress');

  gsap.to(curtainTop, { delay: 1, duration: 0.8, height: 0, ease: 'expoScale(0.5,7,none)' });
  gsap.to(curtainBottom, { delay: 1, duration: 0.8, height: 0, ease: 'expoScale(0.5,7,none)' });
  if (progressEl) {
    gsap.to(progressEl, { delay: 1, duration: 0.8, opacity: 0, ease: 'expoScale(0.5,7,none)' });
  }
}

// Preloader Progress Counter
function initProgressCounter() {
  const progressEl = document.querySelector('.progress');
  if (!progressEl) return;

  const progressObj = { innerText: 0 };
  gsap.to(progressObj, {
    innerText: 100,
    duration: 3,
    ease: 'power3.inOut',
    snap: { innerText: 10 },
    onUpdate: function () {
      const val = Math.round(progressObj.innerText);
      const roundedVal = Math.round(val / 10) * 10;
      if (progressEl) {
        progressEl.innerText = roundedVal < 10 ? `0${roundedVal}` : `${roundedVal}`;
      }
    },
    onComplete: function () {
      if (progressEl) {
        gsap.to(progressEl, {
          opacity: 0,
          duration: 1,
          onComplete: () => progressEl.remove()
        });
      }
    }
  });
}

// Hero Title & Subtitle Split Animations
function initHeroText() {
  const h1 = document.querySelector('h1');
  const subTitle = document.querySelector('.sub-title');

  if (h1) {
    new SplitType(h1, { types: 'words' });
    gsap.from('h1 .word', {
      yPercent: 110,
      delay: 1,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.3,
      opacity: 0
    });
  }

  if (subTitle) {
    new SplitType(subTitle, { types: 'lines' });
    gsap.from('.sub-title .line', {
      yPercent: -110,
      delay: 1.4,
      duration: 1.2,
      ease: 'power3.out',
      opacity: 0
    });
  }
}

// Stacked Hero Cards Fan-Out & About Section Flip
const irregulars = [0, 0, 0, 4, -8, -12];

function getArcPos({ index, containerWidth, arcHeight, irregularsArr, tiltAdjust = 7, totalItems }) {
  const step = containerWidth / totalItems;
  const mid = (totalItems - 1) / 2;
  const x = (index - mid) * step;
  const y = arcHeight * Math.sin((Math.PI / (totalItems - 1)) * index);
  const tiltAngle = (index - (totalItems - 1) / 2) * tiltAdjust;
  const topPosition = arcHeight - y + irregularsArr[index];
  return { x, y, tiltAngle, topPosition };
}

function generateSmoothArcKeyframes(numPoints = 24, isMobile = false) {
  const points = [];
  const endX = isMobile ? 180 : 250;
  const controlX = isMobile ? 130 : 160;
  const controlY = isMobile ? -70 : -90;
  const endY = isMobile ? 160 : 200;
  const maxRot = isMobile ? 25 : 35;

  for (let i = 1; i <= numPoints; i++) {
    const t = i / numPoints;
    // Smooth 24-point Quadratic Bezier trajectory: B(t) = 2(1-t)t * P1 + t^2 * P2
    const xP = 2 * (1 - t) * t * controlX + t * t * endX;
    const yP = 2 * (1 - t) * t * controlY + t * t * endY;
    const rot = t * maxRot;
    const op = t > 0.7 ? Math.max(0, 1 - (t - 0.7) / 0.3) : 1;

    points.push({
      xPercent: xP,
      yPercent: yP,
      rotation: rot,
      opacity: op,
      duration: 1 / numPoints,
      ease: 'none'
    });
  }
  return points;
}

function wr() {
  const stackedCards = document.querySelector('.stacked-cards');
  const items = document.querySelectorAll('.stacked-cards .item');
  if (!stackedCards || items.length === 0) return;

  const totalItems = items.length;
  const isMobile = window.innerWidth < 1024;
  const stepY = isMobile ? 48 : 70;

  const masterHeroTl = gsap.timeline();

  items.forEach((item, index) => {
    // Every card's left side sits off-screen to the left; together they form a right-facing convex arc curve
    const yPos = (index - 2) * stepY;
    const arcBulge = Math.sin((index / (totalItems - 1)) * Math.PI) * (isMobile ? 70 : 120);
    const xPos = arcBulge - (isMobile ? 30 : 50);
    const tiltAngle = (index - 2) * (isMobile ? 6 : 9);

    // Initial state: coming up from out of the bottom screen
    gsap.set(item, {
      x: xPos - 250,
      y: yPos + 450,
      rotation: tiltAngle - 15,
      scale: 0.85,
      opacity: 0,
      transformOrigin: 'center center'
    });

    // Animate into hero position with soft faded colors behind z-30 foreground text
    const l = gsap.timeline();
    l.to(item, {
      delay: 0.4 + index * 0.12,
      opacity: 0.45, // Soft faded background opacity so foreground text is 100% clear
      scale: 1,
      x: xPos,
      y: yPos,
      top: 0,
      rotation: tiltAngle,
      duration: 1.4,
      ease: 'elastic.out(1, 0.75)'
    });

    masterHeroTl.add(l, 0);
  });

  // Master timeline complete -> Bind ScrollTrigger transition to About section
  masterHeroTl.call(() => {
    const aboutContainer = document.querySelector('.about-container');
    const heroCardWrap = document.querySelector('.cards-container');
    if (!aboutContainer || !heroCardWrap) return;

    // Respect prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      ScrollTrigger.create({
        trigger: '.about-section',
        start: 'top 80%',
        onEnter: () => aboutContainer.appendChild(stackedCards),
        onLeaveBack: () => heroCardWrap.appendChild(stackedCards)
      });
      return;
    }

    // Capture initial Flip state in Hero position
    const state = Flip.getState(stackedCards);

    // Single scrubbed transition timeline: cards sweep down and right along curved path into About section
    const flipTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 95%',
        end: 'top 15%',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onEnter: () => aboutContainer.appendChild(stackedCards),
        onLeaveBack: () => heroCardWrap.appendChild(stackedCards)
      }
    });

    // Fade cards to full opacity during scroll transition
    flipTl.to(items, { opacity: 1, duration: 1, stagger: 0.05 }, 0);

    // Flip transition from Hero bounds to About section container (curved bezier path calculation)
    flipTl.add(Flip.from(state, { duration: 1, ease: 'sine.inOut', absolute: true, spin: false }), 0);

    // Reset card item offsets to assemble neatly in About container
    items.forEach((item) => {
      flipTl.to(item, {
        x: 0,
        y: 0,
        rotation: 0,
        top: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0);
    });
  });

  // Split About paragraphs into lines for top-to-bottom staggered line transitions
  const paraElements = document.querySelectorAll('.about-para');
  const paraSplits = Array.from(paraElements).map((el) => {
    return new SplitType(el, { types: 'lines', lineClass: 'para-line' });
  });

  // Pinned About section sequence: Smooth, slower card depth zoom reveals & synced paragraph text transitions
  const mmPin = gsap.matchMedia();
  mmPin.add('(min-width: 1024px)', () => {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top top',
        end: '+=3800',
        pin: true,
        pinSpacing: true,
        scrub: 1.2
      }
    });

    // Step 1: Yellow card (items[4]) scales to 1.45, background cards start small (0.78) and semi-transparent
    aboutTl.to(items[4], {
      scale: 1.45,
      x: 50,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    // Step 1: Yellow card (items[4]) scales to 1.45, background cards start small (0.78) and completely hidden (opacity: 0)
    aboutTl.to(items[4], {
      scale: 1.45,
      x: 50,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    aboutTl.to([items[3], items[2], items[1], items[0]], {
      scale: 0.78,
      x: 50,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    const desktopArcKeyframes = generateSmoothArcKeyframes(24, false);

    // Step 2: Yellow card exits -> Red TypeScript card (items[3]) zooms & fades in from hidden (0.78, opacity 0) to full size (1.45, opacity 1)
    aboutTl.to(items[4], { keyframes: desktopArcKeyframes }, 'step2');
    aboutTl.fromTo(items[3], { scale: 0.78, opacity: 0 }, { scale: 1.45, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step2+=0.1');
    aboutTl.to('.about-para-0', { y: 180, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step2');
    aboutTl.fromTo('.about-para-1', { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step2+=0.2');

    // Step 3: TypeScript card exits -> Laravel card (items[2]) zooms & fades in from hidden (0.78, opacity 0) to full size (1.45, opacity 1)
    aboutTl.to(items[3], { keyframes: desktopArcKeyframes }, 'step3+=0.4');
    aboutTl.fromTo(items[2], { scale: 0.78, opacity: 0 }, { scale: 1.45, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step3+=0.5');
    aboutTl.to('.about-para-1', { y: 180, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step3+=0.4');
    aboutTl.fromTo('.about-para-2', { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step3+=0.6');

    // Step 4: Laravel card exits -> Next JS card (items[1]) zooms & fades in from hidden (0.78, opacity 0) to full size (1.45, opacity 1)
    aboutTl.to(items[2], { keyframes: desktopArcKeyframes }, 'step4+=0.4');
    aboutTl.fromTo(items[1], { scale: 0.78, opacity: 0 }, { scale: 1.45, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step4+=0.5');
    aboutTl.to('.about-para-2', { y: 180, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step4+=0.4');
    aboutTl.fromTo('.about-para-3', { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step4+=0.6');

    // Step 5: Next JS card exits -> React JS card (items[0]) zooms & fades in from hidden (0.78, opacity 0) to full size (1.45, opacity 1)
    aboutTl.to(items[1], { keyframes: desktopArcKeyframes }, 'step5+=0.4');
    aboutTl.fromTo(items[0], { scale: 0.78, opacity: 0 }, { scale: 1.45, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step5+=0.5');
    aboutTl.to('.about-para-3', { y: 180, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step5+=0.4');
    aboutTl.fromTo('.about-para-4', { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step5+=0.6');

    // Text highlight transition
    aboutTl.to('.text-highlight', {
      stagger: 0.25,
      color: '#990900',
      duration: 2
    }, 0);

    aboutTl.to({}, { duration: 0.4 });
  });

  mmPin.add('(max-width: 1023px)', () => {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top top',
        end: '+=2600',
        pin: true,
        pinSpacing: true,
        scrub: 1.2
      }
    });

    aboutTl.to(items[4], {
      scale: 1.25,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    aboutTl.to([items[3], items[2], items[1], items[0]], {
      scale: 0.72,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    const mobileArcKeyframes = generateSmoothArcKeyframes(24, true);

    aboutTl.to(items[4], { keyframes: mobileArcKeyframes }, 'step2');
    aboutTl.fromTo(items[3], { scale: 0.72, opacity: 0 }, { scale: 1.25, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step2+=0.1');
    aboutTl.to('.about-para-0', { y: 150, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step2');
    aboutTl.fromTo('.about-para-1', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step2+=0.2');

    aboutTl.to(items[3], { keyframes: mobileArcKeyframes }, 'step3+=0.4');
    aboutTl.fromTo(items[2], { scale: 0.72, opacity: 0 }, { scale: 1.25, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step3+=0.5');
    aboutTl.to('.about-para-1', { y: 150, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step3+=0.4');
    aboutTl.fromTo('.about-para-2', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step3+=0.6');

    aboutTl.to(items[2], { keyframes: mobileArcKeyframes }, 'step4+=0.4');
    aboutTl.fromTo(items[1], { scale: 0.72, opacity: 0 }, { scale: 1.25, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step4+=0.5');
    aboutTl.to('.about-para-2', { y: 150, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step4+=0.4');
    aboutTl.fromTo('.about-para-3', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step4+=0.6');

    aboutTl.to(items[1], { keyframes: mobileArcKeyframes }, 'step5+=0.4');
    aboutTl.fromTo(items[0], { scale: 0.72, opacity: 0 }, { scale: 1.25, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'step5+=0.5');
    aboutTl.to('.about-para-3', { y: 150, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'step5+=0.4');
    aboutTl.fromTo('.about-para-4', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 'step5+=0.6');

    aboutTl.to('.text-highlight', {
      stagger: 0.2,
      color: '#990900',
      duration: 1.8
    }, 0);

    aboutTl.to({}, { duration: 0.3 });
  });
}

// Fade-Up and Fade-In Batch Helpers
function fr(targets, vars = {}, stOptions = {}, setVars = {}) {
  const isMobile = window.innerWidth <= 1023;
  gsap.set(targets, { y: 50, opacity: 0, ...setVars });
  ScrollTrigger.batch(targets, {
    onEnter: (batch) =>
      gsap.to(batch, {
        force3D: true,
        duration: vars.duration ?? 1,
        autoAlpha: vars.autoAlpha ?? 1,
        y: vars.y ?? 0,
        opacity: vars.opacity ?? 1,
        stagger: vars.stagger ?? 0.15,
        overwrite: true
      }),
    once: true,
    start: stOptions?.start ?? (isMobile ? 'top 90%' : 'top 85%'),
    ...stOptions
  });
}

function pr(targets, vars = {}, stOptions = {}, setVars = {}) {
  const isMobile = window.innerWidth <= 1023;
  gsap.set(targets, { y: 0, opacity: 0, filter: 'blur(10px)', ...setVars });
  ScrollTrigger.batch(targets, {
    onEnter: (batch) =>
      gsap.to(batch, {
        duration: vars.duration ?? 1,
        autoAlpha: vars.autoAlpha ?? 1,
        y: vars.y ?? 0,
        opacity: vars.opacity ?? 1,
        stagger: vars.stagger ?? 0.1,
        filter: 'blur(0px)'
      }),
    once: true,
    start: stOptions?.start ?? (isMobile ? 'top 90%' : 'top 85%'),
    ...stOptions
  });
}

function wrapElements(elements, wrapperTag = 'div', wrapperClass = '') {
  elements.forEach((el) => {
    const wrapper = document.createElement(wrapperTag);
    if (wrapperClass) wrapper.className = wrapperClass;
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

function br() {
  const lineFadeEls = document.querySelectorAll('.line-fade');
  if (lineFadeEls.length === 0) return;

  const split = new SplitType(lineFadeEls, { types: 'lines' });
  wrapElements(split.lines, 'div', 'overflow-hidden');

  gsap.set('.line', { opacity: 0 });
  gsap.set('.fade-up, .fadeup', { opacity: 0, y: 50 });

  ScrollTrigger.create({
    trigger: '.about-section',
    start: 'top 30%',
    end: 'bottom 70%',
    scrub: true,
    immediateRender: false,
    onEnter: () => {
      gsap.killTweensOf(split.lines);
      gsap.timeline({ defaults: { duration: 2.2, ease: 'expo' } })
        .set(split.lines, { y: '150%', rotate: 0, opacity: 0 })
        .to(split.lines, { y: '0%', rotate: 0, stagger: 0.04, opacity: 1 });
    },
    once: true
  });
}

// Featured Work Arc Position & Scroll Timeline
function calcRadius() {
  const e = window.innerWidth;
  const t = [
    { max: 600, factor: 7 },
    { max: 768, factor: 5.5 },
    { max: 992, factor: 3 },
    { max: 1024, factor: 3.5 }
  ];
  const { factor: r } = t.find(({ max: n }) => e < n) || { factor: 3 };
  return e * r;
}

function updateArcPosition(progress = 0) {
  const t = document.querySelectorAll('.featured-item');
  const r = t.length;
  if (r === 0) return;

  const n = Math.PI / 2.2;
  const i = Math.PI / 2 - n / 2;
  const o = calcRadius();
  const s = 1 + r / 5.5;
  const u = (progress * s - 1) * 0.75;

  t.forEach((l, c) => {
    const f = (r - 1 - c) / r + u;
    const y = i + n * f;
    const m = Math.cos(y) * o;
    const d = Math.sin(y) * o;
    const p = (y - Math.PI / 2) * (180 / Math.PI);
    gsap.set(l, {
      x: m,
      y: -d + o,
      rotation: -p,
      transformOrigin: 'center center'
    });
  });
}

function Sr() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    ScrollTrigger.create({
      trigger: '.featured-section',
      start: 'top top',
      end: '+=5000px',
      pin: true,
      scrub: true,
      onUpdate: (n) => updateArcPosition(n.progress)
    });
  });

  mm.add('(max-width: 1024px)', () => {
    ScrollTrigger.create({
      trigger: '.featured-section',
      start: 'top top',
      end: '+=3000px',
      pin: true,
      onUpdate: (n) => updateArcPosition(n.progress)
    });
  });

  const e = window.innerWidth < 1024 ? 2000 * 0.85 : 4000 * 0.85;
  const t = gsap.timeline();
  const featuredContent = document.querySelector('.featured-content');
  if (!featuredContent) return;

  const r = new SplitType(featuredContent, { types: 'lines, chars' });

  gsap.set('.featured-content', { opacity: 0 });
  gsap.set('.featured-title', { opacity: 0, y: 100 });

  gsap.to('.featured-content', {
    scrollTrigger: {
      trigger: '.featured-container',
      start: `top+=${e - 300} top`,
      end: 'bottom bottom',
      scrub: true,
      immediateRender: false
    },
    opacity: 1
  });

  gsap.to('.featured-title', {
    scrollTrigger: {
      trigger: '.featured-content',
      start: 'top 60%',
      end: 'bottom top',
      scrub: true,
      immediateRender: false
    },
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: 'power2.out'
  });

  t.to(r.chars, {
    scrollTrigger: {
      trigger: '.featured-container',
      start: `top+=${e} top`,
      end: 'bottom 80%',
      scrub: true,
      immediateRender: false
    },
    opacity: 1,
    color: '#000',
    ease: 'power4.out',
    stagger: 0.04,
    duration: 1.2
  });
}

// Experience Section Setup
function Tr() {
  gsap.set('.experience-title', { opacity: 0, y: 100 });
  gsap.to('.experience-title', {
    scrollTrigger: {
      trigger: '.featured-content',
      start: 'top 60%',
      end: 'bottom top',
      scrub: true,
      immediateRender: false
    },
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: 'power2.out'
  });

  gsap.set('.exp-entry', { opacity: 0, y: 50 });
  gsap.set('.exp-index', { opacity: 0, x: -16 });

  document.querySelectorAll('.exp-entry').forEach((e) => {
    const t = e.querySelector('.exp-index');
    gsap.to(e, {
      scrollTrigger: {
        trigger: e,
        start: 'top 82%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    });

    if (t) {
      gsap.to(t, {
        scrollTrigger: {
          trigger: e,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.15,
        ease: 'power2.out'
      });
    }
  });
}

// 3D Perspective Tunnel Gallery Class
class TunnelGallery {
  constructor(t) {
    if (!t || !(t instanceof HTMLElement)) throw new Error('Invalid element provided.');
    this.wrapElement = t;
    this.contentElement = this.wrapElement.querySelector('.content');
    if (!this.contentElement) return;
    this.imageElements = Array.from(this.contentElement.querySelectorAll('.anim-card'));
    this.imagesTotal = this.imageElements.length;
    this.initializeEffect(t);
  }

  initializeEffect() {
    this.scroll();
    let timeout = false;
    window.addEventListener('resize', () => {
      if (!timeout) {
        this.scroll();
        timeout = true;
        setTimeout(() => (timeout = false), 100);
      }
    });
  }

  scroll() {
    if (!this.contentElement) return;
    this.contentElement.style.transform = 'rotate3d(1, 0, 0, -25deg) rotate3d(0, 1, 0, 50deg) rotate3d(0, 0, 1, 25deg)';
    this.contentElement.style.opacity = '0';

    if (this.tl) this.tl.kill();

    const width = window.innerWidth;

    this.tl = gsap.timeline({
      defaults: { ease: 'power1' },
      scrollTrigger: {
        trigger: this.wrapElement,
        start: 'top center',
        end: '+=210%',
        scrub: 1,
        onEnter: () => gsap.set(this.contentElement, { opacity: 1 }),
        onEnterBack: () => gsap.set(this.contentElement, { opacity: 1 }),
        onLeave: () => gsap.set(this.contentElement, { opacity: 0 }),
        onLeaveBack: () => gsap.set(this.contentElement, { opacity: 0 })
      }
    })
      .fromTo(
        this.imageElements,
        { z: (t) => -2.25 * width - t * 0.03 * width },
        { z: (t) => 1.8 * width + (this.imagesTotal - t - 1) * 0.03 * width },
        0
      )
      .fromTo(
        this.imageElements,
        { rotationZ: -220 },
        { rotationY: -30, rotationZ: 120, stagger: 0.005 },
        0
      );
  }
}

// Master On-Load Controller
function _r() {
  setTimeout(() => {
    gsap.to(window, { duration: 0, scrollTo: 0 });
  }, 50);

  setTimeout(() => {
    pr('.fade-in', { duration: 0.4, stagger: 0.04 }, { start: 'top 70%' });
    fr('.fade-up, .fadeup', { duration: 0.4, stagger: 0.04 }, { start: 'top 70%' });
    br();
    Sr();
    updateArcPosition(0);
    Tr();
    document.querySelectorAll('[data-stack-1]').forEach((e) => {
      new TunnelGallery(e);
    });
  }, 200);
}

window.addEventListener('resize', () => {
  updateArcPosition();
});

// Run Preloader & Hero Boot Setup
Er();
initProgressCounter();
wr();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroText);
} else {
  initHeroText();
}

window.addEventListener('load', _r);
