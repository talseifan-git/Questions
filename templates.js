// ============================================================
// templates.js — 33 numeric question templates (GCT_0001..GCT_0033).
// Each template's .generate() returns a fresh randomized question.
// Loaded after questions.js; index.html reads window.QUESTION_TEMPLATES.
// Fixed questions live in questions.js (window.QUESTIONS).
//
// Helper functions below (rnd/rndInt/shuffle/fmtNum/buildOptions/genId) are
// shared by all templates in this file.
// ============================================================

// ---------------- Shared helpers ----------------
function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmtNum(v) {
  return String(Math.round(v));
}
// Builds a 4-option multiple choice set (letters א-ד) from a correct value
// and a list of candidate distractors. De-dupes distractors against each
// other and against the correct value, and pads with simple +/- offsets in
// the rare case fewer than 3 unique distractors survive de-duping.
function buildOptions(correct, distractors, formatFn) {
  const seen = new Set([correct]);
  const unique = [];
  distractors.forEach((d) => {
    if (!seen.has(d)) { seen.add(d); unique.push(d); }
  });
  let pad = 1;
  while (unique.length < 3 && pad <= 20) {
    for (const c of [correct + pad * 5, correct - pad * 5, correct + pad * 10, correct - pad * 10]) {
      if (unique.length >= 3) break;
      if (c > 0 && !seen.has(c)) { seen.add(c); unique.push(c); }
    }
    pad++;
  }
  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([correct, ...unique.slice(0, 3)]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = formatFn(v);
    if (v === correct) correctLetter = letters[i];
  });
  return { options, correctLetter };
}

