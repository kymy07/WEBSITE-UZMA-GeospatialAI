/* ===== shared.js — UZMA Portal shared state & utilities ===== */

// ── STORAGE KEYS ──────────────────────────────────────────────
const KEY_CART = 'uzma_cart';
const KEY_USER = 'uzma_user';

// ── STATE ──────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem(KEY_CART) || '[]');
let currentUser = JSON.parse(localStorage.getItem(KEY_USER) || 'null');

// ── PERSIST ───────────────────────────────────────────────────
function saveCart() { localStorage.setItem(KEY_CART, JSON.stringify(cart)); }
function saveUser() { localStorage.setItem(KEY_USER, JSON.stringify(currentUser)); }

// ── CART ──────────────────────────────────────────────────────
function addCart(item) {
  if (cart.find(c => c.id === item.id)) return false;
  cart.push(item);
  saveCart();
  updateCartUI();
  showToast('Added to cart ✓');
  return true;
}
function rmCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}
function cartHas(id) { return !!cart.find(c => c.id === id); }

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.length;

  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = '<div class="empty">No items yet.<br>Browse images to add.</div>';
    if (foot) foot.style.display = 'none';
    return;
  }
  if (foot) foot.style.display = 'block';
  const totalEl = document.getElementById('total-val');
  if (totalEl) totalEl.textContent = `RM ${cart.reduce((s,r)=>s+r.price,0).toLocaleString()}`;

  body.innerHTML = cart.map(r => `
    <div class="ci">
      <img src="${r.img}" alt="${r.name}">
      <div class="ci-info">
        <div class="ci-name">${r.name}</div>
        <div class="ci-sub">${r.loc} · ${r.resCm}cm · ${r.type.toUpperCase()}</div>
        <div class="ci-price">RM ${r.price.toLocaleString()}</div>
      </div>
      <button class="ci-rm" onclick="rmCart(${r.id})">×</button>
    </div>`).join('');
}

function toggleCart() {
  document.getElementById('cart').classList.toggle('open');
  document.getElementById('ov').classList.toggle('open');
}

// ── AUTH ──────────────────────────────────────────────────────
function openAuth(tab) {
  document.getElementById('auth-modal').classList.add('open');
  switchTab(tab);
}
function switchTab(tab) {
  ['login','signup'].forEach(t => {
    document.getElementById('tab-'+t).classList.toggle('on', t===tab);
    document.getElementById('panel-'+t).classList.toggle('on', t===tab);
  });
}
function toggleEye(inputId, btn) {
  const inp = document.getElementById(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}
function checkStrength(val) {
  const fill = document.getElementById('strength-fill');
  let s = 0;
  if (val.length >= 8) s++;
  if (/[A-Z]/.test(val)) s++;
  if (/[0-9]/.test(val)) s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  fill.style.width = (s * 25) + '%';
  fill.style.background = ['#E24B4A','#E24B4A','#EF9F27','#1D9E75','#1D9E75'][s];
}
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value.trim();
  const err   = document.getElementById('login-err');
  if (!email || !pass) { err.style.display='block'; err.textContent='Please fill in all fields.'; return; }
  err.style.display = 'none';
  currentUser = { name: email.split('@')[0], email };
  saveUser(); closeModal('auth-modal'); updateAuthUI(); showToast('Logged in successfully ✓');
}
function demoLogin() {
  currentUser = { name: 'Demo User', email: 'demo@uzma.com.my' };
  saveUser(); closeModal('auth-modal'); updateAuthUI(); showToast('Logged in as Demo User ✓');
}
function doSignup() {
  const name  = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pass  = document.getElementById('su-pass').value.trim();
  const err   = document.getElementById('su-err');
  if (!name||!email||!pass) { err.style.display='block'; err.textContent='Please fill in all required fields.'; return; }
  if (pass.length < 8)       { err.style.display='block'; err.textContent='Password must be at least 8 characters.'; return; }
  err.style.display = 'none';
  currentUser = { name, email };
  saveUser(); closeModal('auth-modal'); updateAuthUI(); showToast('Account created! Welcome, '+name+' ✓');
}
function doLogout() {
  currentUser = null;
  localStorage.removeItem(KEY_USER);
  updateAuthUI();
  showToast('Signed out.');
}
function updateAuthUI() {
  const area = document.getElementById('nav-auth-area');
  if (!area) return;
  const cartSvg = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`;
  if (currentUser) {
    const ini = currentUser.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    area.innerHTML = `<div class="user-pill"><div class="user-avatar">${ini}</div><span class="user-name">${currentUser.name}</span><button class="logout-btn" onclick="doLogout()">Sign out</button></div>
    <button class="cart-btn" onclick="toggleCart()">${cartSvg} Cart <span class="cart-count" id="cart-count">${cart.length}</span></button>`;
  } else {
    area.innerHTML = `<button class="btn-login" onclick="openAuth('login')">Log In</button>
    <button class="btn-signup" onclick="openAuth('signup')">Sign Up</button>
    <button class="cart-btn" onclick="toggleCart()">${cartSvg} Cart <span class="cart-count" id="cart-count">${cart.length}</span></button>`;
  }
}

// ── MODALS ────────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function bgClose(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

// ── CHECKOUT ──────────────────────────────────────────────────
function openPW() { document.getElementById('pwm').classList.add('open'); }
function submitPW() {
  const email = document.getElementById('pw-email').value.trim();
  const pass  = document.getElementById('pw-pass').value.trim();
  const err   = document.getElementById('pw-err');
  const btn   = document.getElementById('pw-ok');
  if (!email||!pass) { err.style.display='block'; err.textContent='Please fill in all fields.'; return; }
  err.style.display='none'; btn.textContent='VERIFYING...'; btn.disabled=true;
  setTimeout(()=>{
    btn.textContent='CONFIRM ORDER'; btn.disabled=false;
    err.style.display='block'; err.textContent='API endpoint not connected. Integrate UZMA API to verify.';
  }, 1600);
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

// ── INIT on every page ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartUI();
});