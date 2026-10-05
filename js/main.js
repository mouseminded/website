// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dead links: present and clickable, but do nothing (no jump to top).
document.querySelectorAll(".dead-link").forEach(a =>
  a.addEventListener("click", e => e.preventDefault())
);

// Parallax: each .bg-layer drifts by its own data-speed (scroll) and data-mouse (pointer, px).
// Back layer moves less than the front layer, which gives the depth effect.
(() => {
  const layers = [...document.querySelectorAll(".bg-layer")].map(el => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0,
    mouse: parseFloat(el.dataset.mouse) || 0,
    tile: parseFloat(getComputedStyle(el).getPropertyValue("--tile")) || 512,
  }));
  if (!layers.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let mx = 0, my = 0, tx = 0, ty = 0, queued = false;

  function render() {
    queued = false;
    tx += (mx - tx) * 0.08;   // ease toward pointer
    ty += (my - ty) * 0.08;
    for (const l of layers) {
      // modulo by tile size keeps the shift inside the oversized layer, so no edge ever shows
      const y = -((window.scrollY * l.speed) % l.tile) + ty * l.mouse;
      l.el.style.transform = `translate3d(${tx * l.mouse}px, ${y}px, 0)`;
    }
    if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) request();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(render); } }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("pointermove", e => {
    mx = -(e.clientX / innerWidth - 0.5) * 2;   // -1..1
    my = -(e.clientY / innerHeight - 0.5) * 2;
    request();
  }, { passive: true });

  render();
})();
