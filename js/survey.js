const Survey = {
  started: false,
  finished: false,
  startTime: null,
  endTime: null,
  participantId: null,
  currentModule: null,
  currentNodeId: null,
  history: [],
  answers: [],
  riskScore: null,
  patienceScore: null,
  decisionIndex: 0,
  decisionAnswers: {},

  init() {
    this.renderWelcome();
  },

  renderWelcome() {
    const el = document.getElementById('survey-area');
    el.innerHTML = `
      <div class="card">
        <label>${TXT.id_label}</label>
        <input type="text" id="pid-input" placeholder="${TXT.id_placeholder}">
        <button class="btn btn-primary" id="start-btn">${TXT.start_button}</button>
      </div>
    `;
    document.getElementById('start-btn').addEventListener('click', () => this.start());
  },

  start() {
    const pid = (document.getElementById('pid-input').value || '').trim();
    if (!pid) { showToast(TXT.validation_id); return; }
    this.started = true;
    this.finished = false;
    this.startTime = new Date();
    this.participantId = pid;
    this.currentModule = 'risk';
    this.currentNodeId = 'R01';
    this.history = [];
    this.answers = [];
    this.riskScore = null;
    this.patienceScore = null;
    this.decisionIndex = 0;
    this.decisionAnswers = {};
    this.renderQuestion();
  },

  getNode() {
    if (this.currentModule === 'risk') return getRiskNode(this.currentNodeId);
    return getTimeNode(this.currentNodeId);
  },

  renderQuestion() {
    const el = document.getElementById('survey-area');
    const node = this.getNode();
    const moduleLabel = this.currentModule === 'risk' ? TXT.module_risk : TXT.module_time;
    const moduleIntro = this.currentModule === 'risk' ? TXT.risk_intro : TXT.time_intro;
    const qNum = this.answers.filter(a => a.questionnaire === this.currentModule).length + 1;
    const isFirst = qNum === 1;
    const isTerminal = node.terminal;

    let questionText, optA, optB;
    if (this.currentModule === 'risk') {
      questionText = riskQuestionText(node.sure);
      optA = TXT.risk_option_a;
      optB = TXT.risk_option_b;
    } else {
      questionText = timeQuestionText(node.future);
      optA = TXT.time_option_a;
      optB = TXT.time_option_b;
    }

    let nextLabel = TXT.next_button;
    if (this.currentModule === 'risk' && isTerminal) nextLabel = TXT.continue_button;

    el.innerHTML = `
      <div class="card">
        <div class="module-title">${moduleLabel}</div>
        <div class="progress-label">${TXT.progress_label} ${qNum}</div>
        ${isFirst ? `<p class="intro-text">${moduleIntro}</p>` : ''}
        <p class="question-text">${questionText}</p>
        <div class="radio-group" id="answer-group">
          <label class="radio-option" data-val="A">
            <input type="radio" name="survey-ans" value="A">
            <div class="radio-dot"></div>
            <span>${optA}</span>
          </label>
          <label class="radio-option" data-val="B">
            <input type="radio" name="survey-ans" value="B">
            <div class="radio-dot"></div>
            <span>${optB}</span>
          </label>
        </div>
        <div class="btn-row">
          <div>${this.history.length > 0 ? `<button class="btn btn-secondary" id="back-btn">${TXT.back_button}</button>` : ''}</div>
          <button class="btn btn-primary" id="next-btn">${nextLabel}</button>
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

    document.getElementById('next-btn').addEventListener('click', () => this.next());
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.addEventListener('click', () => this.back());
  },

  next() {
    const checked = document.querySelector('input[name="survey-ans"]:checked');
    if (!checked) { showToast(TXT.validation_answer); return; }
    const val = checked.value;
    const node = this.getNode();
    const ansLabel = val === 'A'
      ? (this.currentModule === 'risk' ? TXT.risk_option_a : TXT.time_option_a)
      : (this.currentModule === 'risk' ? TXT.risk_option_b : TXT.time_option_b);

    this.answers.push({
      participant_id: this.participantId,
      questionnaire: this.currentModule,
      question_order: String(this.answers.filter(a => a.questionnaire === this.currentModule).length + 1),
      question_id: node.id,
      question_text: this.currentModule === 'risk' ? riskQuestionText(node.sure) : timeQuestionText(node.future),
      answer: ansLabel,
      timestamp: new Date().toISOString()
    });

    if (this.currentModule === 'risk' && node.terminal) {
      this.riskScore = val === 'A' ? node.riskScoreA : node.riskScoreB;
      this.currentModule = 'time';
      this.currentNodeId = 'T01';
      this.history = [];
      this.renderQuestion();
      return;
    }

    if (this.currentModule === 'time' && node.terminal) {
      this.patienceScore = val === 'A' ? node.patienceScoreA : node.patienceScoreB;
      this.currentModule = 'decision_style';
      this.decisionIndex = 0;
      this.decisionAnswers = {};
      this.renderDecisionStyle();
      return;
    }

    this.history.push(this.currentNodeId);
    this.currentNodeId = val === 'A' ? node.nextA : node.nextB;
    this.renderQuestion();
  },

  back() {
    if (this.history.length === 0) return;
    this.currentNodeId = this.history.pop();
    if (this.answers.length > 0) this.answers.pop();
    this.renderQuestion();
  },

  renderDecisionStyle() {
    const el = document.getElementById('survey-area');
    const groupId = DECISION_GROUPS[this.decisionIndex];
    const items = DECISION_STYLE.filter(d => d.group === groupId);
    const colorClass = GROUP_COLORS[groupId];
    const total = DECISION_GROUPS.length;

    const scaleLabels = [
      '0 = Never - I don\'t associate with this at all',
      '1 = Occasionally',
      '2 = Sometimes',
      '3 = Quite commonly',
      '4 = This is me most of the time'
    ];

    const isLast = this.decisionIndex === total - 1;
    const introHtml = this.decisionIndex === 0 ? `
      <p>In this section we ask you to describe how you make decisions. Please read carefully before answering. You can be one or more at a time, but not all 4 at the same time.</p>
      <p>Examples of herding decisions include decisions that come up seasonally or annually (moving, buying animals, selling animals, committing to coop cashmere quota, etc.), not everyday decisions.</p>
    ` : '';

    let itemsHtml = items.map(item => {
      const saved = this.decisionAnswers[item.id];
      const btns = [0,1,2,3,4].map(v =>
        `<button class="likert-btn ${saved === String(v) ? 'selected' : ''}" data-qid="${item.id}" data-val="${v}">${v}</button>`
      ).join('');
      return `<div class="decision-item"><p>${item.text}</p><div class="likert-row">${btns}</div></div>`;
    }).join('');

    el.innerHTML = `
      <div class="card">
        <div class="section-label">Section ${this.decisionIndex + 1} of ${total}</div>
        ${introHtml}
        <div class="scale-legend"><strong>Scale:</strong><br>${scaleLabels.join('<br>')}</div>
        <div class="decision-group ${colorClass}">${itemsHtml}</div>
        <div class="btn-row">
          <div>${this.decisionIndex > 0 ? `<button class="btn btn-secondary" id="dec-back">${TXT.back_button}</button>` : ''}</div>
          <button class="btn ${isLast ? 'btn-success' : 'btn-primary'}" id="dec-next">${isLast ? TXT.finish_button : TXT.next_button}</button>
        </div>
      </div>
    `;

    el.querySelectorAll('.likert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const val = btn.dataset.val;
        this.decisionAnswers[qid] = val;
        btn.parentElement.querySelectorAll('.likert-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    document.getElementById('dec-next').addEventListener('click', () => this.decisionNext());
    const db = document.getElementById('dec-back');
    if (db) db.addEventListener('click', () => this.decisionBack());
  },

  decisionNext() {
    const groupId = DECISION_GROUPS[this.decisionIndex];
    const items = DECISION_STYLE.filter(d => d.group === groupId);

    // Save current page answers
    items.forEach(item => {
      // keep existing answer if not changed on this render
    });

    const isLast = this.decisionIndex === DECISION_GROUPS.length - 1;

    if (!isLast) {
      this.decisionIndex++;
      this.renderDecisionStyle();
      return;
    }

    // Final validation: all 12 must be answered
    const missing = DECISION_STYLE.filter(d => this.decisionAnswers[d.id] == null);
    if (missing.length > 0) {
      showToast('Please answer all decision-style questions. Missing: ' + missing.map(m => m.id).join(', '));
      return;
    }

    this.finishSurvey();
  },

  decisionBack() {
    if (this.decisionIndex > 0) {
      this.decisionIndex--;
      this.renderDecisionStyle();
    }
  },

  async finishSurvey() {
    this.endTime = new Date();
    const totalSec = ((this.endTime - this.startTime) / 1000).toFixed(1);

    // Calculate decision style scores
    const styleScores = { rational_score: [], avoidant_score: [], dependent_score: [], intuitive_score: [] };
    for (const item of DECISION_STYLE) {
      const ans = this.decisionAnswers[item.id];
      if (ans != null) styleScores[item.col].push(Number(ans));
    }
    const avg = arr => arr.length ? (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(2) : '';

    // Build decision style answer rows
    const decRows = DECISION_STYLE.map((item, i) => ({
      participant_id: this.participantId,
      questionnaire: 'decision_style',
      question_order: String(i + 1),
      question_id: item.id,
      question_text: item.text,
      answer: this.decisionAnswers[item.id] || '',
      timestamp: new Date().toISOString()
    }));

    const allAnswers = [...this.answers, ...decRows];
    const rows = allAnswers.map(a => {
      const row = {};
      for (const col of RESULT_COLUMNS) row[col] = '';
      Object.assign(row, a);
      row.survey_start = this.startTime.toISOString();
      row.survey_end = this.endTime.toISOString();
      row.total_time_seconds = totalSec;
      row.completed = 'TRUE';
      row.risk_score = this.riskScore != null ? String(this.riskScore) : '';
      row.patience_score = this.patienceScore != null ? String(this.patienceScore) : '';
      row.rational_score = avg(styleScores.rational_score);
      row.avoidant_score = avg(styleScores.avoidant_score);
      row.dependent_score = avg(styleScores.dependent_score);
      row.intuitive_score = avg(styleScores.intuitive_score);
      return row;
    });

    await saveRows(rows);
    this.finished = true;
    this.renderThankYou(totalSec);
  },

  renderThankYou(totalSec) {
    const el = document.getElementById('survey-area');
    el.innerHTML = `
      <div class="card centered thank-you">
        <h3>${TXT.thank_you_title}</h3>
        <p>${TXT.thank_you_text}</p>
        <p><strong>${TXT.time_taken_label}: ${totalSec}</strong></p>
        <p>Participant ID: ${this.participantId}</p>
        <p style="color:var(--muted);font-size:0.9em;">You may now use the Satisfaction tab for eligible completed participants.</p>
        <div style="margin-top:16px">
          <button class="btn btn-secondary" id="restart-btn">${TXT.restart_button}</button>
        </div>
      </div>
    `;
    document.getElementById('restart-btn').addEventListener('click', () => this.renderWelcome());
  }
};
