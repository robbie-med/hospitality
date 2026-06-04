/* =====================================================
   THE GRACIOUS HOME — APP
   Depends on i18n.js being loaded first.
   ===================================================== */

const TOTAL_STEPS = 6;
let currentStep = 1;

// Stores selected chip values as data-value keys (locale-independent)
const selections = {
  guestCategory: [],
  groupSize: [],
  motivation: [],
  mealSlot: [],
  location: [],
  atmosphere: [],
  foodType: [],
  activities: [],
  prepChecklist: [],
  heartChecklist: []
};

// ── RENDER SCHAEFFER SECTION ─────────────────────────

function renderSchaeffer() {
  const s = i18n.t('schaeffer');
  if (!s || typeof s !== 'object') return;

  // Bio
  const bioEl = document.getElementById('schaefferBio');
  if (bioEl) {
    bioEl.innerHTML = `
      <div class="schaeffer-bio-inner">
        <h3>${s.bioTitle}</h3>
        <p>${s.bio}</p>
      </div>`;
  }

  // Themes
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

  // L'Abri box
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

  // Pull quotes
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

  // Books
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

// ── RENDER COMPETENCY CARDS ───────────────────────────

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
    </div>
  `).join('');
}

// ── RENDER MANIFESTO ──────────────────────────────────

function renderManifesto() {
  const preamble = i18n.t('manifesto.preamble');
  const pillars  = i18n.t('manifesto.pillars');

  const preambleEl = document.getElementById('manifestoPreamble');
  if (preambleEl && preamble) {
    preambleEl.innerHTML = `
      <h3>${preamble.title}</h3>
      <p>${preamble.body}</p>
    `;
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
    </div>
  `).join('');
}

// ── RENDER PROGRESS BAR ───────────────────────────────

function renderProgress() {
  const labels  = i18n.t('planner.progressLabels');
  const stepsEl = document.getElementById('progressSteps');
  if (!stepsEl || !Array.isArray(labels)) return;

  stepsEl.innerHTML = labels.map((label, i) => {
    const num = i + 1;
    const cls = num === currentStep ? 'active' : num < currentStep ? 'done' : '';
    const display = num === labels.length ? '✓' : num;
    return `
      <div class="step ${cls}" data-step="${num}">
        <div class="step-circle">${display}</div>
        <span>${label}</span>
      </div>`;
  }).join('');

  const pct = Math.min(((currentStep - 1) / TOTAL_STEPS) * 100, 100);
  document.getElementById('progressFill').style.width = pct + '%';
}

// ── RENDER CHIP SELECTS ───────────────────────────────

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
        const val  = chip.dataset.value;
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

