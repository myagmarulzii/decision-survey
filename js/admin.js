const Admin = {
  PASSWORD: '123',
  authenticated: false,

  async init() {
    this.render();
  },

  async render() {
    const el = document.getElementById('admin-area');

    // Password check
    if (!this.authenticated) {
      el.innerHTML = `
        <div class="card centered" style="max-width:360px;margin:60px auto">
          <div style="font-size:2.5em;margin-bottom:12px">🔒</div>
          <h3 style="margin-bottom:16px">Админ нэвтрэх</h3>
          <p style="color:var(--muted);font-size:0.9em;margin-bottom:16px">Нууц үгээ оруулна уу</p>
          <input type="password" id="admin-pw" placeholder="Нууц үг" style="text-align:center;font-size:1.1em">
          <div id="admin-pw-error" style="color:var(--danger);font-size:0.85em;min-height:20px;margin-bottom:8px"></div>
          <button class="btn btn-primary" id="admin-login-btn" style="width:100%">Нэвтрэх</button>
        </div>
      `;
      const pwInput = document.getElementById('admin-pw');
      const loginBtn = document.getElementById('admin-login-btn');
      const errorEl = document.getElementById('admin-pw-error');

      const tryLogin = () => {
        if (pwInput.value === this.PASSWORD) {
          this.authenticated = true;
          this.render();
        } else {
          errorEl.textContent = 'Нууц үг буруу байна';
          pwInput.value = '';
          pwInput.focus();
        }
      };

      loginBtn.addEventListener('click', tryLogin);
      pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
      setTimeout(() => pwInput.focus(), 100);
      return;
    }
    const rows = await getAllRows();
    const unsyncedCount = await Sync.getUnsyncedCount();
    const syncedIds = Sync.getSyncedIds();
    const serverUrl = Sync.getServerUrl();

    // Sync section HTML
    const syncSection = `
      <div class="card sync-section">
        <h4>☁️ Серверийн тохиргоо</h4>
        <p style="font-size:0.85em;color:var(--muted);margin-bottom:10px">
          Google Apps Script URL оруулна уу. Олон утаснаас нэг серверт дата цуглуулна.
        </p>
        <div class="server-input-row">
          <input type="text" id="server-url-input" placeholder="https://script.google.com/macros/s/.../exec" value="${serverUrl || ''}">
          <button class="btn btn-primary btn-sm" id="save-url-btn">Хадгалах</button>
        </div>
        <div class="sync-stats">
          <div class="sync-stat">
            <div class="num" id="unsynced-count">${unsyncedCount}</div>
            <div class="lbl">Илгээгдээгүй</div>
          </div>
          <div class="sync-stat">
            <div class="num" id="synced-count">${syncedIds.size}</div>
            <div class="lbl">Илгээгдсэн</div>
          </div>
          <div class="sync-stat">
            <div class="num" id="server-rows">—</div>
            <div class="lbl">Серверт</div>
          </div>
          <div class="sync-stat">
            <div class="num">${Sync.deviceId ? Sync.deviceId.slice(0, 10) : '—'}</div>
            <div class="lbl">Device ID</div>
          </div>
        </div>
        <div class="btn-row" style="margin-top:0">
          <button class="btn btn-primary" id="sync-now-btn" ${!serverUrl ? 'disabled' : ''}>Серверт илгээх</button>
          <button class="btn btn-secondary btn-sm" id="check-server-btn" ${!serverUrl ? 'disabled' : ''}>Сервер шалгах</button>
        </div>
      </div>
    `;

    if (rows.length === 0) {
      el.innerHTML = `
        <div class="card">
          <h3>${TXT.admin_title}</h3>
          <div class="btn-row" style="margin-bottom:16px">
            <button class="btn btn-secondary" id="admin-refresh">${TXT.admin_refresh}</button>
            <div></div>
          </div>
          <p>${TXT.admin_no_data}</p>
        </div>
        ${syncSection}
      `;
      document.getElementById('admin-refresh').addEventListener('click', () => this.render());
      this.bindSyncEvents();
      return;
    }

    const pids = new Set(rows.map(r => r.participant_id));
    const quests = new Set(rows.map(r => r.questionnaire));

    const headerCells = RESULT_COLUMNS.map(c => `<th>${c}</th>`).join('');
    const bodyRows = rows.map(r => {
      const cells = RESULT_COLUMNS.map(c => `<td>${r[c] || ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    el.innerHTML = `
      <div class="card">
        <h3>${TXT.admin_title}</h3>
        <div class="btn-row" style="margin-bottom:16px">
          <button class="btn btn-secondary" id="admin-refresh">${TXT.admin_refresh}</button>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" id="admin-download">${TXT.admin_download}</button>
            <button class="btn btn-danger" id="admin-clear">Бүх өгөгдөл устгах</button>
          </div>
        </div>
        <div class="summary-grid">
          <div class="summary-item"><div class="label">Мөрийн тоо</div><div class="value">${rows.length}</div></div>
          <div class="summary-item"><div class="label">Оролцогчид</div><div class="value">${pids.size}</div></div>
          <div class="summary-item"><div class="label">Асуулгууд</div><div class="value">${[...quests].sort().join(', ')}</div></div>
        </div>
      </div>
      ${syncSection}
      <div class="card">
        <div class="admin-table-wrap">
          <table>
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('admin-refresh').addEventListener('click', () => this.render());
    document.getElementById('admin-download').addEventListener('click', () => this.download());
    document.getElementById('admin-clear').addEventListener('click', () => this.clear());
    this.bindSyncEvents();
  },

  bindSyncEvents() {
    const saveBtn = document.getElementById('save-url-btn');
    const syncBtn = document.getElementById('sync-now-btn');
    const checkBtn = document.getElementById('check-server-btn');
    const urlInput = document.getElementById('server-url-input');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        Sync.setServerUrl(url);
        showToast('Серверийн URL хадгалагдлаа', true);
        // Enable/disable buttons
        if (syncBtn) syncBtn.disabled = !url;
        if (checkBtn) checkBtn.disabled = !url;
      });
    }

    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        const result = await Sync.syncNow();
        if (result.success) this.render();
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        checkBtn.textContent = 'Шалгаж байна...';
        checkBtn.disabled = true;
        const result = await Sync.checkServer();
        if (result.success) {
          const serverRowsEl = document.getElementById('server-rows');
          if (serverRowsEl) serverRowsEl.textContent = result.total_rows;
          showToast(`Сервер ажиллаж байна. ${result.total_rows} мөр хадгалагдсан.`, true);
        } else {
          showToast('Серверт холбогдож чадсангүй: ' + (result.error || 'Алдаа'));
        }
        checkBtn.textContent = 'Сервер шалгах';
        checkBtn.disabled = false;
      });
    }
  },

  async download() {
    const csv = await exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'responses-' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV татагдлаа', true);
  },

  async clear() {
    if (!confirm('Бүх хадгалсан хариултыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.')) return;
    await clearAllData();
    this.render();
    showToast('Бүх өгөгдөл устгагдлаа', true);
  }
};
