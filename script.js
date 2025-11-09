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

  // se está no topo -> header sempre visível
  if (scrollTop <= 0) {
    clearTimeout(timeout);
    header.classList.remove("hidden");
    return;
  }

  // sempre mostra quando rolar
  header.classList.remove("hidden");

  // agenda esconder se rolou pra baixo e não tá com mouse em cima
  if (scrollTop > lastScrollTop && !isHovering) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!isHovering) header.classList.add("hidden");
    }, 1000);
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ----- CARROSSEL INFINITO COM EVENT LISTENERS (Otimizado) -----
const container = document.querySelector(".carrossel-container");
const btnEsquerda = document.querySelector(".seta.esquerda");
const btnDireita = document.querySelector(".seta.direita");
let items = Array.from(container.querySelectorAll(".item"));

let currentIndex = 0;
let isMoving = false; // 👈 NOVA FLAG: Bloqueia cliques durante transições rápidas
let scrollTimer; // 👈 NOVO TIMER: Usado para detectar o fim da rolagem

// Clonar primeiro e último item para efeito infinito
if (items.length > 0) {
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);

  container.appendChild(firstClone);
  container.insertBefore(lastClone, items[0]);
}

// Atualizar lista de items (agora inclui os dois clones)
items = Array.from(container.querySelectorAll(".item"));

// Começar no primeiro item real (índice 1)
currentIndex = 1;
centralizarItem(currentIndex, false);

function centralizarItem(index, smooth = true) {
  // Validação básica para evitar erros
  if (index < 0 || index >= items.length) return;

  items.forEach((i) => i.classList.remove("active"));
  const item = items[index];
  if (!item) return;

  item.classList.add("active");

  const containerWidth = container.offsetWidth;
  const itemWidth = item.offsetWidth;
  const target = item.offsetLeft + itemWidth / 2 - containerWidth / 2;

  container.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
}

// -------------------------------------------------------------
// NOVO BLOCO: Lógica de Salto do Loop após o fim da animação
// -------------------------------------------------------------
function handleLoopTransition() {
  isMoving = false; // Libera os botões

  // Se estiver no clone final (índice items.length - 1), salta para o primeiro real (índice 1)
  if (currentIndex === items.length - 1) {
    currentIndex = 1;
    centralizarItem(currentIndex, false); // Salto imediato (auto)
  }
  // Se estiver no clone inicial (índice 0), salta para o último real (índice items.length - 2)
  else if (currentIndex === 0) {
    currentIndex = items.length - 2;
    centralizarItem(currentIndex, false); // Salto imediato (auto)
  }
}

// Listener para detectar quando o scroll suave terminou
container.addEventListener("scroll", () => {
  // Limpa o timer anterior
  clearTimeout(scrollTimer);

  // Se a flag isMoving estiver ativa (indicando que estamos em uma transição de clique/loop)
  if (isMoving) {
    // Verifica a posição após um breve período de 100ms
    scrollTimer = setTimeout(() => {
      handleLoopTransition();
    }, 100);
  }
});
// -------------------------------------------------------------

// Navegação Direita
btnDireita.addEventListener("click", () => {
  if (isMoving) return; // Bloqueia cliques durante o movimento/salto

  // Verifica se o próximo clique levará ao clone final
  if (currentIndex >= items.length - 2) {
    isMoving = true; // Ativa a flag para que o scroll listener detecte o fim
  }

  currentIndex++;
  centralizarItem(currentIndex);

  // Se não for para um clone, a transição normal já terminou
  if (!isMoving) {
    isMoving = false;
  }
});

// Navegação Esquerda
btnEsquerda.addEventListener("click", () => {
  if (isMoving) return; // Bloqueia cliques durante o movimento/salto

  // Verifica se o próximo clique levará ao clone inicial
  if (currentIndex <= 1) {
    isMoving = true; // Ativa a flag para que o scroll listener detecte o fim
  }

  currentIndex--;
  centralizarItem(currentIndex);

  // Se não for para um clone, a transição normal já terminou
  if (!isMoving) {
    isMoving = false;
  }
});

// Centralizar item ao carregar e ao redimensionar
window.addEventListener("load", () => centralizarItem(currentIndex, false));
window.addEventListener("resize", () => centralizarItem(currentIndex, false));

// ---

// ----- ANIMAÇÃO ON SCROLL (mantida) -----
const aboutSection = document.querySelector(".about-text");

function checkVisibility() {
  if (aboutSection) {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      // aboutSection.classList.add("show");
    }
  }
}

window.addEventListener("scroll", checkVisibility);
