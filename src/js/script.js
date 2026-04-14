const toggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#navLinks');

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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
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

  const startCounters = () => {
    if (didStartCounters) {
      return;
    }

    didStartCounters = true;
    counterElements.forEach((counterElement) => animateCounter(counterElement));
  };

  if (isSectionVisible(statsSection)) {
    startCounters();
  } else if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
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
        threshold: 0.2,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    counterObserver.observe(statsSection);
  } else {
    const onScroll = () => {
      if (!isSectionVisible(statsSection)) {
        return;
      }

      startCounters();
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}