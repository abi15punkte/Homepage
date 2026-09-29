(() => {
  "use strict";

  /*
   * ================================================================
   * Landingpage-Parallax: zentrale Konfiguration
   * ================================================================
   *
   * startScale / endScale
   *   1.0 = normale "cover"-Darstellung.
   *   1.5 = Bild 50 % stärker vergrößert.
   *
   * targetX / targetY
   *   Zielpunkt im Originalbild in Prozent.
   *   0/0 = oben links, 50/50 = Mitte, 100/100 = unten rechts.
   *
   * zoomInDuration / zoomOutDuration
   *   Dauer für Hinein- bzw. Herauszoomen in Millisekunden.
   *
   * cycleDelay
   *   Optionaler zeitlicher Versatz der einzelnen Bilder.
   *
   * Die Layout-Container selbst werden niemals transformiert.
   * Die Animation erfolgt ausschließlich über background-size und
   * background-position. Dadurch bleiben Teaser-Aufteilung, Scroll-
   * position und sonstige Layout-Transformationen vollständig getrennt.
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

  window.LANDING_PAGE_PARALLAX_CONFIG = PARALLAX_CONFIG;

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

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

  function extractBackgroundUrl(backgroundImage) {
    const trimmed = backgroundImage.trim();

    if (trimmed === "none") {
      return null;
    }

    const match = trimmed.match(/^url\((['"]?)(.*?)\1\)$/);
    return match ? match[2] : null;
  }

  function loadImageSize(url) {
    return new Promise((resolve) => {
      const image = new Image();

      image.addEventListener("load", () => {
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight
          });
          return;
        }

        resolve(null);
      });

      image.addEventListener("error", () => resolve(null));
      image.src = url;
    });
  }

  async function addTarget(id, element) {
    if (
      !element ||
      targets.some((target) => target.element === element)
    ) {
      return;
    }

    const config = resolvedConfig(id);
    if (!config.enabled) {
      return;
    }

    const backgroundImage = getComputedStyle(element).backgroundImage;
    const url = extractBackgroundUrl(backgroundImage);

    if (!url) {
      return;
    }

    const imageSize = await loadImageSize(url);

    if (!imageSize) {
      return;
    }

    /*
     * background-size / background-position werden direkt auf dem
     * bestehenden Element animiert. Keine zusätzliche Ebene, kein
     * transform, kein neuer Layout-Container.
     */
    element.style.backgroundImage = backgroundImage;
    element.style.backgroundRepeat = "no-repeat";

    targets.push({
      id,
      element,
      config,
      imageWidth: imageSize.width,
      imageHeight: imageSize.height,
      animationStart: performance.now()
    });
  }

  function collectTargets() {
    document
      .querySelectorAll("#hero .hero-slide")
      .forEach((element, index) => {
        void addTarget(`hero-${index + 1}`, element);
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

        void addTarget(id, element);
      });

    /*
     * Zukunftssicher: beliebige weitere Elemente mit
     * data-parallax-id können ebenfalls registriert werden.
     */
    document
      .querySelectorAll("[data-parallax-id]")
      .forEach((element) => {
        const id = element.dataset.parallaxId;

        if (!id || targets.some((target) => target.element === element)) {
          return;
        }

        void addTarget(id, element);
      });
  }

  function getAnimationProgress(target, timestamp) {
    const durationIn = Math.max(1, target.config.zoomInDuration);
    const durationOut = Math.max(1, target.config.zoomOutDuration);
    const cycleDuration = durationIn + durationOut;

    const elapsed =
      (timestamp - target.animationStart - target.config.cycleDelay) %
      cycleDuration;

    const cyclePosition =
      elapsed < 0
        ? elapsed + cycleDuration
        : elapsed;

    if (cyclePosition <= durationIn) {
      return clamp(cyclePosition / durationIn, 0, 1);
    }

    return clamp(
      1 - ((cyclePosition - durationIn) / durationOut),
      0,
      1
    );
  }

  function updateTarget(target, timestamp) {
    const rect = target.element.getBoundingClientRect();

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

    /*
     * Erst die normale "cover"-Skalierung berechnen.
     * Danach wird ausschließlich diese bereits vollflächige
     * Darstellung vergrößert. Dadurch bleibt das Bild auch während
     * des Herauszoomens immer vollständig deckend.
     */
    const coverScale = Math.max(
      rect.width / target.imageWidth,
      rect.height / target.imageHeight
    );

    const renderedWidth =
      target.imageWidth * coverScale * scale;
    const renderedHeight =
      target.imageHeight * coverScale * scale;

    const targetImageX =
      target.imageWidth * (target.config.targetX / 100);
    const targetImageY =
      target.imageHeight * (target.config.targetY / 100);

    const renderedTargetX =
      targetImageX * coverScale * scale;
    const renderedTargetY =
      targetImageY * coverScale * scale;

    /*
     * Positioniere den konfigurierten Zielpunkt in der Mitte des
     * Bildcontainers. Anschließend begrenzen wir die Position so,
     * dass auf keiner Achse ein ungefüllter Bereich entstehen kann.
     */
    const desiredLeft =
      rect.width / 2 - renderedTargetX;
    const desiredTop =
      rect.height / 2 - renderedTargetY;

    const minLeft = rect.width - renderedWidth;
    const maxLeft = 0;

    const minTop = rect.height - renderedHeight;
    const maxTop = 0;

    const left = clamp(desiredLeft, minLeft, maxLeft);
    const top = clamp(desiredTop, minTop, maxTop);

    elementSetBackground(
      target.element,
      renderedWidth,
      renderedHeight,
      left,
      top
    );
  }

  function elementSetBackground(
    element,
    width,
    height,
    left,
    top
  ) {
    element.style.backgroundSize =
      `${width}px ${height}px`;
    element.style.backgroundPosition =
      `${left}px ${top}px`;
  }

  let animationFrame = 0;

  function update(timestamp) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        const rect = target.element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          return;
        }

        const coverScale = Math.max(
          rect.width / target.imageWidth,
          rect.height / target.imageHeight
        );

        target.element.style.backgroundSize =
          `${target.imageWidth * coverScale}px ${target.imageHeight * coverScale}px`;
        target.element.style.backgroundPosition = "50% 50%";
      });

      animationFrame = 0;
      return;
    }

    targets.forEach((target) => updateTarget(target, timestamp));
    animationFrame = window.requestAnimationFrame(update);
  }

  function requestUpdate() {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(update);
    }
  }

  function init() {
    collectTargets();
    requestUpdate();

    window.addEventListener("resize", requestUpdate);
  }

  init();

  window.refreshLandingPageParallax = requestUpdate;
})();
