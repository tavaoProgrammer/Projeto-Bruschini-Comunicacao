// Opcional: Carregar o vídeo apenas quando ele estiver visível na tela
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    
    // Configurações do IntersectionObserver
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Vídeo está visível - tentar reproduzir
                video.play().catch(e => console.log('Autoplay não permitido:', e));
            } else {
                // Vídeo não está visível - pausar
                video.pause();
            }
        });
    }, options);
    
    observer.observe(video);
});