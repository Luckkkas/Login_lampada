const room = document.getElementById('room');
const fireflies = document.getElementById('fireflies');
const handle = document.getElementById('stringHandle');
const path = document.getElementById('stringPath');
const lampContainer = document.getElementById('lampContainer');
const loginForm = document.getElementById('loginForm');

let isOn = false;
let dragging = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragY = 0;

function setLamp(on) {
    isOn = on;
    room.classList.toggle("on", isOn);
    if (isOn) createFireflies();
    else fireflies.innerHTML = "";
}

function updateString(x, y) {
    path.setAttribute("d", `M 0 0 L ${x} ${80 + y}`);
}

function resetHandle() {
    handle.style.transform = "translate(0px, 0px)"
    updateString(0, 0);
}

function pointerDown(e) {
    dragging = true;
    handle.classList.add("dragging");
    startX = e.clientX;
    startY = e.clientY;
    dragX = 0;
    dragY = 0;
    handle.setPointerCapture?.(e.pointerId);
}

function pointerMove(e) {
   if (!dragging) return;
   dragX = (e.clientX - startX) * 0.3;
   dragY = Math.max(0, e.clientY - startY) * 0.6;
   dragX = Math.max(-35, Math.min(35, dragX));
   dragY = Math.min(180, dragY);
   handle.style.transform = `translate(${dragX}px, ${dragY}px)`;
   updateString(dragX, dragY);
}

function pointerUp() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove("dragging");

    const pulled = dragY > 30;
    resetHandle();

    if (pulled) setLamp(!isOn);
}

handle.addEventListener("pointerdown", pointerDown);
handle.addEventListener("pointermove", pointerMove);
handle.addEventListener("pointerup", pointerUp);
handle.addEventListener("pointercancel", pointerUp);

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createFireflies() {
    fireflies.innerHTML = '';

    for (let i = 0; i < 18; i++) {
        const dot = document.createElement('span');
        dot.className = 'firefly';

        const size = random(3, 7);
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.setProperty('--duration', `${random(35, 65)}s`);
        dot.style.setProperty('--delay', `${random(0, 3)}s`);

        for (let m = 1; m <= 5; m++) {
            dot.style.setProperty(`--x${m}`, `${random(0, 100)}vw`);
            dot.style.setProperty(`--y${m}`, `${random(0, 100)}vh`);
        }

        fireflies.appendChild(dot);
    }
}

lampContainer.addEventListener('click', (e) => {
    if (!e.target.closest('#stringHandle')) {
        setLamp(!isOn);
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

setLamp(false);