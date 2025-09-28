// ----- HEADER ESCONDER/APARECER -----
let timeout;
let lastScrollTop = 0;
let isHovering = false;

const header = document.querySelector("header");

// detecta mouse em cima do header
header.addEventListener("mouseenter", () => (isHovering = true));
header.addEventListener("mouseleave", () => (isHovering = false));

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // se está no topo -> header sempre visível e não esconde nunca
  if (scrollTop <= 0) {
    clearTimeout(timeout); // cancela qualquer esconder pendente
    header.classList.remove("hidden");
    return;
  }

  // sempre mostra quando rolar
  header.classList.remove("hidden");

  // só agenda esconder se rolou pra baixo e não tá com mouse em cima
  if (scrollTop > lastScrollTop && !isHovering) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!isHovering) header.classList.add("hidden");
    }, 1000);
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ----- CARROSSEL -----
const container = document.querySelector(".carrossel-container");
const btnEsquerda = document.querySelector(".seta.esquerda");
const btnDireita = document.querySelector(".seta.direita");

btnDireita.addEventListener("click", () => {
  container.scrollBy({ left: 400, behavior: "smooth" }); // scroll p/ direita
});

btnEsquerda.addEventListener("click", () => {
  container.scrollBy({ left: -400, behavior: "smooth" }); // scroll p/ esquerda
});