// Unique id for a generated (runtime) question — not part of the QB_/GC_/GCT_ series.
function genId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// NUMERIC TEMPLATES
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: לחץ דם סיסטולי משוער בילד (טראומה) / סף תת-לחץ דם
// Formula: 70 + (2 × age), ages 1-10
// ------------------------------------------------------------
function generatePediatricSBPQuestion() {
  const age = rndInt(1, 10);
  const correct = 70 + 2 * age;

  // Common mistakes as distractors
  const forgotDouble = 70 + age;              // forgot to double the age
  const wrongBase90 = 90 + 2 * age;            // confused base constant
  const wrongMultiplier3 = 70 + age * 3;       // used ×3 instead of ×2

  const { options, correctLetter } = buildOptions(
    correct,
    [forgotDouble, wrongBase90, wrongMultiplier3],
    (v) => fmtNum(v) + ' מ"מ כספית'
  );

  return {
    id: genId('gen_pedsbp'),
    template: 'GCT_0007',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `ילד בן ${age} נפגע בתאונת דרכים. לפי הנוסחה המקובלת, מהו לחץ הדם הסיסטולי התקין המשוער עבורו?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `הנוסחה: לחץ דם סיסטולי משוער = 70 + (2 × גיל בשנים) = 70 + (2×${age}) = ${correct} מ"מ כספית. אותה נוסחה משמשת גם כסף לחשד לתת-לחץ דם בילדים בגילאי 1-10 (ערך מתחתיה = תת-לחץ דם). לשם השוואה, ספי תת-הלחץ בקבוצות הגיל האחרות: יילוד — סיסטולי מתחת ל-60; תינוק (חודש עד שנה) — מתחת ל-70; מעל גיל 10 — מתחת ל-90 (כמו במבוגר).`,
      wrong: `טעויות נפוצות: שכחת להכפיל את הגיל ב-2 לפני החיבור (מתקבל ${forgotDouble}), בלבול עם קבוע בסיס שגוי של 90 במקום 70 (מתקבל ${wrongBase90}), או שימוש במקדם שגוי של פי 3 במקום פי 2 (מתקבל ${wrongMultiplier3}).`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: דרגת הלם תת-נפחי (היפוולמי) לפי מדדים חיוניים
// Categorical lookup table (adult), 4 classes
// ------------------------------------------------------------
function generateHemorrhagicShockClassQuestion() {
  const classes = [
    { n: 1, loss: 'עד 750cc (עד 15% מנפח הדם)', pulse: 'תקין (60-100)', rr: 'תקין (12-20)', bp: 'תקין', pulseVal: 80, rrVal: 16 },
    { n: 2, loss: '750-1500cc (15-30% מנפח הדם)', pulse: '100-120', rr: '20-30', bp: 'תקין', pulseVal: 112, rrVal: 24 },
    { n: 3, loss: '1500-2000cc (30-40% מנפח הדם)', pulse: '120-140', rr: '30-40', bp: 'ירוד', pulseVal: 132, rrVal: 34 },
    { n: 4, loss: 'מעל 2000cc (מעל 40% מנפח הדם)', pulse: 'מעל 140', rr: 'מעל 35', bp: 'ירוד מאוד', pulseVal: 152, rrVal: 40 }
  ];
  const cls = rnd(classes);

  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle(classes);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((c, i) => {
    options[letters[i]] = `דרגה ${c.n} — איבוד ${c.loss}`;
    if (c.n === cls.n) correctLetter = letters[i];
  });

  return {
    id: genId('gen_hemclass'),
    template: 'GCT_0008',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `נפגע טראומה מבוגר מציג: דופק ${cls.pulseVal}, קצב נשימה ${cls.rrVal}, לחץ דם סיסטולי ${cls.bp}. באיזו דרגת הלם תת-נפחי (היפוולמי) הוא נמצא, ומהו טווח איבוד הדם המשוער?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `טבלת דרגות הלם תת-נפחי (מבוגר): דרגה 1 — עד 750cc (עד 15%), דופק תקין 60-100, נשימות תקינות 12-20, ל"ד תקין. דרגה 2 — 750-1500cc (15-30%), דופק 100-120, נשימות 20-30, ל"ד עדיין תקין. דרגה 3 — 1500-2000cc (30-40%), דופק 120-140, נשימות 30-40, ל"ד ירוד. דרגה 4 — מעל 2000cc (מעל 40%), דופק מעל 140, נשימות מעל 35, ל"ד ירוד מאוד. המדדים שבשאלה (דופק ${cls.pulseVal}, נשימות ${cls.rrVal}, ל"ד ${cls.bp}) נמצאים בתוך טווח דרגה ${cls.n} (דופק ${cls.pulse}, נשימות ${cls.rr}).`,
      wrong: `שאר האפשרויות מתארות דרגות הלם אחרות עם שילובי מדדים שונים — יש להתאים את כל שלושת המדדים (דופק, נשימות, ל"ד) יחד לדרגה הנכונה, לא להסתמך על מדד בודד. חשוב לזכור שהדופק הוא המדד הראשוני האמין ביותר בשטח — ל"ד עלול להישאר תקין עד דרגה מתקדמת יחסית.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: כלל התשיעיות בכוויות — אחוז שטח גוף כוי (TBSA%)
// ------------------------------------------------------------
function generateBurnBSAQuestion() {
  const regions = [
    { name: 'ראש', pct: 9 },
    { name: 'יד ימין', pct: 9 },
    { name: 'יד שמאל', pct: 9 },
    { name: 'חזה קדמי', pct: 9 },
    { name: 'בטן קדמית', pct: 9 },
    { name: 'גב עליון', pct: 9 },
    { name: 'גב תחתון ועכוז', pct: 9 },
    { name: 'רגל ימין', pct: 18 },
    { name: 'רגל שמאל', pct: 18 },
    { name: 'מפשעה/איברי מין', pct: 1 }
  ];
  const n = rndInt(2, 3);
  const chosen = shuffle(regions).slice(0, n);
  const correctPct = chosen.reduce((s, r) => s + r.pct, 0);
  const regionNames = chosen.map((r) => r.name).join(' + ');
  const breakdown = chosen.map((r) => `${r.name}=${r.pct}%`).join(', ');

  // Common mistakes as distractors
  const missedRegion = correctPct - 9;       // forgot one 9%-region
  const extraRegion = correctPct + 9;        // double-counted a 9%-region
  const doubled = correctPct * 2;            // doubled everything

  const { options, correctLetter } = buildOptions(
    correctPct,
    [missedRegion, extraRegion, doubled].filter((v) => v > 0),
    (v) => fmtNum(v) + '%'
  );

  return {
    id: genId('gen_burnbsa'),
    template: 'GCT_0009',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `נפגע כוויות מבוגר עם כוויות דרגה II-III באזורים הבאים: ${regionNames}. לפי כלל התשיעיות, מהו אחוז שטח הגוף הכוי (TBSA%) הכולל?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `כלל התשיעיות במבוגר: ראש 9%, כל יד 9%, חזה קדמי 9%, בטן קדמית 9%, גב עליון 9%, גב תחתון+עכוז 9%, כל רגל 18%, מפשעה/איברי מין 1%. באזורים שבשאלה: ${breakdown}. סה"כ = ${correctPct}%.`,
      wrong: `טעויות נפוצות: פספוס אזור אחד מתוך הרשימה (מחסיר 9%, מתקבל ${missedRegion > 0 ? missedRegion : '—'}%), ספירה כפולה של אזור בטעות (מוסיף 9%, מתקבל ${extraRegion}%), או הכפלת הסכום הכולל פי 2 בטעות (מתקבל ${doubled}%).`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: יחס עיסויים:הנשמות ב-BLS לפי גיל ומספר מטפלים
// Categorical lookup, must list ALL categories in explanation
// ------------------------------------------------------------
function generateCPRRatioQuestion() {
  const scenarios = [
    { label: 'מבוגר (בכל מספר מטפלים)', ratio: '30:2' },
    { label: 'ילד, מטפל יחיד', ratio: '30:2' },
    { label: 'ילד, זוג מטפלים', ratio: '15:2' },
    { label: 'תינוק, מטפל יחיד', ratio: '30:2' },
    { label: 'תינוק, זוג מטפלים', ratio: '15:2' },
    { label: 'יילוד (מטפל יחיד או זוג מטפלים)', ratio: '3:1' }
  ];
  const sc = rnd(scenarios);
  const allRealRatios = ['30:2', '15:2', '3:1'];
  const fakeRatio = '5:2'; // plausible-looking but not used anywhere in the protocol
  const distractors = allRealRatios.filter((r) => r !== sc.ratio).concat([fakeRatio]);

  const letters = ['א', 'ב', 'ג', 'ד'];
  const optsArr = shuffle([sc.ratio, ...distractors]);
  const options = {};
  let correctLetter = null;
  optsArr.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === sc.ratio) correctLetter = letters[i];
  });

  return {
    id: genId('gen_cprratio'),
    template: 'GCT_0020',
    qtype: ['numeric'],
    multi: false,
    section: 'החייאה',
    question: `מהו יחס עיסויים:הנשמות הנכון בהחייאת ${sc.label}?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `יחסי עיסויים:הנשמות לפי גיל ומספר מטפלים: מבוגר — 30:2 בכל מספר מטפלים. ילד — מטפל יחיד 30:2, זוג מטפלים 15:2. תינוק — מטפל יחיד 30:2, זוג מטפלים 15:2. יילוד — 3:1, גם במטפל יחיד וגם בזוג מטפלים (אם יש חשד לאטיולוגיה קרדיאלית ניתן לשקול 15:2 גם ביילוד). התרחיש שבשאלה (${sc.label}) מתאים ליחס ${sc.ratio}.`,
      wrong: `טעות נפוצה היא בלבול בין יחס מטפל-יחיד ליחס זוג-מטפלים בילד/תינוק (30:2 מול 15:2), או החלת יחס של מבוגר/ילד על יילוד במקום היחס הייחודי 3:1.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: מינון אדרנלין באנפילקסיס (מבוגר/ילד)
// ------------------------------------------------------------
function generateEpinephrineDoseQuestion() {
  const groups = [
    { label: 'מבוגר (מעל 30 ק"ג)', dose: 0.3 },
    { label: 'ילד (עד 30 ק"ג)', dose: 0.15 }
  ];
  const g = rnd(groups);
  const correct = g.dose;
  const distractors = [1, 0.5, 0.05].map((d) => Math.round((correct + (d - correct) * 0 + d) * 100) / 100);
  // build clearer, clinically-plausible distractors: swapped group dose, whole ampoule (1mg), tenfold error
  const otherGroupDose = groups.find((x) => x !== g).dose;
  const wholeAmpoule = 1;
  const tenfoldLow = correct / 10;
  const uniq = [otherGroupDose, wholeAmpoule, tenfoldLow].filter((v, i, a) => a.indexOf(v) === i && v !== correct);
  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([correct, ...uniq.slice(0, 3)]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v + ' מ"ג IM';
    if (v === correct) correctLetter = letters[i];
  });
  return {
    id: genId('gen_epidose'),
    template: 'GCT_0001',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `${g.label} עם אנפילקסיס מחייב הזרקת אדרנלין IM. מהו המינון הנכון (מתוך אמפולה בריכוז 1 מ"ג ב-1 מ"ל)?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `מינון אדרנלין באנפילקסיס: מבוגר (מעל 30 ק"ג) — 0.3 מ"ג IM; ילד (עד 30 ק"ג) — 0.15 מ"ג IM. האמפולה בריכוז 1 מ"ג ב-1 מ"ל. עבור "${g.label}" המינון הנכון הוא ${correct} מ"ג. ההזרקה בירך אנטרולטרלית, בזווית 90 מעלות לשריר.`,
      wrong: `טעויות נפוצות: בלבול בין מינון מבוגר לילד (${otherGroupDose} מ"ג), הזרקת האמפולה כולה ללא חישוב (1 מ"ג — פי כמה מהמינון הנדרש), או טעות עשרונית שמקטינה את המינון פי 10 (${tenfoldLow} מ"ג, מינון תת-טיפולי).`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: נפח נשימה בדקה (Minute Ventilation) = TV × קצב
// ------------------------------------------------------------
function generateMinuteVentilationQuestion() {
  const tv = rnd([400, 450, 500, 550, 600]);
  const rr = rndInt(10, 24);
  const correct = tv * rr;
  const forgotUnit = tv + rr; // nonsensical addition mistake
  const halved = Math.round(correct / 2);
  const doubled = correct * 2;
  const { options, correctLetter } = buildOptions(
    correct,
    [halved, doubled, forgotUnit].filter((v) => v > 0),
    (v) => fmtNum(v) + ' מ"ל/דקה'
  );
  return {
    id: genId('gen_minvent'),
    template: 'GCT_0024',
    qtype: ['numeric'],
    multi: false,
    section: 'אנטומיה ופיזיולוגיה',
    question: `מטופל נושם בנפח מתחלף (Tidal Volume) של ${tv} מ"ל, בקצב ${rr} נשימות לדקה. מהו נפח הנשימה בדקה (Minute Ventilation)?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `נפח נשימה בדקה = נפח מתחלף (Tidal Volume) × קצב נשימה לדקה = ${tv} × ${rr} = ${correct} מ"ל/דקה. נפח מתחלף תקין במבוגר הוא כ-500 מ"ל, ונפח הריאות הכולל כ-6 ליטר; נפח מת (אוויר שאינו מגיע לחילוף גזים) הוא כ-150 מ"ל.`,
      wrong: `טעויות נפוצות: חיבור השני ערכים במקום הכפלתם (${forgotUnit} מ"ל/דקה — חסר משמעות פיזיולוגית), או טעות בסדר גודל שמכפילה/מחצה את התוצאה הנכונה (${halved} או ${doubled}).`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: הערכת נפח דם משוער לפי משקל ומין/גיל
// ------------------------------------------------------------
function generateBloodVolumeQuestion() {
  const groups = [
    { label: 'גבר מבוגר', factor: 75, unit: 'ק"ג' },
    { label: 'אישה מבוגרת', factor: 65, unit: 'ק"ג' },
    { label: 'תינוק', factor: 85, unit: 'ק"ג' }
  ];
  const g = rnd(groups);
  const weight = g.label === 'תינוק' ? rndInt(4, 10) : rndInt(50, 100);
  const correct = weight * g.factor;
  const wrongFactorMap = groups.filter((x) => x !== g).map((x) => weight * x.factor);
  const { options, correctLetter } = buildOptions(
    correct,
    wrongFactorMap,
    (v) => fmtNum(v) + ' מ"ל'
  );
  return {
    id: genId('gen_bloodvol'),
    template: 'GCT_0025',
    qtype: ['numeric'],
    multi: false,
    section: 'אנטומיה ופיזיולוגיה',
    question: `מהו נפח הדם המשוער עבור ${g.label} במשקל ${weight} ${g.unit}?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `נוסחת הערכת נפח דם לפי משקל: גבר — משקל × 75, אישה — משקל × 65, תינוק — משקל × 85 (מ"ל). עבור ${g.label} במשקל ${weight} ק"ג: ${weight} × ${g.factor} = ${correct} מ"ל. באופן כללי, נפח הדם במבוגר הוא כ-5-6 ליטר.`,
      wrong: `הטעות השכיחה היא שימוש במקדם של קבוצה אחרת (למשל מקדם גבר במקום אישה, או להפך) — יש להתאים את המקדם למין/גיל המדויק שבשאלה.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: תפוקת לב = נפח פעימה × קצב לב
// ------------------------------------------------------------
function generateCardiacOutputQuestion() {
  const sv = rnd([60, 65, 70, 75, 80]);
  const hr = rndInt(55, 110);
  const correctMl = sv * hr;
  const correctL = Math.round((correctMl / 1000) * 10) / 10;
  const halved = Math.round((correctL / 2) * 10) / 10;
  const doubled = Math.round(correctL * 2 * 10) / 10;
  const offByOne = Math.round((correctL + 1) * 10) / 10;
  const { options, correctLetter } = buildOptions(
    correctL,
    [halved, doubled, offByOne],
    (v) => v.toFixed(1) + ' ליטר/דקה'
  );
  return {
    id: genId('gen_co'),
    template: 'GCT_0026',
    qtype: ['numeric'],
    multi: false,
    section: 'אנטומיה ופיזיולוגיה',
    question: `לב פועם בקצב ${hr} פעימות לדקה, כאשר נפח הפעימה (Stroke Volume) הוא ${sv}cc. מהי תפוקת הלב (Cardiac Output) בליטר לדקה, בקירוב?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `תפוקת לב = נפח פעימה × קצב לב. ${sv}cc × ${hr} = ${correctMl}cc לדקה, כלומר כ-${correctL.toFixed(1)} ליטר/דקה. נפח פעימה תקין הוא כ-70cc, ודופק תקין במבוגר 60-100 לדקה.`,
      wrong: `טעויות נפוצות: חישוב חצי מהתוצאה (בלבול ביחידות סיסטולה/דיאסטולה), הכפלה כפולה בטעות, או תוספת/גריעה שרירותית של כליטר אחד לתוצאה הנכונה.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: ציון APGAR — סכימת 5 מדדים
// ------------------------------------------------------------
function generateApgarQuestion() {
  const categories = [
    { name: 'Appearance (צבע)', scores: ['כחול/חיוור (0)', 'גוף ורוד, גפיים כחולות (1)', 'ורוד לגמרי (2)'] },
    { name: 'Pulse (דופק)', scores: ['אין (0)', 'מתחת ל-100 (1)', 'מעל 100 (2)'] },
    { name: 'Grimace (תגובה לגירוי)', scores: ['ללא תגובה (0)', 'נסיגה/העוויה (1)', 'בכי/תגובה אקטיבית (2)'] },
    { name: 'Activity (טונוס)', scores: ['רפוי (0)', 'מעט גמישות (1)', 'תנועה פעילה (2)'] },
    { name: 'Respiration (נשימה)', scores: ['אין (0)', 'בכי חלש/איטית (1)', 'בכי רגיל/תקינה (2)'] }
  ];
  const picks = categories.map((c) => rndInt(0, 2));
  const correct = picks.reduce((s, v) => s + v, 0);
  // Description WITHOUT the numeric score shown to the student in the question
  // (the student must derive the 0/1/2 value from the clinical description).
  const stripScore = (s) => s.replace(/\s*\(\d\)\s*$/, '');
  const desc = categories.map((c, i) => `${c.name}: ${stripScore(c.scores[picks[i]])}`).join('; ');
  // Full description WITH the numeric score, used only in the explanation (after answering).
  const descWithScores = categories.map((c, i) => `${c.name}: ${c.scores[picks[i]]}`).join('; ');
  const offByOneUp = Math.min(correct + 1, 10);
  const offByOneDown = Math.max(correct - 1, 0);
  const halved = Math.round(correct / 2);
  const { options, correctLetter } = buildOptions(
    correct,
    [offByOneUp, offByOneDown, halved].filter((v) => v !== correct),
    (v) => fmtNum(v)
  );
  return {
    id: genId('gen_apgar'),
    template: 'GCT_0031',
    qtype: ['numeric'],
    multi: false,
    section: 'לידה וגניקולוגיה',
    question: `ילוד נבדק בדקה הראשונה לאחר הלידה: ${desc}. מהו ציון האפגר הכולל?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `ציון אפגר הוא סכום 5 מדדים, כל אחד מנוקד 0-2: Appearance (צבע), Pulse (דופק), Grimace (תגובה לגירוי), Activity (טונוס), Respiration (נשימה). סכימת המדדים בתרחיש: ${descWithScores}. הסכום הכולל: ${picks.join(' + ')} = ${correct} מתוך 10. הציון נמדד בדקה 1 ובדקה 5 לאחר הלידה.`,
      wrong: `טעויות נפוצות: פספוס אחד המדדים בסכימה (מתקבל ${offByOneDown} או ${offByOneUp}), או חלוקת הסכום ב-2 בטעות (מתקבל ${halved}) — יש לסכום את חמשת המדדים במלואם, לא לממש אותם.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: נפח בולוס נוזלים לפי משקל/תרחיש
// ------------------------------------------------------------
function generateFluidBolusQuestion() {
  const scenarios = [
    { label: 'ילד/תינוק, מטופל כללי (לא-טראומה) לא-יציב', perKg: 20, adultFixed: null },
    { label: 'ילד/תינוק, טראומה עם ל"ד נמוך לגילו', perKg: 20, adultFixed: null },
    { label: 'ילד/תינוק, כוויות', perKg: 20, adultFixed: null }
  ];
  const sc = rnd(scenarios);
  const weight = rndInt(10, 35);
  const correct = weight * sc.perKg;
  const forgot = weight + sc.perKg;
  const halved = Math.round(correct / 2);
  const doubled = correct * 2;
  const { options, correctLetter } = buildOptions(
    correct,
    [halved, doubled, forgot].filter((v) => v > 0),
    (v) => fmtNum(v) + 'cc'
  );
  return {
    id: genId('gen_fluidbolus'),
    template: 'GCT_0002',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `${sc.label}, במשקל ${weight} ק"ג, מחייב מתן נוזלים לפי פרוטוקול מד"א. מהו נפח הבולוס הנכון?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `מינוני נוזלים במד"א לפי תרחיש: חולה כללי — מבוגר 500cc הזלפה מהירה, ילד/תינוק 20cc/ק"ג. טראומה (ל"ד<90 מבוגר / <70 ילד) — מבוגר 250cc, ילד/תינוק 20cc/ק"ג. כוויות — 20cc/ק"ג במהלך הפינוי. מכת חום — מבוגר מנות חוזרות 500cc עד תפוקת שתן, ילד בולוסים חוזרים 20cc/ק"ג. עבור ${sc.label} במשקל ${weight} ק"ג: ${weight} × 20 = ${correct}cc. חשוב: הנוזלים ניתנים רק ע"י מי שהוסמך, ורק במהלך הפינוי — לעולם לא לעכב פינוי לצורך עירוי.`,
      wrong: `טעויות נפוצות: חלוקת התוצאה ב-2 (${halved}cc), הכפלתה פי 2 (${doubled}cc), או חיבור המשקל למקדם במקום הכפלתם (${forgot}cc — חסר משמעות קלינית).`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: סף חמצן/הנשמה לפי סטורציה וקצב נשימה
// ------------------------------------------------------------
function generateOxygenThresholdQuestion() {
  const cases = [
    { label: 'סטורציה 90%, נשימות 16/דקה, ללא מצוקה', action: 'מתן חמצן (סטורציה מתחת ל-92%)' },
    { label: 'סטורציה 96%, נשימות 26/דקה עם מצוקה נשימתית', action: 'מתן חמצן (נשימה מעל 20 עם מצוקה נשימתית, גם אם הסטורציה תקינה)' },
    { label: 'סטורציה 98%, נשימות 16/דקה, ללא מצוקה', action: 'אין צורך בחמצן — המדדים תקינים' },
    { label: 'סטורציה 94%, נשימות 6/דקה', action: 'הנשמה מסייעת (ברדיפניאה משמעותית, לא רק חמצן)' }
  ];
  const c = rnd(cases);
  const others = cases.filter((x) => x !== c).map((x) => x.action);
  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([c.action, ...others]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === c.action) correctLetter = letters[i];
  });
  return {
    id: genId('gen_o2threshold'),
    template: 'GCT_0003',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `מטופל עם חשד ACS מציג: ${c.label}. מה הפעולה הנכונה מבחינת חמצן/הנשמה?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `כללי מתן חמצן בחשד ACS: יעד סטורציה 94-96%. לתת חמצן כאשר סטורציה מתחת ל-92%, או כאשר קצב נשימה מעל 20/דקה או מתחת ל-12/דקה בשילוב עם מצוקה נשימתית. ברדיפניאה משמעותית (למשל 6/דקה) מחייבת הנשמה מסייעת, לא חמצן פסיבי בלבד. ערכי ייחוס לסטורציה: בריא מעל 95%, חולה COPD יציב 88-92%, היפוקסיה 85-94%, היפוקסיה חמורה מתחת ל-85%. סטורציה אינה אמינה במצבי אסתמה, הרעלות, היפותרמיה או לק ציפורניים. במקרה שבשאלה (${c.label}): ${c.action}.`,
      wrong: `שאר האפשרויות מתאימות לתרחישים אחרים בטבלה — יש להתאים את הפעולה גם לערך הסטורציה וגם לקצב/מאמץ הנשימה יחד, לא להסתמך על מדד בודד. סטורציה תקינה לכשעצמה אינה שוללת צורך בחמצן אם קצב הנשימה חריג ויש מצוקה נשימתית.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: לחץ על דיסק בגב תחתון לפי תנוחת הרמה
// ------------------------------------------------------------
function generateSpinalLoadQuestion() {
  const postures = [
    { label: 'שכיבה', pct: 25 },
    { label: 'עמידה', pct: 100 },
    { label: 'ישיבה זקופה', pct: 140 },
    { label: 'ישיבה כפופה', pct: 190 },
    { label: 'כיפוף גב בעמידה (הרמה שגויה)', pct: 300 }
  ];
  const p = rnd(postures);
  const others = postures.filter((x) => x !== p).map((x) => x.pct);
  const { options, correctLetter } = buildOptions(
    p.pct,
    shuffle(others).slice(0, 3),
    (v) => v + '%'
  );
  const table = postures.map((x) => `${x.label}=${x.pct}%`).join(', ');
  return {
    id: genId('gen_spinalload'),
    template: 'GCT_0033',
    qtype: ['numeric'],
    multi: false,
    section: 'עבודת הצוות',
    question: `כמה אחוזים מהעומס הבסיסי (ביחס לעמידה=100%) מופעלים על הדיסק בגב התחתון בתנוחת "${p.label}"?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `לחץ על הדיסק בגב התחתון לפי תנוחה (ביחס לעמידה=100%): ${table}. כיפוף הגב בעמידה בעת הרמה מייצר את העומס הגבוה ביותר — פי 3 מעמידה רגילה — ולכן הטכניקה הנכונה להרמה היא כיפוף ברכיים, הוצאת האגן לאחור ושמירה על גב זקוף. עבור "${p.label}" הערך הנכון הוא ${p.pct}%.`,
      wrong: `שאר האפשרויות משקפות עומס בתנוחות אחרות — יש לזכור את סדר העומס העולה: שכיבה < עמידה < ישיבה זקופה < ישיבה כפופה < כיפוף גב בעמידה, ולא להתבלבל בין הערכים.`
    },
  };
}

// ============================================================
// Registry of numeric templates
// ============================================================
// Each entry's qtype mirrors exactly what its generate() function always
// returns (every numeric template here is qtype: ['numeric']) — kept here as
// static metadata so the UI can count reachable questions per qtype without
// having to call generate() just to inspect the type.

// ------------------------------------------------------------
// TEMPLATE: משך זמן עבודה של מיכל חמצן (ציוד רפואי)
// Formula: minutes = (PSI / 15) x volume(L) / flow(LPM)
// Cylinders: H = 20 L (fixed), D = 2.4 L (portable)
// ------------------------------------------------------------
function generateOxygenDurationQuestion() {
  const tanks = [
    { name: 'נייד (מיכל D)', vol: 2.4 },
    { name: 'נייח (מיכל H)', vol: 20 }
  ];
  const tank = rnd(tanks);
  const psi = rnd([750, 900, 1200, 1350, 1500, 1800, 2000, 2200, 3000]);
  const flow = rnd([6, 8, 10, 12, 15]);

  const atm = psi / 15;
  const correct = Math.round((atm * tank.vol) / flow);

  // Common mistakes
  const forgotDivide15 = Math.round((psi * tank.vol) / flow); // שכח לחלק ב-15
  const wrongTankVol = Math.round(
    (atm * (tank.vol === 2.4 ? 20 : 2.4)) / flow            // בלבל בין נייד לנייח
  );
  const forgotFlow = Math.round(atm * tank.vol);             // שכח לחלק בקצב הזרימה

  const { options, correctLetter } = buildOptions(
    correct,
    [forgotDivide15, wrongTankVol, forgotFlow],
    (v) => fmtNum(v) + ' דקות'
  );

  const rows = tanks
    .map((t) => `${t.name} — נפח ${t.vol} ליטר → (${psi}÷15) × ${t.vol} ÷ ${flow} = ${Math.round((atm * t.vol) / flow)} דקות`)
    .join('; ');

  return {
    id: genId('gen_o2dur'),
    template: 'GCT_0032',
    qtype: ['numeric'],
    multi: false,
    section: 'ציוד רפואי',
    question: `לרשותך מיכל חמצן ${tank.name} בלחץ של ${psi} PSI. לכמה זמן עבודה יספיק המיכל בקצב זרימה של ${flow} LPM?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `הנוסחה: משך השימוש (דקות) = (לחץ ב-ATM × נפח המיכל בליטרים) ÷ קצב הזרימה (LPM), כאשר לחץ ב-ATM = PSI ÷ 15. כאן: (${psi}÷15) × ${tank.vol} ÷ ${flow} = ${correct} דקות. לשם השוואה, באותו לחץ ובאותו קצב זרימה בשני סוגי המיכלים שבאמבולנס: ${rows}.`,
      wrong: `טעויות נפוצות: שכחת לחלק את ה-PSI ב-15 להמרה ל-ATM (מתקבל ${forgotDivide15} דקות); בלבול בין נפח המיכל הנייד (2.4 ליטר) לנייח (20 ליטר) (מתקבל ${wrongTankVol} דקות); ושכחת לחלק בקצב הזרימה (מתקבל ${forgotFlow} דקות).`
    }
  };
}

// ============================================================
// TEMPLATE REGISTRY (ordered by section)
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: אנרגיה קינטית בקינמטיקה של טראומה
// Formula: KE = (מסה ÷ 2) × מהירות², מהירות במטר/שנייה
// ------------------------------------------------------------
function generateKineticEnergyQuestion() {
  const mass = rndInt(50, 100);
  const kmh = rnd([30, 40, 50, 60, 70, 80]);
  const v = Math.round(kmh / 3.6);
  const correct = Math.round((mass / 2) * v * v);

  const forgotSquare = Math.round((mass / 2) * v);     // שכח להעלות בריבוע
  const forgotHalf = mass * v * v;                      // שכח לחלק את המסה ב-2
  const usedKmh = Math.round((mass / 2) * kmh * kmh);   // הציב קמ"ש במקום מ/ש

  const { options, correctLetter } = buildOptions(
    correct,
    [forgotHalf, usedKmh, forgotSquare],
    (x) => fmtNum(x) + ' ג\'אול'
  );
  return {
    id: genId('gen_kinetic'),
    template: 'GCT_0010',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `נוסע במשקל ${mass} ק"ג נמצא ברכב הנוסע במהירות ${kmh} קמ"ש. מהי האנרגיה הקינטית המשוחררת לעברו בהתנגשות? (המר את המהירות למטר/שנייה ועגל למספר השלם הקרוב לפני החישוב)`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `הנוסחה: KE = (מסה ÷ 2) × מהירות², כשהמהירות במטר/שנייה. כאן: ${kmh} קמ"ש ÷ 3.6 ≈ ${v} מ/ש, ולכן (${mass} ÷ 2) × ${v}² = ${correct} ג'אול. שלוש דוגמאות הייחוס מהחומר, שמראות איזה משתנה באמת קובע: 60 ק"ג ב-40 קמ"ש ≈ 3,630 ג'אול; 80 ק"ג ב-40 קמ"ש ≈ 4,840 ג'אול (תוספת של 33% במסה מוסיפה 33% לאנרגיה); 60 ק"ג ב-50 קמ"ש ≈ 5,880 ג'אול (תוספת של 25% במהירות מוסיפה 62% לאנרגיה). המסקנה הקלינית: **המהירות היא המשתנה המשמעותי ביותר** משום שהיא עולה בריבוע — ולכן שאלת "מה הייתה המהירות" בזירה חשובה יותר משאלת משקל הנוסע.`,
      wrong: `טעויות נפוצות: שכחה להעלות את המהירות בריבוע ולהכפיל רק במהירות (מתקבל ${forgotSquare} ג'אול); שכחה לחלק את המסה ב-2 (מתקבל ${forgotHalf} ג'אול); והצבת המהירות בקמ"ש במקום להמיר למטר/שנייה (מתקבל ${usedKmh} ג'אול — סדר גודל מנופח פי 13 בערך).`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: חישוב לחץ דופק מתוך מדידת לחץ דם
// ------------------------------------------------------------
function generatePulsePressureQuestion() {
  const pp = rnd([18, 22, 26, 34, 40, 48, 55, 66, 72]);
  const dia = rndInt(50, 88);
  const sys = dia + pp;
  const correct = pp;

  const sumMistake = sys + dia;                          // חיבר במקום להחסיר
  const sysOnly = sys;                                   // נקב בסיסטולי
  const mapMistake = Math.round((sys + 2 * dia) / 3);    // חישב לחץ עורקי ממוצע

  const { options, correctLetter } = buildOptions(
    correct,
    [sumMistake, sysOnly, mapMistake],
    (x) => fmtNum(x) + ' mmHg'
  );
  const status = pp < 30 ? 'מתחת לטווח התקין (מצומצם)' :
                 pp > 60 ? 'מעל הטווח התקין' : 'בתוך הטווח התקין';
  return {
    id: genId('gen_pulsepressure'),
    template: 'GCT_0004',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `נמדד למטופל מבוגר לחץ דם של ${sys}/${dia} mmHg. מהו לחץ הדופק?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `לחץ הדופק הוא ההפרש בין הסיסטולי לדיאסטולי: ${sys} − ${dia} = ${correct} mmHg — ${status}. הטווח התקין ללחץ דופק הוא 30-60 mmHg. ערכי לחץ דם תקינים לפי קבוצת גיל (סיסטולי/דיאסטולי, mmHg): יילוד 60-90/30-55; תינוק 70-110/35-60; ילד 80-115/25-85; מבוגר 90-140/60-90. ספי תת-לחץ דם סיסטולי: יילוד מתחת ל-60, תינוק מתחת ל-70, ילד בן 1-10 מתחת ל-(גיל×2)+70, ומעל גיל 10 מתחת ל-90. המשמעות הקלינית: בהלם תת-נפחי לחץ הדופק **מצטמצם** — הדיאסטולי עולה יחסית עקב כיווץ כלי דם היקפי בעוד הסיסטולי נשמר עדיין תקין, ולכן צמצום לחץ הדופק הוא סימן מוקדם יותר מירידת הסיסטולי. עם זאת, המדד הראשוני האמין ביותר בשטח להערכת חומרת ההלם הוא הדופק, לא לחץ הדם.`,
      wrong: `טעויות נפוצות: חיבור הסיסטולי לדיאסטולי במקום החסרתם (מתקבל ${sumMistake} mmHg); נקיבת הערך הסיסטולי עצמו כאילו הוא לחץ הדופק (${sysOnly} mmHg); וחישוב לחץ עורקי ממוצע לפי (סיסטולי + 2×דיאסטולי) ÷ 3 (מתקבל ${mapMistake} mmHg) — מדד אחר לגמרי, שאינו לחץ הדופק.`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: מינון מידזולם בילד לפי משקל (פרוטוקול הרעלות בשגרה)
// ------------------------------------------------------------
function generateMidazolamPediatricQuestion() {
  const weight = rndInt(8, 45);
  const correct = weight;                       // עשיריות מ"ג: 0.1 מ"ג/ק"ג × משקל × 10
  const adultFixed = 50;                        // 5 מ"ג — מנת המבוגר הקבועה
  const doubled = weight * 2;                   // 0.2 מ"ג/ק"ג
  const tenthOff = Math.max(1, Math.round(weight / 10)); // 0.01 מ"ג/ק"ג — פספוס נקודה עשרונית

  const { options, correctLetter } = buildOptions(
    correct,
    [adultFixed, doubled, tenthOff],
    (x) => (x / 10).toFixed(1) + ' מ"ג'
  );
  return {
    id: genId('gen_midazolampeds'),
    template: 'GCT_0015',
    qtype: ['numeric'],
    multi: false,
    section: 'פגיעות סביבתיות',
    question: `ילד במשקל ${weight} ק"ג מפרכס במסגרת הרעלה, ונדרש מתן מידזולם לפי פרוטוקול ההרעלות בשגרה. מהי המנה?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `מינון המידזולם בילדים הוא 0.1 מ"ג/ק"ג, כלומר ${weight} × 0.1 = ${(correct / 10).toFixed(1)} מ"ג, וניתן לחזור עליו פעם נוספת לאחר 5 דקות. מינוני התרופות בפרוטוקול ההרעלות בשגרה במלואם: **מידזולם** (IN/IM/IV/IO) — מבוגרים 5 מ"ג למנה, חזרה כל 5 דקות עד מינון מקסימלי של 0.1 מ"ג/ק"ג; ילדים 0.1 מ"ג/ק"ג, חזרה אחת נוספת לאחר 5 דקות. **אטרופין** (IM/IV/IO) — מבוגרים 1-2 מ"ג בנפגע בינוני ו-2-4 מ"ג בנפגע קשה; ילדים 0.02-0.05 מ"ג/ק"ג לפי חומרת התסמינים, חזרה כל 5 דקות עד אטרופיניזציה (ייבוש הפרשות ברונכיאליות), **ללא מינון מקסימלי** בהרעלת זרחנים אורגניים או קרבמטים. **בירידת לחץ דם** — מבוגרים בולוסים חוזרים של 500 סמ"ק סליין, ילדים 20 סמ"ק/ק"ג. **ב-torsade de pointes** — מגנזיום סולפט: מבוגרים 2 גרם מהולים ב-20 סמ"ק D5W תוך 10-15 דקות, ילדים 50 מ"ג/ק"ג מהולים ב-10 סמ"ק D5W.`,
      wrong: `טעויות נפוצות: מתן מנת המבוגר הקבועה (5.0 מ"ג) לילד — המבוגר מקבל מנה קבועה, הילד מנה לפי משקל; הכפלת המקדם ל-0.2 מ"ג/ק"ג (מתקבל ${(doubled / 10).toFixed(1)} מ"ג) — 0.1 מ"ג/ק"ג הוא גם מנת הילד וגם התקרה במבוגר; והחלקה של נקודה עשרונית ל-0.01 מ"ג/ק"ג (מתקבל ${(tenthOff / 10).toFixed(1)} מ"ג) — מנת חסר שלא תעצור פרכוס.`
    }
  };
}

// ============================================================
// NUMERIC TEMPLATES (batch 02)
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: ערכים תקינים לפי קבוצת גיל (נשימות/דופק/ל"ד)
// ------------------------------------------------------------
function generateVitalsByAgeGroupQuestion() {
  const groups = [
    { name: 'יילוד (עד 28 יום)', rr: '40-60', hr: '100-160', sbp: '60-90', dbp: '30-55' },
    { name: 'תינוק (עד שנה)', rr: '20-30', hr: '110-170', sbp: '70-110', dbp: '35-60' },
    { name: 'ילד', rr: '20-30', hr: '60-130', sbp: '80-115', dbp: '25-85' },
    { name: 'מבוגר', rr: '12-20', hr: '60-100', sbp: '90-140', dbp: '60-90' }
  ];
  const measures = [
    { key: 'rr', label: 'קצב הנשימות (נשימות בדקה)' },
    { key: 'hr', label: 'קצב הלב (פעימות בדקה)' },
    { key: 'sbp', label: 'לחץ הדם הסיסטולי (מ"מ כספית)' },
    { key: 'dbp', label: 'לחץ הדם הדיאסטולי (מ"מ כספית)' }
  ];
  const ag = rnd(groups);
  const ms = rnd(measures);
  const correctText = ag[ms.key];

  const sameMeasureOtherAges = groups.filter((g) => g.name !== ag.name).map((g) => g[ms.key]);
  const otherMeasuresSameAge = measures.filter((m) => m.key !== ms.key).map((m) => ag[m.key]);
  const candidates = shuffle(sameMeasureOtherAges).concat(shuffle(otherMeasuresSameAge));

  const seen = new Set([correctText]);
  const distractors = [];
  candidates.forEach((v) => {
    if (distractors.length < 3 && !seen.has(v)) { seen.add(v); distractors.push(v); }
  });

  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([correctText].concat(distractors));
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === correctText) correctLetter = letters[i];
  });

  const line = (k) => groups.map((g) => g.name + ' ' + g[k]).join(', ');

  return {
    id: genId('gen_vitalsage'),
    template: 'GCT_0027',
    qtype: ['numeric'],
    multi: false,
    section: 'אנטומיה ופיזיולוגיה',
    question: `מהו הטווח התקין של ${ms.label} עבור ${ag.name}?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `הטווח התקין של ${ms.label} עבור ${ag.name} הוא ${correctText}. טבלת הערכים התקינים המלאה — קצב נשימות בדקה: ${line('rr')}. קצב לב בדקה: ${line('hr')}. ל"ד סיסטולי: ${line('sbp')}. ל"ד דיאסטולי: ${line('dbp')}. (בילד 20-30 נשימות בגיל 3 ו-12-25 בגיל 8; בפג הדופק 100-180.) ספי תת-לחץ דם סיסטולי: יילוד מתחת ל-60, תינוק (חודש-שנה) מתחת ל-70, גיל 1-10 מתחת ל-(גיל×2)+70, ומעל גיל 10 מתחת ל-90. מילוי קפילרי תקין עד 2 שניות (אינו מדויק בקור ובקשישים), וחום גוף תקין 36-37.5°C.`,
      wrong: `שתי טעויות מייצרות את שאר האפשרויות. הראשונה — לקיחת אותו מדד מקבוצת גיל שכנה: ככל שהגיל צעיר יותר קצב הלב והנשימה גבוהים יותר ולחץ הדם נמוך יותר, ולכן ערך של קבוצה סמוכה נראה סביר אך שגוי. השנייה — בלבול בין המדדים בתוך אותה קבוצת גיל, למשל שימוש בטווח הדופק כתשובה על קצב הנשימות. בשאלה זו הטווח הנכון הוא ${correctText}.`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: אחוז שטח גוף כוי לפי קבוצת גיל (חלוקה קדמי/אחורי)
// ------------------------------------------------------------
function generateBSAByAgeGroupQuestion() {
  const tables = [
    { name: 'מבוגר', regions: [
      { label: 'ראש קדמי', pct: 4.5 }, { label: 'ראש אחורי', pct: 4.5 },
      { label: 'גו קדמי', pct: 18 }, { label: 'גו אחורי', pct: 18 },
      { label: 'יד ימין קדמי', pct: 4.5 }, { label: 'יד שמאל אחורי', pct: 4.5 },
      { label: 'רגל ימין קדמי', pct: 9 }, { label: 'רגל שמאל אחורי', pct: 9 }] },
    { name: 'ילד', regions: [
      { label: 'ראש קדמי', pct: 7 }, { label: 'ראש אחורי', pct: 7 },
      { label: 'גו קדמי', pct: 18 }, { label: 'גו אחורי', pct: 18 },
      { label: 'יד ימין קדמי', pct: 4.5 }, { label: 'יד שמאל אחורי', pct: 4.5 },
      { label: 'רגל ימין קדמי', pct: 8 }, { label: 'רגל שמאל אחורי', pct: 8 }] },
    { name: 'תינוק', regions: [
      { label: 'ראש קדמי', pct: 9 }, { label: 'ראש אחורי', pct: 9 },
      { label: 'גו קדמי', pct: 18 }, { label: 'גו אחורי', pct: 13 },
      { label: 'יד ימין קדמי', pct: 4.5 }, { label: 'יד שמאל אחורי', pct: 4.5 },
      { label: 'רגל ימין קדמי', pct: 7 }, { label: 'רגל שמאל אחורי', pct: 7 }] }
  ];
  const t = rnd(tables);
  const n = rndInt(2, 3);
  const chosen = shuffle(t.regions).slice(0, n);
  const labels = chosen.map((r) => r.label);
  const correct = Math.round(chosen.reduce((s, r) => s + r.pct, 0) * 10) / 10;
  const breakdown = chosen.map((r) => `${r.label}=${r.pct}%`).join(', ');

  const byOtherTable = tables.filter((x) => x.name !== t.name).map((x) =>
    Math.round(labels.reduce((s, lb) => {
      const r = x.regions.find((rr) => rr.label === lb);
      return s + (r ? r.pct : 0);
    }, 0) * 10) / 10);
  const halved = Math.round(correct / 2 * 10) / 10;
  const doubled = Math.round(correct * 2 * 10) / 10;

  const { options, correctLetter } = buildOptions(
    correct,
    byOtherTable.concat([doubled, halved]).filter((v) => v > 0),
    (v) => (Math.round(v * 10) / 10) + '%'
  );

  const tableLine = (x) => x.name + ': ' + x.regions.map((r) => r.label + ' ' + r.pct + '%').join(', ');

  return {
    id: genId('gen_bsabyage'),
    template: 'GCT_0011',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `נפגע כוויות מקבוצת הגיל "${t.name}" נכווה בדרגה II ומעלה באזורים הבאים: ${labels.join(' + ')}. מהו אחוז שטח הגוף הכוי (TBSA%) הכולל, לפי חלוקת קדמי/אחורי?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `חישוב שטח הכוויה בחלוקה קדמי/אחורי משתנה בין קבוצות הגיל — ${tableLine(tables[0])}; אברי מין 1%. ${tableLine(tables[1])}. ${tableLine(tables[2])}; עכוז 2.5% לכל צד. ההבדלים המהותיים: הראש תופס אחוז גדול יותר ככל שהנפגע צעיר יותר (4.5% במבוגר, 7% בילד, 9% בתינוק) והרגליים אחוז קטן יותר (9% במבוגר, 8% בילד, 7% בתינוק), והגו האחורי בתינוק הוא 13% ולא 18%. בשאלה זו (${t.name}): ${breakdown} — סה"כ ${correct}%. שיטת התשיעיות ושיטת "כף היד" רלוונטיות לכוויות מדרגה שנייה ומעלה בלבד. מינון הנוזלים בכוויות: סליין 20cc/ק"ג במהלך הפינוי, ובילדים ההתוויה היא כוויה מדרגה II ומעלה בהיקף מעל 10%.`,
      wrong: `הטעות השכיחה ביותר היא החלת טבלת גיל שגויה על אותם אזורים — למשל שימוש בערכי המבוגר עבור תינוק, המחסיר 4.5% לכל משטח ראש ומוסיף 2% לכל משטח רגל. טעויות נוספות: הכפלת הסכום פי 2 (${doubled}%), מתוך בלבול בין חישוב קדמי/אחורי לחישוב של איבר שלם; או חלוקתו ב-2 (${halved}%), מתוך הנחה שגויה שהערך שבטבלה מתייחס כבר לשני צידי האיבר יחד.`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: לחץ מוחלט בעומק צלילה
// ------------------------------------------------------------
function generateDivingPressureQuestion() {
  const depth = rndInt(1, 6) * 10;
  const correct = 1 + depth / 10;
  const forgotSurface = depth / 10;
  const perMeter = depth + 1;
  const halfRate = 1 + depth / 20;

  const { options, correctLetter } = buildOptions(
    correct,
    [forgotSurface, perMeter, halfRate].filter((v) => v > 0),
    (v) => (Math.round(v * 10) / 10) + ' אטמוספרות'
  );

  const rows = [10, 20, 30, 40, 50, 60].map((d) => d + ' מ\' = ' + (1 + d / 10) + ' ATM').join(', ');

  return {
    id: genId('gen_divepressure'),
    template: 'GCT_0016',
    qtype: ['numeric'],
    multi: false,
    section: 'פגיעות סביבתיות',
    question: `צולל נמצא בעומק של ${depth} מטר מתחת לפני המים. מהו הלחץ המוחלט הפועל עליו?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `בגובה פני הים הלחץ הוא אטמוספרה אחת, ובכל ירידה של 10 מטר לעומק הלחץ עולה באטמוספרה נוספת — ולכן הלחץ המוחלט = 1 + (העומק ÷ 10). בעומק ${depth} מטר: 1 + (${depth} ÷ 10) = ${correct} אטמוספרות. טבלת הלחצים לפי עומק: ${rows}. יחידות מקבילות: 1 ATM = 1 kg/cm² = 14.7 PSI = 1 BAR = 760 mmHg. מכאן נגזרות הפגיעות: בהעמקה נפח חללי האוויר קטן והצפיפות עולה (מעיכות אוזן, מסכה וסינוסים), ובעלייה הנפח גדל — ולכן צולל שאינו נושף עלול להגיע לקרע ריאות, ובעלייה מהירה מדי מתפתחת מחלת דקומפרסיה.`,
      wrong: `טעויות נפוצות: שכחת אטמוספרת פני הים וחישוב העומק בלבד (מתקבל ${Math.round(forgotSurface * 10) / 10} אטמוספרות); חישוב של אטמוספרה לכל מטר במקום לכל 10 מטר (מתקבל ${perMeter} אטמוספרות); וחישוב של אטמוספרה לכל 20 מטר (מתקבל ${Math.round(halfRate * 10) / 10} אטמוספרות).`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: סיווג תגובת דחק לפי הזמן שחלף מהאירוע
// ------------------------------------------------------------
function generateStressReactionStageQuestion() {
  const cases = [
    { label: 'כ-5 שעות', answer: 'תגובת דחק חריפה (ASR) — שעות ועד 3 ימים; חולפת תוך 72 שעות ונחשבת תקינה' },
    { label: 'כ-30 שעות', answer: 'תגובת דחק חריפה (ASR) — שעות ועד 3 ימים; חולפת תוך 72 שעות ונחשבת תקינה' },
    { label: 'כ-5 ימים', answer: 'הפרעת דחק חריפה (ASD) — מ-72 שעות ועד חודש מהחשיפה' },
    { label: 'כשבועיים', answer: 'הפרעת דחק חריפה (ASD) — מ-72 שעות ועד חודש מהחשיפה' },
    { label: 'כחודשיים', answer: 'הפרעה בתר-חבלתית (PTSD) — מעל חודש; עד 3 חודשים מוגדרת Acute PTSD' },
    { label: 'כחצי שנה', answer: 'הפרעה בתר-חבלתית (PTSD) — מעל 3 חודשים מוגדרת Chronic PTSD' }
  ];
  const c = rnd(cases);
  const seen = new Set([c.answer]);
  const distractors = [];
  shuffle(cases).forEach((x) => {
    if (distractors.length < 3 && !seen.has(x.answer)) { seen.add(x.answer); distractors.push(x.answer); }
  });

  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([c.answer].concat(distractors));
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === c.answer) correctLetter = letters[i];
  });

  return {
    id: genId('gen_stressstage'),
    template: 'GCT_0029',
    qtype: ['numeric'],
    multi: false,
    section: 'עזרה ראשונה נפשית וחוסן',
    question: `אדם נחשף לאירוע טראומטי, ומאז חלפו ${c.label}. הוא ממשיך להציג תסמיני דחק. כיצד מסווגת התגובה בשלב זה?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `שלבי תגובת הדחק לפי הזמן שחלף מהחשיפה: תגובת דחק חריפה (ASR — Acute Stress Reaction) — תגובה נורמלית לאירוע טראומטי ("הלם", ניתוק, קושי להגיב לסביבה), בטווח של שעות ועד 3 ימים; תגובה החולפת תוך 72 שעות נחשבת תקינה ולא פתולוגית. הפרעת דחק חריפה (ASD — Acute Stress Disorder) — תגובה שכבר מוגדרת כהפרעה, מ-72 שעות ועד חודש מהחשיפה. הפרעה בתר-חבלתית (PTSD) — ממשיכה מעבר לחודש; Acute PTSD עד 3 חודשים, Chronic PTSD מעל 3 חודשים, וייתכן גם Late Onset שנים לאחר האירוע. במקרה שבשאלה (${c.label} מהאירוע): ${c.answer}. חשוב לזכור שהתגובה השכיחה לאירוע טראומטי היא התפתחות חוסן ולא הפרעה פוסט-טראומטית, ושארבע קטגוריות התסמינים ב-PTSD הן חודרנות, הימנעות, עוררות יתר ודיכאון/פגיעה קוגניטיבית.`,
      wrong: `הטעות המרכזית היא ערבוב בין גבולות הזמן: 72 שעות מפרידות בין ASR (תגובה נורמלית) ל-ASD (הפרעה), וחודש מפריד בין ASD ל-PTSD — סיווג מוקדם מדי הופך תגובה נורמלית להפרעה, וסיווג מאוחר מדי מחמיץ הפרעה שכבר התגבשה. טעות נוספת היא ערבוב בין החלוקה הפנימית של PTSD (Acute עד 3 חודשים מול Chronic מעל 3 חודשים) לבין הגבול שבין ASD ל-PTSD, שהוא חודש מהחשיפה.`
    }
  };
}

// ------------------------------------------------------------
// TEMPLATE: ספי אזהרה במדדים חיוניים (מבוגר, סבב ראשוני)
// ------------------------------------------------------------
function generateWarningThresholdsQuestion() {
  const items = [
    { label: 'נשימה איטית (ברדיפניאה)', dir: 'מתחת ל-', val: 10, unit: 'נשימות בדקה', wrong: [8, 12, 6] },
    { label: 'נשימה מהירה (טכיפניאה)', dir: 'מעל ', val: 20, unit: 'נשימות בדקה', wrong: [30, 24, 12] },
    { label: 'דופק מהיר (טכיקרדיה)', dir: 'מעל ', val: 100, unit: 'פעימות בדקה', wrong: [120, 110, 90] },
    { label: 'דופק איטי (ברדיקרדיה)', dir: 'מתחת ל-', val: 60, unit: 'פעימות בדקה', wrong: [50, 40, 70] }
  ];
  const it = rnd(items);

  const { options, correctLetter } = buildOptions(
    it.val,
    it.wrong,
    (v) => it.dir + fmtNum(v) + ' ' + it.unit
  );

  return {
    id: genId('gen_warnthresh'),
    template: 'GCT_0005',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `בזיהוי מצב דחוף/מסכן חיים במטופל מבוגר (לא-טראומה), מהו סף האזהרה ל${it.label}?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `סף האזהרה ל${it.label} הוא ${it.dir}${it.val} ${it.unit}. ספי האזהרה המלאים לזיהוי מצב דחוף במבוגר (מודול 4): נשימה — העדר נשימה, איטית מתחת ל-10 בדקה, מהירה מעל 20 בדקה, או מצוקה נשימתית ניכרת; דופק — לא נמוש או נמוש חלש, מהיר מעל 100 בדקה, איטי מתחת ל-60 בדקה, או מילוי קפילרי איטי (מעל 2 שניות); הכרה — מעורפלת או חוסר הכרה; נתיב אוויר — חסימה או איום; התרשמות כללית — אי-שקט, חיוורון, כיחלון, הזעה מרובה.`,
      wrong: `הדיסטרקטורים מתבססים על ספים אמיתיים אחרים שקל להתבלבל ביניהם: בפרוטוקול "פצוע דחוף" בטראומה הספים שונים — טכיפניאה מעל 30 בדקה, ברדיפניאה מתחת ל-8 בדקה, וטכיקרדיה מעל 120 בדקה. הסף של 8 נשימות בדקה הוא גם הסף למעבר להנשמה מסייעת במפוח, והסף של 20 נשימות בדקה הוא הסף למתן חמצן במסכת העשרה — אלה ספי טיפול, לא בהכרח ספי האזהרה שנשאלו כאן.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: חישוב דופק מספירה של 15 שניות + השוואה לטווח לפי גיל
// ------------------------------------------------------------
function generatePulseCount15sQuestion() {
  const groups = [
    { label: 'יילוד (עד 28 יום)', lo: 100, hi: 160 },
    { label: 'תינוק (עד שנה)', lo: 110, hi: 170 },
    { label: 'ילד', lo: 60, hi: 130 },
    { label: 'מבוגר', lo: 60, hi: 100 }
  ];
  const g = rnd(groups);
  const n = rndInt(Math.ceil((g.lo - 12) / 4), Math.floor((g.hi + 12) / 4));
  const correct = n * 4;
  const inRange = correct >= g.lo && correct <= g.hi;

  const { options, correctLetter } = buildOptions(
    correct,
    [n * 3, n * 2, n],
    (v) => fmtNum(v) + ' פעימות בדקה'
  );

  return {
    id: genId('gen_pulse15s'),
    template: 'GCT_0006',
    qtype: ['numeric'],
    multi: false,
    section: 'הטיפול בחולה',
    question: `בשלב C של הסבב הראשוני מדדת דופק ל${g.label} וספרת ${n} פעימות במשך 15 שניות. מהו הדופק לדקה?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `בדיקת דופק מבוצעת ב-2-3 אצבעות (לא באגודל) במשך 15 שניות, והתוצאה מוכפלת ב-4: ${n} × 4 = ${correct} פעימות בדקה. אם הדופק אינו סדיר — יש למדוד דקה מלאה. ${correct} ${inRange ? 'נמצא בתוך' : 'נמצא מחוץ ל'}טווח התקין עבור ${g.label} (${g.lo}-${g.hi}). טווחי דופק תקינים לפי גיל: פג 100-180, יילוד 100-160, תינוק 110-170, ילד 60-130, מבוגר 60-100. דופק מרכזי נבדק בקרוטיד (ילד/מבוגר) או בברכיאלי (תינוק); דופק פריפרי — רדיאלי, dorsalis pedis, posterior tibial. דופק מרכזי לא נמוש = דום לב.`,
      wrong: `הכפלה ב-3 (מתקבל ${n * 3}) מתאימה לספירה של 20 שניות ולא 15. הכפלה ב-2 (מתקבל ${n * 2}) מתאימה לספירה של 30 שניות. דיווח המספר הנספר כפי שהוא (${n}) מדלג לגמרי על ההמרה לדקה ומוביל להערכת חסר חמורה של הדופק.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: כלל התשיעיות בילדים ובתינוקות (שונה מהמבוגר)
// ------------------------------------------------------------
function generatePediatricBurnBSAQuestion() {
  const pops = [
    {
      label: 'ילד', regions: [
        { name: 'הראש כולו (קדמי ואחורי)', pct: 14, adult: 9 },
        { name: 'הגו הקדמי', pct: 18, adult: 18 },
        { name: 'הגו האחורי', pct: 18, adult: 18 },
        { name: 'יד שלמה אחת', pct: 9, adult: 9 },
        { name: 'רגל שלמה אחת', pct: 16, adult: 18 }
      ]
    },
    {
      label: 'תינוק', regions: [
        { name: 'הראש כולו (קדמי ואחורי)', pct: 18, adult: 9 },
        { name: 'הגו הקדמי', pct: 18, adult: 18 },
        { name: 'הגו האחורי', pct: 13, adult: 18 },
        { name: 'יד שלמה אחת', pct: 9, adult: 9 },
        { name: 'רגל שלמה אחת', pct: 14, adult: 18 }
      ]
    }
  ];
  const pop = rnd(pops);
  const picked = shuffle(pop.regions).slice(0, 2);
  const correct = picked.reduce((s, r) => s + r.pct, 0);
  const adultSum = picked.reduce((s, r) => s + r.adult, 0);
  const names = picked.map((r) => r.name).join(' ו');

  const reasons = {};
  reasons[adultSum] = `${adultSum}% מתקבל מחישוב לפי ערכי המבוגר במקום לפי הגיל — הטעות השכיחה ביותר; היא מזלזלת בשטח הראש בילד ובתינוק ומנפחת את שטח הרגליים`;
  reasons[correct + 9] = `${correct + 9}% מתקבל מהוספת יד שלמה מיותרת לחישוב`;
  reasons[correct - 9] = `${correct - 9}% מתקבל מהחסרת יד שלמה — בדרך כלל דילוג על אחד האזורים שנשאלו`;
  reasons[Math.round(correct / 2)] = `${Math.round(correct / 2)}% מתקבל מספירת הצד הקדמי בלבד של האזורים במקום האזור כולו`;

  const cand = [adultSum, correct + 9, correct - 9, Math.round(correct / 2)]
    .filter((v) => v > 0 && v !== correct);

  const { options, correctLetter } = buildOptions(correct, cand, (v) => fmtNum(v) + '%');

  const shownWrong = Object.keys(options)
    .filter((k) => k !== correctLetter)
    .map((k) => parseInt(options[k], 10))
    .map((v) => reasons[v] || `${v}% אינו מתקבל מאף צירוף תקין של אזורי הגוף בגיל זה`)
    .join('. ');

  return {
    id: genId('gen_pedburn'),
    template: 'GCT_0012',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `${pop.label} נכווה בכוויות דרגה II-III ב${names}. לפי שיטת התשיעיות המותאמת לגילו, מהו אחוז שטח הגוף הכווי?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `עבור ${pop.label} הסכום הוא ${picked.map((r) => r.name + ' ' + r.pct + '%').join(' + ')} = ${correct}%. שיטת התשיעיות אינה זהה בכל הגילאים, וזהו לב העניין. מבוגר (קדמי/אחורי): ראש 4.5%/4.5%, גו 18%/18%, כל יד 4.5%/4.5%, כל רגל 9%/9%, אברי מין 1%. ילדים: ראש 7%/7%, גו 18%/18%, כל יד 4.5%/4.5%, כל רגל 8%/8%. תינוקות: ראש 9%/9%, גו 18% קדמי ו-13% אחורי, עכוז 2.5% לכל צד, כל יד 4.5%/4.5%, כל רגל 7%/7%. ההיגיון: ככל שהגיל צעיר יותר הראש תופס חלק גדול יותר משטח הגוף והגפיים התחתונות חלק קטן יותר. השיטה חלה על כוויות מדרגה שנייה ומעלה בלבד; בכוויות מפוזרות ניתן להיעזר בשיטת "כף היד".`,
      wrong: `${shownWrong}.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: מרחק הנחת חסם עורקים
// ------------------------------------------------------------
function generateTourniquetDistanceQuestion() {
  const cases = [
    {
      scen: 'שטף דם פורץ מאמצע הזרוע, ללא מעורבות מפרק',
      correct: 'כ-5 ס"מ מעל מקור הדימום',
      rule: 'ככלל, החסם מונח כ-5 ס"מ מעל מקור הדימום'
    },
    {
      scen: 'פגיעה מדממת המערבת את מפרק הברך',
      correct: '5-10 ס"מ מעל המפרק',
      rule: 'כשהפגיעה מערבת מפרק, החסם מונח 5-10 ס"מ מעל המפרק'
    }
  ];
  const c = rnd(cases);
  const pool = [
    'כ-5 ס"מ מעל מקור הדימום',
    '5-10 ס"מ מעל המפרק',
    'ישירות על מקור הדימום',
    'כ-20 ס"מ מעל מקור הדימום',
    'על המפרק עצמו',
    'כמה שיותר קרוב לגו, בשורש הגפה'
  ];
  const distractors = shuffle(pool.filter((p) => p !== c.correct)).slice(0, 3);
  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([c.correct, ...distractors]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === c.correct) correctLetter = letters[i];
  });

  return {
    id: genId('gen_tqdist'),
    template: 'GCT_0013',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `הוחלט להניח חסם עורקים לנפגע עם ${c.scen}. היכן יש להניח את החסם?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `${c.rule}. שני כללי המרחק יחד: דימום בגפה ללא מעורבות מפרק — כ-5 ס"מ מעל מקור הדימום; פגיעה המערבת מפרק — 5-10 ס"מ מעל המפרק. דגשים נוספים: ככלל אין להניח חסם על בגד או על מפרק, למעט סכנת חיים מיידית או חושך; יש לרשום את שעת ההנחה ב-3-4 ספרות על מקום בולט (מצח, בית החזה); המרת חסם עורקים תבוצע רק ע"י מטפל ברמת ALS (פראמדיק או רופא).`,
      wrong: `הנחה ישירות על מקור הדימום או על המפרק עצמו אינה חוסמת את זרימת הדם ביעילות — החסם חייב ללחוץ על עורק כנגד עצם ארוכה, וזה אינו מתאפשר מעל מפרק או מעל פצע פתוח. מרחק גדול מדי (כ-20 ס"מ או שורש הגפה) מקריב שלא לצורך רקמה חיה מעל הפגיעה; "כמה שיותר קרוב לגו" הוא כלל של חסם עורקים טקטי בשדה קרב ולא הכלל הפרוטוקולי במד"א.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: מרכיבי הדם באחוזים
// ------------------------------------------------------------
function generateBloodCompositionQuestion() {
  const items = [
    { q: 'מהו אחוז הפלסמה מנפח הדם?', val: 55, wrong: [45, 90, 60] },
    { q: 'מהו אחוז החלק התאי מנפח הדם?', val: 45, wrong: [55, 35, 60] },
    { q: 'מהו אחוז המים מתוך הפלסמה?', val: 90, wrong: [55, 45, 60] },
    { q: 'מהו אחוז המונוציטים מתוך תאי הדם הלבנים?', val: 60, wrong: [35, 5, 45] },
    { q: 'מהו אחוז הלימפוציטים מתוך תאי הדם הלבנים?', val: 35, wrong: [60, 5, 45] },
    { q: 'מהו אחוז הגרנולוציטים מתוך תאי הדם הלבנים?', val: 5, wrong: [35, 60, 45] }
  ];
  const it = rnd(items);

  const { options, correctLetter } = buildOptions(it.val, it.wrong, (v) => fmtNum(v) + '%');

  return {
    id: genId('gen_bloodcomp'),
    template: 'GCT_0028',
    qtype: ['numeric'],
    multi: false,
    section: 'אנטומיה ופיזיולוגיה',
    question: it.q,
    options,
    correct: correctLetter,
    explanation: {
      correct: `התשובה היא ${it.val}%. הרכב הדם במלואו: פלסמה 55% מנפח הדם, וחלק תאי 45%. הפלסמה עצמה בנויה מ-90% מים ובנוסף חלבונים, גלוקוז, ליפידים, חומצות אמינו, הורמונים וגורמי קרישה. החלק התאי כולל כדוריות אדומות (RBC — הובלת O2 ו-CO2 באמצעות המוגלובין), כדוריות לבנות (WBC — מערכת החיסון) וטסיות (קרישה). התפלגות תאי הדם הלבנים: מונוציטים 60%, לימפוציטים 35%, גרנולוציטים 5%. לשם השלמה: המטוקריט הוא אחוז נפח הכדוריות האדומות מנפח הדם, ונפח הדם הכולל במבוגר הוא כ-5-6 ליטר (גבר: משקל×75, אישה: משקל×65, תינוק: משקל×85).`,
      wrong: `הדיסטרקטורים הם אחוזים אמיתיים אחרים מאותה מערכת — היפוך בין הפלסמה (55%) לחלק התאי (45%), בלבול בין אחוז המים בפלסמה (90%) לאחוז הפלסמה מהדם (55%), והחלפה בין מונוציטים (60%) ללימפוציטים (35%) בתוך התפלגות תאי הדם הלבנים. הטעות הנפוצה היא לזכור את הזוג המספרי הנכון אך לשייך אותו למרכיב הלא נכון.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: המרות יחידות קרינה
// ------------------------------------------------------------
function generateRadiationUnitsQuestion() {
  const convs = [
    { from: 'גריי (Gy)', to: 'ראד (rad)', f: 100, unit: 'ראד' },
    { from: 'ראד (rad)', to: 'מילי-ראד (mrad)', f: 1000, unit: 'מילי-ראד' },
    { from: 'סיוורט (Sv)', to: 'רם (rem)', f: 100, unit: 'רם' },
    { from: 'רם (rem)', to: 'מילי-סיוורט (mSv)', f: 10, unit: 'מילי-סיוורט' }
  ];
  const c = rnd(convs);
  const x = rnd([2, 4, 5, 10, 20]);
  const correct = x * c.f;

  const cand = [x * c.f * 10, Math.round(x * c.f / 10), x, Math.round(x * c.f / 100)]
    .filter((v) => v > 0 && v !== correct);

  const { options, correctLetter } = buildOptions(correct, cand, (v) => fmtNum(v) + ' ' + c.unit);

  return {
    id: genId('gen_radunits'),
    template: 'GCT_0018',
    qtype: ['numeric'],
    multi: false,
    section: 'מענה מד"א בשעת חירום',
    question: `באירוע קרינה מדווח על מנה של ${x} ${c.from}. לכמה ${c.to} הדבר שקול?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `${x} ${c.from} × ${c.f} = ${correct} ${c.unit}. מערכת ההמרות המלאה: מנת הקרינה הנספגת נמדדת בראד — 1 גריי (Gy) = 100 ראד, ו-1 ראד = 1000 מילי-ראד (mrad). הנזק הביולוגי נמדד ברם — 100 רם = 1 סיוורט (Sv), 1 רם = 1000 מילי-רם (mrem), ו-1 רם = 10 מילי-סיוורט (mSv). ההבדל המהותי בין השתיים: הראד מודד כמה אנרגיה נספגה בחומר ואינו מתחשב בהבדלי ההשפעה הביולוגית בין סוגי קרינה; הרם מודד את הנזק הביולוגי בפועל לגוף האדם ומשקלל גם את המנה הנספגת וגם את סוג הקרינה.`,
      wrong: `סטייה של פי 10 לכל כיוון היא הטעות השכיחה — ערבוב בין מקדם 100 (גריי↔ראד, סיוורט↔רם) למקדם 1000 (ראד↔מילי-ראד, רם↔מילי-רם) ולמקדם 10 (רם↔מילי-סיוורט). ערך הזהה למספר שבשאלה מתקבל כששוכחים להמיר בכלל ומדווחים את המספר ביחידה שגויה — טעות מסוכנת במיוחד בדיווח מנת קרינה.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: תוקף מיכל חמצן לפי הבדיקה ההידרוסטטית
// ------------------------------------------------------------
function generateOxygenCylinderValidityQuestion() {
  const stamped = rndInt(2016, 2024);
  const correct = stamped + 5;

  const { options, correctLetter } = buildOptions(
    correct,
    [stamped + 1, stamped + 10, stamped + 3],
    (v) => 'שנת ' + fmtNum(v)
  );

  return {
    id: genId('gen_o2valid'),
    template: 'GCT_0030',
    qtype: ['numeric'],
    multi: false,
    section: 'אג"ם ונהלים',
    question: `בבדיקת ציוד בתחילת משמרת אתה מוצא על מיכל חמצן תאריך בדיקה הידרוסטטית מוטבע משנת ${stamped}. עד איזו שנה המיכל תקף לשימוש מבחינת הבדיקה ההידרוסטטית?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `בדיקה הידרוסטטית למיכל חמצן נדרשת אחת ל-5 שנים, ולכן מיכל שנבדק בשנת ${stamped} תקף עד שנת ${correct}. תאריך הבדיקה האחרון מוטבע על גוף המיכל ויש לוודא שלא חלפו 5 שנים ממנו. שני תוקפים נפרדים שאסור לבלבל ביניהם: תוקף הבדיקה ההידרוסטטית של המיכל — 5 שנים; ותוקף החמצן בתוך המיכל המלא — עד שנה אחת בלבד. מיכל שפג תוקפו יוצא משימוש מיידית ומועבר לאגף אפסנאות. דגשים נוספים: מילוי רק עד ללחץ המקסימלי המוטבע על המיכל; לפני כל מילוי יש לוודא תוקף, היעדר חבלות חיצוניות ותקינות ברז; חל איסור מוחלט לכתוב על המיכל בטוש או להדביק מדבקה מכל סוג על הברז; ולעולם אין לאלתר בשימוש בחמצן.`,
      wrong: `${stamped + 1} מתקבל מהחלפת תוקף הבדיקה ההידרוסטטית (5 שנים) בתוקף החמצן שבתוך המיכל (שנה) — שני נתונים נכונים שמתייחסים לדברים שונים. ${stamped + 10} מתקבל מהכפלת התקופה. ${stamped + 3} אינו מבוסס על אף תקופה בנוהל ומייצג ניחוש של "כמה שנים בערך".`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: ריכוז החמצן המסופק לפי אמצעי המתן (טבלת ההעשרה)
// ------------------------------------------------------------
function generateOxygenEnrichmentQuestion() {
  const devices = [
    { name: 'מסכת העשרה עם שקית מאגר ושסתומים', flow: '10-15 LPM', pct: '90-100%' },
    { name: 'מפוח הנשמה למבוגר עם שקית מאגר', flow: '10-15 LPM', pct: '90-100%' },
    { name: 'מפוח הנשמה למבוגר ללא שקית מאגר', flow: '10-15 LPM', pct: '40-60%' },
    { name: 'מפוח הנשמה לתינוק', flow: '10 LPM', pct: '90-100%' }
  ];
  const d = rnd(devices);
  const pool = ['90-100%', '40-60%', '21% (אוויר חדר בלבד)', '70-80%', '30-40%'];
  const distractors = shuffle(pool.filter((p) => p !== d.pct)).slice(0, 3);

  const letters = ['א', 'ב', 'ג', 'ד'];
  const shuffled = shuffle([d.pct, ...distractors]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === d.pct) correctLetter = letters[i];
  });

  return {
    id: genId('gen_o2enrich'),
    template: 'GCT_0021',
    qtype: ['numeric'],
    multi: false,
    section: 'החייאה',
    question: `אתה מספק חמצן באמצעות ${d.name} בקצב זרימה של ${d.flow}. מהו ריכוז החמצן המסופק למטופל?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `${d.name} בזרימה של ${d.flow} מספק ${d.pct} חמצן. טבלת ההעשרה המלאה: מסכה עם שקית מאגר ושסתומים — 10-15 LPM, 90-100%; מפוח למבוגר עם שקית מאגר — 10-15 LPM, 90-100%; מפוח למבוגר ללא שקית מאגר — 10-15 LPM, 40-60%; מפוח לתינוק — 10 LPM, 90-100%. כלומר שקית המאגר היא שקובעת בפועל את ריכוז החמצן במפוח למבוגר: אותו מפוח, באותו קצב זרימה, מספק 40-60% בלבד ללא שקית ו-90-100% איתה. התוויות למתן חמצן: מצבי חירום נשימתיים, מצבי חירום לבביים, חוסר הכרה, תת-לחץ דם או פרפוזיה לקויה, טראומה ודימומים, דום נשימה ודום לב. הכלל: בכל ספק האם לתת חמצן — לספק חמצן. יש לבדוק את כמות החמצן במיכל בתחילת כל משמרת ולאחר כל שימוש.`,
      wrong: `21% הוא ריכוז החמצן באוויר החדר, כלומר מצב שבו לא סופק חמצן משלים כלל — אף אמצעי בטבלה אינו מספק ריכוז זה. 70-80% ו-30-40% הם ערכי ביניים שאינם מוגדרים לאף אחד מהאמצעים בתקן מד"א. הבלבול האמיתי והשכיח הוא בין 90-100% ל-40-60%, והוא נובע משכחת שקית המאגר או מהנחה שגויה שקצב הזרימה לבדו קובע את הריכוז.`
    },
  };
}

// ============================================================
// TEMPLATE REGISTRY (ordered by section)
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: ספי אזהרה במדדים חיוניים (מבוגר, סבב ראשוני)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: חישוב דופק מספירה של 15 שניות + השוואה לטווח לפי גיל
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: כלל התשיעיות בילדים ובתינוקות (שונה מהמבוגר)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: מרחק הנחת חסם עורקים
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: מרכיבי הדם באחוזים
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: המרות יחידות קרינה
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: תוקף מיכל חמצן לפי הבדיקה ההידרוסטטית
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: ריכוז החמצן המסופק לפי אמצעי המתן (טבלת ההעשרה)
// ------------------------------------------------------------

// ============================================================
// NUMERIC TEMPLATES (batch 02)
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: ערכים תקינים לפי קבוצת גיל (נשימות/דופק/ל"ד)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: אחוז שטח גוף כוי לפי קבוצת גיל (חלוקה קדמי/אחורי)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: לחץ מוחלט בעומק צלילה
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: סיווג תגובת דחק לפי הזמן שחלף מהאירוע
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: אנרגיה קינטית בקינמטיקה של טראומה
// Formula: KE = (מסה ÷ 2) × מהירות², מהירות במטר/שנייה
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: חישוב לחץ דופק מתוך מדידת לחץ דם
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: מינון מידזולם בילד לפי משקל (פרוטוקול הרעלות בשגרה)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: מינון מזרק אטרופין אוטומטי (TA) לפי גיל — שדה
// ------------------------------------------------------------

// ============================================================
// NUMERIC TEMPLATES (batch 02)
// ============================================================

// ------------------------------------------------------------
// TEMPLATE: ערכים תקינים לפי קבוצת גיל (נשימות/דופק/ל"ד)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: אחוז שטח גוף כוי לפי קבוצת גיל (חלוקה קדמי/אחורי)
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: לחץ מוחלט בעומק צלילה
// ------------------------------------------------------------

// ------------------------------------------------------------
// TEMPLATE: סיווג תגובת דחק לפי הזמן שחלף מהאירוע
// ------------------------------------------------------------

// ============================================================
// TEMPLATE REGISTRY (ordered by section)
// ============================================================

// ============================================================
// NUMERIC TEMPLATES — batch 01
// ============================================================

// Builds an options object (letters א-ד) from textual answers.
// Used by templates whose answer is a lookup/decision string rather than
// a single number, where buildOptions (numeric de-duping) does not apply.
function buildTextOptions(correctText, distractorTexts) {
  const letters = ['א', 'ב', 'ג', 'ד'];
  const seen = new Set([correctText]);
  const unique = [];
  distractorTexts.forEach((d) => {
    if (!seen.has(d)) { seen.add(d); unique.push(d); }
  });
  const shuffled = shuffle([correctText, ...unique.slice(0, 3)]);
  const options = {};
  let correctLetter = null;
  shuffled.forEach((v, i) => {
    options[letters[i]] = v;
    if (v === correctText) correctLetter = letters[i];
  });
  return { options, correctLetter };
}

// ------------------------------------------------------------
// TEMPLATE: קריטריוני "פצוע דחוף" בילד — ספי קצב נשימה ודופק
// ------------------------------------------------------------
function generatePediatricUrgentCriteriaQuestion() {
  const age = rndInt(2, 12);
  const rr = rnd([6, 7, 12, 18, 24, 32, 36, 40]);
  const hr = rnd([70, 90, 100, 115, 126, 140, 150]);
  const rrFlag = rr > 30 || rr < 8;
  const hrFlag = hr > 120;

  const optRR = 'פצוע דחוף — בשל קצב הנשימה בלבד';
  const optHR = 'פצוע דחוף — בשל הדופק בלבד';
  const optBoth = 'פצוע דחוף — בשל קצב הנשימה וגם בשל הדופק';
  const optNone = 'אינו עומד בקריטריון של קצב הנשימה או של הדופק (ייתכן שיוגדר דחוף מסיבה אחרת)';

  let correctText;
  if (rrFlag && hrFlag) correctText = optBoth;
  else if (rrFlag) correctText = optRR;
  else if (hrFlag) correctText = optHR;
  else correctText = optNone;

  const { options, correctLetter } = buildTextOptions(
    correctText,
    [optRR, optHR, optBoth, optNone].filter((t) => t !== correctText)
  );

  return {
    id: genId('gen_pedurgent'),
    template: 'GCT_0014',
    qtype: ['numeric'],
    multi: false,
    section: 'טראומה',
    question: `ילד בן ${age} לאחר חבלה. במדידות חוזרות: ${rr} נשימות בדקה, דופק ${hr} לדקה. כיצד יסווג לפי ספי המדדים בקריטריוני "פצוע דחוף"?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `ספי המדדים בקריטריוני "פצוע דחוף" בילד: טכיפניאה — מעל 30 נשימות בדקה; ברדיפניאה — מתחת ל-8 נשימות בדקה; טכיקרדיה — מעל 120 לדקה במדידות חוזרות. במקרה זה: קצב נשימה ${rr} — ${rrFlag ? 'חורג מהסף' : 'בטווח שאינו חורג'}; דופק ${hr} — ${hrFlag ? 'חורג מהסף' : 'בטווח שאינו חורג'}. די באחד מהקריטריונים כדי להגדיר "פצוע דחוף", והרשימה המלאה כוללת גם: התרשמות כללית (חיוורון, כיחלון, הזעה, אי-שקט פסיכומוטורי); הכרה מעורפלת או חוסר הכרה; חסימה או איום על נתיב האוויר (חרחורים, דימום והפרשות בלוע, צרידות); מאמץ נשימתי ניכר; ודימום בלתי נשלט או סימני הלם. פצוע דחוף — אין להתעכב בשטח למעט פעולות מצילות חיים, ואין לעכב פינוי רק לצורך חבירה לצוות ALS.`,
      wrong: `הטעויות הנפוצות: החלת ספי המבוגר על ילד (במבוגר הסף הוא נשימה מעל 20 או מתחת ל-10, ודופק מעל 100 או מתחת ל-60); ייחוס החריגה למדד הלא נכון; והנחה ששני המדדים חייבים לחרוג יחד — בעוד שדי באחד מהם.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: קצב הנשמה במטופל עם דופק ללא נשימה, לפי גיל
// ------------------------------------------------------------
function generateRescueBreathingRateQuestion() {
  const groups = [
    { label: 'מבוגר', ans: 'הנשמה כל 6 שניות (כ-10 הנשמות בדקה)' },
    { label: 'ילד', ans: 'הנשמה כל 3-5 שניות (12-20 הנשמות בדקה)' },
    { label: 'תינוק', ans: 'הנשמה כל 3-5 שניות (12-20 הנשמות בדקה)' }
  ];
  const g = rnd(groups);
  const distractors = [
    'הנשמה כל 6 שניות (כ-10 הנשמות בדקה)',
    'הנשמה כל 3-5 שניות (12-20 הנשמות בדקה)',
    'הנשמה כל 10 שניות (כ-6 הנשמות בדקה)',
    'הנשמה כל 2 שניות (כ-30 הנשמות בדקה)'
  ].filter((t) => t !== g.ans);

  const { options, correctLetter } = buildTextOptions(g.ans, distractors);

  return {
    id: genId('gen_rescuebreath'),
    template: 'GCT_0022',
    qtype: ['numeric'],
    multi: false,
    section: 'החייאה',
    question: `${g.label} מחוסר הכרה, אינו נושם, אך דופק מרכזי נמוש היטב. מהו קצב ההנשמה המומלץ?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `במטופל עם דופק ללא נשימה מנשימים בלבד, ללא עיסויים. קצב ההנשמה לפי גיל: מבוגר — כל 6 שניות (כ-10 הנשמות בדקה); ילד ותינוק — כל 3-5 שניות (12-20 הנשמות בדקה). עבור ${g.label}: ${g.ans}. לשם השוואה, כשאין דופק: סבב מבוגר 30 עיסויים : 2 הנשמות; ילד/תינוק — מטפל יחיד 30:2 וזוג מטפלים 15:2; יילוד 3:1. בנתיב אוויר מתקדם (טובוס/LMA/טרכיאוסטום) מנשימים 10 בדקה ללא סנכרון עם העיסויים.`,
      wrong: `טעויות נפוצות: החלת קצב המבוגר על ילד או להפך (הילד זקוק לקצב מהיר יותר, משום שדום הלב בילדים הוא לרוב אספיקטי/היפוקסי ומשני לכשל נשימתי); הנשמה איטית מדי (כל 10 שניות) שאינה מספקת אוורור; והנשמה מהירה מדי (כל 2 שניות) שמנפחת את הקיבה ומעלה סיכון להקאה ולאספירציה.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: אובדן נוזלים בהתייבשות לפי אחוז ממשקל הגוף
// ------------------------------------------------------------
function generateDehydrationLossQuestion() {
  const weight = rndInt(45, 95);
  const pct = rnd([5, 10, 11]);
  const correct = Math.round((weight * pct) / 100 * 10) / 10;

  const noDivide = weight * pct;                         // שכחת החלוקה ב-100
  const divTen = Math.round((weight * pct) / 10 * 10) / 10; // חלוקה ב-10 במקום ב-100
  const ratio = Math.round((weight / pct) * 10) / 10;    // חלוקה במקום הכפלה

  const { options, correctLetter } = buildOptions(
    correct,
    [noDivide, divTen, ratio],
    (x) => x.toFixed(1) + ' ליטר'
  );

  const severity = pct >= 11 ? 'התייבשות קשה (מעל 11% ממשקל הגוף)'
    : pct === 10 ? 'הגבול העליון של התייבשות קלה/בינונית (עד 10% ממשקל הגוף)'
      : 'מעל הסף של תשישות חום והתייבשות בפרוטוקול (יותר מ-5% ממשקל הגוף)';

  return {
    id: genId('gen_dehydration'),
    template: 'GCT_0017',
    qtype: ['numeric'],
    multi: false,
    section: 'פגיעות סביבתיות',
    question: `מטופל במשקל ${weight} ק"ג איבד ${pct}% ממשקל גופו בנוזלים. כמה נוזלים איבד (בהנחה שק"ג אחד ≈ ליטר אחד)?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `החישוב: ${weight} × ${pct} ÷ 100 = ${correct.toFixed(1)} ליטר. מבחינת סיווג, ${pct}% הם ${severity}. הסיווג המלא: התייבשות קלה/בינונית — אובדן של עד 10% ממשקל הגוף; התייבשות קשה — למעלה מ-11% ממשקל הגוף; ובפרוטוקול הטיפול, "תשישות חום והתייבשות" מוגדרת כעלייה מתונה בחום הגוף המלווה במאזן נוזלים שלילי של יותר מ-5% ממשקל הגוף. הטיפול: הרחקה למקום מוצל וקריר, הסרת ביגוד לוחץ, שתייה ממותנת, ועירוי נוזלים — מבוגר מנות חוזרות של 500cc סליין עד להשגת תפוקת שתן, ילד בולוסים חוזרים של 20cc/ק"ג.`,
      wrong: `טעויות נפוצות: הכפלה ללא חלוקה ב-100 (מתקבל ${fmtNum(noDivide)} ליטר — ערך בלתי אפשרי); חלוקה ב-10 במקום ב-100 (${divTen.toFixed(1)} ליטר, פי 10 מהנכון); וחלוקת המשקל באחוז במקום הכפלתו (${ratio.toFixed(1)} ליטר), חישוב שאין לו משמעות פיזיולוגית.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: מזרק אוטומטי TA — מינון לפי גיל ומספר מזרקים לפי מנח
// ------------------------------------------------------------
function generateAtropineInjectorQuestion() {
  const age = rnd([1, 2, 5, 9, 14, 30, 45, 58, 65, 72]);
  const lying = rnd([true, false]);
  const dose = age <= 2 ? 0.5 : (age >= 10 && age <= 60) ? 2.0 : 1.0;
  const count = lying ? 2 : 1;
  const colorOf = (d) => (d === 0.5 ? 'תכלת' : d === 1.0 ? 'ורוד' : 'צהוב');
  const label = (d, c) => `TA ${d.toFixed(1)} מ"ג (${colorOf(d)}) — ${c} ${c === 1 ? 'מזרק' : 'מזרקים'}`;

  const correctText = label(dose, count);
  const otherCount = count === 1 ? 2 : 1;
  // כל הצירופים האפשריים של מינון × מספר מזרקים, למעט התשובה הנכונה,
  // מסודרים לפי מידת הסבירות של הטעות (אותו מינון/מספר שגוי, ואז מינון שגוי).
  const candidates = [
    label(dose, otherCount),
    ...[0.5, 1.0, 2.0].filter((d) => d !== dose).map((d) => label(d, count)),
    ...[0.5, 1.0, 2.0].filter((d) => d !== dose).map((d) => label(d, otherCount))
  ].filter((t) => t !== correctText);

  const { options, correctLetter } = buildTextOptions(correctText, candidates);

  return {
    id: genId('gen_tainjector'),
    template: 'GCT_0019',
    qtype: ['numeric'],
    multi: false,
    section: 'מענה מד"א בשעת חירום',
    question: `לאחר הכרזה על אירוע נפגעי זרחן אורגני ע"י פאראמדיק, הגעת לנפגע בן ${age} ה${lying ? 'שוכב בזירה' : 'מתהלך בזירה'}. איזה מזרק אוטומטי תיתן וכמה מזרקים?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `מינון המזרק האוטומטי נקבע לפי גיל (וצבע המזרק): 0-2 שנים — TA 0.5 מ"ג (תכלת); 2-10 שנים ומעל גיל 60 — TA 1.0 מ"ג (ורוד); 10-60 שנים — TA 2.0 מ"ג (צהוב). מספר המזרקים נקבע לפי מנח הנפגע: מתהלך — מזרק אחד; שוכב — 2 מזרקים, אחד לכל ירך. כאן, נפגע בן ${age} ה${lying ? 'שוכב' : 'מתהלך'}: ${correctText}. דגשים: ההזרקה מתבצעת דרך הבגדים בירך; ניתנת מנת TA אחת בלבד לנפגע ואין לחזור על TA; אם הנפגע נותר סימפטומטי 15 דקות לאחר המנה הראשונה — Atropine נוסף לפי גיל, מזרק אחד כל 10-15 דקות כל עוד הוא סימפטומטי (מזרקי המנה החוזרת מגיעים מהתרמיל האדום שבתאר"ן). בגיל 0-2 המתן הוא רק בהוראת רופא/פאראמדיק ובנוכחות סימנים נשימתיים משמעותיים: קל — מזרק אחד; בינוני/קשה — 2 מזרקים. יש לסמן תג טיפול צהוב עם שעת תחילת הטיפול, חומרת הנפגע ומספר המזרקים שניתנו.`,
      wrong: `טעויות נפוצות: קביעת מספר המזרקים לפי חומרת התסמינים במקום לפי מנח הנפגע (מהלך/שוכב); בלבול בין מינון הילד למינון המבוגר, ובפרט שכחת הכלל שמעל גיל 60 חוזרים למינון 1.0 מ"ג ולא נשארים ב-2.0 מ"ג; ומתן מינון הפעוט (0.5 מ"ג) למי שאינו בן פחות משנתיים.`
    },
  };
}

// ------------------------------------------------------------
// TEMPLATE: זמן הגעה לבי"ח בהמתנה לאט"ן מול פינוי מיידי
// ------------------------------------------------------------
function generateAlsRendezvousQuestion() {
  const alsEta = rndInt(8, 25);
  const driveTime = rndInt(7, 30);
  const correct = alsEta + driveTime;

  const onlyDrive = driveTime;
  const onlyAls = alsEta;
  const diff = Math.abs(driveTime - alsEta);

  const { options, correctLetter } = buildOptions(
    correct,
    [onlyDrive, onlyAls, diff].filter((v) => v > 0),
    (x) => fmtNum(x) + ' דקות'
  );

  return {
    id: genId('gen_alsrendezvous'),
    template: 'GCT_0023',
    qtype: ['numeric'],
    multi: false,
    section: 'קבלת החלטות ודיווחים',
    question: `אתה עם פצוע שהוגדר דחוף. זמן הנסיעה לבית החולים הוא ${driveTime} דקות, וזמן ההגעה המשוער של האט\"ן לזירה הוא ${alsEta} דקות. אם הצוות ימתין בזירה להגעת האט\"ן ורק אז יפנה — בעוד כמה דקות יגיע הפצוע לבית החולים?`,
    options,
    correct: correctLetter,
    explanation: {
      correct: `החישוב: ${alsEta} דקות המתנה + ${driveTime} דקות נסיעה = ${correct} דקות עד להגעה לבית החולים, לעומת ${driveTime} דקות בפינוי מיידי — עיכוב של ${alsEta} דקות. הכלל המנחה: יש לשקול חבירה לאט"ן או למסוק רק בתנאי שהחבירה אינה מאריכה את זמן ההגעה של הפצוע לבית החולים; ובפצוע דחוף — אין להתעכב בשטח למעט פעולות מצילות חיים, ואין לעכב פינוי רק לצורך חבירה לצוות ALS. לכן במקרה זה יש לפנות מיידית ולשקול חבירה בדרך, בתיאום עם המוקד המרחבי. ככלל, אין לפנות פצוע דחוף ללא ליווי איש צוות מאחור, ויש להעביר דיווח מקדים לבית החולים דרך המוקד המרחבי: גיל, פציעות קריטיות, רמת הכרה, יציבות המודינמית וזמן הגעה משוער.`,
      wrong: `טעויות נפוצות: התייחסות לזמן הנסיעה בלבד (${fmtNum(onlyDrive)} דקות) תוך התעלמות מזמן ההמתנה; התייחסות לזמן הגעת האט"ן בלבד (${fmtNum(onlyAls)} דקות) כאילו החבירה מסיימת את הפינוי; וחישוב ההפרש בין שני הזמנים (${fmtNum(diff)} דקות) במקום סכימתם.`
    },
  };
}

// ============================================================
// TEMPLATE REGISTRY (ordered by section)
// ============================================================
window.QUESTION_TEMPLATES = [
  { id: 'GCT_0001', label: 'מינון אדרנלין באנפילקסיס', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateEpinephrineDoseQuestion },
  { id: 'GCT_0002', label: 'נפח בולוס נוזלים לפי משקל', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateFluidBolusQuestion },
  { id: 'GCT_0003', label: 'סף מתן חמצן/הנשמה', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateOxygenThresholdQuestion },
  { id: 'GCT_0004', label: 'חישוב לחץ דופק', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generatePulsePressureQuestion },
  { id: 'GCT_0005', label: 'ספי אזהרה במדדים חיוניים (מבוגר)', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateWarningThresholdsQuestion },
  { id: 'GCT_0006', label: 'חישוב דופק מספירת 15 שניות', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generatePulseCount15sQuestion },
  { id: 'GCT_0007', label: 'ל"ד סיסטולי משוער בילד', section: 'טראומה', qtype: ['numeric'], generate: generatePediatricSBPQuestion },
  { id: 'GCT_0008', label: 'דרגת הלם תת-נפחי', section: 'טראומה', qtype: ['numeric'], generate: generateHemorrhagicShockClassQuestion },
  { id: 'GCT_0009', label: 'כלל התשיעיות בכוויות', section: 'טראומה', qtype: ['numeric'], generate: generateBurnBSAQuestion },
  { id: 'GCT_0010', label: 'אנרגיה קינטית בקינמטיקה', section: 'טראומה', qtype: ['numeric'], generate: generateKineticEnergyQuestion },
  { id: 'GCT_0011', label: 'אחוז שטח גוף כוי לפי גיל (קדמי/אחורי)', section: 'טראומה', qtype: ['numeric'], generate: generateBSAByAgeGroupQuestion },
  { id: 'GCT_0012', label: 'כלל התשיעיות בילד ובתינוק', section: 'טראומה', qtype: ['numeric'], generate: generatePediatricBurnBSAQuestion },
  { id: 'GCT_0013', label: 'מרחק הנחת חסם עורקים', section: 'טראומה', qtype: ['numeric'], generate: generateTourniquetDistanceQuestion },
  { id: 'GCT_0014', label: 'ספי מדדים לפצוע דחוף בילד', section: 'טראומה', qtype: ['numeric'], generate: generatePediatricUrgentCriteriaQuestion },
  { id: 'GCT_0015', label: 'מינון מידזולם בילד (הרעלות)', section: 'פגיעות סביבתיות', qtype: ['numeric'], generate: generateMidazolamPediatricQuestion },
  { id: 'GCT_0016', label: 'לחץ מוחלט בעומק צלילה', section: 'פגיעות סביבתיות', qtype: ['numeric'], generate: generateDivingPressureQuestion },
  { id: 'GCT_0017', label: 'אובדן נוזלים בהתייבשות לפי משקל', section: 'פגיעות סביבתיות', qtype: ['numeric'], generate: generateDehydrationLossQuestion },
  { id: 'GCT_0018', label: 'המרות יחידות קרינה', section: 'מענה מד"א בשעת חירום', qtype: ['numeric'], generate: generateRadiationUnitsQuestion },
  { id: 'GCT_0019', label: 'מזרק אוטומטי TA לפי גיל ומנח', section: 'מענה מד"א בשעת חירום', qtype: ['numeric'], generate: generateAtropineInjectorQuestion },
  { id: 'GCT_0020', label: 'יחס עיסויים:הנשמות לפי גיל', section: 'החייאה', qtype: ['numeric'], generate: generateCPRRatioQuestion },
  { id: 'GCT_0021', label: 'ריכוז חמצן לפי אמצעי המתן', section: 'החייאה', qtype: ['numeric'], generate: generateOxygenEnrichmentQuestion },
  { id: 'GCT_0022', label: 'קצב הנשמה במטופל עם דופק לפי גיל', section: 'החייאה', qtype: ['numeric'], generate: generateRescueBreathingRateQuestion },
  { id: 'GCT_0023', label: 'זמן הגעה לבי"ח בהמתנה לאט"ן', section: 'קבלת החלטות ודיווחים', qtype: ['numeric'], generate: generateAlsRendezvousQuestion },
  { id: 'GCT_0024', label: 'נפח נשימה בדקה', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateMinuteVentilationQuestion },
  { id: 'GCT_0025', label: 'הערכת נפח דם לפי משקל', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateBloodVolumeQuestion },
  { id: 'GCT_0026', label: 'חישוב תפוקת לב', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateCardiacOutputQuestion },
  { id: 'GCT_0027', label: 'ערכים תקינים לפי קבוצת גיל', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateVitalsByAgeGroupQuestion },
  { id: 'GCT_0028', label: 'מרכיבי הדם באחוזים', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateBloodCompositionQuestion },
  { id: 'GCT_0029', label: 'סיווג תגובת דחק לפי זמן', section: 'עזרה ראשונה נפשית וחוסן', qtype: ['numeric'], generate: generateStressReactionStageQuestion },
  { id: 'GCT_0030', label: 'תוקף מיכל חמצן לפי בדיקה הידרוסטטית', section: 'אג"ם ונהלים', qtype: ['numeric'], generate: generateOxygenCylinderValidityQuestion },
  { id: 'GCT_0031', label: 'חישוב ציון אפגר', section: 'לידה וגניקולוגיה', qtype: ['numeric'], generate: generateApgarQuestion },
  { id: 'GCT_0032', label: 'משך עבודה של מיכל חמצן', section: 'ציוד רפואי', qtype: ['numeric'], generate: generateOxygenDurationQuestion },
  { id: 'GCT_0033', label: 'עומס על הגב לפי תנוחת הרמה', section: 'עבודת הצוות', qtype: ['numeric'], generate: generateSpinalLoadQuestion }
];

