document.addEventListener('DOMContentLoaded', () => {

    // ===== EFFET SPOTLIGHT & CURSEUR PERSONNALISÉ =====
    const body = document.body;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            
            body.style.setProperty('--mouse-x', `${clientX}px`);
            body.style.setProperty('--mouse-y', `${clientY}px`);
            
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top = `${clientY}px`;
            cursorOutline.style.left = `${clientX}px`;
            cursorOutline.style.top = `${clientY}px`;
        });
    }

    // ===== ANIMATION DE FRAPPE (TYPING) =====
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const textToType = "Je conçois et développe pour le web.";
        let index = 0;
        function type() {
            if (index < textToType.length) {
                typingTextElement.textContent += textToType.charAt(index);
                index++;
                setTimeout(type, 70); // Vitesse de frappe
            }
        }
        type();
    }

    // ===== APPARITION DES SECTIONS AU DÉFILEMENT (Intersection Observer) =====
    const sectionsToReveal = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sectionsToReveal.forEach(section => observer.observe(section));

    // ===== MENU HAMBURGER =====
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        body.classList.toggle("blur-effect"); // Ajoute/retire le flou
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("blur-effect"); // Retire le flou
    }));
    
    // ===== CACHER/AFFICHER LE HEADER AU SCROLL =====
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener("scroll", function() {
       let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
       if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
           // Scroll vers le bas
           header.style.top = `-${header.offsetHeight}px`;
       } else {
           // Scroll vers le haut
           header.style.top = "0";
       }
       lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});