// nav_patch.js — UZMA Portal universal nav & hero enhancer
document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. UPGRADE OLD NAV LOGO → FULL BRAND WORDMARK ── */
  const oldLogo = document.querySelector('nav > a[href="marketplace.html"] > img.logo-img');
  if (oldLogo) {
    const parent = oldLogo.parentElement;
    parent.className = 'nav-brand';
    parent.innerHTML = `
      <img class="logo-img" src="LogoUzma.png" alt="UZMA">
      <div class="nav-brand-divider"></div>
      <div class="nav-brand-text">
        <span class="nav-brand-name">UZMA</span>
        <span class="nav-brand-sub">Geospatial AI Platform</span>
      </div>`;
  }

  /* ── 2. ADD EYEBROW TO .page-hero IF MISSING ── */
  const hero = document.querySelector('.page-hero');
  if (hero && !hero.querySelector('.page-hero-eyebrow')) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'page-hero-eyebrow';
    eyebrow.textContent = 'UZMA · Geospatial AI Platform';
    hero.insertBefore(eyebrow, hero.firstChild);
  }

  /* ── 3. INJECT GLOBAL POLISH STYLES ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Smooth scrolling */
    html { scroll-behavior: smooth; }

    /* Nav brand text always visible on desktop */
    @media (min-width: 769px) {
      .nav-brand-text { display: flex !important; }
      .nav-brand-divider { display: block !important; }
    }

    /* Page-hero eyebrow */
    .page-hero-eyebrow {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--orange);
      margin-bottom: .5rem;
    }

    /* Card hover lift consistency */
    .prod-card, .card {
      transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease !important;
    }

    /* Footer strip */
    body::after {
      content: '© ' attr(data-year) ' UZMA Geospatial AI Platform · Malaysia';
      display: block;
      text-align: center;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: var(--gray-muted);
      padding: 1.5rem 1rem;
      border-top: 1px solid var(--gray-line);
      margin-top: 2rem;
      background: #fff;
    }

    /* Leaflet tile fix — hide any blocked-tile warnings */
    .leaflet-tile-error { display: none !important; opacity: 0 !important; }
  `;
  document.head.appendChild(style);

  /* Set year for footer */
  document.body.setAttribute('data-year', new Date().getFullYear());
});