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

if (counterElements.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    }
  );

  counterElements.forEach((counterElement) => {
    setCounterValue(counterElement, 0);
    counterObserver.observe(counterElement);
  });
}