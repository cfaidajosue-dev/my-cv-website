// ===== DARK / LIGHT MODE TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Load saved preference
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeIcon.classList.toggle('fa-sun', !isLight);
  themeIcon.classList.toggle('fa-moon', isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Software Developer',
  'Web Developer',
  'Problem Solver',
  'S5 Student 🇷🇼',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentPhrases = [...phrases];

window.updateTypewriterPhrases = function(newPhrases) {
  currentPhrases = newPhrases;
  phraseIndex = 0;
  charIndex = 0;
  isDeleting = false;
};

function typeWriter() {
  const current = currentPhrases[phraseIndex % currentPhrases.length];
  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % currentPhrases.length;
  }

  setTimeout(typeWriter, isDeleting ? 60 : 100);
}

typeWriter();

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(13, 13, 13, 0.98)';
  } else {
    navbar.style.background = 'rgba(13, 13, 13, 0.9)';
  }
});

// ===== SKILL BAR ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');

const animateSkills = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-width');
      fill.style.width = targetWidth;
      observer.unobserve(fill);
    }
  });
};

const skillObserver = new IntersectionObserver(animateSkills, {
  threshold: 0.3
});

skillFills.forEach(fill => skillObserver.observe(fill));

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  '.skill-card, .timeline-item, .project-card, .contact-item'
);

const revealOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(revealOnScroll, {
  threshold: 0.1
});

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ===== CONTACT FORM (saves to MongoDB) =====
const contactForm = document.getElementById('contactForm');

// Email validation error messages per language
const emailErrors = {
  en: {
    invalid:     '⚠️ Please enter a valid email address.',
    noExist:     '❌ This email doesn\'t exist or can\'t receive mail. Please re-enter a real email.',
    disposable:  '❌ Disposable emails are not allowed. Please use your real email.',
    sending:     'Verifying & Sending...',
    sent:        'Message Sent! ✓',
    failed:      'Failed. Try again.',
    offline:     'Server offline. Try again later.'
  },
  fr: {
    invalid:     '⚠️ Veuillez entrer une adresse email valide.',
    noExist:     '❌ Cet email n\'existe pas ou ne peut pas recevoir de messages. Veuillez re-saisir un vrai email.',
    disposable:  '❌ Les emails jetables ne sont pas autorisés. Utilisez votre vrai email.',
    sending:     'Vérification en cours...',
    sent:        'Message envoyé! ✓',
    failed:      'Échec. Réessayez.',
    offline:     'Serveur hors ligne. Réessayez plus tard.'
  },
  rw: {
    invalid:     '⚠️ Injiza aderesi ya imeli nyayo.',
    noExist:     '❌ Iyi imeli ntibaho cyangwa ntishobora kwakira ubutumwa. Ongera winjize imeli nyayo.',
    disposable:  '❌ Imeli z\'agateganyo ntizemewe. Koresha imeli yawe nyayo.',
    sending:     'Gusuzuma no kohereza...',
    sent:        'Ubutumwa bwoherejwe! ✓',
    failed:      'Byanze. Ongera ugerageze.',
    offline:     'Seriveri irafunze. Ongera ugerageze.'
  }
};

// Show inline error under email input
function showEmailError(msg) {
  let errEl = document.getElementById('emailError');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.id = 'emailError';
    errEl.style.cssText = 'color:#f87171;font-size:0.82rem;margin-top:-0.5rem;margin-bottom:0.3rem;padding-left:0.2rem;';
    const emailGroup = contactForm.querySelectorAll('.form-group')[1];
    emailGroup.after(errEl);
  }
  errEl.textContent = msg;
  // Highlight email input
  const emailInput = contactForm.querySelectorAll('input')[1];
  emailInput.style.borderColor = '#f87171';
  emailInput.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
}

function clearEmailError() {
  const errEl = document.getElementById('emailError');
  if (errEl) errEl.remove();
  const emailInput = contactForm.querySelectorAll('input')[1];
  emailInput.style.borderColor = '';
  emailInput.style.boxShadow = '';
}

