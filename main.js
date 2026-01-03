import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll reveals
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Parallax effect for hero profile
  const heroProfile = document.querySelector('.hero-profile');
  if (heroProfile) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroProfile.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Form submission feedback
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.innerText;

      // Collect form data
      const formData = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        message: form.querySelector('textarea').value
      };

      btn.innerText = 'Submitting...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          btn.innerText = 'Inquiry Sent!';
          btn.style.background = 'var(--emerald)';
          form.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (error) {
        console.error('Submission error:', error);
        btn.innerText = 'Error! Try again';
        btn.style.background = '#ff4444';
      } finally {
        btn.style.opacity = '1';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = 'var(--accent-color)';
        }, 3000);
      }
    });
  }
});
