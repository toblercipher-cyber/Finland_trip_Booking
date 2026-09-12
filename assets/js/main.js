// Shared page interactions: scroll reveal (properties.html, destinations.html)
// + hero parallax (index.html). Each page calls the one it needs directly
// once its content exists — neither runs automatically. Both are skipped for
// prefers-reduced-motion (CSS already neutralizes the animation classes;
// this just avoids attaching dead listeners).

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initRevealOnScroll() {
  const targets = document.querySelectorAll(".property-card, .gallery-card");
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.25 },
  );
  targets.forEach((el) => observer.observe(el));
}

function initHeroParallax() {
  const image = document.querySelector(".hero__image");
  const hero = document.querySelector(".hero");
  if (!image || !hero || prefersReducedMotion) return;

  let ticking = false;
  function update() {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    image.style.transform = `translateY(${progress * 110}px)`;
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

// Destination card-stack (index.html hero, right column). Ported from a
// React/framer-motion component the user sourced elsewhere — same signed-
// offset fan math and drag-to-cycle behavior, rebuilt with plain CSS
// transitions + pointer events since this site has no build step and framer
// isn't available. Reduced motion drops the transition duration to 0 instead
// of skipping layout, so the fan itself always renders.
function initCardStack() {
  const root = document.getElementById("card-stack");
  const stage = document.getElementById("card-stack-stage");
  if (!root || !stage) return;

  const cards = Array.from(stage.querySelectorAll(".stack-card"));
  const total = cards.length;
  if (!total) return;

  const MAX_OFFSET = 1; // 3 cards visible at once (active + 1 each side) — these are big landscape cards, a hero half-column can't fit 5 without overflowing into the text
  const STEP_DEG = 12;
  let active = 0;
  let dragging = false;
  let justDragged = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let dragStartTime = 0;
  let pointerId = null;

  const dotsContainer = document.getElementById("card-stack-dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    cards.forEach((card, i) => {
      const eyebrow = card.querySelector(".stack-card__eyebrow")?.textContent ?? "";
      const title = card.querySelector(".stack-card__title")?.textContent ?? "";
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "stack-dot";
      dot.setAttribute("aria-label", `Go to ${eyebrow} — ${title}`);
      dot.title = `${eyebrow} — ${title}`;
      dot.addEventListener("click", () => setActive(i));
      dotsContainer.appendChild(dot);
    });
  }

  function signedOffset(i) {
    const raw = i - active;
    const alt = raw > 0 ? raw - total : raw + total;
    return Math.abs(alt) < Math.abs(raw) ? alt : raw;
  }

  function layout(extraX) {
    cards.forEach((card, i) => {
      const off = signedOffset(i);
      const abs = Math.abs(off);
      const isActive = off === 0;
      const visible = abs <= MAX_OFFSET;

      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-hidden", !visible);
      if (!visible) return;

      const spacing = card.offsetWidth * 0.52;
      const x = off * spacing + (isActive && extraX ? extraX : 0);
      const rot = off * STEP_DEG;
      const scale = isActive ? 1 : 0.92 - 0.04 * (abs - 1);
      const lift = isActive ? -14 : abs * 8;

      card.style.transform = `translateX(${x}px) translateY(${lift}px) rotateZ(${rot}deg) scale(${scale})`;
      card.style.zIndex = String(100 - abs);
    });
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  }

  function setActive(i) {
    active = ((i % total) + total) % total;
    layout();
  }

  function prev() {
    setActive(active - 1);
  }
  function next() {
    setActive(active + 1);
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", (event) => {
      if (justDragged) {
        justDragged = false;
        event.preventDefault();
        return;
      }
      const off = signedOffset(i);
      if (off !== 0) {
        event.preventDefault();
        setActive(i);
        return;
      }
      event.preventDefault();
      const propertyId = card.dataset.property;
      if (propertyId && window.FNAB) FNAB.setBooking({ propertyId });
      window.location.href = card.getAttribute("href") || "checkout.html";
    });
  });

  stage.addEventListener("pointerdown", (event) => {
    const card = event.target.closest(".stack-card.is-active");
    if (!card) return;
    pointerId = event.pointerId;
    dragging = true;
    dragStartX = event.clientX;
    dragStartTime = performance.now();
    root.classList.add("is-dragging");
    card.setPointerCapture(pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragDeltaX = event.clientX - dragStartX;
    layout(dragDeltaX);
  });

  function endDrag(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    root.classList.remove("is-dragging");

    const elapsed = Math.max(1, performance.now() - dragStartTime);
    const velocity = dragDeltaX / elapsed;
    const threshold = 60;

    if (Math.abs(dragDeltaX) > 5) justDragged = true;

    if (dragDeltaX > threshold || velocity > 0.5) prev();
    else if (dragDeltaX < -threshold || velocity < -0.5) next();
    else layout();

    dragDeltaX = 0;
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") prev();
    if (event.key === "ArrowRight") next();
  });

  root.querySelectorAll(".stack-arrow").forEach((btn) => {
    btn.addEventListener("click", () => (btn.dataset.dir === "left" ? prev() : next()));
  });

  window.addEventListener("resize", () => layout());

  if (prefersReducedMotion) root.classList.add("is-reduced-motion");

  layout();

  // One-time wiggle so a first-time visitor discovers this is draggable —
  // reuses the same layout(extraX) path a real drag uses, so it can't
  // conflict with the transform the CSS transition is already animating.
  // Skipped under reduced motion since it's a discoverability hint, not
  // core function — drag/click/dots/keyboard all still work without it.
  if (!prefersReducedMotion) {
    setTimeout(() => layout(22), 900);
    setTimeout(() => layout(-16), 1250);
    setTimeout(() => layout(0), 1600);
  }
}
