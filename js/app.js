function showToast(msg, success) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (success ? ' success' : '');
  setTimeout(() => t.classList.add('hidden'), 2500);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

    if (btn.dataset.tab === 'satisfaction') Satisfaction.init();
    if (btn.dataset.tab === 'admin') Admin.render();
  });
});

// Initialize sync module
Sync.init();

// Sync banner logic
const syncBanner = document.getElementById('sync-banner');
const syncBannerText = document.getElementById('sync-banner-text');
const syncBannerBtn = document.getElementById('sync-banner-btn');

async function updateSyncBanner() {
  if (!Sync.getServerUrl()) {
    syncBanner.classList.add('hidden');
    return;
  }
  const count = await Sync.getUnsyncedCount();
  if (count > 0 && navigator.onLine) {
    syncBannerText.textContent = `${count} илгээгдээгүй мөр байна`;
    syncBanner.classList.remove('hidden');
  } else {
    syncBanner.classList.add('hidden');
  }
}

if (syncBannerBtn) {
  syncBannerBtn.addEventListener('click', async () => {
    syncBannerBtn.textContent = 'Илгээж байна...';
    syncBannerBtn.disabled = true;
    await Sync.syncNow();
    syncBannerBtn.textContent = 'Илгээх';
    syncBannerBtn.disabled = false;
    updateSyncBanner();
  });
}

// Check sync banner periodically
setInterval(updateSyncBanner, 30000);
window.addEventListener('online', () => setTimeout(updateSyncBanner, 1000));

Survey.init();
updateSyncBanner();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
