/* ================================================================
   LANDIFY — main.js
   All interactivity + working search filter
   ================================================================ */

/* ----------------------------------------------------------------
   CONFIG — swap BASE_URL for your real API endpoint
   ---------------------------------------------------------------- */
const API = {
  BASE_URL: '/api/v1',
  LISTINGS: '/listings',
  SEARCH:   '/listings/search',
};

/* ----------------------------------------------------------------
   NAVBAR — scroll effect + hamburger
   ---------------------------------------------------------------- */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose= document.getElementById('mobileClose');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();


/* ----------------------------------------------------------------
   SEARCH V2 — inject new search UI + wire up working filters
   ---------------------------------------------------------------- */
(function initSearchV2() {

  /* Map: tab key → { sectionId, gridId, subtypes[], priceField } */
  const CONFIG = {
    residential: {
      sectionId: 'section-residential',
      gridId:    'grid-residential',
      subtypes:  [
        { label: 'Apartment / Flat',       value: 'apartment'      },
        { label: 'Independent House',       value: 'independent'    },
        { label: 'Villa',                   value: 'villa'          },
        { label: 'Builder Floor',           value: 'builder-floor'  },
        { label: 'Studio Apartment',        value: 'studio'         },
        { label: 'Duplex House',            value: 'duplex'         },
        { label: 'Penthouse',               value: 'penthouse'      },
        { label: 'Row House / Townhouse',   value: 'row-house'      },
      ],
    },
    commercial: {
      sectionId: 'section-commercial',
      gridId:    'grid-commercial',
      subtypes:  [
        { label: 'Office Space',            value: 'office-space'      },
        { label: 'Shop',                    value: 'shop'              },
        { label: 'Showroom',                value: 'showroom'          },
        { label: 'Commercial Land / Plot',  value: 'commercial-land'   },
        { label: 'Warehouse / Godown',      value: 'warehouse'         },
        { label: 'Industrial / Factory',    value: 'industrial'        },
        { label: 'Entire Building',         value: 'entire-building'   },
      ],
    },
    agri: {
      sectionId: 'section-agri',
      gridId:    'grid-agri',
      subtypes:  [
        { label: 'Farmland',                value: 'farmland'   },
        { label: 'Plantation / Orchard',    value: 'plantation' },
        { label: 'Farmhouse + Land',        value: 'farmhouse'  },
        { label: 'Agricultural Plot',       value: 'agri-plot'  },
        { label: 'Mixed-Use Agri',          value: 'mixed-agri' },
      ],
    },
    land: {
      sectionId: 'section-undeveloped',
      gridId:    'grid-undeveloped',
      subtypes:  [
        { label: 'Vacant Plot',             value: 'vacant-plot'  },
        { label: 'Raw Land',                value: 'raw-land'     },
        { label: 'Waterfront',              value: 'waterfront'   },
        { label: 'Corner Piece',            value: 'corner-piece' },
      ],
    },
  };

  /* Price range boundaries in Indian Rupees */
  const PRICE_RANGES = {
    '':          [0, Infinity],
    '0-25l':     [0, 2_500_000],
    '25l-1cr':   [2_500_000, 10_000_000],
    '1cr-5cr':   [10_000_000, 50_000_000],
    '5cr+':      [50_000_000, Infinity],
  };

  /* ── 1. Replace old search HTML with V2 ── */
  const wrap = document.querySelector('.hero__search-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="search-box-v2" id="search-box-v2">

      <!-- Category Tabs -->
      <div class="sv2-tabs" role="tablist">
        <button class="sv2-tab active" data-tab="residential" role="tab">🏠 Residential</button>
        <button class="sv2-tab"        data-tab="commercial"  role="tab">🏢 Commercial</button>
        <button class="sv2-tab"        data-tab="agri"        role="tab">🌾 Agricultural</button>
        <button class="sv2-tab"        data-tab="land"        role="tab">📍 Land</button>
      </div>

      <!-- Subtype Checkboxes -->
      <div class="sv2-subtypes">
        <div class="sv2-subtypes__inner" id="sv2-checkboxes"></div>
        <button class="sv2-clear" id="sv2-clear" type="button">Clear</button>
      </div>

      <!-- Search Row -->
      <div class="sv2-bottom">
        <div class="sv2-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <input id="sv2-location" type="text" placeholder="Enter city, state or area…" autocomplete="off">
        </div>
        <div class="sv2-filters">
          <select class="sv2-filter-pill" id="sv2-budget">
            <option value="">Budget ▾</option>
            <option value="0-25l">Under ₹25L</option>
            <option value="25l-1cr">₹25L – ₹1Cr</option>
            <option value="1cr-5cr">₹1Cr – ₹5Cr</option>
            <option value="5cr+">Above ₹5Cr</option>
          </select>
        </div>
        <button class="sv2-search-btn" id="sv2-search-btn" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Search
        </button>
      </div>

    </div>

    <!-- Results banner (injected below search box) -->
    <div id="sv2-results-banner" style="display:none;margin-top:.8rem;padding:.7rem 1.2rem;background:rgba(0,196,122,.15);border:1px solid rgba(0,196,122,.35);border-radius:10px;color:#7FFFC4;font-size:.84rem;font-weight:600;"></div>
  `;

  /* ── 2. State ── */
  let activeTab = 'residential';

  /* ── 3. Render checkboxes for active tab ── */
  function renderCheckboxes(tab) {
    const container = document.getElementById('sv2-checkboxes');
    if (!container) return;
    container.innerHTML = (CONFIG[tab]?.subtypes || []).map(st => {
      const id = 'sv2-cb-' + st.value;
      return `
        <label class="sv2-checkbox-label" for="${id}">
          <input type="checkbox" id="${id}" value="${st.value}" checked>
          ${st.label}
        </label>`;
    }).join('');
  }

  /* ── 4. Tab switching ── */
  document.querySelectorAll('.sv2-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sv2-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderCheckboxes(activeTab);
      // Reset results banner if visible
      const banner = document.getElementById('sv2-results-banner');
      if (banner) banner.style.display = 'none';
      // Show all cards again when switching tabs
      showAllCards();
    });
  });

  /* ── 5. Clear checkboxes ── */
  document.getElementById('sv2-clear')?.addEventListener('click', () => {
    document.querySelectorAll('#sv2-checkboxes input[type="checkbox"]')
      .forEach(cb => cb.checked = false);
  });

  /* ── 6. Parse price from card text e.g. "₦22,000,000" → 22000000 ── */
  function parsePrice(card) {
    const priceEl = card.querySelector('.prop-card__price');
    if (!priceEl) return 0;
    const raw = priceEl.textContent.replace(/[₦,\s]/g, '').replace(/[^0-9]/g, '');
    return parseInt(raw, 10) || 0;
  }

  /* ── 7. Show all cards (reset) ── */
  function showAllCards() {
    document.querySelectorAll('.prop-card').forEach(card => {
      card.style.display = '';
    });
    document.querySelectorAll('.listings-empty.sv2-no-results').forEach(el => el.remove());
  }

  /* ── 8. MAIN SEARCH FUNCTION ── */
  function runSearch() {
    const cfg         = CONFIG[activeTab];
    if (!cfg) return;

    /* Gather filters */
    const checkedSubs = [...document.querySelectorAll('#sv2-checkboxes input:checked')]
                          .map(cb => cb.value);
    const locationRaw = (document.getElementById('sv2-location')?.value || '').trim().toLowerCase();
    const budgetKey   = document.getElementById('sv2-budget')?.value || '';
    const [priceMin, priceMax] = PRICE_RANGES[budgetKey] || [0, Infinity];

    /* All four sections & grids */
    const allSections = ['residential', 'commercial', 'agri', 'land'];

    let totalVisible = 0;

    allSections.forEach(tabKey => {
      const sectionCfg = CONFIG[tabKey];
      const section    = document.getElementById(sectionCfg.sectionId);
      const grid       = document.getElementById(sectionCfg.gridId);
      if (!section || !grid) return;

      /* Hide sections that don't match the active tab */
      if (tabKey !== activeTab) {
        section.style.display = 'none';
        // Also hide adjacent dividers
        const prevSibling = section.previousElementSibling;
        const nextSibling = section.nextElementSibling;
        if (prevSibling?.classList.contains('section-divider')) prevSibling.style.display = 'none';
        if (nextSibling?.classList.contains('section-divider')) nextSibling.style.display = 'none';
        return;
      }

      /* Show this section */
      section.style.display = '';
      const prevSibling = section.previousElementSibling;
      const nextSibling = section.nextElementSibling;
      if (prevSibling?.classList.contains('section-divider')) prevSibling.style.display = '';
      if (nextSibling?.classList.contains('section-divider')) nextSibling.style.display = '';

      /* Filter cards */
      const cards = [...grid.querySelectorAll('.prop-card')];
      let sectionVisible = 0;

      cards.forEach(card => {
        const cardSubtype  = card.dataset.subtype || '';
        const cardLocation = card.querySelector('.prop-card__location')?.textContent.toLowerCase() || '';
        const cardPrice    = parsePrice(card);

        /* Subtype match — if none checked, treat as "all" */
        const subtypeMatch = checkedSubs.length === 0 || checkedSubs.includes(cardSubtype);

        /* Location match */
        const locationMatch = !locationRaw || cardLocation.includes(locationRaw);

        /* Price match */
        const priceMatch = cardPrice >= priceMin && cardPrice <= priceMax;

        const visible = subtypeMatch && locationMatch && priceMatch;
        card.style.display = visible ? '' : 'none';
        if (visible) { sectionVisible++; totalVisible++; }
      });

      /* Remove old no-results message */
      grid.querySelectorAll('.sv2-no-results').forEach(el => el.remove());

      /* Show no-results message inside this grid if needed */
      if (sectionVisible === 0) {
        const msg = document.createElement('div');
        msg.className = 'listings-empty sv2-no-results';
        msg.innerHTML = `
          <div style="font-size:2rem;margin-bottom:.5rem">🔍</div>
          No properties match your filters in this category.
          <br><span style="font-size:.82rem;margin-top:.3rem;display:inline-block;opacity:.7">
            Try adjusting your budget, location, or property type.
          </span>`;
        grid.appendChild(msg);
      }
    });

    /* ── Results banner ── */
    const banner = document.getElementById('sv2-results-banner');
    if (banner) {
      const tabLabel = document.querySelector(`.sv2-tab[data-tab="${activeTab}"]`)?.textContent.trim() || activeTab;
      const budgetLabel = budgetKey
        ? document.querySelector(`#sv2-budget option[value="${budgetKey}"]`)?.textContent || ''
        : '';
      const locationLabel = locationRaw ? ` in "${locationRaw}"` : '';
      const budgetPart    = budgetLabel ? ` · ${budgetLabel}` : '';
      const subtypePart   = checkedSubs.length > 0 && checkedSubs.length < (CONFIG[activeTab]?.subtypes.length || 99)
        ? ` · ${checkedSubs.length} type${checkedSubs.length > 1 ? 's' : ''} selected`
        : '';

      banner.textContent = `${totalVisible} result${totalVisible !== 1 ? 's' : ''} — ${tabLabel}${locationLabel}${budgetPart}${subtypePart}`;
      banner.style.display = 'block';
    }

    /* ── Scroll to listings section ── */
    const targetSection = document.getElementById(cfg.sectionId);
    if (targetSection) {
      const offset = 90; // navbar height
      const top    = targetSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  /* ── 9. Wire search button ── */
  document.getElementById('sv2-search-btn')?.addEventListener('click', runSearch);

  /* ── 10. Also trigger on Enter key in location input ── */
  document.getElementById('sv2-location')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });

  /* ── 11. Init checkboxes on load ── */
  renderCheckboxes(activeTab);

})();


