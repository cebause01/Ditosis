// ========================================
// DITOSIS - Main JavaScript (Improved)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileMenu();
  initParticles();
  initScrollAnimations();
  initSmoothScroll();
  initServiceButtons();
  initForm();
  initFooterLinks();
  initScrollProgress();
  initBackToTop();
  initNavActiveLinks();
  initCountUpAnimations();
  initTypingEffect();
});

// ========================================
// SCROLL PROGRESS BAR
// ========================================
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / max * 100) + '%';
  }, { passive: true });
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
function initBackToTop() {
  if (document.querySelector('.back-to-top')) return;

  // Create button with SVG progress ring
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg style="position:absolute;top:-3px;left:-3px;width:54px;height:54px;transform:rotate(-90deg)" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle class="btt-ring" cx="27" cy="27" r="24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"
        stroke-dasharray="150.8" stroke-dashoffset="150.8" stroke-linecap="round"
        style="transition:stroke-dashoffset 0.1s linear"/>
    </svg>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="position:relative;z-index:1"><path d="M18 15l-6-6-6 6"/></svg>
  `;
  document.body.appendChild(btn);

  const ring = btn.querySelector('.btt-ring');
  const circumference = 150.8;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    // Show after 200px scroll
    btn.classList.toggle('visible', scrollY > 200);

    // Update progress ring
    if (ring && maxScroll > 0) {
      const progress = scrollY / maxScroll;
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  // If page pre-sets .scrolled (non-home pages), always keep background visible
  const alwaysOn = navbar.classList.contains('scrolled');

  function update() {
    if (alwaysOn || window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  update(); // Apply on page load immediately
  window.addEventListener('scroll', update, { passive: true });
}

// ========================================
// ACTIVE NAV LINKS (highlight current page)
// ========================================
function initNavActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && href.includes(currentPath)) {
      link.classList.add('active');
    }
  });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  const menuIcon = menuBtn.querySelector('.menu-icon');
  const closeIcon = menuBtn.querySelector('.close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-actions .btn');

  menuBtn.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

// ========================================
// PARTICLES
// ========================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 28; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 5) + 's';
    // Vary particle sizes slightly
    const size = 2 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    container.appendChild(particle);
  }
}

// ========================================
// SCROLL ANIMATIONS (improved stagger)
// ========================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    // Group entries by their parent to stagger siblings
    const grouped = {};
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parentKey = entry.target.parentElement?.id || 'root';
      if (!grouped[parentKey]) grouped[parentKey] = [];
      grouped[parentKey].push(entry.target);
    });

    Object.values(grouped).forEach(group => {
      group.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 90);
        observer.unobserve(el);
      });
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ========================================
// COUNT-UP ANIMATIONS for numbers
// ========================================
function initCountUpAnimations() {
  const statValues = document.querySelectorAll('.hero-stat-value, .about-stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');
      
      if (isNaN(num)) return;
      
      let start = 0;
      const duration = 1400;
      const step = 16;
      const increment = num / (duration / step);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= num) {
          el.textContent = text; // restore original
          clearInterval(timer);
        } else {
          el.textContent = (num >= 100 ? Math.floor(start) : start.toFixed(1)) + suffix;
        }
      }, step);
      
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => observer.observe(el));
}

// ========================================
// TYPING EFFECT on hero badge text (optional)
// ========================================
function initTypingEffect() {
  const badge = document.querySelector('.hero-badge span');
  if (!badge) return;
  const original = badge.textContent;
  // Already set — just leave it, effect only on index
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        scrollToElement(target);
      }
    });
  });
}

function scrollToElement(target) {
  const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
  window.scrollTo({ top: target.offsetTop - navHeight - 20, behavior: 'smooth' });
}

// ========================================
// SERVICE BUTTONS
// ========================================
function initServiceButtons() {
  document.querySelectorAll('.service-link').forEach(button => {
    if (button.tagName === 'BUTTON') {
      button.addEventListener('click', function() {
        const card = this.closest('.service-card');
        const serviceTitle = card?.querySelector('.service-title')?.textContent || '';
        const requestSection = document.getElementById('request');
        if (requestSection) scrollToElement(requestSection);

        setTimeout(() => {
          const dataTypeSelect = document.getElementById('dataType');
          const descriptionField = document.getElementById('description');
          const serviceMap = {
            'Text Data': 'text', 'Image Data': 'image', 'Audio Data': 'audio',
            'Video Data': 'video', 'Tabular Data': 'tabular', 'Multimodal Data': 'multimodal'
          };
          if (dataTypeSelect && serviceMap[serviceTitle]) {
            dataTypeSelect.value = serviceMap[serviceTitle];
            dataTypeSelect.style.borderColor = 'var(--accent-primary)';
            setTimeout(() => dataTypeSelect.style.borderColor = '', 2000);
          }
          if (descriptionField) {
            descriptionField.focus();
            descriptionField.placeholder = `Tell us about your ${serviceTitle.toLowerCase()} requirements...`;
          }
        }, 800);
      });
    }
  });
}

// ========================================
// FOOTER LINKS
// ========================================
function initFooterLinks() {
  document.querySelectorAll('.footer-link-list a[href="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast('This page is coming soon!');
    });
  });
}

// ========================================
// TOAST NOTIFICATIONS (improved)
// ========================================
let toastTimeout = null;

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) { existing.remove(); clearTimeout(toastTimeout); }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icons = {
    info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    success: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    error:   '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
  };
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[type]||icons.info}</svg><span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ========================================
// FORM HANDLING
// ========================================
function initForm() {
  const form = document.getElementById('request-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  // Real-time validation
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = 'var(--accent-primary)';
        setTimeout(() => field.style.borderColor = '', 1500);
      }
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      }
    });

    if (!isValid) { showToast('Please fill in all required fields', 'error'); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Submitting...`;

    setTimeout(() => {
      statusDiv.style.display = 'flex';
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Thank you! Your request has been submitted. We'll contact you within 48 hours.</span>`;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Submit Request <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => statusDiv.style.display = 'none', 6000);
    }, 1500);
  });
}

