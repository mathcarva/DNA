//---------------------- FULLSCREEN ------------------------------------

const menuBtn = document.querySelector('.menuzito');
const menu = document.getElementById('menuFullscreen');
const menuText = document.getElementById('menuText');

function toggleMenu() {
  const isOpen = menu.classList.contains('show');

  if (isOpen) {
    menu.classList.remove('show');
    menu.classList.add('hiding');

    // 🔓 Remove a classe que trava o scroll
    document.body.classList.remove('scroll-lock');

    setTimeout(() => {
      menu.classList.remove('hiding');
    }, 700);

    menuText.textContent = 'MENU';
  } else {
    menu.classList.add('show');

    // 🔒 Adiciona classe que trava o scroll
    document.body.classList.add('scroll-lock');

    menuText.textContent = 'CLOSE';
  }
}

menuBtn.addEventListener('click', toggleMenu);

menuBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('show')) {
    toggleMenu();
  }
});

//---------------------- HOVERING ------------------------------------

const menuLinks = document.querySelectorAll('.menu-fullscreen ul li a');
const menuUl = document.querySelector('.menu-fullscreen ul');

menuLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    menuUl.classList.add('hovering');
    link.classList.add('hovered');
  });

  link.addEventListener('mouseleave', () => {
    menuUl.classList.remove('hovering');
    link.classList.remove('hovered');
  });
});