/* ----------------------------------------------------------------
   SUBTYPE FILTER PILLS (listing sections on the page)
   ---------------------------------------------------------------- */
(function initSubtypeFilters() {
  document.querySelectorAll('.subtype-filters').forEach(filterRow => {
    const section = filterRow.closest('.prop-section');
    const grid    = section?.querySelector('.listings-grid');
    if (!grid) return;

    filterRow.querySelectorAll('.subtype-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterRow.querySelectorAll('.subtype-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const selected = pill.dataset.subtype;

        grid.querySelectorAll('.prop-card').forEach(card => {
          const matches = selected === 'all' || card.dataset.subtype === selected;
          card.style.display = matches ? '' : 'none';
        });

        checkEmpty(grid);
      });
    });
  });
})();


/* ----------------------------------------------------------------
   SCROLL REVEAL
   ---------------------------------------------------------------- */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ----------------------------------------------------------------
   STAT COUNTER ANIMATION
   ---------------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-card__num[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const em     = el.dataset.em || '';
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.innerHTML = current.toLocaleString() + suffix + (em ? `<em>${em}</em>` : '');
        if (current >= target) clearInterval(timer);
      }, 25);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();


/* ----------------------------------------------------------------
   HELPERS
   ---------------------------------------------------------------- */
function checkEmpty(grid) {
  const visible = [...grid.querySelectorAll('.prop-card')]
    .filter(c => c.style.display !== 'none').length;
  let emptyEl = grid.querySelector('.listings-empty:not(.sv2-no-results)');

  if (visible === 0) {
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.className = 'listings-empty';
      emptyEl.textContent = 'No properties found for this filter.';
      grid.appendChild(emptyEl);
    }
  } else {
    emptyEl?.remove();
  }
}


