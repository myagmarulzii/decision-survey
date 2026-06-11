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

Survey.init();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