// Clear error when user starts retyping email
contactForm.querySelectorAll('input')[1]?.addEventListener('input', clearEmailError);

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearEmailError();

  const btn = contactForm.querySelector('button[type="submit"]');
  const inputs = contactForm.querySelectorAll('input, textarea');
  const lang = localStorage.getItem('lang') || 'en';
  const t = emailErrors[lang] || emailErrors.en;

  const name    = inputs[0].value.trim();
  const email   = inputs[1].value.trim();
  const message = inputs[2].value.trim();

  // Basic format check before hitting server
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showEmailError(t.invalid);
    inputs[1].focus();
    return;
  }

  btn.textContent = t.sending;
  btn.disabled = true;

  try {
    const response = await fetch(
      window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/contact'
        : '/api/contact',
      {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await response.json();

    if (response.ok) {
      btn.innerHTML = t.sent;
      btn.style.background = '#16a34a';
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = `${t.sent.replace('✓','').trim()} <i class="fas fa-paper-plane"></i>`;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } else {
      // Show server-side email validation error inline
      if (data.valid === false) {
        showEmailError(data.message || t.noExist);
        inputs[1].focus();
      } else {
        btn.innerHTML = t.failed;
        btn.style.background = '#dc2626';
      }
      btn.disabled = false;
      if (data.valid !== false) {
        setTimeout(() => {
          btn.innerHTML = `Send Message <i class="fas fa-paper-plane"></i>`;
          btn.style.background = '';
        }, 3000);
      } else {
        btn.innerHTML = `Send Message <i class="fas fa-paper-plane"></i>`;
        btn.style.background = '';
      }
    }
  } catch (err) {
    btn.innerHTML = t.offline;
    btn.style.background = '#dc2626';
    setTimeout(() => {
      btn.innerHTML = `Send Message <i class="fas fa-paper-plane"></i>`;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLink.style.color = 'var(--purple-light)';
      } else {
        navLink.style.color = '';
      }
    }
  });
});

// ===== LOAD CV DATA FROM MONGODB =====
async function loadProfileData() {
  try {
    const url = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/profile'
      : '/api/profile';
    const response = await fetch(url);
    if (!response.ok) return; // silently fail, static content stays
    const profile = await response.json();

    // Update skills dynamically
    if (profile.skills && profile.skills.length > 0) {
      const skillsGrid = document.querySelector('.skills-grid');
      if (skillsGrid) {
        skillsGrid.innerHTML = profile.skills.map(skill => `
          <div class="skill-card">
            <div class="skill-icon"><i class="fas fa-code"></i></div>
            <h3>${skill.name}</h3>
            <p>${skill.category}</p>
            <div class="skill-bar">
              <div class="skill-fill" data-width="${skill.level}%"></div>
            </div>
          </div>
        `).join('');

        // Re-observe skill bars after dynamic load
        document.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = '0';
          skillObserver.observe(fill);
        });

        // Re-observe cards for reveal animation
        document.querySelectorAll('.skill-card').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          revealObserver.observe(el);
        });
      }
    }

    // Update projects dynamically
    if (profile.projects && profile.projects.length > 0) {
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid) {
        projectsGrid.innerHTML = profile.projects.map(project => `
          <div class="project-card">
            <div class="project-icon"><i class="fas fa-laptop-code"></i></div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
              ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            ${project.link ? `<a href="${project.link}" target="_blank" class="btn btn-outline" style="margin-top:1rem;font-size:0.8rem;padding:0.4rem 1rem;">View Project</a>` : ''}
          </div>
        `).join('') + `
          <div class="project-card add-project">
            <div class="project-icon"><i class="fas fa-plus-circle"></i></div>
            <h3>More Coming Soon</h3>
            <p>I'm always working on new projects. Stay tuned!</p>
            <div class="project-tags"><span>In Progress</span></div>
          </div>
        `;

        document.querySelectorAll('.project-card').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          revealObserver.observe(el);
        });
      }
    }

  } catch (err) {
    // Backend not running — static content is shown as fallback
    console.log('Backend not available, using static content.');
  }
}

loadProfileData();
