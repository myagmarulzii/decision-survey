const TXT = {
  app_title: 'Decision Survey',
  survey_tab: 'Questionnaire',
  satisfaction_tab: 'Satisfaction',
  admin_tab: 'Admin',
  welcome_text: 'Please enter your identifier to begin the questionnaire.',
  id_label: 'Personal identifier',
  id_placeholder: 'Enter your identifier',
  start_button: 'Start survey',
  next_button: 'Next',
  back_button: 'Back',
  continue_button: 'Continue to time survey',
  finish_button: 'Finish and save',
  restart_button: 'Restart',
  progress_label: 'Question number',
  thank_you_title: 'Thank you',
  thank_you_text: 'Your responses have been saved.',
  time_taken_label: 'Time taken (seconds)',
  validation_id: 'Please enter your identifier before starting.',
  validation_answer: 'Please select an answer before continuing.',
  validation_specify: 'Please provide the specified text before finishing.',
  risk_intro: 'Please answer the following lottery-choice questions.',
  time_intro: 'Please answer the following time-choice questions. Assume there is no inflation.',
  risk_option_a: '50/50 chance',
  risk_option_b: 'Sure payment',
  time_option_a: 'Today',
  time_option_b: 'In 12 months',
  module_risk: 'Lottery choice',
  module_time: 'Time choice',
  satisfaction_intro: 'Please answer the following questions about the group decision outcome.',
  satisfaction_question: 'How satisfied were you with the group decision outcome?',
  satisfaction_left: '0 = Extremely unsatisfied',
  satisfaction_right: '10 = Very satisfied',
  satisfaction_reason_satisfied: 'Why were you satisfied with the group decision outcome?',
  satisfaction_reason_neutral: 'Why were you neutral about the group decision outcome?',
  satisfaction_reason_unsatisfied: 'Why were you unsatisfied with the group decision outcome?',
  specify_label: 'Please specify:',
  satisfaction_select_id: 'Select participant identifier',
  satisfaction_start: 'Start satisfaction survey',
  satisfaction_no_ids: 'No participant identifiers are currently eligible for the satisfaction questionnaire.',
  satisfaction_done: 'This satisfaction response has been saved.',
  admin_title: 'Saved responses',
  admin_refresh: 'Refresh data',
  admin_download: 'Download CSV',
  admin_no_data: 'No responses found yet.',
  decision_style_intro: 'Please answer the following questions about how you usually make decisions.',
  decision_style_module: 'Decision style'
};

function fmtMoney(x) { return 'MNT ' + x; }

function riskQuestionText(sureAmount) {
  return 'Would you prefer a 50/50 chance of ' + fmtMoney('300K') +
    ' OR ' + fmtMoney(sureAmount) + ' as a sure payment?';
}

function timeQuestionText(futureAmount) {
  return 'Would you rather get paid for your cashmere at market price today on the spot OR ' +
    futureAmount + ' in 12 months?';
}

