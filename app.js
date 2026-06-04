/* =====================================================
   THE GRACIOUS HOME — HOSPITALITY PLANNER
   ===================================================== */

const TOTAL_STEPS = 6;
let currentStep = 1;

// ── DATA COLLECTION ──────────────────────────────────

const data = {
  guestCategory: [],
  guestName: '',
  guestNeeds: '',
  groupSize: [],
  motivation: [],
  whyStatement: '',
  prayerIntent: '',
  eventDate: '',
  mealSlot: [],
  duration: '',
  prepTime: '',
  location: [],
  spaceNotes: '',
  atmosphere: [],
  foodType: [],
  menuIdeas: '',
  activities: [],
  specialNeeds: '',
  prepChecklist: [],
  heartChecklist: [],
  helpNeeded: '',
  extraNotes: ''
};

// ── CHIP SELECTS ─────────────────────────────────────

function initChipSelects() {
  document.querySelectorAll('.chip-select').forEach(group => {
    const isMulti = group.classList.contains('multi');
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (isMulti) {
          chip.classList.toggle('selected');
        } else {
          group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
        }
        collectData();
      });
    });
  });
}

// ── TEXT INPUT COLLECTION ────────────────────────────

function initTextInputs() {
  document.querySelectorAll('.text-input, .text-area').forEach(el => {
    el.addEventListener('input', collectData);
  });
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', collectData);
  });
}

function collectData() {
  // Step 1
  data.guestCategory  = getChipValues('guestCategory');
  data.guestName      = getVal('guestName');
  data.guestNeeds     = getVal('guestNeeds');
  data.groupSize      = getChipValues('groupSize');

  // Step 2
  data.motivation     = getChipValues('motivation');
  data.whyStatement   = getVal('whyStatement');
  data.prayerIntent   = getVal('prayerIntent');

  // Step 3
  data.eventDate      = getVal('eventDate');
  data.mealSlot       = getChipValues('mealSlot');
  data.duration       = getVal('duration');
  data.prepTime       = getVal('prepTime');

  // Step 4
  data.location       = getChipValues('location');
  data.spaceNotes     = getVal('spaceNotes');
  data.atmosphere     = getChipValues('atmosphere');

  // Step 5
  data.foodType       = getChipValues('foodType');
  data.menuIdeas      = getVal('menuIdeas');
  data.activities     = getChipValues('activities');
  data.specialNeeds   = getVal('specialNeeds');

  // Step 6
  data.prepChecklist  = getCheckboxValues('prepChecklist');
  data.heartChecklist = getCheckboxValues('heartChecklist');
  data.helpNeeded     = getVal('helpNeeded');
  data.extraNotes     = getVal('extraNotes');
}

function getChipValues(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  return [...el.querySelectorAll('.chip.selected')].map(c => c.textContent.trim());
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getCheckboxValues(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  return [...el.querySelectorAll('input[type="checkbox"]:checked')]
    .map(c => c.closest('label').textContent.trim());
}

// ── STEP NAVIGATION ──────────────────────────────────

function changeStep(direction) {
  collectData();

  const from = currentStep;
  const to   = currentStep + direction;

  if (to < 1 || to > TOTAL_STEPS + 1) return;

  document.getElementById(`step-${from}`).classList.remove('active');
  document.getElementById(`step-${to}`).classList.add('active');
  currentStep = to;

  updateProgressUI();
  updateNavButtons();

  if (currentStep === TOTAL_STEPS + 1) {
    renderPlan();
  }

  window.scrollTo({ top: document.getElementById('tool').offsetTop - 80, behavior: 'smooth' });
}

function updateProgressUI() {
  const steps = document.querySelectorAll('.progress-steps .step');
  steps.forEach((step, i) => {
    const num = i + 1;
    step.classList.remove('active', 'done');
    if (num === currentStep)       step.classList.add('active');
    else if (num < currentStep)    step.classList.add('done');
  });

  const pct = Math.min(((currentStep - 1) / TOTAL_STEPS) * 100, 100);
  document.getElementById('progressFill').style.width = pct + '%';
}

function updateNavButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nav     = document.getElementById('plannerNav');

  // Hide nav on summary page
  if (currentStep === TOTAL_STEPS + 1) {
    nav.style.display = 'none';
    return;
  } else {
    nav.style.display = 'flex';
  }

  prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';

  if (currentStep === TOTAL_STEPS) {
    nextBtn.textContent = 'Create My Plan ✓';
  } else {
    nextBtn.textContent = 'Next →';
  }
}

// ── PLAN RENDERER ────────────────────────────────────

