// Complete fresh JavaScript - all fixed
document.addEventListener('DOMContentLoaded', function() {
    
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.style.display = 'none', 500);
            }
        }, 1500);
    });
    
    // Navigation
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans.forEach(span => { span.style.transform = 'none'; span.style.opacity = '1'; });
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
            }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Animated counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    window.addEventListener('scroll', () => {
        if (hasAnimated) return;
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            hasAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        stat.textContent = target % 1 !== 0 ? current.toFixed(1) : Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    }
                };
                updateCounter();
            });
        }
    });
    
    // Gallery Slider - FIXED
    const slideWrappers = document.querySelectorAll('.slide-wrapper');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    
    if (slideWrappers.length > 0) {
        let currentIndex = 0;
        
        // Create dots
        slideWrappers.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        
        function updateSlider() {
            const isMobile = window.innerWidth <= 1024;
            
            slideWrappers.forEach((wrapper, index) => {
                wrapper.classList.remove('active', 'prev-slide', 'next-slide');
                
                if (isMobile) {
                    wrapper.style.display = index === currentIndex ? 'block' : 'none';
                    if (index === currentIndex) wrapper.classList.add('active');
                } else {
                    const prevIndex = (currentIndex - 1 + slideWrappers.length) % slideWrappers.length;
                    const nextIndex = (currentIndex + 1) % slideWrappers.length;
                    
                    if (index === currentIndex) {
                        wrapper.classList.add('active');
                        wrapper.style.order = '2';
                    } else if (index === prevIndex) {
                        wrapper.classList.add('prev-slide');
                        wrapper.style.order = '1';
                    } else if (index === nextIndex) {
                        wrapper.classList.add('next-slide');
                        wrapper.style.order = '3';
                    }
                }
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideWrappers.length;
            updateSlider();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideWrappers.length) % slideWrappers.length;
            updateSlider();
        }
        
        if (prevArrow) prevArrow.addEventListener('click', prevSlide);
        if (nextArrow) nextArrow.addEventListener('click', nextSlide);
        
        setInterval(nextSlide, 4000);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderContainer = document.querySelector('.slider-container');
        
        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? nextSlide() : prevSlide();
                }
            }, { passive: true });
        }
        
        window.addEventListener('resize', updateSlider);
        updateSlider();
    }
    
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale').forEach(el => observer.observe(el));
    
    // Scroll to top
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#5A0F26;border:none;border-radius:50%;font-size:1.5rem;cursor:pointer;z-index:999;opacity:0;visibility:hidden;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(212,175,55,0.4);';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollBtn.addEventListener('mouseenter', () => scrollBtn.style.transform = 'scale(1.1) translateY(-5px)');
    scrollBtn.addEventListener('mouseleave', () => scrollBtn.style.transform = 'scale(1) translateY(0)');
    
    console.log('✨ Maybac Cafe - Website Loaded Successfully!');
});
