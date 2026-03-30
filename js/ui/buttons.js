// buttons.js — Touch-friendly button helpers

let lastTapTime = 0;

export function handleTap(callback, debounceMs = 200) {
  return (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTapTime < debounceMs) return;
    lastTapTime = now;
    callback(e);
  };
}

export function addRipple(button) {
  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 400);
}