// ── RENDER CHECKLISTS ─────────────────────────────────

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
        <input type="checkbox"
               value="${opt.value}"
               ${current.includes(opt.value) ? 'checked' : ''} />
        ${opt.label}
      </label>`).join('');

    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.value;
        const arr = selections[field];
        if (cb.checked) { if (!arr.includes(val)) arr.push(val); }
        else            { const i = arr.indexOf(val); if (i > -1) arr.splice(i, 1); }
      });
    });
  });
}

// ── HERO TITLE (preserves line break) ─────────────────

function renderHeroTitle() {
  const raw = i18n.t('hero.title');
  const el  = document.getElementById('heroTitle');
  if (el) el.innerHTML = raw.replace('\n', '<br>');
}

// ── NAV BUTTON LABELS ─────────────────────────────────

function updateNavLabels() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const isLast  = currentStep === TOTAL_STEPS;
  const isSummary = currentStep === TOTAL_STEPS + 1;

  if (prevBtn) prevBtn.textContent = '← ' + i18n.t('planner.steps.' + stepKey(currentStep - 1) + '.stepLabel').split(' ')[0] || '';

  if (nextBtn) {
    nextBtn.textContent = isLast
      ? i18n.t('planner.plan.title') + ' ✓'
      : i18n.t('planner.steps.' + stepKey(currentStep + 1) + '.title').split(' ')[0] + ' →';
  }

  if (isSummary && prevBtn && nextBtn) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    document.getElementById('plannerNav').style.display = 'none';
  } else {
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
    document.getElementById('plannerNav').style.display = 'flex';
  }
}

function stepKey(n) {
  return ['who', 'why', 'when', 'where', 'what', 'how'][n - 1] || '';
}

// ── STEP NAVIGATION ───────────────────────────────────

function changeStep(direction) {
  const from = currentStep;
  const to   = currentStep + direction;
  if (to < 1 || to > TOTAL_STEPS + 1) return;

  document.getElementById(`step-${from}`)?.classList.remove('active');
  document.getElementById(`step-${to}`)?.classList.add('active');
  currentStep = to;

  renderProgress();
  updateNavLabels();

  if (currentStep === TOTAL_STEPS + 1) renderPlan();

  window.scrollTo({ top: document.getElementById('tool').offsetTop - 80, behavior: 'smooth' });
}

// ── PLAN OUTPUT ───────────────────────────────────────

function resolveLabels(field, step) {
  const options = i18n.t(`planner.steps.${step}.${field}.options`);
  return (selections[field] || [])
    .map(v => i18n.labelFor(options, v))
    .filter(Boolean);
}

function tags(arr) {
  if (!arr?.length) return `<em style="color:#aaa">${i18n.t('planner.plan.labels.noneSelected')}</em>`;
  return arr.map(v => `<span class="tag">${v}</span>`).join(' ');
}

function textVal(id, fallback) {
  const el = document.getElementById(id);
  const v  = el?.value?.trim() || '';
  return v || `<em style="color:#aaa">${fallback || i18n.t('planner.plan.labels.notSpecified')}</em>`;
}

function listItems(arr) {
  if (!arr?.length) return `<em style="color:#aaa">${i18n.t('planner.plan.labels.noneSelected')}</em>`;
  return '<ul style="margin:0.4rem 0 0 1rem; font-size:0.9rem;">'
    + arr.map(v => `<li style="margin-bottom:0.2rem">${v}</li>`).join('')
    + '</ul>';
}

function planRow(label, content) {
  return `<p><strong>${label}</strong> ${content}</p>`;
}

function renderPlan() {
  const L  = i18n.t('planner.plan.labels');
  const S  = i18n.t('planner.plan.sections');
  const P  = i18n.t('planner.plan');
  const today = new Date().toLocaleDateString(i18n.locale, { year:'numeric', month:'long', day:'numeric' });

  const guestCats  = resolveLabels('guestCategory', 'who');
  const groupSizes = resolveLabels('groupSize',     'who');
  const motivations= resolveLabels('motivation',    'why');
  const mealSlots  = resolveLabels('mealSlot',      'when');
  const locations  = resolveLabels('location',      'where');
  const atmospheres= resolveLabels('atmosphere',    'where');
  const foodTypes  = resolveLabels('foodType',      'what');
  const acts       = resolveLabels('activities',    'what');
  const prepDone   = resolveLabels('prepChecklist', 'how');
  const heartDone  = resolveLabels('heartChecklist','how');

  document.getElementById('planOutput').innerHTML = `
    <div class="plan-title">
      <h3>${P.planTitle}</h3>
      <p>${P.createdOn} ${today}</p>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128101; ${S.who}</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(guestCats)} &nbsp;${tags(groupSizes)}</div>
        ${planRow(L.guests, textVal('guestName'))}
        ${document.getElementById('guestNeeds')?.value?.trim()
          ? planRow(L.situation, document.getElementById('guestNeeds').value.trim())
          : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#10084; ${S.why}</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(motivations)}</div>
        ${document.getElementById('whyStatement')?.value?.trim()
          ? planRow(L.myWhy, `<em>&ldquo;${document.getElementById('whyStatement').value.trim()}&rdquo;</em>`)
          : ''}
        ${document.getElementById('prayerIntent')?.value?.trim()
          ? planRow(L.prayer, document.getElementById('prayerIntent').value.trim())
          : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128336; ${S.when}</div>
      <div class="plan-section-content">
        ${tags(mealSlots)}
        ${document.getElementById('eventDate')?.value?.trim()  ? planRow(L.dateTime,    document.getElementById('eventDate').value.trim())  : ''}
        ${document.getElementById('duration')?.value?.trim()   ? planRow(L.duration,    document.getElementById('duration').value.trim())   : ''}
        ${document.getElementById('prepTime')?.value?.trim()   ? planRow(L.prepWindow,  document.getElementById('prepTime').value.trim())   : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#127968; ${S.where}</div>
      <div class="plan-section-content">
        ${tags(locations)}
        ${atmospheres.length ? planRow(L.atmosphere, tags(atmospheres)) : ''}
        ${document.getElementById('spaceNotes')?.value?.trim() ? planRow(L.spaceNotes, document.getElementById('spaceNotes').value.trim()) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9749; ${S.what}</div>
      <div class="plan-section-content">
        ${planRow(L.food, tags(foodTypes))}
        ${document.getElementById('menuIdeas')?.value?.trim()    ? planRow(L.menuIdeas,   document.getElementById('menuIdeas').value.trim())    : ''}
        ${acts.length ? planRow(L.activities, tags(acts)) : ''}
        ${document.getElementById('specialNeeds')?.value?.trim() ? planRow(L.specialNeeds, document.getElementById('specialNeeds').value.trim()) : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9998; ${S.how}</div>
      <div class="plan-section-content">
        ${prepDone.length  ? planRow(L.practicalTasks, listItems(prepDone))  : ''}
        ${heartDone.length ? `<div style="margin-top:0.75rem">${planRow(L.heartPrep, listItems(heartDone))}</div>` : ''}
        ${document.getElementById('helpNeeded')?.value?.trim()  ? `<div style="margin-top:0.75rem">${planRow(L.helpers, document.getElementById('helpNeeded').value.trim())}</div>`  : ''}
        ${document.getElementById('extraNotes')?.value?.trim()  ? `<div style="margin-top:0.75rem">${planRow(L.notes,   document.getElementById('extraNotes').value.trim())}</div>`  : ''}
      </div>
    </div>

    <div class="plan-section" style="background:var(--cream-mid);border-radius:8px;padding:1.25rem;border-bottom:none;margin-top:0.5rem">
      <div class="plan-section-title">&#128214;</div>
      <div class="plan-section-content">
        <p style="font-style:italic;color:var(--brown)">${P.closingVerse}</p>
        <p style="font-size:0.8rem;letter-spacing:0.06em;color:var(--gold);margin-top:0.3rem">${P.closingRef}</p>
      </div>
    </div>
  `;
}

// ── START OVER ────────────────────────────────────────

function startOver() {
  currentStep = 1;
  Object.keys(selections).forEach(k => { selections[k] = []; });

  document.querySelectorAll('.text-input, .text-area').forEach(el => el.value = '');
  document.querySelectorAll('.planner-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');

  renderChips();
  renderChecklists();
  renderProgress();
  updateNavLabels();
  document.getElementById('plannerNav').style.display = 'flex';

  window.scrollTo({ top: document.getElementById('tool').offsetTop - 80, behavior: 'smooth' });
}

// ── RENDER ALL (called on locale change) ──────────────

window.renderAll = function () {
  renderHeroTitle();
  renderCompetencies();
  renderManifesto();
  renderSchaeffer();
  renderProgress();
  renderChips();
  renderChecklists();
  updateNavLabels();
};

// ── MOBILE NAV ────────────────────────────────────────

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('mobile-open'));
  });
}

// ── BOOT ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();

  window.renderAll();
  i18n.apply();
  i18n.buildSwitcher();

  // Nav buttons
  document.getElementById('prevBtn')?.addEventListener('click',     () => changeStep(-1));
  document.getElementById('nextBtn')?.addEventListener('click',     () => changeStep(1));
  document.getElementById('startOverBtn')?.addEventListener('click', startOver);
  document.getElementById('printBtn')?.addEventListener('click',    () => window.print());

  initMobileNav();
});
