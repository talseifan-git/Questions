// ============================================================
// GENERATED CONTENT — questions generated from the course slide deck
// (as opposed to question_bank.js, which is the fixed original bank).
// Loaded after question_bank.js; index.html reads window.GENERATED_
// CONCEPT_QUESTIONS (fixed questions) and window.GENERATED_TEMPLATES
// (numeric templates with infinite randomized variants via .generate()).
//
// Helper functions below (rnd/rndInt/shuffle/fmtNum/buildOptions) are
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
    id: 'gen_pedsbp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    source: 'generated',
    template: 'GCT_0001',
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
    id: 'gen_hemclass_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    source: 'generated',
    template: 'GCT_0002',
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
    id: 'gen_burnbsa_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    source: 'generated',
    template: 'GCT_0003',
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
    id: 'gen_cprratio_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    source: 'generated',
    template: 'GCT_0004',
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
// ADDITIONAL NUMERIC TEMPLATES (added in second content-generation pass)
// ------------------------------------------------------------
function genId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// NUMERIC TEMPLATES (new)
// ============================================================

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
    source: 'generated',
    template: 'GCT_0005',
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
    source: 'generated',
    template: 'GCT_0006',
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
    source: 'generated',
    template: 'GCT_0007',
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
    source: 'generated',
    template: 'GCT_0008',
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
    source: 'generated',
    template: 'GCT_0009',
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
    source: 'generated',
    template: 'GCT_0010',
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
    source: 'generated',
    template: 'GCT_0011',
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
    source: 'generated',
    template: 'GCT_0012',
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
window.GENERATED_TEMPLATES = [
  { id: 'GCT_0001', label: 'ל"ד סיסטולי משוער בילד', section: 'טראומה', qtype: ['numeric'], generate: generatePediatricSBPQuestion },
  { id: 'GCT_0002', label: 'דרגת הלם תת-נפחי', section: 'טראומה', qtype: ['numeric'], generate: generateHemorrhagicShockClassQuestion },
  { id: 'GCT_0003', label: 'כלל התשיעיות בכוויות', section: 'טראומה', qtype: ['numeric'], generate: generateBurnBSAQuestion },
  { id: 'GCT_0004', label: 'יחס עיסויים:הנשמות לפי גיל', section: 'החייאה', qtype: ['numeric'], generate: generateCPRRatioQuestion },
{ id: 'GCT_0005', label: 'מינון אדרנלין באנפילקסיס', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateEpinephrineDoseQuestion },
  { id: 'GCT_0006', label: 'נפח נשימה בדקה', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateMinuteVentilationQuestion },
  { id: 'GCT_0007', label: 'הערכת נפח דם לפי משקל', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateBloodVolumeQuestion },
  { id: 'GCT_0008', label: 'חישוב תפוקת לב', section: 'אנטומיה ופיזיולוגיה', qtype: ['numeric'], generate: generateCardiacOutputQuestion },
  { id: 'GCT_0009', label: 'חישוב ציון אפגר', section: 'לידה וגניקולוגיה', qtype: ['numeric'], generate: generateApgarQuestion },
  { id: 'GCT_0010', label: 'נפח בולוס נוזלים לפי משקל', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateFluidBolusQuestion },
  { id: 'GCT_0011', label: 'סף מתן חמצן/הנשמה', section: 'הטיפול בחולה', qtype: ['numeric'], generate: generateOxygenThresholdQuestion },
  { id: 'GCT_0012', label: 'עומס על הגב לפי תנוחת הרמה', section: 'עבודת הצוות', qtype: ['numeric'], generate: generateSpinalLoadQuestion }
];

// ============================================================
// Fixed concept + scenario-action questions
// ============================================================
window.GENERATED_CONCEPT_QUESTIONS = [

  // ---------------- CONCEPT QUESTIONS ----------------
  {
    id: 'GC_0001',
    source: 'generated',
    qtype: ['concept'],
    section: 'עבודת הצוות',
    question: 'פראמדיק (ALS) המטפל באירוע רב-נפגעים מבקש מחובש רפואת חירום (EMT-B) לפתוח וריד ולתת תרופה IV, בשל עומס. מה על החובש לעשות?',
    multi: false,
    options: {
      'א': 'לבצע את הפעולה כיוון שמדובר במצב רב-נפגעים החורג מהשגרה',
      'ב': 'לסרב לבצע — פתיחת וריד ומתן תרופה IV הן מחוץ לסמכותו, גם באירוע רב-נפגעים',
      'ג': 'לבצע, בתנאי שהפראמדיק יחתום על כך בדיעבד',
      'ד': 'לבצע רק את פתיחת הווריד ולא את מתן התרופה'
    },
    correct: 'ב',
    explanation: {
      correct: 'רק פראמדיק (ALS) מוסמך לביצוע פעולות חודרניות ומתן תרופות IV. חובש EMT-B שנדרש ע"י פראמדיק לבצע פעולה מחוץ לסמכותו חייב לסרב — אין סמכות "לחרוג" גם באירוע רב-נפגעים; חריגה מסמכות מוגדרת כביצוע פעולה שלא נלמדה או לא הוסמכה.',
      wrong: 'עומס באירוע רב-נפגעים אינו מקנה סמכות נוספת; חתימה בדיעבד אינה משנה את גבולות הסמכות שנקבעו מראש; וגם ביצוע חלקי של הפעולה (פתיחת וריד בלבד) עדיין חורג מסמכות EMT-B.'
    },
  },
  {
    id: 'GC_0002',
    source: 'generated',
    qtype: ['concept'],
    section: 'קבלת החלטות ודיווחים',
    question: 'אילו מהבאים הם מרכיבים של עוולת ה"רשלנות" לפי פקודת הנזיקין?',
    multi: true,
    options: {
      'א': 'חובת זהירות והפרתה',
      'ב': 'כוונה פלילית להזיק',
      'ג': 'נזק בפועל',
      'ד': 'קשר סיבתי בין ההפרה לנזק'
    },
    correct: ['א', 'ג', 'ד'],
    explanation: {
      correct: 'רשלנות (פקודת הנזיקין, 1992) מוגדרת כמעשה או מחדל שאדם סביר, נבון וכשיר לא היה עושה, ומורכבת מארבעה מרכיבים: חובת זהירות, הפרתה, נזק, וקשר סיבתי בין ההפרה לנזק. שלוש האפשרויות הנכונות מכסות מרכיבים אלו (חובת הזהירות והפרתה מאוחדות באפשרות א).',
      wrong: 'כוונה פלילית להזיק היא מרכיב של עבירה פלילית מכוונת (כגון תקיפה), לא של עוולת הרשלנות — רשלנות עוסקת במחדל או מעשה לא-זהיר, לא בכוונה.'
    },
  },
  {
    id: 'GC_0003',
    source: 'generated',
    qtype: ['concept'],
    section: 'קבלת החלטות ודיווחים',
    question: 'מטפל לא תיעד את הטיפול שביצע במטופל. מה המשמעות המשפטית של כך?',
    multi: false,
    options: {
      'א': 'אין משמעות כל עוד הטיפול עצמו היה תקין',
      'ב': 'נטל ההוכחה עובר לארגון/למטפל להוכיח שהטיפול ניתן כראוי — אי-רישום נחשב רשלנות',
      'ג': 'המטופל חייב להוכיח בעצמו שלא ניתן טיפול',
      'ד': 'תיעוד נדרש רק במקרי מוות'
    },
    correct: 'ב',
    explanation: {
      correct: 'לפי חוק זכויות החולה (תשנ"ו 1996, סעיף 17א), קיימת חובה חוקית לתעד את הטיפול. כשלא נעשה רישום, או שנעשה רישום חלקי, נטל ההוכחה עובר לארגון (המטפל) — הוא זה שצריך להוכיח שהטיפול ניתן כראוי; אי-רישום נחשב כשלעצמו רשלנות.',
      wrong: 'טיפול תקין בפועל אינו פוטר מהחובה לתעד — ה"נזק הראייתי" נוצר מעצם חוסר האפשרות להוכיח זאת בדיעבד; נטל ההוכחה עובר למטפל, לא למטופל; והחובה לתעד חלה על כל טיפול, לא רק מקרי מוות.'
    },
  },
  {
    id: 'GC_0004',
    source: 'generated',
    qtype: ['concept'],
    section: 'קבלת החלטות ודיווחים',
    question: 'מטופל הובא במצב של חוסר הכרה לאחר תאונת דרכים, ואינו מסוגל להביע את רצונו. על סמך איזה סוג הסכמה מספק הצוות טיפול מציל חיים?',
    multi: false,
    options: {
      'א': 'הסכמה בעל-פה',
      'ב': 'הסכמה משוערת — מניחים שהמטופל היה מסכים לטיפול אילו יכול היה',
      'ג': 'הסכמה בכתב מראש',
      'ד': 'אין אפשרות לטפל ללא הסכמה מפורשת'
    },
    correct: 'ב',
    explanation: {
      correct: 'כאשר מטופל מחוסר הכרה ואינו מסוגל להביע רצון, הצוות פועל מכוח "הסכמה משוערת" — הנחה סבירה שהמטופל היה רוצה לקבל טיפול מציל חיים אילו היה בהכרה ומסוגל להביע עמדה.',
      wrong: 'הסכמה בעל-פה דורשת הכרה ותקשורת פעילה מהמטופל, שאינה קיימת כאן; הסכמה בכתב מראש היא תרחיש נפרד ואינה המקור הרגיל לפעולה במצב חירום פתאומי; והימנעות מטיפול תסכן את חיי המטופל שלא לצורך — הדין מכיר בהסכמה משוערת בדיוק למצבים כאלה.'
    },
  },
  {
    id: 'GC_0005',
    source: 'generated',
    qtype: ['concept'],
    section: 'אנטומיה ופיזיולוגיה',
    question: 'מה ההבדל בין דיפוזיה לאוסמוזה?',
    multi: false,
    options: {
      'א': 'דיפוזיה = מעבר חומר מריכוז גבוה לנמוך; אוסמוזה = מעבר נוזלים מריכוז נמוך לגבוה דרך קרום בררני',
      'ב': 'שתיהן מתארות בדיוק אותו תהליך, בשמות שונים',
      'ג': 'דיפוזיה = מעבר נוזלים בלבד; אוסמוזה = מעבר גזים בלבד',
      'ד': 'אוסמוזה מתרחשת רק בריאות, דיפוזיה מתרחשת רק בכליות'
    },
    correct: 'א',
    explanation: {
      correct: 'דיפוזיה היא מעבר חומר (בד"כ מומס או גז) מריכוז גבוה לריכוז נמוך, ללא צורך בקרום מיוחד. אוסמוזה היא מעבר נוזלים (מים) מריכוז נמוך של מומס לריכוז גבוה של מומס, דרך קרום בררני-חדיר — כיוון הפוך במובן מסוים, כי הנוזל "עוקב" אחרי ריכוז המומס הגבוה.',
      wrong: 'אלו שני מנגנונים פיזיולוגיים שונים, לא שם נרדף לאותו תהליך; שניהם אינם מוגבלים לחומר יחיד (גז מול נוזל בלבד) — ההבחנה האמיתית היא כיוון התנועה והדרישה לקרום בררני; ושניהם מתרחשים במגוון רקמות בגוף, לא רק בריאות/כליות.'
    },
  },
  {
    id: 'GC_0006',
    source: 'generated',
    qtype: ['concept'],
    section: 'אנטומיה ופיזיולוגיה',
    question: 'מה ההבדל בין היפוקסיה להיפוקסמיה?',
    multi: false,
    options: {
      'א': 'אין הבדל — שני מונחים לאותו מצב',
      'ב': 'היפוקסיה = חוסר חמצן ברקמות; היפוקסמיה = חוסר חמצן בדם',
      'ג': 'היפוקסיה = עודף חמצן בדם; היפוקסמיה = עודף חמצן ברקמות',
      'ד': 'היפוקסיה מתייחסת רק לילדים, היפוקסמיה רק למבוגרים'
    },
    correct: 'ב',
    explanation: {
      correct: 'היפוקסיה מתארת חוסר חמצן ברמת הרקמות (המקום שבו החמצן בפועל נצרך), בעוד היפוקסמיה מתארת חוסר חמצן ברמת הדם עצמו. ניתן לסבול מהיפוקסמיה (חמצן נמוך בדם) שתוביל בסופו של דבר להיפוקסיה ברקמות אם לא תטופל.',
      wrong: 'אלו שני מצבים שונים ברמת ההגדרה (דם מול רקמות), לא שם נרדף; שני המונחים מתארים חוסר, לא עודף, בחמצן; ואין קשר בין המונחים לגיל המטופל.'
    },
  },
  {
    id: 'GC_0007',
    source: 'generated',
    qtype: ['concept'],
    section: 'טראומה',
    question: 'פצוע ראש לאחר נפילה מבחין באובדן הכרה קצר, ולאחריו שיפור זמני ("צלילות" — Lucid Interval), ולאחריו התדרדרות מחדש. באיזה סוג דימום תוך-גולגולתי תחשוד, ומדוע דווקא בו?',
    multi: false,
    options: {
      'א': 'דימום סאב-דורלי — ורידי, מתפתח לאט על פני שעות עד שבועות',
      'ב': 'דימום אפידורלי — עורקי, נובע לרוב משבר טמפורלי, עם Lucid Interval קלאסי',
      'ג': 'דימום סאב-ארכנואידלי, הקשור לרוב לקונטוזיה מוחית',
      'ד': 'קונטוזיה מוחית בלבד, ללא דימום'
    },
    correct: 'ב',
    explanation: {
      correct: '"צלילות" (Lucid Interval) — איבוד הכרה קצר, שיפור זמני ואז התדרדרות חוזרת — הוא הסימן הקלאסי לדימום אפידורלי, הנובע מפגיעה עורקית (לרוב שבר טמפורלי) ומתפתח מהר יחסית בהשוואה לדימומים ורידיים.',
      wrong: 'דימום סאב-דורלי, ורידי, מתפתח לאט יותר (שעות עד שבועות) ואינו מציג את דפוס ה-Lucid Interval הקלאסי; סאב-ארכנואידלי קשור לרוב לקונטוזיה מוחית ואינו מזוהה עם דפוס ההתאוששות-התדרדרות הזה; וקונטוזיה מוחית בלבד אינה מסבירה את שינוי ההכרה הדו-שלבי.'
    },
  },
  {
    id: 'GC_0008',
    source: 'generated',
    qtype: ['concept'],
    section: 'החייאה',
    question: 'היכן בודקים דופק מרכזי בתינוק (עד גיל שנה)?',
    multi: false,
    options: {
      'א': 'קרוטיד בלבד',
      'ב': 'ברכיאלי בלבד',
      'ג': 'פמורלי בלבד',
      'ד': 'רדיאלי בלבד'
    },
    correct: 'ב',
    explanation: {
      correct: 'בתינוקות בודקים דופק מרכזי בעורק הברכיאלי (בזרוע הפנימית) — בשונה מילדים ומבוגרים, שבהם נבדק דופק קרוטיד, בשל צוואר קצר וקושי במישוש הקרוטיד בתינוק.',
      wrong: 'קרוטיד ופמורלי הם אתרי דופק מרכזי מקובלים בילדים/מבוגרים אך אינם הבחירה המומלצת בתינוק; רדיאלי הוא דופק פריפרי, לא מרכזי, ואינו נבדק כדופק ראשוני בשום גיל.'
    },
  },
  {
    id: 'GC_0009',
    source: 'generated',
    qtype: ['concept'],
    section: 'הטיפול בחולה',
    question: 'אילו מסוגי ההלם הבאים מציגים לרוב עור קר, לח וחיוור (בניגוד להלם העצבי, שמציג עור חם וסמוק)?',
    multi: true,
    options: {
      'א': 'הלם תת-נפחי (היפוולמי)',
      'ב': 'הלם עצבי (נוירוגני)',
      'ג': 'הלם זיהומי (ספטי)',
      'ד': 'הלם לבבי (קרדיוגני)'
    },
    correct: ['א', 'ג', 'ד'],
    explanation: {
      correct: 'טבלת סימני עור לפי סוג הלם: תת-נפחי — קר ולח, חיוור. עצבי (נוירוגני) — חם וסמוק (הכיוון ההפוך, עקב איבוד טונוס סימפטטי). זיהומי (ספטי) — קר ולח, חיוור, לעיתים עם צמרמורות. לבבי (קרדיוגני) — קר ולח, חיוור. שלושת הסוגים תת-נפחי, זיהומי ולבבי חולקים תמונת עור "קר ולח", בעוד ההלם העצבי הוא היוצא מן הכלל.',
      wrong: 'הלם עצבי (נוירוגני) הוא היוצא מן הכלל בטבלה — פגיעה בחוט השדרה מבטלת את הטונוס הסימפטטי, ולכן אין כיווץ כלי דם היקפי, מה שגורם לעור חם וסמוק במקום קר ולח, יחד עם ברדיקרדיה במקום טכיקרדיה.'
    },
  },
  {
    id: 'GC_0010',
    source: 'generated',
    qtype: ['concept'],
    section: 'טראומה',
    question: 'מדוע כוויה מדרגה III (עמוקה) גורמת פחות כאב מכוויה מדרגה II, למרות היותה חמורה יותר?',
    multi: false,
    options: {
      'א': 'כוויה מדרגה III שטחית יותר, ולכן פוגעת בפחות עצבים',
      'ב': 'קצות העצבים ברקמה נשרפו ונהרסו, ולכן אין העברת תחושת כאב מהאזור',
      'ג': 'הגוף מפריש חומרי הרדמה טבעיים בתגובה לכוויות עמוקות',
      'ד': 'כוויה מדרגה III תמיד מלווה בהלם שמסתיר את הכאב'
    },
    correct: 'ב',
    explanation: {
      correct: 'בכוויה מדרגה III, העור נשרף לעומק המגיע לקצות העצבים החושיים והורס אותם — ולכן, באופן פרדוקסלי, האזור הפגוע ביותר הוא לרוב חסר כאב, בעוד ששוליו (המכוסים בדרגות I-II) כן כואבים מאוד.',
      wrong: 'כוויה מדרגה III עמוקה יותר, לא שטחית יותר, מכוויה מדרגה II; אין מנגנון פיזיולוגי של הפרשת חומרי הרדמה טבעיים כתגובה לכוויה; והיעדר הכאב אינו תלוי בנוכחות הלם — הוא נובע ישירות מהרס העצבים המקומי באזור עצמו.'
    },
  },
  {
    id: 'GC_0011',
    source: 'generated',
    qtype: ['concept'],
    section: 'הטיפול בחולה',
    question: 'מטופל נמצא מחוסר הכרה בחדר סגור עם מחולל חשמל דולק. מד הסטורציה מראה 98%. מדוע קריאה זו עלולה להטעות?',
    multi: false,
    options: {
      'א': 'המכשיר תמיד מתקלקל בסביבה סגורה',
      'ב': 'פחמן חד-חמצני (CO) נקשר להמוגלובין במקום חמצן, ומד הסטורציה אינו מבחין בין השניים — הקריאה תקינה באופן כוזב',
      'ג': 'הסטורציה תמיד יורדת בהרעלת CO, כך שערך 98% שולל את האבחנה',
      'ד': 'מד הסטורציה מודד רק דופק, לא רמת חמצן'
    },
    correct: 'ב',
    explanation: {
      correct: 'פחמן חד-חמצני נקשר להמוגלובין ביתר-שאת ביחס לחמצן, ותופס את אותם אתרי קישור. מד הסטורציה הרגיל אינו מבחין בין המוגלובין הקשור לחמצן להמוגלובין הקשור ל-CO, ולכן מציג קריאה תקינה מטעה גם כשקיימת הרעלה משמעותית.',
      wrong: 'אין תקלה טכנית גורפת של המכשיר בסביבה סגורה; ההפך הוא הנכון — סטורציה תקינה היא בדיוק המלכוד באבחנה זו ואינה שוללת אותה; ומד הסטורציה כן מודד רמת חמצן קשור להמוגלובין, לא רק דופק — הבעיה היא שהתוצאה שהוא מציג אינה אמינה כאן.'
    },
  },
  {
    id: 'GC_0012',
    source: 'generated',
    qtype: ['concept'],
    section: 'הטיפול בחולה',
    question: 'מטופל נמצא מחוסר הכרה, עם נשימות איטיות מאוד (כ-6 לדקה), דופק חלש, ואישונים מכווצים מאוד ("אישוני סיכה"). באיזו הרעלה תחשוד?',
    multi: false,
    options: {
      'א': 'הרעלת אופיאטים (כגון מורפין/הרואין)',
      'ב': 'הרעלת חומרים מעוררים (קוקאין/אמפטמינים)',
      'ג': 'הרעלת זרחן אורגני',
      'ד': 'הרעלת פחמן חד-חמצני (CO)'
    },
    correct: 'א',
    explanation: {
      correct: 'השילוב הקלאסי של דיכוי נשימתי חמור (ברדיפניאה עד דום נשימה), ברדיקרדיה, ואישונים מכווצים ("אישוני סיכה") הוא סימן ההיכר הקלאסי של הרעלת אופיאטים.',
      wrong: 'חומרים מעוררים גורמים לתמונה הפוכה — טכיקרדיה, יתר ל"ד ואישונים מורחבים; זרחן אורגני גורם לתסמינים פראסימפטטיים נוספים (הפרשות מרובות, כיווץ אישונים) אך במסגרת תמונה קלינית שונה (חשיפה חקלאית); והרעלת CO אינה מציגה אישונים מכווצים כסימן אופייני, אלא בלבול וכאב ראש עם סטורציה מטעה.'
    },
  },
  {
    id: 'GC_0013',
    source: 'generated',
    qtype: ['concept'],
    section: 'טראומה',
    question: 'כיצד יש להחדיר מנתב אוויר אורלי (Oral Airway) לילד נפגע טראומה, בשונה מהחדרה במטופל רגיל?',
    multi: false,
    options: {
      'א': 'באותה שיטה בדיוק — הכנסה הפוכה ואז סיבוב 180 מעלות',
      'ב': 'בצורה ישרה, ללא סיבוב, בשל מבנה הפה/הלוע השונה בילדים',
      'ג': 'לעולם אין להשתמש במנתב אוויר בילדים',
      'ד': 'יש להחדיר רק לאחר אינטובציה'
    },
    correct: 'ב',
    explanation: {
      correct: 'בילדים, ובמיוחד בהקשר טראומה, מנתב האוויר האורלי מוחדר בצורה ישרה (לא הפוך עם סיבוב 180°, כפי שנעשה במבוגר) — בשל מבנה שונה של חלל הפה והלוע בגיל זה.',
      wrong: 'שיטת ההחדרה ההפוכה עם סיבוב מתאימה למבוגר, לא לילד; מנתב אוויר כן משמש בילדים מחוסרי הכרה ללא רפלקס הקאה, בדיוק כמו במבוגר — רק טכניקת ההחדרה שונה; והחדרתו אינה תלויה באינטובציה, שכלל אינה פעולה בסמכות חובש.'
    },
  },
  {
    id: 'GC_0014',
    source: 'generated',
    qtype: ['concept'],
    section: 'הטיפול בחולה',
    question: 'מדוע תיעוד מדויק של שעת הופעת התסמינים קריטי במטופל עם חשד לשבץ מוחי?',
    multi: false,
    options: {
      'א': 'זה נדרש רק לצורכי סטטיסטיקה של מד"א',
      'ב': 'זה קובע זכאות לטיפול טרומבוליטי (tPA), שניתן רק בחלון זמן מוגבל מתחילת התסמינים',
      'ג': 'זה קובע אם השבץ איסכמי או המורגי',
      'ד': 'זה נדרש רק כדי לדעת אם לתת אספירין'
    },
    correct: 'ב',
    explanation: {
      correct: 'טיפול טרומבוליטי (tPA) בשבץ איסכמי ניתן רק בתוך חלון זמן מוגבל מרגע הופעת התסמינים. שעה לא מדויקת עלולה לשלול מהמטופל טיפול שיכול היה למנוע נזק נוירולוגי בלתי הפיך.',
      wrong: 'התיעוד אינו לצרכים סטטיסטיים בלבד — יש לו משמעות קלינית ישירה ומיידית; לא ניתן להבדיל קלינית בשטח בין שבץ איסכמי להמורגי (רק בהדמיית CT בבי"ח), ללא קשר לשעת התסמינים; ומתן אספירין בשטח אינו תלוי-שעה באותו אופן קריטי כמו זכאות ל-tPA.'
    },
  },

  // ---------------- SCENARIO-ACTION QUESTIONS ----------------
  {
    id: 'GC_0015',
    source: 'generated',
    qtype: ['scenario'],
    section: 'לידה וגניקולוגיה',
    question: 'אתה מסייע בלידה בשטח. ראש התינוק יצא, אך הכתפיים אינן מתקדמות והראש נראה כנמשך פנימה בחזרה לכיוון הפרינאום. מה תעשה?',
    multi: false,
    options: {
      'א': 'למשוך בעדינות בראש התינוק עד לשחרור הכתפיים',
      'ב': 'לבצע תמרון מק\'רוברטס (משיכת ברכי היולדת לכיוון בתי השחי + כרית מתחת לאגן), ובמידת הצורך תמרון גסקין — ולעולם לא למשוך בראש',
      'ג': 'להמתין ולא לגעת עד להגעת אט"ן',
      'ד': 'ללחוץ בחוזקה על הבטן העליונה כדי לדחוף את התינוק החוצה'
    },
    correct: 'ב',
    explanation: {
      correct: 'זהו פרע כתפיים (Shoulder Dystocia). הטיפול הוא תמרון מק\'רוברטס (משיכת ברכי היולדת לכיוון בתי השחי + כרית מתחת לאגן) ובמידת הצורך תמרון גסקין (מנח שש-שש). משיכה בראש התינוק אסורה בכל מצב — עלולה לגרום נזק עצבי חמור (פגיעה בפלקסוס הברכיאלי).',
      wrong: 'משיכה בראש עלולה לגרום לפגיעה עצבית קשה בתינוק; המתנה פסיבית אינה אפשרית — זהו מצב חירום מיילדותי שדורש התערבות מיידית בשטח; ולחיצה על הבטן העליונה אינה טכניקה מקובלת לטיפול בפרע כתפיים ועלולה להזיק.'
    },
  },
  {
    id: 'GC_0016',
    source: 'generated',
    qtype: ['scenario'],
    section: 'לידה וגניקולוגיה',
    question: 'בזמן לידה בשטח, אתה מבחין שחבל הטבור יצא לפני ראש התינוק ונראה בפתח הנרתיק. מה תעשה?',
    multi: false,
    options: {
      'א': 'לדחוף את חבל הטבור בחזרה פנימה כדי לפנות מקום לראש',
      'ב': 'להרים את אגן היולדת, להפעיל לחץ ידני עדין (בכפפה סטרילית) להסרת לחץ מעל החלק המקדים, לעטוף את החלק הגלוי של חבל הטבור בגזה לחה, ולפנות בדחיפות',
      'ג': 'להמתין ללידה טבעית — התינוק ייצא סביב חבל הטבור ללא בעיה',
      'ד': 'למשוך בעדינות את חבל הטבור החוצה'
    },
    correct: 'ב',
    explanation: {
      correct: 'זהו שמט חבל טבור — מצב חירום מיילדותי. יש להרים את אגן היולדת, להפעיל לחץ ידני עדין (ביד עם כפפה סטרילית) על החלק המקדים כדי להסיר ממנו לחץ מעל חבל הטבור, לעטוף את החלק הגלוי בגזה לחה, לנטר דופק בחבל, ולפנות בדחיפות. אין לדחוף את חבל הטבור בחזרה פנימה.',
      wrong: 'דחיפת חבל הטבור פנימה אסורה במפורש; המתנה פסיבית מסכנת את זרימת הדם לתינוק דרך חבל הטבור הלחוץ; ומשיכת חבל הטבור עלולה לגרום לקרע או פגיעה חמורה — יש להימנע מכל מגע מיותר בו מלבד עטיפתו בגזה לחה.'
    },
  },
  {
    id: 'GC_0017',
    source: 'generated',
    qtype: ['scenario'],
    section: 'לידה וגניקולוגיה',
    question: 'אישה בשבוע 32 להריון, ידועה כסובלת מרעלת הריון, מתחילה לפרכס לנגד עיניך. מה סדר הטיפול הנכון?',
    multi: false,
    options: {
      'א': 'ריפוד ראש, שמירה על ABC, השכבה על הצד השמאלי, מתן חמצן, בדיקת סוכר (לשלול היפוגליקמיה), הזעקת אט"ן',
      'ב': 'השכבה על הגב עם הרמת רגליים בלבד',
      'ג': 'הזרקת אדרנלין מיידית, כמו באנפילקסיס',
      'ד': 'להמתין שהפרכוס יסתיים לפני כל התערבות'
    },
    correct: 'א',
    explanation: {
      correct: 'בטיפול בפרכוסים על רקע רעלת הריון: ריפוד ראש למניעת חבלה, שמירה על ABC, השכבה על הצד השמאלי (למניעת לחץ הרחם על הווריד הנבוב ופגיעה בהחזר הורידי), מתן חמצן, בדיקת סוכר לשלילת היפוגליקמיה כגורם חלופי, והזעקת אט"ן.',
      wrong: 'השכבה על הגב מזיקה בהריון מתקדם, בשל לחץ הרחם על הווריד הנבוב התחתון; אדרנלין אינו הטיפול לפרכוסי רעלת הריון (זהו טיפול אנפילקסיס, לא אקלמפסיה); והמתנה פסיבית ללא כל התערבות (ריפוד ראש, שמירה על נתיב אוויר) מסכנת את האם.'
    },
  },
  {
    id: 'GC_0018',
    source: 'generated',
    qtype: ['scenario', 'numeric'],
    section: 'טראומה',
    question: 'ילד בן 6 נפגע בתאונת דרכים. דופק 140 לדקה, לחץ דם סיסטולי נמדד 78 מ"מ כספית. האם מדובר בתת-לחץ דם עבור גילו, ומה המשמעות הקלינית?',
    multi: false,
    options: {
      'א': 'כן, 78 נמוך מהסף התקין לגילו (82) — סימן מאוחר וחמור להלם בילד, המחייב טיפול דחוף',
      'ב': 'לא, ל"ד זה תקין לכל גיל',
      'ג': 'כן, אך זהו סימן מוקדם וקל בהלם ילדים',
      'ד': 'אי אפשר לדעת בלי לדעת את משקל הילד'
    },
    correct: 'א',
    explanation: {
      correct: 'הסף לתת-לחץ דם סיסטולי בילד בגילאי 1-10 הוא (גיל×2)+70. עבור ילד בן 6: (6×2)+70 = 82. לחץ דם של 78 נמוך מהסף ולכן מהווה תת-לחץ דם. חשוב: בילדים סימני הלם — כולל ירידת ל"ד — מופיעים באיחור יחסית, כי מנגנוני הפיצוי שלהם יעילים יותר; כשל"ד כבר ירד בילד, המצב לרוב חמור ומתקדם.',
      wrong: '78 אינו בטווח התקין לילד בגיל זה, כפי שמראה החישוב; זה בהחלט לא סימן מוקדם וקל — ירידת ל"ד בילד מגיעה מאוחר בתהליך ההלם ומעידה על מצב מתקדם, לא ראשוני; והחישוב תלוי בגיל בלבד, לא במשקל הילד.'
    },
  },
  {
    id: 'GC_0019',
    source: 'generated',
    qtype: ['scenario'],
    section: 'החייאה',
    question: 'ילוד לאחר לידה מוצג עם דופק 50 לדקה, למרות חימום, ייבוש, שאיבה וגירוי שכבר בוצעו. מה תעשה?',
    multi: false,
    options: {
      'א': 'להמתין דקה נוספת ולבדוק שוב',
      'ב': 'להתחיל החייאה מיידית: סדר C-A-B, יחס עיסויים:הנשמות 3:1, המשך אוורור וחימום, הזעקת אט"ן',
      'ג': 'לתת חמצן במסכה בלבד ולהמתין',
      'ד': 'להתחיל עיסויים בלבד ללא הנשמות'
    },
    correct: 'ב',
    explanation: {
      correct: 'דופק ילוד מתחת ל-60 לדקה (או ללא סימני חיים) מחייב החייאה מיידית: סדר C-A-B, יחס עיסויים:הנשמות 3:1, המשך אוורור וחימום, והזעקת אט"ן. אין ממתינים כשהדופק כבר מתחת לסף — מתחילים החייאה מיד.',
      wrong: 'המתנה נוספת מסכנת חיים כשהדופק כבר מתחת ל-60; חמצן במסכה בלבד ללא עיסויים אינו מספיק כשדופק כה נמוך; והחייאה כוללת גם עיסויים וגם הנשמות ביחס 3:1 — לא עיסויים בלבד.'
    },
  },
  {
    id: 'GC_0020',
    source: 'generated',
    qtype: ['scenario'],
    section: 'הטיפול בחולה',
    question: 'הוזעקת לדירה בחורף. שני בני משפחה נמצאים מבולבלים, עם כאבי ראש וקושי בשיפוט; מחולל חשמל פעל בחדר סגור. מד הסטורציה על שני המטופלים מראה 97-98%. מה תעשה?',
    multi: false,
    options: {
      'א': 'לשלול הרעלת CO כי הסטורציה תקינה',
      'ב': 'לחשוד בהרעלת פחמן חד-חמצני למרות סטורציה תקינה (כי CO מטעה את המדידה), להוציא לאוויר פתוח, לתת חמצן בריכוז גבוה ולפנות בדחיפות',
      'ג': 'לתת להם לנוח בדירה עד שהתסמינים יחלפו מעצמם',
      'ד': 'לפתוח חלון בלבד ולהמתין, ללא פינוי'
    },
    correct: 'ב',
    explanation: {
      correct: 'מקור חום בעירה (מחולל) בחלל סגור בחורף, עם בלבול וכאבי ראש בשני בני בית, הם תמונה קלאסית להרעלת CO. הסטורציה נשארת תקינה באופן מטעה כי המכשיר אינו מבחין בין המוגלובין הקשור לחמצן להמוגלובין הקשור ל-CO. יש להוציא את הנפגעים לאוויר פתוח, לתת חמצן בריכוז גבוה, ולפנות בדחיפות.',
      wrong: 'סטורציה תקינה אינה שוללת הרעלת CO — זהו בדיוק המלכוד באבחנה הזו; המתנה בדירה מאריכה את החשיפה להרעלה; ופתיחת חלון בלבד ללא פינוי אינה מטפלת בחשיפה שכבר קרתה ואינה מחליפה חמצן וטיפול רפואי.'
    },
  },

  // ================================================================
  // ADDITIONAL QUESTIONS — batch 2 (generation pass #2, same-day)
  // ================================================================
// ---------------------------------------------------------
// SECTION: עבודת הצוות
// ---------------------------------------------------------
{
  id: 'GC_0021',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות', multi: true,
  question: 'אילו מהפעולות הבאות נמצאות בסמכות חובש רפואת חירום (EMT-B), לפי היררכיית הסמכויות?',
  options: {
    'א': 'דפיברילציה חצי-אוטומטית (AED)',
    'ב': 'פתיחת וריד ומתן תרופה IV',
    'ג': 'הזרקת אפיפן (אדרנלין) לפי פרוטוקול',
    'ד': 'מתן אספירין וחמצן'
  },
  correct: ['א', 'ג', 'ד'],
  explanation: {
    correct: 'היררכיית הסמכויות (מהנמוך לגבוה): מגיש עז"ר — חמצן בלבד; חובש EMT-B — פעולות מצילות חיים, AED, הזרקת אפיפן לפי פרוטוקול, אספירין וחמצן, ללא IV; חובש בכיר — בנוסף דפיברילציה ידנית ושאיבת תרופות בפיקוח; פראמדיק (ALS) — פעולות חודרניות ותרופות; רופא — הסמכות המלאה. שלוש האפשרויות הנכונות (א, ג, ד) נמצאות בבירור בתוך סמכות EMT-B.',
    wrong: 'פתיחת וריד ומתן תרופה IV הן פעולות חודרניות שנמצאות בסמכות פראמדיק (ALS) ומעלה בלבד — EMT-B שנדרש לבצען חייב לסרב, גם באירוע רב-נפגעים.'
  },
},
{
  id: 'GC_0022',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות', multi: true,
  question: 'אילו מהבאים נחשבים לסוגי "קיבעון מחשבתי" שיש להיזהר מהם בעבודת צוות?',
  options: {
    'א': '"הכל בסדר" — התעלמות מסימנים מדאיגים',
    'ב': '"זאת ורק זאת הדרך הנכונה" — נעילה על אבחנה/פתרון יחיד',
    'ג': 'בקשת עזרה מיידית ברגע הצורך',
    'ד': '"הכל חוץ מזה" — שלילת האבחנה המתבקשת'
  },
  correct: ['א', 'ב', 'ד'],
  explanation: {
    correct: 'שלושת סוגי הקיבעון המחשבתי המוכרים הם: "הכל בסדר" (התעלמות מסימנים), "זאת ורק זאת הדרך הנכונה" (נעילה על פתרון יחיד), ו-"הכל חוץ מזה" (שלילת האבחנה המתבקשת). כולם מסוכנים כי הם חוסמים חשיבה מחדש מול מידע חדש.',
    wrong: 'בקשת עזרה מיידית בעת הצורך אינה קיבעון מחשבתי — להפך, זו התנהגות רצויה ומומלצת בזמן לחץ, ואין להתאמן או "לבדוק יכולות" עצמאיות במקומה.'
  },
},
{
  id: 'GC_0023',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות',
  question: 'מהו המיקוד העיקרי של ראש הצוות במהלך אירוע, לפי העקרונות שנלמדו?',
  multi: false,
  options: {
    'א': 'ביצוע כל הפעולות הטכניות בעצמו כדי להבטיח דיוק',
    'ב': 'מיקוד בטיפול הכולל במטופל (לא בפעולה בודדת), ארגון הצוות ובטיחות',
    'ג': 'תיעוד בלבד, ללא מעורבות בהחלטות קליניות',
    'ד': 'השארת כל ההחלטות לצוות ללא הכוונה'
  },
  correct: 'ב',
  explanation: {
    correct: 'תפקיד ראש הצוות כולל ארגון הצוות, שמירה על בטיחות, דוגמה אישית, הכרת תפקידי חברי הצוות, ומיקוד בטיפול הכולל במטופל — לא בביצוע פעולה בודדת בעצמו (מה שעלול לגרום לו לאבד את התמונה הכללית). לאחר האירוע מתבצע ניתוח מקרה ("תחקיר").',
    wrong: 'ביצוע כל הפעולות באופן אישי מונע מראש הצוות לשמור על מבט-על ולתאם את הצוות; תיעוד בלבד אינו ממצה את תפקידו; והיעדר הכוונה עלול לגרום לכפילויות או פספוס פעולות — סימנים מוכרים להוראה לא ברורה.'
  },
},
{
  id: 'GC_0024',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות',
  question: 'מהם מאפייני "הוראה ברורה" בעבודת צוות באירוע חירום?',
  multi: false,
  options: {
    'א': 'תמציתית, בטון רגוע, אדם אחד מדבר בכל רגע, עם אישור ביצוע לפני משימה הבאה',
    'ב': 'כמה שיותר מפורטת, גם אם היא ארוכה',
    'ג': 'ניתנת בו-זמנית ע"י כמה אנשים כדי להבטיח שהיא נשמעת',
    'ד': 'ללא צורך באישור ביצוע, כדי לחסוך זמן'
  },
  correct: 'א',
  explanation: {
    correct: 'הוראה ברורה היא תמציתית, נאמרת בטון רגוע, עם דובר אחד בלבד בכל רגע נתון, ומחייבת אישור ביצוע לפני מעבר למשימה הבאה. סימנים להוראה לא ברורה: ביצוע כפול של אותה פעולה, פספוס פעולות, וסדר שגוי של ביצוע.',
    wrong: 'הוראה ארוכה מדי מגבירה סיכוי לאי-הבנה תחת לחץ; מספר דוברים בו-זמנית יוצר בלבול ולא בהירות; והיעדר אישור ביצוע הוא בדיוק מה שגורם לכפילויות או פספוסי פעולה.'
  },
},
{
  id: 'GC_0025',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות',
  question: 'מדוע אין "להתאמן" או "לבדוק יכולות אישיות" בזמן החייאה או טראומה קשה בשטח?',
  multi: false,
  options: {
    'א': 'כי זה נחשב לא מקצועי מבחינה חברתית בלבד',
    'ב': 'כי מצב חירום דורש פעולה מהירה ומדויקת, ובקשת עזרה מיידית עדיפה על ניסיון עצמאי שעלול לעכב טיפול מציל חיים',
    'ג': 'כי החוק אוסר על כך במפורש',
    'ד': 'זה מותר, כל עוד מתעדים זאת בדיווח'
  },
  correct: 'ב',
  explanation: {
    correct: 'בזמן לחץ קליני גבוה (החייאה, טראומה קשה) כל עיכוב עלול לפגוע בתוצאה הרפואית. העיקרון הוא לבקש עזרה מיד כשמזהים שפעולה חורגת מהיכולת, ולא לנסות "ללמוד תוך כדי" — הזמן קריטי מדי לניסוי וטעייה.',
    wrong: 'הסיבה אינה חברתית או חוקית פורמלית בלבד, אלא קלינית-בטיחותית ישירה; ותיעוד בדיעבד אינו מתקן עיכוב טיפול שכבר קרה בזמן אמת.'
  },
},
{
  id: 'GC_0026',
  source: 'generated', qtype: ['concept'], section: 'עבודת הצוות',
  question: 'באירוע שבו השתתפו גם צוות אמבולנס רגיל וגם צוות אט"ן, מי אחראי על מילוי הדיווח הרפואי?',
  multi: false,
  options: {
    'א': 'רק צוות האט"ן, כי הוא הבכיר ביותר',
    'ב': 'כל צוות ממלא דיווח בהתאם למעורבותו בטיפול, לפי הנוהל בפועל',
    'ג': 'רק הצוות שהגיע ראשון לזירה',
    'ד': 'אין צורך בדיווח כפול כלל'
  },
  correct: 'ב',
  explanation: {
    correct: 'הכלל שלפיו "רק צוות האט"ן הבכיר ממלא את הטופס הרפואי" אינו נכון — יש לבדוק ולפעול לפי הנוהל בפועל, כשכל צוות מתעד את הטיפול שביצע בהתאם למעורבותו.',
    wrong: 'הסתמכות בלעדית על בכירות הצוות מתעלמת מכך שגם צוותים אחרים ביצעו טיפול הדורש תיעוד; והצוות הראשון אינו בהכרח היחיד שטיפל; חובת התיעוד (חוק זכויות החולה) חלה על כל טיפול שניתן, ללא קשר למספר הצוותים בזירה.'
  },
},

// ---------------------------------------------------------
// SECTION: קבלת החלטות ודיווחים
// ---------------------------------------------------------
{
  id: 'GC_0027',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים', multi: true,
  question: 'אילו מהצירופים הבאים בין קידומת/סיומת לתרגום נכונים?',
  options: {
    'א': 'Tachy- = מהיר, Brady- = איטי',
    'ב': 'Hyper- = חוסר, Hypo- = עודף',
    'ג': '-pnea = נשימה, -cardia = דופק',
    'ד': 'Cyano- = כחול, Erythro- = אדום'
  },
  correct: ['א', 'ג', 'ד'],
  explanation: {
    correct: 'Tachy- פירושו מהיר ו-Brady- איטי; -pnea מציין נשימה ו--cardia דופק; Cyano- מציין כחול (כיחלון) ו-Erythro- אדום. כל אלו תרגומים נכונים מתוך רשימת הקידומות/סיומות הרפואיות הנפוצות.',
    wrong: 'הצירוף ההפוך הוא הנכון: Hyper- פירושו עודף ו-Hypo- פירושו חוסר — לא להפך כפי שנכתב באפשרות ב.'
  },
},
{
  id: 'GC_0028',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים',
  question: 'מטופל מציג בביתו כדורי ונטולין (סלבוטמול) וסינגולייר. לאיזו מחלת רקע סביר שהוא מטופל?',
  multi: false,
  options: {
    'א': 'סוכרת',
    'ב': 'אסתמה/COPD',
    'ג': 'יתר לחץ דם',
    'ד': 'בעיית קרישה'
  },
  correct: 'ב',
  explanation: {
    correct: 'ונטולין (סלבוטמול) וסינגולייר (מונטלוקאסט) הן תרופות נפוצות לטיפול באסתמה/COPD — מרחיבות סימפונות ומקטינות דלקת/רגישות בדרכי האוויר.',
    wrong: 'תרופות סוכרת טיפוסיות הן אינסולין/מטפורמין; יתר ל"ד מטופל במעכבי ACE/ARB/משתנים/חוסמי בטא; קרישה מטופלת במדללי דם כמו קלקסן/קומדין/אליקוויס — אף אחת מהקטגוריות הללו אינה תואמת את התרופות שבשאלה.'
  },
},
{
  id: 'GC_0029',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים',
  question: 'מה ההבדל בין תרופות "מונעות צבירה" (Anti-aggregants) ל"נוגדות קרישה" (Anti-coagulants)?',
  multi: false,
  options: {
    'א': 'אין הבדל — שני שמות לאותה קבוצת תרופות',
    'ב': 'Anti-aggregants (כמו אספירין, פלביקס) מונעות הצמדות טסיות; Anti-coagulants (כמו קלקסן, קומדין) מעכבות את שרשרת הקרישה החלבונית',
    'ג': 'Anti-aggregants ניתנות רק בזריקה; Anti-coagulants רק בכדור',
    'ד': 'Anti-coagulants משמשות רק לחולי סוכרת'
  },
  correct: 'ב',
  explanation: {
    correct: 'תרופות מונעות צבירה (Anti-aggregants) — כגון אספירין, פלביקס (קלופידוגרל), אפיאנט, ברילינטה — פועלות על טסיות הדם ומונעות את הצמדותן. תרופות נוגדות קרישה (Anti-coagulants) — כגון קלקסן, קומדין (וורפרין), הפרין, אליקוויס/קסרלטו, פרדקסה — פועלות על שרשרת גורמי הקרישה החלבונית בדם. שתי הקבוצות "מדללות דם" אך במנגנון שונה.',
    wrong: 'אלו שתי קבוצות תרופתיות שונות במנגנון, לא שם נרדף; קיימות תרופות בכל דרך מתן בשתי הקבוצות (כדורים וזריקות); ואין קשר בין הקבוצות לסוכרת — אלו תרופות המשמשות בעיקר למניעת אירועים לבביים/מוחיים ופקקת ורידים.'
  },
},
{
  id: 'GC_0030',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים', multi: true,
  question: 'אילו מהצירופים הבאים מייצגים נכון דרך מתן תרופה?',
  options: {
    'א': 'IV = תוך ורידי',
    'ב': 'PO = פומי (דרך הפה)',
    'ג': 'SC = תוך שרירי',
    'ד': 'SL = תת לשוני'
  },
  correct: ['א', 'ב', 'ד'],
  explanation: {
    correct: 'IV = תוך ורידי, PO = פומי (Per Os, דרך הפה), SL = תת לשוני — כל אלו נכונים. דרכי מתן נוספות: IM = תוך שרירי, SC = תת עורי.',
    wrong: 'SC אינו "תוך שרירי" — SC (Subcutaneous) פירושו תת-עורי; תוך שרירי מסומן כ-IM.'
  },
},
{
  id: 'GC_0031',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים',
  question: 'מבחינה משפטית, מה עדיף — הצהרה מילולית בדיעבד או תיעוד כתוב בזמן אמת?',
  multi: false,
  options: {
    'א': 'הצהרה מילולית תמיד גוברת, כי היא משקפת את מה שבאמת קרה',
    'ב': 'המילה הכתובה עדיפה/מחייבת — כוחה של הצהרה מילולית אינה גוברת עליה',
    'ג': 'שתיהן שוות משקל משפטי',
    'ד': 'תיעוד נדרש רק במקרי מוות, אחרת די בעדות בעל-פה'
  },
  correct: 'ב',
  explanation: {
    correct: 'המילה הכתובה (התיעוד הרפואי) עדיפה ומחייבת מבחינה משפטית — כוחה של הצהרה מילולית מאוחרת אינה גוברת על הרישום שנעשה בזמן אמת. זו הסיבה שתיעוד מדויק כה קריטי מבחינה משפטית ולא רק קלינית.',
    wrong: 'הצהרה מילולית בדיעבד אינה גוברת על תיעוד כתוב, לא ההפך; שתי הצורות אינן שוות משקל — לתיעוד הכתוב עדיפות ברורה; והחובה לתעד חלה על כל טיפול, לא רק מקרי מוות.'
  },
},
{
  id: 'GC_0032',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים', multi: true,
  question: 'אילו מהבאים הם סוגי הסכמה לטיפול רפואי, לפי הרלוונטי לעבודת חובש בשטח?',
  options: {
    'א': 'הסכמה בעל-פה (מטופל בהכרה)',
    'ב': 'הסכמה משוערת (מטופל מחוסר הכרה)',
    'ג': 'הסכמה בצו משפטי',
    'ד': 'הסכמה אוטומטית של כל אדם בגיר, גם בהתנגדות מפורשת'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'הסוגים המוכרים הם: הסכמה בעל-פה (כשהמטופל בהכרה ומסוגל לתקשר), הסכמה משוערת (כשהמטופל מחוסר הכרה — מניחים שהיה מסכים לטיפול מציל חיים), והסכמה בצו משפטי (מצבים חריגים כגון אשפוז כפוי).',
    wrong: 'אין "הסכמה אוטומטית" שמתעלמת מהתנגדות מפורשת של מטופל כשיר — מטופל כשיר וברור בהכרה שמסרב לטיפול, גם אם הדבר מסוכן לו, זכאי לסרב (בכפוף לתיעוד והסבר השלכות).'
  },
},
{
  id: 'GC_0033',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים',
  question: 'צוות מד"א הגיע לזירת תאונת דרכים ובה איש כוחות ביטחון פצוע. עיתונאי מבקש פרטים. מה מותר למסור?',
  multi: false,
  options: {
    'א': 'לתאר בקצרה את מצבו הרפואי ולציין שמדובר באיש כוחות ביטחון',
    'ב': 'אין למסור פרטים מזהים או לציין שהנפגע הוא איש כוחות ביטחון/אישיות ציבורית — כל התראיינות לתקשורת דורשת אישור/תדרוך של דובר מד"א',
    'ג': 'לתאר את נסיבות התאונה (פגע-וברח, שיכרות וכד\') אם ידוע',
    'ד': 'לענות רק אם העיתונאי מזדהה בתעודה'
  },
  correct: 'ב',
  explanation: {
    correct: 'קיים איסור מוחלט על צוותי מד"א להתראיין לתקשורת ללא אישור/תדרוך של דובר מד"א. אין לחשוף פרטים מזהים, אין לציין שנפגע הוא איש כוחות ביטחון/אישיות ציבורית בזירה אזרחית, ואין לדון בנסיבות תאונת הדרכים. באר"ן/מגה אר"ן — רק מנכ"ל/דובר מד"א מוסמכים למסור מידע לתקשורת.',
    wrong: 'תיאור מצב רפואי או ציון זהות איש ביטחון עלולים לחשוף מידע רגיש/מסכן; דיון בנסיבות התאונה חורג מתפקיד הצוות הרפואי; וזיהוי העיתונאי בתעודה אינו רלוונטי — האיסור הוא גורף וחל ללא קשר לזהות השואל.'
  },
},
{
  id: 'GC_0034',
  source: 'generated', qtype: ['concept'], section: 'קבלת החלטות ודיווחים', multi: true,
  question: 'אילו מהכללים הבאים נכונים לגבי טיפול בזירת פשע?',
  options: {
    'א': 'יש ללבוש כפפות ולהיצמד למסלול הליכה קבוע (כניסה ויציאה באותו מסלול)',
    'ב': 'ניתן לגזור חורי קליעה או סכין בבגד המטופל לצורך גישה מהירה',
    'ג': 'יש להימנע ממגע בחפצים שאינם קשורים לטיפול',
    'ד': 'יש לדווח מיידית למוקד על כל שיבוש שנעשה בזירה לצורכי החוקרים'
  },
  correct: ['א', 'ג', 'ד'],
  explanation: {
    correct: 'עקרונות טיפול בזירת פשע: לבישת כפפות, הליכה/יציאה באותו מסלול, הימנעות ממגע בחפצים לא קשורים לטיפול, ודיווח מיידי למוקד על כל שיבוש שנעשה בזירה — לשמירה על שרשרת הראיות.',
    wrong: 'אין לגזור חורי קליעה או סכין בבגד — יש לשמור על עדויות אלה כראיות פוטנציאליות (למשל טווח ירי), ולגזור סביבן בזהירות במקום דרכן.'
  },
},

// ---------------------------------------------------------
// SECTION: אנטומיה ופיזיולוגיה
// ---------------------------------------------------------
{
  id: 'GC_0035',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו סדר העברת האות בנוירון בודד, מרגע הקליטה ועד ההעברה לתא הבא?',
  multi: false,
  options: {
    'א': 'אקסון ← סומה ← דנדריט ← טרמינל',
    'ב': 'דנדריט ← סומה ← אקסון ← טרמינל',
    'ג': 'טרמינל ← אקסון ← סומה ← דנדריט',
    'ד': 'סומה ← דנדריט ← טרמינל ← אקסון'
  },
  correct: 'ב',
  explanation: {
    correct: 'המבנה התפקודי של נוירון: דנדריט (קליטת אות) ← סומה (גוף התא) ← אקסון (הולכת האות) ← טרמינל (העברה לתא הבא, דרך סינפסה).',
    wrong: 'כל שאר הסדרים הפוכים או מעורבבים ביחס לכיוון הפיזיולוגי הנכון של העברת האות בנוירון.'
  },
},
{
  id: 'GC_0036',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה', multi: true,
  question: 'אילו מהבאים מאפיינים את המערכת הסימפטטית ("Fight or Flight")?',
  options: {
    'א': 'האצת דופק והרחבת סמפונות',
    'ב': 'האטת דופק והפרשת רוק מוגברת',
    'ג': 'הרחבת אישונים',
    'ד': 'עצירת שתן/רוק'
  },
  correct: ['א', 'ג', 'ד'],
  explanation: {
    correct: 'המערכת הסימפטטית (הורמונים עיקריים: נוראדרנלין/אדרנלין) פועלת בתגובת "Fight or Flight": מאיצה דופק, מרחיבה סמפונות, מרחיבה אישונים, ועוצרת שתן/רוק ומאטה עיכול.',
    wrong: 'האטת דופק והפרשת רוק מוגברת מאפיינות דווקא את המערכת הפראסימפטטית (אצטילכולין, עצב הוואגוס) — התגובה ההפוכה, "מנוחה ועיכול".'
  },
},
{
  id: 'GC_0037',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו סדר שכבות ההגנה על המוח, מבחוץ פנימה?',
  multi: false,
  options: {
    'א': 'שיער ← קרקפת ← גולגולת ← דורה ← ארכנואיד ← פיה ← CSF',
    'ב': 'גולגולת ← שיער ← קרקפת ← פיה ← ארכנואיד ← דורה',
    'ג': 'CSF ← פיה ← ארכנואיד ← דורה ← גולגולת ← קרקפת ← שיער',
    'ד': 'דורה ← ארכנואיד ← פיה ← גולגולת ← קרקפת ← שיער'
  },
  correct: 'א',
  explanation: {
    correct: 'סדר שכבות ההגנה על המוח מבחוץ פנימה: שיער ← קרקפת ← גולגולת ← קרום הדורה (Dura) ← קרום העכבישי (Arachnoid) ← קרום הפיה (Pia) ← נוזל השדרה-מוח (CSF). הכרת הסדר חיונית להבנת מיקום סוגי הדימומים התוך-גולגולתיים (אפידורלי, סאבדורלי, סאב-ארכנואידלי).',
    wrong: 'שאר הסדרים אינם תואמים את המבנה האנטומי האמיתי — היפוך הסדר (מבפנים החוצה) או ערבוב של שכבות הוא טעות נפוצה שיכולה לבלבל בין סוגי הדימומים.'
  },
},
{
  id: 'GC_0038',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה', multi: true,
  question: 'התאם בין החלל האנטומי לסוג הדימום הפוטנציאלי: אילו מהצירופים הבאים נכונים?',
  options: {
    'א': 'בין גולגולת לדורה — דימום אפידורלי (עורקי)',
    'ב': 'בין דורה לארכנואיד — דימום סאבדורלי (ורידי)',
    'ג': 'בין ארכנואיד לפיה — דימום סאב-ארכנואידלי',
    'ד': 'בין פיה למוח — דימום אפידורלי'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'שלושת החללים הפוטנציאליים לדימום תוך-גולגולתי: גולגולת↔דורה — אפידורלי (עורקי, מהיר); דורה↔ארכנואיד — סאבדורלי (ורידי, איטי); ארכנואיד↔פיה — סאב-ארכנואידלי (חלל אמיתי, שם ה-CSF, יכול להיות עורקי או ורידי).',
    wrong: 'אין חלל "בין פיה למוח" בטקסונומיה הזו, ובכל מקרה דימום אפידורלי מוגדר דווקא בחלל שבין הגולגולת לדורה — לא בסמוך למוח עצמו.'
  },
},
{
  id: 'GC_0039',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו תפקיד הפלאורה ("קרום הריאה") בתהליך הנשימה?',
  multi: false,
  options: {
    'א': 'סינון חלקיקים מהאוויר הנכנס',
    'ב': 'שני קרומים עם נוזל סיכה ביניהם; התת-לחץ ביניהם חיוני לפעולת הנשימה',
    'ג': 'יצירת ATP לצורך נשימה תאית',
    'ד': 'מניעת כניסת מזון לקנה הנשימה'
  },
  correct: 'ב',
  explanation: {
    correct: 'הפלאורה מורכבת משני קרומים עם נוזל סיכה ביניהם. תת-הלחץ בין שני הקרומים הוא הכרחי לפעולת הנשימה — כשהוא מופר (למשל בחזה אוויר), הריאה עלולה לקרוס.',
    wrong: 'סינון האוויר הוא תפקיד דרכי האוויר העליונות; יצירת ATP היא נשימה תאית ברמת התא, לא הפלאורה; ומניעת כניסת מזון לקנה הנשימה היא תפקיד האפיגלוטיס.'
  },
},
{
  id: 'GC_0040',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו הגירוי העיקרי לנשימה אצל אדם בריא, ובמה שונה חולה COPD כרוני מבחינה זו?',
  multi: false,
  options: {
    'א': 'הגירוי העיקרי הוא ירידה ב-O2 גם באדם בריא וגם ב-COPD',
    'ב': 'הגירוי העיקרי הוא עלייה ב-CO2; בחלק מחולי COPD כרוני מתפתח Hypoxic Drive, שבו רמת O2 נמוכה הופכת לגירוי העיקרי',
    'ג': 'הגירוי לנשימה כלל אינו כימי אלא מכני בלבד',
    'ד': 'ב-COPD הגירוי הופך לתלוי אך ורק ב-CO2, ללא קשר ל-O2'
  },
  correct: 'ב',
  explanation: {
    correct: 'הגירוי העיקרי לנשימה במרכז הנשימה בגזע המוח הוא עלייה ברמת ה-CO2 (לא ירידה ב-O2). בחלק מחולי COPD כרוני (בעיקר סוג "הנפחן הכחול") מתפתח מנגנון מפצה שבו הגוף מסתגל לרמות CO2 גבוהות כרוניות, ורמת O2 נמוכה הופכת לגירוי העיקרי — מצב הנקרא Hypoxic Drive.',
    wrong: 'ירידה ב-O2 אינה הגירוי העיקרי אצל אדם בריא; הגירוי הוא כימי (רמת גזים בדם), לא מכני בלבד; וגם ב-COPD מדובר בשינוי יחסי במנגנון, לא בניתוק מוחלט מהשפעת CO2.'
  },
},
{
  id: 'GC_0041',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהם שני המרכיבים העיקריים של הדם, ומהו היחס המשוער ביניהם?',
  multi: false,
  options: {
    'א': 'פלסמה כ-55%, חלק תאי כ-45%',
    'ב': 'פלסמה כ-90%, חלק תאי כ-10%',
    'ג': 'רק תאי דם אדומים ולבנים, ללא פלסמה',
    'ד': 'פלסמה כ-20%, חלק תאי כ-80%'
  },
  correct: 'א',
  explanation: {
    correct: 'הדם מורכב מפלסמה (כ-55% מהנפח — מים, חלבונים וגורמי קרישה) וחלק תאי (כ-45% — תאי דם אדומים (RBC), תאי דם לבנים (WBC), וטסיות).',
    wrong: 'היחס ההפוך (90%/10%) אינו נכון; הדם אינו מורכב מתאים בלבד — הפלסמה מהווה למעלה ממחצית מנפח הדם; והיחס 20%/80% אינו תואם את הרכב הדם האמיתי.'
  },
},
{
  id: 'GC_0042',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'איזה סוג תאי דם לבנים (WBC) הוא השכיח ביותר בדם, מבין הבאים?',
  multi: false,
  options: {
    'א': 'לימפוציטים (35%)',
    'ב': 'גרנולוציטים (5%)',
    'ג': 'מונוציטים (60%)',
    'ד': 'טסיות דם'
  },
  correct: 'ג',
  explanation: {
    correct: 'התפלגות תאי הדם הלבנים: מונוציטים כ-60% (השכיחים ביותר), לימפוציטים כ-35%, גרנולוציטים כ-5%. כולם חלק ממערכת החיסון.',
    wrong: 'לימפוציטים וגרנולוציטים אינם השכיחים ביותר, לפי אותה התפלגות; וטסיות דם אינן WBC כלל — הן אחראיות לתהליך הקרישה, לא לחיסון.'
  },
},
{
  id: 'GC_0043',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מיהו התורם האוניברסלי ומיהו המקבל האוניברסלי בסיווג סוגי הדם ABO+Rh?',
  multi: false,
  options: {
    'א': 'תורם אוניברסלי — AB+; מקבל אוניברסלי — O-',
    'ב': 'תורם אוניברסלי — O-; מקבל אוניברסלי — AB+',
    'ג': 'תורם אוניברסלי — A+; מקבל אוניברסלי — B+',
    'ד': 'אין דבר כזה תורם/מקבל אוניברסלי'
  },
  correct: 'ב',
  explanation: {
    correct: 'O- (סוג דם O, שלילי Rh) הוא התורם האוניברסלי, כי הוא חסר אנטיגנים A, B ו-D שיכולים לעורר תגובה חיסונית. AB+ הוא המקבל האוניברסלי, כי הוא מכיל את כל האנטיגנים ולכן אינו מפתח נוגדנים נגד דם מתורם אחר.',
    wrong: 'הכיוון ההפוך (AB+ כתורם, O- כמקבל) שגוי — זה בדיוק להפך; וסוגי A+/B+ אינם תורמים/מקבלים אוניברסליים.'
  },
},
{
  id: 'GC_0044',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו ההבדל בין הדם בלב ימין לדם בלב שמאל?',
  multi: false,
  options: {
    'א': 'לב ימין מכיל דם עשיר בחמצן; לב שמאל דם עשיר ב-CO2',
    'ב': 'לב ימין מכיל דם עשיר ב-CO2 (חוזר מהגוף); לב שמאל מכיל דם עשיר בחמצן (חוזר מהריאות)',
    'ג': 'שני הצדדים מכילים תמיד את אותו הרכב דם',
    'ד': 'ההבדל תלוי רק בגיל המטופל'
  },
  correct: 'ב',
  explanation: {
    correct: 'לב ימין מקבל דם עשיר ב-CO2 שחוזר מהגוף (דרך הוורידים הנבובים) ושולח אותו לריאות. לב שמאל מקבל דם עשיר בחמצן שחוזר מהריאות ושואב אותו החוצה לכל הגוף (דרך אבי העורקים). זו הסיבה ששריר החדר השמאלי עבה יותר — עליו לדחוף דם למרחק גדול יותר בגוף כולו.',
    wrong: 'ההרכב אינו זהה בשני הצדדים — זה בדיוק ההבדל הפונקציונלי המרכזי בין מחזור הדם הגדול לקטן; ואין קשר בין ההבדל הזה לגיל המטופל.'
  },
},
{
  id: 'GC_0045',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'באיזה שלב של מחזור הלב מתמלאים כלי הדם הקורונריים (המזינים את שריר הלב עצמו)?',
  multi: false,
  options: {
    'א': 'בזמן הסיסטולה (כיווץ)',
    'ב': 'בזמן הדיאסטולה (הרפיה/מילוי)',
    'ג': 'בזמן ה-Lucid Interval',
    'ד': 'אינם תלויים בשלב מחזור הלב'
  },
  correct: 'ב',
  explanation: {
    correct: 'כלי הדם הקורונריים, היוצאים מאבי העורקים, מתמלאים בעיקר בזמן הדיאסטולה (הרפיית הלב, המהווה כ-2/3 ממחזור הלב). זו הסיבה שקצב לב מהיר מדי (טכיקרדיה קיצונית) עלול לפגוע באספקת הדם לשריר הלב עצמו — פחות זמן דיאסטולה = פחות זמן מילוי קורונרי.',
    wrong: 'בזמן הסיסטולה הלב מתכווץ ודוחף דם החוצה, לא מתמלא בעצמו; "Lucid Interval" הוא מונח שקשור לפגיעת ראש, לא למחזור הלב; ומילוי כלי הדם הקורונריים תלוי במפורש בשלב מחזור הלב.'
  },
},
{
  id: 'GC_0046',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו מספר החוליות בכל חלק של עמוד השדרה?',
  multi: false,
  options: {
    'א': 'צווארי 7, חזי 12, מותני 5',
    'ב': 'צווארי 12, חזי 7, מותני 5',
    'ג': 'צווארי 5, חזי 12, מותני 7',
    'ד': 'צווארי 7, חזי 5, מותני 12'
  },
  correct: 'א',
  explanation: {
    correct: 'עמוד השדרה מורכב מ: צווארי (7 חוליות), חזי (12), מותני (5), עצתי (5, מאוחות לעצם אחת), וזנבי. סה"כ 33 חוליות בסך הכול, כאשר 24 מהן נעות באופן עצמאי (צווארי+חזי+מותני).',
    wrong: 'כל הצירופים האחרים מחליפים בין המספרים הנכונים לחלקים השונים של עמוד השדרה — יש לזכור את הרצף 7-12-5.'
  },
},
{
  id: 'GC_0047',
  source: 'generated', qtype: ['concept'], section: 'אנטומיה ופיזיולוגיה',
  question: 'מהו סדר שכבות העור מבחוץ פנימה?',
  multi: false,
  options: {
    'א': 'אפידרמיס ← דרמיס ← היפודרמיס (סאבקוטן)',
    'ב': 'דרמיס ← אפידרמיס ← היפודרמיס',
    'ג': 'היפודרמיס ← דרמיס ← אפידרמיס',
    'ד': 'אפידרמיס ← היפודרמיס ← דרמיס'
  },
  correct: 'א',
  explanation: {
    correct: 'סדר שכבות העור מבחוץ פנימה: אפידרמיס (חיצוני) ← דרמיס ← היפודרמיס/סאבקוטן (פנימי). הבנת הסדר חשובה להערכת עומק כוויות ופציעות עור.',
    wrong: 'שאר הסדרים הופכים את הכיוון הנכון (מבפנים החוצה או ערבוב שכבות) ואינם תואמים את המבנה האנטומי בפועל.'
  },
},

// ---------------------------------------------------------
// SECTION: החייאה
// ---------------------------------------------------------
{
  id: 'GC_0048',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'מטופל מחוסר הכרה מציג נשימות איטיות, קצרות ולא סדירות שנראות כמו "נחירות" (Gasping). מה המשמעות הקלינית?',
  multi: false,
  options: {
    'א': 'זהו סימן שהמטופל נושם באופן תקין ואין צורך בהתערבות',
    'ב': 'נשימות אגונליות (Gasping) נחשבות דום לב לכל דבר ומחייבות החייאה מיידית',
    'ג': 'יש להמתין דקה נוספת לפני קבלת החלטה',
    'ד': 'זהו סימן להתאוששות קרובה מדום לב'
  },
  correct: 'ב',
  explanation: {
    correct: 'Gasping (נשימות אגונליות) נחשבות דום לב לכל דבר ולא נשימה תקינה, ולכן מחייבות התחלת החייאה מיידית — לא המתנה. זו טעות נפוצה וחמורה בזיהוי דום לב בשטח.',
    wrong: 'Gasping אינה נשימה תקינה כלל; המתנה נוספת מעכבת החייאה מצילת חיים; וזו אינה סימן להתאוששות — להפך, זהו סימן דום לב פעיל.'
  },
},
{
  id: 'GC_0049',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'מטפל יחיד מזהה דום לב בילד ואין באפשרותו לקרוא לעזרה תוך כדי טיפול. מה סדר הפעולות הנכון?',
  multi: false,
  options: {
    'א': 'להזעיק עזרה מיד, ורק אח"כ להתחיל עיסויים (כמו במבוגר)',
    'ב': 'להתחיל 2 דקות עיסויים לפני הזעקת עזרה (בשונה ממבוגר)',
    'ג': 'לוותר על הזעקת עזרה כליל אם המטפל בודד',
    'ד': 'להתחיל בהנשמות בלבד למשך 2 דקות לפני עיסויים'
  },
  correct: 'ב',
  explanation: {
    correct: 'בילדים, מטפל יחיד מתחיל בכ-2 דקות עיסויים לפני שהוא עוצר להזעיק עזרה — בשונה ממבוגר, שם מזעיקים עזרה מיד עם הזיהוי. ההיגיון: דום לב בילדים נובע לרוב מבעיה נשימתית (היפוקסיה) ולא ראשונית-לבבית, כך שדקות ראשונות של החייאה איכותית עדיפות.',
    wrong: 'הזעקת עזרה מיידית היא הפרוטוקול הנכון למבוגר, לא לילד; ויתור מוחלט על הזעקת עזרה מסכן את המשך הטיפול; והתחלה בהנשמות בלבד ללא עיסויים אינה תואמת את פרוטוקול ה-C-A-B.'
  },
},
{
  id: 'GC_0050',
  source: 'generated', qtype: ['concept'], section: 'החייאה', multi: true,
  question: 'אילו מהעומקים הבאים תואמים נכון לעיסויי חזה לפי קבוצת גיל?',
  options: {
    'א': 'מבוגר: 5-6 ס"מ',
    'ב': 'ילד: לפחות 5 ס"מ',
    'ג': 'תינוק: לפחות 4 ס"מ',
    'ד': 'יילוד: לפחות 8 ס"מ'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'עומקי עיסוי חזה: מבוגר — 5-6 ס"מ (יד אחת על גבי השנייה, מרכז בית החזה). ילד — לפחות 5 ס"מ (יד אחת/שתיים). תינוק — לפחות 4 ס"מ (שני אגודלים). יילוד — לפחות 1/3 מעומק בית החזה (לא ערך קבוע ב-ס"מ).',
    wrong: 'ליילוד אין ערך קבוע כמו 8 ס"מ — העומק הנדרש ביילוד הוא יחסי (לפחות שליש מעומק בית החזה שלו), לא מספר סנטימטרים קבוע כמו בקבוצות הגיל האחרות.'
  },
},
{
  id: 'GC_0051',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'היכן בודקים דופק מרכזי בילד (לא תינוק), במסגרת החייאה?',
  multi: false,
  options: {
    'א': 'קרוטיד או ברכיאלי',
    'ב': 'רדיאלי בלבד',
    'ג': 'דורסליס פדיס בלבד',
    'ד': 'אין צורך לבדוק דופק בילדים'
  },
  correct: 'א',
  explanation: {
    correct: 'בילדים (בשונה מתינוקות) בודקים דופק מרכזי בקרוטיד או בברכיאלי — עד 10 שניות. בתינוקות בודקים ברכיאלי בלבד (בשל צוואר קצר וקושי במישוש קרוטיד).',
    wrong: 'רדיאלי ודורסליס פדיס הם דפקים פריפריים, לא מרכזיים, ואינם משמשים לבדיקה ראשונית בהחייאה; ובדיקת דופק היא שלב חיוני וחובה בזיהוי דום לב.'
  },
},
{
  id: 'GC_0052',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'כיצד ממקמים מדבקות דפיברילטור בילדים קטנים/תינוקות, בשונה ממבוגר?',
  multi: false,
  options: {
    'א': 'שתי מדבקות בחזה הקדמי בלבד, כמו במבוגר',
    'ב': 'מדבקה אחת קדמית ואחת בגב (בשל שטח חזה קטן יותר)',
    'ג': 'אין להשתמש בדפיברילטור כלל בגילאים אלו',
    'ד': 'שתי מדבקות על הגב בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'בילדים קטנים/תינוקות, שטח החזה קטן מדי כדי למקם שתי מדבקות בחזה הקדמי מבלי שיגעו זו בזו — לכן ממקמים מדבקה אחת קדמית (חזה) ואחת בגב (Anterior-Posterior).',
    wrong: 'מיקום שתי מדבקות בחזה הקדמי (כמו במבוגר) מתאים לילדים גדולים/מבוגרים בלבד; דפיברילציה כן מותרת ומומלצת גם בגילאים צעירים כשקיים חשד להפרעת קצב בת-שוק; ומיקום שתי מדבקות על הגב בלבד אינו הפרוטוקול המקובל.'
  },
},
{
  id: 'GC_0053',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'מטפל יחיד ללא הכשרה רפואית מזהה דום לב במבוגר ברחוב. איזו גישת החייאה מקובלת עבורו?',
  multi: false,
  options: {
    'א': 'Hands-Only CPR — עיסויים בלבד, ללא הנשמות',
    'ב': 'להימנע מכל התערבות עד הגעת צוות מקצועי',
    'ג': 'הנשמות בלבד ללא עיסויים',
    'ד': 'יש לו חובה חוקית לבצע רק דפיברילציה, לא עיסויים'
  },
  correct: 'א',
  explanation: {
    correct: 'עבור מטפל יחיד ללא הכשרה מקצועית, Hands-Only CPR (עיסויי חזה בלבד, ללא הנשמות) הוא הגישה המקובלת — קלה יותר ליישום ועדיין מספקת תמיכה משמעותית לזרימת הדם עד הגעת עזרה מקצועית.',
    wrong: 'הימנעות מוחלטת מהתערבות פוגעת בסיכויי ההישרדות; הנשמות בלבד ללא עיסויים אינן הגישה המומלצת למי שאינו מיומן; ואין חובה חוקית המצמצמת פעולה לדפיברילציה בלבד.'
  },
},
{
  id: 'GC_0054',
  source: 'generated', qtype: ['concept'], section: 'החייאה', multi: true,
  question: 'אילו מההתאמות הבאות להחייאה במצבים מיוחדים נכונות?',
  options: {
    'א': 'אנפילקסיס — אפיפן IM בהקדם, לא על חשבון עיסויים',
    'ב': 'טביעה — סדר C-B-A, בדגש על עיסויים ולא הנשמות',
    'ג': 'הריון — עיסויים גבוה יותר על בית החזה + הטיית רחם שמאלה',
    'ד': 'אסתמה — הנשמה מופחתת בקצב 6-8 לדקה'
  },
  correct: ['א', 'ג', 'ד'],
  explanation: {
    correct: 'התאמות מוכרות: אנפילקסיס — מתן אדרנלין IM בהקדם האפשרי, מבלי לפגוע ברצף העיסויים; הריון — עיסויים במיקום מעט גבוה יותר בחזה, בשילוב הטיית לוח שדרה/רחם שמאלה למניעת לחץ על הווריד הנבוב; אסתמה — הנשמה בקצב מופחת (6-8/דקה) בשל הסיכון לאגירת אוויר (Air Trapping).',
    wrong: 'בטביעה הסדר הוא דווקא A-B-C (לא C-B-A), בדגש על הנשמות ולא על עיסויים בלבד — כי הגורם לדום הלב הוא לרוב היפוקסיה מחוסר חמצן, ולכן שחזור נתיב אוויר והנשמה הם השלב הקריטי הראשון.'
  },
},
{
  id: 'GC_0055',
  source: 'generated', qtype: ['concept'], section: 'החייאה',
  question: 'מהן שלוש שאלות ההערכה המיידית לילוד לאחר הלידה?',
  multi: false,
  options: {
    'א': 'נולד במועד? נושם/בוכה? טונוס תקין?',
    'ב': 'משקל תקין? צבע עור תקין? דופק תקין?',
    'ג': 'האם היולדת יציבה? כמה זמן ארכה הלידה? האם היו סיבוכים?',
    'ד': 'האם השליה יצאה? האם חבל הטבור תקין? האם יש דימום?'
  },
  correct: 'א',
  explanation: {
    correct: 'שלוש שאלות ההערכה המיידית של ילוד: נולד במועד? נושם/בוכה? טונוס תקין? אם התשובה "לא" לאחת מהן — יש לחמם ולייבש, לפתוח נתיב אוויר ולגרות לנשימה.',
    wrong: 'שאר האפשרויות מתייחסות למידע חשוב אך אינן שלוש שאלות ההערכה המיידית התקניות של הילוד עצמו מיד לאחר הלידה.'
  },
},
{
  id: 'GC_0056',
  source: 'generated', qtype: ['scenario'], section: 'החייאה',
  question: 'תינוק בן 6 חודשים חונק, לא משמיע קול, לא משתעל ולא בוכה. הוא בהכרה. מה תעשה?',
  multi: false,
  options: {
    'א': 'לחיצות ברום הבטן (היימליך) כמו במבוגר',
    'ב': '5 טפיחות בין השכמות ולאחריהן 5 לחיצות חזה, בסבב חוזר עד יציאת הגוף הזר או איבוד הכרה',
    'ג': 'להפוך את התינוק ולנער אותו בחוזקה',
    'ד': 'להמתין ולראות אם הוא ישתעל את הגוף הזר החוצה'
  },
  correct: 'ב',
  explanation: {
    correct: 'בחסימת נתיב אוויר חמורה (ללא קול/שיעול/בכי) בתינוק, מבצעים סבב חוזר של 5 טפיחות בין השכמות ולאחריהן 5 לחיצות חזה — לא לחיצות ברום הבטן כמו במבוגר/ילד, בשל הסיכון לפגיעה באיברים פנימיים בתינוק.',
    wrong: 'היימליך (לחיצות ברום הבטן) אינו מתאים לתינוקות; ניעור התינוק עלול לגרום נזק חמור (כולל תסמונת התינוק המנוער); והמתנה פסיבית בחסימה חמורה (ללא קול/שיעול) מסכנת חיים — יש להתערב מיד.'
  },
},
{
  id: 'GC_0057',
  source: 'generated', qtype: ['scenario'], section: 'החייאה',
  question: 'עדים ראו אדם קורס פתאום לרצפה בדום לב מול עיניהם ("קריסה נצפית"). דפיברילטור זמין באתר. מה סדר הפעולות המומלץ?',
  multi: false,
  options: {
    'א': 'לחבר את הדפיברילטור באופן מיידי, לפני תחילת עיסויים ממושכים',
    'ב': 'לבצע 2 דקות עיסויים לפני חיבור הדפיברילטור, בכל מקרה',
    'ג': 'להימנע מדפיברילטור לחלוטין ולהמשיך רק בעיסויים',
    'ד': 'להמתין להגעת צוות רפואי בלבד לפני כל פעולה'
  },
  correct: 'א',
  explanation: {
    correct: 'בקריסה נצפית (עדים ראו את האירוע קורה), יש לחבר את הדפיברילטור באופן מיידי — הסיכוי להפרעת קצב בת-שוק גבוה יותר מוקדם באירוע. בקריסה שאינה נצפית (לא ידוע מתי בדיוק החל דום הלב), נהוג לבצע כ-2 דקות עיסויים לפני חיבור, אם אין אפשרות לבצע את שתי הפעולות במקביל.',
    wrong: 'המתנה 2 דקות בכל מקרה מתעלמת מההבחנה החשובה בין קריסה נצפית ללא-נצפית; הימנעות מדפיברילטור פוגעת בסיכויי ההישרדות; והמתנה פסיבית להגעת צוות רפואי מבזבזת דקות קריטיות שבהן ניתן להציל חיים.'
  },
},

// ---------------------------------------------------------
// SECTION: הטיפול בחולה
// ---------------------------------------------------------
{
  id: 'GC_0058',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם ארבעת המרכיבים של בדיקת FAST לחשד שבץ מוחי, ומה חשוב לזכור לגביה?',
  multi: false,
  options: {
    'א': 'Face, Arm, Speech, Time — ו-"Sight" (ראייה) אינו חלק ממנה',
    'ב': 'Face, Arm, Sight, Time',
    'ג': 'Feeling, Awareness, Strength, Time',
    'ד': 'Face, Ataxia, Speech, Temperature'
  },
  correct: 'א',
  explanation: {
    correct: 'FAST כולל: Face (חיוך/צניחת פנים), Arm (השמטת זרוע), Speech (דיבור מבולבל), Time (זמן הופעת תסמינים). חשוב לזכור ש-"Sight" (בעיות ראייה) אינו חלק רשמי מ-FAST, למרות שהוא סימן אפשרי לשבץ בפני עצמו.',
    wrong: 'שאר האפשרויות מחליפות רכיבים במונחים לא-רלוונטיים (Sight, Feeling/Awareness/Strength, Ataxia/Temperature) שאינם חלק מהראשי-תיבות FAST כפי שנלמד.'
  },
},
{
  id: 'GC_0059',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם ארבעת השלבים בסולם AVPU להערכת מצב הכרה?',
  multi: false,
  options: {
    'א': 'Alert, Voice, Pain, Unresponsive',
    'ב': 'Awake, Verbal, Pulse, Unstable',
    'ג': 'Alert, Vital, Perfusion, Unconscious',
    'ד': 'Anxious, Verbal, Painful, Unresponsive'
  },
  correct: 'א',
  explanation: {
    correct: 'AVPU: Alert (ער ומגיב באופן ספונטני), Voice (מגיב לקול), Pain (מגיב לכאב בלבד), Unresponsive (אינו מגיב כלל). זהו כלי מהיר להערכת רמת הכרה בסקר הראשוני.',
    wrong: 'שאר הצירופים משתמשים במונחים לא-נכונים (Verbal/Pulse/Vital/Perfusion/Anxious) שאינם חלק מסולם AVPU המקורי.'
  },
},
{
  id: 'GC_0060',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהו הערך המקובל להגדרת היפוגליקמיה?',
  multi: false,
  options: {
    'א': 'סוכר מתחת ל-60 מ"ג/ד"ל',
    'ב': 'סוכר מתחת ל-100 מ"ג/ד"ל',
    'ג': 'סוכר מעל 180 מ"ג/ד"ל',
    'ד': 'סוכר מעל 60 מ"ג/ד"ל'
  },
  correct: 'א',
  explanation: {
    correct: 'היפוגליקמיה מוגדרת כרמת סוכר בדם מתחת ל-60 מ"ג/ד"ל. בכל שינוי הכרה יש חובה לבצע בדיקת סוכר, כי היפוגליקמיה עלולה לחקות מצבים רבים אחרים (כולל שבץ מוחי).',
    wrong: '100 מ"ג/ד"ל הוא ערך קרוב לגבול העליון של תקין, לא הגבול התחתון להיפוגליקמיה; ורמות מעל 60/180 אינן מגדירות היפוגליקמיה — להפך, הן מרמזות על תקינות או היפרגליקמיה.'
  },
},
{
  id: 'GC_0061',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מה מייצג הראשי-תיבות SAMPLE באנמנזה רפואית?',
  multi: false,
  options: {
    'א': 'Signs/Symptoms, Allergies, Medications, Past history, Last oral intake, Events leading to injury',
    'ב': 'Site, Awareness, Motion, Pain, Location, Emergency',
    'ג': 'Symptoms, Age, Medical history, Pulse, Location, Examination',
    'ד': 'Severity, Anxiety, Mobility, Pain, Level of consciousness, Exam'
  },
  correct: 'א',
  explanation: {
    correct: 'SAMPLE: Signs/Symptoms (תסמינים), Allergies (רגישויות), Medications (תרופות), Past history (עבר רפואי), Last oral intake (אכילה/שתייה אחרונה), Events leading to injury (נסיבות המקרה). כלי מרכזי לאנמנזה מקיפה.',
    wrong: 'שאר האפשרויות מייצרות ראשי-תיבות שגויים שאינם תואמים למונחים המקוריים של SAMPLE.'
  },
},
{
  id: 'GC_0062',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מטופל עם בצקת ריאות חריפה (אי ספיקת לב שמאל) — מהי התנוחה הנכונה לטיפול בו?',
  multi: false,
  options: {
    'א': 'השכבה מלאה + הרמת רגליים',
    'ב': 'הושבה ב-30 מעלות; אין להרים רגליים ואין להשכיב',
    'ג': 'שכיבה על הצד השמאלי',
    'ד': 'עמידה מלאה ללא נשען'
  },
  correct: 'ב',
  explanation: {
    correct: 'בבצקת ריאות/הלם קרדיוגני, התנוחה הנכונה היא הושבה (בסביבות 30 מעלות) — הרמת רגליים או השכבה מלאה תגביר את החזר הדם הורידי ללב שכבר עמוס, ותחמיר את מצוקת הנשימה.',
    wrong: 'הרמת רגליים או השכבה מלאה מגבירות את העומס על לב חלש; שכיבה על הצד השמאלי היא התנוחה המומלצת בהריון (לא בבצקת ריאות); ועמידה מלאה ללא תמיכה אינה מספקת נוחות נשימתית למטופל במצוקה.'
  },
},
{
  id: 'GC_0063',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה', multi: true,
  question: 'אילו מהמצבים הבאים מתאימים לפינוי מסוק, לפי הקריטריונים שנלמדו?',
  options: {
    'א': 'נפגע לכוד',
    'ב': 'פצוע ראש/כוויות',
    'ג': 'שבץ טרי או MI חריף',
    'ד': 'פצע שטחי קל ללא סימני מצוקה'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'קריטריונים לשקילת פינוי מסוק: נפגע לכוד, פצועי ראש/כוויות, שבץ טרי, MI חריף, ופינוי אר"ן (אירוע רב-נפגעים). אלו מצבים שבהם חיסכון בזמן פינוי קריטי ביותר.',
    wrong: 'פצע שטחי קל ללא סימני מצוקה אינו מצדיק פינוי מסוק — משאב יקר וטעון תיאום שיש לשמור למקרים שבהם ההבדל בזמן ההגעה לבי"ח באמת קריטי לתוצאה הקלינית.'
  },
},
{
  id: 'GC_0064',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מטופל בגיר וכשיר מסרב לפינוי לבי"ח, למרות שהמלצת הצוות היא פינוי. מה על הצוות לעשות?',
  multi: false,
  options: {
    'א': 'לפנות בכוח בניגוד לרצונו',
    'ב': 'להסביר את ההשלכות, לתעד את הסירוב ולהחתים את המטופל',
    'ג': 'לעזוב מיד ללא כל תיעוד',
    'ד': 'להזעיק משטרה אוטומטית בכל מקרה סירוב'
  },
  correct: 'ב',
  explanation: {
    correct: 'מטופל כשיר רשאי לסרב לטיפול/פינוי. הצוות חייב להסביר לו את ההשלכות האפשריות של הסירוב, לתעד זאת בפירוט, ולהחתימו על טופס סירוב. אם המטופל קטין או אינו כשיר, יש לפנות לאפוטרופוס. בסכנת חיים חמורה — יש להזעיק אט"ן ולהמתין להערכה נוספת.',
    wrong: 'פינוי בכפייה של מטופל כשיר מהווה תקיפה; היעדר תיעוד חושף את הצוות לאחריות משפטית ומהווה כשלעצמו רשלנות; והזעקת משטרה אינה אוטומטית בכל סירוב — רק כשקיימת התנגדות אקטיבית/סכנה או קטין ללא אפוטרופוס זמין.'
  },
},

// ---------------------------------------------------------
// SECTION: מצבי חירום נשימתיים
// ---------------------------------------------------------
{
  id: 'GC_0065',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהו המנגנון הפתופיזיולוגי המרכזי בהתקף אסתמה?',
  multi: false,
  options: {
    'א': 'הפרשת היסטמין ← התכווצות והיצרות סמפונות ← אגירת CO2',
    'ב': 'פגיעה בקרום הפלאורה ← קריסת ריאה',
    'ג': 'חסימת עורק ריאתי ע"י קריש דם',
    'ד': 'זיהום חיידקי בנאדיות הריאה'
  },
  correct: 'א',
  explanation: {
    correct: 'באסתמה, הפרשת היסטמין גורמת להתכווצות והיצרות סמפונות, מה שמוביל לאגירת CO2 (Air Trapping) ולקושי בנשיפה בפרט. הסימנים הקלאסיים: צפצופים, שיעול, אקספיריום (נשיפה) מוארך.',
    wrong: 'פגיעה בפלאורה מתארת חזה אוויר, לא אסתמה; חסימת עורק ריאתי ע"י קריש דם מתארת תסחיף ריאתי (PE); וזיהום חיידקי בנאדיות מתאר דלקת ריאות — כל אלו מנגנונים שונים לחלוטין.'
  },
},
{
  id: 'GC_0066',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מה ההבדל הקליני בין "הנשפן הוורוד" (נפחת) ל"הנפחן הכחול" (ברונכיטיס כרוני)?',
  multi: false,
  options: {
    'א': 'שני הכינויים מתארים בדיוק אותה תמונה קלינית',
    'ב': 'נפחת — חולה רזה, חזה חביתי, Clubbing; ברונכיטיס כרוני — עודף משקל, כיח רב, שיעול ממושך, נטייה גבוהה יותר ל-Hypoxic Drive',
    'ג': 'נפחת מופיעה רק בנשים; ברונכיטיס כרוני רק בגברים',
    'ד': 'נפחת היא מחלה זיהומית; ברונכיטיס כרוני היא מחלה גנטית בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'נפחת (Emphysema, "הנשפן הוורוד") מאופיינת בחולה רזה, חזה חביתי, ו-Clubbing (עיוות באצבעות), עם הרס נאדיות וירידה בשטח שחלוף גזים. ברונכיטיס כרוני ("הנפחן הכחול") מאופיין בשיעול ממושך (מעל 3 חודשים, שנתיים רצופות), עודף משקל, עייפות וכיח רב, וחלק מהחולים מפתחים Hypoxic Drive.',
    wrong: 'אלו שני זנים קליניים שונים בתוך משפחת ה-COPD, לא שם נרדף לאותה תמונה; אין קשר בין הזנים למין המטופל; ושתי המחלות קשורות בעיקר לעישון כבד/זיהום אוויר, לא לגורם זיהומי או גנטי בלעדי.'
  },
},
{
  id: 'GC_0067',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם התנאים למתן תמיסת אינהלציה (ונטולין+אירובנט+סליין) ע"י חובש בשטח?',
  multi: false,
  options: {
    'א': 'ניתן לתת תמיד, ללא כל תנאי נוסף',
    'ב': 'רק אם זמן פינוי/חבירה לאט"ן צפוי מעל 15-20 דקות, ובאישור מוקד רפואי',
    'ג': 'רק אם המטופל מסרב לפינוי',
    'ד': 'רק לילדים מתחת לגיל 5'
  },
  correct: 'ב',
  explanation: {
    correct: 'מתן תמיסת אינהלציה (0.5cc ונטולין + 1cc אירובנט + 2cc סליין) ע"י החובש מותנה בכך שזמן הפינוי/החבירה לאט"ן צפוי לעלות על 15-20 דקות, ובאישור מוקד רפואי.',
    wrong: 'אין לתת תמיד ללא תנאי — קיים אישור נדרש ותנאי זמן; מתן התרופה אינו קשור לסירוב פינוי; והתנאי אינו מוגבל לגיל ילדים — הוא חל על מבוגרים באותה מידה.'
  },
},
{
  id: 'GC_0068',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה', multi: true,
  question: 'אילו מהבאים הם גורמי סיכון מוכרים לתסחיף ריאתי (PE)?',
  options: {
    'א': 'ניתוח לאחרונה או שכיבה ממושכת',
    'ב': 'הריון',
    'ג': 'שברי אגן/ירך',
    'ד': 'פעילות גופנית סדירה'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'גורמי סיכון ל-PE: נסיעה ממושכת, ניתוח לאחרונה, שכיבה ממושכת, הריון, שברים (אגן/ירך), סרטן, גלולות+עישון, קריש בורידי רגל עמוקים, ופרפור פרוזדורים — כולם מצבים המעודדים היווצרות קרישי דם או שחרורם.',
    wrong: 'פעילות גופנית סדירה אינה גורם סיכון ל-PE — להפך, חוסר תנועה/שכיבה ממושכת הוא הגורם הבעייתי, שכן תנועה תקינה מסייעת בזרימת דם ורידית ומונעת היווצרות קרישים.'
  },
},
{
  id: 'GC_0069',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מטופל עם חשד לתסחיף ריאתי (PE) מציג לחץ דם סיסטולי 82. מהי הגישה הנכונה למתן נוזלים במקרה זה?',
  multi: false,
  options: {
    'א': 'אין לתת נוזלים בשום מצב ב-PE',
    'ב': 'ניתן לתת נוזלים במהלך הפינוי בלבד, כיוון שהמטופל לא יציב המודינמית (ל"ד<90)',
    'ג': 'יש לעכב את הפינוי כדי לתת נוזלים לפני היציאה',
    'ד': 'יש לתת נוזלים רק אם המטופל בהכרה מלאה'
  },
  correct: 'ב',
  explanation: {
    correct: 'ב-PE, כאשר המטופל אינו יציב המודינמית (ל"ד סיסטולי מתחת ל-90), ניתן לתת נוזלים — אך זאת רק במהלך הפינוי, ולעולם לא לעכב את הפינוי עצמו לצורך כך.',
    wrong: 'קיימות נסיבות שבהן כן ניתנים נוזלים ב-PE (אי-יציבות המודינמית); עיכוב הפינוי לצורך עירוי הוא טעות עקרונית שנשנית בכל תרחישי הנוזלים; ומצב ההכרה של המטופל אינו הקריטריון הקובע למתן נוזלים כאן — הקריטריון הוא היציבות ההמודינמית.'
  },
},
{
  id: 'GC_0070',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מדוע אין לחסום את פני המטופל בשקית (Paper Bag Rebreathing) כטיפול באוורור יתר (Hyperventilation)?',
  multi: false,
  options: {
    'א': 'זו שיטה יעילה ומומלצת ואין סיבה להימנע ממנה',
    'ב': 'זו טכניקה מסוכנת — אבחנה שגויה עלולה להסתיר גורם חמור אחר (כגון היפוקסיה אמיתית או חמצת), במקום להעלים חרדה בלבד',
    'ג': 'זה אסור רק בילדים',
    'ד': 'זה גורם תמיד להתעלפות מיידית'
  },
  correct: 'ב',
  explanation: {
    correct: 'חסימת פנים בשקית עלולה למנוע זיהוי וטיפול בגורם חמור אמיתי שמסתתר מאחורי תמונה שנראית כמו "סתם חרדה" — למשל בעיה מטבולית או נשימתית אחרת שדורשת חמצן, לא הגבלתו. הטיפול המומלץ הוא הרגעה, ABC, וחמצן במסכת העשרה במידת הצורך.',
    wrong: 'זו אינה שיטה מומלצת בשום צורה כיום; האיסור אינו תלוי גיל — הוא עקרוני לכל מטופל; ואין תוצאה אחידה כמו התעלפות מיידית — הסכנה היא באבחנה השגויה, לא בתופעה גופנית מסוימת.'
  },
},
{
  id: 'GC_0071',
  source: 'generated', qtype: ['scenario'], section: 'הטיפול בחולה',
  question: 'הוזעקת לנער בן 16 עם היסטוריה של אסתמה, יושב בתנוחת Tripod, מתקשה להשלים משפט, עם צפצופים ושימוש בשרירי עזר. מה תעשה?',
  multi: false,
  options: {
    'א': 'להשכיב אותו ולחכות שהתקף יחלוף מעצמו',
    'ב': 'ABC, הושבה+הרגעה, סיוע במשאף שלו/אינהלציה, חמצן/הנשמה מסייעת לפי הצורך, פינוי דחוף/חבירה לאט"ן',
    'ג': 'לתת לו אספירין ללעיסה',
    'ד': 'להחדיר מנתב אוויר אורלי מיידית'
  },
  correct: 'ב',
  explanation: {
    correct: 'תמונה קלאסית של התקף אסתמה חמור: תנוחת Tripod, אי-השלמת משפטים, שימוש בשרירי עזר — סימני מצוקה נשימתית חריפה. הטיפול: ABC, הושבה והרגעה, סיוע במשאף/אינהלציה, חמצן או הנשמה מסייעת לפי הצורך, ופינוי דחוף/חבירה לאט"ן.',
    wrong: 'השכבה מחמירה מצוקה נשימתית — יש להושיב; אספירין הוא טיפול לחשד ACS, לא לאסתמה; ומנתב אוויר אורלי משמש רק במחוסרי הכרה ללא רפלקס הקאה — נער בהכרה מלאה אינו מועמד לכך.'
  },
},

// ---------------------------------------------------------
// SECTION: מחלות לב וכלי דם
// ---------------------------------------------------------
{
  id: 'GC_0072',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה', multi: true,
  question: 'אילו מהבאים הם גורמי סיכון "נשלטים" לטרשת עורקים (Atherosclerosis)?',
  options: {
    'א': 'עישון',
    'ב': 'עודף כולסטרול',
    'ג': 'תורשה',
    'ד': 'יתר לחץ דם'
  },
  correct: ['א', 'ב', 'ד'],
  explanation: {
    correct: 'גורמי סיכון נשלטים: יתר ל"ד, סוכרת, מתח נפשי, חוסר פעילות, עישון, תזונה לקויה, עודף כולסטרול, עודף משקל — ניתנים לשינוי/טיפול. גורמים בלתי-נשלטים: גיל, מין, תורשה.',
    wrong: 'תורשה היא גורם בלתי-נשלט — אין אפשרות לשנות רקע גנטי, בניגוד לגורמי אורח חיים כמו עישון או תזונה.'
  },
},
{
  id: 'GC_0073',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'במה נבדלת תעוקת חזה בלתי-יציבה מתעוקת חזה יציבה, ומה המשמעות הטיפולית?',
  multi: false,
  options: {
    'א': 'תעוקה יציבה חמורה יותר ומטופלת כ-MI',
    'ב': 'תעוקה בלתי-יציבה מופיעה במנוחה/מאמץ קל, נמשכת מעל רבע שעה ואינה מוכרת לחולה — בשטח מטופלת כחשד ל-MI',
    'ג': 'אין הבדל קליני משמעותי בין השתיים',
    'ד': 'תעוקה בלתי-יציבה חולפת תמיד תוך 5 דקות מנוחה'
  },
  correct: 'ב',
  explanation: {
    correct: 'תעוקת חזה יציבה מופיעה במאמץ/לחץ וחולפת תוך 5-15 דקות במנוחה/ניטרטים. תעוקת חזה בלתי-יציבה מופיעה גם במנוחה או במאמץ קל, נמשכת מעל רבע שעה, ואינה תבנית מוכרת לחולה — בשטח היא מטופלת כחשד ל-MI, כי לא ניתן להבדיל ביניהן קלינית ללא בדיקות נוספות.',
    wrong: 'תעוקה יציבה אינה החמורה יותר — התעוקה הבלתי-יציבה היא זו שמטופלת ברמת חשד גבוהה יותר; ההבדל הקליני משמעותי ביותר מבחינת הטיפול; ותעוקה בלתי-יציבה מוגדרת דווקא בכך שהיא אינה חולפת במהירות במנוחה.'
  },
},
{
  id: 'GC_0074',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה', multi: true,
  question: 'אילו מהאוכלוסיות הבאות עלולות להציג תסמינים לא-טיפוסיים או מאוחרים ל-MI?',
  options: {
    'א': 'קשישים',
    'ב': 'נשים',
    'ג': 'סוכרתיים',
    'ד': 'ילדים בריאים'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'קשישים, נשים, סוכרתיים ויתר-ל"ד עלולים להציג תסמינים לא-טיפוסיים/מאוחרים ל-MI, ואף עד 10% מהמקרים ללא הסתמנות קלינית ברורה כלל — מה שמקשה על אבחנה בשטח.',
    wrong: 'MI בילדים בריאים הוא נדיר ביותר ואינו נכלל ברשימת אוכלוסיות הסיכון שנלמדו לתסמינים אטיפיים — הקבוצה המדוברת היא בעיקר מבוגרים עם גורמי סיכון קרדיווסקולריים.'
  },
},
{
  id: 'GC_0075',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה', multi: true,
  question: 'אילו מהבאים מהווים התוויית נגד למתן אספירין ללעיסה בחשד ACS?',
  options: {
    'א': 'רגישות ידועה לאספירין',
    'ב': 'דימום עיכולי ב-3 חודשים אחרונים',
    'ג': 'כיב פעיל',
    'ד': 'נטילת אספירין שגרתית ביומיים האחרונים (מעבר לשעה האחרונה)'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'התוויות נגד למתן אספירין 300 מ"ג בלעיסה בחשד ACS: רגישות ידועה, דימום עיכולי ב-3 חודשים אחרונים, כיב פעיל, ואסתמה פעילה בהיסטוריה. חשוב: יש לתת אספירין גם למי שכבר נטל אספירין באותו הבוקר — אלא אם נטל אותו בשעה האחרונה.',
    wrong: 'נטילת אספירין שגרתית ביומיים האחרונים (שלא בשעה האחרונה) אינה מונעת מתן מנת אספירין נוספת בשטח — ההתוויה נגד היא נטילה בשעה האחרונה בלבד, לא נטילה קבועה כללית.'
  },
},
{
  id: 'GC_0076',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם הסימנים המחשידים לדיסקציית אאורטה, באבחנה מבדלת של כאב חזה?',
  multi: false,
  options: {
    'א': 'כאב קורע, עם הפרש דפקים או לחץ דם בין הגפיים',
    'ב': 'כאב לוחץ שמוקל בניטרטים',
    'ג': 'קוצר נשימה פתאומי בלבד, ללא כאב',
    'ד': 'חום גבוה וצמרמורות'
  },
  correct: 'א',
  explanation: {
    correct: 'דיסקציית אאורטה מאופיינת בכאב "קורע" חד וחמור, לרוב עם הפרש דפקים או לחץ דם בין הגפיים — הפרש שמעיד על פגיעה בזרימת הדם באחד מענפי אבי העורקים.',
    wrong: 'כאב שמוקל בניטרטים אופייני יותר לתעוקת חזה איסכמית; קוצר נשימה פתאומי בלי כאב מזכיר יותר PE; וחום/צמרמורות מכוונים לכיוון זיהומי, לא וסקולרי.'
  },
},
{
  id: 'GC_0077',
  source: 'generated', qtype: ['scenario'], section: 'הטיפול בחולה',
  question: 'מטופל מדווח על כאב חזה לוחץ שהחל במאמץ, נחלש לאחר 10 דקות מנוחה, ותואם לו לתעוקת חזה יציבה מוכרת מהעבר. מה גישת הטיפול הראשונית?',
  multi: false,
  options: {
    'א': 'להזעיק מיד אט"ן ולבצע אק"ג בלבד, ללא הערכה נוספת',
    'ב': 'הושבה+הרגעה, מדדים חיוניים+ABC, הערכת סימני התדרדרות, ולזכור שגם תעוקה "מוכרת" הדורשת הערכה קלינית מלאה — אם התמונה משתנה מהרגיל, לטפל כחשד ACS',
    'ג': 'להתעלם — תעוקת חזה יציבה אינה דורשת טיפול כלל',
    'ד': 'לתת אינסולין ולפנות למרפאה קהילתית'
  },
  correct: 'ב',
  explanation: {
    correct: 'גם בתעוקת חזה יציבה מוכרת יש לבצע הערכה מלאה (הושבה+הרגעה, מדדים, ABC) ולוודא שהתמונה עדיין תואמת את הדפוס המוכר של המטופל. אם משהו שונה (משך ארוך יותר, עוצמה גבוהה יותר, לא מגיב לניטרטים כרגיל) — יש לטפל כחשד ACS/MI.',
    wrong: 'אין לדלג על הערכה קלינית מלאה רק כי המטופל מכיר את התסמין; התעלמות מוחלטת מסכנת החמרה שלא זוהתה; ואינסולין ופנייה למרפאה קהילתית אינם קשורים כלל לטיפול בכאב חזה קרדיאלי.'
  },
},

// ---------------------------------------------------------
// SECTION: טראומה
// ---------------------------------------------------------
{
  id: 'GC_0078',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מהם "שלושת גלי התמותה" בטראומה, ומהו טווח הזמן של הגל הראשון?',
  multi: false,
  options: {
    'א': 'גל ראשון — כדקות עד שעה, כ-50% מהתמותה',
    'ב': 'גל ראשון — כמה שבועות, כ-10% מהתמותה',
    'ג': 'יש רק שני גלי תמותה',
    'ד': 'הגל הראשון הוא תמיד הקטן ביותר'
  },
  correct: 'א',
  explanation: {
    correct: 'שלושת גלי התמותה בטראומה: גל ראשון (דקות עד שעה) — כ-50% מהתמותה, לרוב פציעות בלתי-הפיכות (ראש/כלי דם גדולים). גל שני (דקות עד 4 שעות) — כ-30%. גל שלישי (שבועיים עד 5 שבועות) — כ-20%, לרוב סיבוכים/זיהומים.',
    wrong: 'קיימים שלושה גלי תמותה, לא שניים; והגל הראשון הוא דווקא הגדול ביותר מבחינת אחוז התמותה, לא הקטן ביותר — מה שמדגיש את חשיבות הטיפול המיידי בשטח.'
  },
},
{
  id: 'GC_0079',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מה מוגדר כ"10 דקות הזהב" בטיפול בטראומה?',
  multi: false,
  options: {
    'א': 'הזמן שלוקח למטופל להגיע לבי"ח',
    'ב': 'הזמן מרגע הגעת הצוות ועד תחילת הפינוי — הערכת מנגנון, טיפול מציל חיים והכנה לפינוי',
    'ג': 'הזמן שבו מותר לבצע החייאה לפני שמוותרים',
    'ד': 'הזמן המקסימלי המותר להמתנה למשטרה בזירת פשע'
  },
  correct: 'ב',
  explanation: {
    correct: '"10 דקות הזהב" מתייחסות לזמן שבין הגעת הצוות לזירה לבין תחילת הפינוי — פרק זמן קצר שבו מתבצעים הערכת מנגנון הפגיעה, טיפולים מצילי חיים חיוניים, והכנה לפינוי, בהתאם להנחה שטראומה קשה לא ניתנת לייצוב מלא בשטח.',
    wrong: 'זהו אינו זמן ההגעה לבי"ח (שיכול להיות ארוך יותר או קצר יותר); אינו קשור לקריטריוני הפסקת החייאה; ואינו זמן המתנה למשטרה — מדובר בעיקרון קליני-תפעולי לניהול זמן בזירת טראומה.'
  },
},
{
  id: 'GC_0080',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'כיצד פותחים נתיב אוויר בחשד לטראומה, בשונה ממטופל ללא טראומה?',
  multi: false,
  options: {
    'א': 'מצח-סנטר, כמו במטופל רגיל',
    'ב': 'דחיקת לסת (Jaw Thrust) עם שמירה על קיבוע עמוד שדרה צווארי',
    'ג': 'אין הבדל בטכניקה, רק בקצב הביצוע',
    'ד': 'תמיד להחדיר צינור אנדוטרכיאלי'
  },
  correct: 'ב',
  explanation: {
    correct: 'בחשד לטראומה, פתיחת נתיב האוויר מתבצעת ע"י דחיקת לסת (Jaw Thrust), תוך שמירה על קיבוע ידני של עמוד השדרה הצווארי — לא מצח-סנטר, שעלול להזיז את הצוואר ולהחמיר פגיעה אפשרית בעמוד השדרה.',
    wrong: 'מצח-סנטר מתאים למטופל ללא חשד טראומה בלבד; ההבדל אינו רק בקצב אלא בטכניקה עצמה; ואינטובציה (החדרת צינור אנדוטרכיאלי) היא פעולה חודרנית מחוץ לסמכות EMT-B, אינה חלק מהפרוטוקול הבסיסי.'
  },
},
{
  id: 'GC_0081',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מה ההבדל בין חזה אוויר בלחץ (Tension Pneumothorax) לחזה אוויר פשוט?',
  multi: false,
  options: {
    'א': 'אין הבדל קליני משמעותי',
    'ב': 'בחזה אוויר בלחץ, אוויר נכנס ואינו יוצא, דוחק את הריאה וכלי הדם לצד השני וגורם להלם קרדיוגני — מסכן חיים באופן מיידי',
    'ג': 'חזה אוויר פשוט תמיד חמור יותר מחזה אוויר בלחץ',
    'ד': 'חזה אוויר בלחץ מתרחש רק בילדים'
  },
  correct: 'ב',
  explanation: {
    correct: 'בחזה אוויר בלחץ (Tension Pneumothorax), אוויר נכנס לחלל הפלאורלי אך אינו יכול לצאת, כך שהלחץ הולך וגובר, דוחק את הריאה, הלב וכלי הדם הגדולים לצד השני, ופוגע בהחזר הורידי — מוביל להלם קרדיוגני ומסכן חיים מיידית. חזה אוויר פשוט גורם לקריסת ריאה הדרגתית, לרוב פחות דחוף מיידית.',
    wrong: 'קיים הבדל קליני משמעותי בין השניים; חזה אוויר בלחץ הוא דווקא החמור והדחוף יותר, לא הפשוט; ושני הסוגים יכולים להתרחש בכל גיל, לא רק בילדים.'
  },
},
{
  id: 'GC_0082',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מהם הסימנים הקלאסיים לטמפונדה לבבית (נוזל בין הפריקרד ללב) בעקבות טראומה?',
  multi: false,
  options: {
    'א': 'חום גבוה וצמרמורות',
    'ב': 'חבלה+דופק מהיר+ל"ד יורד+לחץ דופק צר+כיחלון+גודש ורידי צוואר',
    'ג': 'עור חם וסמוק, ברדיקרדיה',
    'ד': 'אישונים מכווצים ("אישוני סיכה")'
  },
  correct: 'ב',
  explanation: {
    correct: 'טמפונדה לבבית — נוזל (בד"כ דם) בין הפריקרד ללב — מוביל לירידה בהחזר הורידי ובתפוקת הלב עד לדום לב. הסימנים: חבלה בחזה, דופק מהיר, ל"ד יורד, לחץ דופק צר (הפרש קטן בין סיסטולי לדיאסטולי), כיחלון וגודש ורידי צוואר.',
    wrong: 'חום וצמרמורות מתאימים לתמונה זיהומית, לא טראומטית; עור חם וסמוק+ברדיקרדיה מתארים דווקא הלם עצבי (נוירוגני), התמונה ההפוכה; ואישונים מכווצים הם סימן להרעלת אופיאטים, לא לטמפונדה.'
  },
},
{
  id: 'GC_0083',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'כמה דם יכולה הבטן להכיל במבוגר, ללא סימני נפיחות חיצוניים ניכרים?',
  multi: false,
  options: {
    'א': 'עד 100cc',
    'ב': 'מעל 1.5 ליטר',
    'ג': 'לא ניתן לאבד דם בבטן ללא נפיחות',
    'ד': 'עד 250cc בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'חלל הבטן יכול להכיל מעל 1.5 ליטר דם ללא סימני נפיחות ברורים במבוגר — לכן "הלם ללא חבלה נראית לעין" מהווה חשד חשוב לפגיעת בטן פנימית סמויה, ויש לחשוד בפגיעת בטן גם ללא נראות חיצונית.',
    wrong: 'הערכים 100cc ו-250cc נמוכים בהרבה מהנפח האמיתי שהבטן יכולה להכיל; והטענה שלא ניתן לאבד דם ללא נפיחות חיצונית שגויה — זו בדיוק הסכנה בפגיעות בטן פנימיות.'
  },
},
{
  id: 'GC_0084',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מדוע יציבות המודינמית של אישה בהריון בטראומה אינה שוללת מצוקת עובר?',
  multi: false,
  options: {
    'א': 'כי סימני הלם באם מופיעים רק אחרי איבוד של 30-35% מנפח הדם — האם עלולה להיראות יציבה בעוד זרימת הדם לעובר כבר נפגעה',
    'ב': 'כי אין קשר פיזיולוגי בין מצב האם למצב העובר',
    'ג': 'כי עובר תמיד מוגן לחלוטין מפני איבוד דם אימהי',
    'ד': 'כי בהריון לא ניתן לפתח הלם כלל'
  },
  correct: 'א',
  explanation: {
    correct: 'בזכות עלייה של כ-30% בנפח הדם במהלך ההריון, גוף האם מפצה טוב יותר על איבוד דם, כך שסימני הלם אימהיים קלאסיים מופיעים רק לאחר איבוד של 30-35% מנפח הדם. אולם זרימת הדם לשליה עלולה להיפגע הרבה קודם לכן, ולכן "טפל באם = טפל בעובר" ואין להסתמך על יציבות האם בלבד.',
    wrong: 'קיים קשר פיזיולוגי הדוק בין זרימת הדם לאם לזרימה לעובר; העובר אינו מוגן לחלוטין — הוא תלוי לחלוטין באספקת הדם האימהית; ואישה בהריון בהחלט יכולה לפתח הלם, רק שהסימנים מתעכבים.'
  },
},
{
  id: 'GC_0085',
  source: 'generated', qtype: ['concept'], section: 'טראומה', multi: true,
  question: 'אילו מההבדלים האנטומיים הבאים בילדים (לעומת מבוגר) רלוונטיים לטיפול בטראומה?',
  options: {
    'א': 'דרכי אוויר צרות יותר',
    'ב': 'לשון גדולה יחסית לחלל הפה',
    'ג': 'נפח דם קטן יותר, כך שאיבוד דם קטן יחסית משמעותי יותר',
    'ד': 'שלד גמיש פחות ופגיע יותר לשברים מאשר במבוגר'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'הבדלים אנטומיים רלוונטיים בילדים: דרכי אוויר צרות יותר (חסימה קלה יותר), לשון גדולה יחסית (סיכון גבוה יותר לחסימת נתיב אוויר), ונפח דם קטן יותר בערכים מוחלטים — כך שאיבוד דם שנראה קטן במבוגר עשוי להיות משמעותי יותר יחסית בילד.',
    wrong: 'שלד הילד למעשה גמיש יותר (לא פחות) מאשר במבוגר, ולכן שברים גלויים פחות שכיחים אצלם — אך זו בדיוק הסיבה שפגיעה פנימית עלולה להתרחש גם ללא סימני שבר חיצוניים ברורים.'
  },
},
{
  id: 'GC_0086',
  source: 'generated', qtype: ['concept'], section: 'טראומה', multi: true,
  question: 'אילו מהגורמים הבאים משפיעים על חומרת טראומה בקשישים (מעל 65)?',
  options: {
    'א': 'ירידה בגמישות בית החזה',
    'ב': 'שימוש בחוסמי בטא, שעלול להסוות טכיקרדיה פיצויית',
    'ג': 'אוסטאופורוזיס, שגורמת לשברים גם מקינמטיקה קלה',
    'ד': 'פיצוי סימפטטי מוגבר בהלם (חזק יותר מאשר בצעירים)'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'בקשישים: ירידה בגמישות בית החזה (נשימה סרעפתית יותר), חוסמי בטא עלולים להסוות טכיקרדיה פיצויית שהיא סימן חשוב להלם, אוסטאופורוזיס גורמת לשברים גם מקינמטיקה קלה (שכיח בצוואר הירך). נפילות הן הגורם השכיח ביותר לטראומה בקשישים.',
    wrong: 'ההפך הוא הנכון — לקשישים יש דווקא פיצוי סימפטטי מוגבל (לא מוגבר) בהלם, מה שהופך אותם לפגיעים יותר, לא פחות, למצבי הלם שאינם מזוהים בזמן.'
  },
},
{
  id: 'GC_0087',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'מה ההבדל בין שבר סגור לשבר פתוח, ומה סדר הטיפול הבסיסי בשבר?',
  multi: false,
  options: {
    'א': 'שבר סגור — ללא חשיפת עצם; שבר פתוח — עם חשיפת עצם. הטיפול: עצירת דימום, קיבוע במצב שנמצא, קירור, בדיקת תחושה+דופק פריפרי לפני ואחרי קיבוע',
    'ב': 'שבר פתוח תמיד קל יותר משבר סגור',
    'ג': 'יש תמיד להחזיר את השבר למקומו לפני קיבוע',
    'ד': 'בדיקת דופק פריפרי אינה נחוצה בשברים'
  },
  correct: 'א',
  explanation: {
    correct: 'שבר סגור אינו כולל חשיפת עצם דרך העור; שבר פתוח כן כולל חשיפה כזו (וסיכון גבוה יותר לזיהום ולסיבוכים). הטיפול הבסיסי: עצירת דימום, קיבוע במצב שבו נמצאה הגפה, קירור, ובדיקת תחושה ודופק פריפרי הן לפני והן אחרי הקיבוע.',
    wrong: 'שבר פתוח אינו קל יותר — הוא נחשב חמור יותר בשל חשיפה וסיכון זיהום; אין לנסות להחזיר שברים/נקעים למקומם בשטח; ובדיקת דופק פריפרי היא קריטית — היא זו שמזהה פגיעה בכלי דם עקב השבר או הקיבוע עצמו.'
  },
},
{
  id: 'GC_0088',
  source: 'generated', qtype: ['scenario'], section: 'טראומה',
  question: 'נפגע טראומה בחזה מציג מצוקה נשימתית חמורה, כיחלון, גודש ורידי צוואר, ולחץ דם יורד בהתמדה. מה תחשד ומה תעשה?',
  multi: false,
  options: {
    'א': 'חזה אוויר פשוט; לתת חמצן ולהמתין',
    'ב': 'חזה אוויר בלחץ (Tension Pneumothorax); ABC, חמצן/הנשמה, טיפול תואם לפרוטוקול, פינוי דחוף — מצב מסכן חיים מיידי',
    'ג': 'התקף אסתמה; לתת משאף',
    'ד': 'עייפות בלבד; אין צורך בהתערבות דחופה'
  },
  correct: 'ב',
  explanation: {
    correct: 'התמונה הקלאסית — מצוקה נשימתית קשה, כיחלון, גודש ורידי צוואר, ל"ד יורד בהתמדה לאחר טראומת חזה — מתאימה לחזה אוויר בלחץ (Tension Pneumothorax), מצב מסכן חיים באופן מיידי הדורש טיפול תואם ABC ופינוי דחוף ללא כל עיכוב.',
    wrong: 'חזה אוויר פשוט אינו מציג בדרך כלל את מלוא התמונה הקשה הזו (גודש ורידי צוואר, נפילת ל"ד מתמשכת); אסתמה אינה קשורה למנגנון טראומה בחזה; והתעלמות ממצב שכזה עלולה להוביל למוות תוך זמן קצר.'
  },
},
{
  id: 'GC_0089',
  source: 'generated', qtype: ['scenario'], section: 'טראומה',
  question: 'נפגע תאונת דרכים מציג קטע בית חזה שנע בכיוון הפוך לשאר בית החזה בזמן הנשימה. מה תחשד וכיצד תטפל?',
  multi: false,
  options: {
    'א': 'שבר צלע בודד; אין צורך בטיפול מיוחד',
    'ב': 'חזה מרפרף (Flail Chest) — לפחות 2 צלעות שבורות ב-2 מקומות, גורם לנשימה פרדוקסלית; לתת חמצן/הנשמה מסייעת, לנטר סיבוכי דיכוי נשימתי וקונטוזיה ריאתית, ולפנות בדחיפות',
    'ג': 'זהו חזה אוויר פתוח; יש למרוח משחה על הפצע',
    'ד': 'אין צורך בהתייחסות אלא אם המטופל מתלונן על כאב'
  },
  correct: 'ב',
  explanation: {
    correct: 'תנועה פרדוקסלית של קטע בית חזה (נכנס פנימה בשאיפה, יוצא בנשיפה — הפוך משאר בית החזה) היא הסימן הקלאסי לחזה מרפרף (Flail Chest), הנגרם מלפחות 2 צלעות שבורות ב-2 מקומות. יש סיכון לדיכוי נשימתי וקונטוזיה ריאתית נלווית. הטיפול: תמיכה נשימתית (חמצן/הנשמה מסייעת), וניטור, ופינוי דחוף.',
    wrong: 'זו אינה תמונה של שבר צלע בודד; חזה אוויר פתוח מציג פצע חודר עם "שאיבת" אוויר, לא תנועה פרדוקסלית של קטע חזה; ומריחת משחה אינה טיפול מקובל; ואין להתעלם מהתמונה גם ללא תלונת כאב — הסימן הפיזי עצמו הוא הדגל האדום.'
  },
},
{
  id: 'GC_0090',
  source: 'generated', qtype: ['scenario'], section: 'טראומה',
  question: 'נפגע דקירה בבטן מציג איבר פנימי (חלק ממעי) הבולט החוצה מהפצע. מה תעשה?',
  multi: false,
  options: {
    'א': 'להחזיר את האיבר בעדינות פנימה ולתחבש',
    'ב': 'אין להחזיר את האיבר; לחבוש בחבישה סטרילית לחה (סליין), ולפנות בדחיפות',
    'ג': 'למשוך את האיבר החוצה בעדינות כדי לבדוק את מלוא הפגיעה',
    'ד': 'להשאיר את הפצע חשוף לחלוטין ללא כיסוי'
  },
  correct: 'ב',
  explanation: {
    correct: 'כשאיבר פנימי יוצא מהבטן (Evisceration), אין להחזירו פנימה בשום מצב — הדבר עלול לגרום לזיהום פנימי חמור ונזק נוסף. יש לכסות בחבישה סטרילית לחה (סליין) לשמירה על לחות הרקמה, ולפנות בדחיפות. אין להוציא חפצים תקועים בבטן.',
    wrong: 'החזרת האיבר פנימה אסורה במפורש; משיכה נוספת של האיבר החוצה רק מחמירה את הפגיעה; והשארת הפצע חשוף ללא חבישה לחה מסכנת את הרקמה ביובש ובזיהום.'
  },
},
{
  id: 'GC_0091',
  source: 'generated', qtype: ['scenario', 'numeric'], section: 'טראומה',
  question: 'ילד בן 4 נפל מקומה שנייה. הוא בהכרה, בוכה, ל"ד סיסטולי נמדד 76 מ"מ כספית, דופק 150. מה הסף לתת-לחץ דם עבורו, והאם ערכיו מהווים חשד להלם?',
  multi: false,
  options: {
    'א': 'הסף הוא 78; ל"ד 76 נמוך מהסף — יש לחשוד בהלם למרות שהילד בהכרה',
    'ב': 'הסף הוא 90 בכל גיל; ל"ד 76 תקין',
    'ג': 'אין נוסחה לחישוב סף בילדים; יש להסתמך רק על מראה כללי',
    'ד': 'הסף תלוי אך ורק במשקל, לא בגיל'
  },
  correct: 'א',
  explanation: {
    correct: 'הנוסחה לסף תת-לחץ דם בילדים בגילאי 1-10: (גיל×2)+70. עבור ילד בן 4: (4×2)+70 = 78. ל"ד 76 נמוך מהסף — מהווה חשד לתת-לחץ דם. בילדים, סימני הלם מופיעים באיחור יחסית בשל מנגנוני פיצוי יעילים; כשה"ד כבר ירד, זה סימן מאוחר וחמור, גם אם הילד עדיין בהכרה ובוכה.',
    wrong: 'הסף במבוגרים (מעל גיל 10) הוא 90, לא בכל גיל — לילדים 1-10 יש נוסחה משלהם; יש נוסחה ברורה לחישוב, לא רק הערכה כללית; והנוסחה תלויה בגיל, לא במשקל.'
  },
},
{
  id: 'GC_0092',
  source: 'generated', qtype: ['concept'], section: 'טראומה',
  question: 'בסבב המשלים (השניוני) בטראומה, מהו סדר הטיפול הנכון בפגיעות עור/שלד תחת שלב D?',
  multi: false,
  options: {
    'א': 'כוויות ← פצעים ← שברים',
    'ב': 'שברים ← פצעים ← כוויות',
    'ג': 'פצעים ← שברים ← כוויות',
    'ד': 'הסדר אינו משנה'
  },
  correct: 'א',
  explanation: {
    correct: 'הסדר בשלב D של הסבב המשלים הוא: כוויות ← פצעים ← שברים. סדר הפעולות משקף את סדר עדיפויות הטיפול המקומי, כדי לוודא שכל סוג פגיעה מקבל התייחסות בזמן הנכון.',
    wrong: 'הסדרים ההפוכים או המעורבבים אינם תואמים את הרצף שנלמד; והטענה שהסדר "לא משנה" מתעלמת מהעיקרון שסדר הבדיקה/הטיפול השיטתי חשוב למניעת פספוסים.'
  },
},

// ---------------------------------------------------------
// SECTION: מצבי חירום נוירולוגיים ומטבוליים
// ---------------------------------------------------------
{
  id: 'GC_0093',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'האם ניתן להבחין בשטח בין שבץ איסכמי להמורגי? מה המשמעות לטיפול?',
  multi: false,
  options: {
    'א': 'כן, לפי דפוס הכאב',
    'ב': 'לא ניתן להבחין קלינית בשטח — ההבחנה נעשית רק בהדמיית CT בבי"ח, ולכן הטיפול בשטח זהה: שמירה על ABC ופינוי דחוף לבי"ח ייעודי',
    'ג': 'כן, לפי מידת ההכרה של המטופל',
    'ד': 'כן, לפי גיל המטופל בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'קלינית, בשטח, לא ניתן להבדיל בין שבץ איסכמי (כ-85% מהמקרים, חסימה ע"י קריש) לשבץ המורגי (קרע כלי דם ודימום) — ההבחנה נעשית רק בהדמיית CT בבי"ח. הטיפול בשטח זהה בשני המקרים: שמירה על ABC, פינוי דחוף לבי"ח בעל יכולת טרומבוליזה/צנתור, ותיעוד מדויק של שעת הופעת התסמינים.',
    wrong: 'אין קשר בין דפוס הכאב, רמת ההכרה, או גיל המטופל לבין סוג השבץ — אף אחד מהם אינו כלי אבחנתי מהימן להבחנה בשטח.'
  },
},
{
  id: 'GC_0094',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהו TIA (שבץ חולף), ולאיזה סוג שבץ הוא שייך?',
  multi: false,
  options: {
    'א': 'תסמינים חולפים לגמרי תוך דקות-שעות; שייך רק לשבץ איסכמי',
    'ב': 'תסמינים קבועים ובלתי-הפיכים; שייך לשבץ המורגי',
    'ג': 'TIA הוא שם נרדף למחלת אלצהיימר',
    'ד': 'TIA אינו דורש כל טיפול או מעקב'
  },
  correct: 'א',
  explanation: {
    correct: 'TIA (Transient Ischemic Attack, שבץ חולף) מוגדר כתסמינים נוירולוגיים החולפים לגמרי תוך דקות עד שעות, ושייך אך ורק לקטגוריית השבץ האיסכמי (לא ההמורגי). למרות ההחלמה המלאה, TIA מהווה סימן אזהרה משמעותי לסיכון עתידי לשבץ מלא, ומחייב הערכה רפואית.',
    wrong: 'תסמינים קבועים ובלתי-הפיכים אינם מגדירים TIA — זו בדיוק ההגדרה ההפוכה; TIA אינו קשור כלל לאלצהיימר; והוא בהחלט מחייב פינוי והערכה רפואית, לא התעלמות.'
  },
},
{
  id: 'GC_0095',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם שלבי פרכוס גדול (Grand Mal)?',
  multi: false,
  options: {
    'א': 'טוני (התכווצות) ← קלוני (עוויתות קצביות) ← פוסט-איקטלי (בלבול/עייפות)',
    'ב': 'קלוני ← טוני ← הכרה מלאה מיידית',
    'ג': 'פוסט-איקטלי ← טוני ← קלוני',
    'ד': 'יש שלב אחד בלבד'
  },
  correct: 'א',
  explanation: {
    correct: 'פרכוס גדול (Grand Mal) עובר שלושה שלבים: טוני (התכווצות שרירית ממושכת) ← קלוני (עוויתות קצביות) ← פוסט-איקטלי (מצב בלבול/עייפות שנמשך לאחר הפרכוס). לרוב מלווה הפרשת ריר מרובה ולעיתים איבוד שליטה על סוגרים.',
    wrong: 'הסדר ההפוך אינו נכון; אין חזרה מיידית להכרה מלאה — השלב הפוסט-איקטלי מאופיין דווקא בבלבול ולא בבהירות מיידית; ופרכוס גדול מורכב משלושה שלבים ברורים, לא שלב יחיד.'
  },
},
{
  id: 'GC_0096',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מה מאפיין פרכוסי חום בילדים?',
  multi: false,
  options: {
    'א': 'נגרמים משינוי חד בטמפרטורת הגוף הפנימית, לא בהכרח חום קיצוני חיצוני; מחייבים פינוי לבי"ח כמו כל פרכוס',
    'ב': 'מופיעים רק מעל גיל 12',
    'ג': 'אינם דורשים פינוי כי הם תמיד שפירים',
    'ד': 'קשורים תמיד לזיהום מוחי'
  },
  correct: 'א',
  explanation: {
    correct: 'פרכוסי חום בילדים נגרמים משינוי חד בטמפרטורת הגוף הפנימית של הילד (לאו דווקא חום קיצוני מבחינה מוחלטת), והם מחייבים פינוי לבי"ח לבירור וניטור — בדיוק כמו כל פרכוס אחר, גם אם מדובר בפרכוס חום "שגרתי".',
    wrong: 'פרכוסי חום שכיחים דווקא בגילאי הפעוטות/ילדים צעירים, לא מעל 12; הם אינם "תמיד שפירים" באופן שמייתר פינוי — כל פרכוס בילד מחייב הערכה רפואית; ואינם קשורים בהכרח לזיהום מוחי — הגורם הוא עלייה מהירה בחום גוף.'
  },
},
{
  id: 'GC_0097',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהו סטטוס אפילפטיקוס, ומדוע הוא מצב חירום?',
  multi: false,
  options: {
    'א': 'פרכוס בודד קצר, שאינו דורש טיפול מיוחד',
    'ב': 'פרכוס מתמשך או פרכוסים חוזרים ללא חזרה להכרה ביניהם — מצב חירום מסכן חיים',
    'ג': 'מונח שמתאר החלמה מלאה בין התקפי פרכוס',
    'ד': 'מצב שמופיע רק לאחר גיל 60'
  },
  correct: 'ב',
  explanation: {
    correct: 'סטטוס אפילפטיקוס מוגדר כפרכוס מתמשך, או פרכוסים חוזרים ללא חזרה להכרה בין ההתקפים — מצב חירום מסכן חיים בשל הסיכון להיפוקסיה מוחית ממושכת ופגיעה נוירולוגית בלתי הפיכה.',
    wrong: 'פרכוס בודד קצר אינו מוגדר כסטטוס אפילפטיקוס; ההגדרה מדגישה דווקא היעדר חזרה להכרה בין ההתקפים, לא החלמה מלאה; והמצב אינו תלוי גיל מסוים — יכול להופיע בכל שלב חיים.'
  },
},
{
  id: 'GC_0098',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם הסימנים המקדימים האופייניים לעילפון (Syncope), ומה חשוב לזכור לגביהם?',
  multi: false,
  options: {
    'א': 'חולשה כללית, "שחור בעיניים", סחרחורת, בחילה — לא קוצר נשימה או כאבי חזה כתסמין אופייני',
    'ב': 'קוצר נשימה חמור וכאבי חזה הם תמיד הסימן העיקרי',
    'ג': 'אין סימנים מקדימים כלל — העילפון תמיד מפתיע לחלוטין',
    'ד': 'חום גבוה הוא הסימן המקדים המרכזי'
  },
  correct: 'א',
  explanation: {
    correct: 'סימנים מקדימים לעילפון: חולשה כללית, תחושת "שחור בעיניים", סחרחורת, ובחילה. חשוב לזכור שקוצר נשימה וכאבי חזה אינם תסמינים אופייניים לעילפון — נוכחותם מעלה חשד לגורם אחר (למשל לבבי).',
    wrong: 'קוצר נשימה/כאב חזה כתסמין דומיננטי מטים דווקא מגורם אחר, לא מעילפון קלאסי; עילפון בד"כ כן מקדימים סימנים; וחום גבוה אינו הסימן המקדים המרכזי לעילפון.'
  },
},
{
  id: 'GC_0099',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מטופל איבד הכרה למספר דקות, עם דופק ונשימה חריגים בהתעוררות. האם זהו עילפון קלאסי?',
  multi: false,
  options: {
    'א': 'כן, זהו עילפון קלאסי ואין צורך בבירור נוסף',
    'ב': 'לא — חוסר הכרה ממושך עם דופק/נשימה חריגים אינו עילפון קלאסי, ויש לחשוד בגורם אחר (היפוגליקמיה, שבץ, אריתמיה)',
    'ג': 'כן, אך רק אם המטופל מעל גיל 70',
    'ד': 'לא ניתן לדעת ללא בדיקת דם מלאה בשטח'
  },
  correct: 'ב',
  explanation: {
    correct: 'עילפון קלאסי מאופיין באובדן הכרה קצר עם החלמה מהירה ומלאה. חוסר הכרה ממושך (דקות) בשילוב דופק/נשימה חריגים אינו תואם עילפון פשוט, ומחייב חשד לגורם אחר וחמור יותר — היפוגליקמיה, שבץ מוחי, או הפרעת קצב (אריתמיה).',
    wrong: 'משך ההכרה החריג לא תלוי בגיל המטופל באופן שהופך אותו לעילפון "כן/לא" תקין; ואין צורך בבדיקת דם מלאה כדי לחשוד — בדיקת סוכר בסיסית בשטח כבר יכולה לסייע לכיוון אבחנה.'
  },
},
{
  id: 'GC_0100',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מה ההבדל העיקרי בין סוכרת סוג 1 לסוכרת סוג 2?',
  multi: false,
  options: {
    'א': 'סוג 1 — תלוי אינסולין (IDDM), לרוב מגיל צעיר; סוג 2 — ירידה ברגישות התאים לאינסולין, לא בעיה בהפרשה כמו בסוג 1',
    'ב': 'שני הסוגים זהים לחלוטין מבחינה פיזיולוגית',
    'ג': 'סוג 2 תמיד תלוי אינסולין; סוג 1 לעולם לא',
    'ד': 'ההבדל היחיד הוא הגיל שבו מאובחנים'
  },
  correct: 'א',
  explanation: {
    correct: 'סוכרת סוג 1 (IDDM) היא תלוית אינסולין, לרוב מתחילה בגיל צעיר, ונובעת מחוסר הפרשת אינסולין. סוכרת סוג 2 נובעת מירידה ברגישות התאים לאינסולין (לא בהכרח בעיה בהפרשה עצמה), ולרוב אינה תלוית אינסולין בשלבים הראשונים.',
    wrong: 'המנגנון הפיזיולוגי שונה בין שני הסוגים; סוג 2 יכול להתפתח בהמשך לתלות באינסולין, אך לא "תמיד" מלכתחילה; וההבדל אינו רק גיל האבחון — יש הבדל מנגנוני עמוק יותר.'
  },
},
{
  id: 'GC_0101',
  source: 'generated', qtype: ['scenario'], section: 'הטיפול בחולה',
  question: 'מטופל סוכרתי נמצא מחוסר הכרה בביתו, עור קר ולח, בדיקת סוכר מראה 42 מ"ג/ד"ל. מה תעשה?',
  multi: false,
  options: {
    'א': 'לתת סוכר/מיץ דרך הפה',
    'ב': 'לתת גלוקוג\'ל מתחת ללחי — לעולם לא PO (דרך הפה) כשאין רפלקס בליעה תקין',
    'ג': 'להזריק אינסולין נוסף כדי לייצב את הסוכר',
    'ד': 'להמתין שהמטופל יתעורר מעצמו'
  },
  correct: 'ב',
  explanation: {
    correct: 'סוכר 42 מ"ג/ד"ל מתחת לסף ה-60 מגדיר היפוגליקמיה. במטופל מחוסר הכרה, אין לתת דבר דרך הפה (סכנת שאיפה לריאות בהיעדר רפלקס בליעה) — יש לתת גלוקוג\'ל מתחת ללחי, שנספג דרך רירית הפה ללא צורך בבליעה.',
    wrong: 'מתן דרך הפה למחוסר הכרה מסוכן — סיכון לשאיפה; אינסולין נוסף יחמיר את ההיפוגליקמיה במקום לתקנה — אין לתת אינסולין ע"י החובש כלל; והמתנה פסיבית מסכנת חיים כשמדובר במצב הפיך שדורש התערבות מהירה.'
  },
},
{
  id: 'GC_0102',
  source: 'generated', qtype: ['scenario'], section: 'הטיפול בחולה',
  question: 'מטופל נמצא ע"י בן משפחה עם חולשת צד וקושי דיבור, אך לא ידוע מתי בדיוק החלו התסמינים (יתכן שהתעורר כך משינה — "Wake-up Stroke"). מה עליך לעשות?',
  multi: false,
  options: {
    'א': 'לרשום "לפני שעה" כברירת מחדל, כדי לזרז טיפול',
    'ב': 'לתעד את הזמן האחרון שבו המטופל נראה תקין (למשל שעת השכיבה לישון), ולציין במפורש שהזמן המדויק אינו ידוע; מצב זה עשוי להוות קונטרה-אינדיקציה ל-tPA',
    'ג': 'לוותר על תיעוד השעה כי היא לא ידועה',
    'ד': 'להעריך את השעה על סמך מראה המטופל בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'כשמועד הופעת התסמינים אינו ידוע במדויק (למשל "Wake-up Stroke"), יש לתעד את השעה האחרונה שבה המטופל נראה תקין (Last known well) ולציין במפורש שהזמן המדויק לא ידוע. מצב זה עשוי להוות קונטרה-אינדיקציה ל-tPA, ולכן דיוק בתיעוד — כולל אי-הוודאות עצמה — קריטי לקבלת ההחלטה בבי"ח.',
    wrong: 'רישום שעה שרירותית ("לפני שעה") כברירת מחדל הוא מסוכן ומטעה; ויתור על תיעוד כליל מונע מהצוות בבי"ח מידע חיוני; והערכה על סמך מראה בלבד אינה תחליף לזמן מתועד — יש לדווח מה שידוע בפועל.'
  },
},

// ---------------------------------------------------------
// SECTION: הלם ואנפילקסיס
// ---------------------------------------------------------
{
  id: 'GC_0103',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהם שלושת הגורמים הפיזיולוגיים העיקריים שיכולים לגרום להלם?',
  multi: false,
  options: {
    'א': 'נפח דם (ירידה), קוטר כלי דם (טונוס עצבי), שריר הלב (משאבה)',
    'ב': 'רק ירידה בנפח דם — כל שאר סוגי ההלם הם וריאציות של אותו גורם',
    'ג': 'טמפרטורת הגוף, רמת סוכר, ורמת חמצן בלבד',
    'ד': 'גורם אחד בלבד — כשל לבבי'
  },
  correct: 'א',
  explanation: {
    correct: 'שלושה מנגנונים פיזיולוגיים יכולים לגרום להלם: ירידה בנפח הדם (למשל דימום/התייבשות — הלם תת-נפחי), שינוי בקוטר כלי הדם (למשל אובדן טונוס עצבי — הלם עצבי/זיהומי), וכשל בשריר הלב כמשאבה (הלם קרדיוגני). כל סוגי ההלם נובעים משילוב או פגיעה באחד מהם.',
    wrong: 'ירידה בנפח דם היא רק אחד משלושת המנגנונים, לא הבלעדי; טמפרטורה/סוכר/חמצן אינם המנגנונים הבסיסיים המוגדרים כאן; וכשל לבבי הוא רק אחד מהמנגנונים, לא היחיד.'
  },
},
{
  id: 'GC_0104',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'איזו קבוצת רקמות/איברים היא הרגישה ביותר לאיסכמיה (מפסיקה לתפקד תקין ראשונה בזמן הלם)?',
  multi: false,
  options: {
    'א': 'שרירים/עצם/עור — סובלים 4-6 שעות',
    'ב': 'מוח/לב/ריאות — סובלים רק 4-6 דקות',
    'ג': 'כליות/כבד/מע\' עיכול — סובלים 45-90 דקות',
    'ד': 'כל הרקמות סובלות אותו זמן בדיוק'
  },
  correct: 'ב',
  explanation: {
    correct: 'סבילות איברים לאיסכמיה משתנה מאוד: מוח/לב/ריאות — הרגישים ביותר, סובלים רק 4-6 דקות ללא זרימת דם; כליות/כבד/מערכת עיכול — 45-90 דקות; שרירים/עצם/עור — הכי עמידים, 4-6 שעות. הבדל זה משפיע על סדר העדיפויות בהחייאה ובטיפול בהלם.',
    wrong: 'שרירים/עצם/עור הם דווקא הכי עמידים, לא הכי רגישים; כליות/כבד/מעיים סובלים יותר זמן מהמוח/לב/ריאות; והזמנים שונים מהותית בין קבוצות הרקמות, לא זהים.'
  },
},
{
  id: 'GC_0105',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מדוע הלם עצבי (נוירוגני) מציג תמונה קלינית הפוכה משאר סוגי ההלם?',
  multi: false,
  options: {
    'א': 'כי הוא נגרם מדימום מסיבי, בדיוק כמו הלם תת-נפחי',
    'ב': 'כי פגיעה בחוט השדרה מבטלת את הטונוס הסימפטטי, ולכן אין כיווץ כלי דם היקפי — מה שגורם לעור חם וסמוק (במקום קר וחיוור) וברדיקרדיה (במקום טכיקרדיה)',
    'ג': 'כי הוא תמיד מלווה בחום גבוה',
    'ד': 'אין הבדל אמיתי בין הלם עצבי לשאר סוגי ההלם'
  },
  correct: 'ב',
  explanation: {
    correct: 'הלם עצבי (נוירוגני) נגרם מפגיעה בחוט השדרה (חזי-מותני) שמבטלת את הטונוס הסימפטטי, ולכן כלי הדם ההיקפיים אינם מתכווצים כפי שקורה בהלם רגיל — מה שגורם לעור חם וסמוק (לא קר וחיוור) ולברדיקרדיה (לא טכיקרדיה), עם מילוי קפילרי תקין.',
    wrong: 'הלם עצבי אינו נגרם מדימום — הוא נגרם מפגיעה נוירולוגית ישירה בחוט השדרה; אינו קשור לחום גבוה; וקיים הבדל אמיתי ומשמעותי מבחינת תמונת העור, הדופק והמילוי הקפילרי בהשוואה לסוגי ההלם האחרים.'
  },
},
{
  id: 'GC_0106',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מדוע אדרנלין הוא הטיפול המרכזי באנפילקסיס, ולא רק "עוד תרופה" בין רבות?',
  multi: false,
  options: {
    'א': 'כי הוא פועל רק על ירידת לחץ הדם, ואינו משפיע על הנשימה',
    'ב': 'כי הוא פועל בו-זמנית על שלוש הבעיות — כיווץ כלי דם היקפיים, הרחבת סמפונות, ועיכוב שחרור היסטמין נוסף',
    'ג': 'כי הוא היחיד שמותר לתת ע"י EMT-B',
    'ד': 'כי הוא פועל רק לאחר מספר שעות'
  },
  correct: 'ב',
  explanation: {
    correct: 'אדרנלין באנפילקסיס פועל על שלוש הבעיות הפיזיולוגיות בו-זמנית: כיווץ כלי דם היקפיים (מעלה ל"ד), הרחבת סמפונות (משפרת נשימה), ועיכוב שחרור היסטמין נוסף (מאט את התהליך האלרגי). זו הסיבה שהוא הפעולה הראשונה והחשובה ביותר, ואין לחכות לאישור מוקד במצב מסכן חיים.',
    wrong: 'אדרנלין משפיע גם על הנשימה (הרחבת סמפונות), לא רק על ל"ד; אינו התרופה היחידה בסמכות EMT-B (יש גם אספירין וחמצן); ופועל במהירות רבה — לא רק לאחר שעות, וזו בדיוק הסיבה לדחיפות מתן ההזרקה.'
  },
},
{
  id: 'GC_0107',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'היכן מזריקים אדרנלין באנפילקסיס, ומדוע לא באתרים אחרים?',
  multi: false,
  options: {
    'א': 'ירך אנטרולטרלית — לא בעכוז (סכנת פגיעה בעצב הסיאטי + ספיגה איטית) ולא בדלתואיד (ספיגה איטית יותר)',
    'ב': 'עכוז, כי זה השריר הגדול ביותר בגוף',
    'ג': 'דלתואיד, כי הספיגה שם המהירה ביותר',
    'ד': 'אין חשיבות למיקום ההזרקה'
  },
  correct: 'א',
  explanation: {
    correct: 'ההזרקה מבוצעת בירך אנטרולטרלית, בזווית 90 מעלות לשריר. אין להזריק בעכוז — סכנת פגיעה בעצב הסיאטי וספיגה איטית יותר; ואין להזריק בדלתואיד (כתף) — ספיגה איטית יותר מהירך.',
    wrong: 'עכוז מסוכן דווקא בגלל העצב הסיאטי, לא מומלץ בגלל גודל השריר; דלתואיד סופג לאט יותר, לא מהר יותר, מהירך; ומיקום ההזרקה משמעותי מאוד — משפיע ישירות על מהירות הספיגה.'
  },
},
{
  id: 'GC_0108',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מטופל הזריק לעצמו אפיפן, ולאחר 8 דקות עדיין מציג סימני אנפילקסיס ללא שיפור. מה יש לשקול?',
  multi: false,
  options: {
    'א': 'לא ניתן לתת מנה נוספת בשום מצב לאחר מתן עצמאי',
    'ב': 'לשקול מנה נוספת של אדרנלין, גם אם המטופל כבר הזריק אפיפן עצמאית',
    'ג': 'להמתין שעה נוספת לפני כל פעולה נוספת',
    'ד': 'לתת אספירין במקום מנה נוספת'
  },
  correct: 'ב',
  explanation: {
    correct: 'אם אין שיפור לאחר 5-10 דקות ממתן אדרנלין — כולל אם המטופל כבר הזריק אפיפן באופן עצמאי — יש לשקול מתן מנה נוספת של אדרנלין.',
    wrong: 'מנת אדרנלין עצמאית אינה שוללת מנה נוספת מקצועית בהמשך; המתנה של שעה שלמה מסכנת חיים במצב שממשיך להתדרדר; ואספירין אינו הטיפול לאנפילקסיס — הוא טיפול ל-ACS.'
  },
},
{
  id: 'GC_0109',
  source: 'generated', qtype: ['concept'], section: 'הטיפול בחולה',
  question: 'מהו הקריטריון הקליני להגדרת אנפילקסיס?',
  multi: false,
  options: {
    'א': 'פריחה בלבד, ללא צורך במעורבות מערכת נוספת',
    'ב': 'שילוב של תגובה עורית (פריחה/בצקת) עם מעורבות מערכת נוספת (נשימתית/קרדיווסקולרית/עיכולית)',
    'ג': 'רק ירידת לחץ דם, ללא סימנים עוריים',
    'ד': 'רק קוצר נשימה, ללא כל סימן עורי'
  },
  correct: 'ב',
  explanation: {
    correct: 'אנפילקסיס מוגדר כשילוב של תגובה עורית (פריחה/אורטיקריה, בצקת/אנגיואדמה) עם מעורבות של מערכת נוספת אחת לפחות — נשימתית (קוצר נשימה, צפצופים, סטרידור), קרדיווסקולרית (ל"ד יורד, טכיקרדיה) או עיכולית (בחילות, כאבי בטן).',
    wrong: 'פריחה בלבד אינה מספיקה להגדרת אנפילקסיס ללא מעורבות מערכת נוספת; וירידת ל"ד או קוצר נשימה בבדידות, ללא סימן עורי כלשהו, אינם עומדים בהגדרה הקלינית המלאה כפי שנלמדה — אם כי במקרים כאלה עדיין יש לחשוד ולטפל בהתאם לחומרה.'
  },
},
{
  id: 'GC_0110',
  source: 'generated', qtype: ['scenario'], section: 'הטיפול בחולה',
  question: 'ילדה בת 8 אכלה מאכל עם בוטנים, ותוך דקות פיתחה פריחה נרחבת, בצקת בשפתיים, וקוצר נשימה עם צפצופים. מה תעשה קודם כל?',
  multi: false,
  options: {
    'א': 'לתת נוגד היסטמין דרך הפה ולהמתין לתגובה',
    'ב': 'להזריק אדרנלין IM בהקדם האפשרי — הפעולה הראשונה והחשובה ביותר, ללא המתנה לאישור מוקד במצב מסכן חיים',
    'ג': 'להמתין לצוות אט"ן בלבד לפני כל פעולה',
    'ד': 'להשכיב על הגב ולתת מים לשתייה'
  },
  correct: 'ב',
  explanation: {
    correct: 'התמונה (פריחה+בצקת+מעורבות נשימתית לאחר חשיפה למזון אלרגני) מתאימה לאנפילקסיס. הפעולה הראשונה והחשובה ביותר היא הזרקת אדרנלין IM בהקדם האפשרי — מינון ילדים (עד 30 ק"ג) 0.15 מ"ג — ללא המתנה לאישור מוקד במצב מסכן חיים. חובש EMT-B מוסמך לכך במסגרת סמכותו.',
    wrong: 'נוגד היסטמין אינו הטיפול הראשוני/המרכזי באנפילקסיס — אדרנלין הוא; המתנה לצוות אט"ן בלבד מעכבת טיפול מציל חיים שכן ניתן להתחיל בו כעת; ומתן מים לשתייה אינו רלוונטי ועלול להיות מסוכן אם קיים סיכון לחסימת נתיב אוויר עקב בצקה.'
  },
},

// ---------------------------------------------------------
// SECTION: כוויות ופגיעות סביבה
// ---------------------------------------------------------
{
  id: 'GC_0111',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות', multi: true,
  question: 'אילו מהתיאורים הבאים תואמים נכון לדרגת הכוויה שלצידם?',
  options: {
    'א': 'דרגה I — אודם בלבד, כאב, ללא שלפוחיות',
    'ב': 'דרגה II — אודם+שלפוחיות+בצקת, כואבת מאוד',
    'ג': 'דרגה III — עור חרוך/שחור/לבן שעווני, ללא כאב',
    'ד': 'דרגה III — הכי כואבת מבין כל הדרגות'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'דרגות כוויה: דרגה I — אודם בלבד, כואבת, ללא שלפוחיות (כוויית שמש קלאסית). דרגה II — אודם+שלפוחיות+בצקת, כואבת מאוד. דרגה III — עור חרוך/שחור/לבן שעווני, ללא כאב (עצבים נשרפו), לרוב מוקפת בדרגה I-II.',
    wrong: 'דרגה III היא דווקא הפחות כואבת מבין הדרגות, לא הכי כואבת — קצות העצבים החושיים נהרסו לחלוטין, ולכן האזור הפגוע ביותר לרוב חסר כאב.'
  },
},
{
  id: 'GC_0112',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות', multi: true,
  question: 'אילו מהבאים מוגדרים "כוויות קריטיות" המחייבות פינוי לבי"ח ייעודי לכוויות?',
  options: {
    'א': 'כוויות בפנים או באיברי מין',
    'ב': 'כוויות חשמל',
    'ג': 'כוויות דרכי נשימה',
    'ד': 'כוויית שמש דרגה I בגב בלבד'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'כוויות קריטיות: פנים+איברי מין, כוויות חשמל, כוויות דרכי נשימה, ודרגה III בשטח נרחב — כל אלה מחייבות פינוי לבי"ח ייעודי לכוויות בשל הסיכון הפונקציונלי/הזיהומי/הנשימתי הגבוה.',
    wrong: 'כוויית שמש דרגה I מקומית בגב אינה נחשבת כוויה קריטית — היא שטחית ומוגבלת, ולרוב אינה מחייבת פינוי דחוף למרכז ייעודי.'
  },
},
{
  id: 'GC_0113',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות', multi: true,
  question: 'אילו מהסימנים הבאים מחשידים לכוויית דרכי נשימה?',
  options: {
    'א': 'שיער פנים חרוך',
    'ב': 'פיח סביב האף/פה',
    'ג': 'צרידות ושיעול',
    'ד': 'ירידה בטמפרטורת הגוף'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'סימני כוויית דרכי נשימה: שיער פנים חרוך, פיח סביב האף/פה, צרידות, שיעול, וקושי בנשימה — כל אלו מעידים על חשיפה ישירה של דרכי הנשימה לחום/עשן, ומחייבים דגש מיוחד על נתיב אוויר וחמצון.',
    wrong: 'ירידה בטמפרטורת הגוף אינה סימן לכוויית דרכי נשימה — היא קשורה יותר להיפותרמיה, מצב נפרד לחלוטין.'
  },
},
{
  id: 'GC_0114',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'כיצד יש לקרר כוויית חום בשטח, ומה יש להימנע ממנו?',
  multi: false,
  options: {
    'א': 'שטיפה במים קרים (לא קרח)',
    'ב': 'שטיפה בקרח ישיר על האזור',
    'ג': 'אין לקרר כוויות חום כלל',
    'ד': 'שטיפה במים חמים בלבד'
  },
  correct: 'א',
  explanation: {
    correct: 'הטיפול בכוויית חום כולל הסרת בגדים שאינם דבוקים, שטיפה במים קרים (לא קרח — קרח עלול להעמיק את הנזק הרקמתי ולגרום היפותרמיה מקומית), חבישה בתחבושת ייעודית לכוויות, ומתן נוזלים לפי הצורך.',
    wrong: 'קרח ישיר על הכוויה עלול להחמיר את הנזק הרקמתי; אין לוותר על קירור — זהו חלק חשוב מהטיפול המקומי; ומים חמים אינם מתאימים כלל לקירור כוויה — ההפך מהמטרה.'
  },
},
{
  id: 'GC_0115',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מטופל נחשף לכוויה כימית מחומר באבקה. מה סדר הטיפול הנכון?',
  multi: false,
  options: {
    'א': 'לשטוף מיד בהרבה מים, לפני כל פעולה אחרת',
    'ב': 'לנער את האבקה מהעור לפני שטיפה במים, ורק אז לשטוף בהרבה מים; לברר את סוג החומר',
    'ג': 'לשטוף רק בסליין, לעולם לא במים רגילים',
    'ד': 'למרוח שמן על האזור לפני שטיפה'
  },
  correct: 'ב',
  explanation: {
    correct: 'בכוויה כימית מחומר אבקתי, יש לנער את האבקה מהעור לפני השטיפה במים — שטיפה ישירה עלולה להפוך את האבקה לתמיסה כימית פעילה יותר על העור. לאחר הניעור — שטיפה בהרבה מים, הסרת בגדים, ובירור סוג החומר לצורך העברת מידע לבי"ח. אם נפגעו עיניים — שטיפה בנוזל עירוי.',
    wrong: 'שטיפה מיידית במים לפני ניעור האבקה עלולה להחמיר את התגובה הכימית על העור; אין הכרח להשתמש בסליין דווקא — מים רגילים בכמות גדולה מקובלים; ומריחת שמן אינה טיפול מקובל ועלולה לכלוא את החומר הכימי על העור.'
  },
},
{
  id: 'GC_0116',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מה ההבדל המרכזי בין תשישות חום (Heat Exhaustion) למכת חום (Heat Stroke)?',
  multi: false,
  options: {
    'א': 'תשישות חום — עור חיוור, קר ומזיע; מכת חום — עור סמוק וחם למגע (מסכנת חיים, פגיעה בהכרה)',
    'ב': 'שני המצבים זהים לחלוטין מבחינה קלינית',
    'ג': 'תשישות חום מסוכנת יותר ממכת חום',
    'ד': 'ההבדל היחיד הוא מיקום גיאוגרפי'
  },
  correct: 'א',
  explanation: {
    correct: 'תשישות חום נובעת ממאמץ+חום, עם עור חיוור, קר ומזיע, סימני הלם אפשריים ופרכוסים אפשריים — הטיפול: השכבה במקום מוצל, קו ורידי+עירוי, קירור/הרטבה. מכת חום נובעת מכשל מנגנון ויסות החום, עם עור סמוק וחם למגע, חוסר הכרה/בלבול — מצב מסכן חיים המחייב קירור מיידי אגרסיבי ופינוי דחוף.',
    wrong: 'שני המצבים שונים משמעותית בחומרה ובמראה העור; מכת חום היא דווקא המסוכנת יותר מבין השתיים — עלולה להוביל לפרכוסים, הלם וחסימת נתיב אוויר; וההבדל אינו גיאוגרפי אלא פיזיולוגי-קליני.'
  },
},
{
  id: 'GC_0117',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מה הטיפול הנכון בכוויית קור (Frostbite), ומה אסור לעשות?',
  multi: false,
  options: {
    'א': 'שפשוף האזור הקפוא כדי להחזיר זרימת דם',
    'ב': 'אין לשפשף את האזור הקפוא; חימום הדרגתי במים פושרים (לא חמים)',
    'ג': 'חימום מיידי במים רותחים',
    'ד': 'קירור נוסף של האזור לפני חימום'
  },
  correct: 'ב',
  explanation: {
    correct: 'בכוויית קור (Frostbite) אין לשפשף את האזור הקפוא — שפשוף עלול לגרום נזק נוסף לרקמה הקפואה והשבירה. הטיפול הנכון הוא חימום הדרגתי במים פושרים (לא חמים).',
    wrong: 'שפשוף הוא בדיוק הפעולה האסורה; מים רותחים יגרמו כוויית חום נוספת על רקמה כבר פגועה; וקירור נוסף מחמיר את הנזק במקום לתקנו.'
  },
},
{
  id: 'GC_0118',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'כיצד משתנה קצב הלב ככל שהיפותרמיה מחמירה?',
  multi: false,
  options: {
    'א': 'טכיקרדיה←ברדיקרדיה — קצב הלב מתחיל מהיר ומאט ככל שההיפותרמיה מחמירה',
    'ב': 'הדופק נשאר קבוע לחלוטין לאורך כל ההיפותרמיה',
    'ג': 'ברדיקרדיה←טכיקרדיה — הדופק תמיד מואץ ככל שההיפותרמיה מחמירה',
    'ד': 'אין קשר בין היפותרמיה לקצב הלב'
  },
  correct: 'א',
  explanation: {
    correct: 'בהיפותרמיה, קצב הלב עובר תהליך טכיקרדיה←ברדיקרדיה: בשלבים המוקדמים הגוף מגיב עם רעד וטכיקרדיה מפצה, ובהמשך (ככל שההיפותרמיה מחמירה) הדופק מאט משמעותית, עד לסכנת דום לב ודום נשימה בשלבים החמורים.',
    wrong: 'הדופק אינו נשאר קבוע — משתנה משמעותית עם התקדמות המצב; הכיוון אינו הפוך (ברדיקרדיה←טכיקרדיה); וקיים קשר ישיר וברור בין חומרת ההיפותרמיה לשינויים בדופק ובנשימה.'
  },
},
{
  id: 'GC_0119',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהו המקור השכיח ביותר להרעלת פחמן חד-חמצני (CO) בחורף, ומהם התסמינים המוקדמים?',
  multi: false,
  options: {
    'א': 'תנור נפט/גז בחלל סגור; תסמינים: כאב ראש, בלבול, בחילה',
    'ב': 'חשיפה למים מזוהמים; תסמינים: שלשולים והקאות',
    'ג': 'קרינת שמש; תסמינים: כוויות עור',
    'ד': 'אין מקור שכיח מוגדר; התסמינים לא קבועים'
  },
  correct: 'א',
  explanation: {
    correct: 'מקור נפוץ להרעלת CO בחורף הוא תנור הפועל בחלל סגור. תסמינים: כאב ראש, בלבול, בחילה, וסימן ה"עור האדום-דובדבן" מופיע רק בשלב מאוחר יחסית — לא כסימן ראשוני.',
    wrong: 'מים מזוהמים גורמים לתסמינים עיכוליים, לא CO; קרינת שמש קשורה לכוויות עור, לא הרעלת גזים; ולהרעלת CO יש דווקא מקורות אופייניים ומוכרים היטב (בעיקר בעירה בחלל סגור).'
  },
},
{
  id: 'GC_0120',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהם הסימנים האופייניים להרעלת זרחן אורגני (OP, מרעילי עצב חקלאיים)?',
  multi: false,
  options: {
    'א': 'סימני עודף פראסימפטטי — הפרשות מרובות, כיווץ אישונים, ברדיקרדיה',
    'ב': 'טכיקרדיה, אישונים מורחבים, פרנויה',
    'ג': 'עור אדום-דובדבן וכאב ראש',
    'ד': 'אישוני סיכה עם דיכוי נשימתי בלבד'
  },
  correct: 'א',
  explanation: {
    correct: 'זרחן אורגני (חשיפה חקלאית) גורם לתמונה קלינית של עודף פעילות פראסימפטטית: הפרשות מרובות (ריור, זיעה, דמעות), כיווץ אישונים, וברדיקרדיה — שילוב שדומה חלקית להרעלת אופיאטים אך עם רקע חשיפה שונה ותמונה מלווה שונה.',
    wrong: 'טכיקרדיה+אישונים מורחבים+פרנויה מאפיינים הרעלת חומרים מעוררים, לא זרחן אורגני; עור אדום-דובדבן וכאב ראש מאפיינים הרעלת CO; ואישוני סיכה מבודדים ללא הפרשות מרובות מתאימים יותר לאופיאטים.'
  },
},
{
  id: 'GC_0121',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מטופל מציג טכיקרדיה, יתר לחץ דם, אישונים מורחבים ואי-שקט/פרנויה. באיזו הרעלה תחשוד?',
  multi: false,
  options: {
    'א': 'הרעלת חומרים מעוררים (קוקאין/אמפטמינים)',
    'ב': 'הרעלת אופיאטים',
    'ג': 'הרעלת בנזודיאזפינים',
    'ד': 'הרעלת CO'
  },
  correct: 'א',
  explanation: {
    correct: 'הרעלת חומרים מעוררים (קוקאין/אמפטמינים) מציגה תמונה של טכיקרדיה, יתר לחץ דם, אישונים מורחבים, ואי-שקט/פרנויה — תמונה הפוכה מהרעלת אופיאטים/מדכאים.',
    wrong: 'אופיאטים גורמים לדיכוי נשימתי, אישוני סיכה וברדיקרדיה — התמונה ההפוכה; בנזודיאזפינים (מדכאים) גורמים לברדיפניאה, בלבול, ניתוק; והרעלת CO אינה מציגה טכיקרדיה+יתר ל"ד+אישונים מורחבים כתמונה קלאסית.'
  },
},
{
  id: 'GC_0122',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהו סדר ההחייאה הנכון בטביעה, ובמה הוא שונה מהחייאה סטנדרטית?',
  multi: false,
  options: {
    'א': 'A-B-C (בשונה מ-C-A-B הסטנדרטי) — דגש על נתיב אוויר והנשמות, בגלל שהגורם לדום הלב הוא היפוקסיה',
    'ב': 'C-A-B בדיוק כמו החייאה סטנדרטית, ללא שינוי',
    'ג': 'B-A-C, ללא עיסויים כלל',
    'ד': 'אסור לחבר דפיברילטור בשום מצב לאחר טביעה'
  },
  correct: 'א',
  explanation: {
    correct: 'בהחייאה לאחר טביעה, הסדר הוא A-B-C (בניגוד ל-C-A-B הסטנדרטי) — משום שדום הלב בטביעה נובע לרוב מהיפוקסיה עקב חוסר חמצן, ולכן פתיחת נתיב אוויר והנשמה מהירה הן קריטיות ביותר. יחס עיסויים:הנשמות נשאר 30:2. חיבור דפיברילטור כן מתבצע (אין חשש התחשמלות אם המטופל יבש/מיובש) — יש לייבש את בית החזה לפני חיבור מדבקות.',
    wrong: 'הסדר שונה מהותית מ-C-A-B הרגיל, לא זהה; עיסויים כן מבוצעים, לא מדולגים; ודפיברילטור כן משמש בטביעה, בניגוד למיתוסים נפוצים — רק יש לייבש את בית החזה קודם.'
  },
},
{
  id: 'GC_0123',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מה גורם למחלת דקומפרסיה (Bends) בצוללים, ומהו הטיפול הדפיניטיבי?',
  multi: false,
  options: {
    'א': 'עלייה מהירה מדי מהעומק, שיוצרת בועות חנקן ברקמות/דם; טיפול: חמצן 100%, פינוי דחוף לתא לחץ (Hyperbaric Chamber), שכיבה שטוחה',
    'ב': 'ירידה מהירה מדי לעומק; טיפול: עליה מהירה נוספת',
    'ג': 'חשיפה לקור בלבד; טיפול: חימום פסיבי',
    'ד': 'זיהום מים מזוהמים; טיפול: אנטיביוטיקה'
  },
  correct: 'א',
  explanation: {
    correct: 'מחלת דקומפרסיה נגרמת מעלייה מהירה מדי מהעומק, שגורמת לחנקן (שהצטבר ברקמות/דם תחת לחץ) לצאת מתמיסה וליצור בועות. הטיפול הדפיניטיבי הוא חמצן 100%, פינוי דחוף לתא לחץ (Hyperbaric Chamber), ושכיבה שטוחה למניעת תזוזת הבועות.',
    wrong: 'ירידה מהירה לעומק גורמת לבעיות אחרות (כגון ברוטראומה), לא למחלת דקומפרסיה; עלייה נוספת מהירה תחמיר את המצב, לא תשפר; וקור/זיהום אינם המנגנון של מחלת הדקומפרסיה כלל.'
  },
},
{
  id: 'GC_0124',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהי הפעולה הראשונה תמיד בטיפול בפגיעת חשמל?',
  multi: false,
  options: {
    'א': 'ניתוק/וידוא ניתוק מקור החשמל, לפני כל מגע או הערכה במטופל',
    'ב': 'החייאה מיידית, גם לפני ניתוק החשמל',
    'ג': 'מתן חמצן, לפני ניתוק החשמל',
    'ד': 'קיבוע עמוד שדרה, לפני ניתוק החשמל'
  },
  correct: 'א',
  explanation: {
    correct: 'הפעולה הראשונה תמיד בפגיעת חשמל היא ניתוק או וידוא ניתוק מקור החשמל — לפני כל מגע או הערכה של המטופל, כדי למנוע התחשמלות המטפל עצמו. רק לאחר ניתוק זרם מתחילים ABC מלא.',
    wrong: 'כל פעולה שמתבצעת לפני ווידוא ניתוק החשמל — כולל החייאה, מתן חמצן או קיבוע — מסכנת את המטפל עצמו בהתחשמלות, ולכן שגויה כפעולה ראשונה.'
  },
},
{
  id: 'GC_0125',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'כמה מטפלים נדרשים כמינימום להורדת נפגע מתלייה, ומדוע?',
  multi: false,
  options: {
    'א': 'מטפל אחד מספיק, כדי לחסוך זמן',
    'ב': 'לפחות שני מטפלים — כדי לשמור בקפדנות על קיבוע עמוד שדרה צווארי בעת ההורדה',
    'ג': 'שלושה מטפלים בלבד, לא פחות ולא יותר',
    'ד': 'אין דרישה מוגדרת למספר מטפלים'
  },
  correct: 'ב',
  explanation: {
    correct: 'הורדת נפגע מתלייה מתבצעת ע"י לפחות שני מטפלים, תוך שמירה קפדנית על קיבוע עמוד השדרה הצווארי — פעולה שדורשת תיאום בין מי שתומך בגוף לבין מי שמשחרר/חותך את חבל התלייה.',
    wrong: 'מטפל בודד אינו יכול לשמור על תמיכת גוף וקיבוע צוואר בו-זמנית; אין דרישה דווקא לשלושה; והדרישה למינימום שני מטפלים היא מפורשת, לא עניין של העדפה בלבד.'
  },
},
{
  id: 'GC_0126',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות', multi: true,
  question: 'אילו מהפעולות הבאות אסורות בטיפול בהכשת נחש?',
  options: {
    'א': 'חיתוך האזור וניסיון למצוץ את הארס',
    'ב': 'הנחת חוסם עורקים על הגפה',
    'ג': 'קיבוע הגפה הנפגעת והשארתה במנוחה',
    'ד': 'קירור ישיר של אזור ההכשה'
  },
  correct: ['א', 'ב', 'ד'],
  explanation: {
    correct: 'בטיפול בהכשת נחש אסור: לחתוך את האזור ולמצוץ ארס, להשתמש בחוסם עורקים, ולקרר את אזור ההכשה (עלול להחמיר נזק רקמתי). הטיפול הנכון הוא קיבוע הגפה הנפגעת, השארתה במנוחה, ופינוי דחוף.',
    wrong: 'קיבוע הגפה הנפגעת והשארתה במנוחה הוא בדיוק הטיפול הנכון והמומלץ, לא פעולה אסורה.'
  },
},
{
  id: 'GC_0127',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מטופל נשך ע"י כלב רחוב. מעבר לטיפול המקומי, מה חובה נוספת מוטלת על הצוות?',
  multi: false,
  options: {
    'א': 'אין חובת דיווח נוספת מעבר לטיפול הרפואי',
    'ב': 'דיווח ללשכת הבריאות בשל חשד לכלבת, בנוסף לשטיפה במים וסבון ופינוי לבי"ח',
    'ג': 'רק תיעוד פרטי בעל הכלב, ללא דיווח רשמי',
    'ד': 'חובת דיווח למשטרה בלבד'
  },
  correct: 'ב',
  explanation: {
    correct: 'בנשיכת בעל חיים (כלב/חתול), מעבר לטיפול המקומי (שטיפה במים וסבון בכמות גדולה, חבישה, פינוי לבי"ח) קיימת חובת דיווח ללשכת הבריאות בשל חשד לכלבת — סכנה שיש להתייחס אליה ברצינות.',
    wrong: 'קיימת חובת דיווח מפורשת (לא רק טיפול); דיווח לא-רשמי בלבד אינו מספיק; והדיווח מיועד ללשכת הבריאות (בהקשר הרפואי), לא רק למשטרה.'
  },
},
{
  id: 'GC_0128',
  source: 'generated', qtype: ['scenario'], section: 'פגיעות סביבתיות',
  question: 'הוזעקת לבית בחורף שבו תנור נפט פעל בחדר סגור. שני ילדים נמצאים ישנוניים, עם כאבי ראש. הסטורציה נמדדת 97%. מה תעשה?',
  multi: false,
  options: {
    'א': 'לפנות לבית חולים — חשד למחסור בברזל כתוצאה מדיאטה לא מתאימה לגיל',
    'ב': 'להוציא לאוויר פתוח, לתת חמצן בריכוז גבוה ולפנות בדחיפות — חשד להרעלת CO',
    'ג': 'לתת להם להירדם — הישנוניות היא סימן שהם פשוט עייפים',
    'ד': 'לוותר על פינוי כי אין סימנים חמורים'
  },
  correct: 'ב',
  explanation: {
    correct: 'תנור נפט בחלל סגור בחורף, עם כאבי ראש וישנוניות אצל שני ילדים, מתאים לתמונה קלאסית של הרעלת CO. הסטורציה נשארת תקינה באופן מטעה כי המכשיר אינו מבחין בין המוגלובין קשור-חמצן להמוגלובין קשור-CO. יש להוציא את הנפגעים לאוויר פתוח, לתת חמצן בריכוז גבוה, ולפנות בדחיפות.',
    wrong: 'סטורציה תקינה אינה שוללת הרעלת CO — זה בדיוק המלכוד שיש להיזהר ממנו; ישנוניות במצב כזה אינה עייפות שגרתית אלא סימן נוירולוגי מדאיג; וויתור על פינוי מסכן חיים כאשר קיים חשד סביר להרעלה.'
  },
},
{
  id: 'GC_0129',
  source: 'generated', qtype: ['scenario'], section: 'פגיעות סביבתיות',
  question: 'רץ מרתון קורס ביום חם. עורו סמוק וחם למגע (יבש), הוא מבולבל, דופק מהיר וחלש. מה תחשד ומה תעשה?',
  multi: false,
  options: {
    'א': 'תשישות חום; להשכיב במקום מוצל ולתת מים בלבד',
    'ב': 'מכת חום — מנגנון ויסות החום נכשל, מצב מסכן חיים; לבצע קירור מיידי אגרסיבי (מים/קרח), למדוד חום רקטלית, לתת נוזלים (מנות חוזרות 500cc), ולפנות בדחיפות',
    'ג': 'התייבשות קלה בלבד; להמתין שיתאושש עצמאית',
    'ד': 'התקף אפילפסיה; לחכות שיעבור'
  },
  correct: 'ב',
  explanation: {
    correct: 'עור סמוק וחם למגע (בניגוד לתשישות חום שבה העור חיוור וקר), בלבול ודופק מהיר וחלש מתאימים למכת חום — מצב מסכן חיים בו מנגנון ויסות החום נכשל. הטיפול: קירור מיידי אגרסיבי (מים/קרח), מדידת חום רקטלית, נוזלים (מבוגר: מנות חוזרות 500cc), ופינוי דחוף.',
    wrong: 'תשישות חום מציגה עור חיוור, קר ומזיע — תמונה הפוכה למה שבשאלה; המתנה או "מים בלבד" ללא קירור אגרסיבי אינם מספקים למצב מסכן חיים; ואין קשר בין התמונה הזו לאפילפסיה — אין תיאור של פעילות עוויתית.'
  },
},

// ---------------------------------------------------------
// SECTION: לידה וגניקולוגיה
// ---------------------------------------------------------
{
  id: 'GC_0130',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'מדוע אין להשכיב יולדת בהריון מתקדם על גבה באופן שטוח וממושך?',
  multi: false,
  options: {
    'א': 'זה גורם לכאבי גב בלבד, ללא השפעה המודינמית',
    'ב': 'לחץ הרחם על הווריד הנבוב התחתון מפחית את ההחזר הורידי ואת תפוקת הלב — לכן מטים לצד שמאל',
    'ג': 'זה מגביר את זרימת הדם לעובר',
    'ד': 'אין כל בעיה בכך, ורצוי דווקא להשכיב שטוח'
  },
  correct: 'ב',
  explanation: {
    correct: 'שכיבה על הגב בהריון מתקדם גורמת ללחץ הרחם על הווריד הנבוב התחתון, מה שמפחית את ההחזר הורידי ואת תפוקת הלב, ועלול לגרום לתת-לחץ דם משמעותי אצל האם ("תסמונת יתר-לחץ שכיבתי"). לכן מקובל להטות את היולדת לצד שמאל.',
    wrong: 'הבעיה אינה רק אי-נוחות בגב — יש לה השלכה המודינמית ממשית; שכיבה שטוחה דווקא פוגעת בזרימת הדם לעובר (לא משפרת אותה); ולכן ההיפך הוא הנכון — יש להימנע משכיבה שטוחה ולהטות שמאלה.'
  },
},
{
  id: 'GC_0131',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'מה ההבדל בין "מחיקת" צוואר הרחם ל"פתיחתו"?',
  multi: false,
  options: {
    'א': 'מחיקה = התקצרות/היטשטחות (נמדדת באחוזים); פתיחה = התרחבות; בלידה ראשונה מחיקה כמעט מלאה קודמת לפתיחה, בוולדניות מתרחשות יחד',
    'ב': 'מחיקה ופתיחה הם שני שמות לאותו תהליך',
    'ג': 'מחיקה קורית רק בלידה שנייה ואילך',
    'ד': 'פתיחה מתייחסת לפתיחת השליה, לא של צוואר הרחם'
  },
  correct: 'א',
  explanation: {
    correct: 'מחיקת צוואר הרחם היא תהליך התקצרות/היטשטחות שלו (נמדד באחוזים), ופתיחה היא התרחבותו הבפועלית. בלידה ראשונה, המחיקה כמעט תמיד מקדימה ומושלמת לפני שהפתיחה מתקדמת משמעותית; בוולדניות (שכבר ילדו בעבר) שני התהליכים מתרחשים יחד.',
    wrong: 'אלו שני מדדים/תהליכים שונים ולא שם נרדף לאותו דבר; מחיקה קורית בכל לידה, ראשונה או לא; ופתיחה מתייחסת לצוואר הרחם עצמו, לא לשליה.'
  },
},
{
  id: 'GC_0132',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה', multi: true,
  question: 'אילו מהסימנים הבאים מעידים על לידה קרֵבה?',
  options: {
    'א': 'צירים כל 45-60 שניות',
    'ב': 'רצון עז לריקון מעיים',
    'ג': 'Crowning — ראש נראה בפתח',
    'ד': 'תנועות עובר תכופות בבטן, ללא צירים'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'סימנים ללידה קרבה: צירים בתדירות של כל 45-60 שניות, רצון עז לריקון מעיים (עקב לחץ ראש התינוק על פי הטבעת), דימום וגינלי, ו-Crowning — ראש התינוק נראה בפתח הנרתיק, המהווה סימן ללידה מתקדמת ומיידית.',
    wrong: 'תנועות עובר תכופות ללא צירים אינן בהכרח סימן ללידה קרבה — יכולות להופיע בהריון תקין בכל שלב; הסימן המשמעותי הוא נוכחות צירים בתדירות עולה, לא תנועות עובר בפני עצמן.'
  },
},
{
  id: 'GC_0133',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'האם מותר לחובש לבצע בדיקה וגינלית ידנית בשטח כדי להעריך פתיחת צוואר הרחם?',
  multi: false,
  options: {
    'א': 'כן, זה חלק שגרתי מהערכת לידה בשטח',
    'ב': 'לא — אין לבצע בדיקה וגינלית ידנית בשטח בשום מצב',
    'ג': 'כן, אך רק אם היולדת מבקשת זאת',
    'ד': 'כן, אך רק בלידה שנייה ואילך'
  },
  correct: 'ב',
  explanation: {
    correct: 'אין לבצע בדיקה וגינלית ידנית בשטח בשום מצב — הערכת התקדמות הלידה מתבססת על סימנים חיצוניים (תדירות צירים, Crowning, רצון לריקון מעיים וכו\'), לא על בדיקה פנימית שדורשת ציוד וסביבה סטריליים ומיומנות ייעודית.',
    wrong: 'זה אינו חלק שגרתי מהערכה בשטח בשום נסיבות; בקשת היולדת אינה משנה את האיסור; והאיסור חל ללא קשר למספר הלידות הקודמות של היולדת.'
  },
},
{
  id: 'GC_0134',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'מה עושים כאשר מזהים מים מקוניאליים (חום/ירוקים) בזמן קבלת לידה?',
  multi: false,
  options: {
    'א': 'שאיבה בפה/אף לפני יציאה מלאה של הילוד, אם אפשר',
    'ב': 'אין כל צורך בהתייחסות מיוחדת',
    'ג': 'להאיץ את הלידה ע"י משיכה בראש',
    'ד': 'לעכב את הלידה עד להגעת אט"ן בלבד'
  },
  correct: 'א',
  explanation: {
    correct: 'זיהוי מים מקוניאליים (חום/ירוק, המעידים על צואת עובר ברחם — לרוב סימן למצוקה עוברית) מחייב שאיבת הפה והאף של הילוד לפני יציאתו המלאה, אם ניתן, כדי למנוע שאיפת מקוניום לריאות.',
    wrong: 'מים מקוניאליים מחייבים כן התייחסות מיוחדת, לא התעלמות; משיכה בראש התינוק אסורה תמיד; ולידה אינה ניתנת לעיכוב — יש להיערך ולפעול בזמן אמת ולא להמתין להגעת גורם נוסף.'
  },
},
{
  id: 'GC_0135',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'כיצד מבצעים הידוק וחיתוך חבל הטבור לאחר הלידה?',
  multi: false,
  options: {
    'א': 'הנחת 2 קלמפים (5 ס"מ מהטבור, השני 5 ס"מ הלאה כלפי חוץ), וחיתוך ביניהם',
    'ב': 'קשירה בחוט רגיל, ללא קלמפים כלל',
    'ג': 'חיתוך מיידי ללא הידוק כלל',
    'ד': 'הנחת קלמפ יחיד וחיתוך מעליו'
  },
  correct: 'א',
  explanation: {
    correct: 'לאחר הלידה מניחים שני קלמפים על חבל הטבור — הראשון כ-5 ס"מ מהטבור, השני כ-5 ס"מ הלאה מכיוונו כלפי חוץ — וחותכים בין שני הקלמפים.',
    wrong: 'קשירה בחוט רגיל ללא קלמפים אינה הטכניקה המומלצת; חיתוך ללא הידוק מקדים מסכן בדימום; וקלמפ יחיד לבדו אינו מספק — נדרשים שני קלמפים לפני החיתוך.'
  },
},
{
  id: 'GC_0136',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'ביולדת עם מצג עכוז (התינוק יוצא ברגליים/עכוז תחילה), מה עקרון הטיפול?',
  multi: false,
  options: {
    'א': 'תמיכה בגוף היוצא, אין למשוך בכוח; אם אין התקדמות בלידת הראש — הרחקת פני התינוק מדופן התעלה + פינוי מיידי',
    'ב': 'משיכה נמרצת ברגלי התינוק כדי להחיש את הלידה',
    'ג': 'אין צורך בהתייחסות מיוחדת מעבר ללידה רגילה',
    'ד': 'יש לדחוף את התינוק בחזרה פנימה'
  },
  correct: 'א',
  explanation: {
    correct: 'במצג עכוז, יש לתמוך בגוף היוצא מבלי למשוך בכוח. אם קיימת בעיה בהתקדמות לידת הראש, יש להרחיק את פני התינוק מדופן תעלת הלידה (ליצירת מרחב נשימה) ולפנות מיידית — זהו מצב חירום מיילדותי הדורש התייחסות ייעודית.',
    wrong: 'משיכה נמרצת עלולה לגרום נזק חמור לתינוק; מצג עכוז דורש התייחסות שונה מלידה רגילה, לא זהה; ובשום מצב אין לדחוף את התינוק בחזרה פנימה.'
  },
},
{
  id: 'GC_0137',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'האם יש להמתין בשטח ללידת השליה לפני פינוי, ומהי הסכנה העיקרית לאחר הלידה?',
  multi: false,
  options: {
    'א': 'כן, חובה להמתין ללידת השליה בשטח; הסכנה העיקרית היא זיהום',
    'ב': 'אין צורך להמתין ללידת השליה בשטח; הסכנה העיקרית לאחר לידה היא דימום, ולכן יש להישאר ערניים להיפוולמיה',
    'ג': 'יש להשמיד את השליה מיד באתר',
    'ד': 'השליה אינה חשובה כלל ואין צורך להביאה לבי"ח'
  },
  correct: 'ב',
  explanation: {
    correct: 'אין צורך להמתין בשטח ללידת השליה — היא מלווה בפרץ דם קצר ו"התארכות" של חבל הטבור. הסכנה העיקרית לאחר הלידה היא דימום (היפוולמיה), ולכן יש להישאר ערניים לסימני הלם. יש לשמור את השליה בקופסה ולהביאה לבי"ח לבדיקה.',
    wrong: 'המתנה בשטח ללידת השליה אינה חובה ועלולה לעכב פינוי מיותר; הסכנה העיקרית היא דימום, לא זיהום מיידי; והשליה חשובה — יש לשומרה ולהביאה לבדיקה בבי"ח, לא להשמידה.'
  },
},
{
  id: 'GC_0138',
  source: 'generated', qtype: ['concept'], section: 'לידה וגניקולוגיה',
  question: 'כיצד יש לטפל בחשד להריון חוץ-רחמי עם דימום?',
  multi: false,
  options: {
    'א': 'לטפל כחשד להלם תת-נפחי — סכנת חיים עיקרית היא דימום פנימי',
    'ב': 'להרגיע בלבד ולפנות ללא דחיפות מיוחדת',
    'ג': 'לטפל כרעלת הריון',
    'ד': 'לתת אדרנלין כמו באנפילקסיס'
  },
  correct: 'א',
  explanation: {
    correct: 'הריון חוץ-רחמי (התפתחות ההריון מחוץ לרחם, בד"כ בחצוצרה) מהווה סכנת מוות עוברי בטרימסטר הראשון, כאשר סיבת המוות היא דימום פנימי — ולכן יש לטפל בו כחשד להלם תת-נפחי, עם דגש על פינוי מהיר וטיפול תואם הלם.',
    wrong: 'זהו מצב חירום המחייב דחיפות, לא הרגעה גרידא; אינו קשור לרעלת הריון (מצב שונה לחלוטין, מאוחר יותר בהריון); ואדרנלין אינו הטיפול הרלוונטי כאן — אין מדובר באנפילקסיס.'
  },
},
{
  id: 'GC_0139',
  source: 'generated', qtype: ['scenario'], section: 'לידה וגניקולוגיה',
  question: 'יולדת בשבוע 34 להריון עם היסטוריה ידועה של שליית פתח (Placenta previa) מדווחת על דימום וגינלי ללא כאב. מה תחשד ומה תעשה?',
  multi: false,
  options: {
    'א': 'להעריך כשליית פתח פעילה, לטפל בעדינות רבה (ללא בדיקה וגינלית ידנית!), לנטר סימני הלם, ולפנות בדחיפות לבי"ח עם יכולת מיילדותית מלאה',
    'ב': 'לבצע בדיקה וגינלית ידנית לוודא את המצב',
    'ג': 'להרגיע ולומר לה שדימום ללא כאב תמיד שפיר',
    'ד': 'להזמין לידה קרקעית מיידית'
  },
  correct: 'א',
  explanation: {
    correct: 'שליית פתח (השליה מכסה את צוואר הרחם) עלולה לגרום לדימום וגינלי ללא כאב, ומחייבת לידה קיסרית — אין לבצע בדיקה וגינלית ידנית בשום מצב (עלולה להחמיר דימום מהשליה). יש לנטר סימני הלם ולפנות בדחיפות לבי"ח בעל יכולת מיילדותית מלאה.',
    wrong: 'בדיקה וגינלית ידנית אסורה בכל מצב, ובמיוחד כאן — עלולה לגרום דימום קטלני; דימום וגינלי בהריון, גם ללא כאב, אינו "תמיד שפיר" ומחייב הערכה דחופה; ולידה טבעית קרקעית אינה אפשרות — שליית פתח מחייבת לידה קיסרית בבי"ח.'
  },
},

// ---------------------------------------------------------
// SECTION: גישה ורידית ומתן נוזלים
// ---------------------------------------------------------
{
  id: 'GC_0140',
  source: 'generated', qtype: ['concept'], section: 'ציוד רפואי',
  question: 'מה ההבדל בין תמיסת קריסטלואיד לתמיסת קולואיד, ואיזו נפוצה יותר בשלב טרום-בית-חולים?',
  multi: false,
  options: {
    'א': 'קריסטלואיד — ללא מולקולות/חלבונים גדולים; קולואיד — עם מולקולות גדולות, נשארת זמן רב בכלי דם. הקריסטלואיד הנפוצה יותר בטרום-בית-חולים',
    'ב': 'שתי התמיסות זהות לחלוטין',
    'ג': 'קולואיד היא הנפוצה יותר בשלב טרום-בית-חולים',
    'ד': 'קריסטלואיד מכילה תמיד דם מלא'
  },
  correct: 'א',
  explanation: {
    correct: 'תמיסת קריסטלואיד אינה מכילה מולקולות/חלבונים גדולים (למשל סליין, רינגר לקטט) והיא הנפוצה בשלב טרום-בית-חולים. תמיסת קולואיד מכילה מולקולות גדולות (למשל אלבומין) ונשארת זמן ארוך יותר בכלי הדם, אך פחות שכיחה בשימוש חובשים בשטח.',
    wrong: 'אלו שתי תמיסות שונות מהותית; קריסטלואיד היא הנפוצה יותר, לא קולואיד; וקריסטלואיד אינה מכילה דם — היא תמיסה מלאכותית, לא מוצר דם.'
  },
},
{
  id: 'GC_0141',
  source: 'generated', qtype: ['concept'], section: 'ציוד רפואי', multi: true,
  question: 'אילו מהצירופים הבאים בין סוג תמיסה לכיוון תנועת הנוזל נכונים?',
  options: {
    'א': 'איזוטוני (NaCl 0.9%) — ריכוז שווה לתא, ללא תנועת נוזל נטו',
    'ב': 'היפוטוני (NaCl 0.45%) — מומס נמוך יותר, נוזל נכנס לתא',
    'ג': 'היפרטוני (HSD) — מומס גבוה יותר, נוזל יוצא מהתא',
    'ד': 'היפרטוני — מומס נמוך יותר, נוזל נכנס לתא'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'איזוטוני (NaCl 0.9%) — ריכוז מומס שווה לתא, אין תנועת נוזל נטו. היפוטוני (NaCl 0.45%) — מומס נמוך יותר מהתא, ולכן נוזל נכנס לתא (בעקבות אוסמוזה). היפרטוני (HSD) — מומס גבוה יותר מהתא, ולכן נוזל יוצא מהתא.',
    wrong: 'ההגדרה שבאפשרות ד הפוכה — היפרטוני מוגדר במומס גבוה יותר (לא נמוך יותר), ולכן נוזל יוצא מהתא (לא נכנס אליו).'
  },
},
{
  id: 'GC_0142',
  source: 'generated', qtype: ['concept'], section: 'ציוד רפואי',
  question: 'מתי בזמן הטיפול מותר לתת נוזלים IV למטופל טראומה לא-יציב, ומה העיקרון המרכזי?',
  multi: false,
  options: {
    'א': 'רק לפני תחילת הפינוי, לעולם לא במהלכו',
    'ב': 'במהלך הפינוי בלבד — לעולם לא לעכב פינוי לצורך פתיחת עירוי',
    'ג': 'רק לאחר הגעה לבי"ח',
    'ד': 'בכל שלב, ללא כל הגבלה'
  },
  correct: 'ב',
  explanation: {
    correct: 'מתן נוזלים במטופל טראומה לא-יציב מתבצע רק במהלך הפינוי (כלומר תוך כדי נסיעה/דרך) — לעולם לא לעכב את תחילת הפינוי לצורך פתיחת עירוי בזירה. העיקרון: "לא ניתן לייצב טראומה קשה בשטח, טיפול דפיניטיבי רק בבי"ח" — ולכן פינוי מהיר עדיף על עיכוב לצורך עירוי.',
    wrong: 'עיכוב הפינוי לצורך עירוי לפני היציאה הוא בדיוק הטעות שיש להימנע ממנה; המתנה עד לבי"ח מבזבזת זמן קריטי אם הנוזלים נחוצים; ואין מדובר בהיתר ללא הגבלה — יש כלל ברור המחייב ביצוע במהלך הפינוי בלבד.'
  },
},
{
  id: 'GC_0143',
  source: 'generated', qtype: ['concept'], section: 'ציוד רפואי', multi: true,
  question: 'אילו מהבאים הם סיבוכים אפשריים של פתיחת קו ורידי (ונפלון)?',
  options: {
    'א': 'שטף דם חיצוני/פנימי',
    'ב': 'החדרה בטעות לעורק',
    'ג': 'ניקוב וריד ("פארה")',
    'ד': 'שיפור מיידי בכל המקרים ללא כל סיכון'
  },
  correct: ['א', 'ב', 'ג'],
  explanation: {
    correct: 'סיבוכים אפשריים בפתיחת ונפלון: שטף דם חיצוני/פנימי, החדרה בטעות לעורק, ניקוב וריד ("פארה"), זיהום, ופגיעה בעצב/גיד. חשוב לזהות ולתעד סיבוכים אלו.',
    wrong: 'פתיחת ונפלון היא פעולה חודרנית עם סיכונים אמיתיים, ואינה "ללא כל סיכון" — יש להיות מודעים לסיבוכים האפשריים ולנקוט משנה זהירות.'
  },
},

// ---------------------------------------------------------
// SECTION: מוכנות לרעידות אדמה
// ---------------------------------------------------------
{
  id: 'GC_0144',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מה חשוב לזכור בעת כניסה למרחב מוגן (ממ"ד/חדר מדרגות) בזמן רעידת אדמה?',
  multi: false,
  options: {
    'א': 'יש לסגור את הדלת ואת כל החלונות באטימות מלאה',
    'ב': 'אין לסגור דלתות/חלונות בכניסה למרחב המוגן',
    'ג': 'יש להישאר צמוד לחלון הגדול ביותר',
    'ד': 'אין להשתמש במרחב מוגן כלל בזמן רעידה'
  },
  correct: 'ב',
  explanation: {
    correct: 'בכניסה למרחב המוגן (ממ"ד/חדר מדרגות) בזמן רעידת אדמה, אין לסגור דלתות/חלונות — הכניסה נועדה להגנה מבנית, לא לאטימות מוחלטת, וסגירה עלולה למנוע יציאה מהירה או להוות מלכודת.',
    wrong: 'סגירה אטומה אינה נדרשת ואף עלולה להזיק; אין להישאר צמוד לחלונות בזמן רעידה (סכנת שברי זכוכית); והמרחב המוגן דווקא מומלץ לשימוש בזמן רעידה, ככל שניתן להגיע אליו בזמן.'
  },
},
{
  id: 'GC_0145',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'אדם נמצא בתוך מבנה בזמן רעידת אדמה, ואין לו גישה למרחב מוגן או חדר מדרגות. מה עליו לעשות?',
  multi: false,
  options: {
    'א': 'לרוץ מיד החוצה, ללא קשר לזמן שנותר',
    'ב': 'להתרחק מקירות חיצוניים, להיצמד לפינה פנימית, ולהגן על הראש בידיים',
    'ג': 'לעמוד ליד החלון הגדול ביותר בחדר',
    'ד': 'לשכב על הרצפה ליד ריהוט תלוי'
  },
  correct: 'ב',
  explanation: {
    correct: 'כשאין גישה למרחב מוגן או חדר מדרגות, יש להתרחק מקירות חיצוניים (סכנת קריסה), להיצמד לפינה פנימית של המבנה, ולהגן על הראש בידיים — עקרונות המפחיתים חשיפה לפגיעה מחפצים נופלים או קריסה חלקית.',
    wrong: 'יציאה מהמבנה מומלצת רק אם ניתן לעשות זאת תוך שניות בודדות — אחרת, יציאה באמצע רעידה מסוכנת יותר; חלונות מסוכנים בשל שברי זכוכית; וריהוט תלוי (מזגנים, מדפים) עלול ליפול — יש להתרחק ממנו, לא להיצמד אליו.'
  },
},
{
  id: 'GC_0146',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'נהג ברכב חש רעידת אדמה. מה עליו לעשות, ומה עליו להימנע ממנו?',
  multi: false,
  options: {
    'א': 'לעצור בבטחה ולהישאר ברכב עד תום הרעידה; להימנע מעצירה על/מתחת לגשרים ומחלפים, ליד מבנים, או במדרונות',
    'ב': 'לצאת מהרכב מיד ולרוץ',
    'ג': 'להאיץ במהירות כדי להתרחק מהאזור',
    'ד': 'לעצור בדיוק מתחת לגשר, כי זה המקום הבטוח ביותר'
  },
  correct: 'א',
  explanation: {
    correct: 'בזמן רעידת אדמה ברכב, יש לעצור בבטחה ולהישאר בתוכו עד תום הרעידה, תוך הימנעות מעצירה על גשרים/מחלפים או מתחתם, ליד מבנים, או במדרונות — כל אלו מיקומים בסיכון מוגבר לקריסה או נפילת חפצים.',
    wrong: 'יציאה מהרכב באמצע כביש מסוכנת יותר מהישארות בתוכו; האצה בזמן רעידה מסוכנת ועלולה לגרום תאונה; ועצירה מתחת לגשר היא בדיוק אחד המיקומים המסוכנים ביותר — לא הבטוחים ביותר.'
  },
},
{
  id: 'GC_0147',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהו הסימן המובהק ביותר לצונאמי מתקרב, ומה יש לעשות בעת חשד?',
  multi: false,
  options: {
    'א': 'נסיגת מים פתאומית וחזקה מהחוף; יש לעזוב ולעלות לגובה (לפחות 4 קומות) מיד',
    'ב': 'עלייה הדרגתית ואיטית בגובה הגלים בלבד',
    'ג': 'אין סימנים מקדימים לצונאמי כלל',
    'ד': 'יש להישאר על החוף ולצלם את התופעה'
  },
  correct: 'א',
  explanation: {
    correct: 'הסימן המובהק ביותר לצונאמי מתקרב הוא נסיגת מים פתאומית וחזקה מהחוף. בעת חשד יש לעזוב את החוף ולהתרחק ממנו מיד, ולעלות לגובה של לפחות 4 קומות.',
    wrong: 'עלייה הדרגתית ואיטית אינה הסימן המזוהה — הנסיגה הפתאומית היא הדגל האדום המובהק; יש בהחלט סימנים מקדימים לזהות; והישארות על החוף לצילום היא סכנת חיים מיידית — יש לעזוב באופן מיידי.'
  },
},
{
  id: 'GC_0148',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'לאחר רעידת אדמה, אדם נמצא בתוך מבנה שניזוק קלות. מה עליו לעשות ומה להימנע ממנו?',
  multi: false,
  options: {
    'א': 'לנתק גז וחשמל ולצאת במהירות; אין להדליק אש/חשמל (חשש דליפת גז); אין לשתות מים שלא מבקבוק סגור',
    'ב': 'להדליק את החשמל כדי לבדוק נזקים',
    'ג': 'להישאר במקום ולהמתין למים מהברז',
    'ד': 'להיכנס מיד למבנים שכנים שניזוקו כדי לבדוק שכנים'
  },
  correct: 'א',
  explanation: {
    correct: 'לאחר רעידת אדמה, יש לנתק גז וחשמל (לדירה/לבניין) ולצאת במהירות. אין להדליק אש או חשמל (חשש לדליפת גז שעלולה להצית), ואין לשתות מים שלא מבקבוק סגור (חשש לזיהום ביוב).',
    wrong: 'הדלקת חשמל עלולה לגרום פיצוץ/שריפה אם קיימת דליפת גז; מי ברז עלולים להיות מזוהמים לאחר האסון; וכניסה למבנים שניזוקו (גם של שכנים) אסורה ללא אישור מהנדס, בשל סכנת קריסה נוספת מרעידות משנה.'
  },
},
{
  id: 'GC_0149',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהן "רעידות משנה" (Aftershocks), ומדוע הן מסוכנות?',
  multi: false,
  options: {
    'א': 'רעידות קטנות שאין בהן כל סיכון נוסף',
    'ב': 'רעידות שיכולות להופיע שעות עד חודשים לאחר הרעידה הראשית, ומסוכנות כי הן עלולות להפיל מבנים שכבר נחלשו',
    'ג': 'תופעה שקיימת רק בים, לא ביבשה',
    'ד': 'רעידות שמתרחשות רק בדקות הראשונות לאחר הרעידה הראשית'
  },
  correct: 'ב',
  explanation: {
    correct: 'רעידות משנה (Aftershocks) יכולות להופיע שעות עד חודשים לאחר הרעידה הראשית. הן מסוכנות במיוחד כי הן עלולות להפיל מבנים שכבר נחלשו על ידי הרעידה הראשית, גם אם הן עצמן חלשות יותר בעוצמתן.',
    wrong: 'רעידות משנה בהחלט מהוות סיכון נוסף, לא זניח; התופעה קיימת גם ביבשה, לא רק בים; והטווח הזמני שלהן ארוך בהרבה מדקות בודדות — עד חודשים.'
  },
},
{
  id: 'GC_0150',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות', multi: true,
  question: 'מה מומלץ לעשות ולא לעשות עבור אדם שנלכד בהריסות לאחר רעידת אדמה?',
  options: {
    'א': 'לנסות לחלץ את עצמו ולכסות דרכי נשימה בבד',
    'ב': 'להקיש על קירות/צינורות מתכת כדי שיאתרו אותו',
    'ג': 'לצעוק ברציפות כדי למשוך תשומת לב',
    'ד': 'לאבד תקווה אם לא הגיעה עזרה תוך זמן קצר'
  },
  correct: ['א', 'ב'],
  explanation: {
    correct: 'עבור אדם לכוד: לנסות לחלץ את עצמו, לכסות דרכי נשימה בבד (מגן אבק), ולהקיש על קירות/צינורות מתכת כדי שיאתרו אותו — הקשה חוסכת אנרגיה יחסית לצעקה.',
    wrong: 'צעקה ברציפות מתישה את הגוף במהירות ומבזבזת חמצן; ואיבוד תקווה עלול לפגוע ביכולת ההתמדה — ההנחיה המפורשת היא שלא לאבד תקווה, גם אם החילוץ מתעכב.'
  },
},
{
  id: 'GC_0151',
  source: 'generated', qtype: ['concept'], section: 'פגיעות סביבתיות',
  question: 'מהו "מתאר ניתוק" בהקשר של רעידת אדמה גדולה, ומה המשמעות עבור מתנדב/חובש?',
  multi: false,
  options: {
    'א': 'מצב שבו לאחר אסון המוני, ייתכן ותצטרך להסתדר בכוחות עצמך ולטפל בהתאם להכשרתך עם מה שנמצא סביבך, עד הגעת כוחות הצלה מקצועיים',
    'ב': 'מונח משפטי לניתוק חוזה ביטוח',
    'ג': 'מצב שבו כל התקשורת בארץ מנותקת לצמיתות',
    'ד': 'תרחיש שרלוונטי רק לצוותי חילוץ מקצועיים, לא לאזרחים'
  },
  correct: 'א',
  explanation: {
    correct: '"מתאר ניתוק" מתאר מצב שבו לאחר אסון המוני (כמו רעידת אדמה גדולה), עשוי להיווצר פער זמן ומשאבים שבו אדם — כולל מי שאינו איש מקצוע — יצטרך להסתדר בכוחות עצמו ולטפל בהתאם להכשרתו עם מה שנמצא סביבו, עד הגעת כוחות הצלה מקצועיים.',
    wrong: 'אין קשר למונחים משפטיים או ביטוחיים; הניתוק אינו בהכרח לצמיתות — הוא זמני עד הגעת עזרה; והתרחיש רלוונטי לכלל האוכלוסייה, לא רק לצוותי הצלה מקצועיים.'
  },
},

  // ---------------- מודול 14: קרינה — מענה מד"א בשעת חירום ----------------
  {
    id: 'GC_0152',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'מהו ההבדל המהותי בין קרינה מייננת לקרינה בלתי-מייננת, ומה הדוגמאות האופייניות לכל סוג?',
    multi: false,
    options: {
      'א': 'קרינה מייננת חזקה דיה לשנות את מבנה האטום (למשל פליטת אלקטרון); קרינה בלתי-מייננת חלשה יותר, אינה משנה את מבנה האטום ומתבטאת בעיקר כאנרגיה תרמית (למשל אינפרא-אדום, מיקרוגל, אור נראה)',
      'ב': 'ההבדל היחיד הוא הצבע הנראה לעין — קרינה מייננת תמיד כחולה',
      'ג': 'קרינה בלתי-מייננת מסוכנת יותר לגוף האדם מקרינה מייננת',
      'ד': 'קרינה מייננת קיימת רק בתוך כורים גרעיניים ואינה קיימת במקורות טבעיים'
    },
    correct: 'א',
    explanation: {
      correct: 'קרינה היא אנרגיה הנפלטת עקב אי-יציבות של הגרעין, ואינה ניתנת לזיהוי בעזרת אחד מחמשת החושים. קרינה מייננת היא קרינה חזקה מספיק כדי להשפיע על האטום ולגרום לשינוי במבנהו — כגון פליטת אלקטרון ממסלולו, המפרה את היציבות החשמלית של האטום. קרינה בלתי-מייננת חלשה יותר, אינה גורמת לשינוי במבנה האטום, ומתבטאת בעיקר כאנרגיה תרמית; דוגמאות: מנורות אינפרא-אדום, מיקרוגל, אור נראה.',
      wrong: 'קרינה מכל סוג אינה ניתנת לזיהוי חושי (כולל ראייה), כך שצבע אינו קריטריון הבחנה; להפך — קרינה מייננת היא המסוכנת יותר לגוף האדם, כיוון שהיא מסוגלת לשנות את מבנה התא ולגרום לנזק ביולוגי; וקרינה מייננת קיימת גם באופן טבעי במקורות רדיואקטיביים, לא רק בכורים גרעיניים.'
    },
  },
  {
    id: 'GC_0153',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'אילו מהמשפטים הבאים על סוגי הקרינה המייננת (אלפא, בטא, גמא) נכונים?',
    multi: true,
    options: {
      'א': 'קרינת אלפא מורכבת משני פרוטונים ושני נויטרונים (גרעין הליום), ונעצרת כבר בשכבת העור המתה או בנייר',
      'ב': 'קרינת בטא היא פליטת אלקטרון ממסלולו, גורמת לשינוי במטען החשמלי של הגרעין ללא שינוי משמעותי במסה, ונעצרת באמצעות אלומיניום או עופרת',
      'ג': 'קרינת גמא היא קרינה חלקיקית (לא אלקטרומגנטית), הגורמת לשינוי הן במטען והן במסת הגרעין',
      'ד': 'קרינת גמא היא קרינה אלקטרומגנטית (פוטונים) שאינה משנה את מטען הגרעין או מסתו, אלא רק גורמת לאובדן אנרגיה, ודורשת חציצה עבה של עופרת או בטון'
    },
    correct: ['א', 'ב', 'ד'],
    explanation: {
      correct: 'שלושת סוגי הקרינה המייננת העיקריים לפי חלקי האטום הנפלטים: אלפא — חלקיק המורכב מ-2 פרוטונים+2 נויטרונים (גרעין הליום), חדירות נמוכה מאוד, נעצר כבר בנייר/עור מת. בטא — פליטת אלקטרון ממסלולו, משנה את המטען החשמלי ללא שינוי משמעותי במסה, נעצר באלומיניום/עופרת. גמא — קרינה אלקטרומגנטית (פוטונים), אינה משנה מטען או מסה (רק גורמת לאובדן אנרגיה מהגרעין, כשנותר אותו יסוד), חדירות גבוהה מאוד ודורשת חציצה עבה (עופרת/בטון).',
      wrong: 'הטענה בסעיף ג שגויה — קרינת גמא היא קרינה אלקטרומגנטית (גלית), לא חלקיקית, ואינה גורמת לשינוי לא במטען ולא במסת הגרעין; לכן סעיף זה אינו נכון, בשונה משלושת האחרים.'
    },
  },
  {
    id: 'GC_0154',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'אילו חוצצים (מגנים) עוצרים כל אחד מסוגי הקרינה המייננת, לפי סדר החדירות שלהם?',
    multi: false,
    options: {
      'א': 'אלפא נעצרת כבר בנייר (חדירות נמוכה ביותר); בטא נעצרת באלומיניום/עופרת דקה; גמא, בעלת החדירות הגבוהה ביותר, דורשת חציצה עבה של עופרת או בטון',
      'ב': 'כל סוגי הקרינה המייננת נעצרים באותה מידה בנייר דק, ללא הבדל',
      'ג': 'קרינת גמא היא הקלה ביותר לחסימה, ונעצרת כבר בבד רגיל',
      'ד': 'קרינת אלפא היא בעלת החדירות הגבוהה ביותר ודורשת את החציצה העבה ביותר'
    },
    correct: 'א',
    explanation: {
      correct: 'סדר החדירות מהנמוכה לגבוהה: אלפא (הכי נמוכה — נעצרת בנייר/עור מת) פחות חודרת מבטא (בינונית — נעצרת באלומיניום/עופרת דקה, חדירה עד חצי מטר באוויר), שפחות חודרת מגמא (הכי גבוהה — חודרת רקמות ודורשת חציצה עבה של עופרת או בטון). ההגנה נבחרת בהתאם לסוג הקרינה שאליה נחשפים.',
      wrong: 'לא כל סוגי הקרינה נעצרים באותה חוצץ — ההבדלים בין הסוגים נובעים מהבדלי חדירות משמעותיים ביניהם; קרינת גמא היא דווקא בעלת החדירות הגבוהה ביותר מבין השלוש, ולכן דורשת את החציצה המשמעותית ביותר, לא ההפך; ואלפא היא דווקא הקלה ביותר לחסימה מבין השלוש, לא הקשה.'
    },
  },
  {
    id: 'GC_0155',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'צוות מד"א טיפל בנפגע שנחשף לשדה קרינה (למשל עמד בקרבת מקור קורן), ללא כל עדות לחומר רדיואקטיבי על גופו או ביגודו. מה נכון לגבי הסיכון לצוות המטפל?',
    multi: false,
    options: {
      'א': 'נפגע שנחשף לשדה קרינה בלבד, ללא זיהום, אינו מסכן את הצוות המטפל בו — נפגע קרינה אינו "זורח בלילה"',
      'ב': 'כל נפגע קרינה מסכן את הצוות המטפל באותה מידה, ללא קשר לקיום זיהום בפועל',
      'ג': 'יש להימנע מכל מגע עם נפגע שנחשף לקרינה, גם כשאין עדות לזיהום',
      'ד': 'רק רופא רשאי לגעת בנפגע שנחשף לקרינה, גם ללא זיהום'
    },
    correct: 'א',
    explanation: {
      correct: 'ההבחנה בין שדה קרינה לזיהום היא עקרון מרכזי במענה: חשיפה לשדה קרינה היא חשיפה לאנרגיה בלבד ואינה הופכת את הנפגע עצמו למקור קרינה; זיהום הוא הידבקות חומר רדיואקטיבי בפועל על גוף/ביגוד הנפגע, המחייב מיגון והפשטה לפני קרבה אליו. נפגע שנחשף לשדה קרינה בלבד, ללא זיהום, אינו מסכן את הצוות המטפל בו.',
      wrong: 'ההבחנה בין שדה קרינה לזיהום היא בדיוק הסיבה שלא כל הנפגעים מסוכנים לצוות באותה מידה; הימנעות גורפת ממגע עלולה לעכב טיפול מציל חיים שלא לצורך במקרה של חשיפה בלבד; והטיפול הראשוני בנפגע כזה אינו מוגבל לרופא בלבד — חובש רפואת חירום מוסמך לטפל בו.'
    },
  },
  {
    id: 'GC_0156',
    source: 'generated',
    qtype: ['scenario'],
    section: 'מענה מד"א בשעת חירום',
    question: 'הוזעקת לזירת אירוע שבה קיים חשד לזיהום רדיואקטיבי, ועליך להיכנס לטפל בנפגעים בשטח מזוהם. באיזו רמת מיגון אישי משתמש צוות מד"א, ומפני אילו סוגי קרינה מספקת הערכה הגנה?',
    multi: false,
    options: {
      'א': 'מיגון ברמת LEVEL C, תוך שימוש בערכת המלט"ק המספקת הגנה מפני זיהום חלקיקי אלפא ובטא',
      'ב': 'אין צורך בשום מיגון אישי בטיפול בנפגעי קרינה, כל עוד יש כפפות רגילות',
      'ג': 'מיגון ברמת LEVEL A בלבד, המשמש את צוותי מד"א לכל פעולה טיפולית בזירה מזוהמת',
      'ד': 'מסכת פנים רגילה, ללא ציוד נוסף, מספקת הגנה מלאה מפני כל סוגי הקרינה'
    },
    correct: 'א',
    explanation: {
      correct: 'צוותי מד"א מוגנים בערכת מלט"ק ברמת LEVEL C, המספקת הגנה מפני זיהום חלקיקי אלפא ובטא. בחשיפה לקרינת גמא, לעומת זאת, ההגנה אינה מבוססת בעיקר על ציוד המיגון, אלא על עקרונות זמן-מרחק-בידוד (חציצה בעופרת/בטון).',
      wrong: 'מיגון אישי הוא חובה בטיפול בנפגע מזוהם, מעבר לכפפות בלבד, כדי למנוע חשיפת הצוות; LEVEL A היא רמת מיגון גבוהה יותר המשמשת גורמים אחרים (כגון חילוץ נפגעים ללא סימני חיים), לא צוותי מד"א בפעולות טיפוליות שגרתיות; ומסכת פנים רגילה אינה חוצצת בפני קרינה מייננת.'
    },
  },
  {
    id: 'GC_0157',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'מהם שלושת העקרונות המרכזיים להגנת הצוות הרפואי מפני קרינת גמא בזירת אירוע קרינה?',
    multi: false,
    options: {
      'א': 'זמן (קיצור משך החשיפה למינימום ההכרחי), מרחק (הגדלה ככל האפשר מהמקור הקורן), ובידוד (חציצה מתאימה — עופרת/בטון/אלומיניום)',
      'ב': 'מהירות, כוח, ותאוצה — עקרונות פיזיקליים כלליים בלבד',
      'ג': 'חמצן, לחץ אטמוספרי, וטמפרטורת הסביבה',
      'ד': 'מיגון נשימתי בלבד; אין צורך בגורמים נוספים בחשיפה לקרינת גמא'
    },
    correct: 'א',
    explanation: {
      correct: 'שלושת עקרונות ההגנה מפני קרינת גמא, שאותם צריך ליישם בשימוש נכון במיגון: זמן — קיצור זמן החשיפה למינימום ההכרחי; מרחק — הגדלת המרחק ככל הניתן ממקורות קורנים; ובידוד — שימוש בחוצץ מתאים (נייר עוצר אלפא; אלומיניום/עופרת דקה עוצרים בטא; עופרת/בטון עבים עוצרים גמא).',
      wrong: 'שלוש האפשרויות האחרות אינן קשורות לעקרונות ההגנה מפני קרינה; מיגון נשימתי בלבד אינו מספק הגנה מפני קרינת גמא החודרת דרך רקמות — נדרש שילוב של זמן-מרחק-בידוד יחד עם מיגון אישי מתאים.'
    },
  },
  {
    id: 'GC_0158',
    source: 'generated',
    qtype: ['scenario'],
    section: 'מענה מד"א בשעת חירום',
    question: 'הגעת לנפגע עם פגיעת ראש חודרת בתאונת עבודה, בסמוך למתקן שנחשד כקורן, כשקיים חשד לחשיפה לקרינה. מה סדר הפעולות הנכון?',
    multi: false,
    options: {
      'א': 'טיפול בטראומה על-פי עקרונות PHTLS קודם לטיפול בקרינה — הטראומה מסכנת חיים באופן מיידי, בעוד השפעת הקרינה לרוב אינה מיידית',
      'ב': 'יש לטפל תחילה בקרינה — למשל להמתין לניטור מלא — ורק לאחר מכן להתחיל בטיפול בטראומה',
      'ג': 'אין לגעת בנפגע כלל עד לוודא באופן מוחלט את היעדר הקרינה',
      'ד': 'יש להזריק תרופה "אנטי-קרינה" לפני כל טיפול אחר בזירה'
    },
    correct: 'א',
    explanation: {
      correct: 'עיקרון מרכזי בטיפול בנפגעי קרינה: טראומה קודמת לקרינה. פגיעה טראומטית מסכנת חיים באופן מיידי, בעוד שהשפעות הקרינה (במידה וקיימת חשיפה) לרוב אינן מתבטאות מיד. לכן מטפלים בטראומה על-פי PHTLS, כולל הרחקה מהירה מהזירה, ורק לאחר מכן, במידת הצורך, מטפלים בהיבטי הקרינה (הפשטה, טיהור).',
      wrong: 'עיכוב טיפול בטראומה קשה עד לבירור מלא של מצב הקרינה עלול לעלות בחיי הנפגע שלא לצורך; המתנה עד לוידוא מוחלט של היעדר קרינה מנוגדת לעקרון הטיפול הדחוף בטראומה מסכנת חיים; ואין תרופה "אנטי-קרינה" הניתנת כפעולה ראשונה וגורפת בשטח באירועי קרינה.'
    },
  },
  {
    id: 'GC_0159',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'מהי הפעולה היעילה ביותר להפחתת זיהום חיצוני בנפגע שעליו פוזר חומר רדיואקטיבי (על גופו/ביגודו)?',
    multi: false,
    options: {
      'א': 'הפשטת הנפגע (הסרת הבגדים המזוהמים) — מרחיקה כ-90% מכמות הזיהום, ולאחריה שטיפה במים וסבון בדרך כלל מספיקה לטיהור החיצוני הנותר',
      'ב': 'יש להשאיר את הבגדים על הנפגע, כדי למנוע פיזור נוסף של הזיהום',
      'ג': 'יש להמתין שהזיהום יתפוגג מעצמו, ללא כל התערבות אקטיבית',
      'ד': 'ניגוב יבש בלבד, ללא מים כלל, הוא הפעולה המומלצת היחידה לטיהור'
    },
    correct: 'א',
    explanation: {
      correct: 'הפשטת הנפגע (הסרת הבגדים המזוהמים) מרחיקה כ-90% מכמות הזיהום החיצוני — זוהי הפעולה היעילה ביותר והראשונה. לאחר ההפשטה, שטיפה במים וסבון בדרך כלל מספיקה להשלמת הטיהור החיצוני.',
      wrong: 'השארת הבגדים על הנפגע דווקא משאירה עליו את רוב הזיהום; המתנה פסיבית אינה פעולה טיפולית מומלצת ומאריכה חשיפה מיותרת; וניגוב יבש בלבד, ללא הפשטה ומים, אינו מחליף את השילוב של הפשטה ושטיפה במים וסבון.'
    },
  },
  {
    id: 'GC_0160',
    source: 'generated',
    qtype: ['concept'],
    section: 'מענה מד"א בשעת חירום',
    question: 'מה ההבדל בין נזק דטרמיניסטי לנזק סטוכוסטי כתוצאה מחשיפה לקרינה מייננת, ואילו דוגמאות מייצגות כל סוג?',
    multi: false,
    options: {
      'א': 'נזק דטרמיניסטי (כגון כוויות קרינה, מחלת קרינה חריפה) מופיע תוך זמן קצר ויש לו סף מנה ברור להופעתו; נזק סטוכוסטי (כגון ממאירות, מומים גנטיים) מופיע לרוב אחרי שנים, ועולה בשכיחותו הסטטיסטית כתוצאה מהחשיפה, ללא סף ברור להופעתו',
      'ב': 'שני הסוגים מופיעים תמיד תוך דקות מרגע החשיפה, ללא הבדל משמעותי בעיתוי',
      'ג': 'נזק סטוכוסטי הוא תמיד חמור וקטלני יותר מנזק דטרמיניסטי, בכל מקרה',
      'ד': 'אין הבדל מהותי בין שני המושגים — הם שני כינויים לאותה תופעה'
    },
    correct: 'א',
    explanation: {
      correct: 'נזק דטרמיניסטי מופגן תוך זמן קצר, נגרם ישירות מהקרינה, ויש לו סף מנה מוגדר להופעתו (למשל כוויות קרינה החל מ-300 ראד: נשירת שיער; 600 ראד: אריתמה; 1000-1500 ראד: נזק אפידרמלי; 2000-5000 ראד: נזק דרמלי; מעל 5000 ראד: נמק. וכן מחלת קרינה חריפה מ-100 ראד/1 Gray ומעלה חשיפה כלל-גופית). נזק סטוכוסטי מופגן לרוב אחרי שנים, עולה בשכיחות הסטטיסטית כתוצאה מהחשיפה ואינו תלוי בסף ברור להופעתו (למשל מומים גנטיים, עלייה בשכיחות ממאירות).',
      wrong: 'נזק סטוכוסטי דווקא אינו מופיע תוך דקות, אלא לרוב שנים לאחר החשיפה — זהו ההבדל המרכזי בין שני הסוגים; חומרת הנזק אינה נגזרת אוטומטית מסיווגו כדטרמיניסטי/סטוכוסטי, אלא ממאפייני החשיפה בפועל; וההבחנה בין הסוגים משמעותית קלינית — עיתוי ההופעה ותלות (או אי-תלות) בסף מנה שונים מהותית בין השניים.'
    },
  },
  {
    id: 'GC_0161',
    source: 'generated',
    qtype: ['scenario'],
    section: 'מענה מד"א בשעת חירום',
    question: 'אתה מפנה נפגע עם חשד לזיהום רדיואקטיבי לבית חולים, לאחר שטיפלת בפגיעותיו הדחופות. מה עליך לוודא לפני ההגעה, ולאן עדיף לפנות?',
    multi: false,
    options: {
      'א': 'למסור הודעה מוקדמת לבית החולים על הגעת נפגע מזוהם, ולהעדיף פינוי לבית חולים ייעודי המוכן לקבל נפגעי קרינה (כגון שיבא, וולפסון, בילינסון, עין כרם, רמב"ם, כרמל וסורוקה), תוך המשך פעולה על-פי עקרונות PHTLS',
      'ב': 'אין צורך במסירת הודעה מוקדמת — ניתן להגיע לכל בית חולים ללא כל התראה מראש',
      'ג': 'יש להמתין בזירה עד להגעת צוות מיוחד מבית החולים, ולא לפנות כלל באמבולנס רגיל',
      'ד': 'יש לפנות אך ורק למרכזי טראומה-על, גם כשאין פגיעה טראומטית משמעותית'
    },
    correct: 'א',
    explanation: {
      correct: 'חובה למסור הודעה מוקדמת לבית החולים על הגעת נפגע מזוהם, כדי לאפשר היערכות (למשל תחנת הפשטה וטיהור). מומלץ להעדיף פינוי לבתי חולים ייעודיים המוכנים לקבל נפגעי קרינה. יחד עם זאת, כשקיימת גם טראומה מסכנת חיים, שיקול הטראומה (פינוי למרכז טראומה/בי"ח הקרוב ביותר) מנחה בראש ובראשונה, בהתאם לעקרון "טראומה קודמת לקרינה".',
      wrong: 'הודעה מוקדמת חיונית להיערכות בית החולים ולמניעת עיכוב או בלבול בקבלת הנפגע; המתנה בזירה לצוות מיוחד עלולה לעכב פינוי דחוף שלא לצורך; ופינוי אך ורק למרכזי טראומה-על אינו נדרש כאשר אין פגיעה טראומטית קשה — ההחלטה על יעד הפינוי מונחית לפי חומרת הפגיעה ומידת הזיהום.'
    },
  },

// ================= הטיפול בחולה (35) =================
{ id: 'GC_0162', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהאוכלוסיות הבאות נמצאות בסיכון מוגבר לדלקת ריאות?',
  options:{'א':'קשישים','ב':'ילדים','ג':'חולי HIV/COPD','ד':'ספורטאים בריאים ללא רקע רפואי'},
  correct:['א','ב','ג'],
  explanation:{correct:'אוכלוסיות בסיכון מוגבר לדלקת ריאות: קשישים, ילדים, חולי HIV, חולי COPD, ומטופלים לאחר טביעה/אינטובציה או שכיבה ממושכת.', wrong:'ספורטאים בריאים ללא רקע רפואי אינם קבוצת סיכון מוגדרת — להפך, בריאות תפקודית טובה מפחיתה סיכון.'} },
{ id: 'GC_0163', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהבאים הם גורמים אפשריים לדלקת ריאות?',
  options:{'א':'זיהומי (חיידקי/ויראלי/פטרייתי)','ב':'כימי (אספירציה/שאיפת עשן)','ג':'שכיבה ממושכת','ד':'מאמץ גופני קל'},
  correct:['א','ב','ג'],
  explanation:{correct:'דלקת ריאות יכולה להיגרם מגורם זיהומי (חיידקי/ויראלי/פטרייתי), כימי (אספירציה של תוכן קיבה או שאיפת עשן), אוטואימוני, מחלות כרוניות, או שכיבה ממושכת שפוגעת בניקוז הפרשות מהריאות.', wrong:'מאמץ גופני קל אינו גורם מוכר לדלקת ריאות — אינו קשור למנגנוני המחלה שנלמדו.'} },
{ id: 'GC_0164', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מהם גורמי הסיכון העיקריים ל-COPD?',
  multi:false,
  options:{'א':'עישון כבד, זיהום אוויר, AIDS','ב':'אכילת יתר בלבד','ג':'מחלה תורשתית בלבד ללא גורמים סביבתיים','ד':'חשיפה לשמש מוגזמת'},
  correct:'א',
  explanation:{correct:'גורמי הסיכון העיקריים ל-COPD (הכוללת נפחת וברונכיטיס כרוני) הם עישון כבד, זיהום אוויר, ו-AIDS.', wrong:'אכילת יתר, תורשה בלעדית, וחשיפה לשמש אינם מוכרים כגורמי הסיכון העיקריים ל-COPD.'} },
{ id: 'GC_0165', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה מייצג הראשי-תיבות PQRST באנמנזת כאב חזה?',
  multi:false,
  options:{'א':'Provoke, Quality, Region/Radiation/Risk, Severity, Time','ב':'Pain, Quiet, Rest, Sleep, Temperature','ג':'Pulse, Quality, Rhythm, Skin, Temperature','ד':'Position, Question, Report, Speed, Treatment'},
  correct:'א',
  explanation:{correct:'PQRST באנמנזת כאב חזה: Provoke (מה מעורר/מקל), Quality (איכות הכאב), Region/Radiation/Risk (מיקום/הקרנה/סיכון), Severity (עוצמה), Time (זמן).', wrong:'שאר האפשרויות מציגות ראשי-תיבות שאינם תואמים למונחים המקוריים של PQRST.'} },
{ id: 'GC_0166', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה מייצג הראשי-תיבות SOCRATES באנמנזת כאב?',
  multi:false,
  options:{'א':'Site, Onset, Character, Radiation, Associated symptoms, Time course, Exacerbating/relieving, Severity','ב':'Sound, Odor, Color, Rate, Age, Time, Emotion, Sign','ג':'Signs, Onset, Cause, Report, Awareness, Treatment, Evacuation, Severity','ד':'Site, Observation, Cause, Rate, Anamnesis, Treatment, Evacuation, Sign'},
  correct:'א',
  explanation:{correct:'SOCRATES: Site (מיקום), Onset (התחלה), Character (אופי), Radiation (הקרנה), Associated symptoms (תסמינים נלווים), Time course (מהלך זמן), Exacerbating/relieving (מחמיר/מקל), Severity (עוצמה) — כלי מקיף להערכת כאב, דומה במטרתו ל-OPQRST.', wrong:'שאר הצירופים משתמשים במונחים שאינם חלק מהראשי-תיבות SOCRATES המקורי.'} },
{ id: 'GC_0167', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'למה מתייחס הקיצור CABG?',
  multi:false,
  options:{'א':'ניתוח מעקפים','ב':'צנתור לבבי','ג':'אוטם לבבי חריף','ד':'אי ספיקת לב'},
  correct:'א',
  explanation:{correct:'CABG (Coronary Artery Bypass Graft) מתייחס לניתוח מעקפים לבביים — פתרון כירורגי לחסימת עורקים כליליים.', wrong:'צנתור לבבי מסומן PTCA/PCI; אוטם לבבי חריף מסומן AMI; אי ספיקת לב מסומנת CHF — כל אלו קיצורים שונים.'} },
{ id: 'GC_0168', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מהו PTCA/PCI?',
  multi:false,
  options:{'א':'צנתור לב (עם בלון+סטנט)','ב':'ניתוח מעקפים','ג':'אי ספיקת כליות','ד':'טיפול נמרץ כללי'},
  correct:'א',
  explanation:{correct:'PTCA/PCI מתייחס לצנתור לבבי — הכנסת בלון וסטנט להרחבת עורק כלילי חסום, כטיפול דפיניטיבי בבי"ח.', wrong:'ניתוח מעקפים הוא CABG; אי ספיקת כליות היא CRF; טיפול נמרץ כללי הוא ICU — לא PTCA/PCI.'} },
{ id: 'GC_0169', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהצירופים הבאים בין קיצור לפירוש נכונים?',
  options:{'א':'AMI = אוטם לבבי חריף','ב':'CHF = אי ספיקת לב','ג':'CRF = אי ספיקת כליות','ד':'ICU = טיפול נמרץ לב'},
  correct:['א','ב','ג'],
  explanation:{correct:'AMI = אוטם לבבי חריף, CHF = אי ספיקת לב, CRF = אי ספיקת כליות — כל אלו קיצורים נכונים מתוך הרשימה שנלמדה.', wrong:'ICU הוא טיפול נמרץ כללי, לא טיפול נמרץ לב — טיפול נמרץ לב מסומן CCU.'} },
{ id: 'GC_0170', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה ההבדל בין תרופות NSAID לתרופות Opioids כמשככי כאב?',
  multi:false,
  options:{'א':'NSAID (אספירין, איבופרופן, וולטרן) — נוגדות דלקת לא-סטרואידיות; Opioids (מורפין, פנטניל, אוקסיקודון) — נגזרות אופיום, חזקות יותר ובעלות פוטנציאל התמכרות/דיכוי נשימתי',
    'ב':'שתי הקבוצות זהות במנגנון ובעוצמה',
    'ג':'NSAID הן החזקות יותר מבין השתיים',
    'ד':'Opioids משמשות רק לילדים'},
  correct:'א',
  explanation:{correct:'NSAID (אספירין, איבופרופן/נורופן, וולטרן) הן משככי כאב נוגדי-דלקת לא-סטרואידיים. Opioids (מורפין, אוקסיקודון/פרקוסט, פנטניל, טרג\'ין) הן משככי כאב חזקים יותר, נגזרות אופיום, עם סיכון להתמכרות ולדיכוי נשימתי — חשוב לזהות בביתו של מטופל כאיתות למחלת רקע/כאב כרוני.', wrong:'שתי הקבוצות שונות במנגנון ובעוצמה; Opioids הן החזקות יותר, לא NSAID; ואינן ייעודיות לילדים — נפוצות בכל הגילאים למצבי כאב חמור.'} },
{ id: 'GC_0171', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהצירופים הבאים בין קטגוריית תרופה לתפקידה נכונים?',
  options:{'א':'ליפיטור/סימבקור/קרסטור — סטטינים, להורדת כולסטרול','ב':'נקסיום/לוסק — PPI, לטיפול בכיב/צרבת','ג':'זנטק — חוסם H2, לטיפול בכיב/צרבת','ד':'קונקור/דילפרס — סטטינים'},
  correct:['א','ב','ג'],
  explanation:{correct:'ליפיטור, סימבקור וקרסטור הם סטטינים (להורדת כולסטרול). נקסיום ולוסק הם PPI לטיפול בכיב/צרבת. זנטק הוא חוסם H2, גם הוא לכיב/צרבת.', wrong:'קונקור ודילפרס הם חוסמי בטא (לב/לחץ דם), לא סטטינים — יש להיזהר מבלבול קטגוריות תרופתיות דומות בצליל.'} },
{ id: 'GC_0172', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מטופל נוטל אלטרוקסין/יוטירוקס. לאיזו מחלת בלוטת תריס סביר שהוא מטופל?',
  multi:false,
  options:{'א':'תת-פעילות בלוטת התריס','ב':'יתר-פעילות בלוטת התריס','ג':'סוכרת','ד':'יתר לחץ דם'},
  correct:'א',
  explanation:{correct:'אלטרוקסין/יוטירוקס משמשות לטיפול בתת-פעילות בלוטת התריס (השלמת הורמון תריס חסר). לעומת זאת, מרקפטיזול/PPU משמשות לטיפול ביתר-פעילות בלוטת התריס.', wrong:'תרופות אלו אינן קשורות לסוכרת או ליתר לחץ דם — אלו קטגוריות תרופתיות נפרדות לחלוטין.'} },
{ id: 'GC_0173', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהצירופים הבאים בין תרופה פסיכיאטרית לקטגוריה נכונים?',
  options:{'א':'הלידול/ריספרדל — אנטי-פסיכוטיות','ב':'פרוזק/ציפרלקס — נוגדי דיכאון','ג':'ואבן/וליום — בנזודיאזפינים','ד':'קפרה/טגרטול — נוגדות קרישה'},
  correct:['א','ב','ג'],
  explanation:{correct:'הלידול, סרוקוול, ריספרדל — אנטי-פסיכוטיות. פרוזק, ציפרלקס, לוסטרל — נוגדי דיכאון. ואבן, קלונקס, וליום/דיאזפאם, דורמיקום/מידזולם — בנזודיאזפינים.', wrong:'קפרה וטגרטול הן תרופות אנטי-אפילפטיות (יחד עם למיקטל), לא נוגדות קרישה — נוגדות קרישה הן קלקסן/קומדין/הפרין/אליקוויס וכד\'.'} },
{ id: 'GC_0174', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה ההבדל בין פרכוס חלקי לפרכוס גדול (Grand Mal)?',
  multi:false,
  options:{'א':'פרכוס חלקי מוגבל להמיספרה מוחית אחת; פרכוס גדול משפיע על שתי ההמיספרות ועובר שלבים טוני-קלוני-פוסט-איקטלי','ב':'אין הבדל בין השניים','ג':'פרכוס חלקי תמיד חמור יותר מפרכוס גדול','ד':'פרכוס חלקי מתרחש רק בילדים'},
  correct:'א',
  explanation:{correct:'פרכוס חלקי מוגבל להמיספרה מוחית אחת (ולכן עשוי להתבטא בתנועה/תחושה מקומית בלבד). פרכוס גדול (Grand Mal) משפיע על שתי ההמיספרות ועובר שלושה שלבים: טוני, קלוני, ופוסט-איקטלי.', wrong:'קיים הבדל משמעותי בהיקף המעורבות המוחית; פרכוס גדול לרוב נחשב מקיף/דרמטי יותר מבחינת ביטוי חיצוני; ופרכוס חלקי אינו מוגבל לגיל מסוים.'} },
{ id: 'GC_0175', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה מאפיין התקף קטן (Petit Mal)?',
  multi:false,
  options:{'א':'פגיעה קצרה בשיווי משקל/הכרה, ללא תנועות טוניות-קלוניות בולטות','ב':'תמיד מלווה בעוויתות קשות בכל הגוף','ג':'נמשך תמיד מעל 10 דקות','ד':'מתרחש רק בקשישים'},
  correct:'א',
  explanation:{correct:'התקף קטן (Petit Mal) מאופיין בפגיעה קצרה בשיווי משקל או בהכרה, ללא תנועות טוניות-קלוניות בולטות — בניגוד להתקף הגדול (Grand Mal) הדרמטי יותר.', wrong:'עוויתות קשות בכל הגוף מאפיינות פרכוס גדול, לא קטן; משכו קצר בד"כ, לא ממושך כמו סטטוס אפילפטיקוס; ואינו מתרחש רק בקשישים — שכיח דווקא בילדים.'} },
{ id: 'GC_0176', source:'generated', qtype:['scenario'], section:'הטיפול בחולה',
  question:'מטופל סוכרתי נמצא עם נשימות מהירות ועמוקות, ריח אצטון מהפה, יובש ריריות ומתן שתן מרובה. במה תחשד ומה תעשה?',
  multi:false,
  options:{'א':'היפוגליקמיה; לתת גלוקוג\'ל','ב':'היפרגליקמיה; ABC, נוזלים, הנחיה לשימוש עצמאי באינסולין אם המטופל מסוגל, פינוי דחוף — אין לתת אינסולין ע"י החובש','ג':'התקף אסתמה; לתת משאף','ד':'הרעלת CO; להוציא לאוויר פתוח'},
  correct:'ב',
  explanation:{correct:'ריח אצטון, נשימות מהירות ועמוקות (נשימות קוסמאול, פיצוי על חמצת מטבולית), יובש ריריות ופוליאוריה מתאימים להיפרגליקמיה/חמצת סוכרתית (DKA), המתפתחת באיטיות. הטיפול: ABC, נוזלים, הנחיה לשימוש עצמאי באינסולין אם המטופל מסוגל וזמין לו, ופינוי דחוף — אין לתת אינסולין ע"י החובש בשום מצב.', wrong:'היפוגליקמיה מתפתחת מהר ומציגה עור קר ולח, לא יובש ואצטון; אין קשר לאסתמה או להרעלת CO — התמונה כאן ספציפית לחמצת סוכרתית.'} },
{ id: 'GC_0177', source:'generated', qtype:['concept'], section:'הטיפול בחולה', multi:true,
  question:'אילו מהבאים הם גורמים מוכרים לאנפילקסיס?',
  options:{'א':'מזון (בוטנים, אגוזים, מאכלי ים)','ב':'עקיצות/הכשות','ג':'תרופות ולטקס','ד':'מים רגילים בשתייה'},
  correct:['א','ב','ג'],
  explanation:{correct:'גורמים מוכרים לאנפילקסיס: מזון (בוטנים, אגוזים, מאכלי ים, ביצים, חלב, שומשום), עקיצות/הכשות, תרופות, לטקס, ולעיתים ללא גורם מזוהה (אדיופתי).', wrong:'מים רגילים בשתייה אינם גורם מוכר לאנפילקסיס — אינם אלרגן טיפוסי.'} },
{ id: 'GC_0178', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'באילו מצבים בדיקת מילוי קפילרי עלולה להיות לא אמינה?',
  multi:false,
  options:{'א':'קור וגיל מבוגר (קשישים)','ב':'רק בילדים מתחת לגיל שנה','ג':'רק בזמן פעילות גופנית','ד':'הבדיקה אמינה תמיד בכל מצב'},
  correct:'א',
  explanation:{correct:'מילוי קפילרי (תקין עד 2 שניות) עלול להיות לא אמין בסביבה קרה ובקשישים — גורמים שמאטים זרימת דם היקפית ללא קשר להלם אמיתי, ועלולים להטעות בהערכה.', wrong:'המדד רלוונטי לכל הגילאים, לא רק תינוקות; פעילות גופנית אינה הגורם המרכזי המשפיע על אמינותו; והוא בהחלט אינו אמין בכל מצב — קור וגיל מבוגר הם הסייגים הידועים.'} },
{ id: 'GC_0179', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מטופל אינו מגיב לקריאה בשמו, אך פוקח עיניים ומזיז יד כשמופעל עליו גירוי כאב. איזו רמת AVPU זו?',
  multi:false,
  options:{'א':'Alert','ב':'Voice','ג':'Pain','ד':'Unresponsive'},
  correct:'ג',
  explanation:{correct:'כאשר המטופל אינו מגיב לקול (Voice) אך כן מגיב לגירוי כאב (תנועה/פקיחת עיניים) — הרמה המתאימה בסולם AVPU היא Pain.',
    wrong:'Alert דורש תגובה ספונטנית ללא צורך בגירוי; Voice דורש תגובה לקול בלבד; Unresponsive פירושו העדר תגובה לחלוטין, גם לא לכאב — אף אחת מהן אינה תואמת את התיאור.'} },
{ id: 'GC_0180', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה הקשר בין סרגל סינסינטי (CPSS) ל-FAST?',
  multi:false,
  options:{'א':'שני כלים נפרדים לחלוטין ללא קשר',
    'ב':'שניהם בודקים דיבור, השמטת זרוע ואי-סימטריות פנים — FAST מוסיף גם את מרכיב הזמן (Time)',
    'ג':'CPSS בודק רק ראייה','ד':'FAST משמש רק לילדים'},
  correct:'ב',
  explanation:{correct:'סרגל סינסינטי (CPSS) ו-FAST חולקים את אותם שלושה מרכיבי בדיקה: דיבור, השמטת זרוע, ואי-סימטריות פנים. FAST מוסיף גם את מרכיב הזמן (Time) — תיעוד שעת הופעת התסמינים, קריטי לזכאות לטיפול טרומבוליטי.', wrong:'שני הכלים חולקים ליבה משותפת, לא נפרדים; אף אחד מהם אינו בודק ראייה (Sight אינו חלק מ-FAST); ושניהם משמשים למבוגרים בחשד שבץ, לא לילדים.'} },
{ id: 'GC_0181', source:'generated', qtype:['scenario'], section:'הטיפול בחולה',
  question:'מטופל דיווח על חולשת יד וקושי דיבור שנמשכו כ-20 דקות וחלפו לחלוטין לפני הגעתך. מה תעשה?',
  multi:false,
  options:{'א':'לומר לו שהכל בסדר ולא לפנות, כי התסמינים חלפו',
    'ב':'לחשוד ב-TIA (שבץ חולף); לתעד את שעת הופעת וחלוף התסמינים, לבצע הערכה מלאה כולל בדיקת סוכר, ולפנות להערכה — TIA מהווה סימן אזהרה לשבץ עתידי',
    'ג':'להזריק אדרנלין ליתר ביטחון','ד':'להמליץ על מנוחה בבית בלבד ללא כל פינוי'},
  correct:'ב',
  explanation:{correct:'תסמינים נוירולוגיים שחלפו לחלוטין תוך דקות-שעות מתאימים ל-TIA (שבץ חולף). למרות ההחלמה המלאה, TIA מהווה סימן אזהרה משמעותי לסיכון שבץ מלא בעתיד הקרוב, ולכן יש לתעד במדויק את הזמנים, לבצע הערכה מלאה (כולל בדיקת סוכר לשלילת היפוגליקמיה) ולהמליץ בתוקף על פינוי להערכה רפואית.', wrong:'אין להתעלם ולומר "הכל בסדר" — TIA דורש בירור רפואי דחוף; אדרנלין אינו רלוונטי כלל למצב זה; והמלצה על מנוחה בבית בלבד מתעלמת מהסיכון המשמעותי לשבץ עתידי.'} },
{ id: 'GC_0182', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מדוע נותנים אספירין בלעיסה (ולא בבליעה שלמה) בחשד ACS?',
  multi:false,
  options:{'א':'לעיסה מזרזת ספיגה מהירה יותר דרך רירית הפה, מה שמקצר את הזמן עד להשפעה',
    'ב':'זה נעשה רק כדי לשפר את הטעם','ג':'אין הבדל בין לעיסה לבליעה שלמה','ד':'לעיסה נדרשת רק אם אין למטופל שיניים'},
  correct:'א',
  explanation:{correct:'לעיסת אספירין מזרזת את ספיגתו — חלקית דרך רירית הפה ומהר יותר במעי — כך שההשפעה נגד-הצמדת טסיות מתחילה מוקדם יותר, דבר קריטי בחשד ACS/MI. במטופל ללא שיניים, ניתן לפורר את הכדור לספיגה תת-לשונית.', wrong:'זה אינו עניין של טעם; יש הבדל משמעותי במהירות הספיגה בין לעיסה לבליעה שלמה; והפירור נדרש בהיעדר שיניים כתחליף ללעיסה, לא כתנאי בלעדי ללעיסה עצמה.'} },
{ id: 'GC_0183', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מהן תופעות הלוואי העיקריות של תרופות ניטרטים (לתעוקת חזה)?',
  multi:false,
  options:{'א':'נפילת לחץ דם וכאבי ראש','ב':'עלייה משמעותית בלחץ דם','ג':'עצירות קשה','ד':'עלייה בחום גוף'},
  correct:'א',
  explanation:{correct:'ניטרטים (איזוקרדיד, ניטרודרם, מונוקורד, איזוקט, ניטרוסטט) גורמים להרחבת כלי דם, ולכן תופעות הלוואי העיקריות הן נפילת לחץ דם וכאבי ראש.', wrong:'ניטרטים גורמים לירידה בל"ד, לא לעלייה בו; אינם קשורים לעצירות או לעלייה בחום גוף — אלו אינם תופעות הלוואי המוכרות שלהם.'} },
{ id: 'GC_0184', source:'generated', qtype:['scenario'], section:'הטיפול בחולה',
  question:'מטופל עם תעוקת חזה מוכרת נטל את הניטרט האישי שלו, אך הכאב נמשך מעל 20 דקות ואינו מוקל. מה המשמעות?',
  multi:false,
  options:{'א':'אין משמעות מיוחדת, זה קורה לפעמים',
    'ב':'כאב שאינו מוקל בניטרטים ונמשך מעל רבע שעה חורג מדפוס תעוקה יציבה — יש לטפל כחשד ACS/MI',
    'ג':'יש לתת לו מנת ניטרט נוספת שוב ושוב עד שהכאב יחלוף',
    'ד':'זהו סימן ודאי להתקף חרדה בלבד'},
  correct:'ב',
  explanation:{correct:'כאב שאינו מוקל בניטרטים ונמשך מעל 15-20 דקות חורג מהדפוס הרגיל של תעוקת חזה יציבה, ומעלה חשד לתעוקה בלתי-יציבה או MI — יש לטפל כחשד ACS ולפעול בהתאם (הושבה, מדדים, שקילת אספירין, פינוי דחוף).', wrong:'זה אינו "קורה סתם" — זהו סימן משמעותי לשינוי במצב הקליני; מתן מנות נוספות שוב ושוב ללא בקרה רפואית עלול להוריד ל"ד באופן מסוכן; והנחה של חרדה בלבד עלולה למסך אבחנה מסכנת חיים.'} },
{ id: 'GC_0185', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'אילו תסמינים "לא-קלאסיים" עלולים להופיע ב-MI, מעבר לכאב חזה?',
  multi:false,
  options:{'א':'בחילות/הקאות, חולשה, חוסר הכרה',
    'ב':'רק כאב חזה, ללא כל תסמין אחר אפשרי',
    'ג':'רק חום גבוה','ד':'רק שיעול'},
  correct:'א',
  explanation:{correct:'תסמינים נוספים אפשריים ב-MI, מעבר לכאב/אי-נוחות בחזה: הקרנה לכתפיים/גב/צוואר/ידיים/לסת/בטן, חיוורון+הזעה, בחילות/הקאות, קוצר נשימה, פלפיטציות, וחולשה/חוסר הכרה — במיוחד באוכלוסיות אטיפיות (קשישים, נשים, סוכרתיים).', wrong:'MI יכול להתבטא במגוון תסמינים מעבר לכאב חזה בלבד; חום גבוה ושיעול אינם תסמינים אופייניים ל-MI — הם מכוונים יותר לכיוון זיהומי/נשימתי.'} },
{ id: 'GC_0186', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'כיצד מטפלים בדימום מהאף (אפיסטקסיס)?',
  multi:false,
  options:{'א':'לחיצה על הנחיריים, עם רכינה קדימה (לא לאחור)',
    'ב':'רכינה לאחור כדי למנוע איבוד דם','ג':'הטיית ראש הצידה בלבד ללא לחיצה','ד':'הימנעות מכל מגע באף'},
  correct:'א',
  explanation:{correct:'הטיפול בדימום מהאף כולל לחיצה על הנחיריים, עם רכינת הראש קדימה — לא לאחור, כדי למנוע בליעת דם ואפשרות הקאה/שאיפה.', wrong:'רכינה לאחור עלולה לגרום לבליעת דם ובחילה/הקאה; הטיה צידה בלבד ללא לחיצה אינה מספקת לעצירת הדימום; והימנעות ממגע לגמרי אינה מטפלת בדימום הפעיל.'} },
{ id: 'GC_0187', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'כיצד יש לטפל באיבר קטוע לצורך העברתו לבי"ח יחד עם המטופל?',
  multi:false,
  options:{'א':'לשמור, לעטוף בגזה סטרילית לחה, בתוך שקית, על קרח (לא במגע ישיר עם הקרח)',
    'ב':'להשליכו — אינו רלוונטי יותר לטיפול','ג':'להניחו ישירות על קרח ללא עטיפה','ד':'לשטוף אותו במים חמים ולעטוף ביבש'},
  correct:'א',
  explanation:{correct:'איבר קטוע יש לשמור, לעטוף בגזה סטרילית לחה, להכניס לשקית, ולהניח על קרח — ללא מגע ישיר עם הקרח (כדי למנוע נזק קור נוסף לרקמה) — ולהעביר יחד עם המטופל לבי"ח, שם יישקל שחזור כירורגי.',
    wrong:'האיבר עדיין רלוונטי ויש לשמרו לצורך אפשרות שחזור; מגע ישיר עם קרח עלול לגרום נזק קור נוסף לרקמה; ומים חמים ועטיפה יבשה אינם הטיפול הנכון — יש לשמור על לחות וקירור עקיף.'} },
{ id: 'GC_0188', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'כיצד מזהים חשד לדימום פנימי בשטח, כאשר אין מקור דימום חיצוני נראה?',
  multi:false,
  options:{'א':'לפי מנגנון הפגיעה בשילוב סימני הלם ללא מקור חיצוני נראה',
    'ב':'דימום פנימי תמיד מלווה בנפיחות בולטת מיידית','ג':'לא ניתן לזהות דימום פנימי בשטח בשום אופן','ד':'רק ע"י בדיקת דם מלאה'},
  correct:'א',
  explanation:{correct:'דימום פנימי קשה לזיהוי ישיר בשטח — החשד נבנה משילוב של מנגנון הפגיעה (למשל טראומה קהה בבטן) עם סימני הלם (דופק מהיר, עור קר וחיוור, ל"ד יורד) בהיעדר מקור דימום חיצוני נראה.',
    wrong:'נפיחות בולטת אינה מופיעה תמיד ומהר, כפי שנלמד לגבי דימום בבטן (עד 1.5 ליטר ללא נפיחות ניכרת); ניתן ואף חשוב לזהות חשד לדימום פנימי בשטח; ואין צורך/אפשרות לבדיקת דם מלאה בשטח — ההערכה קלינית.'} },
{ id: 'GC_0189', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מהי טכניקת "לחץ עקיף" לעצירת שטף דם, ומתי משתמשים בה?',
  multi:false,
  options:{'א':'חסימת עורק האספקה לגפה, פרוקסימלית (קרוב יותר לגוף) לפצע — שיטת גיבוי כשלחץ ישיר אינו מספיק',
    'ב':'לחיצה על הפצע עצמו בלבד','ג':'לחיצה דיסטלית (רחוק מהגוף) לפצע','ד':'שיטה שאינה בשימוש כלל'},
  correct:'א',
  explanation:{correct:'לחץ עקיף הוא חסימת עורק האספקה לגפה במיקום פרוקסימלי (קרוב יותר לגוף מהפצע), כאמצעי נוסף כאשר לחץ ישיר על הפצע אינו עוצר את הדימום. סדר הטיפול בשטף דם חיצוני: לחץ ישיר ← תחבושת אישית ← תחבושת המוסטטית ← חוסם עורקים אם עדיין לא נעצר.',
    wrong:'לחץ ישיר על הפצע הוא שיטה נפרדת (השיטה הראשונה בסדר הטיפול), לא "לחץ עקיף"; לחיצה דיסטלית לפצע אינה עוצרת דימום מהאספקה הראשית; ולחץ עקיף כן משמש בפרקטיקה כשיטת גיבוי מוכרת.'} },
{ id: 'GC_0190', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'האם הגנת "הפרקטיקה המקובלת" מספקת חיסיון מוחלט מתביעת רשלנות?',
  multi:false,
  options:{'א':'לא — זו הגנה חזקה אך אינה מוחלטת',
    'ב':'כן, היא מספקת חיסיון מלא תמיד','ג':'היא רלוונטית רק לרופאים, לא לחובשים','ד':'אין לה כל משקל משפטי'},
  correct:'א',
  explanation:{correct:'הגנת "הפרקטיקה המקובלת" (פעולה כפי שאיש מקצוע סביר היה פועל באותן נסיבות) היא הגנה משפטית חזקה, אך אינה מוחלטת — יתכנו נסיבות שבהן גם פעולה "מקובלת" עדיין תיחשב רשלנית אם היא לא הייתה סבירה בנסיבות הספציפיות.',
    wrong:'אין חיסיון מלא ואוטומטי; ההגנה רלוונטית לכל בעלי המקצוע הרפואי, לא רק רופאים; ויש לה משקל משפטי משמעותי, גם אם לא מוחלט.'} },
{ id: 'GC_0191', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'מה הכלל לגבי הודאה באחריות/רשלנות בזירת טיפול?',
  multi:false,
  options:{'א':'לעולם אין להודות באחריות/רשלנות, ואין לנהל ויכוחים בנוכחות משפחה/קהל',
    'ב':'רצוי להודות מיד כדי להרגיע את המשפחה','ג':'יש להודות רק אם ברור שטעינו','ד':'אין כל הנחיה בנושא'},
  correct:'א',
  explanation:{correct:'הכלל המפורש הוא: לעולם אין להודות באחריות/רשלנות בזירה, ואין לנהל ויכוחים בנוכחות משפחה/קהל — ההערכה המשפטית של האירוע נעשית בערוצים המתאימים, לא ספונטנית בזירה.',
    wrong:'הודאה ספונטנית עלולה להזיק משפטית גם אם כוונתה טובה; אין לעולם להודות בזירה גם אם נראה שהייתה טעות; וקיימת הנחיה ברורה ומפורשת בנושא.'} },
{ id: 'GC_0192', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'מהו העונש הפוטנציאלי על הפרת סודיות רפואית, לפי חוק ההגנה על הפרטיות?',
  multi:false,
  options:{'א':'עד שנת מאסר','ב':'קנס בלבד, ללא אפשרות מאסר','ג':'אין כל עונש קבוע בחוק','ד':'עד 10 שנות מאסר'},
  correct:'א',
  explanation:{correct:'חוק ההגנה על הפרטיות קובע עונש של עד שנת מאסר על הפרת סודיות רפואית — הפרה חמורה שיש להימנע ממנה בהחלט, כולל שיתוף מידע מזהה עם גורמים לא-מוסמכים.',
    wrong:'העונש אינו מוגבל לקנס בלבד — קיימת אפשרות מאסר; קיים עונש מוגדר בחוק, לא ואקום משפטי; והעונש המקסימלי אינו 10 שנים אלא עד שנה.'} },
{ id: 'GC_0193', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'באיזו תדירות מומלץ לתעד מדדים חיוניים במהלך טיפול/פינוי?',
  multi:false,
  options:{'א':'כל כ-15 דקות','ב':'פעם אחת בלבד, בתחילת הטיפול','ג':'רק בסוף הטיפול, לפני מסירה לבי"ח','ד':'כל שעה'},
  correct:'א',
  explanation:{correct:'מומלץ לתעד מדדים חיוניים כל כ-15 דקות במהלך הטיפול/הפינוי, בנוסף לתיעוד פרטים אישיים, תלונה עיקרית, אנמנזה, מקור מידע, רגישויות, וזמנים (יציאה/הגעה/התחלת פינוי/הגעה לבי"ח).',
    wrong:'תיעוד חד-פעמי בתחילת הטיפול אינו מספק — מצב המטופל עלול להשתנות; המתנה לסוף הטיפול בלבד מפספסת מגמות ביניים חשובות; ותדירות של שעה שלמה רחוקה מדי לתיעוד מהימן.'} },
{ id: 'GC_0194', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'באר"ן (אירוע רב-נפגעים) גדול, מי מוסמך למסור מידע לתקשורת?',
  multi:false,
  options:{'א':'רק מנכ"ל/דובר מד"א','ב':'כל חבר צוות שנמצא בזירה','ג':'ראש הצוות של האמבולנס הראשון שהגיע','ד':'כל מי שהעיתונאי פונה אליו ראשון'},
  correct:'א',
  explanation:{correct:'באירוע רב-נפגעים/מגה אר"ן, רק מנכ"ל מד"א או דובר מד"א מוסמכים למסור מידע לתקשורת — כלל זה מיועד להבטיח מסירת מידע מדויקת, מתואמת ומוסמכת, ולהימנע מהדלפות או אי-דיוקים.',
    wrong:'חברי צוות בזירה, ראש צוות ראשון, או כל מי שהעיתונאי פונה אליו — אף אחד מהם אינו מוסמך למסור מידע לתקשורת ללא אישור/תדרוך מדובר מד"א, ללא קשר לנוכחותו או תפקידו בזירה.'} },
{ id: 'GC_0195', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'אילו קשיים אופייניים עלולים להתעורר בלקיחת אנמנזה מקשישים?',
  multi:false,
  options:{'א':'קוגניציה ירודה (דמנציה), בעיות שמיעה/דיבור, מספר רב של תרופות ומחלות רקע שמבלבל את התמונה',
    'ב':'אין קשיים מיוחדים בהשוואה למבוגר צעיר','ג':'קשיש תמיד מבולבל ולא ניתן לקבל ממנו כל מידע','ד':'הבעיה היחידה היא שפה זרה'},
  correct:'א',
  explanation:{correct:'קשישים הם אוכלוסייה קשה יחסית לאנמנזה — עשויים לסבול מדמנציה/קוגניציה ירודה, בעיות שמיעה/דיבור, ומספר רב של תרופות/מחלות רקע שמקשה להבחין בין תסמין חדש לתסמין כרוני מוכר.',
    wrong:'קיימים קשיים ייחודיים לעומת מבוגר צעיר, שלא ניתן להתעלם מהם; לא כל קשיש מבולבל — יש להימנע מהכללה גורפת; ושפה זרה היא רק גורם אפשרי אחד מני רבים, לא היחיד.'} },
{ id: 'GC_0196', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מהם האתגרים העיקריים בלקיחת אנמנזה מילדים?',
  multi:false,
  options:{'א':'קוגניציה מתפתחת, יכולת שפה מוגבלת, תלות במידע ממבוגר מלווה שאינו תמיד עד ראייה',
    'ב':'אין הבדל בין אנמנזת ילד למבוגר','ג':'ילדים תמיד משקרים בכוונה','ד':'הבעיה היחידה היא פחד מהמדים'},
  correct:'א',
  explanation:{correct:'אנמנזה מילדים מאתגרת בשל קוגניציה מתפתחת, יכולת שפה מוגבלת בהתאם לגיל, ותלות במידע שמסופק ע"י מבוגר מלווה שלעיתים אינו עד ראייה ישיר לאירוע.',
    wrong:'קיים הבדל משמעותי בין אנמנזת ילד למבוגר, ואין להתעלם ממנו; אין להניח ששקר מכוון הוא הגורם — לרוב מדובר במגבלות התפתחותיות תמימות; ופחד מהמדים הוא גורם אפשרי אחד בלבד, לא כלל האתגר.'} },
{ id: 'GC_0197', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה ההבדל בקצב ההתפתחות בין היפוגליקמיה להיפרגליקמיה?',
  multi:false,
  options:{'א':'היפוגליקמיה מתפתחת במהירות; היפרגליקמיה מתפתחת באיטיות',
    'ב':'שתיהן מתפתחות באותה מהירות בדיוק','ג':'היפרגליקמיה מתפתחת תמיד מהר יותר מהיפוגליקמיה','ד':'קצב ההתפתחות אינו רלוונטי קלינית'},
  correct:'א',
  explanation:{correct:'היפוגליקמיה מתפתחת במהירות יחסית (הגלוקוז חיוני מיידית לאנרגיה תאית, במיוחד למוח), ואילו היפרגליקמיה מתפתחת באיטיות יחסית — הבדל שמשפיע על מהירות הופעת התסמינים ועל דחיפות הטיפול.',
    wrong:'קצב ההתפתחות שונה משמעותית בין השתיים, לא זהה; ההפך הוא הנכון — היפוגליקמיה היא המהירה יותר; וקצב ההתפתחות בהחלט רלוונטי קלינית, כי הוא משפיע על התדמיינות ועל אופן ההופעה בשטח.'} },

// ================= טראומה (30) =================
{ id: 'GC_0198', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהם דפוסי הפגיעה האופייניים בהתנגשות חזיתית ברכב?',
  multi:false,
  options:{'א':'שני מסלולי פגיעה אפשריים (עילי/תחתי) עם פגיעות אופייניות בחזה/ברכיים',
    'ב':'תמיד פגיעה בעצם הבריח בלבד','ג':'אין דפוס אופייני כלל','ד':'תמיד פגיעה בעמוד השדרה הצווארי בלבד'},
  correct:'א',
  explanation:{correct:'בהתנגשות חזיתית קיימים שני מסלולי פגיעה אפשריים — עילי (הגוף העליון פוגע בהגה/דשבורד) ותחתי (הברכיים פוגעות בדשבורד) — עם דפוסי פגיעה אופייניים בחזה ובברכיים בהתאם. חגורת בטיחות וכריות אוויר משנות את דפוס הפגיעה.',
    wrong:'פגיעה בעצם הבריח אופיינית יותר להתנגשות צידית; קיים דפוס פגיעה מוכר וצפוי בהתנגשות חזיתית, לא אקראי; ופגיעת עמוד שדרה צווארי אופיינית יותר להתנגשות אחורית.'} },
{ id: 'GC_0199', source:'generated', qtype:['concept'], section:'טראומה', multi:true,
  question:'אילו מהצירופים הבאים בין סוג התנגשות לדפוס פגיעה אופייני נכונים?',
  options:{'א':'התנגשות אחורית — פגיעה בצוואר/משענת','ב':'התנגשות צידית — פגיעה בעצם הבריח','ג':'התהפכות — פגיעה רב-מערכתית מגוונת',
    'ד':'התנגשות חזיתית — פגיעה בעצם הבריח בלבד תמיד'},
  correct:['א','ב','ג'],
  explanation:{correct:'התנגשות אחורית — פגיעות צוואר/משענת (Whiplash). התנגשות צידית — פגיעה בעצם הבריח וצד הגוף הפגוע. התהפכות — פגיעה רב-מערכתית ומגוונת, כי הגוף חשוף לכיווני כוח מרובים.',
    wrong:'התנגשות חזיתית אינה מוגבלת לעצם הבריח בלבד — דפוסי הפגיעה שלה שונים לחלוטין (חזה/ברכיים, מסלול עילי/תחתי) מהתנגשות צידית.'} },
{ id: 'GC_0200', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהן פגיעות אופייניות בתאונת אופנוע?',
  multi:false,
  options:{'א':'שברים/חבלות ברגליים ופגיעה בעמוד השדרה','ב':'רק פגיעות ראש, ללא פגיעות אחרות','ג':'רק כוויות','ד':'אין דפוס פגיעה מיוחד באופנוענים'},
  correct:'א',
  explanation:{correct:'תאונות אופנוע מאופיינות בשברים וחבלות ברגליים (מגע ישיר עם הרכב הפוגע/הכביש), ופגיעה בעמוד השדרה — בשל היעדר "מעטפת" הגנה שיש לרכב.',
    wrong:'פגיעות ראש שכיחות אך אינן הפגיעה הבלעדית; כוויות אינן דפוס הפגיעה האופייני; וקיים דווקא דפוס פגיעה מובחן וידוע לאופנוענים.'} },
{ id: 'GC_0201', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהם שלושת השלבים בפגיעת הולך רגל ברכב, ובמה שונה הדפוס בילדים?',
  multi:false,
  options:{'א':'פגיעה בפגוש ← מכסה מנוע ← נפילה על כביש; בילדים — פגיעה גבוהה יותר בגוף (בשל גובה נמוך יותר)',
    'ב':'נפילה על כביש ← פגיעה בפגוש ← מכסה מנוע','ג':'אין הבדל בין ילדים למבוגרים בדפוס הפגיעה','ד':'שלב אחד בלבד — פגיעה בפגוש'},
  correct:'א',
  explanation:{correct:'שלושת שלבי פגיעת הולך רגל: פגיעה בפגוש ← מכסה מנוע ← נפילה על הכביש. בילדים, בשל גובה נמוך יותר, הפגיעה הראשונית מתרחשת גבוה יותר בגוף (למשל בטן/חזה במקום רגליים כמו במבוגר) — מה שמשנה את דפוס הפגיעות הפנימיות הצפויות.',
    wrong:'הסדר ההפוך אינו נכון; קיים הבדל משמעותי בגובה הפגיעה הראשונית בין ילדים למבוגרים; ומדובר בשלושה שלבים נפרדים, לא שלב יחיד.'} },
{ id: 'GC_0202', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מה שלבי הפגיעה בפגיעת הדף (פיצוץ) לפי הסדר?',
  multi:false,
  options:{'א':'גלי הדף ← חפצים עפים ← הטחת הגוף ← פגיעות עקיפות, כגון עשן וחום ← פגיעות נלוות מחומרים שנוספו למטען',
    'ב':'גלי הדף ← הטחת הגוף ← פגיעות עקיפות, כגון עשן וחום ← חפצים עפים ופגיעות מחומרים שנוספו למטען',
    'ג':'רק גלי ההדף — כל השאר מסווג לפי סוג הפגיעה',
    'ד':'גלי הדף ← כוויות ← הטחת הגוף ← חפצים עפים ופגיעות מחומרים שנוספו למטען'},
  correct:'א',
  explanation:{correct:'פגיעות הדף מתחלקות לשלבים לפי הסדר: ראשוני — גלי הדף (נזק ישיר מגלי הלחץ, בעיקר לאיברים חלולים כמו ריאות ומעיים), שניוני — חפצים עפים (פגיעה מרסיסים ושברים מעופפים), שלישוני — הטחת הגוף (פגיעה מהטלת גוף המטופל עצמו על ידי כוח הפיצוץ), רביעוני — פגיעות עקיפות כגון עשן וחום (כוויות, שאיפת עשן), וחמישוני — פגיעות נלוות מחומרים שנוספו למטען.',
    wrong:'הסדר בתשובה ב אינו נכון — חפצים עפים ופגיעות מחומרים נלווים אינם שלב אחד ואינם מגיעים לאחר הפגיעות העקיפות; מדובר בכמה שלבים נפרדים, לא בשלב יחיד; וכוויות אינן השלב השני בסדר — הן חלק מהפגיעות העקיפות המאוחרות יותר.'} },
{ id: 'GC_0203', source:'generated', qtype:['concept'], section:'טראומה', multi:true,
  question:'אילו מהבאים הם סוגי שברי גולגולת שנלמדו?',
  options:{'א':'שבר קווי','ב':'שבר דחוס','ג':'שבר בסיס גולגולת','ד':'שבר מעגלי'},
  correct:['א','ב','ג'],
  explanation:{correct:'סוגי שברי גולגולת: קווי (כ-80% מהמקרים, לרוב ללא נזק מוחי ישיר), דחוס (עלול לפגוע ברקמת המוח כשקטע העצם נדחס פנימה), ובסיס גולגולת (מסכן חיים, עם סימנים ייחודיים כמו דליפת CSF, משקפי דמים, Battle\'s Sign).',
    wrong:'שבר מעגלי אינו מונח או קטגוריה מוכרת בסיווג שברי הגולגולת שנלמד.'} },
{ id: 'GC_0204', source:'generated', qtype:['concept'], section:'טראומה',
  question:'אילו סימנים מחשידים לשבר בסיס גולגולת?',
  multi:false,
  options:{'א':'דליפת CSF מאף/אוזניים, "משקפי דמים" (Raccoon Eyes), Battle\'s Sign מאחורי האוזן',
    'ב':'רק כאב ראש קל','ג':'רק חום גבוה','ד':'רק בחילות ללא סימנים נוספים'},
  correct:'א',
  explanation:{correct:'סימני שבר בסיס גולגולת: דליפת נוזל שדרה-מוח (CSF) מהאף או מהאוזניים, "משקפי דמים" (Raccoon Eyes — כתמי חבלה מסביב לעיניים), ו-Battle\'s Sign (חבלה מאחורי האוזן). זהו שבר מסכן חיים, ומחייב זהירות מיוחדת (למשל הימנעות מהחדרת קטטר דרך האף).',
    wrong:'כאב ראש קל, חום גבוה, ובחילות בלבד אינם הסימנים הספציפיים המחשידים לשבר בסיס גולגולת — הסימנים הייעודיים הם אלו שבתשובה הנכונה.'} },
{ id: 'GC_0205', source:'generated', qtype:['concept'], section:'טראומה',
  question:'כיצד עלייה בלחץ תוך-גולגולתי (ICP) משפיעה על פרפוזיה מוחית?',
  multi:false,
  options:{'א':'עלייה ב-ICP גורמת לירידה בפרפוזיה המוחית','ב':'עלייה ב-ICP משפרת את הפרפוזיה המוחית','ג':'אין קשר בין ICP לפרפוזיה מוחית','ד':'ICP משפיע רק על פרפוזיה של הריאות'},
  correct:'א',
  explanation:{correct:'עלייה בלחץ התוך-גולגולתי (ICP) גורמת לירידה בפרפוזיה המוחית — הלחץ המוגבר בתוך הגולגולת הסגורה "לוחץ" על כלי הדם ומקשה על זרימת הדם למוח, מה שעלול להוביל לנזק מוחי משני.',
    wrong:'ההפך הוא הנכון — עלייה ב-ICP פוגעת בפרפוזיה, לא משפרת אותה; קיים קשר ישיר ומובהק בין השניים; ו-ICP מתייחס ללחץ בתוך הגולגולת, לא לריאות.'} },
{ id: 'GC_0206', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהי טריאדת קושינג, וממה היא מהווה סימן?',
  multi:false,
  options:{'א':'עלייה בל"ד + ברדיקרדיה + שינוי בדפוס נשימה — סימן לעלייה בלחץ תוך-גולגולתי (ICP)',
    'ב':'ירידה בל"ד + טכיקרדיה + נשימה מהירה — סימן להלם תת-נפחי','ג':'חום גבוה + הזעה + בלבול — סימן לזיהום','ד':'אישונים מכווצים + דיכוי נשימתי — סימן להרעלת אופיאטים'},
  correct:'א',
  explanation:{correct:'טריאדת קושינג — עלייה בלחץ הדם, ברדיקרדיה, ושינוי בדפוס הנשימה — היא סימן מאוחר וחמור לעלייה בלחץ התוך-גולגולתי (ICP), ומחייבת התייחסות דחופה לחשד פגיעת ראש קשה.',
    wrong:'הלם תת-נפחי מציג דווקא ל"ד יורד וטכיקרדיה — התמונה ההפוכה; חום והזעה מכוונים לזיהום, לא לפגיעת ראש; ואישונים מכווצים+דיכוי נשימתי הם סימן אופיאטים, לא ICP.'} },
{ id: 'GC_0207', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהן ההתוויות לקיבוע מלא של עמוד השדרה (צווארון+לוח+ראש)?',
  multi:false,
  options:{'א':'חבלה קהה + שינוי הכרה או רגישות/הגבלה בצוואר/גוף או חסר נוירולוגי פריפרי או חוסר יכולת הערכה',
    'ב':'רק אם המטופל מתלונן במפורש על כאב צוואר','ג':'לעולם אין לקבע עמוד שדרה בשטח','ד':'רק בילדים מתחת לגיל 5'},
  correct:'א',
  explanation:{correct:'התוויות לקיבוע מלא: חבלה קהה בשילוב אחד מהבאים: שינוי הכרה, רגישות או הגבלת תנועה בצוואר/גוף, חסר נוירולוגי פריפרי, חוסר יכולת לבצע הערכה מהימנה (למשל בשל מסיח כאב אחר או בעיות שפה/תקשורת).',
    wrong:'תלונת כאב צוואר מפורשת אינה התנאי היחיד — קיבוע נדרש גם בהיעדר תלונה מפורשת אם יש קריטריונים אחרים; קיבוע כן מבוצע בשטח כפעולה שגרתית כשמתקיימים הקריטריונים; ואינו מוגבל לילדים בלבד — חל על כל הגילאים.'} },
{ id: 'GC_0208', source:'generated', qtype:['concept'], section:'טראומה',
  question:'באיזו אוכלוסייה חזה אוויר פשוט (Pneumothorax) עלול להתרחש באופן ספונטני, ללא טראומה?',
  multi:false,
  options:{'א':'גברים גבוהים ורזים','ב':'נשים מבוגרות שמנות','ג':'תינוקות בלבד','ד':'אינו יכול להתרחש ללא טראומה כלל'},
  correct:'א',
  explanation:{correct:'חזה אוויר פשוט (Simple Pneumothorax) יתכן ספונטני (ללא טראומה), במיוחד בגברים גבוהים ורזים — קבוצת סיכון מוכרת בשל מבנה ריאה מסוים (בועיות אוויר תת-פלאורליות).',
    wrong:'נשים מבוגרות שמנות ותינוקות אינם קבוצת הסיכון האופיינית לחזה אוויר ספונטני; והוא בהחלט יכול להתרחש ללא טראומה כלל.'} },
{ id: 'GC_0209', source:'generated', qtype:['concept'], section:'טראומה',
  question:'כמה דם עלול להצטבר בחלל הפלאורלי בחזה דם (Hemothorax)?',
  multi:false,
  options:{'א':'עד 2500-3000cc','ב':'עד 100cc בלבד','ג':'לא ניתן לצבור דם משמעותי בחלל הפלאורלי','ד':'תמיד בדיוק 500cc'},
  correct:'א',
  explanation:{correct:'חזה דם (Hemothorax) עלול להכיל עד 2500-3000cc דם בחלל הפלאורלי — נפח משמעותי ביותר ביחס לנפח הדם הכולל בגוף (כ-5-6 ליטר במבוגר), ולכן מהווה מקור עיקרי להיפוולמיה בטראומת חזה.',
    wrong:'100cc נמוך משמעותית מהנפח האמיתי האפשרי; החלל הפלאורלי כן יכול להכיל נפח דם משמעותי מאוד; ואין ערך קבוע כמו "תמיד 500cc" — הנפח משתנה לפי חומרת הפגיעה.'} },
{ id: 'GC_0210', source:'generated', qtype:['concept'], section:'טראומה', multi:true,
  question:'אילו מהצירופים הבאים בין רבע בטן לאיברים העיקריים בו נכונים?',
  options:{'א':'RUQ (ימין עליון) — כבד/כיס מרה','ב':'LUQ (שמאל עליון) — טחול/קיבה','ג':'RLQ (ימין תחתון) — תוספתן/מעי דק','ד':'LLQ (שמאל תחתון) — כבד וטחול יחד'},
  correct:['א','ב','ג'],
  explanation:{correct:'חלוקת הבטן לרבעים: RUQ (ימין עליון) — כבד/כיס מרה. LUQ (שמאל עליון) — טחול/קיבה. RLQ (ימין תחתון) — תוספתן/מעי דק. LLQ (שמאל תחתון) — מעי דק.',
    wrong:'LLQ (שמאל תחתון) אינו מכיל כבד וטחול יחד — הכבד ברבע הימני העליון והטחול ברבע השמאלי העליון, לא ברבע התחתון השמאלי.'} },
{ id: 'GC_0211', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהי הסכנה העיקרית בתסמונת מעיכה (Crush Syndrome)?',
  multi:false,
  options:{'א':'שחרור לחץ פתאומי מהאזור המעוך עלול לשחרר לזרם הדם חומרים רעילים שהצטברו ברקמה, ולגרום להידרדרות חדה',
    'ב':'אין כל סיכון בשחרור הלחץ, זה תמיד משפר את המצב מיידית','ג':'הסיכון היחיד הוא כאב מקומי בלבד','ד':'מתרחשת רק בפגיעות ראש'},
  correct:'א',
  explanation:{correct:'בתסמונת מעיכה, שחרור פתאומי של לחץ ממושך מעל רקמת שריר (למשל חילוץ מתחת להריסות) עלול לשחרר לזרם הדם חומרים רעילים (כמו אשלגן ומיוגלובין) שהצטברו ברקמה הפגועה, ולגרום להפרעות קצב לב, אי ספיקת כליות, ואף הלם — לכן זו סכנה שיש להיערך אליה לפני השחרור.',
    wrong:'שחרור הלחץ אינו בטוח באופן אוטומטי — עלול דווקא להחמיר את המצב הכללי; הסיכון חורג הרבה מעבר לכאב מקומי; ותסמונת מעיכה קשורה לפגיעות מעיכה של רקמת שריר, לא לפגיעות ראש.'} },
{ id: 'GC_0212', source:'generated', qtype:['concept'], section:'טראומה', multi:true,
  question:'אילו מהבאים הם סיבוכים אפשריים של שבר?',
  options:{'א':'דימום','ב':'נזק עצבי','ג':'תסחיף שומן','ד':'שיפור מיידי בזרימת דם באזור'},
  correct:['א','ב','ג'],
  explanation:{correct:'סיבוכי שבר אפשריים: דימום, נזק עצבי, נכות, תסחיף שומן (שחרור תאי שומן ממח העצם לזרם הדם), וזיהום.',
    wrong:'שבר אינו גורם ל"שיפור מיידי" בזרימת הדם — להפך, הוא עלול לפגוע בכלי הדם הסמוכים ולפגוע בזרימה, ולכן בודקים דופק פריפרי לפני ואחרי קיבוע.'} },
{ id: 'GC_0213', source:'generated', qtype:['concept'], section:'טראומה',
  question:'האם מותר לחובש לנסות להחזיר נקע/פריקה למקומם בשטח?',
  multi:false,
  options:{'א':'לא, אין לנסות להחזיר למקום — יש לקבע במצב שנמצא','ב':'כן, זה חלק שגרתי מהטיפול','ג':'רק אם המטופל מבקש זאת','ד':'רק בפריקות קטנות באצבעות'},
  correct:'א',
  explanation:{correct:'אין לנסות להחזיר נקע (קרע חלקי רצועה) או פריקה (הפרדות מפרק) למקומם בשטח — הפעולה עלולה לגרום נזק נוסף לכלי דם/עצבים/רקמות סמוכות. הטיפול הנכון הוא קיבוע במצב שבו נמצאה הגפה.',
    wrong:'זו אינה פעולה שגרתית/מותרת בסמכות חובש; בקשת המטופל אינה משנה את הסיכון הפיזיולוגי בניסיון החזרה; והאיסור חל על כל סוגי הנקע/פריקה, לא רק פריקות גדולות.'} },
{ id: 'GC_0214', source:'generated', qtype:['concept'], section:'טראומה',
  question:'אילו שיקולים משפיעים על החלטת פינוי (T&T) בטראומה?',
  multi:false,
  options:{'א':'מצב מסכן חיים, התדרדרות, מנגנון פגיעה, מרחק פינוי, ורצון המטופל',
    'ב':'רק מרחק הפינוי לבי"ח','ג':'רק גיל המטופל','ד':'רק סוג הרכב הפוגע'},
  correct:'א',
  explanation:{correct:'שיקולי החלטת פינוי כוללים: האם מדובר במצב מסכן חיים, האם קיימת התדרדרות, חומרת מנגנון הפגיעה, מרחק הפינוי מבית החולים, ורצון המטופל (בכפוף לכשירותו).',
    wrong:'מרחק פינוי הוא שיקול אחד מני רבים, לא הבלעדי; גיל המטופל משפיע אך אינו השיקול היחיד; וסוג הרכב הפוגע (בעצמו) אינו קריטריון ישיר — מה שרלוונטי הוא מנגנון הפגיעה בכללותו.'} },
{ id: 'GC_0215', source:'generated', qtype:['concept'], section:'טראומה', multi:true,
  question:'אילו מהמצבים הבאים מחייבים שקילת פינוי לבי"ח ייעודי, לפי סוג המצב?',
  options:{'א':'שבץ חד — בי"ח עם יכולת טרומבוליזה/צנתור','ב':'תקיפה מינית — מרכז ייעודי','ג':'כוויות — מרכז כוויות ייעודי','ד':'כאב גב כרוני קל — מחייב תמיד מרכז ייעודי'},
  correct:['א','ב','ג'],
  explanation:{correct:'בתי חולים ייעודיים נבחרים לפי סוג המצב: שבץ חד (יכולת טרומבוליזה/צנתור), MI, גניקולוגיה/מיילדות, פגיעת ראש/קינמטיקה קשה, פדיאטריה, תקיפה מינית, כוויות, קטיעות, ותאונות צלילה.',
    wrong:'כאב גב כרוני קל אינו מצב חירום המחייב מרכז ייעודי — אינו נכלל ברשימת המצבים הדחופים המחייבים בי"ח ייעודי מיוחד.'} },
{ id: 'GC_0216', source:'generated', qtype:['concept'], section:'טראומה',
  question:'אילו מהבאים נחשבים מרכזי טראומה-על בישראל, לפי החומר שנלמד?',
  multi:false,
  options:{'א':'שיבא, בלינסון, איכילוב, רמב"ם, סורוקה, הדסה עין כרם','ב':'רק בי"ח אחד בכל הארץ','ג':'כל בי"ח קהילתי נחשב מרכז טראומה-על','ד':'רק בתי חולים בירושלים'},
  correct:'א',
  explanation:{correct:'מרכזי טראומה-על שצוינו בחומר: שיבא, בלינסון, איכילוב, רמב"ם, סורוקה, והדסה עין כרם — מפוזרים גיאוגרפית ברחבי הארץ לצורך נגישות לטיפול ברמה הגבוהה ביותר.',
    wrong:'קיימים מספר מרכזי טראומה-על, לא רק אחד; לא כל בי"ח קהילתי מוגדר כמרכז טראומה-על — מדובר במעמד ייעודי; והמרכזים פזורים בכל הארץ, לא רק בירושלים.'} },
{ id: 'GC_0217', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מה כולל דיווח לבי"ח (Handover) לפני/בעת הגעה עם מטופל טראומה?',
  multi:false,
  options:{'א':'גיל, אבחנה משוערת, מנגנון חבלה, מצב הכרה, יציבות המודינמית, ומשאבים מיוחדים נדרשים',
    'ב':'רק שם המטופל','ג':'רק זמן ההגעה הצפוי','ד':'רק מספר הצוות שיצא לזירה'},
  correct:'א',
  explanation:{correct:'דיווח מקיף לבי"ח כולל: גיל המטופל, אבחנה משוערת, מנגנון החבלה, מצב הכרה, יציבות המודינמית, ומשאבים מיוחדים שיידרשו (למשל צוות טראומה, חדר ניתוח, בנק דם) — כדי לאפשר לצוות בבי"ח להיערך מראש.',
    wrong:'דיווח מלא כולל הרבה מעבר לשם בלבד; זמן הגעה הוא רק פרט אחד מתוך דיווח מקיף; ומספר אנשי הצוות אינו מהמידע הקליני הרלוונטי לדיווח.'} },
{ id: 'GC_0218', source:'generated', qtype:['scenario'], section:'טראומה',
  question:'נפגע התהפכות רכב מציג מספר פגיעות: שבר ברגל, כאב בטן, וחשד לפגיעת ראש. מה גישת הטיפול העקרונית?',
  multi:false,
  options:{'א':'לטפל רק בפציעה הנראית ביותר (השבר) ולהתעלם מהשאר',
    'ב':'לעבוד לפי קדימויות ("מה שהורג קודם — מטופל קודם"), עם סקר ראשוני S-A-B-C-D-E מלא לפני התמקדות בפציעות בודדות',
    'ג':'לפנות ישירות ללא כל בדיקה, כי יש כמה פציעות',
    'ד':'לטפל אך ורק בפגיעת הראש ולהתעלם מהשאר'},
  correct:'ב',
  explanation:{correct:'התהפכות רכב מייצרת פגיעות רב-מערכתיות, ולכן העיקרון המנחה הוא סקר ראשוני מלא (S-A-B-C-D-E) לזיהוי וטיפול לפי סדר קדימויות — "מה שהורג קודם, מטופל קודם" — ולא מיקוד מוקדם מדי בפציעה בודדת (בין אם נראית לעין או לא) על חשבון האחרות.',
    wrong:'התמקדות בפציעה בודדת בלבד (השבר או הראש) מתעלמת מהעיקרון של סקר שיטתי; ופינוי ללא כל בדיקה מונע זיהוי וטיפול במצבים מסכני חיים שניתן לטפל בהם עוד בשטח.'} },
{ id: 'GC_0219', source:'generated', qtype:['scenario'], section:'טראומה',
  question:'נפגע דקירה בחזה מציג פצע פתוח עם קול "יניקה" בעת נשימה. לאחר הנחת תחבושת אשרמן, מצבו הנשימתי מחמיר. מה תעשה?',
  multi:false,
  options:{'א':'להשאיר את התחבושת כפי שהיא, ללא כל שינוי',
    'ב':'להסיר את התחבושת — אם המצב מחמיר לאחר הנחתה, יש חשד שהיא הפכה לחזה אוויר בלחץ, ויש להסירה',
    'ג':'להוסיף עוד שכבת תחבושת נוספת מעל הקיימת','ד':'למשוך את הסכין החוצה מהפצע לבדיקה'},
  correct:'ב',
  explanation:{correct:'תחבושת אשרמן (מסתם חד-כיווני) מטופלת בפצע חזה פתוח. אם מצבו הנשימתי של המטופל מחמיר לאחר הנחתה — קיים חשד שהאוויר שנכנס אינו מצליח לצאת, מה שיוצר בפועל חזה אוויר בלחץ — ולכן יש להסיר את התחבושת מיד כדי לשחרר את הלחץ שהצטבר.',
    wrong:'השארת התחבושת ללא שינוי מסכנת חיים אם היא גורמת להחמרה; הוספת שכבה נוספת רק תחמיר את בעיית הלחץ; ואין להוציא חפצים תקועים (במקרה זה — כביכול הסכין) מהפצע בשום מצב.'} },
{ id: 'GC_0220', source:'generated', qtype:['scenario'], section:'טראומה',
  question:'נפגע פגיעת ראש קשה מציג ל"ד עולה, דופק יורד (ברדיקרדיה), ודפוס נשימה משתנה. מה תחשד ומה תעשה?',
  multi:false,
  options:{'א':'טריאדת קושינג — סימן לעלייה בלחץ תוך-גולגולתי (ICP); לשמור על ABC (Jaw Thrust+עמש"צ), חמצן/סיוע נשימתי, ופינוי דחוף למרכז נוירוכירורגי',
    'ב':'הלם תת-נפחי; לתת נוזלים מהר ככל האפשר לפני הפינוי','ג':'זהו סימן להתאוששות, אין צורך בדחיפות מיוחדת',
    'ד':'הרעלת אופיאטים; לחפש סימני זריקות'},
  correct:'א',
  explanation:{correct:'עלייה בל"ד, ירידה בדופק (ברדיקרדיה), ושינוי בדפוס הנשימה הם טריאדת קושינג — סימן מאוחר וחמור לעלייה בלחץ תוך-גולגולתי, המחייב שמירה על ABC (עם Jaw Thrust ועמש"צ), חמצן/סיוע נשימתי, וניטור הכרה, ופינוי דחוף למרכז נוירוכירורגי.',
    wrong:'הלם תת-נפחי מציג ל"ד יורד ודופק עולה — התמונה ההפוכה, ומתן נוזלים אגרסיבי כאן אינו מומלץ; זה בהחלט אינו סימן חיובי — הוא מסמן החמרה; ואין קשר בין התמונה לאישוני סיכה של הרעלת אופיאטים.'} },
{ id: 'GC_0221', source:'generated', qtype:['scenario'], section:'טראומה',
  question:'יולדת בשבוע 30 להריון נפגעה בתאונת דרכים ומחייבת קיבוע ללוח שדרה. כיצד תבצע את הקיבוע?',
  multi:false,
  options:{'א':'קיבוע רגיל על הגב, ללא כל שינוי','ב':'קיבוע ללוח, עם הטיית הלוח/רחם שמאלה למניעת לחץ הרחם על הווריד הנבוב התחתון',
    'ג':'קיבוע על הצד הימני בלבד','ד':'להימנע מקיבוע לחלוטין בהריון'},
  correct:'ב',
  explanation:{correct:'ביולדת מקובעת ללוח שדרה, יש להטות את הלוח (או להניח כרית מתחת לצד ימין של הגוף) כדי להטות את הרחם שמאלה — מניעת לחץ על הווריד הנבוב התחתון ושמירה על החזר ורידי ותפוקת לב תקינים.',
    wrong:'קיבוע רגיל על הגב ללא הטיה עלול לפגוע בזרימת הדם לעובר; הטיה לצד ימין היא הכיוון ההפוך מהנדרש; והימנעות מקיבוע כלל מתעלמת מהצורך הטראומטי לקבע עמוד שדרה כשמתקיימת התוויה.'} },
{ id: 'GC_0222', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מטופל עם חפץ חד תקוע בגוף (למשל סכין). מה עקרון הטיפול?',
  multi:false,
  options:{'א':'קיבוע החפץ במקומו, אין להוציאו בשום מצב','ב':'הוצאת החפץ מיד כדי לאפשר גישה לפצע','ג':'הוצאת החפץ רק אם הוא קטן','ד':'אין להתייחס לחפץ כלל'},
  correct:'א',
  explanation:{correct:'עקרון הטיפול בחפץ חד תקוע בגוף הוא קיבוע החפץ במקומו — לא להוציאו בשום מצב, בין אם בחזה, בבטן, או בכל אזור אחר. הוצאת החפץ עלולה לגרום לדימום מסיבי נוסף אם החפץ עצמו "אוטם" כלי דם פגוע.',
    wrong:'הוצאת החפץ בכל צורה, גם אם "קטן", עלולה לגרום נזק חמור; ואי-התייחסות כלל לחפץ מתעלמת מהצורך בקיבועו למניעת תזוזה נוספת שתחמיר את הפגיעה.'} },
{ id: 'GC_0223', source:'generated', qtype:['concept'], section:'טראומה',
  question:'בנפילה מגובה, מהו סדר בדיקת הפגיעה המקובל, ומדוע?',
  multi:false,
  options:{'א':'רגליים ← אגן ← עמוד שדרה ← ראש — בהתאם לנקודת המגע הראשונית וההעברה ההדרגתית של האנרגיה',
    'ב':'תמיד רק פגיעת ראש, ללא קשר לגובה הנפילה','ג':'סדר הבדיקה אינו רלוונטי בנפילה','ד':'ראש ← אגן ← רגליים ← עמוד שדרה'},
  correct:'א',
  explanation:{correct:'בנפילה מגובה (כשהנחיתה היא על הרגליים), האנרגיה עוברת בסדר רגליים ← אגן ← עמוד שדרה ← ראש, ולכן זהו סדר בדיקת הפגיעה המקובל — מחפשים שברי כפות רגליים/קרסוליים, שברי אגן, פגיעות דחיסה בעמוד השדרה, ובסופו של דבר גם פגיעת ראש.',
    wrong:'פגיעת ראש אינה הפגיעה היחידה הצפויה בכל נפילה; יש סדר לוגי ומועיל לבדיקה שמבוסס על מנגנון העברת האנרגיה בגוף; והסדר ההפוך (ראש תחילה) אינו תואם את כיוון העברת האנרגיה בנפילה על הרגליים.'} },

// ================= החייאה (20) =================
{ id: 'GC_0224', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מה ההבדל בין מוות קליני למוות מוחי?',
  multi:false,
  options:{'א':'מוות קליני — אין דופק/נשימה, הפיך בטווח 4-6 דקות; מוות מוחי — נזק בלתי הפיך לרקמת המוח',
    'ב':'אין הבדל, שני מונחים לאותו מצב','ג':'מוות מוחי הפיך; מוות קליני בלתי הפיך','ד':'מוות קליני מתייחס רק לתינוקות'},
  correct:'א',
  explanation:{correct:'מוות קליני מוגדר כהיעדר דופק ונשימה — מצב הפיך בטווח של כ-4-6 דקות באמצעות החייאה. מוות מוחי מוגדר כנזק בלתי הפיך לרקמת המוח — מצב סופי שאינו הפיך.',
    wrong:'קיים הבדל מהותי בין המונחים; ההגדרה ההפוכה שגויה — מוות מוחי הוא הבלתי-הפיך; ומוות קליני אינו מוגבל לתינוקות — רלוונטי לכל גיל.'} },
{ id: 'GC_0225', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מה ההבדל בסדר שרשרת ההישרדות בין מבוגר לילדים?',
  multi:false,
  options:{'א':'במבוגר: קריאה לעזרה ← החייאה בסיסית ← שוק חשמלי ← החייאה מתקדמת; בילדים: מניעה והסברה נוספת בתחילת השרשרת, לפני קריאה לעזרה',
    'ב':'שרשרת ההישרדות זהה לחלוטין בין מבוגר לילדים','ג':'בילדים אין צורך בשוק חשמלי בשרשרת ההישרדות','ד':'במבוגר יש שלב מניעה נוסף שאין בילדים'},
  correct:'א',
  explanation:{correct:'שרשרת ההישרדות במבוגר: קריאה לעזרה ← החייאה בסיסית ← שוק חשמלי ← החייאה מתקדמת ← טיפול לאחר החייאה. בילדים מתווסף שלב "מניעה והסברה" בתחילת השרשרת (שכן דום לב בילדים לרוב תוצאה של מצב הניתן למניעה), לפני קריאה לעזרה.',
    wrong:'קיים הבדל בין השרשראות, לא זהות מוחלטת; שוק חשמלי כן חלק משרשרת ההישרדות בילדים; ושלב המניעה מתווסף דווקא אצל ילדים, לא אצל מבוגרים.'} },
{ id: 'GC_0226', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהו סדר הפעולות הבסיסי בפרוטוקול BLS מבוגר?',
  multi:false,
  options:{'א':'בטיחות ← הכרה ← נשימה ← הזעקת עזרה+דפיברילטור ← דופק ← עיסויים ← נתיב אוויר ← הנשמה ← חיבור דפיברילטור',
    'ב':'הנשמה ← עיסויים ← הכרה ← בטיחות','ג':'דפיברילטור ← הכרה ← בטיחות ← עיסויים','ד':'אין סדר קבוע, תלוי בשיקול המטפל'},
  correct:'א',
  explanation:{correct:'סדר BLS מבוגר: בטיחות ← הכרה (מילולית+פיזית) ← נשימה (כולל זיהוי Gasping) ← הזעקת עזרה+דפיברילטור מיד עם זיהוי דום לב ← בדיקת דופק (עד 10 שניות) ← עיסויים ← נתיב אוויר ← הנשמה ← חיבור דפיברילטור בהקדם.',
    wrong:'שאר הסדרים אינם תואמים את הרצף המובנה שנלמד — פרוטוקול BLS פועל לפי סדר קבוע ומוגדר, לא לפי שיקול דעת חופשי.'} },
{ id: 'GC_0227', source:'generated', qtype:['concept'], section:'החייאה',
  question:'באיזו טכניקה מבצעים עיסויי חזה בילד, בהשוואה לתינוק?',
  multi:false,
  options:{'א':'ילד — יד אחת/שתיים (לפי גודל); תינוק — שני אגודלים',
    'ב':'שניהם — שתי ידיים בדיוק כמו מבוגר','ג':'ילד — שני אגודלים; תינוק — יד אחת','ד':'אין הבדל טכניקה בין הגילאים'},
  correct:'א',
  explanation:{correct:'בילד מבצעים עיסויים ביד אחת או בשתיים (בהתאם לגודל הילד וכוח המטפל), בעומק לפחות 5 ס"מ. בתינוק — בשני אגודלים (טכניקה עוטפת), בעומק לפחות 4 ס"מ. שתי הטכניקות שונות מהותית מהטכניקה במבוגר (שתי ידיים תמיד).',
    wrong:'הטכניקה במבוגר (שתי ידיים) אינה זהה לשל הילד/תינוק; ההגדרות הפוכות באפשרות ג; וקיים הבדל טכניקה משמעותי בין קבוצות הגיל.'} },
{ id: 'GC_0228', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהי הרכבת קצב העיסויים/הנשמות ביילוד (120/דקה)?',
  multi:false,
  options:{'א':'90 עיסויים + 30 הנשמות בשילוב (יחס 3:1)','ב':'120 עיסויים בלבד, ללא הנשמות','ג':'60 עיסויים + 60 הנשמות','ד':'30 עיסויים + 90 הנשמות'},
  correct:'א',
  explanation:{correct:'קצב העיסויים ביילוד הוא 120/דקה, המורכב משילוב של 90 עיסויים ו-30 הנשמות (יחס 3:1) — כלומר מחזורים חוזרים של 3 עיסויים ואז הנשמה אחת, בקצב משולב שמגיע ל-120 פעולות בדקה.',
    wrong:'החייאת יילוד כוללת גם הנשמות, לא עיסויים בלבד; והחלוקות האחרות (60/60, 30/90) אינן תואמות את הרכבת 90+30 הנכונה.'} },
{ id: 'GC_0229', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהו עומק העיסויים המומלץ ביילוד?',
  multi:false,
  options:{'א':'לפחות 1/3 מעומק בית החזה','ב':'בדיוק 5-6 ס"מ, כמו במבוגר','ג':'לפחות 8 ס"מ','ד':'אין המלצת עומק ליילודים'},
  correct:'א',
  explanation:{correct:'עומק העיסויים ביילוד הוא יחסי — לפחות 1/3 מעומק בית החזה שלו, בשונה מהערכים הקבועים בסנטימטרים המשמשים לקבוצות גיל אחרות (מבוגר 5-6 ס"מ, ילד לפחות 5 ס"מ, תינוק לפחות 4 ס"מ).',
    wrong:'הערך של 5-6 ס"מ תואם למבוגר, לא ליילוד; 8 ס"מ גבוה מדי וללא בסיס; וקיימת המלצת עומק ברורה, גם אם היא יחסית ולא מספר קבוע.'} },
{ id: 'GC_0230', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהם הגדלים הזמינים למנתב אוויר אורלי (Oral Airway)?',
  multi:false,
  options:{'א':'00, 0, 1, 2, 3, 4','ב':'רק גודל אחד, אוניברסלי לכולם','ג':'S, M, L בלבד','ד':'1 עד 10'},
  correct:'א',
  explanation:{correct:'מנתב האוויר האורלי זמין בגדלים 00, 0, 1, 2, 3, 4 — כאשר יש להתאים את הגודל למטופל הספציפי (למשל לפי מרחק בין קצה הפה לתנוך האוזן).',
    wrong:'אין גודל אוניברסלי אחד; הסימון S/M/L אינו הסיווג המקובל למנתבי אוויר אלו; והטווח 1 עד 10 אינו תואם לגדלים הרשמיים שנלמדו.'} },
{ id: 'GC_0231', source:'generated', qtype:['concept'], section:'החייאה',
  question:'כמה פעמים לכל היותר מותר לנסות להחדיר מנתב אוויר אורלי?',
  multi:false,
  options:{'א':'עד פעמיים, לא יותר','ב':'ניסיונות בלתי מוגבלים','ג':'פעם אחת בלבד, ללא כל אפשרות לחזור','ד':'עד 5 פעמים'},
  correct:'א',
  explanation:{correct:'אין להחדיר מנתב אוויר אורלי יותר משתי פעמים — ניסיונות חוזרים מעבר לכך עלולים לגרום נזק לרקמות הרכות בפה ובלוע, ולעורר רפלקס הקאה שעלול לסכן את המטופל.',
    wrong:'ניסיונות בלתי מוגבלים מסכנים ברפלקס הקאה/נזק רקמתי חוזר; אך ניתן כן לנסות פעמיים, לא רק פעם אחת; וחמישה ניסיונות חורג משמעותית מהמגבלה המומלצת.'} },
{ id: 'GC_0232', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהו זמן השאיבה המרבי בפעולה בודדת, ומה שואבים בשיטה זו?',
  multi:false,
  options:{'א':'עד 10 שניות; נוזלים בלבד (דם/קיא/ריר)','ב':'עד 60 שניות; כל דבר כולל חפצים מוצקים','ג':'ללא הגבלת זמן','ד':'עד 10 שניות; רק אוויר'},
  correct:'א',
  explanation:{correct:'שאיבת הפרשות מוגבלת לעד 10 שניות בפעולה בודדת, ומיועדת לנוזלים בלבד (דם/קיא/ריר) — לא לחפצים מוצקים. יש להוציא מנתב אוויר (אם קיים) בזמן השאיבה.',
    wrong:'60 שניות ארוך מדי ומסכן במחסור חמצן למטופל; שאיבת חפצים מוצקים אינה מטרת המכשיר; והשאיבה מיועדת לנוזלים, לא לאוויר.'} },
{ id: 'GC_0233', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהם נפחי מפוח ההנשמה (BVM) הטיפוסיים למבוגר ולתינוק?',
  multi:false,
  options:{'א':'מבוגר כ-1000cc; תינוק 250-350cc','ב':'מבוגר ותינוק זהים, 500cc','ג':'מבוגר 250cc; תינוק 1000cc','ד':'אין הבדל נפח בין מפוחים'},
  correct:'א',
  explanation:{correct:'נפח מפוח ההנשמה הטיפוסי למבוגר הוא כ-1000cc, ולתינוק 250-350cc — התאמה חיונית למניעת הנשמת יתר בתינוק. חובה שימוש במסנן ויראלי, וטכניקת אחיזה נכונה (E&C).',
    wrong:'הנפחים שונים משמעותית בין מבוגר לתינוק, לא זהים; והשיוך ההפוך (מבוגר 250, תינוק 1000) שגוי לחלוטין — עלול לגרום הנשמת יתר מסוכנת לתינוק.'} },
{ id: 'GC_0234', source:'generated', qtype:['concept'], section:'החייאה',
  question:'למה משמש מכשיר "קרדיופאמפ"?',
  multi:false,
  options:{'א':'לביצוע עיסויי חזה חיצוניים, עם דחיסה והרפיה מלאה','ב':'למדידת לחץ דם בזמן החייאה','ג':'למתן תרופות IV','ד':'לניטור סטורציה'},
  correct:'א',
  explanation:{correct:'קרדיופאמפ הוא מכשיר המסייע בביצוע עיסויי חזה חיצוניים — הוא מאפשר גם דחיסה וגם "משיכה" אקטיבית (הרפיה מלאה) של בית החזה, מה שעשוי לשפר את זרימת הדם בהחייאה.',
    wrong:'אינו מיועד למדידת ל"ד, מתן תרופות, או ניטור סטורציה — אלו פעולות/מכשירים נפרדים לחלוטין ממטרת הקרדיופאמפ.'} },
{ id: 'GC_0235', source:'generated', qtype:['concept'], section:'החייאה', multi:true,
  question:'אילו מהבאים נחשבים "סימני מוות ודאי", שבנוכחותם אין להתחיל החייאה?',
  options:{'א':'ניתוק ראש/אגן, דפורמציה קשה','ב':'התפחמות, ריקבון','ג':'קישיון איברים מפושט, כתמי מוות מפושטים','ד':'חוסר תגובה קצר לקריאה בשם בלבד'},
  correct:['א','ב','ג'],
  explanation:{correct:'סימני מוות ודאי: ניתוק ראש/אגן, דפורמציה קשה, התפחמות, ריקבון, קישיון איברים מפושט, וכתמי מוות מפושטים — רק בנוכחות אלו אין להתחיל החייאה.',
    wrong:'חוסר תגובה קצר לקריאה בשם, כשלעצמו, אינו סימן מוות ודאי — זהו למעשה חלק מבדיקת ההכרה הרגילה, ובהיעדר סימני מוות ודאי מפורשים יש להתחיל החייאה.'} },
{ id: 'GC_0236', source:'generated', qtype:['concept'], section:'החייאה',
  question:'קרובי משפחה מתנגדים ומונעים גישה לביצוע החייאה. מה עליך לעשות?',
  multi:false,
  options:{'א':'להתייעץ עם מוקד רפואי, לא להתעמת עם המשפחה','ב':'להתעמת ולדרוש גישה בכוח','ג':'לוותר על ההחייאה מיד ולעזוב','ד':'להתעלם מההתנגדות ולהתקדם בלי לדבר'},
  correct:'א',
  explanation:{correct:'כאשר קרובי משפחה מדרגה 1 מתנגדים ומונעים גישה לביצוע החייאה, יש להתייעץ עם מוקד רפואי, ולא להתעמת עם המשפחה — התמודדות רגישה עם מצבים רגשיים קשים תוך שמירה על שיקול דעת מקצועי.',
    wrong:'התעמתות בכוח עלולה להסלים את המצב ואף להיות מסוכנת; ויתור מיידי מתעלם מהחובה הרפואית והמשפטית לספק טיפול; והתעלמות מוחלטת ללא תקשורת עלולה גם היא להסלים את המצב.'} },
{ id: 'GC_0237', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהם קישיון איברים וכתמי מוות, ומה מבחין ביניהם?',
  multi:false,
  options:{'א':'קישיון איברים — מתחיל שעות לאחר המוות, שיא ב-7-8 שעות, מתחיל בלסת; כתמי מוות — מחווירים בלחץ, לא משתנים בהרפיה',
    'ב':'שני התופעות מופיעות תוך שניות מהמוות','ג':'קישיון איברים ניתן להזזה חופשית תמיד','ד':'כתמי מוות משתנים בכל שינוי תנוחה, ללא קשר לזמן'},
  correct:'א',
  explanation:{correct:'קישיון איברים (Rigor Mortis) מתחיל שעות לאחר המוות, מגיע לשיא ב-7-8 שעות, ומתחיל בלסת. כתמי מוות (Lividity) מחווירים בלחץ בשלבים המוקדמים, אך אינם משתנים עוד לאחר קיבוע (הרפיה) — שני הסימנים משמשים יחד לזיהוי מוות ודאי.',
    wrong:'שתי התופעות אינן מופיעות באופן מיידי — לוקח להן זמן להתפתח; קישיון איברים דווקא מגביל תנועה משמעותית, לא מאפשר הזזה חופשית; וכתמי מוות בשלב מאוחר כבר אינם משתנים עם תנוחה.'} },
{ id: 'GC_0238', source:'generated', qtype:['concept'], section:'החייאה',
  question:'באירוע רב-נפגעים, מה העדיפות בין החייאת נפגע טראומה בדום לב לבין טיפול בנפגעים בעלי סימני חיים?',
  multi:false,
  options:{'א':'עדיפות לפעולות מצילות חיים בבעלי סימני חיים על פני החייאה בדום לב מטראומה',
    'ב':'עדיפות תמיד להחייאה, ללא קשר למצב שאר הנפגעים','ג':'אין כל צורך בקביעת עדיפויות באר"ן','ד':'עדיפות אקראית, לפי סדר ההגעה'},
  correct:'א',
  explanation:{correct:'באירוע רב-נפגעים (אר"ן), העיקרון הוא עדיפות לפעולות מצילות חיים בנפגעים בעלי סימני חיים על פני ביצוע החייאה בנפגע טראומה בדום לב — מתוך הכרה שמשאבי הצוות מוגבלים, ושסיכויי ההצלה גבוהים יותר עבור מי שעדיין מפגין סימני חיים.',
    wrong:'החייאה אינה תמיד העדיפות הראשונה במצב אר"ן — יש לשקול מול נפגעים אחרים; קביעת עדיפויות (טריאז\') היא בדיוק מה שנדרש באר"ן; והעדיפות אינה נקבעת אקראית אלא לפי חומרה וסיכויי הצלה.'} },
{ id: 'GC_0239', source:'generated', qtype:['concept'], section:'החייאה',
  question:'קריסה שאינה נצפית (לא ידוע מתי בדיוק החל דום הלב) — מה ההמלצה לגבי חיבור דפיברילטור?',
  multi:false,
  options:{'א':'לבצע כ-2 דקות עיסויים לפני חיבור הדפיברילטור, אם אין אפשרות לבצע את שתי הפעולות במקביל',
    'ב':'לחבר את הדפיברילטור באופן מיידי, בדיוק כמו בקריסה נצפית','ג':'להימנע מדפיברילטור לחלוטין','ד':'להמתין 10 דקות מלאות לפני כל התערבות'},
  correct:'א',
  explanation:{correct:'בקריסה שאינה נצפית, נהוג לבצע כ-2 דקות עיסויים לפני חיבור הדפיברילטור (אם לא ניתן לבצע את שתי הפעולות במקביל) — בניגוד לקריסה נצפית, שבה מחברים דפיברילטור מיידית.',
    wrong:'חיבור מיידי כמו בקריסה נצפית מתעלם מההבחנה החשובה בין שני המצבים; הימנעות מוחלטת מדפיברילטור פוגעת בסיכויי הישרדות; והמתנה של 10 דקות ארוכה משמעותית מדי ומסכנת חיים.'} },
{ id: 'GC_0240', source:'generated', qtype:['concept'], section:'החייאה', multi:true,
  question:'אילו מהאוכלוסיות הבאות מטופלות בלחיצות חזה במקום לחיצות ברום הבטן (היימליך) בחנק?',
  options:{'א':'תינוקות מתחת לשנה','ב':'נשים בהריון','ג':'מרותקים לכיסא גלגלים / שמנים מאוד','ד':'ילדים בגילאי 5-10 בעלי משקל תקין'},
  correct:['א','ב','ג'],
  explanation:{correct:'אוכלוסיות מיוחדות המטופלות בלחיצות חזה במקום לחיצות ברום הבטן: תינוקות מתחת לשנה (וגם בשיטה הייעודית של טפיחות+לחיצות), נשים בהריון, ומרותקים לכיסא גלגלים/שמנים מאוד — בכל אלו קשה או מסוכן לבצע לחיצות בטן קלאסיות.',
    wrong:'ילדים בגילאי 5-10 במשקל תקין מטופלים בלחיצות ברום הבטן הרגילות (כמו במבוגר), לא בלחיצות חזה — הם אינם בקבוצת האוכלוסיות המיוחדות.'} },
{ id: 'GC_0241', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מה ההבדל בין חסימת נתיב אוויר קלה לחמורה, ומה ההתערבות בכל אחת?',
  multi:false,
  options:{'א':'קלה — משמיע קול/משתעל/בוכה: לעודד שיעול, לא להתערב; חמורה — אין קול/שיעול/בכי: התערבות מיידית (היימליך/טפיחות)',
    'ב':'אין הבדל, שתיהן מטופלות באותו אופן','ג':'קלה מטופלת בהיימליך מיידי; חמורה בהמתנה בלבד','ד':'ההבדל תלוי רק בצבע העור'},
  correct:'א',
  explanation:{correct:'חסימה קלה (המטופל עדיין משמיע קול, משתעל או בוכה) — יש לעודד שיעול ולא להתערב פיזית, ולפנות לבי"ח. חסימה חמורה (אין קול/שיעול/בכי כלל) — מחייבת התערבות מיידית (לחיצות ברום הבטן/טפיחות בין השכמות בהתאם לגיל).',
    wrong:'ההתערבות שונה משמעותית בין השתיים; בחסימה קלה דווקא נמנעים מהתערבות פיזית מיידית; וההבדל בין הדרגות נקבע לפי יכולת השיעול/הדיבור, לא צבע העור בלבד.'} },
{ id: 'GC_0242', source:'generated', qtype:['concept'], section:'החייאה',
  question:'מהו "Pre-Shock Pause", ומדוע חשוב למזער אותו?',
  multi:false,
  options:{'א':'הפסקת העיסויים סביב מתן שוק חשמלי; יש למזער אותה (להמשיך עיסויים בזמן הטעינה) כי כל הפסקה פוגעת בזרימת הדם למוח וללב',
    'ב':'הפסקה ארוכה שרצוי להאריך לפני כל שוק','ג':'הפסקה שאין לה כל השפעה על תוצאות ההחייאה','ד':'מתייחס להפסקה לפני תחילת ההחייאה בלבד'},
  correct:'א',
  explanation:{correct:'"Pre-Shock Pause" מתייחס להפסקת העיסויים הנדרשת סביב מתן שוק חשמלי (לצורך ניתוק מגע וטעינת המכשיר). יש למזער הפסקה זו ככל האפשר — להמשיך עיסויים בזמן הטעינה ולעצור רק לרגע מתן השוק עצמו — כי כל הפסקה בעיסויים פוגעת בזרימת הדם למוח וללב וברציפות תפוקת הלב המלאכותית.',
    wrong:'יש להקטין את ההפסקה, לא להאריכה; להפסקה זו יש השפעה ממשית ומוכחת על תוצאות ההחייאה; והמונח מתייחס ספציפית להפסקה סביב מתן שוק, לא להפסקה בתחילת ההחייאה.'} },

// ================= אנטומיה ופיזיולוגיה (15) =================
{ id: 'GC_0243', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מהי הומיאוסטזיס?',
  multi:false,
  options:{'א':'שמירה על סביבה פנימית יציבה בגוף, השונה מהסביבה החיצונית (למשל רמת סוכר, חום גוף)',
    'ב':'תהליך של התכווצות שרירים בלבד','ג':'מונח המתאר רק ויסות חום גוף','ד':'תהליך שקורה רק בזמן שינה'},
  correct:'א',
  explanation:{correct:'הומיאוסטזיס היא שמירה על סביבה פנימית יציבה בגוף (למשל רמת סוכר בדם, חום גוף, איזון חומצה-בסיס) — יציבה גם כשהסביבה החיצונית משתנה. זהו עיקרון מרכזי בהבנת פתופיזיולוגיה.',
    wrong:'אינו מוגבל להתכווצות שרירים; ויסות חום הוא רק דוגמה אחת ולא ההגדרה המלאה; ואינו תהליך המוגבל לזמן שינה — פועל תמיד.'} },
{ id: 'GC_0244', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מהי ההיררכיה האנטומית מהיחידה הקטנה ביותר לגדולה ביותר?',
  multi:false,
  options:{'א':'תא ← רקמה ← איבר ← מערכת ← גוף','ב':'איבר ← תא ← רקמה ← מערכת','ג':'גוף ← מערכת ← איבר ← תא ← רקמה','ד':'רקמה ← תא ← איבר ← מערכת'},
  correct:'א',
  explanation:{correct:'ההיררכיה האנטומית הבסיסית: תא (היחידה הבסיסית) ← רקמה (קבוצת תאים דומים) ← איבר (מספר רקמות יחד) ← מערכת (מספר איברים הפועלים יחד) ← גוף (כלל המערכות).',
    wrong:'שאר הסדרים מבלבלים בין הרמות ואינם תואמים את ההיררכיה האנטומית הבסיסית שנלמדה מהיחידה הקטנה ביותר לגדולה ביותר.'} },
{ id: 'GC_0245', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מה ההבדל בין נשימה תאית אירובית לאנאירובית?',
  multi:false,
  options:{'א':'אירובית — עם חמצן; אנאירובית — ללא חמצן','ב':'שתיהן דורשות חמצן במידה שווה','ג':'אנאירובית מתרחשת רק בלב','ד':'אירובית מתרחשת רק בריאות'},
  correct:'א',
  explanation:{correct:'נשימה תאית אירובית מתרחשת בנוכחות חמצן ומייצרת אנרגיה (ATP) ביעילות גבוהה. נשימה אנאירובית מתרחשת ללא חמצן (או בחוסר חמצן), פחות יעילה, ומייצרת תוצרי לוואי כמו חומצת חלב.',
    wrong:'שתי הצורות דורשות חמצן במידה שונה, לא שווה; שתיהן מתרחשות בכל תאי הגוף, לא רק בלב או בריאות — הריאות עצמן הן איבר לחילוף גזים חיצוני, לא מקום הנשימה התאית.'} },
{ id: 'GC_0246', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'ממה מורכבות מערכת העצבים המרכזית (CNS) וההיקפית (PNS)?',
  multi:false,
  options:{'א':'CNS — מוח + חוט שדרה; PNS — כל שאר העצבים בגוף (היקפית)','ב':'CNS ו-PNS זהות לחלוטין','ג':'CNS — רק חוט שדרה; PNS — רק מוח','ד':'PNS מכילה את המוח בלבד'},
  correct:'א',
  explanation:{correct:'מערכת העצבים המרכזית (CNS) מורכבת ממוח וחוט שדרה. מערכת העצבים ההיקפית (PNS) מורכבת מכל יתר העצבים בגוף, המתחלקת לרצונית (סומטית) ובלתי-רצונית (אוטונומית — סימפטטית ופראסימפטטית).',
    wrong:'CNS ו-PNS הן שתי חלוקות שונות במהותן, לא זהות; המוח כלול ב-CNS, לא ב-PNS; והחלוקה ההפוכה (CNS=חוט שדרה בלבד, PNS=מוח) שגויה.'} },
{ id: 'GC_0247', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'כמה זוגות עצבים קרניאליים וספינאליים קיימים, וכמה בסך הכול?',
  multi:false,
  options:{'א':'12 קרניאליים + 31 ספינאליים = 43 זוגות בסך הכול','ב':'10 קרניאליים + 20 ספינאליים = 30 זוגות','ג':'רק 12 זוגות עצבים בסך הכול','ד':'31 קרניאליים + 12 ספינאליים'},
  correct:'א',
  explanation:{correct:'קיימים 43 זוגות עצבים היקפיים בסך הכול: 12 זוגות קרניאליים (כאשר עצב הוואגוס הוא הקרניאלי העשירי) ו-31 זוגות ספינאליים (אחראים על תחושה ותנועה בגוף).',
    wrong:'המספרים 10/20/30 אינם תואמים את הספירה המדויקת שנלמדה; והחלוקה ההפוכה (31 קרניאליים, 12 ספינאליים) שגויה — הסדר הנכון הוא 12 קרניאליים ו-31 ספינאליים.'} },
{ id: 'GC_0248', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'איזה מספר בסדר העצבים הקרניאליים הוא עצב הוואגוס, ומה תפקידו העיקרי?',
  multi:false,
  options:{'א':'העצב הקרניאלי העשירי; מוליך פעילות פראסימפטטית (למשל האטת דופק)',
    'ב':'העצב הקרניאלי הראשון; מוליך תחושת ראייה','ג':'אינו חלק ממערכת העצבים הקרניאלית כלל','ד':'העצב הקרניאלי השני-עשר; מוליך פעילות סימפטטית'},
  correct:'א',
  explanation:{correct:'עצב הוואגוס הוא העצב הקרניאלי העשירי, ומהווה מרכיב מרכזי במערכת הפראסימפטטית — הפעלתו מאיטה את קצב הלב ומשפיעה על תפקודים נוספים (עיכול, נשימה).',
    wrong:'העצב הראשון אחראי על ריח, לא ראייה; עצב הוואגוס בהחלט חלק מהעצבים הקרניאליים; והוא קשור למערכת הפראסימפטטית, לא הסימפטטית — לא העצב השנים-עשר.'} },
{ id: 'GC_0249', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מה כולל דרכי האוויר העליונות לעומת התחתונות?',
  multi:false,
  options:{'א':'עליונות — אף, פה, לוע, תחילת קנה נשימה (סינון/לחלוח/חימום); תחתונות — קנה נשימה, סמפונות, ריאות (ניתוב אוויר ושחלוף גזים)',
    'ב':'שתיהן זהות במיקום ובתפקוד','ג':'עליונות כוללות רק את הריאות','ד':'תחתונות כוללות רק את האף'},
  correct:'א',
  explanation:{correct:'דרכי אוויר עליונות (אף, פה, לוע, תחילת קנה הנשימה) אחראיות על סינון, לחלוח וחימום האוויר הנכנס. דרכי אוויר תחתונות (קנה נשימה, סמפונות, ריאות) אחראיות על ניתוב האוויר ושחלוף גזים.',
    wrong:'שתי הקבוצות שונות במיקום ובתפקוד; הריאות שייכות לדרכי האוויר התחתונות, לא העליונות; והאף שייך לעליונות, לא לתחתונות.'} },
{ id: 'GC_0250', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מהו תפקיד הנאדית (Alveolus) בריאה?',
  multi:false,
  options:{'א':'יחידה תפקודית לשחלוף גזים (חמצן↔פחמן דו-חמצני)','ב':'מבנה שתפקידו סינון חלקיקים בלבד','ג':'מבנה חסר תפקוד פונקציונלי, שרידי אבולוציוני','ד':'אחראית על יצירת קול הדיבור'},
  correct:'א',
  explanation:{correct:'הנאדית (Alveolus) היא היחידה התפקודית לשחלוף גזים בריאה — כאן מתבצע חילוף החמצן והפחמן הדו-חמצני בין האוויר לזרם הדם, דרך דופן דקה במיוחד.',
    wrong:'סינון חלקיקים הוא תפקיד דרכי האוויר העליונות, לא הנאדית; לנאדית תפקיד פונקציונלי קריטי, לא שרידי; ויצירת קול הדיבור קשורה למיתרי הקול, לא לנאדיות.'} },
{ id: 'GC_0251', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מהם נפח הריאות הכולל, נפח מתחלף (Tidal Volume), ונפח מת התקינים במבוגר?',
  multi:false,
  options:{'א':'נפח כולל כ-6 ליטר; נפח מתחלף כ-500 מ"ל; נפח מת כ-150 מ"ל','ב':'נפח כולל 1 ליטר; נפח מתחלף 6 ליטר','ג':'כל הערכים זהים, 500 מ"ל','ד':'אין ערכים תקינים מוגדרים לנפחי ריאה'},
  correct:'א',
  explanation:{correct:'נפח ריאות כולל תקין במבוגר הוא כ-6 ליטר. נפח מתחלף (Tidal Volume — כמות האוויר בנשימה רגילה) הוא כ-500 מ"ל. נפח מת (אוויר שאינו מגיע לשחלוף גזים בפועל) הוא כ-150 מ"ל.',
    wrong:'הערכים ההפוכים (נפח כולל 1 ליטר) אינם ריאליים; שלושת הערכים שונים זה מזה, לא זהים; וקיימים ערכי ייחוס תקינים מוגדרים היטב לנפחי ריאה.'} },
{ id: 'GC_0252', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'האם שאיפה ונשיפה רגילות הן תהליכים אקטיביים או פסיביים?',
  multi:false,
  options:{'א':'שאיפה — פעילה (שרירים מתכווצים, בית חזה מתרחב); נשיפה — פסיבית',
    'ב':'שתיהן פעילות באותה מידה','ג':'שאיפה — פסיבית; נשיפה — פעילה','ד':'שתיהן פסיביות לחלוטין'},
  correct:'א',
  explanation:{correct:'שאיפה (Inspiration) היא תהליך פעיל — השרירים (סרעפת, בין-צלעיים) מתכווצים, בית החזה מתרחב, הלחץ הפנימי יורד, ואוויר נכנס. נשיפה (Expiration) רגילה היא פסיבית — הרפיית השרירים בלבד, ללא מאמץ אקטיבי.',
    wrong:'שתי הפעולות אינן שוות במידת הפעילות; ההגדרה ההפוכה (שאיפה פסיבית, נשיפה פעילה) שגויה; ושאיפה בהחלט דורשת מאמץ שרירי פעיל.'} },
{ id: 'GC_0253', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה', multi:true,
  question:'אילו מהבאים הם כלי דם ראשיים (עורקים) בגוף?',
  options:{'א':'אבי העורקים (Aorta)','ב':'קרוטידים (למוח)','ג':'פמורלי (ירך)','ד':'ג\'וגולריס (צוואר)'},
  correct:['א','ב','ג'],
  explanation:{correct:'עורקים מרכזיים: אבי העורקים (Aorta), קרוטידים (למוח), רדיאלי/אולנרי/ברכיאלי (יד), ופמורלי (ירך).',
    wrong:'ורידי הג\'וגולריס הם ורידים (בצוואר), לא עורקים — הם חלק ממערכת הוורידים המרכזיים, יחד עם הוורידים הנבובים (Vena Cava).'} },
{ id: 'GC_0254', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'אילו מסתמים קיימים בלב, ומה תפקידם הכללי?',
  multi:false,
  options:{'א':'מיטראלי, טריקוספידלי, אאורטלי, פולמונרי — כולם מונעים זרימת דם חוזרת (מבטיחים כיוון זרימה אחד)',
    'ב':'רק מסתם אחד קיים בלב','ג':'המסתמים מיועדים לוויסות חום גוף','ד':'כל המסתמים ממוקמים באותו חדר לב'},
  correct:'א',
  explanation:{correct:'ללב ארבעה מסתמים: מיטראלי (דו-צניפי, בין עלייה שמאל לחדר שמאל), טריקוספידלי (תלת-צניפי, בין עלייה ימין לחדר ימין), אאורטלי, ופולמונרי — כולם מבטיחים זרימת דם בכיוון אחד בלבד ומונעים זרימה חוזרת.',
    wrong:'קיימים ארבעה מסתמים, לא אחד; המסתמים אינם קשורים לוויסות חום; והם ממוקמים במיקומים שונים בלב, לא כולם באותו חדר.'} },
{ id: 'GC_0255', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'מהו היחס בין משך הסיסטולה למשך הדיאסטולה במחזור לב אחד?',
  multi:false,
  options:{'א':'סיסטולה כ-1/3 מהזמן; דיאסטולה כ-2/3 מהזמן','ב':'שני השלבים נמשכים זמן שווה בדיוק','ג':'סיסטולה כ-2/3 מהזמן; דיאסטולה כ-1/3','ד':'אין יחס קבוע, משתנה אקראית'},
  correct:'א',
  explanation:{correct:'הסיסטולה (כיווץ הלב) מהווה כ-1/3 ממחזור הלב, והדיאסטולה (הרפיה/מילוי) מהווה כ-2/3 — משמעות הדבר שהלב "נח וממלא" יותר זמן ממה שהוא "עובד ודוחף", מה שגם מאפשר מילוי כלי הדם הקורונריים בעיקר בדיאסטולה.',
    wrong:'שני השלבים אינם שווים באורכם; היחס ההפוך שגוי; והיחס בין השלבים קבוע יחסית ואינו אקראי.'} },
{ id: 'GC_0256', source:'generated', qtype:['concept'], section:'אנטומיה ופיזיולוגיה',
  question:'כמה זוגות צלעות יש בבית החזה, וכמה מהן "צפות"?',
  multi:false,
  options:{'א':'12 זוגות; 11-12 מהן צפות','ב':'24 זוגות; אף אחת אינה צפה','ג':'7 זוגות בלבד','ד':'12 זוגות; כולן קבועות לחלוטין ללא צלעות צפות'},
  correct:'א',
  explanation:{correct:'בבית החזה יש 12 זוגות צלעות, כאשר הזוגות ה-11 וה-12 הן "צלעות צפות" (אינן מחוברות לעצם החזה מלפנים). מתחת לכל צלע עוברים וריד, עורק ועצב, ולכן שברי צלע עלולים לגרום גם נזק כלי-דם/עצבי.',
    wrong:'24 זוגות הוא כפול מהמספר האמיתי; 7 זוגות נמוך משמעותית; ובניגוד לאפשרות ד, קיימות בהחלט צלעות צפות (11-12) בבית החזה, לא כל הצלעות קבועות.'} },

// ================= פגיעות סביבתיות (20) =================
{ id: 'GC_0257', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'האם כלל התשיעיות המשמש להערכת שטח כוויה זהה במבוגר ובילד?',
  multi:false,
  options:{'א':'לא בדיוק — בילדים קטנים הראש מהווה אחוז גדול יותר משטח הגוף היחסי, ולכן קיימות התאמות לחישוב בילדים',
    'ב':'כן, זהה לחלוטין בכל הגילאים ללא כל שינוי','ג':'בילדים אין צורך להעריך אחוז שטח כוויה כלל','ד':'בילדים מחשבים רק לפי משקל, ללא קשר לשטח גוף'},
  correct:'א',
  explanation:{correct:'כלל התשיעיות המקורי פותח למבוגרים. בילדים קטנים, בשל פרופורציות גוף שונות (ראש גדול יחסית, רגליים קטנות יחסית), קיימות התאמות לחלוקת האחוזים כדי לשקף את הפרופורציות האמיתיות ולא להטעות בהערכת חומרת הכוויה.',
    wrong:'הכלל אינו זהה במדויק בין מבוגר לילד; הערכת שטח כוויה חשובה מאוד גם בילדים (למשל לצורך חישוב מינון נוזלים); וההערכה מבוססת על שטח גוף, לא רק משקל.'} },
{ id: 'GC_0258', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מתי ניתנים נוזלים במטופל כוויות, לפי הפרוטוקול?',
  multi:false,
  options:{'א':'רק במהלך הפינוי, לעולם לא לעכב את הפינוי לצורך כך','ב':'רק לפני היציאה, לא במהלך הנסיעה','ג':'רק בבי"ח, לעולם לא בשטח','ד':'אין מקום למתן נוזלים בכוויות כלל'},
  correct:'א',
  explanation:{correct:'כמו בכל טיפול בנוזלים לפי הפרוטוקול, מתן נוזלים (20cc/ק"ג) במטופל כוויות מתבצע רק במהלך הפינוי — לעולם לא לעכב את תחילת הפינוי לצורך פתיחת עירוי.',
    wrong:'עיכוב הפינוי למתן נוזלים לפני היציאה הוא בדיוק הטעות שיש להימנע ממנה; ניתן להתחיל מתן נוזלים כבר בשטח (במהלך הפינוי), לא רק בבי"ח; ובהחלט קיימת התוויה למתן נוזלים בכוויות.'} },
{ id: 'GC_0259', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'כיצד יש לשטוף עיניים שנפגעו מחומר כימי?',
  multi:false,
  options:{'א':'בנוזל עירוי (למשל סליין), בשטיפה מתמשכת','ב':'לא לשטוף עיניים בשום מצב, רק לחבוש','ג':'לשטוף רק במים חמים','ד':'לחכות שהחומר יתאדה מעצמו'},
  correct:'א',
  explanation:{correct:'בכוויה כימית שפגעה בעיניים, יש לשטוף אותן בנוזל עירוי (למשל סליין) בשטיפה מתמשכת — פעולה קריטית למניעת נזק בלתי הפיך לראייה.',
    wrong:'הימנעות משטיפה מותירה את החומר הכימי במגע ממושך עם העין; מים חמים אינם עדיפים על נוזל עירוי סטרילי; והמתנה להתאדות אינה טיפול פעיל ומסכנת את הראייה.'} },
{ id: 'GC_0260', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מדוע כוויות חשמל נחשבות מסוכנות יותר ממה שהן נראות חיצונית?',
  multi:false,
  options:{'א':'הזרם החשמלי גורם נזק פנימי לרקמות עמוקות שלאורך מסלול הזרם, שלרוב חמור בהרבה מהכוויה החיצונית הנראית בנקודות הכניסה/יציאה',
    'ב':'כוויות חשמל תמיד שטחיות ולא מסוכנות בכלל','ג':'הנזק מוגבל אך ורק לעור החיצוני','ד':'אין קשר בין כוויות חשמל לפגיעה פנימית'},
  correct:'א',
  explanation:{correct:'בכוויות חשמל, הזרם עובר דרך רקמות פנימיות (שרירים, כלי דם, עצבים) לאורך מסלולו בגוף, וגורם נזק פנימי שלרוב חמור משמעותית מהכוויה החיצונית הנראית בנקודות הכניסה והיציאה של הזרם — ולכן כוויית חשמל תמיד נחשבת כוויה קריטית המחייבת פינוי לבי"ח ייעודי.',
    wrong:'כוויות חשמל דווקא מסוכנות ולא שטחיות; הנזק אינו מוגבל לעור החיצוני בלבד — זה בדיוק מה שהופך אותן למסוכנות; וקיים קשר ישיר בין הזרם לפגיעה פנימית לאורך מסלולו.'} },
{ id: 'GC_0261', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מטופל שרד אירוע טביעה (Near-Drowning) ונראה תקין לחלוטין. האם יש צורך בפינוי?',
  multi:false,
  options:{'א':'כן — יש לפנות לבירור נשימתי גם ללא תסמינים ראשוניים, כי טביעה מוגדרת גם במקרי הישרדות',
    'ב':'לא, אם אין תסמינים כרגע אין צורך בשום מעקב','ג':'רק אם המטופל מבקש זאת','ד':'רק אם הטביעה התרחשה בים, לא בבריכה'},
  correct:'א',
  explanation:{correct:'טביעה מוגדרת גם כאשר המטופל שרד (Near-Drowning), ויש לפנותו לבירור נשימתי גם ללא תסמינים ראשוניים — סיבוכי ריאה (כמו בצקת ריאות משנית) עלולים להתפתח בשעות שלאחר האירוע, גם אם המטופל נראה תקין ברגע הראשוני.',
    wrong:'היעדר תסמינים ברגע הנוכחי אינו שולל התפתחות סיבוכים מאוחרת; ההחלטה על פינוי אינה תלויה ברצון המטופל בלבד במצב זה שיש בו סיכון בריאותי אמיתי; והעיקרון חל בכל סוגי הטביעה, לא רק בים.'} },
{ id: 'GC_0262', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'אילו מהבאים הם סוגי "מעיכות" (Barotrauma) בצלילה?',
  multi:false,
  options:{'א':'אוזניים (כאב, לעיתים קרע עור התוף), סינוסים, מסכה','ב':'רק פגיעות ריאה','ג':'רק פגיעות עור','ד':'אין סוג כזה של פגיעה בצלילה'},
  correct:'א',
  explanation:{correct:'מעיכות (Barotrauma) בצלילה נובעות משינויי לחץ ומשפיעות על חללי אוויר בגוף: אוזניים (כאב, לעיתים קרע עור התוף), סינוסים, ומסכה (לחץ שלילי בתוך המסכה).',
    wrong:'מעיכות אינן מוגבלות רק לריאה או רק לעור — הן פוגעות בחללי אוויר שונים בגוף כמפורט בתשובה הנכונה.'} },
{ id: 'GC_0263', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מה ההבדל בין נרקוזת חנקן ("שכרון עומק") להרעלת חמצן בצלילה?',
  multi:false,
  options:{'א':'נרקוזת חנקן — אופוריה/בלבול/פגיעה בשיקול דעת בעומק; הרעלת חמצן — פרכוסים/אבדן הכרה מריכוז חמצן גבוה/עומק',
    'ב':'שני המצבים זהים לחלוטין','ג':'נרקוזת חנקן גורמת לפרכוסים; הרעלת חמצן גורמת לאופוריה','ד':'אין קשר בין גזים לעומק צלילה'},
  correct:'א',
  explanation:{correct:'נרקוזת חנקן ("שכרון עומק") נגרמת מחנקן בעומק, ומתבטאת באופוריה, בלבול ופגיעה בשיקול דעת. הרעלת חמצן נגרמת מחמצן בריכוז גבוה/בעומק, ומתבטאת בפרכוסים ואובדן הכרה — שני מצבים שונים במנגנון ובביטוי.',
    wrong:'שני המצבים שונים משמעותית זה מזה; החלפת הסימנים (נרקוזה=פרכוסים, הרעלת חמצן=אופוריה) שגויה; ועומק הצלילה בהחלט משפיע ישירות על ריכוזי הגזים בגוף הצולל.'} },
{ id: 'GC_0264', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מדוע תסחיפי אוויר בצלילה נחשבים מסוכנים ביותר?',
  multi:false,
  options:{'א':'עלולים לגרום לתסחיף מוחי או לבבי','ב':'הם תופעה שפירה לחלוטין וללא סיכון','ג':'משפיעים רק על העור','ד':'קורים רק בצלילה רדודה מאוד'},
  correct:'א',
  explanation:{correct:'תסחיפי אוויר (בועות אוויר שנכנסות לזרם הדם, לרוב עקב עלייה מהירה מדי או עצירת נשימה בעת עלייה) עלולים לנוע דרך זרם הדם ולגרום לתסחיף מוחי או לבבי — סכנת חיים מיידית.',
    wrong:'זו תופעה מסוכנת ביותר, לא שפירה; משפיעה על מערכות חיוניות (מוח/לב), לא רק עור; ועלולה להתרחש גם בצלילות עמוקות, לא רק רדודות.'} },
{ id: 'GC_0265', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות', multi:true,
  question:'אילו מהבאים הם דרכי חשיפה אפשריות להרעלה?',
  options:{'א':'בליעה','ב':'שאיפה','ג':'הזרקה','ד':'רק מגע עם הפה'},
  correct:['א','ב','ג'],
  explanation:{correct:'דרכי חשיפה להרעלה: בליעה, שאיפה, הזרקה, וספיגה (עורית) — ארבע דרכים אפשריות שדורשות התייחסות שונה מבחינת גישה וטיפול.',
    wrong:'ההיצרות ל"רק מגע עם הפה" מפספסת דרכי חשיפה נוספות וחשובות — הרעלה יכולה להתרחש גם ללא כל מגע עם הפה, למשל דרך העור או בהזרקה.'} },
{ id: 'GC_0266', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות', multi:true,
  question:'אילו מהעקרונות הבאים נכונים בטיפול כללי בהרעלה?',
  options:{'א':'ABC ושלילת סכנה לצוות','ב':'לאסוף אריזות/כדורים/חומר לזיהוי ולקחת עם המטופל לבי"ח','ג':'אין לגרום להקאה','ד':'תמיד יש לגרום להקאה מיידית כדי לפנות את הקיבה'},
  correct:['א','ב','ג'],
  explanation:{correct:'עקרונות טיפול כללי בהרעלה: ABC ושלילת סכנה לצוות, איסוף אריזות/כדורים/חומר לזיהוי (עוזר לבי"ח לזהות את הרעל), הימנעות מגרימת הקאה, פינוי דחוף, וניתן להתייעץ עם המרכז הארצי להרעלות.',
    wrong:'אין לגרום להקאה — עלולה להחמיר נזק (למשל בבליעת חומר קורוזיבי, סכנת שאיפה), ולכן זו טעות מפורשת שיש להימנע ממנה, לא כלל טיפול.'} },
{ id: 'GC_0267', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מהו סימן "עור אדום-דובדבן" בהרעלת CO, ומתי הוא מופיע?',
  multi:false,
  options:{'א':'סימן מאוחר בהרעלת CO — אין להסתמך עליו לזיהוי מוקדם','ב':'סימן מוקדם ואמין ביותר, מופיע מיד עם החשיפה','ג':'סימן שאינו קשור כלל להרעלת CO','ד':'מופיע רק בילדים'},
  correct:'א',
  explanation:{correct:'"עור אדום-דובדבן" הוא סימן מאוחר בהרעלת CO (פחמן חד-חמצני) — אינו מופיע בשלבים המוקדמים ולכן אין להסתמך עליו לזיהוי מוקדם. הסימנים המוקדמים והשכיחים יותר הם כאב ראש, בלבול ובחילה.',
    wrong:'הוא אינו סימן מוקדם ואמין — להפך, הוא מאוחר ונדיר יחסית; קשור ישירות להרעלת CO; ואינו מוגבל לילדים בלבד.'} },
{ id: 'GC_0268', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'כיצד יש להוציא עוקץ דבורה/צרעה?',
  multi:false,
  options:{'א':'בגירוד (לא בצביטה — צביטה עלולה לסחוט ארס נוסף לתוך העור)','ב':'בצביטה חזקה עם פינצטה','ג':'אין להוציא עוקץ בשום מצב','ד':'רק ע"י רופא בבי"ח'},
  correct:'א',
  explanation:{correct:'עוקץ יש להוציא ע"י גירוד (למשל בעזרת קצה כרטיס) — לא בצביטה, שכן צביטה עלולה לסחוט ארס נוסף מתוך שק הארס לתוך העור ולהחמיר את התגובה המקומית.',
    wrong:'צביטה בפינצטה עלולה להזרים עוד ארס לגוף; ניתן וכדאי להוציא את העוקץ בשטח, לא להשאירו; ואין צורך להמתין לרופא לפעולה פשוטה זו.'} },
{ id: 'GC_0269', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות', multi:true,
  question:'אילו מהמחלות הבאות דורשות מודעות מיוחדת לדרכי הדבקה בעבודת חובש?',
  options:{'א':'AIDS/HIV','ב':'טטנוס','ג':'כלבת','ד':'סוכרת'},
  correct:['א','ב','ג'],
  explanation:{correct:'מחלות מדבקות שדורשות מודעות מיוחדת לדרכי הדבקה: AIDS/HIV, טטנוס, כלבת, ודלקת ריאות — כל אלו דורשות שימוש נכון ב-PPE ופרוטוקולי חשיפה.',
    wrong:'סוכרת אינה מחלה מדבקת — היא מחלה מטבולית, ואינה נכללת ברשימת המחלות המדבקות שדורשות מודעות לדרכי הדבקה.'} },
{ id: 'GC_0270', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'האם שימוש בציוד מגן אישי (PPE) הוא המלצה או חובה?',
  multi:false,
  options:{'א':'חובה לפי חוק, לא רשות','ב':'המלצה בלבד, תלוי בשיקול דעת אישי','ג':'חובה רק בטיפול בילדים','ד':'חובה רק בזמן מגפות'},
  correct:'א',
  explanation:{correct:'שימוש בציוד מגן אישי (כפפות, מסכת FFP3, משקפי הגנה, ערכת מיגון נגיפית) הוא חובה לפי חוק, לא רשות — הגנה הן על המטפל והן על המטופל מפני חשיפה לזיהומים.',
    wrong:'זו אינה המלצה גמישה — יש חובה ברורה; החובה חלה על כל טיפול בנוזלי גוף, לא רק בילדים; והיא קיימת תמיד, לא רק בתקופות מגפה.'} },
{ id: 'GC_0271', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מטפל נדקר בטעות בעת פתיחת קו ורידי לחולה. מה עליו לעשות?',
  multi:false,
  options:{'א':'לדווח מיידית למוקד המרחבי ולפעול לפי נוהל חשיפה + טיפול רפואי מיידי','ב':'להתעלם אם הפצע קטן','ג':'לחכות לסיום המשמרת לדווח','ד':'לטפל בעצמו בביתו ללא דיווח'},
  correct:'א',
  explanation:{correct:'חשיפה (דקירה/התזה) מחייבת דיווח מיידי למוקד המרחבי ופעולה לפי נוהל חשיפה, בנוסף לטיפול רפואי מיידי — עיכוב עלול לפגוע ביעילות טיפול מונע (אם נדרש) לזיהומים כמו HIV/צהבת.',
    wrong:'אין להתעלם גם מפצע קטן — סיכון החשיפה אינו תלוי בגודל הפצע הנראה; המתנה לסוף המשמרת מעכבת טיפול מונע קריטי; וטיפול עצמי ללא דיווח רשמי חוטא לפרוטוקול ולזכויות המטפל.'} },
{ id: 'GC_0272', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות', multi:true,
  question:'אילו מהסימנים הבאים מחשידים לחשד להתעללות בילדים?',
  options:{'א':'פציעות לא-תואמות לסיפור/גיל ההתפתחותי','ב':'פציעות בשלבי ריפוי שונים','ג':'היסטוריה משתנה מסיפור לסיפור','ד':'ילד עם פציעה אחת בודדת התואמת לחלוטין לסיפור שנמסר'},
  correct:['א','ב','ג'],
  explanation:{correct:'סימנים מחשידים לחשד להתעללות בילדים: פציעות שאינן תואמות את הסיפור או את גיל ההתפתחות, פציעות בשלבי ריפוי שונים (מעידות על אירועים חוזרים), היסטוריה משתנה, ופחד מההורה.',
    wrong:'פציעה בודדת התואמת באופן מלא לסיפור שנמסר אינה מהווה כשלעצמה סימן חשד — להפך, זהו בדיוק מה שמצופה במקרה תמים ולא-חשוד.'} },
{ id: 'GC_0273', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'אילו פעולות מומלצות בהכנה מראש לרעידת אדמה?',
  multi:false,
  options:{'א':'לקבע חפצים תלויים ומדפים/טלוויזיות לקיר, ולתכנן דרכי מילוט קצרות ופנויות',
    'ב':'להימנע מכל הכנה, כי אי אפשר לצפות רעידת אדמה','ג':'לאחסן חומרים דליקים ליד מקורות אש למניעת בעירה מוקדמת','ד':'לוודא שדרכי המילוט חסומות בציוד כבד למניעת גניבה'},
  correct:'א',
  explanation:{correct:'הכנה מראש לרעידת אדמה כוללת קיבוע חפצים תלויים (מזגנים, דודי שמש) ומדפים/טלוויזיות/ספריות לקיר, אחסון חומרים רעילים/דליקים הרחק מאש ומקורות מים, ותכנון דרכי מילוט קצרות ופנויות.',
    wrong:'הכנה מראש בהחלט אפשרית ומומלצת, גם ללא יכולת חיזוי מדויק; אחסון חומרים דליקים ליד אש הוא בדיוק מה שיש להימנע ממנו; וחסימת דרכי מילוט מסכנת חיים במקום להגן על רכוש.'} },
{ id: 'GC_0274', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'לאיזה גובה מומלץ לעלות בעת חשד לצונאמי, ולמה?',
  multi:false,
  options:{'א':'לפחות 4 קומות, כדי להימנע מגלי הצונאמי','ב':'קומה אחת מספיקה תמיד','ג':'אין צורך לעלות לגובה כלל','ד':'עד 20 קומות, לא פחות'},
  correct:'א',
  explanation:{correct:'בחשד לצונאמי, מומלץ לעלות לגובה של לפחות 4 קומות — מרחק ביטחון סביר מגלי הצונאמי שעלולים להגיע לחוף.',
    wrong:'קומה אחת אינה מספקת הגנה מספקת מגלי צונאמי; אין להתעלם מהצורך לעלות לגובה; ו-20 קומות היא דרישה מוגזמת בהשוואה להנחיה הרשמית של 4 קומות לפחות.'} },
{ id: 'GC_0275', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'לאחר רעידת אדמה, מדוע אין להיכנס למבנים שניזוקו ללא אישור מהנדס?',
  multi:false,
  options:{'א':'המבנה עלול להיות מוחלש מבנית וקיים סיכון קריסה נוספת, כולל בעת רעידות משנה',
    'ב':'אין כל סיכון בכניסה, זו רק המלצה זהירה יתר על המידה','ג':'מהנדס נדרש רק לצורכי ביטוח','ד':'הסיכון היחיד הוא אבק בלבד'},
  correct:'א',
  explanation:{correct:'מבנה שניזוק ברעידת אדמה עלול להיות מוחלש מבנית באופן שאינו נראה לעין הבלתי-מקצועית, וקיים סיכון ממשי לקריסה נוספת — במיוחד בעת רעידות משנה (Aftershocks) שיכולות להתרחש שעות עד חודשים לאחר הרעידה הראשית.',
    wrong:'הסיכון ממשי ואינו זהירות מוגזמת; אישור מהנדס נדרש מטעמי בטיחות פיזית, לא רק לצורכי ביטוח; והסיכון חורג בהרבה מאבק בלבד — מדובר בסכנת קריסה.'} },
{ id: 'GC_0276', source:'generated', qtype:['concept'], section:'פגיעות סביבתיות',
  question:'מהו העיקרון הראשון בטיפול בזירת חומרים מסוכנים (Hazmat)?',
  multi:false,
  options:{'א':'שלילת סכנה לצוות לפני כל גישה למטופל','ב':'לגשת ישר למטופל ללא כל הערכה','ג':'להתעלם מהחומר ולטפל כרגיל','ד':'לגשת רק לאחר קבלת אישור מהמטופל עצמו'},
  correct:'א',
  explanation:{correct:'העיקרון הראשון והבסיסי בכל טיפול בהרעלה או חשיפה לחומר מסוכן הוא שלילת סכנה לצוות עצמו לפני כל גישה למטופל — בטיחות המטפל תמיד קודמת, שכן מטפל שנפגע אינו יכול לסייע לאיש.',
    wrong:'גישה ישירה ללא הערכה מסכנת את המטפל עצמו; אין להתעלם מנוכחות חומר מסוכן; ואישור המטופל אינו רלוונטי לשאלת בטיחות הצוות מפני הסביבה המזוהמת.'} },

// ================= לידה וגניקולוגיה (10) =================
{ id: 'GC_0277', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'אילו פרטים חשוב לברר באנמנזה גינקולוגית/מיילדותית?',
  multi:false,
  options:{'א':'הריונות קודמים, מספר לידות, סיבוכים קודמים, גיל הריון, ירידת מים, צירים (תדירות/משך), מספר עוברים, דימום וגינלי',
    'ב':'רק גיל האישה','ג':'רק אם זו לידה ראשונה, ללא פרטים נוספים','ד':'רק תוצאות בדיקות דם עדכניות'},
  correct:'א',
  explanation:{correct:'אנמנזה גינקולוגית/מיילדותית מקיפה כוללת: הריונות קודמים, מספר לידות, סיבוכים קודמים (רעלת הריון, סוכרת הריון, לידה מוקדמת, הריון חוץ-רחמי), גיל הריון, לידה בעבר, ירידת מים (צבע/מקוניאלי), צירים (תדירות/משך), מספר עוברים, כאב, דימום וגינלי, רגישויות, ומעקב הריון.',
    wrong:'גיל האישה הוא פרט אחד מני רבים, לא מספיק לבדו; מספר הלידות/ראשוניות הן פרט חשוב אך לא היחיד; ובדיקות דם עדכניות אינן חלק מהאנמנזה הראשונית בשטח.'} },
{ id: 'GC_0278', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מהם שלושת שלבי הלידה?',
  multi:false,
  options:{'א':'(1) מחיקה+פתיחת צוואר וירידת ראש (2) לידת התינוק+חיתוך חבל טבור (3) לידת השליה',
    'ב':'(1) לידת השליה (2) לידת התינוק (3) מחיקת הצוואר','ג':'יש שני שלבים בלבד','ד':'(1) חיתוך חבל טבור (2) מחיקת צוואר (3) לידת תינוק'},
  correct:'א',
  explanation:{correct:'שלושת שלבי הלידה: (1) מחיקה ופתיחת צוואר הרחם עם ירידת ראש התינוק, (2) לידת התינוק וחיתוך חבל הטבור, (3) לידת השליה — סדר הכרחי המשקף את תהליך הלידה הפיזיולוגי.',
    wrong:'שאר הסדרים הופכים או מערבבים את השלבים בצורה שאינה תואמת את התהליך הפיזיולוגי — לידת השליה למשל מגיעה תמיד אחרונה, לא ראשונה.'} },
{ id: 'GC_0279', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מה כולל ההכנה לקבלת לידה בשטח?',
  multi:false,
  options:{'א':'פרטיות, מצע קשיח, חימום חדר, ערכת לידה + ציוד החייאה למבוגר ולתינוק',
    'ב':'אין צורך בהכנה מיוחדת מעבר לציוד רגיל','ג':'רק ערכת לידה, ללא ציוד החייאה','ד':'רק חימום החדר'},
  correct:'א',
  explanation:{correct:'הכנה לקבלת לידה כוללת: הבטחת פרטיות, מצע קשיח, חימום החדר (מניעת היפותרמיה ליילוד), וזמינות ערכת לידה + ציוד החייאה הן למבוגר (האם) והן לתינוק — היערכות מלאה למקרה סיבוך.',
    wrong:'קבלת לידה דורשת הכנה ייעודית מעבר לציוד רגיל; ציוד החייאה חיוני ולא ניתן לוותר עליו; והכנה מלאה כוללת יותר מחימום החדר בלבד.'} },
{ id: 'GC_0280', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מהי טכניקת התמיכה בפרינאום בעת קבלת לידה, ומטרתה?',
  multi:false,
  options:{'א':'תמיכה ביד אחת ("L" עם היד) + לחץ נגדי עדין על ראש הילוד ביד השנייה — למניעת קרעים',
    'ב':'לחיצה חזקה על הבטן העליונה של האם','ג':'משיכה בראש הילוד כדי להאיץ את היציאה','ד':'אין צורך בתמיכה כלל, הלידה קורית מעצמה'},
  correct:'א',
  explanation:{correct:'תמיכה בפרינאום מתבצעת ביד אחת (בצורת "L") למניעת קרעים, בשילוב לחץ נגדי עדין על ראש הילוד ביד השנייה, למניעת יציאה מהירה מדי שעלולה לגרום פגיעה גם לאם וגם לתינוק.',
    wrong:'לחיצה על הבטן העליונה אינה טכניקה מקובלת ועלולה להזיק; משיכה בראש התינוק אסורה תמיד; ותמיכה נכונה בפרינאום היא פעולה אקטיבית וחשובה, לא פסיבית.'} },
{ id: 'GC_0281', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'חבל הטבור כרוך סביב צוואר הילוד ("Nuchal Cord") בעת הלידה. מה תעשה?',
  multi:false,
  options:{'א':'להסירו בעדינות מעל הראש','ב':'למשוך בכוח כדי לשחרר את הצוואר','ג':'לחתוך אותו מיד תוך כדי הלידה, ללא הידוק קודם','ד':'להתעלם ולהמשיך בלידה כרגיל'},
  correct:'א',
  explanation:{correct:'כאשר חבל הטבור כרוך סביב צוואר הילוד, יש להסירו בעדינות מעל הראש בעת הלידה — פעולה שגרתית וחשובה למניעת חנק חלקי.',
    wrong:'משיכה בכוח עלולה לגרום נזק לחבל הטבור או לצוואר הילוד; חיתוך ללא הידוק קודם מסוכן (דימום); והתעלמות עלולה להשאיר חבל טבור כרוך שעלול להגביל את הנשימה הראשונית.'} },
{ id: 'GC_0282', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מה ההבדל הקליני בין שליית פתח (Placenta Previa) להיפרדות שליה?',
  multi:false,
  options:{'א':'שליית פתח — דימום ללא כאב; היפרדות שליה — מצוקה עם סימני היפוולמיה, ולרוב טראומה בטנית ברקע',
    'ב':'שני המצבים זהים לחלוטין קלינית','ג':'שליית פתח כואבת מאוד; היפרדות שליה ללא כאב כלל','ד':'ההבדל היחיד הוא שבוע ההריון'},
  correct:'א',
  explanation:{correct:'שליית פתח (Placenta Previa — השליה מכסה את צוואר הרחם) מתבטאת בדימום וגינלי ללא כאב. היפרדות שליה (היפרדות מדופן הרחם בטרם עת) מתבטאת בדימום עם סימני היפוולמיה, ולעיתים ברקע טראומה בטנית או רעלת הריון — מצב חירום לאם ולעובר.',
    wrong:'שני המצבים שונים משמעותית בביטוי הקליני; ההגדרה ההפוכה (שליית פתח כואבת, היפרדות ללא כאב) שגויה; וההבדל אינו רק שבוע ההריון — יש הבדל אמיתי בתסמינים.'} },
{ id: 'GC_0283', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מה ההבדל בין קדם-רעלת (Pre-eclampsia) לרעלת/אקלמפסיה (Eclampsia)?',
  multi:false,
  options:{'א':'ההבדל הוא הופעת פרכוסים או חוסר הכרה עמוק — קדם-רעלת ללא פרכוסים; אקלמפסיה עם פרכוסים',
    'ב':'שני המונחים זהים לחלוטין','ג':'קדם-רעלת מתרחשת רק בטרימסטר הראשון','ד':'ההבדל היחיד הוא רמת הסוכר בדם'},
  correct:'א',
  explanation:{correct:'ההבדל בין קדם-רעלת לרעלת (אקלמפסיה) הוא הופעת פרכוסים או חוסר הכרה עמוק — קדם-רעלת כוללת כאבי ראש, טשטוש ראייה, בצקות, ועלייה בל"ד ללא פרכוסים; אקלמפסיה מוגדרת ע"י הופעת פרכוסים.',
    wrong:'אלו שני שלבים שונים של אותה מחלה, לא מונח זהה; רעלת הריון מתרחשת בד"כ לאחר שבוע 24 (יתכן משבוע 20), לא בטרימסטר הראשון; ואין קשר לרמת סוכר בדם — זהו מצב שקשור ליתר לחץ דם ומעורבות מערכות.'} },
{ id: 'GC_0284', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה', multi:true,
  question:'אילו מהבאים הם גורמי סיכון לרעלת הריון?',
  options:{'א':'גיל אם מתקדם','ב':'ל"ד גבוה קודם','ג':'הריון מרובה עוברים','ד':'פעילות גופנית קבועה במהלך ההריון'},
  correct:['א','ב','ג'],
  explanation:{correct:'גורמי סיכון לרעלת הריון: גיל אם מתקדם, ל"ד גבוה קודם, מחלות כליה/כלי דם כרוניות, והריון מרובה עוברים.',
    wrong:'פעילות גופנית קבועה במידה סבירה במהלך הריון תקין אינה גורם סיכון מוכר לרעלת הריון — אינה כלולה ברשימת גורמי הסיכון שנלמדו.'} },
{ id: 'GC_0285', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'כיצד ניתן להבחין בין פרע כתפיים, שמט חבל טבור, ומצג עכוז — לפי הממצא הקליני?',
  multi:false,
  options:{'א':'פרע כתפיים — ראש יצא אך כתפיים תקועות; שמט חבל טבור — חבל טבור נראה לפני הראש; מצג עכוז — רגליים/עכוז יוצאים ראשונים',
    'ב':'שלושתם נראים אותו הדבר קלינית, ללא הבדל','ג':'ההבחנה נעשית רק ע"י בדיקת דם','ד':'רק הדמיה בבי"ח יכולה להבחין ביניהם'},
  correct:'א',
  explanation:{correct:'שלושת המצבים נבדלים לפי הממצא הקליני הנראה: פרע כתפיים — ראש התינוק כבר יצא אך הכתפיים אינן מתקדמות. שמט חבל טבור — חבל הטבור נראה/יוצא לפני ראש התינוק. מצג עכוז — רגליים או עכוז יוצאים ראשונים, לא הראש.',
    wrong:'שלושת המצבים נבדלים באופן ברור ומיידי לעין המטפל; אינם דורשים בדיקת דם או הדמיה לזיהוי — ההבחנה נעשית קלינית בזמן אמת בשטח.'} },
{ id: 'GC_0286', source:'generated', qtype:['concept'], section:'לידה וגניקולוגיה',
  question:'מה עושים עם היילוד מיד לאחר הלידה, לפני חיתוך חבל הטבור?',
  multi:false,
  options:{'א':'להניחו על האם (לשמירה על חום וקשר אם-תינוק), ניגוב וגירוי לנשימה',
    'ב':'להניחו רחוק מהאם כדי לא להפריע לה','ג':'לחתוך את חבל הטבור מיידית לפני כל דבר אחר','ד':'להשרות אותו במים כדי לנקותו'},
  correct:'א',
  explanation:{correct:'מיד לאחר הלידה, מניחים את היילוד על האם — לשמירה על חום גוף ויצירת קשר אם-תינוק — תוך ביצוע ניגוב וגירוי לנשימה (שפשוף גב/צביטת כף רגל). רק לאחר מכן מניחים את הקלמפים וחותכים את חבל הטבור.',
    wrong:'הרחקה מהאם פוגעת בשמירה על חום ובקשר החשוב; חיתוך חבל הטבור אינו הפעולה הראשונה — קודמות הנחת היילוד וגירוי לנשימה; והשריה במים אינה חלק מהטיפול המיידי הנכון בילוד.'} },

// ================= ציוד רפואי (10) =================
{ id: 'GC_0287', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'כל כמה זמן נדרשת בדיקה הידרוסטטית למיכלי חמצן?',
  multi:false,
  options:{'א':'כל 5 שנים','ב':'כל שנה','ג':'כל 10 שנים','ד':'אין דרישה קבועה'},
  correct:'א',
  explanation:{correct:'מיכלי חמצן מחייבים בדיקה הידרוסטטית כל 5 שנים — בדיקת לחץ לוודא שהמיכל תקין ובטוח לשימוש, למניעת סכנת פיצוץ.',
    wrong:'שנה אחת קצרה מדי ואינה התדירות הנדרשת לבדיקה ההידרוסטטית (זהו דווקא פרק הזמן לתוקף מיכל מלא, לא לבדיקה ההידרוסטטית); 10 שנים ארוך מדי; וקיימת בהחלט דרישה קבועה ומחייבת.'} },
{ id: 'GC_0288', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'מהו תוקף השימוש במיכל חמצן מלא, לפני שיש לבדוק/למלא אותו מחדש?',
  multi:false,
  options:{'א':'עד שנה','ב':'עד שבוע','ג':'עד 5 שנים','ד':'אין תוקף מוגדר'},
  correct:'א',
  explanation:{correct:'תוקף השימוש במיכל חמצן מלא הוא עד שנה — לאחר מכן יש לבדוק את המיכל מחדש, גם אם לא נעשה בו שימוש, כדי לוודא תקינות ולחץ נכון.',
    wrong:'שבוע קצר מדי משמעותית מהתוקף האמיתי; 5 שנים הוא פרק הזמן לבדיקה ההידרוסטטית, לא לתוקף מיכל מלא; וקיים תוקף מוגדר וברור.'} },
{ id: 'GC_0289', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'כיצד יש לסלק פסולת דוקרת (כגון מחטים) לאחר שימוש?',
  multi:false,
  options:{'א':'לפח מחטים ייעודי, צהוב/אדום עם סימון "DANGER", חד-פעמי','ב':'לפח אשפה רגיל','ג':'לשקית ניילון רגילה','ד':'לשטוף ולהשתמש בהם שוב'},
  correct:'א',
  explanation:{correct:'פסולת דוקרת (מחטים וכד\') מסולקת לפח מחטים ייעודי, בצבע צהוב/אדום עם סימון "DANGER", המיועד לשימוש חד-פעמי — למניעת פציעות דקירה מקריות לצוותים אחרים.',
    wrong:'פח אשפה רגיל או שקית ניילון מסכנים פציעה מקרית לאחרים; ושימוש חוזר במחט מהווה סיכון זיהומי חמור ואסור בהחלט.'} },
{ id: 'GC_0290', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'כיצד מסלקים פסולת רפואית מזוהמת שאינה דוקרת (כגון גזה משומשת)?',
  multi:false,
  options:{'א':'לשקית ייעודית לפסולת מזוהמת','ב':'לפח מחטים, כמו פסולת דוקרת','ג':'לשירותים','ד':'לפח אשפה ביתי רגיל ללא כל הפרדה'},
  correct:'א',
  explanation:{correct:'פסולת רפואית מזוהמת שאינה דוקרת (למשל גזה משומשת) מסולקת לשקית ייעודית לפסולת מזוהמת — נפרד מפח המחטים המיועד ספציפית לפסולת דוקרת.',
    wrong:'פח המחטים מיועד לפסולת דוקרת בלבד, לא לפסולת רכה; אין להשליך פסולת רפואית לשירותים; ואין לזרוק אותה לפח אשפה רגיל ללא הפרדה ייעודית.'} },
{ id: 'GC_0291', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'מהם מרכיבי הונפלון (קטטר לעירוי)?',
  multi:false,
  options:{'א':'מחט מתווה + צינורית פוליתילן (נשארת בווריד) + שסתום חד-כיווני + כוסית ביקורת (לוודא בתוך כלי דם) + פקק',
    'ב':'רק מחט בודדת, ללא רכיבים נוספים','ג':'רק צינורית, ללא מחט','ד':'שני שסתומים דו-כיווניים בלבד'},
  correct:'א',
  explanation:{correct:'הונפלון מורכב מכמה חלקים: מחט מתווה (משמשת להחדרה ומוסרת בהמשך), צינורית פוליתילן שנשארת בווריד, שסתום חד-כיווני, כוסית ביקורת (מאפשרת לוודא שאכן חדרנו לכלי דם — "flashback"), ופקק.',
    wrong:'הונפלון מורכב ממספר רכיבים, לא ממחט בודדת; הוא כולל גם מחט וגם צינורית יחד; והשסתום הוא חד-כיווני, לא שני שסתומים דו-כיוונים.'} },
{ id: 'GC_0292', source:'generated', qtype:['concept'], section:'ציוד רפואי', multi:true,
  question:'אילו מהפעולות הבאות נחשבות טעויות טכניקה בפתיחת ונפלון?',
  options:{'א':'שימוש חוזר במחט שנכשלה','ב':'הסתרת כוסית הביקורת','ג':'הנחת אצבע מתחת לונפלון בעת ההחדרה','ד':'קיבוע נכון של הונפלון לאחר ההחדרה'},
  correct:['א','ב','ג'],
  explanation:{correct:'טעויות טכניקה נפוצות: שימוש חוזר במחט שכבר נכשלה (סיכון זיהומי וקהות המחט), הסתרת כוסית הביקורת (מונעת אימות שנמצאים בכלי דם), והנחת אצבע מתחת לונפלון בעת ההחדרה (מגבירה סיכון פגיעה עצמית/זיהום).',
    wrong:'קיבוע נכון של הונפלון לאחר ההחדרה הוא בדיוק הפעולה הרצויה והנכונה — לא טעות טכניקה, אלא חלק הכרחי מסיום הפעולה בבטחה.'} },
{ id: 'GC_0293', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'מהו הכלל בעת שאיבת הפרשות ממטופל עם מנתב אוויר אורלי (OPA) מוחדר?',
  multi:false,
  options:{'א':'יש להוציא את מנתב האוויר בזמן השאיבה','ב':'יש להשאיר את מנתב האוויר במקומו תמיד בזמן השאיבה','ג':'אין לשאוב הפרשות כלל אם יש מנתב אוויר','ד':'יש להחדיר מנתב אוויר נוסף לפני השאיבה'},
  correct:'א',
  explanation:{correct:'בעת שאיבת הפרשות ממטופל שיש לו מנתב אוויר אורלי מוחדר, יש להוציא את מנתב האוויר בזמן השאיבה — כדי לאפשר גישה נכונה של קטטר השאיבה ולמנוע חסימה או פגיעה במנתב עצמו.',
    wrong:'השארת המנתב במקומו עלולה להפריע לשאיבה יעילה; שאיבה כן מתבצעת גם עם מנתב אוויר, רק תוך הוצאתו הזמנית; והחדרת מנתב נוסף אינה חלק מהפרוטוקול.'} },
{ id: 'GC_0294', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'האם מסנן ויראלי הוא חובה בשימוש במפוח הנשמה (BVM)?',
  multi:false,
  options:{'א':'כן, חובה','ב':'לא, רק המלצה גמישה','ג':'חובה רק בילדים','ד':'חובה רק אם המטופל חולה ידוע'},
  correct:'א',
  explanation:{correct:'מסנן ויראלי הוא חובה בשימוש במפוח הנשמה (BVM) — מגן על המטפל מפני חשיפה להפרשות/וירוסים של המטופל, ללא קשר לידיעה מוקדמת על מחלת רקע.',
    wrong:'זו חובה מוחלטת, לא המלצה גמישה; החובה חלה על כל הגילאים, לא רק ילדים; והיא חלה תמיד, ללא תלות בידיעה קודמת על מחלת המטופל — שכן לא תמיד ניתן לדעת מראש.'} },
{ id: 'GC_0295', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'מהי יכולת הפינוי הטיפוסית של אמבולנס רגיל (חובש)?',
  multi:false,
  options:{'א':'2 שוכבים או 1 שוכב+3 יושבים','ב':'רק שוכב אחד, ללא יושבים','ג':'עד 10 מטופלים בו-זמנית','ד':'אין הגבלה כלל'},
  correct:'א',
  explanation:{correct:'אמבולנס רגיל (חובש רפואת חירום + מגישי עז"ר, סעד חיים בסיסי/חצי-מתקדם) מסוגל לפנות 2 מטופלים שוכבים, או שוכב אחד יחד עם 3 יושבים — יכולת פינוי משמעותית לתכנון משאבים באירוע מרובה נפגעים.',
    wrong:'יכולת הפינוי גדולה משוכב יחיד בלבד; 10 מטופלים חורג משמעותית מהיכולת האמיתית; וקיימת הגבלה ברורה של קיבולת האמבולנס.'} },
{ id: 'GC_0296', source:'generated', qtype:['concept'], section:'ציוד רפואי',
  question:'מה מייצג המונח "פארה" בהקשר של ונפלון?',
  multi:false,
  options:{'א':'ניקוב וריד — סיבוך אפשרי בפתיחת קו ורידי','ב':'שם מסחרי של סוג ונפלון','ג':'סוג של תמיסת עירוי','ד':'שם של תרופה הניתנת IV'},
  correct:'א',
  explanation:{correct:'"פארה" הוא הכינוי לניקוב וריד — סיבוך אפשרי בפתיחת קו ורידי, שבו המחט/הצינורית חוררת את דופן הווריד ולא נשארת בתוכו כראוי, מה שגורם לדליפת דם/נוזל לרקמה סביב הווריד (המטומה).',
    wrong:'אינו שם מסחרי, סוג תמיסה, או תרופה — זהו כינוי לסיבוך טכני בפתיחת קו ורידי.'} },

// ================= עבודת הצוות (5) =================
{ id: 'GC_0297', source:'generated', qtype:['concept'], section:'עבודת הצוות',
  question:'מתי ועל ידי מי הוקם מד"א?',
  multi:false,
  options:{'א':'ב-1930 בתל אביב, ע"י 7 מתנדבים','ב':'ב-1948 עם הקמת המדינה','ג':'ב-1980, כארגון ממשלתי מלכתחילה','ד':'לא ידוע תאריך מדויק'},
  correct:'א',
  explanation:{correct:'מד"א הוקם ב-1930 בתל אביב, ע"י 7 מתנדבים. בשנת 1950 נחקק "חוק מגן דוד אדום", שהכיר במד"א כארגון ההצלה הלאומי.',
    wrong:'1948 הוא שנת הקמת המדינה, לא מד"א; מד"א לא הוקם כארגון ממשלתי — הוא החל כארגון התנדבותי; וקיים תאריך הקמה מדויק וידוע.'} },
{ id: 'GC_0298', source:'generated', qtype:['concept'], section:'עבודת הצוות',
  question:'מהו המבנה הארגוני-גיאוגרפי של מד"א?',
  multi:false,
  options:{'א':'7 מחוזות, 11 מרחבים, 9 מוקדים מרחביים, מוקד ארצי אחד','ב':'מחוז אחד בלבד לכל הארץ','ג':'20 מחוזות ו-2 מוקדים','ד':'אין חלוקה גיאוגרפית מוגדרת'},
  correct:'א',
  explanation:{correct:'מבנה מד"א כולל 7 מחוזות, 11 מרחבים, 9 מוקדים מרחביים, ומוקד ארצי אחד — חלוקה גיאוגרפית-ארגונית המאפשרת ניהול ותפעול יעיל ברחבי הארץ.',
    wrong:'מד"א אינו מאורגן במחוז יחיד; המספרים 20/2 אינם תואמים את המבנה האמיתי; וקיימת חלוקה גיאוגרפית ברורה ומוגדרת.'} },
{ id: 'GC_0299', source:'generated', qtype:['concept'], section:'עבודת הצוות',
  question:'מהם שבעת העקרונות של תנועת הצלב האדום/מד"א?',
  multi:false,
  options:{'א':'הומניות, אי-משוא פנים, ניטרליות, עצמאות, התנדבות, אחדות, אוניברסליות','ב':'רק שני עקרונות: הומניות ורווח כלכלי','ג':'עקרונות שאינם קיימים בפועל','ד':'ביטחון, רווח, ותחרותיות'},
  correct:'א',
  explanation:{correct:'שבעת העקרונות של תנועת הצלב האדום/מד"א: הומניות, אי-משוא פנים, ניטרליות, עצמאות, התנדבות, אחדות, ואוניברסליות — עקרונות המנחים את פעילות הארגון ברמה הבינלאומית.',
    wrong:'קיימים שבעה עקרונות מוגדרים, לא שניים; העקרונות בהחלט קיימים ומיושמים בפועל; ורווח כלכלי ותחרותיות אינם חלק מעקרונות התנועה, שהיא הומניטרית מיסודה.'} },
{ id: 'GC_0300', source:'generated', qtype:['concept'], section:'עבודת הצוות',
  question:'מהו זמן ההגעה הממוצע של כונן/רכב ראשון של מד"א?',
  multi:false,
  options:{'א':'כ-4:52 דקות','ב':'כ-20 דקות','ג':'כ-1 דקה','ד':'אין נתון ממוצע מוגדר'},
  correct:'א',
  explanation:{correct:'זמן ההגעה הממוצע של כונן/רכב ראשון של מד"א הוא כ-4:52 דקות — נתון המשקף את פריסת המשאבים והכוננים ברחבי הארץ.',
    wrong:'20 דקות ארוך משמעותית מהזמן הממוצע האמיתי; דקה אחת קצרה באופן לא ריאלי; וקיים נתון ממוצע מוגדר ומתועד.'} },
{ id: 'GC_0301', source:'generated', qtype:['concept'], section:'עבודת הצוות',
  question:'מהם ארבעת דרגות חומרת הפציעה בסיווג המקובל?',
  multi:false,
  options:{'א':'קל (אין סכנה), בינוני (יתכן נכות), קשה (סכנת חיים אם לא יטופל מיד), אנוש (סכנה מיידית, סיכויי הישרדות נמוכים)',
    'ב':'רק שתי דרגות — קל וקשה','ג':'קל, בינוני, קשה בלבד — ללא דרגת "אנוש"','ד':'הדרגות נקבעות אך ורק לפי גיל המטופל'},
  correct:'א',
  explanation:{correct:'סיווג חומרת פציעה כולל ארבע דרגות: קל (אין סכנת חיים), בינוני (יתכן נכות), קשה (סכנת חיים אם לא יטופל מיד), ואנוש (סכנה מיידית, סיכויי הישרדות נמוכים) — סיווג המסייע בקבלת החלטות טיפול ופינוי, במיוחד באר"ן.',
    wrong:'קיימות ארבע דרגות, לא שתיים או שלוש בלבד — "אנוש" היא דרגה מוגדרת ונפרדת; והדרגות נקבעות לפי חומרת הפגיעה בפועל, לא לפי גיל המטופל.'} },

// ================= קבלת החלטות ודיווחים (5) - remaining items already counted above in הטיפול section list; adding true remaining 5 here =================
{ id: 'GC_0302', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'מהן מטרות העזרה הראשונה, לפי העקרונות שנלמדו?',
  multi:false,
  options:{'א':'עצירת הדרדרות, הטבת מצב במידת הניתן, דאגה לפינוי לדרג מתקדם',
    'ב':'ריפוי סופי של המטופל בשטח','ג':'קביעת אבחנה סופית בלבד','ד':'מתן כל תרופה הזמינה בתיק החובש'},
  correct:'א',
  explanation:{correct:'מטרות העזרה הראשונה: עצירת הדרדרות מצב המטופל, הטבת מצבו במידת האפשר, ודאגה לפינוי/העברתו לדרג טיפולי מתקדם יותר — לא ריפוי מלא בשטח.',
    wrong:'ריפוי סופי בשטח אינו מטרת עזרה ראשונה — זה תפקיד בי"ח; קביעת אבחנה סופית דורשת בדיקות שאינן זמינות בשטח; ומתן "כל תרופה זמינה" חורג מסמכות ומעקרונות הטיפול הזהיר.'} },
{ id: 'GC_0303', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים', multi:true,
  question:'אילו מהפעולות הבאות אסורות במסגרת "אל תעשה" בעזרה ראשונה?',
  options:{'א':'לקבוע מוות','ב':'להכות מטופל או לשפוך עליו מים','ג':'לתת תרופות/למרוח משחות מעבר לסמכות','ד':'להזעיק מד"א/משטרה/כיבוי אש כשנדרש'},
  correct:['א','ב','ג'],
  explanation:{correct:'רשימת "אל תעשה" בעזרה ראשונה: אין לקבוע מוות, אין להכות מטופל או לשפוך עליו מים, אין לתת תרופות/למרוח משחות מעבר לסמכות, אין לשחרר ללא המשך טיפול, ואין לחרוג מסמכות.',
    wrong:'הזעקת מד"א/משטרה/כיבוי אש היא בדיוק הפעולה הנכונה והמומלצת כשנדרש — לא פעולה אסורה, אלא חלק מ"לא תעמוד על דם רעך".'} },
{ id: 'GC_0304', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'מהו מקור החובה לטפל, לפי המקורות שנלמדו?',
  multi:false,
  options:{'א':'חוק זכויות החולה, "לא תעמוד על דם רעך", תקנה 146 לחוק התעבורה',
    'ב':'רק תקנון פנימי של מד"א','ג':'אין מקור חוקי כלל, זו רק המלצה מוסרית','ד':'רק חוק אחד ויחיד'},
  correct:'א',
  explanation:{correct:'מקור החובה לטפל נובע משלושה מקורות עיקריים: חוק זכויות החולה, העיקרון המשפטי-מוסרי "לא תעמוד על דם רעך", ותקנה 146 לחוק התעבורה (הנוגעת לחובת סיוע במקרה תאונת דרכים).',
    wrong:'זו אינה רק תקנון פנימי — יש לה עוגן חוקי-חיצוני; אין מדובר בהמלצה מוסרית בלבד — קיימת חובה חוקית מפורשת; ומדובר בשילוב של מספר מקורות, לא חוק יחיד.'} },
{ id: 'GC_0305', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'האם אנמנזה כוללת רק מידע אובייקטיבי, או גם סובייקטיבי?',
  multi:false,
  options:{'א':'כולל גם וגם — מידע סובייקטיבי (תלונות/תחושות) ואובייקטיבי (ממצאים נמדדים)',
    'ב':'רק מידע אובייקטיבי, כמו מדדים נמדדים','ג':'רק מידע סובייקטיבי, כמו תחושות המטופל','ד':'אין הבחנה כזו כלל באנמנזה'},
  correct:'א',
  explanation:{correct:'אנמנזה כוללת גם מידע סובייקטיבי (תלונות ותחושות שהמטופל מדווח, כמו כאב) וגם מידע אובייקטיבי (ממצאים נמדדים/נצפים ע"י המטפל, כמו מדדים חיוניים) — שני הסוגים חיוניים להערכה מלאה.',
    wrong:'אנמנזה אינה מוגבלת רק לאובייקטיבי או רק לסובייקטיבי — היא משלבת את שניהם, ואין להתעלם מאף אחד מהם.'} },
{ id: 'GC_0306', source:'generated', qtype:['concept'], section:'קבלת החלטות ודיווחים',
  question:'בעת כתיבת רשומה רפואית, האם יש לרשום את התלונה העיקרית בדיוק כפי שהתקבלה במוקד, או לפי ממצא בשטח?',
  multi:false,
  options:{'א':'לפי ממצא בשטח — אין להעתיק תלונה כפי שהתקבלה במוקד','ב':'תמיד להעתיק בדיוק את התלונה מהמוקד, ללא שינוי','ג':'אין צורך לתעד תלונה עיקרית כלל','ד':'רק אם המוקד מבקש זאת במפורש'},
  correct:'א',
  explanation:{correct:'יש לרשום את התלונה העיקרית לפי הממצא בפועל בשטח — אין להעתיק אוטומטית את התלונה כפי שהתקבלה במוקד, שכן היא עלולה להיות לא מדויקת, חלקית, או שונה ממה שנמצא בפועל בהערכה הישירה.',
    wrong:'העתקה אוטומטית של תלונת המוקד עלולה להטעות ואינה משקפת בהכרח את המצב האמיתי; תיעוד תלונה עיקרית הוא חובה, לא אופציונלי; והדרישה לדייק לפי ממצא בשטח אינה תלויה בבקשת המוקד.'} },

// ================= additional items to complete distribution =================
{ id: 'GC_0307', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'כאב הוא תחושה סובייקטיבית. כיצד בכל זאת ניתן להעריך אותו בצורה עקבית בשטח?',
  multi:false,
  options:{'א':'שימוש בסולם מספרי (0-10) שהמטופל עצמו מדרג, כחלק ממרכיב Severity ב-OPQRST/SOCRATES',
    'ב':'אי אפשר להעריך כאב בשום צורה, כי הוא סובייקטיבי לחלוטין','ג':'רק ע"י מדידת דופק, ללא צורך בדיווח המטופל','ד':'רק ע"י בדיקת הבעות פנים, ללא כל שאלה מילולית'},
  correct:'א',
  explanation:{correct:'למרות היות הכאב חוויה סובייקטיבית, ניתן להעריך אותו בעקביות יחסית באמצעות סולם מספרי (0-10) שהמטופל מדרג בעצמו — זהו מרכיב ה-Severity הן ב-OPQRST והן ב-SOCRATES, ומאפשר מעקב אחר שינוי בעוצמת הכאב לאורך זמן.',
    wrong:'ניתן להעריך כאב, גם אם לא באופן אובייקטיבי מוחלט; דופק לבדו אינו מודד כאב במדויק (מושפע מגורמים רבים נוספים); והבעות פנים בלבד, ללא שאלה ישירה, אינן שיטת ההערכה המועדפת במטופל שיכול לתקשר.'} },
{ id: 'GC_0308', source:'generated', qtype:['concept'], section:'הטיפול בחולה',
  question:'מה בודקים באישונים בשלב D (מצב הכרה) של סקר הטיפול בחולה, ומה המשמעות של כל ממצא?',
  multi:false,
  options:{'א':'גודל, שוויון, ותגובה לאור; אי-שוויון מעיד על פגיעה נוירולוגית, וסטיית מבט מעידה על פרכוס/שבץ',
    'ב':'רק צבע האישונים, ללא קשר לגודל','ג':'רק אם המטופל בהכרה מלאה ניתן לבדוק אישונים','ד':'אין קשר בין בדיקת אישונים למצב נוירולוגי'},
  correct:'א',
  explanation:{correct:'בבדיקת אישונים בשלב D בודקים גודל, שוויון בין שני האישונים, ותגובה לאור. אי-שוויון בגודל האישונים מעיד על פגיעה נוירולוגית (למשל עלייה חד-צדדית בלחץ תוך-גולגולתי), וסטיית מבט קבועה מעידה על אפשרות פרכוס או שבץ.',
    wrong:'צבע האישונים אינו הפרמטר הנבדק — גודל ותגובה לאור הם המרכזיים; ניתן וצריך לבדוק אישונים גם במחוסרי הכרה, לא רק בהכרה מלאה; וקיים קשר ישיר וחשוב בין בדיקת האישונים למצב הנוירולוגי.'} },
{ id: 'GC_0309', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מהי אחת ההנחות היסודיות בטיפול בטראומה, לגבי יכולת הייצוב בשטח?',
  multi:false,
  options:{'א':'לא ניתן לייצב טראומה קשה בשטח — טיפול דפיניטיבי ניתן רק בבי"ח/חדר ניתוח',
    'ב':'ניתן תמיד לייצב טראומה קשה במלואה בשטח, ללא צורך בבי"ח','ג':'אין צורך בפינוי דחוף בטראומה קשה, הזמן אינו קריטי','ד':'טיפול דפיניטיבי ניתן להשלים תמיד באמבולנס'},
  correct:'א',
  explanation:{correct:'אחת ההנחות היסודיות בטיפול בטראומה היא שלא ניתן לייצב טראומה קשה במלואה בשטח — הטיפול הדפיניטיבי (למשל ניתוח לעצירת דימום פנימי) ניתן רק בבי"ח או בחדר ניתוח, ולכן העבודה בשטח מתמקדת בטיפול מציל חיים והכנה לפינוי מהיר, לא בניסיון "לרפא" את המטופל במקום.',
    wrong:'ההפך הוא הנכון — לא ניתן לייצב טראומה קשה במלואה בשטח; הזמן קריטי ביותר בטראומה קשה (ראו "10 דקות הזהב" ו"שלושת גלי התמותה"); וטיפול דפיניטיבי דורש משאבי בי"ח שאינם זמינים באמבולנס.'} },
{ id: 'GC_0310', source:'generated', qtype:['concept'], section:'טראומה',
  question:'מה כולל הסבב המשלים (השניוני) בטראומה, ומתי הוא מתבצע?',
  multi:false,
  options:{'א':'A-אבטחת נתיב אוויר, B-הערכה+קצב נשימה, C-דופק+ל"ד+עירוי, D-חבישות/קיבועים, E-קיבוע מלא+אנמנזה (SAMPLE) — מתבצע במהלך הפינוי כשאפשר',
    'ב':'מתבצע תמיד לפני הסקר הראשוני','ג':'כולל רק בדיקת מדדים חיוניים, ללא כל דבר נוסף','ד':'אינו נדרש כלל אם הסקר הראשוני תקין'},
  correct:'א',
  explanation:{correct:'הסבב המשלים (השניוני) בטראומה כולל: A-אבטחת נתיב אוויר, B-הערכה וקצב נשימה, C-דופק+ל"ד+שקילת עירוי, D-חבישות/קיבועים (בסדר: כוויות←פצעים←שברים), E-קיבוע מלא ללוח שדרה + אנמנזה (SAMPLE) — ומתבצע במהלך הפינוי, כשהזמן והמצב מאפשרים, ולא במקום הסקר הראשוני.',
    wrong:'הסבב המשלים מגיע אחרי הסקר הראשוני, לא לפניו; הוא כולל הרבה מעבר למדדים חיוניים בלבד; ואינו מתייתר גם אם הסקר הראשוני תקין — הוא מזהה פציעות נוספות שלא נראו בסבב הראשוני המהיר.'} },
{ id: 'GC_0311', source:'generated', qtype:['concept'], section:'החייאה',
  question:'האם מותר לחבר/להפעיל דפיברילטור על מטופל עם דופק?',
  multi:false,
  options:{'א':'לא — אין לחבר דפיברילטור לחולה עם דופק','ב':'כן, זה בטוח לחלוטין תמיד','ג':'רק אם המטופל מבקש זאת','ד':'רק בילדים, לא במבוגרים'},
  correct:'א',
  explanation:{correct:'אין לחבר דפיברילטור למטופל עם דופק — מכשיר הדפיברילציה מיועד לזיהוי וטיפול בהפרעות קצב בנות-שוק בזמן דום לב בלבד, ומתן שוק למטופל עם דופק (ולב פועם באופן מאורגן) עלול לגרום נזק חמור ואף לגרום להפרעת קצב מסכנת חיים.',
    wrong:'זו אינה פעולה בטוחה תמיד — יש לה סיכון ממשי כשמופעלת שלא לצורך; בקשת המטופל אינה משנה את הסיכון הפיזיולוגי; והאיסור חל בכל הגילאים, לא רק בילדים.'} },

  // ---------------- מודול חדש: מענה מד"א בשעת חירום ----------------
  // 10 שאלות מהמצגת: הטיפול בנפגעי זרחנים אורגניים
  { id: 'GC_0312', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו המנגנון הפתופיזיולוגי של הרעלה מזרחן אורגני?',
    options:{'א':'הזרחן האורגני תופס את האנזים אצטיל-כולין-אסטראז (AchE) ומונע פירוק של אצטילכולין, מה שגורם להפעלה מתמשכת של איברי המטרה',
      'ב':'הזרחן האורגני חוסם את שחרור האצטילכולין מהנוירון הפרה-סינפטי',
      'ג':'הזרחן האורגני הורס את קולטני האצטילכולין באיבר המטרה',
      'ד':'הזרחן האורגני מעכב את ייצור האצטילכולין במוח'},
    correct:'א',
    explanation:{correct:'זרחן אורגני תופס את ה-AchE ומונע ממנו לפרק את הקשר בין אצטילכולין לקולטן, כך שאיברי המטרה (בלוטות, שרירים חלקים ושלד) ממשיכים להיות מופעלים ברציפות — זו הסיבה לתמונה הקלינית הקלאסית ("מתכווץ ונוזל").',
      wrong:'הזרחן האורגני אינו פוגע בשחרור האצטילכולין, בקולטנים עצמם או בייצורו במוח — הבעיה היא ספציפית בפירוק הקשר לאחר ההפרשה, דרך עיכוב האנזים המפרק.'} },

  { id: 'GC_0313', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'אילו מהתסמינים הבאים מתאימים לתמונה הקלינית הקלאסית של הרעלת זרחן אורגני?',
    options:{'א':'כיווץ אישונים, הפרשה מוגברת מריריות (דמעת/נזלת/רוק/הזעה), קוצר נשימה ופרכוסים',
      'ב':'הרחבת אישונים, יובש בפה ובעור, עצירות וטכיקרדיה',
      'ג':'חום גבוה, פריחה עורית וכאבי מפרקים',
      'ד':'ירידה בלחץ הדם בלבד ללא סימנים נוספים'},
    correct:'א',
    explanation:{correct:'התמונה הקלאסית ("מתכווץ ונוזל") כוללת כיווץ אישונים, הפרשות מוגברות מכל הריריות, קוצר נשימה עד שיתוק שרירי נשימה, ופרכוסים — תוצאה של גירוי כולינרגי מתמשך.',
      wrong:'הרחבת אישונים ויובש הם תסמינים אנטיכולינרגיים — ההפך המדויק מהתמונה הכולינרגית של הרעלת ז"א; חום/פריחה/מפרקים אינם חלק מהתמונה הטיפוסית; וגם ירידת ל"ד בלבד אינה משקפת את מכלול הסימנים האופייני.'} },

  { id: 'GC_0314', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהי הסיבה השכיחה ביותר למוות בהרעלת זרחן אורגני חמורה?',
    options:{'א':'הפסקת נשימה, כתוצאה משילוב חולשת שרירי נשימה, ריבוי הפרשות בדרכי הנשימה וברונכוספאזם',
      'ב':'דימום פנימי מסיבי',
      'ג':'כשל כלייתי חריף',
      'ד':'חנק כתוצאה מבצקת גרון בלבד'},
    correct:'א',
    explanation:{correct:'הסיבה העיקרית למוות היא הפסקת נשימה, המתפתחת משילוב של חולשת/שיתוק שרירי הנשימה, הפרשות מרובות החוסמות את דרכי הנשימה, וברונכוספאזם. גם פגיעה מוחית (פרכוסים והיפוקסיה) וטראומה משנית לפרכוסים תורמות לתמותה.',
      wrong:'דימום פנימי וכשל כלייתי אינם קשורים למנגנון ההרעלה מז"א; בצקת גרון בלבד אינה המנגנון המרכזי — מדובר בשילוב של כמה גורמים נשימתיים בו-זמנית.'} },

  { id: 'GC_0315', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו פרק הזמן העומד לרשות הצוות הרפואי למתן טיפול באוקסימים לפני "הזדקנות הקשר" (Aging) בין הזרחן האורגני לאנזים, בהרעלה מסוכן הלחימה GD (Soman)?',
    options:{'א':'כ-3 דקות בלבד — חלון זמן קצר בהרבה מ-GA/GB',
      'ב':'כ-6 שעות, זהה לחלוטין ל-GA ו-GB',
      'ג':'כ-24 שעות',
      'ד':'אין הגבלת זמן — אוקסימים יעילים בכל שלב'},
    correct:'א',
    explanation:{correct:'בסוכן GD (Soman) הקשר בין הזרחן האורגני לאנזים "מזדקן" (מתקבע) מהר במיוחד — תוך כ-3 דקות בלבד, בהשוואה לכ-6 שעות בסוכנים GA (Tabun) ו-GB (Sarin). לאחר ההזדקנות, האוקסימים אינם יעילים עוד בפירוק הקשר.',
      wrong:'6 שעות הוא חלון הזמן ב-GA/GB, לא ב-GD; 24 שעות ואי-הגבלת זמן אינם נכונים — ההזדקנות בסומן מהירה ביותר, מה שמקשה טיפולית משמעותית.'} },

  { id: 'GC_0316', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'לפי הפרוטוקול, כיצד מסווגים נפגע "בינוני" לעומת נפגע "קשה" בהרעלת זרחן אורגני?',
    options:{'א':'נפגע בינוני שוכב אך נושם באופן אפקטיבי; נפגע קשה שוכב וזקוק להנשמה',
      'ב':'נפגע בינוני מתהלך; נפגע קשה שוכב, ללא קשר למצב הנשימה',
      'ג':'הסיווג נקבע רק לפי מספר מנות האטרופין שכבר ניתנו',
      'ד':'אין הבדל מהותי — שני הסיווגים מטופלים באותו אופן בדיוק'},
    correct:'א',
    explanation:{correct:'נפגע קל מוגדר כמתהלך. נפגע בינוני שוכב אך נושם אפקטיבית. נפגע קשה שוכב וזקוק להנשמה (ירידה במצב הכרה, קוצר נשימה קשה, הפרעות קצב, ירידת ל"ד, שיתוק שרירים, איבוד שליטה על סוגרים, פרכוסים).',
      wrong:'"מתהלך" הוא הגדרת הנפגע הקל ולא הבינוני; הסיווג אינו נקבע לפי מנות אטרופין שניתנו אלא לפי המצב הקליני; וההבחנה בין הדרגות משפיעה ישירות על עוצמת/תדירות הטיפול.'} },

  { id: 'GC_0317', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהי מטרת מתן האטרופין בטיפול בהרעלת זרחן אורגני, ובאיזו מערכת הוא פועל בעיקר?',
    options:{'א':'אטרופין הוא תרופה אנטי-כולינרגית החוסמת את הפעלת איברי המטרה במערכת הפריפרית',
      'ב':'אטרופין מפרק ישירות את הקשר בין הזרחן האורגני לאנזים AchE',
      'ג':'אטרופין הוא נוגד פרכוסים הפועל אך ורק על המערכת המרכזית',
      'ד':'אטרופין מחליף את פעולת האנזים AchE במקומו'},
    correct:'א',
    explanation:{correct:'אטרופין הוא תרופה אנטי-כולינרגית שחוסמת את קולטני האצטילכולין באיברי המטרה, בעיקר במערכת הפריפרית, ובכך מונעת את התסמינים הכולינרגיים (הפרשות, ברדיקרדיה וכו\') — אך אינה מתקנת את המנגנון הביוכימי עצמו. תיקון הקשר האנזימטי נעשה ע"י אוקסימים (כמו Toxogonin).',
      wrong:'פירוק הקשר בין הזרחן לאנזים הוא תפקידם של האוקסימים, לא של האטרופין; אטרופין אינו נוגד פרכוסים (זהו תפקיד המידזולם); ואינו "מחליף" את פעולת האנזים אלא חוסם את התוצאה הקלינית שלו.'} },

  { id: 'GC_0318', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'הגעת לנפגע ז"א הנמצא שוכב בזירה. כמה מזרקים אוטומטיים (TA) יש לתת לו, ובאיזו שיטה?',
    options:{'א':'שני מזרקים, אחד בכל ירך, ותמיד דרך הבגדים',
      'ב':'מזרק אחד בלבד, ללא קשר לחומרת המצב',
      'ג':'שלושה מזרקים, אחד בכל גפה',
      'ד':'יש להסיר את הבגד לפני ההזרקה, ולתת מזרק אחד בזרוע'},
    correct:'א',
    explanation:{correct:'נפגע שוכב מקבל 2 מזרקים אוטומטיים (אחד לכל ירך), לעומת נפגע מתהלך המקבל מזרק אחד בלבד. ההזרקה מתבצעת דרך הבגדים בירך, ללא צורך בהפשטה מקדימה — חשוב לזכור שמנת TA היא חד-פעמית (לא לחזור עליה).',
      wrong:'מזרק אחד מתאים לנפגע מתהלך, לא שוכב; שלושה מזרקים אינם חלק מהפרוטוקול; ואין צורך להסיר בגד — ההזרקה נעשית במכוון דרך הבגד בירך.'} },

  { id: 'GC_0319', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'נפגע ז"א קיבל מזרק TA וחלפו 15 דקות, אך הוא עדיין סימפטומטי. מה הצעד המתאים?',
    options:{'א':'מתן מזרק Atropine נוסף לפי גיל, וחזרה כל 10-15 דקות כל עוד הוא סימפטומטי',
      'ב':'מתן מזרק TA נוסף מיידית',
      'ג':'אין לתת דבר נוסף — יש להמתין לפינוי לבי"ח בלבד',
      'ד':'מתן שתי מנות TA נוספות בבת אחת'},
    correct:'א',
    explanation:{correct:'מנת ה-TA היא חד-פעמית בלבד לנפגע. אם הנפגע נותר סימפטומטי כעבור 15 דקות, ממשיכים במתן Atropine נוסף (מזרק אחד, לפי מינון גיל) כל 10-15 דקות, כל עוד קיימים סימפטומים.',
      wrong:'אין חוזרים על מנת TA; אי-מתן תרופה נוספת מסכן את הנפגע בהתמשכות התסמינים; ומתן שתי מנות בבת אחת חורג מהפרוטוקול המבוקר.'} },

  { id: 'GC_0320', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'הגעת לנפגע ז"א המסווג כ"קשה" (שוכב, זקוק להנשמה). מהו הצעד הנדרש בפרוטוקול?',
    options:{'א':'מתן מנות חוזרות של אטרופין IV, שקילת מעבר לפרוטוקול הפסקת נשימה מאיימת, ושקילת מתן מידאזולם',
      'ב':'מנה בודדת של אטרופין ובלי מעקב נוסף',
      'ג':'הפניה מיידית לניתוח, ללא טיפול תרופתי מקדים',
      'ד':'מתן חמצן בלבד ללא כל תרופה'},
    correct:'א',
    explanation:{correct:'בנפגע קשה יש לתת מנות חוזרות של אטרופין IV (ללא מינון מקסימלי), לשקול מעבר לפרוטוקול הפסקת נשימה מאיימת, ולשקול מתן מידאזולם כנוגד פרכוסים — תוך המשך ניטור והכנה לפינוי דחוף.',
      wrong:'מנה בודדת אינה מספקת בנפגע קשה; ניתוח אינו חלק מהטיפול הראשוני בהרעלת ז"א; וחמצן בלבד ללא תרופות כולינרגיות-נגדיות אינו מטפל בגורם הבעיה.'} },

  { id: 'GC_0321', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו תפקידן הייחודי של תרופות ה"אוקסימים" (כגון Toxogonin) בטיפול בהרעלת זרחן אורגני, בשונה מאטרופין?',
    options:{'א':'הן מפרקות את הקשר הכימי בין הזרחן האורגני לאנזים AchE, ובכך משחזרות את פעילות האנזים',
      'ב':'הן חוסמות את קולטני האצטילכולין באיברי המטרה, בדיוק כמו אטרופין',
      'ג':'הן משמשות להרגעה ומניעת פרכוסים בלבד',
      'ד':'הן מנטרלות את הזרחן האורגני בדם לפני שהוא מגיע לאנזים'},
    correct:'א',
    explanation:{correct:'בניגוד לאטרופין, שחוסם את התוצאה הקלינית (קולטני האצטילכולין), האוקסימים פועלים ישירות על הבעיה הביוכימית — הם מפרקים את הקשר בין הזרחן האורגני לאנזים AchE ומשחזרים את יכולתו לפרק אצטילכולין. חשוב: יעילותם תלויה בזמן, לפני ש"הקשר מזדקן" (ראו GD מול GA/GB).',
      wrong:'חסימת קולטנים היא פעולת האטרופין, לא האוקסימים; נוגד הפרכוסים הוא מידזולם/TMB4 ולא האוקסימים; והאוקסימים אינם פועלים על הזרחן החופשי בדם אלא על הקשר שכבר נוצר עם האנזים.'} },

  // 10 שאלות מהמצגת: עקרונות במענה למגה אר"ן קונבנציונאלי
  { id: 'GC_0322', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו המאפיין המרכזי המגדיר אירוע "טרור-על", בשונה מאירוע טרור רגיל?',
    options:{'א':'קפיצת מדרגה ממשית ביחס לדפוסי הטרור השוטפים, עם השפעה ישירה על הביטחון הלאומי (למשל הרג המוני, שימוש באמל"ח בלתי קונבנציונלי, פגיעה בתשתיות לאומיות)',
      'ב':'כל אירוע שבו יש יותר מפצוע אחד',
      'ג':'אירוע המתרחש אך ורק בתוך מתקן ביטחוני',
      'ד':'אירוע שבו נעשה שימוש בנשק חם בלבד, ללא קשר להיקפו'},
    correct:'א',
    explanation:{correct:'"טרור-על" מוגדר כאירועי טרור חמורים ביותר המהווים קפיצת מדרגה ממשית ביחס לדפוסי הטרור הנוכחים, ובעלי השפעה ישירה על הביטחון הלאומי — למשל הרג המוני של עשרות/מאות, שימוש אפקטיבי באמל"ח בלתי קונבנציונלי, פגיעה קשה בתשתיות לאומיות, חציית "קווים אדומים", או פגיעה קטלנית באישיות בכירה מאד.',
      wrong:'מספר פצועים גדול מ-1 לבדו אינו מספיק כדי להיחשב "טרור-על"; ההגדרה אינה תלויה במיקום פיזי (מתקן ביטחוני); ואינה תלויה בסוג הנשק (חם דווקא) אלא בהיקף ובעוצמת ההשפעה הלאומית.'} },

  { id: 'GC_0323', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו ההבדל המרכזי במספר הנפגעים בין אירוע אר"ן "רגיל" לבין אירוע מגה אר"ן, לפי הנתונים ההיסטוריים שנסקרו?',
    options:{'א':'אר"ן רגיל — כ-28 עד 100 נפגעים (ממוצע כ-63); מגה אר"ן — מעל 500 נפגעים',
      'ב':'שני סוגי האירועים כוללים בממוצע אותו מספר נפגעים',
      'ג':'אר"ן רגיל תמיד חמור יותר במספר הנפגעים ממגה אר"ן',
      'ד':'מגה אר"ן מוגדר לפי מספר המחבלים בלבד, ללא קשר למספר הנפגעים'},
    correct:'א',
    explanation:{correct:'אר"ן "רגיל" כולל בד"כ 28-100 נפגעים (ממוצע כ-63 לאירוע), עם פינוי הפצוע הדחוף האחרון תוך כ-28 דקות. מגה אר"ן מאופיין במעל 500 נפגעים, כ-130 הרוגים, וזמן פינוי דחופים ארוך משמעותית (כ-1.5-2 שעות).',
      wrong:'ההבדל במספר הנפגעים הוא משמעותי ולא זהה; הנתונים מראים בעליל שמגה אר"ן חמור יותר במספר הנפגעים; וההגדרה תלויה בעיקר בהיקף הנפגעים והזירות, לא רק במספר המחבלים.'} },

  { id: 'GC_0324', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מי אחראי על ניהול האירוע בזירה במגה אר"ן, ומי אחראי על ניהול התגבור והשליטה במשאבים ברמה הארצית?',
    options:{'א':'ניהול האירוע — המוקד המרחבי הטריטוריאלי; ניהול תגבור ושליטה במשאבים — מוקד ארצי',
      'ב':'שני התפקידים מנוהלים אך ורק ע"י המוקד הארצי',
      'ג':'שני התפקידים מנוהלים אך ורק ע"י המוקד המרחבי',
      'ד':'הניהול נעשה בלעדית ע"י גורמי משטרה, ללא מעורבות מוקדי מד"א'},
    correct:'א',
    explanation:{correct:'לפי עקרונות המענה, ניהול האירוע עצמו (בזירה) הוא באחריות המוקד המרחבי הטריטוריאלי, בעוד שניהול התגבור והשליטה במשאבים ברמה הארצית מבוצע ע"י המוקד הארצי, שגם מכריז רשמית על מעבר למגה אר"ן.',
      wrong:'אין ריכוזיות מלאה בידי גורם אחד — יש חלוקת תפקידים ברורה בין הזירה לרמה הארצית; והמענה כולל מעורבות מד"א משמעותית, לא רק גורמי משטרה.'} },

  { id: 'GC_0325', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'עם ההכרזה על מעבר לתפיסת הפעלה של מגה אר"ן, לאילו שני צירים עיקריים מתפצל המענה?',
    options:{'א':'ציר רפואי (טיפול רפואי וליווי נפגעים) וציר אג"מי (תגבור האירוע וארגון השטח)',
      'ב':'ציר תקשורתי בלבד וציר לוגיסטי בלבד',
      'ג':'ציר משפטי וציר כספי',
      'ד':'אין הבדל בין הצירים — הכל מתנהל כגוף אחד ללא חלוקה'},
    correct:'א',
    explanation:{correct:'שינוי תפיסת ההפעלה במגה אר"ן מתפצל לשני צירים מרכזיים: ציר רפואי — טיפול רפואי וליווי הנפגעים, וציר אג"מי — תגבור האירוע וארגון השטח (זירות, כוחות, לוגיסטיקה).',
      wrong:'תקשורת ולוגיסטיקה הם רק חלק מהציר האג"מי, לא צירים נפרדים; אין ציר משפטי/כספי בהגדרת המענה המבצעי; והחלוקה לשני צירים היא מהותית ולא "הכל כגוף אחד".'} },

  { id: 'GC_0326', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'אילו כוחות משוגרים כתגמור, בנוסף למענה האוטומטי הרגיל, עם ההכרזה על מגה אר"ן?',
    options:{'א':'8 אמבולנסים, 2 אט"ן ותאר"ן — בנוסף למתנדבים/כוננים וכוחות נוספים לפי החלטה',
      'ב':'אך ורק אמבולנס בודד נוסף',
      'ג':'אין שינוי כלל בכוחות המשוגרים בין אר"ן רגיל למגה אר"ן',
      'ד':'רק כוחות רפואיים של צה"ל, ללא תגבור אזרחי'},
    correct:'א',
    explanation:{correct:'עם הכרזת מגה אר"ן משוגר תגמור של 8 אמבולנסים, 2 אט"ן ותאר"ן בנוסף למענה האוטומטי, וכן מתנדבים/כוננים עם ערכות כונן, כוחות נוספים לפי החלטה, ורכבי הצלה מאזורים מרוחקים המנותבים ישירות לבתי חולים או לזירה.',
      wrong:'אמבולנס בודד אינו משקף את היקף התגמור הנדרש; יש הבדל מהותי בהיקף הכוחות בין אר"ן רגיל למגה אר"ן; והתגבור כולל כוחות אזרחיים רבים, לא רק כוחות צה"ל.'} },

  { id: 'GC_0327', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו העיקרון המנחה בקביעת יעדי הפינוי לבתי החולים במגה אר"ן?',
    options:{'א':'פינוי נפגעים דחופים לבתי חולים קרובים, נפגעים קלים לבתי חולים מרוחקים, תוך פיזור נפגעים (ללא ביצוע ויסות)',
      'ב':'כל הנפגעים, ללא הבדל חומרה, מפונים לאותו בית חולים אחד קרוב',
      'ג':'אין כל מדיניות סדורה — הבחירה נתונה לשיקול דעת חופשי של כל נהג אמבולנס',
      'ד':'כל הנפגעים מפונים אך ורק במסוקים'},
    correct:'א',
    explanation:{correct:'העיקרון הוא פינוי דחופים לבתי חולים קרובים וקלים לבתי חולים מרוחקים, תוך פיזור הנפגעים בין מוסדות שונים (ולא ריכוזם במקום אחד) כדי לא להעמיס יתר על המידה על בי"ח בודד — מדיניות זו נקבעת ע"י אגף שע"ח/חמ"ל מר"פ, וייתכן גם ייעוד בי"ח ספציפי לזירה באירוע רב-זירתי.',
      wrong:'ריכוז כלל הנפגעים בבי"ח אחד עלול לגרום לקריסת המערכת המקומית; יש מדיניות פינוי מסודרת ולא שיקול דעת אישי חופשי; ופינוי במסוקים הוא רק אחד מהאמצעים (בשיתוף צה"ל), לא הבלעדי.'} },

  { id: 'GC_0328', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו התפקיד העיקרי המוטל על צוותי BLS במגה אר"ן, לפי החלוקה בין ALS ל-BLS?',
    options:{'א':'פינוי נפגעים לא דחופים, ליווי ברמת BLS לפינוי שני נפגעים דחופים באמבולנס, וריכוז/השגחה על נפגעים לא דחופים',
      'ב':'ביצוע מיון שניוני (Triage) בלבד',
      'ג':'ביצוע פעולות חודרניות ומתן תרופות IV',
      'ד':'ניהול הקשר הארצי מול המוקד בלבד'},
    correct:'א',
    explanation:{correct:'צוותי BLS אחראים בעיקר על פינוי נפגעים לא דחופים (כולל באוטובוסים), ליווי ברמת BLS לפינוי שני נפגעים דחופים באמבולנס, וכן ריכוז נפגעים לא דחופים והשגחה עליהם עד לפינוי. מיון שניוני ופעולות חודרניות/תרופתיות הם באחריות צוותי ALS.',
      wrong:'מיון שניוני הוא תפקיד עיקרי של פרמדיקים (ALS), לא BLS; פעולות חודרניות ותרופות IV חורגות מסמכות BLS; וניהול הקשר הארצי אינו תפקיד ספציפי של צוותי BLS בזירה.'} },

  { id: 'GC_0329', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'כיצד מאורגנים פרמדיקים (ALS) בזירת מגה אר"ן, ומהו תפקידם המרכזי?',
    options:{'א':'מתחלקים לגזרות עם פרמדיק אחראי לכל גזרה, מתמקדים ב-TRIAGE, סימון נפגעים ופעולות מצילות חיים, ופועלים אך ורק בשטח האירוע',
      'ב':'כל הפרמדיקים פועלים יחד כקבוצה אחת ללא חלוקה לגזרות',
      'ג':'תפקידם היחיד הוא נהיגת אמבולנסים בין הזירה לבתי החולים',
      'ד':'פרמדיקים אינם נדרשים כלל באירוע מסוג מגה אר"ן'},
    correct:'א',
    explanation:{correct:'פרמדיקים מתחלקים לגזרות, כשבכל גזרה יש פרמדיק אחראי. הם מתרכזים ב-TRIAGE, סימון נפגעים ופעולות מצילות חיים, ובמיון שניוני (כחול/אדום/צהוב/שחור) להעברת הנפגעים הקשים (ובגל השני גם בינוניים) לפי סדר קדימות — ומתפקדים אך ורק בשטח האירוע.',
      wrong:'עבודה ללא חלוקה לגזרות פוגעת ביעילות הטיפול בהיקף גדול; נהיגת אמבולנסים אינה התפקיד המרכזי (זהו תפקיד נהגים/BLS); ופרמדיקים הם דווקא חיוניים ביותר באירוע כזה.'} },

  { id: 'GC_0330', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'כיצד מועברת הודעה על הכרזת מגה אר"ן לכלל מד"א?',
    options:{'א':'הודעות בביפר, המועברות ע"י המוקד הארצי ל"כלל מד"א"',
      'ב':'אך ורק בעל פה מפה לאוזן בין עובדים',
      'ג':'הודעה אינה מועברת כלל, כל תחנה פועלת עצמאית',
      'ד':'רק דרך הודעות SMS פרטיות של כל מפקד תחנה'},
    correct:'א',
    explanation:{correct:'הודעה על הכרזת מגה אר"ן מועברת בביפר ע"י המוקד הארצי, לכלל מד"א, כחלק מעקרונות הקשר של האירוע — זאת לצד גל קשר מנהלתי ארצי ("גל מפקדים – גל 2") ועמדת פינוי נפגעים במוקד המפעיל.',
      wrong:'העברה מפה לאוזן בלבד אינה אמינה/מיידית מספיק לאירוע חירום לאומי; העדר תיאום מרכזי יפגע קשות בתגובה; והודעות SMS פרטיות אינן תחליף למנגנון ההודעה הרשמי הקבוע.'} },

  { id: 'GC_0331', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'אילו גורמים חיצוניים למד"א משתתפים בשיתוף פעולה בזמן מגה אר"ן, לפי המענה המבצעי שנסקר?',
    options:{'א':'אגד (פינוי באוטובוסים), צה"ל (מסוקי פינוי, תאג"דים, צוותי פג"ה, אלונקאים), וגם אמבולנסים פרטיים בהחלטת שגרה',
      'ב':'רק משטרת ישראל, ללא כל גורם נוסף',
      'ג':'רק ארגונים בינלאומיים, ללא גורמים מקומיים',
      'ד':'אין כל שיתוף פעולה חיצוני — מד"א פועל תמיד לבדו'},
    correct:'א',
    explanation:{correct:'שיתופי הפעולה כוללים את אגד (פינוי באוטובוסים עם ליווי, ציוד וקשר), צה"ל (הפעלת מסוקי פינוי לזירה, כוחות רפואה כמו תאג"דים וצוותי פג"ה, כוחות כוננות אג"מיים-אלונקאים), ובנוסף אפשרות לסיוע אמבולנסים פרטיים (כולל ויסות שניוני) בהחלטת מענה לשגרה.',
      wrong:'משטרת ישראל היא גורם חשוב אך לא היחיד; ארגונים בינלאומיים אינם חלק מהמענה המבצעי המקומי שנסקר; ומד"א נשען משמעותית על שיתופי פעולה חיצוניים באירוע בהיקף כזה.'} },

  // 10 שאלות מהמצגת: הפעלת מד"א באירוע טוקסיקולוגי
  { id: 'GC_0332', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהם שלושת המאפיינים המרכזיים המגדירים "אירוע טוקסיקולוגי המוני" (אט"ה)?',
    options:{'א':'אירוע רב-נפגעים עם סימנים דומים בכל הנפגעים (בעיקר גירוי עיניים ודרכי נשימה עליונות), הופעה בו-זמנית בכל קבוצות הגיל באותו תא שטח, וחוסר התאמה בין חומרת הפציעה למנגנון החבלה',
      'ב':'מספיק שיהיה נפגע אחד עם קוצר נשימה כדי להגדיר אט"ה',
      'ג':'אירוע המוגדר אך ורק לפי מספר הנפגעים, ללא קשר לסוג הסימנים',
      'ד':'אירוע שבו כל הנפגעים סובלים דווקא מסימנים שונים זה מזה'},
    correct:'א',
    explanation:{correct:'אט"ה מוגדר כאירוע רב-נפגעים שבו לנפגעים סימנים דומים (בעיקר גירוי עיניים וגירוי דרכי נשימה עליונות), הנפגעים נמצאים באותו תא שטח גיאוגרפי והפגיעה מופיעה בכל קבוצות הגילאים בו-זמנית, וחומרת הפציעה/סימניה אינם תואמים למנגנון החבלה הנראה לעין.',
      wrong:'נפגע בודד עם תסמין אחד אינו מספיק להגדרת אירוע המוני; ההגדרה אינה תלויה במספר בלבד אלא גם באופי הסימנים וחלוקתם; וסימנים דומים (לא שונים) בין הנפגעים הם דווקא מה שמעורר את החשד.'} },

  { id: 'GC_0333', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'הוזעקת לזירה עם מספר נפגעים בעלי תלונות דומות. לפי תהליך ההכרזה על אט"ה, מהו הצעד הראשון שיש לבחון?',
    options:{'א':'האם מדובר באירוע רב-נפגעים? ורק לאחר מכן — האם קיימים סימני חשיפה לחומר מסוכן?',
      'ב':'יש להתחיל ישר בטיפול תרופתי לפני כל הערכה',
      'ג':'יש לבדוק תחילה את זהות הפוגע/מחבל, ורק אח"כ את מספר הנפגעים',
      'ד':'אין תהליך מוגדר — ההחלטה נתונה לשיקול דעת חופשי בלבד'},
    correct:'א',
    explanation:{correct:'תהליך ההכרזה מתחיל בשאלה האם מדובר באירוע רב-נפגעים. אם כן, בוחנים האם קיימים סימני חשיפה לחומר מסוכן אצל הנפגעים (גו"ז קליני) — ובהתאם לתשובה ממשיכים לפי סד"פ אט"ה או לפי תו"ל אר"ן רגיל.',
      wrong:'טיפול תרופתי לא יינתן לפני הערכה מסודרת; זהות התוקף אינה חלק מקריטריון ההכרזה הרפואי; והתהליך כן מוגדר בשלבים ברורים, לא שרירותי.'} },

  { id: 'GC_0334', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהם רדיוסי מעגל הביטחון (מב"ר) המומלצים באירוע אט"ה, בהתאם לסוג השטח?',
    options:{'א':'200 מטר בשטח פתוח, ו-100 מטר מפתחי מבנה סגור',
      'ב':'50 מטר בכל מקרה, ללא הבדל בין שטח פתוח לסגור',
      'ג':'500 מטר בכל מקרה',
      'ד':'אין צורך במעגל ביטחון באירוע טוקסיקולוגי'},
    correct:'א',
    explanation:{correct:'מב"ר מומלץ הוא 200 מטר בשטח פתוח, ו-100 מטר מפתחי מבנה סגור. ההיערכות המבצעית מתבצעת מחוץ למב"ר, במידת האפשר כשהפנים לאירוע והרוח בגב הצוות.',
      wrong:'50 מטר קטן מדי כדי להגן על הצוותים מפני חומר אפשרי בשטח פתוח; 500 מטר אינו הערך המוגדר בפרוטוקול; ומעגל ביטחון הוא עיקרון בטיחות יסודי ולא ניתן לוותר עליו.'} },

  { id: 'GC_0335', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'בזירת אט"ה מגיעים אליך מספר נפגעים מהלכים. כיצד יש לטפל בהם?',
    options:{'א':'לכנס אותם למקום מוגדר בהתחשב בכיוון הרוח, להנחות הסרת שכבת בגדים עליונה וניגוב עור, ולוודא שאינם חוצים את מוקד האירוע',
      'ב':'להשאירם לנוע חופשי בכל הזירה ללא ריכוז',
      'ג':'להעניק להם מיד טיפול חודרני מלא בזירה עצמה',
      'ד':'לפנותם קודם לכל נפגע אחר, ללא קשר לחומרת מצבם היחסית'},
    correct:'א',
    explanation:{correct:'נפגעים מהלכים מכונסים במקום מוגדר תוך התחשבות בכיוון הרוח, מקבלים הנחיה להסיר בגד עליון ולנגב עור בבד נקי/פדים, מוחזקים בהשגחה עד פינוי ברכב לא ייעודי (חלונות פתוחים) עם ליווי, ותוך הקפדה שלא יחצו את מוקד האירוע (למניעת התפשטות זיהום).',
      wrong:'תנועה חופשית ללא ריכוז מסכנת בהתפשטות זיהום ובאובדן מעקב; טיפול חודרני מלא אינו מתאים לנפגע מהלך בזירה מזוהמת; וסדר הקדימות בפינוי אינו אוטומטי לפי "הראשון שהגיע" אלא לפי חומרה וסדר חילוץ מוגדר.'} },

  { id: 'GC_0336', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו סדר קדימות החילוץ הנכון של נפגעים בזירת אט"ה, מההיקף למוקד?',
    options:{'א':'מהלכים (בכריזה) ← מהלכים הזקוקים להנחיה (שרשרת אנושית) ← שוכבים המראים סימני חיים ← שוכבים ללא סימני חיים',
      'ב':'תמיד מתחילים מהמרכז (מוקד האירוע) כלפי חוץ, ללא קשר למצב הנפגע',
      'ג':'הסדר נקבע אך ורק לפי גיל הנפגע',
      'ד':'שוכבים ללא סימני חיים תמיד מחולצים ראשונים'},
    correct:'א',
    explanation:{correct:'סדר החילוץ מההיקף למוקד: תחילה מהלכים (בעזרת כריזה), אחר כך מהלכים הזקוקים להנחיה (שרשרת אנושית), לאחר מכן שוכבים המראים סימני חיים, ולבסוף שוכבים ללא סימני חיים/אובדן צלם אנוש — האחרונים מחולצים ע"י צוותים ב-LEVEL A ולא ע"י צוותי מד"א.',
      wrong:'התחלה מהמרכז כלפי חוץ אינה הגישה המוגדרת — ההיגיון הוא מההיקף (הפחות מסוכן/פשוט יותר לחילוץ) פנימה; גיל אינו קריטריון הקדימות; ושוכבים ללא סימני חיים הם דווקא בעדיפות האחרונה.'} },

  { id: 'GC_0337', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהי רמת המיגון האישי (Level) המשמשת את צוותי מד"א בערכת המיגון (מלט"ק) לאירוע טוקסיקולוגי, וכמה זמן פינוי אפשרי בכל סבב?',
    options:{'א':'LEVEL C, עד 20 דקות לסבב פינוי (עד 2 סבבים)',
      'ב':'LEVEL A, ללא הגבלת זמן',
      'ג':'LEVEL D, ללא כל מיגון נשימתי',
      'ד':'LEVEL B, עד 5 שעות רצוף'},
    correct:'א',
    explanation:{correct:'ערכת המיגון (מלט"ק) של מד"א מבוססת על LEVEL C, ומאפשרת 2 סבבי פינוי של עד 20 דקות כל אחד, לצורך הפשטת נפגעים והצלת נפגעים חיים. חילוץ נפגעים ללא סימני חיים ב-LEVEL A מבוצע ע"י גורמים אחרים, לא צוותי מד"א.',
      wrong:'LEVEL A הוא רמת מיגון גבוהה יותר, המשמשת גורמים אחרים ולא צוותי מד"א; LEVEL D אינו מספק הגנה מפני חומרים מסוכנים; ואין אפשרות לשהייה של שעות רצופות בציוד מיגון בזירה מזוהמת.'} },

  { id: 'GC_0338', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מיהו הגורם האחראי על חילוץ נפגעים בזירת אט"ה, ומהו תפקידו של מד"א בהקשר זה?',
    options:{'א':'אחריות החילוץ עצמו על משטרת ישראל ע"ב יחידות סיור מיוחדות (יס"מ); מד"א מגדיר דחיפות חילוץ, מבצע פעולות מצילות חיים ומזרקים אוטומטיים, ומקצה אמצעי נשיאה לכוחות',
      'ב':'מד"א אחראי בלעדית על כל תהליך החילוץ הפיזי בזירה מזוהמת',
      'ג':'אין כל שיתוף פעולה בין מד"א למשטרה בתחום זה',
      'ד':'כיבוי האש הוא הגורם היחיד המוסמך לחילוץ נפגעים'},
    correct:'א',
    explanation:{correct:'אחריות החילוץ הפיזי מהזירה המזוהמת נתונה למשטרת ישראל דרך יחידות הסיור המיוחדות (יס"מ). מד"א תורם בהגדרת דחיפות החילוץ, ביצוע פעולות מצילות חיים ומתן מזרקים אוטומטיים בהרעלת ז"א, יצירת תמונת מצב רפואית (תמ"צ), סיוע בחילוץ בהתאם ליכולות, והקצאת אמצעי נשיאה.',
      wrong:'מד"א אינו הגורם המוביל בחילוץ הפיזי מהזירה המזוהמת — זו אחריות משטרתית; יש שיתוף פעולה הדוק בין הגורמים; וכיבוי האש הוא שותף חשוב (בייעוץ על החומר) אך לא הגורם הבלעדי לחילוץ נפגעים.'} },

  { id: 'GC_0339', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'אילו סוגי מידע מקבל מד"א מנציגי כיבוי-האש (כב"ה) בחפ"ק האחוד באירוע אט"ה?',
    options:{'א':'מידע על נפגעים ואופי האירוע, זיהוי החומרים המעורבים, הערכת סיכונים ודגשי מיגון, והנחיות לאוכלוסייה',
      'ב':'אך ורק תחזית מזג האוויר',
      'ג':'מידע כספי בלבד על עלויות האירוע',
      'ד':'כב"ה אינו מספק כל מידע למד"א'},
    correct:'א',
    explanation:{correct:'בחפ"ק האחוד מקבל מד"א מכב"ה מידע קריטי: על הנפגעים ואופי האירוע (האם בשליטה, פוטנציאל החמרה), זיהוי ומידע על החומרים המעורבים, הערכת סיכונים (טווחי סיכון ודגשי מיגון), וכן הנחיות לאוכלוסייה הנגזרות מהמלצות כב"ה (ומועברות דרך הגורם הפוקד).',
      wrong:'תחזית מזג אוויר אינה המידע המרכזי המועבר (אף שכיוון רוח רלוונטי); מידע כספי אינו רלוונטי לניהול הזירה בזמן אמת; ושיתוף המידע בין הגורמים הוא הכרחי ומתקיים בפועל.'} },

  { id: 'GC_0340', source:'generated', qtype:['scenario'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'אתה נמצא עם נפגע בתוך שטח מזוהם באט"ה, טרם חולץ. מהי הפעולה הדחופה ביותר לפני כל פעולה טיפולית אחרת?',
    options:{'א':'הרחקת הנפגע מהסביבה המזוהמת — בשטח המזוהם עצמו מבוצעות רק פעולות מצילות חיים דחופות',
      'ב':'מתן טיפול תרופתי מלא בזירה המזוהמת עוד לפני החילוץ',
      'ג':'המתנה לפינוי ישיר לבי"ח ללא כל טיפול בשטח',
      'ד':'הפשטת הנפגע לפני חילוצו מהזירה המזוהמת'},
    correct:'א',
    explanation:{correct:'הפעולה הדחופה ביותר היא הרחקת הנפגע מהסביבה המזוהמת. בשטח מזוהם עצמו מתבצעות רק פעולות מצילות חיים דחופות (כמו מתן מזרקים אוטומטיים בהרעלת ז"א), וטיפול מלא/הפשטה מתבצעים לאחר החילוץ ע"י צוות ממוגן.',
      wrong:'טיפול תרופתי מלא בזירה מזוהמת מסכן את הצוות ומעכב חילוץ; המתנה ללא כל טיפול עלולה לפגוע בנפגע כשיש פעולות מצילות חיים אפשריות; והפשטה מתבצעת לאחר החילוץ, לא לפני, ותמיד ע"י צוות ממוגן.'} },

  { id: 'GC_0341', source:'generated', qtype:['concept'], section:'מענה מד"א בשעת חירום', multi:false,
    question:'מהו הסדר הנכון בסיום פעילות באירוע טוקסיקולוגי, ביחס לצוותי מד"א שפעלו בשטח המזוהם?',
    options:{'א':'שטיפת אנשי הצוות מתבצעת טרם הסרת המיגון, ולאחר מכן מוסר המיגון לפי ההנחיות בפנקס הכיס, ונרשמים פרטי הצוותים שפעלו',
      'ב':'הסרת המיגון מתבצעת קודם, ואז שוטפים את הצוות',
      'ג':'אין צורך בתיעוד כלשהו של הצוותים שפעלו בשטח המזוהם',
      'ד':'ניתן להסיר את המיגון בכל שלב וסדר לפי נוחות הצוות'},
    correct:'א',
    explanation:{correct:'בסיום האירוע יש לשטוף את אנשי הצוות עוד טרם הסרת המיגון (כדי למנוע זיהום עצמי בעת ההסרה), להסיר את המיגון לפי ההנחיות בפנקס הכיס, לרשום רישום מלא של פרטי הצוותים שפעלו באירוע (שימוש במיגון/טיפול בנפגעים/פעילות בשטח מזוהם), ולרכז את הציוד שנעשה בו שימוש לקבלת הנחיות המשך.',
      wrong:'הסרת מיגון לפני שטיפה עלולה לגרום לזיהום עצמי של הצוות; רישום פרטי הצוותים הוא חובה (למעקב רפואי-תעסוקתי אפשרי); וקיים סדר מוגדר ומחייב, לא נוהג חופשי.'} }
];
