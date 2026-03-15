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
