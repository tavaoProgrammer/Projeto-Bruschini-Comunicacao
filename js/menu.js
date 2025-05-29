// Menu toggle melhorado
const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu-list');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    menuList.classList.toggle('active');
    
    // Bloqueia/desbloqueia o scroll da página quando o menu está aberto
    document.body.style.overflow = menuList.classList.contains('active') ? 'hidden' : '';
});

// Fechar o menu ao clicar em um link ou fora do menu
document.addEventListener('click', function(e) {
    const isMenuClick = e.target.closest('.menu-container') || 
                       e.target.closest('.menu-list');
    
    if (!isMenuClick && menuList.classList.contains('active')) {
        menuToggle.classList.remove('active');
        menuList.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Scroll suave com offset para o menu
document.querySelectorAll('.menu-list a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const menuHeight = document.querySelector('.menu-container').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - menuHeight,
                behavior: 'smooth'
            });
            
            // Fecha o menu mobile se estiver aberto
            if (menuList.classList.contains('active')) {
                menuToggle.classList.remove('active');
                menuList.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});