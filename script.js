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
const items = document.querySelectorAll(".carrossel-container .item"); // Seleciona todos os itens

// NOVO: Função para identificar e colorir o item mais visível
function updateActiveItem() {
  const scrollLeft = container.scrollLeft;
  let closestItem = null;
  let minDistance = Infinity;

  items.forEach((item) => {
    const itemOffsetLeft = item.offsetLeft; 

    // Distância do início do item para a posição atual de scroll (borda esquerda do container)
    // O item mais ativo é o que está mais próximo da borda esquerda do container
    const distance = Math.abs(itemOffsetLeft - scrollLeft); 

    // O item deve estar totalmente visível ou quase totalmente visível na borda esquerda
    if (distance < minDistance) {
      minDistance = distance;
      closestItem = item;
    }

    // Remove a classe 'active' de todos
    item.classList.remove('active');
  });

  // Adiciona a classe 'active' ao item mais visível
  if (closestItem) {
    closestItem.classList.add('active');
  }
}

// NOVO: Adicionar listener de scroll para o container, atualizando o efeito de cor a cada rolagem
container.addEventListener('scroll', updateActiveItem);


// Navegação dos botões (mantida)
btnDireita.addEventListener("click", () => {
  container.scrollBy({ left: 400, behavior: "smooth" }); // scroll p/ direita
  // A classe 'active' será aplicada automaticamente pelo listener de 'scroll'
});

btnEsquerda.addEventListener("click", () => {
  container.scrollBy({ left: -400, behavior: "smooth" }); // scroll p/ esquerda
  // A classe 'active' será aplicada automaticamente pelo listener de 'scroll'
});

// NOVO: Chamada inicial para colorir o primeiro item ao carregar a página
updateActiveItem(); 


// animação on scroll
const aboutSection = document.querySelector(".about-text");

function checkVisibility() {
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    aboutSection.classList.add("show");
  }
}

window.addEventListener("scroll", checkVisibility);
checkVisibility();