const RISK_TREE = [
  { id: 'R01', sure: '160K', nextA: 'R02', nextB: 'R03', terminal: false },
  { id: 'R02', sure: '240K', nextA: 'R04', nextB: 'R05', terminal: false },
  { id: 'R03', sure: '80K',  nextA: 'R06', nextB: 'R07', terminal: false },
  { id: 'R04', sure: '280K', nextA: 'R08', nextB: 'R09', terminal: false },
  { id: 'R05', sure: '200K', nextA: 'R10', nextB: 'R11', terminal: false },
  { id: 'R06', sure: '120K', nextA: 'R12', nextB: 'R13', terminal: false },
  { id: 'R07', sure: '40K',  nextA: 'R14', nextB: 'R15', terminal: false },
  { id: 'R08', sure: '300K', nextA: 'R16', nextB: 'R17', terminal: false },
  { id: 'R09', sure: '260K', nextA: 'R18', nextB: 'R19', terminal: false },
  { id: 'R10', sure: '220K', nextA: 'R20', nextB: 'R21', terminal: false },
  { id: 'R11', sure: '180K', nextA: 'R22', nextB: 'R23', terminal: false },
  { id: 'R12', sure: '140K', nextA: 'R24', nextB: 'R25', terminal: false },
  { id: 'R13', sure: '100K', nextA: 'R26', nextB: 'R27', terminal: false },
  { id: 'R14', sure: '60K',  nextA: 'R28', nextB: 'R29', terminal: false },
  { id: 'R15', sure: '20K',  nextA: 'R30', nextB: 'R31', terminal: false },
  { id: 'R16', sure: '310K', nextA: null, nextB: null, terminal: true },
  { id: 'R17', sure: '290K', nextA: null, nextB: null, terminal: true },
  { id: 'R18', sure: '270K', nextA: null, nextB: null, terminal: true },
  { id: 'R19', sure: '250K', nextA: null, nextB: null, terminal: true },
  { id: 'R20', sure: '230K', nextA: null, nextB: null, terminal: true },
  { id: 'R21', sure: '210K', nextA: null, nextB: null, terminal: true },
  { id: 'R22', sure: '190K', nextA: null, nextB: null, terminal: true },
  { id: 'R23', sure: '170K', nextA: null, nextB: null, terminal: true },
  { id: 'R24', sure: '150K', nextA: null, nextB: null, terminal: true },
  { id: 'R25', sure: '130K', nextA: null, nextB: null, terminal: true },
  { id: 'R26', sure: '110K', nextA: null, nextB: null, terminal: true },
  { id: 'R27', sure: '90K',  nextA: null, nextB: null, terminal: true },
  { id: 'R28', sure: '70K',  nextA: null, nextB: null, terminal: true },
  { id: 'R29', sure: '50K',  nextA: null, nextB: null, terminal: true },
  { id: 'R30', sure: '30K',  nextA: null, nextB: null, terminal: true },
  { id: 'R31', sure: '10K',  nextA: null, nextB: null, terminal: true },
];

const TIME_TREE = [
  { id: 'T01', future: '50% more',  nextA: 'T02', nextB: 'T03', terminal: false },
  { id: 'T02', future: '85% more',  nextA: 'T04', nextB: 'T05', terminal: false },
  { id: 'T03', future: '25% more',  nextA: 'T06', nextB: 'T07', terminal: false },
  { id: 'T04', future: '100% more', nextA: 'T08', nextB: 'T09', terminal: false },
  { id: 'T05', future: '70% more',  nextA: 'T10', nextB: 'T11', terminal: false },
  { id: 'T06', future: '40% more',  nextA: 'T12', nextB: 'T13', terminal: false },
  { id: 'T07', future: '10% more',  nextA: 'T14', nextB: 'T15', terminal: false },
  { id: 'T08', future: '110% more', nextA: 'T16', nextB: 'T17', terminal: false },
  { id: 'T09', future: '90% more',  nextA: 'T18', nextB: 'T19', terminal: false },
  { id: 'T10', future: '80% more',  nextA: 'T20', nextB: 'T21', terminal: false },
  { id: 'T11', future: '60% more',  nextA: 'T22', nextB: 'T23', terminal: false },
  { id: 'T12', future: '45% more',  nextA: 'T24', nextB: 'T25', terminal: false },
  { id: 'T13', future: '30% more',  nextA: 'T26', nextB: 'T27', terminal: false },
  { id: 'T14', future: '20% more',  nextA: 'T28', nextB: 'T29', terminal: false },
  { id: 'T15', future: '5% more',   nextA: 'T30', nextB: 'T31', terminal: false },
  { id: 'T16', future: '115% more', nextA: null, nextB: null, terminal: true },
  { id: 'T17', future: '110% more', nextA: null, nextB: null, terminal: true },
  { id: 'T18', future: '100% more', nextA: null, nextB: null, terminal: true },
  { id: 'T19', future: '90% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T20', future: '80% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T21', future: '70% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T22', future: '65% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T23', future: '60% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T24', future: '50% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T25', future: '40% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T26', future: '35% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T27', future: '30% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T28', future: '20% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T29', future: '15% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T30', future: '10% more',  nextA: null, nextB: null, terminal: true },
  { id: 'T31', future: '5% more',   nextA: null, nextB: null, terminal: true },
];

// Assign risk scores: terminal nodes sorted by sure_amount ascending, A gets even 2..32, B gets odd 1..31
(function assignRiskScores() {
  const terminals = RISK_TREE.filter(n => n.terminal)
    .sort((a, b) => parseInt(a.sure) - parseInt(b.sure));
  terminals.forEach((n, i) => {
    n.riskScoreA = (i + 1) * 2;
    n.riskScoreB = (i + 1) * 2 - 1;
  });
})();

