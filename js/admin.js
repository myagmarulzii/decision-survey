const Admin = {
  async init() {
    this.render();
  },

  async render() {
    const el = document.getElementById('admin-area');
    const rows = await getAllRows();

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
      `;
      document.getElementById('admin-refresh').addEventListener('click', () => this.render());
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
            <button class="btn btn-danger" id="admin-clear">Clear all data</button>
          </div>
        </div>
        <div class="summary-grid">
          <div class="summary-item"><div class="label">Rows</div><div class="value">${rows.length}</div></div>
          <div class="summary-item"><div class="label">Participants</div><div class="value">${pids.size}</div></div>
          <div class="summary-item"><div class="label">Questionnaires</div><div class="value">${[...quests].sort().join(', ')}</div></div>
        </div>
      </div>
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
    showToast('CSV downloaded', true);
  },

  async clear() {
    if (!confirm('Are you sure you want to delete ALL saved responses? This cannot be undone.')) return;
    await clearAllData();
    this.render();
    showToast('All data cleared', true);
  }
};
