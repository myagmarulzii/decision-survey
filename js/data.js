const TXT = {
  app_title: 'Шийдвэрийн судалгаа',
  survey_tab: 'Асуулга',
  satisfaction_tab: 'Сэтгэл ханамж',
  admin_tab: 'Админ',
  welcome_text: 'Асуулгыг эхлэхийн тулд оролцогчийн кодоо оруулна уу.',
  id_label: 'Оролцогчийн код',
  id_placeholder: 'Оролцогчийн кодоо оруулна уу',
  start_button: 'Асуулга эхлэх',
  next_button: 'Дараах',
  back_button: 'Буцах',
  continue_button: 'Хугацааны сонголт руу үргэлжлүүлэх',
  finish_button: 'Дуусгаж хадгалах',
  restart_button: 'Дахин эхлэх',
  progress_label: 'Асуултын дугаар',
  thank_you_title: 'Баярлалаа',
  thank_you_text: 'Таны хариултууд хадгалагдлаа.',
  time_taken_label: 'Зарцуулсан хугацаа (секунд)',
  validation_id: 'Оролцогчийн кодоо оруулна уу.',
  validation_answer: 'Үргэлжлүүлэхээсээ өмнө хариултаа сонгоно уу.',
  validation_specify: 'Дуусгахаасаа өмнө тайлбар хэсгийг бөглөнө үү.',
  risk_intro: 'Сугалааны сонголтын асуултуудад хариулна уу.',
  time_intro: 'Хугацааны сонголтын асуултуудад хариулна уу. Инфляци байхгүй гэж үзнэ үү.',
  risk_option_a: '50/50 магадлалтай сонголт',
  risk_option_b: 'Баталгаатай төлбөр',
  time_option_a: 'Өнөөдөр',
  time_option_b: '12 сарын дараа',
  module_risk: 'Сугалааны сонголт',
  module_time: 'Хугацааны сонголт',
  satisfaction_intro: 'Бүлгийн шийдвэрийн үр дүнгийн талаар дараах асуултуудад хариулна уу.',
  satisfaction_question: 'Та бүлгийн шийдвэрийн үр дүнд хэр сэтгэл ханамжтай байсан бэ?',
  satisfaction_left: '0 = Огт сэтгэл ханамжгүй',
  satisfaction_right: '10 = Маш сэтгэл ханамжтай',
  satisfaction_reason_satisfied: 'Та яагаад бүлгийн шийдвэрийн үр дүнд сэтгэл ханамжтай байсан бэ?',
  satisfaction_reason_neutral: 'Та яагаад бүлгийн шийдвэрийн үр дүнд сэтгэл ханамж дунд зэрэг байсан бэ?',
  satisfaction_reason_unsatisfied: 'Та яагаад бүлгийн шийдвэрийн үр дүнд сэтгэл ханамжгүй байсан бэ?',
  specify_label: 'Дэлгэрэнгүй бичнэ үү:',
  satisfaction_select_id: 'Оролцогчийн код сонгох',
  satisfaction_start: 'Сэтгэл ханамжийн асуулгыг эхлэх',
  satisfaction_no_ids: 'Одоогоор сэтгэл ханамжийн асуулгад хамрагдах боломжтой оролцогчийн код алга.',
  satisfaction_done: 'Сэтгэл ханамжийн хариулт хадгалагдлаа.',
  admin_title: 'Хадгалсан хариултууд',
  admin_refresh: 'Өгөгдлийг шинэчлэх',
  admin_download: 'CSV татах',
  admin_no_data: 'Одоогоор хариулт олдсонгүй.',
  decision_style_intro: 'Та ихэвчлэн шийдвэрээ хэрхэн гаргадаг талаар дараах асуултуудад хариулна уу.',
  decision_style_module: 'Шийдвэр гаргах хэв маяг'
};

function fmtMoney(x) { return 'MNT ' + x; }

function riskQuestionText(sureAmount) {
  return 'Та ' + fmtMoney('300K') +
    ' авах 50/50 магадлалтай сонголт ЭСВЭЛ ' +
    fmtMoney(sureAmount) +
    ' баталгаатай төлбөрөөс алийг нь сонгох вэ?';
}

