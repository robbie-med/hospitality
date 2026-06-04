/* =====================================================
   i18n ENGINE — The Gracious Home
   ===================================================== */

const i18n = (() => {
  const SUPPORTED = ['en', 'es', 'fr', 'ko'];
  const NAMES     = { en: 'English', es: 'Español', fr: 'Français', ko: '한국어' };

  let locale = 'en';
  let data   = {};

  // ── LOOKUP ─────────────────────────────────────────

  function t(key) {
    return key.split('.').reduce((o, k) => o?.[k], data) ?? key;
  }

  // Look up display label from a chip-options array by value key
  function labelFor(optionsArray, value) {
    return optionsArray?.find(o => o.value === value)?.label ?? value;
  }

  // ── APPLY data-i18n attributes ──────────────────────

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = t(el.dataset.i18n);
      if (val !== el.dataset.i18n) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = t(el.dataset.i18nHtml);
      if (val !== el.dataset.i18nHtml) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = t(el.dataset.i18nPlaceholder);
      if (val !== el.dataset.i18nPlaceholder) el.placeholder = val;
    });
    document.title = t('nav.brand') + ' — ' + t('hero.eyebrow');
    document.documentElement.lang = locale;
    document.documentElement.dir  = t('dir') || 'ltr';
  }

  // ── LOAD ────────────────────────────────────────────

  async function load(loc) {
    const res = await fetch(`locales/${loc}.json`);
    if (!res.ok) throw new Error(`Failed to load locale: ${loc}`);
    data   = await res.json();
    locale = loc;
    localStorage.setItem('gracious-locale', loc);
  }

  // ── LANGUAGE SWITCHER ───────────────────────────────

  function buildSwitcher() {
    const container = document.getElementById('langSwitcher');
    if (!container) return;
    container.innerHTML = SUPPORTED.map(loc => `
      <button class="lang-btn${loc === locale ? ' active' : ''}"
              data-locale="${loc}"
              aria-label="Switch to ${NAMES[loc]}">
        ${NAMES[loc]}
      </button>`).join('');

    container.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTo(btn.dataset.locale));
    });
  }

  function updateSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.locale === locale);
    });
  }

  // ── PUBLIC SWITCH ───────────────────────────────────

  async function switchTo(loc) {
    if (!SUPPORTED.includes(loc) || loc === locale) return;
    await load(loc);
    // Let the app re-render dynamic sections, then apply static strings
    if (typeof window.renderAll === 'function') window.renderAll();
    apply();
    updateSwitcher();
  }

  // ── INIT ────────────────────────────────────────────

  async function init() {
    const saved    = localStorage.getItem('gracious-locale');
    const browser  = (navigator.language || '').slice(0, 2);
    const detected = SUPPORTED.includes(saved)   ? saved
                   : SUPPORTED.includes(browser)  ? browser
                   : 'en';
    await load(detected);
  }

  // ── EXPOSE ──────────────────────────────────────────

  return { init, switchTo, apply, buildSwitcher, t, labelFor, get locale() { return locale; }, get data() { return data; } };
})();
