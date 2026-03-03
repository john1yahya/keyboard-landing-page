/**
 * script.js — Keychron Landing Page
 *
 * Sections:
 *   1. Initialisation helpers
 *   2. Navigation (header hide/show, mobile menu)
 *   3. Scroll-reveal animations
 *   4. Web Audio — switch sound synthesizer
 *   5. Sound test buttons
 *   6. Accordion
 *   7. Style / colour selector (Spotlight)
 *   8. Cart manager (localStorage-backed)
 *   9. Filter bar (used on keyboards.html / accessories.html)
 *  10. FAQ accordion (support.html)
 *  11. Contact form (support.html)
 *  12. Bootstrap
 */

'use strict';

/* -----------------------------------------------------------------------
   1. INITIALISATION HELPERS
   ----------------------------------------------------------------------- */

/** Shorthand querySelector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* -----------------------------------------------------------------------
   2. NAVIGATION
   ----------------------------------------------------------------------- */

function initNavigation() {
    const header = $('#header');
    const mobileMenuBtn = $('#mobileMenuBtn');
    const navLinks = $('#navLinks');
    const navLinkItems = $$('.nav-link');

    if (!header || !mobileMenuBtn) return;

    // --- Mobile menu toggle ---
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileMenuBtn.classList.toggle('open', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        });
    });

    // --- Hide header on scroll down, show on scroll up ---
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY <= 0) {
            header.classList.remove('hide');
        } else if (currentY > lastScrollY && currentY > 80) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
        lastScrollY = currentY;
    }, { passive: true });
}


/* -----------------------------------------------------------------------
   3. SCROLL-REVEAL ANIMATIONS
   ----------------------------------------------------------------------- */

function initScrollReveal() {
    const elements = $$('.fade-in-up');
    if (!elements.length) return;

    // Apply staggered delay from data-delay attribute
    elements.forEach(el => {
        const delay = el.dataset.delay;
        if (delay) el.style.transitionDelay = delay;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


/* -----------------------------------------------------------------------
   4. WEB AUDIO — SWITCH SOUND SYNTHESIZER
   ----------------------------------------------------------------------- */

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * Synthesise a realistic mechanical key-click sound using the Web Audio API.
 * @param {'linear'|'tactile'|'clicky'} type - The switch type
 */
function playKeySwitchSound(type) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // --- Shared nodes ---
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    // A short compressor smooths the peaks
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -6;
    compressor.connect(masterGain);

    if (type === 'linear') {
        // Linear (Red): A soft, low-pitched thump — quiet and smooth
        masterGain.gain.setValueAtTime(0.4, now);

        const osc = ctx.createOscillator();
        const envGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
        envGain.gain.setValueAtTime(1, now);
        envGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(envGain);
        envGain.connect(compressor);
        osc.start(now);
        osc.stop(now + 0.12);

    } else if (type === 'tactile') {
        // Tactile (Brown): A soft click followed by a definitive bump
        masterGain.gain.setValueAtTime(0.5, now);

        // Initial quiet click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(800, now);
        clickGain.gain.setValueAtTime(0.3, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        clickOsc.connect(clickGain);
        clickGain.connect(compressor);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // Tactile bump
        const bumpOsc = ctx.createOscillator();
        const bumpGain = ctx.createGain();
        bumpOsc.type = 'sine';
        bumpOsc.frequency.setValueAtTime(160, now + 0.015);
        bumpOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
        bumpGain.gain.setValueAtTime(0, now);
        bumpGain.gain.setValueAtTime(0.9, now + 0.015);
        bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        bumpOsc.connect(bumpGain);
        bumpGain.connect(compressor);
        bumpOsc.start(now + 0.015);
        bumpOsc.stop(now + 0.14);

    } else if (type === 'clicky') {
        // Clicky (Blue): A sharp, loud click — crisp and pronounced
        masterGain.gain.setValueAtTime(0.65, now);

        // Sharp transient click
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(1200, now);
        noise.frequency.exponentialRampToValueAtTime(800, now + 0.015);
        noiseGain.gain.setValueAtTime(1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        noise.connect(noiseGain);
        noiseGain.connect(compressor);
        noise.start(now);
        noise.stop(now + 0.025);

        // Resonant body
        const body = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        body.type = 'sine';
        body.frequency.setValueAtTime(350, now + 0.005);
        body.frequency.exponentialRampToValueAtTime(120, now + 0.07);
        bodyGain.gain.setValueAtTime(0.8, now + 0.005);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        body.connect(bodyGain);
        bodyGain.connect(compressor);
        body.start(now + 0.005);
        body.stop(now + 0.11);
    }
}


/* -----------------------------------------------------------------------
   5. SOUND TEST BUTTONS
   ----------------------------------------------------------------------- */

function initSoundTest() {
    const soundBtns = $$('.sound-btn');
    if (!soundBtns.length) return;

    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const switchType = btn.dataset.switch;
            const isPlaying = btn.classList.contains('playing');

            // Reset all buttons
            soundBtns.forEach(b => b.classList.remove('playing'));

            if (!isPlaying) {
                btn.classList.add('playing');

                // Fire 4 rapid key sounds to simulate typing
                [0, 0.15, 0.28, 0.4].forEach(delay => {
                    setTimeout(() => playKeySwitchSound(switchType), delay * 1000);
                });

                // Remove playing state after sequence
                setTimeout(() => btn.classList.remove('playing'), 900);
            }
        });
    });
}


/* -----------------------------------------------------------------------
   6. ACCORDION
   ----------------------------------------------------------------------- */

