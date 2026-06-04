/* =====================================================
   THE GRACIOUS HOME — APP
   Depends on i18n.js being loaded first.
   ===================================================== */

const PAGE = document.body?.dataset?.page || 'home';

// ── NAV ──────────────────────────────────────────────

const NAV_LINKS = [
  { key: 'home',         href: 'index.html',        page: 'home' },
  { key: 'competencies', href: 'competencies.html',  page: 'competencies' },
  { key: 'manifesto',    href: 'manifesto.html',     page: 'manifesto' },
  { key: 'thinkers',     href: 'thinkers.html',      page: 'thinkers' },
  { key: 'planner',      href: 'planner.html',       page: 'planner' },
];

function renderNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.innerHTML = NAV_LINKS.map(link => `
    <a href="${link.href}"
       class="${link.page === PAGE ? 'active' : ''}"
       data-i18n="nav.${link.key}">
      ${i18n.t('nav.' + link.key)}
    </a>`).join('');
  initMobileNav();
}

// ── LANDING PAGE ──────────────────────────────────────

function renderLanding() {
  const raw = i18n.t('landing.title');
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) titleEl.innerHTML = raw.replace('\n', '<br>');

  const ctaEl = document.getElementById('landingCta');
  if (ctaEl) ctaEl.href = i18n.t('landing.ctaPrimaryHref');

  const cards = i18n.t('landing.cards');
  const grid  = document.getElementById('landingCards');
  if (!grid || !Array.isArray(cards)) return;

  grid.innerHTML = cards.map(card => `
    <a href="${card.link}" class="landing-card">
      <div class="lc-icon">${card.icon}</div>
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <span class="lc-link">${card.linkText}</span>
    </a>`).join('');
}

// ── COMPETENCY CARDS ──────────────────────────────────

function renderCompetencies() {
  const grid  = document.getElementById('competencyGrid');
  const items = i18n.t('competencies.items');
  if (!grid || !Array.isArray(items)) return;

  grid.innerHTML = items.map(item => `
    <div class="competency-card">
      <div class="card-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul class="practices">
        ${item.practices.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>`).join('');
}

// ── MANIFESTO ─────────────────────────────────────────

function renderManifesto() {
  const preamble = i18n.t('manifesto.preamble');
  const pillars  = i18n.t('manifesto.pillars');

  const preambleEl = document.getElementById('manifestoPreamble');
  if (preambleEl && preamble) {
    preambleEl.innerHTML = `<h3>${preamble.title}</h3><p>${preamble.body}</p>`;
  }

  const pillarsEl = document.getElementById('manifestoPillars');
  if (!pillarsEl || !Array.isArray(pillars)) return;

  pillarsEl.innerHTML = pillars.map(p => `
    <div class="pillar">
      <div class="pillar-number">${p.number}</div>
      <div class="pillar-body">
        <h3>${p.title}</h3>
        ${p.scriptures.map(s => `
          <div class="scripture-block">
            <p class="verse">${s.verse}</p>
            <p class="ref">${s.ref}</p>
          </div>`).join('')}
        <p>${p.body}</p>
        ${p.charge ? `<p class="manifesto-charge">${p.charge}</p>` : ''}
      </div>
    </div>`).join('');
}

// ── EDITH SCHAEFFER ───────────────────────────────────

