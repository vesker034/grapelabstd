document.addEventListener('DOMContentLoaded', () => {

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) {
        return; 
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Если элемент в зоне видимости
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Отключаем наблюдение за этим элементом, чтобы анимация сработала только раз
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px', 
        threshold: 0.1   
    });

    // Начинаем наблюдение за каждым элементом
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
