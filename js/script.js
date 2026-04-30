const toggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#navLinks') || document.querySelector('#heroNavLinks');

const supportsMatchMedia = typeof window.matchMedia === 'function';
const prefersReducedMotion = supportsMatchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;
const requestFrame =
  typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (callback) => window.setTimeout(() => callback(Date.now()), 16);

if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

const counterElements = document.querySelectorAll('[data-counter]');
const statsSection = document.querySelector('.stats');

const setCounterValue = (element, value) => {
  const suffix = element.dataset.suffix || '';
  element.textContent = `${value}${suffix}`;
};

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  if (!Number.isFinite(target) || target < 0) {
    return;
  }

  if (prefersReducedMotion) {
    setCounterValue(element, target);
    return;
  }

  const duration = 1600;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const nextValue = Math.round(target * progress);

    setCounterValue(element, nextValue);

    if (progress < 1) {
      requestFrame(step);
    }
  };
  while (isSectionVisible(statsSection) && startTime == perfomance.now) {
    if (isSectionVisible(statsSection)) {
      requestFrame(step);
    } else {
      setCounterValue(element, target);
    }
    
  }  

  requestFrame(step);
};

const isSectionVisible = (element) => {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
};

if (counterElements.length > 0 && statsSection) {
  counterElements.forEach((counterElement) => {
    setCounterValue(counterElement, 0);
  });

  let didStartCounters = false;
  let counterObserver = null;
  let delayedStartTimer = null;

  const startCounters = () => {
    if (didStartCounters) {
      return;
    }

    didStartCounters = true;
    window.removeEventListener('scroll', handleViewportCheck);
    window.removeEventListener('resize', handleViewportCheck);

    if (delayedStartTimer) {
      window.clearTimeout(delayedStartTimer);
      delayedStartTimer = null;
    }

    if (counterObserver) {
      counterObserver.disconnect();
      counterObserver = null;
    }

    counterElements.forEach((counterElement) => animateCounter(counterElement));
  };

  const handleViewportCheck = () => {
    if (isSectionVisible(statsSection)) {
      startCounters();
    }
  };

  if (isSectionVisible(statsSection)) {
    startCounters();
  } else {
    window.addEventListener('scroll', handleViewportCheck, { passive: true });
    window.addEventListener('resize', handleViewportCheck, { passive: true });

    if ('IntersectionObserver' in window) {
      counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          startCounters();
          observer.disconnect();
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    counterObserver.observe(statsSection);
    }

    delayedStartTimer = window.setTimeout(() => {
      startCounters();
    }, 2500);
  }
}
/* Image Gallery Intersection Observer */
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  const galleryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger form the ones intersecting at the same time
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

  galleryItems.forEach(item => {
    galleryObserver.observe(item);
  });
}