// ========================================
// INTERACTIVE ELEMENTS
// ========================================
document.querySelectorAll('.trusted-logo').forEach(logo => {
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', function() {
    showToast(`${this.textContent} — valued partner`);
  });
});

document.querySelectorAll('.use-case-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const title = this.querySelector('.use-case-title')?.textContent || '';
    const requestSection = document.getElementById('request');
    if (requestSection) scrollToElement(requestSection);
    setTimeout(() => {
      const field = document.getElementById('description');
      if (field) { field.focus(); field.placeholder = `Tell us about your ${title.toLowerCase()} data requirements...`; }
    }, 800);
  });
});

document.querySelectorAll('.testimonial-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const company = this.querySelector('.testimonial-role')?.textContent?.split(', ').pop() || '';
    showToast(`${company} case study — coming soon`);
  });
});

document.querySelectorAll('.feature-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const title = this.querySelector('.feature-title')?.textContent || '';
    showToast(`${title} — documentation coming soon`);
  });
});

// ========================================
// DYNAMIC STYLES (injected)
// ========================================
const style = document.createElement('style');
style.textContent = `
  .spinner { animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(16px);
    background: var(--bg-card);
    border: 1px solid var(--border-secondary);
    border-radius: 14px;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 12px 40px rgba(0,0,0,.5);
    pointer-events: none;
    white-space: nowrap;
    max-width: calc(100vw - 48px);
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .toast svg { color: var(--accent-primary); flex-shrink: 0; }

  .form-status {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .form-status.success {
    background: rgba(0, 245, 160, 0.08);
    border: 1px solid rgba(0, 245, 160, 0.25);
    color: var(--accent-primary);
  }
  .form-status.error {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #ef4444;
  }

  .trusted-logo { transition: color 0.2s ease, opacity 0.2s ease; }
  .trusted-logo:hover { color: var(--accent-primary) !important; opacity: 1 !important; }
`;
document.head.appendChild(style);