// Assign patience scores: terminal nodes sorted by future_amount descending, A gets odd 1..31, B gets even 2..32
(function assignPatienceScores() {
  const terminals = TIME_TREE.filter(n => n.terminal)
    .sort((a, b) => parseInt(b.future) - parseInt(a.future));
  terminals.forEach((n, i) => {
    n.patienceScoreA = (i + 1) * 2 - 1;
    n.patienceScoreB = (i + 1) * 2;
  });
})();

function getRiskNode(id) { return RISK_TREE.find(n => n.id === id); }
function getTimeNode(id) { return TIME_TREE.find(n => n.id === id); }

const DECISION_STYLE = [
  { id: 'D01', group: 'G1', col: 'rational_score',  text: 'I make herding related decisions based on assessing all available information.' },
  { id: 'D02', group: 'G1', col: 'rational_score',  text: 'When making a herding decision, I like to consider all options in terms of a specific livelihood goal.' },
  { id: 'D03', group: 'G1', col: 'rational_score',  text: 'When making herding decisions, I decide in a logical and systematic way.' },
  { id: 'D04', group: 'G2', col: 'avoidant_score',   text: 'I generally make important herding decisions at the last minute.' },
  { id: 'D05', group: 'G2', col: 'avoidant_score',   text: 'I postpone herding decision making whenever possible.' },
  { id: 'D06', group: 'G2', col: 'avoidant_score',   text: 'I avoid making herding decisions until the pressure is on.' },
  { id: 'D07', group: 'G3', col: 'dependent_score',   text: 'I need the assistance of other people when making important herding decisions.' },
  { id: 'D08', group: 'G3', col: 'dependent_score',   text: 'I rarely make important herding decisions without consulting other people first.' },
  { id: 'D09', group: 'G3', col: 'dependent_score',   text: 'I like to have someone steer me in the right direction when I am faced with a complex herding decision.' },
  { id: 'D10', group: 'G4', col: 'intuitive_score',   text: 'When making herding decisions I tend to rely on my intuition.' },
  { id: 'D11', group: 'G4', col: 'intuitive_score',   text: 'When I make herding decisions it is more important that the decision feels right to me than to have a rational reason for it.' },
  { id: 'D12', group: 'G4', col: 'intuitive_score',   text: 'When making herding decisions, I rely upon my instincts.' },
];

const DECISION_GROUPS = ['G1', 'G2', 'G3', 'G4'];
const GROUP_COLORS = { G1: 'g1', G2: 'g2', G3: 'g3', G4: 'g4' };

const SATISFACTION_REASONS = {
  satisfied: [
    'Because the group answer represented my view',
    'Because I was happy with the consensus process',
    'Because I was happy to be included in the discussion'
  ],
  neutral: [
    'The group answer represented my view, but something else was not quite right (specify)',
    'The group answer did not represent my view, but I was content with the answer',
    'I was happy to compromise'
  ],
  unsatisfied: [
    'The group answer did not represent my view',
    'The group answer somewhat represented my view, but I was not heard',
    'I was unsatisfied because someone dominated the discussion',
    'Something else (specify)'
  ]
};

function getSatGroup(score) {
  if (score == null) return null;
  if (score >= 0 && score <= 4) return 'unsatisfied';
  if (score === 5) return 'neutral';
  if (score >= 6 && score <= 10) return 'satisfied';
  return null;
}

function needsSpecify(group, choice) {
  if (!group || !choice) return false;
  if (group === 'neutral' && choice.includes('not quite right (specify)')) return true;
  if (group === 'unsatisfied' && choice === 'Something else (specify)') return true;
  return false;
}

function getSatReasonLabel(group) {
  if (group === 'satisfied') return TXT.satisfaction_reason_satisfied;
  if (group === 'neutral') return TXT.satisfaction_reason_neutral;
  if (group === 'unsatisfied') return TXT.satisfaction_reason_unsatisfied;
  return '';
}

const RESULT_COLUMNS = [
  'participant_id', 'questionnaire', 'question_order', 'question_id',
  'question_text', 'answer', 'timestamp', 'survey_start', 'survey_end',
  'total_time_seconds', 'completed', 'risk_score', 'patience_score',
  'satisfaction_score', 'satisfaction_group', 'satisfaction_reason',
  'satisfaction_specify', 'rational_score', 'avoidant_score',
  'dependent_score', 'intuitive_score'
];
