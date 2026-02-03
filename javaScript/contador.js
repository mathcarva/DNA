  const elementos = document.querySelectorAll('.contador');
  const duracao = 2000; 

  const iniciarContador = (el) => {
    const valorFinal = parseInt(el.getAttribute('data-final'), 10);
    const sufixo = el.getAttribute('data-sufixo') || "";
    const intervalo = 20;
    const passos = duracao / intervalo;
    const incremento = valorFinal / passos;

    let atual = 0;

    const timer = setInterval(() => {
      atual += incremento;
      if (atual >= valorFinal) {
        el.textContent = valorFinal + sufixo;
        clearInterval(timer);
      } else {
        el.textContent = Math.round(atual) + sufixo;
      }
    }, intervalo);
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        iniciarContador(entry.target);
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.5
  });

  elementos.forEach(el => {
    observer.observe(el);
  });