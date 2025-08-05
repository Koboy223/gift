let tapCount = 0;
let currentSlide = 0;
const totalSlides = 5;
const maxTaps = 15;

const giftBox = document.getElementById('giftBox');
const tapCounter = document.getElementById('tapCounter');
const progressFill = document.getElementById('progressFill');
const remainingTaps = document.getElementById('remainingTaps');
const carouselContainer = document.getElementById('carouselContainer');
const carouselImages = document.getElementById('carouselImages');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');
const menuBtn = document.getElementById('menuBtn');
const menuOptions = document.getElementById('menuOptions');
const navDots = document.querySelectorAll('.nav-dot');
const fullscreenTouch = document.getElementById('fullscreenTouch');

function createSpectacularConfetti() {
    if (typeof confetti === 'undefined') {
        createCSSConfetti();
        return;
    }

    const defaults = { startVelocity: 20, spread: 360, ticks: 40, zIndex: 2000 };
    confetti({
        ...defaults,
        particleCount: 30,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff6b6b', '#4ecdc4', '#ffd700']
    });

    setInterval(() => {
        confetti({
            ...defaults,
            particleCount: 20,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 500);

    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.4 },
            shapes: ['star'],
            colors: ['#ffd700', '#ffed4e'],
            gravity: 0.6
        });
    }, 1000);
}

function createCSSConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd700'];
    for (let i = 0; i < 20; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = Math.random() * 8 + 4 + 'px';
        confettiPiece.style.height = Math.random() * 8 + 4 + 'px';
        confettiPiece.style.background = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-10px';
        confettiPiece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.zIndex = '2000';
        confettiPiece.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear forwards`;
        document.body.appendChild(confettiPiece);
        setTimeout(() => confettiPiece.remove(), 3000);
    }
}

function handleGiftTap(event) {
    if (carouselContainer.classList.contains('show')) return;
    event.preventDefault();

    tapCount++;
    const remaining = Math.max(0, maxTaps - tapCount);
    remainingTaps.textContent = remaining;
    tapCounter.textContent = tapCount;
    tapCounter.classList.add('show');

    progressFill.style.width = `${(tapCount / maxTaps) * 100}%`;
    giftBox.classList.add('shake');
    setTimeout(() => giftBox.classList.remove('shake'), 400);

    if (remaining === 0) {
        document.getElementById('giftText').innerHTML = '🎉 The gift is opening! 🎉';
        setTimeout(() => {
            createSpectacularConfetti();
            currentSlide = 0;
            updateCarousel();
            carouselContainer.classList.add('show');
            menuOptions.classList.remove('show');
        }, 500);
    } else if (remaining <= 3) {
        document.getElementById('giftText').innerHTML = `Almost there! Just ${remaining} more clicks/taps 💥`;
    } else if (remaining <= 7) {
        document.getElementById('giftText').innerHTML = `The box is breaking! ${remaining} more clicks/taps 💫`;
    } else {
        document.getElementById('giftText').innerHTML = `Tap or click <span id="remainingTaps">${remaining}</span> times to open the gift 🎁`;
    }

    setTimeout(() => tapCounter.classList.remove('show'), 1000);
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
    fullscreenTouch.addEventListener('touchstart', handleGiftTap, { passive: false });
    fullscreenTouch.addEventListener('touchend', (e) => {
        if (!carouselContainer.classList.contains('show')) e.preventDefault();
    }, { passive: false });
}

giftBox.addEventListener('click', handleGiftTap);
fullscreenTouch.addEventListener('click', handleGiftTap);

function updateCarousel() {
    carouselImages.style.transform = `translateX(${-currentSlide * 100}%)`;
    navDots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function addTouchSupport(element, callback) {
    element.addEventListener('click', callback);
    if (isTouchDevice()) {
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            callback();
        }, { passive: false });
    }
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') callback();
    });
}

addTouchSupport(nextBtn, nextSlide);
addTouchSupport(prevBtn, prevSlide);
addTouchSupport(closeBtn, () => {
    carouselContainer.classList.remove('show');
    setTimeout(() => {
        tapCount = 0;
        tapCounter.classList.remove('show');
        progressFill.style.width = '0%';
        remainingTaps.textContent = maxTaps;
        document.getElementById('giftText').innerHTML = `Tap or click <span id="remainingTaps">${maxTaps}</span> times to open the gift 🎁`;
        currentSlide = 0;
        updateCarousel();
        menuOptions.classList.remove('show');
    }, 500);
});

addTouchSupport(menuBtn, () => menuOptions.classList.toggle('show'));

menuOptions.querySelectorAll('li').forEach(option => {
    addTouchSupport(option, () => {
        const action = option.getAttribute('data-action');
        if (action === 'home') window.location.href = 'index.html';
        else if (action === 'back') window.history.back();
        menuOptions.classList.remove('show');
    });
});

document.addEventListener('click', (e) => {
    if (!menuContainer.contains(e.target)) menuOptions.classList.remove('show');
});

if (isTouchDevice()) {
    document.addEventListener('touchend', (e) => {
        if (!menuContainer.contains(e.target)) menuOptions.classList.remove('show');
    }, { passive: true });
}

navDots.forEach(dot => {
    addTouchSupport(dot, () => {
        currentSlide = parseInt(dot.getAttribute('data-slide'));
        updateCarousel();
    });
});

document.addEventListener('keydown', (e) => {
    if (carouselContainer.classList.contains('show')) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') closeBtn.click();
    } else if (e.key === 'Escape') {
        menuBtn.click();
    }
});

let startX = 0;
carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) nextSlide();
        else prevSlide();
    }
}, { passive: true })