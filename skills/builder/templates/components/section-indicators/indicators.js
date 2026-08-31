  // Active Navigation Highlight
  // ==========================================================================

  function initActiveNav() {
    const sections = document.querySelectorAll('.doc-section[id]');
    const navLinks = document.querySelectorAll('.section-indicator');

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, {
      rootMargin: '-60px 0px -66% 0px',
      threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
  }

  // ==========================================================================