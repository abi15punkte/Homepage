(() => {
  "use strict";

  /*
   * ================================================================
   * Landingpage-Parallax: zentrale Konfiguration
   * ================================================================
   *
   * startScale / endScale
   *   Zoomstärke. 1.0 = unverändert; 1.5 = 50 % größer.
   *
   * targetX / targetY
   *   Zielpunkt innerhalb des Bildausschnitts in Prozent.
   *   0/0 = oben links, 50/50 = Mitte, 100/100 = unten rechts.
   *
   * zoomInDuration / zoomOutDuration
   *   Dauer für Hinein- bzw. Herauszoomen in Millisekunden.
   *
   * cycleDelay
   *   Optionaler Versatz innerhalb der 10-Sekunden-Schleife.
   *
   * Damit kann jedes Bild unabhängig eingestellt werden.
   */
  const DEFAULT_CONFIG = {
    startScale: 1.0,
    endScale: 1.55,
    targetX: 50,
    targetY: 50,
    zoomInDuration: 5000,
    zoomOutDuration: 5000,
    cycleDelay: 0,
    enabled: true
  };

  const PARALLAX_CONFIG = {
    "hero-1": {
      startScale: 1.0,
      endScale: 1.65,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "hero-2": {
      startScale: 1.0,
      endScale: 1.65,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "hero-3": {
      startScale: 1.0,
      endScale: 1.65,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },

    "teaser-news": {
      startScale: 1.0,
      endScale: 1.50,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "teaser-school": {
      startScale: 1.0,
      endScale: 1.50,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "teaser-dates": {
      startScale: 1.0,
      endScale: 1.50,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "teaser-contact": {
      startScale: 1.0,
      endScale: 1.50,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    },
    "teaser-support": {
      startScale: 1.0,
      endScale: 1.50,
      targetX: 50,
      targetY: 50,
      zoomInDuration: 5000,
      zoomOutDuration: 5000
    }
  };

  // Für bequemes Nachjustieren aus der Browser-Konsole zugänglich.
  window.LANDING_PAGE_PARALLAX_CONFIG = PARALLAX_CONFIG;

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  // Gleiche Easing-Kurve wie im Parallax-Testprojekt.
  const ease = (t) =>
    t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const lerp = (from, to, amount) =>
    from + (to - from) * amount;

  const resolvedConfig = (id) => ({
    ...DEFAULT_CONFIG,
    ...(PARALLAX_CONFIG[id] || {})
  });

  const targets = [];

  function addTarget(id, element, type) {
    if (!element || targets.some((target) => target.element === element)) {
      return;
    }

    const config = resolvedConfig(id);
    if (!config.enabled) {
      return;
    }

    let media = element;
    let frame = element;

    if (type === "background") {
      const backgroundImage =
        element.style.backgroundImage ||
        getComputedStyle(element).backgroundImage;

      if (!backgroundImage || backgroundImage === "none") {
        return;
      }

      const layer = document.createElement("div");
      layer.className = "parallax-layer";

      const computed = getComputedStyle(element);
      layer.style.position = "absolute";
      layer.style.inset = "0";
      layer.style.backgroundImage = backgroundImage;
      layer.style.backgroundSize = computed.backgroundSize;
      layer.style.backgroundPosition = computed.backgroundPosition;
      layer.style.backgroundRepeat = computed.backgroundRepeat;
      layer.style.backgroundOrigin = computed.backgroundOrigin;
      layer.style.backgroundColor = computed.backgroundColor;

      element.style.backgroundImage = "none";
      element.classList.add("parallax-background");
      element.appendChild(layer);

      media = layer;
      frame = element;
    } else {
      element.classList.add("parallax-media");
      frame = element.parentElement || element;
    }

    media.dataset.parallaxId = id;
    media.style.transformOrigin = "0 0";

    targets.push({
      id,
      element: media,
      frame,
      config
    });
  }

  function collectTargets() {
    document
      .querySelectorAll("#hero .hero-slide")
      .forEach((element, index) => {
        addTarget(`hero-${index + 1}`, element, "background");
      });

    const teaserIds = {
      newsTeaser: "teaser-news",
      schoolTeaser: "teaser-school",
      datesTeaser: "teaser-dates",
      contactTeaser: "teaser-contact",
      supportTeaser: "teaser-support"
    };

    document
      .querySelectorAll(".news-teaser-image")
      .forEach((element, index) => {
        const teaser = element.closest(".news-teaser");
        const id =
          teaser && teaserIds[teaser.id]
            ? teaserIds[teaser.id]
            : `teaser-${index + 1}`;

        addTarget(id, element, "background");
      });

    // Zukunftssicher: beliebige weitere Bilder können einfach
    // mit data-parallax-id="mein-bild" ergänzt werden.
    document
      .querySelectorAll("[data-parallax-id]")
      .forEach((element) => {
        if (element.classList.contains("parallax-layer")) {
          return;
        }

        const id = element.dataset.parallaxId;
        if (!id) {
          return;
        }

        addTarget(
          id,
          element,
          element.tagName === "IMG" ? "image" : "background"
        );
      });
  }

  function getAnimationProgress(target, timestamp) {
    const durationIn = Math.max(1, target.config.zoomInDuration);
    const durationOut = Math.max(1, target.config.zoomOutDuration);
    const cycleDuration = durationIn + durationOut;

    const elapsed =
      ((timestamp - target.animationStart) -
        target.config.cycleDelay) %
      cycleDuration;

    const cycleProgress =
      elapsed < 0
        ? (elapsed + cycleDuration) / cycleDuration
        : elapsed / cycleDuration;

    if (cycleProgress <= durationIn / cycleDuration) {
      return clamp(
        (cycleProgress * cycleDuration) / durationIn,
        0,
        1
      );
    }

    return clamp(
      1 -
        ((cycleProgress * cycleDuration - durationIn) /
          durationOut),
      0,
      1
    );
  }

  function updateTarget(target, timestamp) {
    const rect = target.frame.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const rawProgress = getAnimationProgress(target, timestamp);
    const progress = ease(rawProgress);
    const scale = lerp(
      target.config.startScale,
      target.config.endScale,
      progress
    );

    const targetX = rect.width * (target.config.targetX / 100);
    const targetY = rect.height * (target.config.targetY / 100);

    const screenX = rect.left + targetX;
    const screenY = rect.top + targetY;

    // Genau wie im Testprojekt: Beim Hineinzoomen wandert der
    // konfigurierte Zielpunkt zur Bildschirmmitte.
    const desiredX = lerp(
      screenX,
      window.innerWidth / 2,
      progress
    );
    const desiredY = lerp(
      screenY,
      window.innerHeight / 2,
      progress
    );

    const translateX =
      desiredX - rect.left - targetX * scale;
    const translateY =
      desiredY - rect.top - targetY * scale;

    target.element.style.transform =
      `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
  }

  let animationFrame = 0;
  let animationStart = performance.now();

  function update(timestamp) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        target.element.style.transform = "none";
      });

      animationFrame = 0;
      return;
    }

    targets.forEach((target) => {
      if (!target.animationStart) {
        target.animationStart = animationStart;
      }
      updateTarget(target, timestamp);
    });

    animationFrame = window.requestAnimationFrame(update);
  }

  function requestUpdate() {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(update);
    }
  }

  function init() {
    animationStart = performance.now();

    collectTargets();

    targets.forEach((target) => {
      target.animationStart = animationStart;
    });

    requestUpdate();

    window.addEventListener("resize", requestUpdate);
  }

  init();

  window.refreshLandingPageParallax = requestUpdate;
})();