/* ================================================================
   BACKEND INTEGRATION HOOKS
   Ready to wire to your real API — uncomment when backend is live
   ================================================================ */

async function fetchListings(params = {}) {
  const query = new URLSearchParams(params);
  const res   = await fetch(`${API.BASE_URL}${API.LISTINGS}?${query}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function renderCards(grid, listings) {
  grid.querySelectorAll('.prop-card').forEach(c => c.remove());
  if (!listings || listings.length === 0) { checkEmpty(grid); return; }
  listings.forEach(listing => grid.appendChild(buildCard(listing)));
}

function buildCard(listing) {
  const card = document.createElement('article');
  card.className = 'prop-card reveal';
  card.dataset.id      = listing.id;
  card.dataset.type    = listing.category;
  card.dataset.subtype = listing.subtype;

  card.innerHTML = `
    <div class="prop-card__img">
      <img src="${esc(listing.image)}" alt="${esc(listing.title)}" loading="lazy">
      <span class="prop-badge prop-badge--${esc(listing.category)}">${categoryLabel(listing.category)}</span>
      <span class="prop-subtype-badge">${esc(listing.subtypeLabel)}</span>
      ${listing.verified ? '<span class="badge-verified">✓ Verified</span>' : ''}
    </div>
    <div class="prop-card__body">
      <div class="prop-card__price">${esc(listing.price)}<span>${esc(listing.priceLabel || '')}</span></div>
      <div class="prop-card__title">${esc(listing.title)}</div>
      <div class="prop-card__location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${esc(listing.location)}
      </div>
      <div class="prop-card__meta">
        ${(listing.chips || []).map(c => `<span class="meta-chip">${esc(c)}</span>`).join('')}
      </div>
    </div>`;

  card.addEventListener('click', () => {
    // window.location.href = `/property/${listing.id}`;
    console.log('[Landify] Card clicked:', listing.id);
  });

  return card;
}

function categoryLabel(cat) {
  return { residential: 'Residential', commercial: 'Commercial', agri: 'Agricultural', undeveloped: 'Land' }[cat] || cat;
}

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}