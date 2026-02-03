const buttons = document.querySelectorAll('.btn2, .btn3');

buttons.forEach((btn) => {
  btn.addEventListener('mouseenter', () => {
    btn.classList.add('hovered');
    btn.classList.remove('unhovered');
  });

  btn.addEventListener('mouseleave', () => {
    btn.classList.remove('hovered');
    btn.classList.add('unhovered');

    // Remover a classe depois de 1s pra resetar
    setTimeout(() => {
      btn.classList.remove('unhovered');
    }, 1000); // igual ao tempo da transição reversa
  });
});