function renderSchaeffer() {
  const s = i18n.t('schaeffer');
  if (!s || typeof s !== 'object') return;

  const bioEl = document.getElementById('schaefferBio');
  if (bioEl) {
    bioEl.innerHTML = `
      <div class="schaeffer-bio-inner">
        <h3>${s.bioTitle}</h3>
        <p>${s.bio}</p>
      </div>`;
  }

  const themesEl = document.getElementById('schaefferThemes');
  if (themesEl && Array.isArray(s.themes)) {
    themesEl.innerHTML = s.themes.map(t => `
      <div class="schaeffer-theme-card">
        <div class="st-icon">${t.icon}</div>
        <div class="st-body">
          <h3>${t.title}</h3>
          <p>${t.body}</p>
          <blockquote class="st-quote">
            <p>${t.quote}</p>
            <cite>— ${t.quoteSource}</cite>
          </blockquote>
        </div>
      </div>`).join('');
  }

  const labriEl = document.getElementById('labriBox');
  if (labriEl) {
    const principles = Array.isArray(s.labriPrinciples)
      ? s.labriPrinciples.map(p => `<li>${p}</li>`).join('') : '';
    labriEl.innerHTML = `
      <div class="labri-inner">
        <div class="labri-text">
          <h3>${s.labriTitle}</h3>
          <p>${s.labriBody}</p>
          <ul class="labri-principles">${principles}</ul>
        </div>
        <div class="labri-quote-box">
          <p class="labri-pull-quote">${s.labriQuote}</p>
          <p class="labri-attribution">${s.labriQuoteAuthor}</p>
        </div>
      </div>`;
  }

  const pqEl = document.getElementById('pullQuotes');
  if (pqEl && Array.isArray(s.pullQuotes)) {
    pqEl.innerHTML = `
      <h3 class="pull-quotes-title">${s.pullQuotesTitle}</h3>
      <div class="pull-quotes-grid">
        ${s.pullQuotes.map(q => `
          <div class="pull-quote-card">
            <p class="pq-text">&ldquo;${q.quote}&rdquo;</p>
            <p class="pq-source">— ${q.source}</p>
          </div>`).join('')}
      </div>`;
  }

  const booksEl = document.getElementById('schaefferBooks');
  if (booksEl && Array.isArray(s.books)) {
    booksEl.innerHTML = `
      <h3 class="books-title">${s.booksTitle}</h3>
      <div class="books-grid">
        ${s.books.map(b => `
          <div class="book-card">
            <div class="book-year">${b.year}</div>
            <div class="book-info">
              <h4>${b.title}</h4>
              <p>${b.desc}</p>
            </div>
          </div>`).join('')}
      </div>`;
  }
}

// ── REFORMED/PURITAN THINKERS ─────────────────────────
// Populated once research data is added to locale files

function renderThinkers() {
  const tData = i18n.t('thinkers');
  const container = document.getElementById('thinkersContainer');
  if (!container || !tData || typeof tData !== 'object' || !Array.isArray(tData.voices)) return;

  container.innerHTML = `
    <div class="section-header">
      <p class="section-label" style="color:var(--gold)">${tData.sectionLabel || ''}</p>
      <h2>${tData.title || ''}</h2>
      <p class="section-intro">${tData.intro || ''}</p>
    </div>
    ${tData.voices.map(v => `
      <div class="thinker-block">
        <div class="thinker-header">
          <div class="thinker-meta">
            <h3>${v.name}</h3>
            <span class="thinker-dates">${v.dates}</span>
            <span class="thinker-tradition">${v.tradition}</span>
          </div>
        </div>
        <p class="thinker-bio">${v.bio}</p>
        ${Array.isArray(v.themes) ? v.themes.map(th => `
          <div class="thinker-theme">
            <h4>${th.title}</h4>
            <p>${th.body}</p>
            ${th.quote ? `
              <blockquote class="thinker-quote">
                <p>${th.quote}</p>
                <cite>— ${th.source}</cite>
              </blockquote>` : ''}
          </div>`).join('') : ''}
      </div>`).join('')}`;
}

// ── PLANNER LOGIC ─────────────────────────────────────

const TOTAL_STEPS = 6;
let currentStep = 1;

const selections = {
  guestCategory: [], groupSize: [], motivation: [], mealSlot: [],
  location: [], atmosphere: [], foodType: [], activities: [],
  prepChecklist: [], heartChecklist: []
};

function renderProgress() {
  const labels  = i18n.t('planner.progressLabels');
  const stepsEl = document.getElementById('progressSteps');
  if (!stepsEl || !Array.isArray(labels)) return;

  stepsEl.innerHTML = labels.map((label, i) => {
    const num = i + 1;
    const cls = num === currentStep ? 'active' : num < currentStep ? 'done' : '';
    const display = num === labels.length ? '✓' : num;
    return `<div class="step ${cls}" data-step="${num}">
      <div class="step-circle">${display}</div>
      <span>${label}</span>
    </div>`;
  }).join('');

  const pct = Math.min(((currentStep - 1) / TOTAL_STEPS) * 100, 100);
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = pct + '%';
}

function renderChips() {
  document.querySelectorAll('.chip-select[data-field]').forEach(container => {
    const field   = container.dataset.field;
    const step    = container.dataset.step;
    const isMulti = container.dataset.multi === 'true';
    const options = i18n.t(`planner.steps.${step}.${field}.options`);
    if (!Array.isArray(options)) return;

    const current = selections[field] || [];
    container.innerHTML = options.map(opt => `
      <button type="button"
              class="chip${current.includes(opt.value) ? ' selected' : ''}"
              data-value="${opt.value}"
              data-multi="${isMulti}">
        ${opt.label}
      </button>`).join('');

    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val   = chip.dataset.value;
        const multi = chip.dataset.multi === 'true';
        if (multi) {
          chip.classList.toggle('selected');
          toggleSelection(field, val);
        } else {
          container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selections[field] = [val];
        }
      });
    });
  });
}

