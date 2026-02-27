// script.js - Keychron Interactions

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // 2. Hide Header on Scroll Down, Show on Scroll Up
    let lastScroll = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hide');
        } else if (currentScroll > lastScroll && currentScroll > 80) {
            // Scroll down
            header.classList.add('hide');
        } else {
            // Scroll up
            header.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in-up');

    // Set custom transition delays if defined in data attributes
    fadeElements.forEach(el => {
        const delay = el.getAttribute('data-delay');
        if (delay) el.style.transitionDelay = delay;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // Simple Add to Cart Mock interaction
    const cartBtns = document.querySelectorAll('a.btn-accent[href="#"]');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Added to Cart ✓';
            btn.style.backgroundColor = '#10B981'; // Green success color

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2500);
        });
    });
});
