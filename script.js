/* ═══════════════════════════════════════════════════════════════════════════
   ATTENTION VIOLENCE CARDS — Interactive Logic
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const cardsWrapper = document.querySelector('.cards-wrapper');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const currentCounter = document.querySelector('.card-counter .current');
    const progressFill = document.querySelector('.progress-fill');
    const totalCards = cards.length;

    let currentIndex = 0;

    // ─── Update UI State ───────────────────────────────────────────────────────
    function updateUI() {
        // Update counter
        currentCounter.textContent = currentIndex + 1;

        // Update progress bar
        const progress = ((currentIndex + 1) / totalCards) * 100;
        progressFill.style.width = `${progress}%`;

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentIndex === totalCards - 1 ? '0.3' : '1';

        // Update active card styling
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }

    // ─── Navigate to Card ──────────────────────────────────────────────────────
    function goToCard(index) {
        if (index < 0 || index >= totalCards) return;
        currentIndex = index;
        cards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        updateUI();
    }

    // ─── Navigation Buttons ────────────────────────────────────────────────────
    prevBtn.addEventListener('click', () => {
        goToCard(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToCard(currentIndex + 1);
    });

    // ─── Keyboard Navigation ───────────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToCard(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToCard(currentIndex + 1);
        } else if (e.key === 'Home') {
            goToCard(0);
        } else if (e.key === 'End') {
            goToCard(totalCards - 1);
        }
    });

    // ─── Scroll Detection ──────────────────────────────────────────────────────
    let scrollTimeout;
    cardsWrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Find the most visible card
            const wrapperRect = cardsWrapper.getBoundingClientRect();
            const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(wrapperCenter - cardCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateUI();
            }
        }, 50);
    });

    // ─── Touch Swipe Support ───────────────────────────────────────────────────
    let touchStartX = 0;
    let touchEndX = 0;

    cardsWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardsWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next card
                goToCard(currentIndex + 1);
            } else {
                // Swipe right - previous card
                goToCard(currentIndex - 1);
            }
        }
    }

    // ─── Intersection Observer for Animations ──────────────────────────────────
    const observerOptions = {
        root: cardsWrapper,
        threshold: 0.5
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // ─── Glitch Effect on Hover (for illustration placeholders) ────────────────
    const placeholders = document.querySelectorAll('.placeholder');

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', () => {
            placeholder.classList.add('glitch-hover');
        });

        placeholder.addEventListener('mouseleave', () => {
            placeholder.classList.remove('glitch-hover');
        });
    });

    // ─── Progress Bar Click Navigation ─────────────────────────────────────────
    const progressBar = document.querySelector('.progress-bar');

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const targetIndex = Math.floor(clickPosition * totalCards);
        goToCard(targetIndex);
    });

    // ─── Initialize ────────────────────────────────────────────────────────────
    updateUI();

    // Add initial animation delay
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Hide swipe hint after first interaction
    const swipeHint = document.querySelector('.swipe-hint');
    let hasInteracted = false;

    function hideSwipeHint() {
        if (!hasInteracted) {
            hasInteracted = true;
            swipeHint.style.transition = 'opacity 0.5s ease';
            swipeHint.style.opacity = '0';
            setTimeout(() => {
                swipeHint.style.display = 'none';
            }, 500);
        }
    }

    cardsWrapper.addEventListener('scroll', hideSwipeHint, { once: true });
    document.addEventListener('keydown', hideSwipeHint, { once: true });

    // ─── Prefers Reduced Motion ────────────────────────────────────────────────
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-medium', '0s');
    }

    // ─── Debug Info (remove in production) ─────────────────────────────────────
    console.log(`
    ═══════════════════════════════════════════════════════════════
    ATTENTION VIOLENCE CARDS
    ═══════════════════════════════════════════════════════════════
    Total cards: ${totalCards}
    Navigation: ← → arrows, swipe, or click progress bar

    "Can hooks teach long attention?"
    — Bernard Stiegler's paradox
    ═══════════════════════════════════════════════════════════════
    `);
});