function toggleSelection(field, val) {
  const arr = selections[field];
  const idx = arr.indexOf(val);
  if (idx === -1) arr.push(val); else arr.splice(idx, 1);
}

function renderChecklists() {
  ['prepChecklist', 'heartChecklist'].forEach(field => {
    const el   = document.getElementById(field);
    const step = el?.dataset.step;
    if (!el || !step) return;
    const options = i18n.t(`planner.steps.${step}.${field}.options`);
    if (!Array.isArray(options)) return;

    const current = selections[field] || [];
    el.innerHTML = options.map(opt => `
      <label class="check-item">
        <input type="checkbox" value="${opt.value}" ${current.includes(opt.value) ? 'checked' : ''} />
        ${opt.label}
      </label>`).join('');

    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const arr = selections[field];
        if (cb.checked) { if (!arr.includes(cb.value)) arr.push(cb.value); }
        else { const i = arr.indexOf(cb.value); if (i > -1) arr.splice(i, 1); }
      });
    });
  });
}

function updateNavLabels() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nav     = document.getElementById('plannerNav');
  if (!nextBtn) return;

  const isSummary = currentStep === TOTAL_STEPS + 1;
  if (isSummary) { if (nav) nav.style.display = 'none'; return; }
  if (nav) nav.style.display = 'flex';

  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
  nextBtn.textContent = currentStep === TOTAL_STEPS
    ? i18n.t('planner.plan.title') + ' ✓'
    : i18n.t(`planner.steps.${stepKey(currentStep + 1)}.title`).split('?')[0].split(' ').slice(0,3).join(' ') + ' →';
}

function stepKey(n) {
  return ['who','why','when','where','what','how'][n - 1] || '';
}

