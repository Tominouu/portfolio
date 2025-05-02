// Initialisation de GSAP
gsap.registerPlugin(ScrollTrigger);

// Optimisation des performances
gsap.config({
    nullTargetWarn: false,
    force3D: true,
    autoSleep: 60
});

// Animation du curseur personnalisé optimisée
const cursor = document.querySelector('.cursor');
const cursorTrail = Array.from({length: 5}, () => cursor.cloneNode(true));
cursorTrail.forEach((trail, i) => {
    trail.style.opacity = (1 - i * 0.2);
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
});

let cursorX = 0;
let cursorY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

gsap.ticker.add(() => {
    cursorX += (targetX - cursorX) * 0.2;
    cursorY += (targetY - cursorY) * 0.2;
    
    gsap.set(cursor, {
        x: cursorX,
        y: cursorY
    });
    
    cursorTrail.forEach((trail, i) => {
        gsap.set(trail, {
            x: cursorX,
            y: cursorY,
            delay: i * 0.05
        });
    });
});

// Animation du chargement optimisée
const loadingAnimation = () => {
    const tl = gsap.timeline();
    
    // Réinitialisation de l'état initial du bouton
    gsap.set('.photo-button', {
        opacity: 0,
        y: 50,
        scale: 0.5
    });
    
    tl.to('.loader-text', {
        textContent: "100%",
        duration: 1.5,
        snap: { textContent: 1 },
        ease: "power2.inOut"
    })
    .to('.loader-text', {
        scale: 2,
        rotation: 720,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
    })
    .to('.loader', {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "power2.inOut"
    })
    .from('.hero-title', {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.5")
    .from('.hero-subtitle', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.5")
    .to('.photo-button', {
        duration: 1.2,
        scale: 1,
        y: 0,
        opacity: 1,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.3");
    
    return tl;
};

// Animation du texte défilant optimisée
const marqueeAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.marquee',
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none none reverse"
        }
    });
    
    tl.to('.marquee', {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
    })
    .to('.marquee-inner', {
        x: "-50%",
        duration: 20,
        ease: "none",
        repeat: -1
    }, "-=0.5");
    
    return tl;
};

// Animation des projets optimisée
const projectsAnimation = () => {
    gsap.set('.project-item', { 
        opacity: 0,
        y: 100
    });
    
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach((item, index) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top bottom-=100",
                end: "bottom center",
                toggleActions: "play none none reverse",
                scrub: 0.5
            }
        });
        
        const projectImage = item.querySelector('.project-image');
        const projectContent = item.querySelector('.project-content');
        
        tl.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        })
        .fromTo(projectImage, 
            { scale: 1.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.5"
        )
        .fromTo(projectContent,
            { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.5"
        );
    });
};

// Animation de la section À propos optimisée
const aboutAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
    
    gsap.set('.about-text', { opacity: 0, y: 50 });
    gsap.set('.skills', { opacity: 0 });
    
    tl.from('.about-title', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power2.out"
    })
    .to('.about-text', {
        duration: 0.8,
        y: 0,
        opacity: 1,
        stagger: 0.2,
        ease: "power2.out"
    })
    .to('.skills', {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
    })
    .from('.skills .skill', {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    });
    
    return tl;
};

// Animation de la section Contact optimisée
const contactAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
    
    // Réinitialisation des états initiaux
    gsap.set('.contact-text', { opacity: 0, y: 30 });
    gsap.set('.contact-form', { opacity: 0, y: 30 });
    gsap.set('.form-group', { opacity: 0, y: 20 });
    
    tl.from('.contact-title', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: "power2.out"
    })
    .to('.contact-text', {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: "power2.out"
    })
    .to('.contact-form', {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: "power2.out"
    })
    .to('.form-group', {
        duration: 0.4,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out"
    });
    
    return tl;
};

// Animation du footer optimisée
const footerAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer',
            start: "top bottom",
            toggleActions: "play none none reverse"
        }
    });
    
    tl.from('.footer', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: "power2.out"
    });
    
    return tl;
};

// Animation du bouton retour en haut optimisée
const backToTopAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: 'body',
            start: "top -=100",
            toggleActions: "play none none reverse"
        }
    });
    
    tl.to('.back-to-top', {
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: "power2.out"
    });
    
    document.querySelector('.back-to-top').addEventListener('click', () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: 0,
            ease: "power2.inOut"
        });
    });
    
    return tl;
};

// Animation de parallaxe optimisée
const parallaxAnimation = () => {
    const images = document.querySelectorAll('.project-image');
    
    images.forEach((image) => {
        gsap.to(image, {
            y: 50,
            ease: "none",
            scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
            }
        });
    });
};

// Animation du titre principal optimisée
const heroTitleAnimation = () => {
    gsap.to('.hero-title', {
        y: -100,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 0.5
        }
    });
};

// Animation du titre des projets optimisée
const projectsTitleAnimation = () => {
    gsap.from('.projects-title', {
        y: 50,
        opacity: 0,
        scrollTrigger: {
            trigger: '.projects-title',
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        }
    });
};

// Effet de zoom optimisé sur les images
const projectImageHoverEffect = () => {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach((img) => {
        img.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(cursor, {
                scale: 2,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                duration: 0.2
            });
        });
        
        img.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                duration: 0.2
            });
        });
    });
};

// Effet de survol optimisé
const hoverDistortionEffect = () => {
    const items = document.querySelectorAll('.project-item, .skill, button');
    
    items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 1.5,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                duration: 0.2
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                duration: 0.2
            });
        });
    });
};

// Initialisation des animations
window.addEventListener('DOMContentLoaded', () => {
    // Initialisation du bouton photo
    gsap.set('.photo-button', {
        opacity: 0,
        y: 50
    });

    const masterTimeline = gsap.timeline();
    
    masterTimeline
        .add(loadingAnimation())
        .add(marqueeAnimation(), "+=0.2")
        .add(projectsAnimation(), "-=0.2")
        .add(aboutAnimation(), "-=0.2")
        .add(contactAnimation(), "-=0.2")
        .add(footerAnimation(), "-=0.2")
        .add(backToTopAnimation(), "-=0.2");
    
    parallaxAnimation();
    heroTitleAnimation();
    projectsTitleAnimation();
    projectImageHoverEffect();
    hoverDistortionEffect();
});