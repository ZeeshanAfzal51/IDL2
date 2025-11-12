/ Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Three.js Globe Animation
function initGlobe() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create globe
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Create custom material with wireframe
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add points (cities/locations)
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 1000;
    const positions = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 5.01;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Add ambient glow
    const glowGeometry = new THREE.SphereGeometry(5.5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    camera.position.z = 15;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth mouse follow
        targetX = mouseX * 0.3;
        targetY = mouseY * 0.3;

        globe.rotation.x += 0.001;
        globe.rotation.y += 0.002;
        globe.rotation.x += (targetY - globe.rotation.x) * 0.05;
        globe.rotation.y += (targetX - globe.rotation.y) * 0.05;

        points.rotation.x = globe.rotation.x;
        points.rotation.y = globe.rotation.y;

        glow.rotation.x = globe.rotation.x;
        glow.rotation.y = globe.rotation.y;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize globe when page loads
window.addEventListener('load', initGlobe);

// Animated counters
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            
            // Animate counters when hero section is visible
            if (entry.target.classList.contains('hero')) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseFloat(counter.dataset.target);
                    animateCounter(counter, target);
                });
            }
        }
    });
}, observerOptions);

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.service-card, .sdg-card, .client-card, .hero');
    sections.forEach(section => observer.observe(section));
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Show success message (you can replace this with actual form submission)
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        
        // In production, you would send this to a backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // }).then(response => response.json())
        //   .then(data => console.log(data));
    });
}

// Parallax effect on scroll
let scrollPos = 0;
window.addEventListener('scroll', () => {
    scrollPos = window.pageYOffset;
    
    // Parallax for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPos * 0.5}px)`;
        heroContent.style.opacity = 1 - scrollPos / 700;
    }
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Image lazy loading optimization
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// Add cursor trail effect (optional, can be removed if too heavy)
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

if (window.innerWidth > 768) {
    // Only on desktop
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
}

// Glitch effect for hero title
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 240, 255, 0.7),
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 229, 0.7)
            `;
            setTimeout(() => {
                glitchText.style.textShadow = 'none';
            }, 50);
        }
    }, 100);
}

// Performance optimization: Disable animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

// Add viewport height fix for mobile browsers
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

// Service worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}