function changeStep(direction) {
  const to = currentStep + direction;
  if (to < 1 || to > TOTAL_STEPS + 1) return;
  document.getElementById(`step-${currentStep}`)?.classList.remove('active');
  document.getElementById(`step-${to}`)?.classList.add('active');
  currentStep = to;
  renderProgress();
  updateNavLabels();
  if (currentStep === TOTAL_STEPS + 1) renderPlan();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PLAN RENDERER ─────────────────────────────────────

function resolveLabels(field, step) {
  const options = i18n.t(`planner.steps.${step}.${field}.options`);
  return (selections[field] || []).map(v => i18n.labelFor(options, v)).filter(Boolean);
}

function tags(arr) {
  const none = i18n.t('planner.plan.labels.noneSelected');
  if (!arr?.length) return `<em style="color:#aaa">${none}</em>`;
  return arr.map(v => `<span class="tag">${v}</span>`).join(' ');
}

function planRow(label, content) {
  return `<p><strong>${label}</strong> ${content}</p>`;
}

function val(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function listItems(arr) {
  if (!arr?.length) return `<em style="color:#aaa">${i18n.t('planner.plan.labels.noneSelected')}</em>`;
  return '<ul style="margin:0.4rem 0 0 1rem;font-size:0.9rem;">'
    + arr.map(v => `<li style="margin-bottom:0.2rem">${v}</li>`).join('')
    + '</ul>';
}

function renderPlan() {
  const L  = i18n.t('planner.plan.labels');
  const S  = i18n.t('planner.plan.sections');
  const P  = i18n.t('planner.plan');
  const today = new Date().toLocaleDateString(i18n.locale, { year:'numeric', month:'long', day:'numeric' });

  const out = document.getElementById('planOutput');
  if (!out) return;

  out.innerHTML = `
    <div class="plan-title">
      <h3>${P.planTitle}</h3>
      <p>${P.createdOn} ${today}</p>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128101; ${S.who}</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(resolveLabels('guestCategory','who'))} &nbsp;${tags(resolveLabels('groupSize','who'))}</div>
        ${planRow(L.guests, val('guestName') || `<em style="color:#aaa">${L.notSpecified}</em>`)}
        ${val('guestNeeds') ? planRow(L.situation, val('guestNeeds')) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#10084; ${S.why}</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(resolveLabels('motivation','why'))}</div>
        ${val('whyStatement') ? planRow(L.myWhy, `<em>&ldquo;${val('whyStatement')}&rdquo;</em>`) : ''}
        ${val('prayerIntent') ? planRow(L.prayer, val('prayerIntent')) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128336; ${S.when}</div>
      <div class="plan-section-content">
        ${tags(resolveLabels('mealSlot','when'))}
        ${val('eventDate') ? planRow(L.dateTime,   val('eventDate'))  : ''}
        ${val('duration')  ? planRow(L.duration,   val('duration'))   : ''}
        ${val('prepTime')  ? planRow(L.prepWindow,  val('prepTime'))   : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#127968; ${S.where}</div>
      <div class="plan-section-content">
        ${tags(resolveLabels('location','where'))}
        ${resolveLabels('atmosphere','where').length ? planRow(L.atmosphere, tags(resolveLabels('atmosphere','where'))) : ''}
        ${val('spaceNotes') ? planRow(L.spaceNotes, val('spaceNotes')) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9749; ${S.what}</div>
      <div class="plan-section-content">
        ${planRow(L.food, tags(resolveLabels('foodType','what')))}
        ${val('menuIdeas')    ? planRow(L.menuIdeas,    val('menuIdeas'))    : ''}
        ${resolveLabels('activities','what').length ? planRow(L.activities, tags(resolveLabels('activities','what'))) : ''}
        ${val('specialNeeds') ? planRow(L.specialNeeds, val('specialNeeds')) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9998; ${S.how}</div>
      <div class="plan-section-content">
        ${resolveLabels('prepChecklist','how').length  ? planRow(L.practicalTasks, listItems(resolveLabels('prepChecklist','how'))) : ''}
        ${resolveLabels('heartChecklist','how').length ? `<div style="margin-top:0.75rem">${planRow(L.heartPrep, listItems(resolveLabels('heartChecklist','how')))}</div>` : ''}
        ${val('helpNeeded') ? `<div style="margin-top:0.75rem">${planRow(L.helpers, val('helpNeeded'))}</div>` : ''}
        ${val('extraNotes') ? `<div style="margin-top:0.75rem">${planRow(L.notes,   val('extraNotes'))}</div>` : ''}
      </div>
    </div>

    <div class="plan-section" style="background:var(--cream-mid);border-radius:8px;padding:1.25rem;border-bottom:none;margin-top:0.5rem">
      <div class="plan-section-title">&#128214;</div>
      <div class="plan-section-content">
        <p style="font-style:italic;color:var(--brown)">${P.closingVerse}</p>
        <p style="font-size:0.8rem;letter-spacing:0.06em;color:var(--gold);margin-top:0.3rem">${P.closingRef}</p>
      </div>
    </div>`;
}

function startOver() {
  currentStep = 1;
  Object.keys(selections).forEach(k => { selections[k] = []; });
  document.querySelectorAll('.text-input, .text-area').forEach(el => el.value = '');
  document.querySelectorAll('.planner-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1')?.classList.add('active');
  renderChips();
  renderChecklists();
  renderProgress();
  updateNavLabels();
  const nav = document.getElementById('plannerNav');
  if (nav) nav.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── MOBILE NAV ────────────────────────────────────────

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.onclick = () => nav.classList.toggle('mobile-open');
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('mobile-open'));
  });
}

// ── RENDER ALL (called on locale change + boot) ───────

window.renderAll = function () {
  renderNav();

  if (PAGE === 'home') {
    renderLanding();
    // hero title on landing
    const raw = i18n.t('landing.title');
    const el  = document.getElementById('heroTitle');
    if (el) el.innerHTML = raw.replace('\n', '<br>');
  }

  if (PAGE === 'competencies') renderCompetencies();
  if (PAGE === 'manifesto')    renderManifesto();

  if (PAGE === 'thinkers') {
    renderSchaeffer();
    renderThinkers();
  }

  if (PAGE === 'planner') {
    renderProgress();
    renderChips();
    renderChecklists();
    updateNavLabels();
  }
};

// ── BOOT ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  window.renderAll();
  i18n.apply();
  i18n.buildSwitcher();

  if (PAGE === 'planner') {
    document.getElementById('prevBtn')?.addEventListener('click',     () => changeStep(-1));
    document.getElementById('nextBtn')?.addEventListener('click',     () => changeStep(1));
    document.getElementById('startOverBtn')?.addEventListener('click', startOver);
    document.getElementById('printBtn')?.addEventListener('click',    () => window.print());
  }
});
