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

// Sync banner logic - автомат илгээх
const syncBanner = document.getElementById('sync-banner');
const syncBannerText = document.getElementById('sync-banner-text');
const syncBannerBtn = document.getElementById('sync-banner-btn');

async function updateSyncBanner() {
  if (!Sync.getServerUrl()) {
    syncBanner.classList.add('hidden');
    return;
  }
  const count = await Sync.getUnsyncedCount();
  if (count > 0) {
    if (navigator.onLine) {
      // Онлайн бол автоматаар илгээх
      syncBannerText.textContent = `${count} мөр илгээж байна...`;
      syncBannerBtn.style.display = 'none';
      syncBanner.classList.remove('hidden');
      await Sync.autoSync();
      // Илгээсний дараа шинэчлэх
      const remaining = await Sync.getUnsyncedCount();
      if (remaining === 0) {
        syncBannerText.textContent = 'Бүх дата илгээгдсэн ✓';
        setTimeout(() => syncBanner.classList.add('hidden'), 2000);
      } else {
        syncBannerText.textContent = `${remaining} мөр илгээгдээгүй`;
        syncBannerBtn.textContent = 'Дахин илгээх';
        syncBannerBtn.style.display = '';
      }
    } else {
      syncBannerText.textContent = `${count} мөр хадгалагдсан. Онлайн болмогц автомат илгээнэ.`;
      syncBannerBtn.style.display = 'none';
      syncBanner.classList.remove('hidden');
    }
  } else {
    syncBanner.classList.add('hidden');
  }
}

if (syncBannerBtn) {
  syncBannerBtn.addEventListener('click', async () => {
    syncBannerBtn.textContent = 'Илгээж байна...';
    syncBannerBtn.disabled = true;
    await Sync.syncNow();
    syncBannerBtn.textContent = 'Дахин илгээх';
    syncBannerBtn.disabled = false;
    updateSyncBanner();
  });
}

// Онлайн болмогц автомат sync
window.addEventListener('online', () => {
  showToast('Интернэт холбогдлоо. Дата илгээж байна...', true);
  setTimeout(updateSyncBanner, 1000);
});

window.addEventListener('offline', () => {
  updateSyncBanner();
});

// Check sync banner periodically
setInterval(updateSyncBanner, 30000);

Survey.init();
updateSyncBanner();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
