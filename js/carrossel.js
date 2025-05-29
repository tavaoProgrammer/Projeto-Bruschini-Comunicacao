document.addEventListener('DOMContentLoaded', function() {
    // Limpa qualquer autoplay existente
    clearAllAutoplay();
    
    // Inicializa os carrosséis
    const standardCarousels = document.querySelectorAll('.carousel:not(.links-carousel)');
    standardCarousels.forEach(carousel => {
        initStandardCarousel(carousel);
    });
    
    const linksCarousel = document.querySelector('.links-carousel');
    if (linksCarousel) {
        initLinksCarousel(linksCarousel);
    }
    
    addTouchSupport();
});


// Variáveis globais para controle do autoplay
let autoplayIntervals = [];

function initStandardCarousel(carousel) {
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let slideCount = slides.length;
    let autoplayInterval;
    
    // Cria os dots de navegação
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // Configura o autoplay (5 segundos)
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
        autoplayIntervals.push(autoplayInterval);
    }
    
    // Pausa o autoplay quando interagir
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        pauseAutoplay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        pauseAutoplay();
    });
    
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Inicia o autoplay
    startAutoplay();
    updateCarousel();
}

function initLinksCarousel(carousel) {
    const container = carousel.querySelector('.carousel-container');
    const slidesContainer = carousel.querySelector('.link-slides');
    const linkItems = Array.from(slidesContainer.querySelectorAll('.link-item'));
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    let currentPosition = 0;
    const itemCount = linkItems.length;
    let itemWidth = 100;
    let autoplayInterval;
    
    // Clona os itens para criar efeito infinito
    linkItems.forEach(item => {
        const clone = item.cloneNode(true);
        slidesContainer.appendChild(clone);
    });
    
    // Cria dots de navegação
    for (let i = 0; i < itemCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToItem(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        itemWidth = isMobile ? 100 : 100 / 3;
        
        slidesContainer.style.transform = `translateX(-${currentPosition * itemWidth}%)`;
        
        const activeDotIndex = (currentPosition % itemCount + itemCount) % itemCount;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    function goToItem(index) {
        currentPosition = index;
        updateCarousel();
    }
    
    function nextItem() {
        currentPosition++;
        updateCarousel();
        
        if (currentPosition >= itemCount) {
            setTimeout(() => {
                slidesContainer.style.transition = 'none';
                currentPosition = 0;
                slidesContainer.style.transform = `translateX(0)`;
                setTimeout(() => {
                    slidesContainer.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
    }
    
    function prevItem() {
        currentPosition = (currentPosition - 1 + itemCount) % itemCount;
        updateCarousel();
    }
    
    // Autoplay para o carrossel de links
    function startAutoplay() {
        autoplayInterval = setInterval(nextItem, 5000);
        autoplayIntervals.push(autoplayInterval);
    }
    
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    prevBtn.addEventListener('click', () => {
        prevItem();
        pauseAutoplay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextItem();
        pauseAutoplay();
    });
    
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Inicialização
    slidesContainer.style.transition = 'transform 0.5s ease';
    updateCarousel();
    startAutoplay();
    
    window.addEventListener('resize', updateCarousel);
}

function addTouchSupport() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            const threshold = 50;
            
            if (touchEndX < touchStartX - threshold) {
                const nextBtn = carousel.querySelector('.next-btn');
                if (nextBtn) nextBtn.click();
            } else if (touchEndX > touchStartX + threshold) {
                const prevBtn = carousel.querySelector('.prev-btn');
                if (prevBtn) prevBtn.click();
            }
        }
    });
}

// Adicione no final do arquivo
function clearAllAutoplay() {
    autoplayIntervals.forEach(interval => clearInterval(interval));
    autoplayIntervals = [];
}

// Opcional: Limpar intervals quando a página perder foco
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearAllAutoplay();
    }
});