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
    clearTimeout(timeout);
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
const items = document.querySelectorAll(".carrossel-container .item");

// Função para identificar e colorir apenas o item central
function updateActiveItem() {
  const containerWidth = container.offsetWidth;
  const scrollLeft = container.scrollLeft;
  
  let centralItem = null;
  let minDistance = Infinity;

  items.forEach((item) => {
    const itemOffsetLeft = item.offsetLeft;
    const itemWidth = item.offsetWidth;
    
    // Calcula a posição central do item
    const itemCenter = itemOffsetLeft + (itemWidth / 2);
    
    // Calcula a posição central do container
    const containerCenter = scrollLeft + (containerWidth / 2);
    
    // Distância do centro do item para o centro do container
    const distance = Math.abs(itemCenter - containerCenter);
    
    // Encontra o item mais próximo do centro
    if (distance < minDistance) {
      minDistance = distance;
      centralItem = item;
    }

    // Remove as classes de todos os itens
    item.classList.remove('active');
  });

  // Adiciona a classe 'active' apenas ao item central
  if (centralItem) {
    centralItem.classList.add('active');
  }
}

// Ajusta o scroll para centralizar o primeiro item ao carregar
function centerFirstItem() {
  const firstItem = document.querySelector('.item');
  if (firstItem && container) {
    const containerWidth = container.offsetWidth;
    const itemWidth = firstItem.offsetWidth;
    const targetScroll = (firstItem.offsetLeft + (itemWidth / 2)) - (containerWidth / 2);
    
    container.scrollLeft = targetScroll;
    // Pequeno delay para garantir que o scroll foi aplicado
    setTimeout(updateActiveItem, 100);
  }
}

// Navegação para a direita - centraliza o próximo item
btnDireita.addEventListener("click", () => {
  const activeItem = document.querySelector('.item.active');
  let nextItem;
  
  if (activeItem && activeItem.nextElementSibling) {
    nextItem = activeItem.nextElementSibling;
  } else {
    // Se não há próximo item, vai para o primeiro (loop)
    nextItem = document.querySelector('.item');
  }
  
  if (nextItem) {
    const containerWidth = container.offsetWidth;
    const itemWidth = nextItem.offsetWidth;
    const targetScroll = (nextItem.offsetLeft + (itemWidth / 2)) - (containerWidth / 2);
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    });
    
    // Atualiza o item ativo após a animação de scroll
    setTimeout(updateActiveItem, 500);
  }
});

// Navegação para a esquerda - centraliza o item anterior
btnEsquerda.addEventListener("click", () => {
  const activeItem = document.querySelector('.item.active');
  let prevItem;
  
  if (activeItem && activeItem.previousElementSibling) {
    prevItem = activeItem.previousElementSibling;
  } else {
    // Se não há item anterior, vai para o último (loop)
    prevItem = items[items.length - 1];
  }
  
  if (prevItem) {
    const containerWidth = container.offsetWidth;
    const itemWidth = prevItem.offsetWidth;
    const targetScroll = (prevItem.offsetLeft + (itemWidth / 2)) - (containerWidth / 2);
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    });
    
    // Atualiza o item ativo após a animação de scroll
    setTimeout(updateActiveItem, 500);
  }
});

// Atualiza o item ativo durante o scroll com debounce para performance
let scrollTimeout;
container.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateActiveItem, 50);
});

// Inicialização quando a página carrega
window.addEventListener('load', () => {
  centerFirstItem();
});

// Também inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  updateActiveItem();
});

// Recalcula quando a janela é redimensionada
window.addEventListener('resize', () => {
  centerFirstItem();
});

// ----- ANIMAÇÃO ON SCROLL (mantida para futuras implementações) -----
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