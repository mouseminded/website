// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dead links: present and clickable, but do nothing (no jump to top).
document.querySelectorAll(".dead-link").forEach(a =>
  a.addEventListener("click", e => e.preventDefault())
);

// Parallax background: scroll moves it slower than the page, mouse nudges it slightly.
(() => {
  const bg = document.querySelector(".bg");
  if (!bg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const tile = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tile")) || 256;
  const SCROLL_SPEED = 0.3;   // 0 = static, 1 = moves with page
  const MOUSE_RANGE = 14;     // max px of pointer drift

  let mx = 0, my = 0, tx = 0, ty = 0, queued = false;

  function render() {
    queued = false;
    // ease toward pointer target
    tx += (mx - tx) * 0.08;
    ty += (my - ty) * 0.08;
    // modulo by tile size keeps the shift small so the oversized layer never shows an edge
    const y = -((window.scrollY * SCROLL_SPEED) % tile) + ty;
    bg.style.transform = `translate3d(${tx}px, ${y}px, 0)`;
    if (Math.abs(mx - tx) > 0.1 || Math.abs(my - ty) > 0.1) request();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(render); } }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("pointermove", e => {
    mx = (e.clientX / innerWidth - 0.5) * -MOUSE_RANGE * 2;
    my = (e.clientY / innerHeight - 0.5) * -MOUSE_RANGE * 2;
    request();
  }, { passive: true });

  render();
})();
