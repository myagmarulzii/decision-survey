const Satisfaction = {
  started: false,
  finished: false,
  startTime: null,
  endTime: null,
  participantId: null,
  step: 1,
  score: null,
  group: null,
  reason: null,
  specify: null,

  async init() {
    this.renderSelect();
  },

  async renderSelect() {
    const el = document.getElementById('satisfaction-area');
    const eligible = await getEligibleSatisfactionIds();

    if (eligible.length === 0) {
      el.innerHTML = `
        <div class="card">
          <p class="intro-text">${TXT.satisfaction_intro}</p>
          <p>${TXT.satisfaction_no_ids}</p>
        </div>
      `;
      return;
    }

    const opts = eligible.map(id => `<option value="${id}">${id}</option>`).join('');
    el.innerHTML = `
      <div class="card">
        <p class="intro-text">${TXT.satisfaction_intro}</p>
        <label>${TXT.satisfaction_select_id}</label>
        <select id="sat-pid-select">${opts}</select>
        <button class="btn btn-primary" id="sat-start-btn">${TXT.satisfaction_start}</button>
      </div>
    `;
    document.getElementById('sat-start-btn').addEventListener('click', () => this.start());
  },

  start() {
    const pid = document.getElementById('sat-pid-select').value;
    if (!pid) { showToast(TXT.satisfaction_no_ids); return; }
    this.started = true;
    this.finished = false;
    this.startTime = new Date();
    this.participantId = pid;
    this.step = 1;
    this.score = null;
    this.group = null;
    this.reason = null;
    this.specify = null;
    this.renderStep1();
  },

  renderStep1() {
    const el = document.getElementById('satisfaction-area');
    const btns = Array.from({length: 11}, (_, i) =>
      `<label class="radio-option ${this.score === i ? 'selected' : ''}" data-val="${i}">
        <input type="radio" name="sat-score" value="${i}" ${this.score === i ? 'checked' : ''}>
        <span>${i}</span>
      </label>`
    ).join('');

    el.innerHTML = `
      <div class="card">
        <div class="progress-label">${TXT.progress_label} 1</div>
        <p class="question-text">${TXT.satisfaction_question}</p>
        <div class="radio-group inline" id="sat-score-group">${btns}</div>
        <div class="scale-labels">
          <span>${TXT.satisfaction_left}</span>
          <span>${TXT.satisfaction_right}</span>
        </div>
        <div class="btn-row">
          <div></div>
          <button class="btn btn-primary" id="sat-next">${TXT.next_button}</button>
        </div>
      </div>
    `;

    el.querySelectorAll('.radio-option').forEach(opt => {
      opt.addEventListener('click', () => {
        el.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
      });
    });

    document.getElementById('sat-next').addEventListener('click', () => {
      const checked = document.querySelector('input[name="sat-score"]:checked');
      if (!checked) { showToast(TXT.validation_answer); return; }
      this.score = Number(checked.value);
      this.group = getSatGroup(this.score);
      this.step = 2;
      this.renderStep2();
    });
  },

  renderStep2() {
    const el = document.getElementById('satisfaction-area');
    const reasons = SATISFACTION_REASONS[this.group] || [];
    const reasonLabel = getSatReasonLabel(this.group);

    const radioHtml = reasons.map(r =>
      `<label class="radio-option ${this.reason === r ? 'selected' : ''}" data-val="${r}">
        <input type="radio" name="sat-reason" value="${r}" ${this.reason === r ? 'checked' : ''}>
        <div class="radio-dot"></div>
        <span>${r}</span>
      </label>`
    ).join('');

    el.innerHTML = `
      <div class="card">
        <div class="progress-label">${TXT.progress_label} 2</div>
        <p class="question-text">${reasonLabel}</p>
        <div class="radio-group" id="sat-reason-group">${radioHtml}</div>
        <div id="specify-area"></div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="sat-back">${TXT.back_button}</button>
          <button class="btn btn-success" id="sat-finish">${TXT.finish_button}</button>
        </div>
      </div>
    `;

    const updateSpecify = () => {
      const checked = document.querySelector('input[name="sat-reason"]:checked');
      const specArea = document.getElementById('specify-area');
      if (checked && needsSpecify(this.group, checked.value)) {
        specArea.innerHTML = `
          <label>${TXT.specify_label}</label>
          <textarea id="sat-specify-input" rows="3" placeholder="Type your answer here...">${this.specify || ''}</textarea>
        `;
      } else {
        specArea.innerHTML = '';
      }
    };

    el.querySelectorAll('.radio-option').forEach(opt => {
      opt.addEventListener('click', () => {
        el.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
        updateSpecify();
      });
    });

    updateSpecify();

    document.getElementById('sat-back').addEventListener('click', () => {
      const checked = document.querySelector('input[name="sat-reason"]:checked');
      if (checked) this.reason = checked.value;
      const specInput = document.getElementById('sat-specify-input');
      if (specInput) this.specify = specInput.value;
      this.step = 1;
      this.renderStep1();
    });

    document.getElementById('sat-finish').addEventListener('click', () => this.finish());
  },

  async finish() {
    const checked = document.querySelector('input[name="sat-reason"]:checked');
    if (!checked) { showToast(TXT.validation_answer); return; }
    this.reason = checked.value;

    const specInput = document.getElementById('sat-specify-input');
    this.specify = specInput ? specInput.value.trim() : '';

    if (needsSpecify(this.group, this.reason) && !this.specify) {
      showToast(TXT.validation_specify);
      return;
    }

    this.endTime = new Date();
    const totalSec = ((this.endTime - this.startTime) / 1000).toFixed(1);

    const baseRow = {
      participant_id: this.participantId,
      questionnaire: 'satisfaction',
      timestamp: new Date().toISOString(),
      survey_start: this.startTime.toISOString(),
      survey_end: this.endTime.toISOString(),
      total_time_seconds: totalSec,
      completed: 'TRUE',
      risk_score: '',
      patience_score: '',
      satisfaction_score: String(this.score),
      satisfaction_group: this.group,
      satisfaction_reason: this.reason,
      satisfaction_specify: this.specify || '',
      rational_score: '',
      avoidant_score: '',
      dependent_score: '',
      intuitive_score: ''
    };

    const rows = [
      { ...baseRow, question_order: '1', question_id: 'S01', question_text: TXT.satisfaction_question, answer: String(this.score) },
      { ...baseRow, question_order: '2', question_id: 'S02', question_text: getSatReasonLabel(this.group), answer: this.reason }
    ];

    await saveRows(rows);
    this.finished = true;
    this.renderDone(totalSec);
  },

  renderDone(totalSec) {
    const el = document.getElementById('satisfaction-area');
    el.innerHTML = `
      <div class="card centered thank-you">
        <h3>${TXT.thank_you_title}</h3>
        <p>${TXT.satisfaction_done}</p>
        <p><strong>${TXT.time_taken_label}: ${totalSec}</strong></p>
        <p>Participant ID: ${this.participantId}</p>
        <div style="margin-top:16px">
          <button class="btn btn-secondary" id="sat-restart">${TXT.restart_button}</button>
        </div>
      </div>
    `;
    document.getElementById('sat-restart').addEventListener('click', () => {
      this.started = false;
      this.finished = false;
      this.renderSelect();
    });
  }
};
