/**
 * METODO_B — Main JavaScript
 * Scroll animations, navigation, and interactions
 */

import './style.css';

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initHeroEntrance();
  initContactForm();
  initWhatsAppBubble();
});

// ============================================
// NAV SCROLL STATE
// ============================================
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;
  const updateNav = () => {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('nav--scrolled', scrolled);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('nav__links--open');
    toggle.classList.toggle('nav__toggle--open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!links.classList.contains('nav__links--open')) return;
    if (!links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('nav__links--open')) {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.anim-fade-up, .anim-fade-in, .anim-stagger'
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Don't unobserve stagger containers so children benefit
          if (!entry.target.classList.contains('anim-stagger')) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ============================================
// HERO ENTRANCE (immediate, no scroll needed)
// ============================================
function initHeroEntrance() {
  const heroElements = document.querySelectorAll(
    '.hero__tagline, .hero__title, .hero__subtitle, .hero__cta'
  );

  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // Images fade in with slight delay
  const heroImages = document.querySelectorAll('.hero__img');
  heroImages.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 150}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 150}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      ) || 72;

      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  const updateActive = () => {
    const scrollY = window.scrollY + 150;

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('nav__link--active', href === current);
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateActive();
})();

// ============================================
// CONTACT FORM -> WHATSAPP
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const PHONE = '5493417849868';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const email = form.email.value.trim();
    const interes = form.interes.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !interes) {
      // Simple validation feedback
      form.querySelectorAll('[required]').forEach((el) => {
        if (!el.value.trim()) {
          el.style.borderColor = '#C44';
          setTimeout(() => { el.style.borderColor = ''; }, 2000);
        }
      });
      return;
    }

    const parts = [
      `*Nueva consulta — METODO_B*`,
      ``,
      `*Nombre:* ${nombre}`,
    ];

    if (telefono) parts.push(`*Teléfono:* ${telefono}`);
    if (email) parts.push(`*Email:* ${email}`);
    parts.push(`*Método de interés:* ${interes}`);
    if (mensaje) {
      parts.push(``);
      parts.push(`*Mensaje:*`);
      parts.push(mensaje);
    }

    const text = encodeURIComponent(parts.join('\n'));
    const url = `https://wa.me/${PHONE}?text=${text}`;

    window.open(url, '_blank', 'noopener');
  });
}

// ============================================
// WHATSAPP FLOATING BUBBLE TOOLTIP
// ============================================
function initWhatsAppBubble() {
  const tooltip = document.getElementById('wpp-tooltip');
  const closeBtn = document.getElementById('wpp-tooltip-close');
  if (!tooltip || !closeBtn) return;

  // Show tooltip after 4 seconds if not closed before
  if (!localStorage.getItem('wpp_tooltip_closed')) {
    setTimeout(() => {
      tooltip.classList.add('wpp-btn__tooltip--visible');
    }, 4000);
  }

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    tooltip.classList.remove('wpp-btn__tooltip--visible');
    localStorage.setItem('wpp_tooltip_closed', 'true');
  });
}

