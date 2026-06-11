/**
 * Sync Module — offline-first, auto-sync when online
 * Device бүр өөрийн ID-тэй, илгээгдсэн/илгээгдээгүй мөрүүдийг track хийнэ
 */
const Sync = {
  serverUrl: null,
  deviceId: null,
  syncing: false,

  init() {
    // Device ID - утас бүрт unique
    this.deviceId = localStorage.getItem('device_id');
    if (!this.deviceId) {
      this.deviceId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
      localStorage.setItem('device_id', this.deviceId);
    }

    // Server URL
    this.serverUrl = localStorage.getItem('server_url') || '';

    // Online/offline listener
    window.addEventListener('online', () => {
      this.updateStatusUI();
      this.autoSync();
    });
    window.addEventListener('offline', () => this.updateStatusUI());

    // Auto-sync interval (2 min)
    setInterval(() => {
      if (navigator.onLine && this.serverUrl) this.autoSync();
    }, 120000);

    this.updateStatusUI();
  },

  updateStatusUI() {
    const dot = document.getElementById('online-dot');
    const label = document.getElementById('online-label');
    if (!dot || !label) return;

    if (navigator.onLine) {
      dot.className = 'status-dot online';
      label.textContent = 'Онлайн';
    } else {
      dot.className = 'status-dot offline';
      label.textContent = 'Офлайн';
    }
  },

  getServerUrl() {
    return this.serverUrl;
  },

  setServerUrl(url) {
    this.serverUrl = (url || '').trim();
    localStorage.setItem('server_url', this.serverUrl);
  },

  // Get IDs of rows already synced
  getSyncedIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem('synced_ids') || '[]'));
    } catch { return new Set(); }
  },

  addSyncedIds(ids) {
    const existing = this.getSyncedIds();
    for (const id of ids) existing.add(id);
    localStorage.setItem('synced_ids', JSON.stringify([...existing]));
  },

  async getUnsyncedRows() {
    const all = await getAllRows();
    const synced = this.getSyncedIds();
    return all.filter(r => !synced.has(r.id));
  },

  async getUnsyncedCount() {
    const rows = await this.getUnsyncedRows();
    return rows.length;
  },

  async autoSync() {
    if (!this.serverUrl || !navigator.onLine || this.syncing) return;
    const unsynced = await this.getUnsyncedRows();
    if (unsynced.length === 0) return;
    await this.syncNow();
  },

  async syncNow() {
    if (!this.serverUrl) {
      showToast('Серверийн URL тохируулна уу');
      return { success: false, error: 'URL тохируулаагүй' };
    }

    if (!navigator.onLine) {
      showToast('Интернэт холболтгүй байна. Онлайн болмогц автоматаар илгээнэ.');
      return { success: false, error: 'Офлайн' };
    }

    if (this.syncing) return { success: false, error: 'Sync хийж байна' };

    const unsynced = await this.getUnsyncedRows();
    if (unsynced.length === 0) {
      showToast('Илгээх шинэ өгөгдөл алга', true);
      return { success: true, added: 0 };
    }

    this.syncing = true;
    this.updateSyncButton('syncing');

    try {
      const payload = JSON.stringify({
        rows: unsynced,
        device_id: this.deviceId
      });

      // Google Apps Script redirects POST to a different URL.
      // Using no-cors avoids CORS preflight; text/plain ensures body is sent.
      // Response is opaque (can't read), so we assume success if no network error.
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payload,
        mode: 'no-cors',
        redirect: 'follow'
      });

      // Mark rows as synced
      const ids = unsynced.map(r => r.id);
      this.addSyncedIds(ids);

      this.syncing = false;
      this.updateSyncButton('done');
      showToast(`${unsynced.length} мөр серверт илгээгдлээ`, true);

      return { success: true, added: unsynced.length };

    } catch (err) {
      this.syncing = false;
      this.updateSyncButton('error');
      showToast('Серверт илгээхэд алдаа гарлаа: ' + err.message);
      return { success: false, error: err.message };
    }
  },

  async checkServer() {
    if (!this.serverUrl) return { success: false, error: 'URL байхгүй' };
    try {
      const res = await fetch(this.serverUrl + '?action=status');
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateSyncButton(state) {
    const btn = document.getElementById('sync-now-btn');
    if (!btn) return;
    switch (state) {
      case 'syncing':
        btn.textContent = 'Илгээж байна...';
        btn.disabled = true;
        break;
      case 'done':
        btn.textContent = 'Серверт илгээх';
        btn.disabled = false;
        break;
      case 'error':
        btn.textContent = 'Серверт илгээх (алдаа)';
        btn.disabled = false;
        break;
    }
  }
};
