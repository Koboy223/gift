const right = document.getElementsByClassName("right");
let si = right.length;
let z = 1;
let isAnimating = false;
const animationDuration = 700;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
const minSwipeDistance = 50;
let lastTouchTime = 0;
const debounceDelay = 100;

for (let i = 0; i < right.length; i++) {
    right[i].className = "right";
    right[i].style.zIndex = "auto";
}

setTimeout(() => {
    isAnimating = false;
}, 100);

function turnRight() {
    if (isAnimating || si <= 1) return;
    isAnimating = true;
    requestAnimationFrame(() => {
        si--;
        right[si].classList.add("flip");
        z++;
        right[si].style.zIndex = z;
        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);
    });
}

function turnLeft() {
    if (isAnimating || si >= right.length) return;
    isAnimating = true;
    requestAnimationFrame(() => {
        si++;
        right[si - 1].classList.add("flip-back");
        right[si - 1].style.zIndex = z;
        z++;
        setTimeout(() => {
            right[si - 1].classList.remove("flip-back");
            right[si - 1].className = "right";
            right[si - 1].style.zIndex = "auto";
            isAnimating = false;
        }, animationDuration);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleKeyDown = debounce((e) => {
    if (isAnimating) return;
    if (e.code === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        turnRight();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        turnLeft();
    }
}, debounceDelay);

document.addEventListener('keydown', handleKeyDown);

const bookContainer = document.getElementById('bookContainer');

bookContainer.addEventListener('touchstart', (e) => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastTouchTime < debounceDelay) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, { passive: true });

bookContainer.addEventListener('touchmove', (e) => {
    if (isAnimating) return;
    if (Math.abs(e.touches[0].clientX - startX) > Math.abs(e.touches[0].clientY - startY)) {
        e.preventDefault();
    }
}, { passive: false });

bookContainer.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastTouchTime < debounceDelay) return;
    lastTouchTime = now;
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (isAnimating) return;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            turnLeft();
        } else {
            turnRight();
        }
    }
}

let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

window.addEventListener('orientationchange', () => {
    isAnimating = true;
    setTimeout(() => {
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
        setTimeout(() => {
            isAnimating = false;
        }, 200);
    }, 100);
});

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());