function initAccordions() {
    $$('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close siblings
            const siblings = $$('.accordion-item', item.closest('.accordion'));
            siblings.forEach(sib => {
                sib.classList.remove('active');
                sib.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                const sibContent = sib.querySelector('.accordion-content');
                if (sibContent) sibContent.removeAttribute('style');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                // Remove the hidden attribute so CSS max-height transition works
                if (content.hasAttribute('hidden')) content.removeAttribute('hidden');
            }
        });
    });
}


/* -----------------------------------------------------------------------
   7. STYLE / COLOUR SELECTOR (Spotlight)
   ----------------------------------------------------------------------- */

function initStyleSelector() {
    const dots = $$('.style-dot');
    const productImg = $('#mainProductImg');
    if (!dots.length || !productImg) return;

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => {
                d.classList.remove('active');
                d.setAttribute('aria-pressed', 'false');
            });
            dot.classList.add('active');
            dot.setAttribute('aria-pressed', 'true');

            // Fade-swap  image
            productImg.style.opacity = '0';
            setTimeout(() => {
                productImg.src = dot.dataset.img;
                productImg.style.opacity = '1';
            }, 250);
        });
    });
}


/* -----------------------------------------------------------------------
   8. CART MANAGER
   ----------------------------------------------------------------------- */

const Cart = (() => {
    const STORAGE_KEY = 'keychron_cart';

    // --- State ---
    let items = [];

    function load() {
        try {
            items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            items = [];
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getItems() { return items; }

    function totalQty() {
        return items.reduce((sum, i) => sum + i.qty, 0);
    }

    function subtotal() {
        return items.reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    function add(id, name, price) {
        const existing = items.find(i => i.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            items.push({ id, name, price: parseFloat(price), qty: 1 });
        }
        save();
    }

    function remove(id) {
        items = items.filter(i => i.id !== id);
        save();
    }

    function changeQty(id, delta) {
        const item = items.find(i => i.id === id);
        if (!item) return;
        item.qty = Math.max(0, item.qty + delta);
        if (item.qty === 0) remove(id);
        else save();
    }

    return { load, getItems, totalQty, subtotal, add, remove, changeQty };
})();


function initCart() {
    Cart.load();

    const cartBtn = $('#cartBtn');
    const cartOverlay = $('#cartOverlay');
    const cartDrawer = $('#cartDrawer');
    const cartCloseBtn = $('#cartCloseBtn');
    const cartCount = $('#cartCount');

    if (!cartBtn) return;

    // --- Open / close helpers ---
    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        cartDrawer.setAttribute('aria-hidden', 'false');
        cartOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        renderCart();
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
        cartDrawer.setAttribute('aria-hidden', 'true');
        cartOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // ESC key closes cart
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

    // --- Render cart contents ---
    function renderCart() {
        const cartItems = $('#cartItems');
        const cartFooter = $('#cartFooter');
        const subtotalEl = $('#cartSubtotal');
        const items = Cart.getItems();

        updateBadge();

        if (!items.length) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i data-lucide="shopping-bag" size="48"></i>
                    <p>Your cart is empty.</p>
                    <a href="keyboards.html" class="btn btn-primary btn-sm" style="margin-top:0.5rem;">Shop Keyboards</a>
                </div>`;
            cartFooter.style.display = 'none';
            lucide.createIcons();
            return;
        }

        cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        <button class="cart-item-remove" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">
                            <i data-lucide="trash-2" size="15"></i>
                        </button>
                    </div>
                </div>
            </div>`).join('');

        cartItems.addEventListener('click', handleCartAction);
        cartFooter.style.display = 'block';
        subtotalEl.textContent = `$${Cart.subtotal()}`;
        lucide.createIcons();
    }

    function handleCartAction(e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const { action, id } = btn.dataset;
        if (action === 'inc') Cart.changeQty(id, +1);
        if (action === 'dec') Cart.changeQty(id, -1);
        if (action === 'remove') Cart.remove(id);
        renderCart();
    }

    function updateBadge() {
        const qty = Cart.totalQty();
        cartCount.textContent = qty;
        cartCount.classList.toggle('visible', qty > 0);
    }

    // --- "Add to Cart" buttons across the page ---
    function bindAddToCartButtons() {
        $$('[data-product-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const { productId, productName, productPrice } = btn.dataset;
                Cart.add(productId, productName, productPrice);
                updateBadge();

                // Visual feedback
                const original = btn.textContent;
                btn.textContent = '✓ Added!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = '';
                }, 2000);
            });
        });
    }

    updateBadge();
    bindAddToCartButtons();

    // Expose openCart so other pages can re-bind buttons
    window.Cart = { ...Cart, openCart, renderCart, updateBadge, bindAddToCartButtons };
}


/* -----------------------------------------------------------------------
   9. FILTER BAR (keyboards.html / accessories.html)
   ----------------------------------------------------------------------- */

function initFilterBar() {
    const filterBtns = $$('.filter-btn');
    const productCards = $$('.product-card[data-series]');
    if (!filterBtns.length || !productCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            productCards.forEach(card => {
                const show = filter === 'all' || card.dataset.series === filter;
                card.style.display = show ? '' : 'none';
            });
        });
    });
}


/* -----------------------------------------------------------------------
   10. FAQ ACCORDION (support.html)
   ----------------------------------------------------------------------- */

function initFaq() {
    $$('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');
            $$('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}


/* -----------------------------------------------------------------------
   11. CONTACT FORM (support.html)
   ----------------------------------------------------------------------- */

function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#10b981';
        form.reset();
        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.style.background = '';
        }, 3000);
    });
}


/* -----------------------------------------------------------------------
   12. BOOTSTRAP — Run everything on DOM ready
   ----------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year') &&
        (document.getElementById('year').textContent = new Date().getFullYear());

    initNavigation();
    initScrollReveal();
    initSoundTest();
    initAccordions();
    initStyleSelector();
    initCart();
    initFilterBar();
    initFaq();
    initContactForm();
});