function timeQuestionText(futureAmount) {
  return 'Та ноолуурын төлбөрөө зах зээлийн үнээр өнөөдөр шууд авах уу ЭСВЭЛ ' +
    futureAmount + ' 12 сарын дараа авах уу?';
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
  { id: 'T01', future: '50% илүү',  nextA: 'T02', nextB: 'T03', terminal: false },
  { id: 'T02', future: '85% илүү',  nextA: 'T04', nextB: 'T05', terminal: false },
  { id: 'T03', future: '25% илүү',  nextA: 'T06', nextB: 'T07', terminal: false },
  { id: 'T04', future: '100% илүү', nextA: 'T08', nextB: 'T09', terminal: false },
  { id: 'T05', future: '70% илүү',  nextA: 'T10', nextB: 'T11', terminal: false },
  { id: 'T06', future: '40% илүү',  nextA: 'T12', nextB: 'T13', terminal: false },
  { id: 'T07', future: '10% илүү',  nextA: 'T14', nextB: 'T15', terminal: false },
  { id: 'T08', future: '110% илүү', nextA: 'T16', nextB: 'T17', terminal: false },
  { id: 'T09', future: '90% илүү',  nextA: 'T18', nextB: 'T19', terminal: false },
  { id: 'T10', future: '80% илүү',  nextA: 'T20', nextB: 'T21', terminal: false },
  { id: 'T11', future: '60% илүү',  nextA: 'T22', nextB: 'T23', terminal: false },
  { id: 'T12', future: '45% илүү',  nextA: 'T24', nextB: 'T25', terminal: false },
  { id: 'T13', future: '30% илүү',  nextA: 'T26', nextB: 'T27', terminal: false },
  { id: 'T14', future: '20% илүү',  nextA: 'T28', nextB: 'T29', terminal: false },
  { id: 'T15', future: '5% илүү',   nextA: 'T30', nextB: 'T31', terminal: false },
  { id: 'T16', future: '115% илүү', nextA: null, nextB: null, terminal: true },
  { id: 'T17', future: '110% илүү', nextA: null, nextB: null, terminal: true },
  { id: 'T18', future: '100% илүү', nextA: null, nextB: null, terminal: true },
  { id: 'T19', future: '90% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T20', future: '80% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T21', future: '70% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T22', future: '65% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T23', future: '60% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T24', future: '50% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T25', future: '40% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T26', future: '35% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T27', future: '30% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T28', future: '20% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T29', future: '15% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T30', future: '10% илүү',  nextA: null, nextB: null, terminal: true },
  { id: 'T31', future: '5% илүү',   nextA: null, nextB: null, terminal: true },
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
  { id: 'D01', group: 'G1', col: 'rational_score',  text: 'Би мал аж ахуйтай холбоотой шийдвэр гаргахдаа өөрт байгаа мэдээлэл дээр үндэслэн гаргадаг.' },
  { id: 'D02', group: 'G1', col: 'rational_score',  text: 'Мал аж ахуйтай холбоотой шийдвэр гаргахдаа би бүх хувилбарыг бодож үзэж байгаад шийдвэрт хүрэх дуртай.' },
  { id: 'D03', group: 'G1', col: 'rational_score',  text: 'Мал аж ахуйтай холбоотой шийдвэр гаргахдаа би логиктой, системтэй байдлаар шийдвэр гаргадаг.' },
  { id: 'D04', group: 'G2', col: 'avoidant_score',   text: 'Би ерөнхийдөө мал аж ахуйтай холбоотой чухал шийдвэрүүдийг цаг нь тулахаар гаргадаг.' },
  { id: 'D05', group: 'G2', col: 'avoidant_score',   text: 'Боломжтой үедээ би мал аж ахуйтай холбоотой шийдвэр гаргахыг хойшлуулдаг.' },
  { id: 'D06', group: 'G2', col: 'avoidant_score',   text: 'Дарамт шахалт үүсэх хүртэл би мал аж ахуйтай холбоотой шийдвэр гаргахаас зайлсхийдэг.' },
  { id: 'D07', group: 'G3', col: 'dependent_score',   text: 'Мал аж ахуйтай холбоотой чухал шийдвэр гаргахад надад бусдын туслалцаа хэрэгтэй байдаг.' },
  { id: 'D08', group: 'G3', col: 'dependent_score',   text: 'Би бусадтай урьдчилан зөвлөлдөхгүйгээр мал аж ахуйтай холбоотой чухал шийдвэр гаргах нь ховор.' },
  { id: 'D09', group: 'G3', col: 'dependent_score',   text: 'Мал аж ахуйтай холбоотой төвөгтэй шийдвэртэй тулгарахад намайг нэг чиглүүлээд өгөх хүн хайдаг.' },
  { id: 'D10', group: 'G4', col: 'intuitive_score',   text: 'Мал аж ахуйтай холбоотой шийдвэр гаргахдаа би зөн совиндоо найддаг.' },
  { id: 'D11', group: 'G4', col: 'intuitive_score',   text: 'Мал аж ахуйтай холбоотой шийдвэр гаргахдаа тухайн шийдвэр надад зөв санагдах нь оновчтой шалтгаантай байхаас илүү чухал байдаг.' },
  { id: 'D12', group: 'G4', col: 'intuitive_score',   text: 'Мал аж ахуйтай холбоотой шийдвэр гаргахдаа би өөрийн мэдрэмж, зөн совиндоо тулгуурладаг.' },
];

const DECISION_GROUPS = ['G1', 'G2', 'G3', 'G4'];
const GROUP_COLORS = { G1: 'g1', G2: 'g2', G3: 'g3', G4: 'g4' };

const SATISFACTION_REASONS = {
  satisfied: [
    'Бүлгийн хариулт миний байр суурийг илэрхийлсэн учраас',
    'Нэгдсэн шийдвэрт хүрэх үйл явцад сэтгэл ханамжтай байсан учраас',
    'Хэлэлцүүлэгт оролцуулсанд сэтгэл ханамжтай байсан учраас'
  ],
  neutral: [
    'Бүлгийн хариулт миний байр суурийг илэрхийлсэн боловч зарим зүйл бүрэн нийцээгүй (тайлбарлана уу)',
    'Бүлгийн хариулт миний байр суурийг илэрхийлээгүй боловч би уг хариултыг хүлээн зөвшөөрсөн',
    'Би ярилцахад бэлэн байсан.'
  ],
  unsatisfied: [
    'Бүлгийн хариулт миний байр суурийг илэрхийлээгүй',
    'Бүлгийн хариулт миний байр суурийг зарим талаар илэрхийлсэн боловч миний үгийг хангалттай сонсоогүй',
    'Хэн нэгэн хэлэлцүүлгийг давамгайлсан тул би сэтгэл ханамжгүй байсан',
    'Өөр шалтгаан (тайлбарлана уу)'
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
  if (group === 'neutral' && choice.includes('(тайлбарлана уу)')) return true;
  if (group === 'unsatisfied' && choice === 'Өөр шалтгаан (тайлбарлана уу)') return true;
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
