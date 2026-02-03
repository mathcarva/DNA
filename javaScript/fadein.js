function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom && !el.classList.contains('active')) {
      const delay = Math.random() * 500;

      el.style.transitionDelay = `${delay}ms`;

      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
