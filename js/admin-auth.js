// ═══════════════════════════════════════════
//  Admin Auth Guard — hər admin səhifəsinde
//  <script src="../js/admin-auth.js"></script>
// ═══════════════════════════════════════════

// Global admin user
let adminUser = null;
let adminData = null;

function requireAdmin(onReady) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    try {
      const snap = await db.collection('admins').doc(user.uid).get();
      if (!snap.exists || snap.data().role !== 'admin') {
        await auth.signOut();
        window.location.href = 'login.html';
        return;
      }
      adminUser = user;
      adminData = snap.data();
      // Populate UI
      const nameEl = document.getElementById('adminName');
      const emailEl = document.getElementById('adminEmail');
      const avatarEl = document.getElementById('adminAvatar');
      if (nameEl) nameEl.textContent = adminData.name || user.email.split('@')[0];
      if (emailEl) emailEl.textContent = user.email;
      if (avatarEl) avatarEl.textContent = (adminData.name || user.email)[0].toUpperCase();
      initMobSidebar();
      onReady(user, adminData);
    } catch (e) {
      console.error(e);
      window.location.href = 'login.html';
    }
  });
}

async function adminLogout() {
  if (!confirm('Çıxmaq istəyirsiniz?')) return;
  await auth.signOut();
  window.location.href = 'login.html';
}

// ── Mobile sidebar ──────────────────────────────────
function initMobSidebar(){
  // Inject hamburger button if not already present
  if(document.getElementById('mobHmb'))return;
  const btn=document.createElement('button');
  btn.id='mobHmb';
  btn.className='mob-hmb';
  btn.setAttribute('aria-label','Menyu');
  btn.innerHTML='<span></span><span></span><span></span>';
  btn.onclick=toggleAdminSidebar;
  document.body.appendChild(btn);
  const ov=document.createElement('div');
  ov.id='mobOv';
  ov.className='mob-overlay';
  ov.onclick=closeAdminSidebar;
  document.body.appendChild(ov);
}
function toggleAdminSidebar(){
  const sb=document.querySelector('.sidebar');
  const ov=document.getElementById('mobOv');
  const btn=document.getElementById('mobHmb');
  if(!sb)return;
  const open=sb.classList.toggle('mob-open');
  if(ov)ov.classList.toggle('open',open);
  if(btn)btn.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function closeAdminSidebar(){
  const sb=document.querySelector('.sidebar');
  const ov=document.getElementById('mobOv');
  const btn=document.getElementById('mobHmb');
  if(sb)sb.classList.remove('mob-open');
  if(ov)ov.classList.remove('open');
  if(btn)btn.classList.remove('open');
  document.body.style.overflow='';
}

// ── Log admin activity ──────────────────────────────
async function logActivity(action, detail = '') {
  try {
    await db.collection('admin_logs').add({
      uid: adminUser?.uid || 'unknown',
      name: adminData?.name || adminUser?.email || 'Admin',
      action,
      detail,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      ip: '' // filled server-side if needed
    });
  } catch (e) {}
}

// ── Toast ───────────────────────────────────────────
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  setTimeout(() => el.className = 'toast', 3200);
}

// ── Format date ─────────────────────────────────────
function fmtDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('az-AZ', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
