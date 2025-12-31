// ========================================
// DITOSIS - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initNavbar();
  initMobileMenu();
  initParticles();
  initScrollAnimations();
  initSmoothScroll();
  initServiceButtons();
  initForm();
  initFooterLinks();
});

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = menuBtn.querySelector('.menu-icon');
  const closeIcon = menuBtn.querySelector('.close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-actions .btn');

  menuBtn.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    });
  });
}

// ========================================
// PARTICLES
// ========================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (3 + Math.random() * 4) + 's';
    container.appendChild(particle);
  }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for elements in same section
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
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
        // Scroll to top for # links
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

// Helper function to scroll to an element
function scrollToElement(target) {
  const navHeight = document.getElementById('navbar').offsetHeight;
  const targetPosition = target.offsetTop - navHeight - 20;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// ========================================
// SERVICE BUTTONS
// ========================================
function initServiceButtons() {
  const serviceButtons = document.querySelectorAll('.service-link');
  
  serviceButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the service title from the parent card
      const card = this.closest('.service-card');
      const serviceTitle = card.querySelector('.service-title').textContent;
      
      // Scroll to request section
      const requestSection = document.getElementById('request');
      scrollToElement(requestSection);
      
      // Pre-fill the data type dropdown based on service clicked
      setTimeout(() => {
        const dataTypeSelect = document.getElementById('dataType');
        const descriptionField = document.getElementById('description');
        
        // Map service titles to data types
        const serviceMap = {
          'Text Data': 'text',
          'Image Data': 'image',
          'Audio Data': 'audio',
          'Video Data': 'video',
          'Tabular Data': 'tabular',
          'Multimodal Data': 'multimodal'
        };
        
        if (serviceMap[serviceTitle]) {
          dataTypeSelect.value = serviceMap[serviceTitle];
          // Add a visual highlight to the select
          dataTypeSelect.style.borderColor = 'var(--accent-primary)';
          setTimeout(() => {
            dataTypeSelect.style.borderColor = '';
          }, 2000);
        }
        
        // Focus on description field
        descriptionField.focus();
        descriptionField.placeholder = `Tell us about your ${serviceTitle.toLowerCase()} requirements...`;
      }, 800);
    });
  });
}

// ========================================
// FOOTER LINKS
// ========================================
function initFooterLinks() {
  // Handle footer links that point to # (placeholder links)
  const footerLinks = document.querySelectorAll('.footer-link-list a[href="#"]');
  
  footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show a toast notification
      showToast('This page is coming soon!');
    });
  });
  
  // Handle "Careers", "Blog", "Press" etc - show coming soon
  const comingSoonLinks = ['Careers', 'Blog', 'Press', 'Documentation', 'Data Quality Guide', 'FAQ', 'Status', 'Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookie Policy'];
  
  document.querySelectorAll('.footer-link-list a').forEach(link => {
    if (comingSoonLinks.includes(link.textContent.trim())) {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          showToast(`${this.textContent} page coming soon!`);
        }
      });
    }
  });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// FORM HANDLING
// ========================================
function initForm() {
  const form = document.getElementById('request-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.addEventListener('input', function() {
          this.style.borderColor = '';
        }, { once: true });
      }
    });
    
    if (!isValid) {
      showToast('Please fill in all required fields');
      return;
    }
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Submitting...
    `;

    // Simulate form submission (since there's no backend)
    setTimeout(() => {
      // Show success message
      statusDiv.style.display = 'flex';
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Thank you! Your request has been submitted. We'll contact you within 48 hours.</span>
      `;

      // Reset form
      form.reset();

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Submit Request
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      `;

      // Scroll to show success message
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Hide status after 5 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }, 1500);
  });
}

// ========================================
// TRUSTED LOGOS INTERACTION
// ========================================
document.querySelectorAll('.trusted-logo').forEach(logo => {
  logo.addEventListener('click', function() {
    showToast(`${this.textContent} is one of our valued partners`);
  });
  logo.style.cursor = 'pointer';
});

// ========================================
// USE CASE CARDS INTERACTION
// ========================================
document.querySelectorAll('.use-case-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const title = this.querySelector('.use-case-title').textContent;
    const requestSection = document.getElementById('request');
    scrollToElement(requestSection);
    
    setTimeout(() => {
      const descriptionField = document.getElementById('description');
      descriptionField.focus();
      descriptionField.placeholder = `Tell us about your ${title.toLowerCase()} data requirements...`;
    }, 800);
  });
});

// ========================================
// TESTIMONIAL CARDS INTERACTION  
// ========================================
document.querySelectorAll('.testimonial-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const name = this.querySelector('.testimonial-name').textContent;
    const company = this.querySelector('.testimonial-role').textContent.split(', ')[1];
    showToast(`Read the full ${company} case study (coming soon)`);
  });
});

// ========================================
// HIGHLIGHT CARDS INTERACTION
// ========================================
document.querySelectorAll('.highlight-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const title = this.querySelector('.highlight-title').textContent;
    const requestSection = document.getElementById('request');
    scrollToElement(requestSection);
    showToast(`Learn more about our ${title} approach`);
  });
});

// ========================================
// FEATURE CARDS INTERACTION
// ========================================
document.querySelectorAll('.feature-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function() {
    const title = this.querySelector('.feature-title').textContent;
    showToast(`${title} - Documentation coming soon!`);
  });
});

// ========================================
// DYNAMIC STYLES
// ========================================
const style = document.createElement('style');
style.textContent = `
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
  
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  
  .toast svg {
    color: var(--accent-primary);
    flex-shrink: 0;
  }
  
  .service-link,
  .highlight-card,
  .feature-card,
  .use-case-card,
  .testimonial-card {
    cursor: pointer;
  }
  
  .trusted-logo {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .trusted-logo:hover {
    color: var(--accent-primary) !important;
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);
