// ======================================================
// DONDRS — CENTRALE CUSTOM CODE LOADER
// ======================================================

// Hiermee weet main.js automatisch op welk Netlify-domein hij staat
const mainScript = document.currentScript;
const baseUrl = new URL('.', mainScript.src);

// Maakt van lokale paden volledige Netlify-URL's
function getUrl(path) {
  if (path.startsWith('http')) {
    return path;
  }

  return new URL(path, baseUrl).href;
}

// CSS-bestand laden
function loadStyle(path) {
  return new Promise((resolve, reject) => {
    const url = getUrl(path);

    // Voorkom dubbel laden
    if (document.querySelector(`link[href="${url}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => resolve();
    link.onerror = () => {
      reject(new Error(`CSS kon niet worden geladen: ${url}`));
    };

    document.head.appendChild(link);
  });
}

// JavaScript-bestand laden
function loadScript(path) {
  return new Promise((resolve, reject) => {
    const url = getUrl(path);

    // Voorkom dubbel laden
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');

    script.src = url;
    script.async = false;

    script.onload = () => resolve();
    script.onerror = () => {
      reject(new Error(`Script kon niet worden geladen: ${url}`));
    };

    document.body.appendChild(script);
  });
}

// Alles in de juiste volgorde laden
async function initDondrs() {
  try {
    // ==================================================
    // 1. CSS
    // ==================================================

    await Promise.all([
      loadStyle('styles/animations.css'),
      loadStyle('styles/buttons.css'),

      // Swiper standaard styling
      loadStyle(
        'https://cdn.jsdelivr.net/npm/swiper@14.0.6/swiper-bundle.min.css'
      )
    ]);

    // ==================================================
    // 2. GSAP CORE
    // ==================================================

    await loadScript(
      'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js'
    );

    // ==================================================
    // 3. GSAP PLUGINS
    // ==================================================

    await Promise.all([
      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js'
      ),

      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js'
      ),

      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js'
      ),

      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CustomEase.min.js'
      ),

      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollToPlugin.min.js'
      ),

      loadScript(
        'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Observer.min.js'
      )
    ]);

    // GSAP-plugins activeren
    gsap.registerPlugin(
      ScrollTrigger,
      Flip,
      SplitText,
      CustomEase,
      ScrollToPlugin,
      Observer
    );

    // ==================================================
    // 4. SWIPER
    // ==================================================

    await loadScript(
      'https://cdn.jsdelivr.net/npm/swiper@14.0.6/swiper-bundle.min.js'
    );

    // ==================================================
    // 5. BARBA
    // ==================================================

    await loadScript(
      'https://cdn.jsdelivr.net/npm/@barba/core@2.10.3/dist/barba.umd.js'
    );

    // ==================================================
    // 6. JOUW EIGEN SCRIPTS
    // ==================================================

    await loadScript('scripts/navbar.js');
    await loadScript('scripts/animations.js');
    await loadScript('scripts/swiper.js');

    // Deze als laatste, omdat hier Barba wordt gestart
    await loadScript('scripts/pagetransitions.js');

    console.log('[DONDRS] Alle custom code is geladen');
  } catch (error) {
    console.error('[DONDRS] Er ging iets mis:', error);
  }
}

initDondrs();