function renderPlan() {
  collectData();

  const container = document.getElementById('planOutput');
  const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

  function tags(arr) {
    if (!arr || arr.length === 0) return '<em style="color:#aaa">Not specified</em>';
    return arr.map(v => `<span class="tag">${v}</span>`).join(' ');
  }

  function text(str, fallback) {
    return str || `<em style="color:#aaa">${fallback || 'Not specified'}</em>`;
  }

  function list(arr) {
    if (!arr || arr.length === 0) return '<em style="color:#aaa">None selected</em>';
    return '<ul style="margin:0.4rem 0 0 1rem; font-size:0.9rem;">' +
      arr.map(v => `<li style="margin-bottom:0.2rem">${v}</li>`).join('') +
      '</ul>';
  }

  container.innerHTML = `
    <div class="plan-title">
      <h3>Hospitality Plan</h3>
      <p>Created on ${today}</p>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128101; Who</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(data.guestCategory)} &nbsp; ${tags(data.groupSize)}</div>
        <p><strong>Guest(s):</strong> ${text(data.guestName)}</p>
        ${data.guestNeeds ? `<p><strong>Their situation:</strong> ${data.guestNeeds}</p>` : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#10084; Why</div>
      <div class="plan-section-content">
        <div style="margin-bottom:0.5rem">${tags(data.motivation)}</div>
        ${data.whyStatement ? `<p><strong>My why:</strong> <em>"${data.whyStatement}"</em></p>` : ''}
        ${data.prayerIntent ? `<p><strong>Prayer intention:</strong> ${data.prayerIntent}</p>` : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#128336; When</div>
      <div class="plan-section-content">
        ${tags(data.mealSlot)}
        ${data.eventDate ? `<p><strong>Date/Time:</strong> ${data.eventDate}</p>` : ''}
        ${data.duration  ? `<p><strong>Duration:</strong> ${data.duration}</p>` : ''}
        ${data.prepTime  ? `<p><strong>Prep window:</strong> ${data.prepTime}</p>` : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#127968; Where</div>
      <div class="plan-section-content">
        ${tags(data.location)}
        ${data.atmosphere.length ? `<p><strong>Atmosphere:</strong> ${tags(data.atmosphere)}</p>` : ''}
        ${data.spaceNotes ? `<p><strong>Space notes:</strong> ${data.spaceNotes}</p>` : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9749; What</div>
      <div class="plan-section-content">
        <p><strong>Food:</strong> ${tags(data.foodType)}</p>
        ${data.menuIdeas  ? `<p><strong>Menu ideas:</strong> ${data.menuIdeas}</p>` : ''}
        ${data.activities.length ? `<p><strong>Activities:</strong> ${tags(data.activities)}</p>` : ''}
        ${data.specialNeeds ? `<p><strong>Special needs:</strong> ${data.specialNeeds}</p>` : ''}
      </div>
    </div>

    <div class="plan-section">
      <div class="plan-section-title">&#9998; How — Preparation</div>
      <div class="plan-section-content">
        ${data.prepChecklist.length  ? `<p><strong>Practical tasks:</strong>${list(data.prepChecklist)}</p>` : ''}
        ${data.heartChecklist.length ? `<p style="margin-top:0.75rem"><strong>Heart preparation:</strong>${list(data.heartChecklist)}</p>` : ''}
        ${data.helpNeeded  ? `<p style="margin-top:0.75rem"><strong>Helpers:</strong> ${data.helpNeeded}</p>` : ''}
        ${data.extraNotes  ? `<p style="margin-top:0.75rem"><strong>Additional notes:</strong> ${data.extraNotes}</p>` : ''}
      </div>
    </div>

    <div class="plan-section" style="background:var(--cream-mid); border-radius:8px; padding:1.25rem; border-bottom:none; margin-top:0.5rem;">
      <div class="plan-section-title" style="margin-bottom:0.5rem">&#128214; A Word for the Road</div>
      <div class="plan-section-content">
        <p style="font-style:italic; color:var(--brown);">"When you give a feast, invite the poor, the crippled, the lame, the blind, and you will be blessed, because they cannot repay you."</p>
        <p style="font-size:0.8rem; letter-spacing:0.06em; color:var(--gold); margin-top:0.3rem;">— Luke 14:13–14</p>
      </div>
    </div>
  `;
}

// ── START OVER ───────────────────────────────────────

function startOver() {
  currentStep = 1;

  // Clear all inputs
  document.querySelectorAll('.text-input, .text-area').forEach(el => el.value = '');
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(c => c.checked = false);

  // Show step 1
  document.querySelectorAll('.planner-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');

  updateProgressUI();
  updateNavButtons();
  document.getElementById('plannerNav').style.display = 'flex';

  window.scrollTo({ top: document.getElementById('tool').offsetTop - 80, behavior: 'smooth' });
}

// ── MOBILE NAV TOGGLE ────────────────────────────────

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    if (!open) {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '64px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'var(--brown)';
      nav.style.padding = '1rem 1.5rem';
      nav.style.zIndex = '200';
      nav.style.gap = '1rem';
    }
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) nav.style.display = 'none';
    });
  });
}

// ── INIT ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initChipSelects();
  initTextInputs();
  updateNavButtons();
  updateProgressUI();
  initMobileNav();

  document.getElementById('startOverBtn').addEventListener('click', startOver);
});
