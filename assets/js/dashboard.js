/* ================================================================
   LANDIFY — dashboard.js
   Seller Dashboard logic only. Load AFTER main.js.
   ================================================================ */

(function initDashboard() {
  'use strict';

  /* ── Demo listings — swap with real API fetch() ── */
  const LISTINGS = [
    {
      id: 'p001', type: 'res', subtype: 'Apartment',
      name: '3-BHK Apartment – Bandra West',
      location: 'Bandra West, Mumbai',
      price: '₦1,20,00,000', status: 'approved',
      date: '12 Jan 2025',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=70'
    },
    {
      id: 'p002', type: 'com', subtype: 'Shop',
      name: 'Corner Shop – Connaught Place',
      location: 'Connaught Place, Delhi',
      price: '₦85,00,000', status: 'pending',
      date: '28 Jan 2025',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&q=70'
    },
    {
      id: 'p003', type: 'agri', subtype: 'Plantation',
      name: '12-Acre Cassava Plantation',
      location: 'Nashik, Maharashtra',
      price: '₦45,00,000', status: 'pending',
      date: '02 Feb 2025',
      img: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=120&q=70'
    },
    {
      id: 'p004', type: 'land', subtype: 'Vacant Plot',
      name: 'Prime Plot – C of O Title',
      location: 'Whitefield, Bangalore',
      price: '₦32,00,000', status: 'approved',
      date: '10 Feb 2025',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=70'
    },
    {
      id: 'p005', type: 'res', subtype: 'Villa',
      name: 'Modern Villa with Pool',
      location: 'Jubilee Hills, Hyderabad',
      price: '₦3,50,00,000', status: 'rejected',
      date: '14 Feb 2025',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&q=70'
    },
    {
      id: 'p006', type: 'com', subtype: 'Office',
      name: 'Open-Plan Office Floor – BKC',
      location: 'BKC, Mumbai',
      price: '₦2,20,00,000', status: 'draft',
      date: '17 Feb 2025',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&q=70'
    },
  ];

  /* ── Form field definitions per type ── */
  const FORM_CONFIG = {
    res: {
      label: 'Residential Property', icon: '🏠',
      fields: [
        { id:'title',    label:'Property Title',      ph:'e.g. 3-BHK Apartment in Lekki',  full:true },
        { id:'subtype',  label:'Sub-type',            type:'select', opts:['Apartment / Flat','Independent House','Villa','Builder Floor','Studio Apartment','Duplex House','Penthouse','Row House'] },
        { id:'price',    label:'Asking Price (₦)',    ph:'e.g. 12,000,000' },
        { id:'area',     label:'Area (sq ft)',        ph:'e.g. 1200' },
        { id:'beds',     label:'Bedrooms',            type:'select', opts:['1 Bed','2 Bed','3 Bed','4 Bed','5+ Bed'] },
        { id:'baths',    label:'Bathrooms',           type:'select', opts:['1','2','3','4','5+'] },
        { id:'location', label:'Full Address',        ph:'Street, Area, City, State', full:true },
        { id:'desc',     label:'Description',         type:'textarea', ph:'Highlights, amenities, nearby landmarks…', full:true },
        { id:'photos',   label:'Property Photos',     type:'file', full:true },
      ]
    },
    com: {
      label: 'Commercial Property', icon: '🏢',
      fields: [
        { id:'title',    label:'Property Title',    ph:'e.g. Corner Shop at Oshodi', full:true },
        { id:'subtype',  label:'Commercial Type',   type:'select', opts:['Office Space','Shop','Showroom','Commercial Land','Warehouse / Godown','Industrial / Factory','Entire Building'] },
        { id:'price',    label:'Asking Price (₦)', ph:'e.g. 8,500,000' },
        { id:'area',     label:'Area (sq ft)',      ph:'e.g. 800' },
        { id:'floor',    label:'Floor / Level',    ph:'e.g. Ground Floor, 3rd Floor' },
        { id:'parking',  label:'Parking Spots',    ph:'e.g. 10' },
        { id:'location', label:'Full Address',      ph:'Street, Area, City, State', full:true },
        { id:'desc',     label:'Description',       type:'textarea', ph:'Power supply, access, fit-out status…', full:true },
        { id:'photos',   label:'Property Photos',   type:'file', full:true },
      ]
    },
    agri: {
      label: 'Agricultural Land', icon: '🌾',
      fields: [
        { id:'title',    label:'Land Title',         ph:'e.g. 20-Acre Mango Orchard', full:true },
        { id:'subtype',  label:'Agricultural Type',  type:'select', opts:['Farmland (Basic)','Plantation / Orchard','Farmhouse + Land','Agricultural Plot','Mixed-Use Agri'] },
        { id:'price',    label:'Asking Price (₦)',  ph:'e.g. 4,500,000' },
        { id:'acres',    label:'Total Area (Acres)', ph:'e.g. 20' },
        { id:'soil',     label:'Soil Type',          ph:'e.g. Loamy, Sandy, Clay' },
        { id:'water',    label:'Water Source',       type:'select', opts:['Borehole','River','Stream','Rainwater','None'] },
        { id:'location', label:'Location / Village', ph:'Village, LGA, State', full:true },
        { id:'desc',     label:'Description',        type:'textarea', ph:'Current crops, infrastructure, access road…', full:true },
        { id:'photos',   label:'Land Photos',        type:'file', full:true },
      ]
    },
    land: {
      label: 'Undeveloped Land', icon: '📍',
      fields: [
        { id:'title',    label:'Plot Title',         ph:'e.g. Prime Vacant Plot – C of O', full:true },
        { id:'subtype',  label:'Land Type',          type:'select', opts:['Vacant Plot','Raw Land','Waterfront','Corner Piece'] },
        { id:'price',    label:'Asking Price (₦)',  ph:'e.g. 3,200,000' },
        { id:'sqm',      label:'Area (sq metres)',   ph:'e.g. 650' },
        { id:'doc',      label:'Title Document',     type:'select', opts:['C of O','R of O','Survey Plan','Gazette','Deed of Assignment','Other'] },
        { id:'road',     label:'Road Access',        type:'select', opts:['Tarmac','Gravel','Dirt Track','None'] },
        { id:'location', label:'Full Address',        ph:'Street, Area, City, State', full:true },
        { id:'desc',     label:'Description',        type:'textarea', ph:'Terrain, surroundings, development potential…', full:true },
        { id:'photos',   label:'Plot Photos',        type:'file', full:true },
      ]
    },
  };

  /* ================================================================
     SIDEBAR MOBILE TOGGLE
     ================================================================ */
  const sidebar   = document.getElementById('dashSidebar');
  const sbToggle  = document.getElementById('sbToggle');
  const sbOverlay = document.getElementById('sbOverlay');

  sbToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sbOverlay.classList.toggle('open');
  });
  sbOverlay?.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    sbOverlay.classList.remove('open');
  }

  /* ================================================================
     TABLE RENDER
     ================================================================ */
  let activeFilter = 'all';
  let searchTerm   = '';

  function renderTable() {
    const tbody = document.getElementById('listingsBody');
    const empty = document.getElementById('tableEmpty');
    if (!tbody) return;

    const rows = LISTINGS.filter(p => {
      const matchFilter = activeFilter === 'all' || p.type === activeFilter || p.status === activeFilter;
      const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm) || p.location.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    tbody.innerHTML = '';

    if (rows.length === 0) {
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';

    rows.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="prop-cell">
            <img class="prop-thumb" src="${p.img}" alt="${p.name}" loading="lazy">
            <div>
              <div class="prop-cell-name">${p.name}</div>
              <div class="prop-cell-loc">${p.location}</div>
            </div>
          </div>
        </td>
        <td><span class="t-pill t-pill--${p.type}">${p.subtype}</span></td>
        <td class="prop-cell-price">${p.price}</td>
        <td><span class="s-pill s-pill--${p.status}">${cap(p.status)}</span></td>
        <td style="font-size:.8rem;color:var(--text-muted)">${p.date}</td>
        <td>
          <div class="row-acts">
            <button class="ra-btn" data-edit="${p.id}">Edit</button>
            <button class="ra-btn ra-btn--del" data-del="${p.id}">Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });

    /* Bind row buttons */
    tbody.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = LISTINGS.find(x => x.id === btn.dataset.edit);
        if (p) openModal(p.type, p);
      });
    });
    tbody.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this listing?')) return;
        const i = LISTINGS.findIndex(x => x.id === btn.dataset.del);
        if (i > -1) { LISTINGS.splice(i, 1); renderTable(); refreshStats(); }
      });
    });
  }

  /* Filter pills */
  document.querySelectorAll('.lpill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.lpill').forEach(p => p.classList.remove('on'));
      pill.classList.add('on');
      activeFilter = pill.dataset.f;
      renderTable();
    });
  });

  /* Search input */
  document.getElementById('listingSearch')?.addEventListener('input', e => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderTable();
  });

  /* ================================================================
     STATS
     ================================================================ */
  function refreshStats() {
    const total    = LISTINGS.length;
    const approved = LISTINGS.filter(p => p.status === 'approved').length;
    const pending  = LISTINGS.filter(p => p.status === 'pending').length;
    const views    = total * 43;
    set('statTotal',    total);
    set('statApproved', approved);
    set('statPending',  pending);
    set('statViews',    views);
    set('sbCount',      total);
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ================================================================
     MODAL
     ================================================================ */
  const overlay  = document.getElementById('mOverlay');
  const mBox     = document.getElementById('mBox');
  const mTypeTag = document.getElementById('mTypeTag');
  const mTitle   = document.getElementById('mTitle');
  const mSub     = document.getElementById('mSub');
  const mGrid    = document.getElementById('mGrid');
  const mSubmit  = document.getElementById('mSubmit');

  let _activeType = 'res';
  let _editId     = null;

  function openModal(type, prefill) {
    const cfg = FORM_CONFIG[type];
    if (!cfg) return;

    _activeType = type;
    _editId     = prefill?.id || null;

    mTypeTag.textContent = cfg.icon + '  ' + cfg.label;
    mTitle.textContent   = prefill ? 'Edit Listing' : 'New Listing — Submit for Approval';
    mSub.textContent     = prefill
      ? 'Update your property details below.'
      : 'Fill in the details. Admin will review within 24 hours.';

    mSubmit.innerHTML = '<span class="submit-txt">Submit for Approval →</span><span class="d-spinner"></span>';
    mSubmit.disabled  = false;
    mSubmit.classList.remove('loading');
    mSubmit.style.background = '';

    /* Build fields */
    mGrid.innerHTML = '';
    cfg.fields.forEach(f => {
      const wrap = document.createElement('div');
      wrap.className = 'mf' + (f.full ? ' full' : '');

      if (f.type === 'file') {
        wrap.innerHTML = `
          <label>${f.label}</label>
          <label class="upload-zone" for="mf-${f.id}">
            <input type="file" id="mf-${f.id}" accept="image/*" multiple>
            <div class="uz-icon">📸</div>
            <div class="uz-text"><strong>Click to upload</strong> or drag &amp; drop<br>JPG, PNG — up to 5MB each</div>
          </label>`;
      } else if (f.type === 'select') {
        const opts = f.opts.map(o =>
          `<option value="${o}"${prefill?.subtype === o ? ' selected' : ''}>${o}</option>`
        ).join('');
        wrap.innerHTML = `<label for="mf-${f.id}">${f.label}</label>
          <select id="mf-${f.id}"><option value="">Select…</option>${opts}</select>`;
      } else if (f.type === 'textarea') {
        wrap.innerHTML = `<label for="mf-${f.id}">${f.label}</label>
          <textarea id="mf-${f.id}" placeholder="${f.ph || ''}">${prefill?.[f.id] || ''}</textarea>`;
      } else {
        wrap.innerHTML = `<label for="mf-${f.id}">${f.label}</label>
          <input id="mf-${f.id}" type="text" placeholder="${f.ph || ''}" value="${prefill?.[f.id] || ''}">`;
      }
      mGrid.appendChild(wrap);
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('mClose')?.addEventListener('click',  closeModal);
  document.getElementById('mCancel')?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  /* Submit */
  mSubmit?.addEventListener('click', () => {
    const cfg = FORM_CONFIG[_activeType];

    /* Validate non-file required fields */
    let valid = true;
    cfg.fields.filter(f => f.type !== 'file').forEach(f => {
      const el = document.getElementById('mf-' + f.id);
      if (!el || !el.value.trim()) {
        el?.classList.add('err');
        valid = false;
      } else {
        el.classList.remove('err');
      }
    });
    if (!valid) return;

    /* Loading state */
    mSubmit.classList.add('loading');
    mSubmit.disabled = true;

    /* Simulated API — replace with real fetch() to Spring Boot */
    setTimeout(() => {
      if (!_editId) {
        const titleEl = document.getElementById('mf-title');
        const locEl   = document.getElementById('mf-location');
        const subEl   = document.getElementById('mf-subtype');
        const priceEl = document.getElementById('mf-price') ||
                        document.getElementById('mf-acres') ||
                        document.getElementById('mf-sqm');
        LISTINGS.unshift({
          id:       'p' + Date.now(),
          type:     _activeType,
          subtype:  subEl?.value  || cfg.label,
          name:     titleEl?.value || 'New Listing',
          location: locEl?.value   || '—',
          price:    '₦' + (priceEl?.value || '—'),
          status:   'pending',
          date:     new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
          img:      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&q=70'
        });
        refreshStats();
      }
      renderTable();

      mSubmit.classList.remove('loading');
      mSubmit.innerHTML = '✓ Submitted!';
      mSubmit.style.background = 'var(--accent)';

      setTimeout(closeModal, 1100);
    }, 1700);
  });


  /* Topbar "List Property" button opens modal (residential default) */
  document.getElementById('tbListBtn')?.addEventListener('click', () => openModal('res'));

  /* ================================================================
     LOGOUT
     ================================================================ */
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('Sign out of your seller account?')) {
      window.location.href = '../index.html';
    }
  });

  /* ================================================================
     HELPERS
     ================================================================ */
  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  /* ── Init ── */
  renderTable();
  refreshStats();

})();