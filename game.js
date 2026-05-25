// WHO WANTS TO BE AN AMERICAN — v1.5
// Adds: variant rotation via localStorage, Easy/Medium difficulty (Medium = type the answer).

const LADDER = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];
const SAFE_HAVENS = [4, 9];

const state = {
  difficulty: 'easy',     // 'easy' | 'medium'
  deck: [],
  rung: 0,
  selected: null,
  locked: false,
  eliminated: [],
  lifelines: { fifty: true, phone: true, audience: true },
  review: [],
  current: null,
  currentCorrectText: '',  // for easy mode, the displayed correct option
  currentCorrectIdx: 0,    // index of correct option in the 4 MC choices
};

// ===== Audio =====
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function beep(freq, duration = 0.08, type = 'square', volume = 0.15) {
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain).connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  osc.start(t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.stop(t + duration);
}
function playSequence(notes, gap = 0.1) {
  let t = 0;
  notes.forEach(([f, d]) => {
    setTimeout(() => beep(f, d), t * 1000);
    t += d + gap * 0.3;
  });
}
// ===== Background music (procedural chiptune) =====
// I-V-vi-IV in C major, arpeggiated. Triangle wave for a soft 8-bit feel.
const MUSIC = {
  enabled: true,
  playing: false,
  bus: null,
  step: 0,
  timerId: null,
  pattern: [
    // C major
    261.63, 329.63, 392.00, 329.63,
    // G major
    293.66, 392.00, 493.88, 392.00,
    // A minor
    220.00, 261.63, 329.63, 261.63,
    // F major
    174.61, 220.00, 261.63, 220.00,
  ],
  bass: [
    130.81, 0, 0, 0,   // C3
    98.00,  0, 0, 0,   // G2
    110.00, 0, 0, 0,   // A2
    87.31,  0, 0, 0,   // F2
  ],
  init() {
    ensureAudio();
    if (!this.bus) {
      this.bus = audioCtx.createGain();
      this.bus.gain.value = 0.06;
      this.bus.connect(audioCtx.destination);
    }
  },
  start() {
    if (this.playing || !this.enabled) return;
    this.init();
    this.playing = true;
    const stepMs = 320;
    const tick = () => {
      if (!this.playing) return;
      const i = this.step % this.pattern.length;
      this.note(this.pattern[i], 0.28, 'triangle', 0.45);
      const b = this.bass[i];
      if (b) this.note(b, 0.6, 'square', 0.18);
      this.step++;
    };
    tick();
    this.timerId = setInterval(tick, stepMs);
  },
  stop() {
    this.playing = false;
    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
  },
  note(freq, dur, type, vol) {
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    env.gain.value = 0;
    osc.connect(env).connect(this.bus);
    const t = audioCtx.currentTime;
    env.gain.linearRampToValueAtTime(vol, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },
  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem('wwaa_music', this.enabled ? '1' : '0'); } catch {}
    if (this.enabled) this.start(); else this.stop();
    updateMusicButton();
  },
  loadPref() {
    try {
      const v = localStorage.getItem('wwaa_music');
      if (v === '0') this.enabled = false;
    } catch {}
  },
};

function updateMusicButton() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.textContent = MUSIC.enabled ? '♪ MUSIC: ON' : '♪ MUSIC: OFF';
  btn.classList.toggle('off', !MUSIC.enabled);
}

const SOUND = {
  click:   () => beep(660, 0.04),
  select:  () => beep(880, 0.08),
  lock:    () => playSequence([[523,0.08],[659,0.12]]),
  correct: () => playSequence([[523,0.1],[659,0.1],[784,0.1],[1046,0.2]]),
  wrong:   () => playSequence([[220,0.2],[180,0.3]]),
  win:     () => playSequence([[523,0.12],[659,0.12],[784,0.12],[1046,0.12],[1318,0.4]]),
  intro:   () => playSequence([[392,0.1],[523,0.1],[659,0.1],[784,0.2]]),
  close:   () => playSequence([[440,0.08],[330,0.15]]),
};

// ===== Helpers =====

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, n) { return shuffle(arr).slice(0, n); }
function fmt(n) { return '$' + n.toLocaleString('en-US'); }
function letterOf(i) { return ['A','B','C','D'][i]; }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== String matching (Medium mode) =====

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')                  // drop parenthetical clarifiers — e.g. "nine (9)" -> "nine"
    .replace(/\b(\d+)(st|nd|rd|th)\b/g, '$1')    // "4th" -> "4"
    .replace(/[().,!?;:'"\-–—/]/g, ' ')
    .replace(/\b(the|a|an|of|to|for)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Expand each accepted answer into its canonical variants:
//   "nine (9)"        -> ["nine (9)", "nine", "9"]
//   "(Persian) Gulf War" -> ["(Persian) Gulf War", "Gulf War"]
//   "Thomas Jefferson" -> ["Thomas Jefferson"]   (unchanged)
function expandAccepted(accepted) {
  const out = new Set();
  for (const a of accepted) {
    out.add(a);
    const noParens = a.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (noParens) out.add(noParens);
    const nums = a.match(/\((\d+)\)/g);
    if (nums) for (const n of nums) out.add(n.slice(1, -1));
  }
  return Array.from(out).filter(s => s.length > 0);
}
function acceptedFor(q) {
  if (!q._expanded) q._expanded = expandAccepted(q.accepted);
  return q._expanded;
}

function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = Array.from({length: b.length + 1}, () => []);
  for (let i = 0; i <= b.length; i++) m[i][0] = i;
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i-1] === a[j-1]
        ? m[i-1][j-1]
        : 1 + Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]);
    }
  }
  return m[b.length][a.length];
}
function ratio(a, b) {
  const ml = Math.max(a.length, b.length);
  if (ml === 0) return 1;
  return 1 - lev(a, b) / ml;
}

// Returns one of:
//   { kind: 'exact', target }
//   { kind: 'fuzzy', target }   — accepted, small typo
//   { kind: 'close', target }   — not accepted, but worth a hint
//   { kind: 'miss' }
function matchSingle(userInput, acceptedList) {
  const u = normalize(userInput);
  if (!u) return { kind: 'miss' };
  const uTokens = u.split(' ').filter(Boolean);
  const uIsNumOnly = uTokens.length > 0 && uTokens.every(t => /^\d+$/.test(t));

  // Pass 1: exact normalized equality
  for (const a of acceptedList) {
    if (u === normalize(a)) return { kind: 'exact', target: a };
  }
  // Pass 2: numeric-only user input — match if number appears as a token in accepted
  if (uIsNumOnly) {
    for (const a of acceptedList) {
      const aTokens = normalize(a).split(' ').filter(Boolean);
      if (uTokens.every(t => aTokens.includes(t))) return { kind: 'exact', target: a };
    }
  }
  // Pass 3: token containment
  for (const a of acceptedList) {
    const aTokens = normalize(a).split(' ').filter(Boolean);
    if (!aTokens.length) continue;
    // All accepted tokens present in user (e.g., user "the Speaker of the House" -> "speaker house" matches accepted "speaker house")
    if (aTokens.every(t => uTokens.includes(t))) return { kind: 'exact', target: a };
    // Single-word accepted contained in user (e.g., "Jefferson" inside "Thomas Jefferson")
    if (aTokens.length === 1 && aTokens[0].length >= 4 && uTokens.includes(aTokens[0])) {
      return { kind: 'exact', target: a };
    }
  }
  // Pass 4: fuzzy + close
  let bestFuzzy = null, bestFuzzyR = 0;
  for (const a of acceptedList) {
    const r = ratio(u, normalize(a));
    if (r > bestFuzzyR) { bestFuzzyR = r; bestFuzzy = a; }
  }
  if (bestFuzzyR >= 0.85) return { kind: 'fuzzy', target: bestFuzzy };
  if (bestFuzzyR >= 0.50) return { kind: 'close', target: bestFuzzy };
  return { kind: 'miss' };
}

function matchMulti(userInput, acceptedList, requires) {
  const parts = (userInput || '')
    .split(/[,;\n]|\sand\s|\s&\s|\s\+\s/i)
    .map(p => p.trim())
    .filter(p => p);
  if (!parts.length) return { kind: 'miss' };
  const usedAccepted = new Set();
  const matched = [];
  const unmatched = [];
  for (const part of parts) {
    let foundIdx = -1;
    for (let i = 0; i < acceptedList.length; i++) {
      if (usedAccepted.has(i)) continue;
      const r = matchSingle(part, expandAccepted([acceptedList[i]]));
      if (r.kind === 'exact' || r.kind === 'fuzzy') {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx >= 0) { usedAccepted.add(foundIdx); matched.push(acceptedList[foundIdx]); }
    else unmatched.push(part);
  }
  if (matched.length >= requires) {
    return { kind: 'exact', matched, target: matched.slice(0, requires).join(' and ') };
  }
  return { kind: 'miss', matched, gotCount: matched.length, neededCount: requires };
}

// ===== Rotation tracking (localStorage) =====

const LS_KEY = 'wwaa_used_v1.5';
function loadUsed() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}
function saveUsed(used) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(used)); } catch {}
}

// Per-question "seen" tracker — prefers questions you haven't seen yet when building a deck.
const SEEN_KEY = 'wwaa_seen_questions';
function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveSeen(set) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set))); } catch {}
}
function markSeen(n) {
  const seen = loadSeen();
  seen.add(n);
  saveSeen(seen);
}
function resetSeen() {
  saveSeen(new Set());
  updateCoverageDisplay();
}

function buildDeck(size = 15) {
  let seen = loadSeen();
  // Full coverage achieved — start a fresh cycle so every question is unseen again.
  if (seen.size >= QUESTIONS.length) {
    seen = new Set();
    saveSeen(seen);
  }
  const allIdx = QUESTIONS.map((_, i) => i);
  const unseen = allIdx.filter(i => !seen.has(QUESTIONS[i].n));
  const seenIdx = allIdx.filter(i =>  seen.has(QUESTIONS[i].n));
  if (unseen.length >= size) return shuffle(unseen).slice(0, size);
  return [...shuffle(unseen), ...shuffle(seenIdx).slice(0, size - unseen.length)];
}

function updateCoverageDisplay() {
  const el = document.getElementById('coverage-status');
  if (!el) return;
  const seen = loadSeen();
  const total = QUESTIONS.length;
  const count = Math.min(seen.size, total);
  el.innerHTML = `COVERAGE: <span class="cov-num">${count} / ${total}</span> questions seen this cycle`;
}

// Pick which atomic accepted answer(s) become "correct" this round, rotating across plays.
function pickCorrect(question) {
  const used = loadUsed();
  const key = String(question.n);
  const total = question.accepted.length;
  let usedIdxs = used[key] || [];
  // If we've covered all variants, reset.
  if (usedIdxs.length >= total) usedIdxs = [];
  const remaining = [];
  for (let i = 0; i < total; i++) if (!usedIdxs.includes(i)) remaining.push(i);
  const n = question.requires || 1;
  const picks = pick(remaining.length >= n ? remaining : [...remaining, ...usedIdxs], n);
  used[key] = Array.from(new Set([...usedIdxs, ...picks]));
  saveUsed(used);
  return picks.map(i => question.accepted[i]);
}

function pickDistractors(question, count) {
  return pick(question.distractors, Math.min(count, question.distractors.length));
}

// Combine atomic items for "name N" questions into a single readable string.
function joinItems(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// ===== Splash & difficulty =====

function bindSplash() {
  const start = () => {
    SOUND.intro();
    MUSIC.start();
    document.removeEventListener('keydown', start);
    document.getElementById('splash').removeEventListener('click', start);
    showScreen('difficulty');
    bindDifficulty();
  };
  document.addEventListener('keydown', start);
  document.getElementById('splash').addEventListener('click', start);
}

function bindDifficulty() {
  updateCoverageDisplay();
  document.querySelectorAll('.diff-option').forEach(el => {
    el.addEventListener('click', () => {
      const d = el.dataset.diff;
      if (el.classList.contains('disabled')) { SOUND.wrong(); return; }
      state.difficulty = d;
      SOUND.lock();
      showLoadingThenGame();
    });
  });
  const reset = document.getElementById('reset-coverage');
  if (reset) reset.addEventListener('click', () => {
    SOUND.click();
    resetSeen();
  });
}

function showLoadingThenGame() {
  showScreen('loading');
  const fill = document.querySelector('#loading .fill');
  const label = document.querySelector('#loading .label');
  const messages = state.difficulty === 'medium'
    ? ['LOADING NATURALIZATION.EXE...', 'DISABLING MULTIPLE CHOICE...', 'ARMING KEYBOARD...', 'PREPARING CIVICS GAUNTLET...', 'READY.']
    : ['LOADING NATURALIZATION.EXE...', 'READING USCIS.DAT...', 'INITIALIZING CIVICS MODULE...', 'CALIBRATING FREEDOM...', 'READY.'];
  let pct = 0, msg = 0;
  label.textContent = messages[0];
  const iv = setInterval(() => {
    pct += Math.random() * 12 + 4;
    if (pct >= 100) {
      pct = 100;
      fill.style.width = '100%';
      label.textContent = messages[messages.length - 1];
      clearInterval(iv);
      setTimeout(startGame, 500);
      return;
    }
    fill.style.width = pct + '%';
    const newMsg = Math.min(messages.length - 1, Math.floor(pct / 25));
    if (newMsg !== msg) { msg = newMsg; label.textContent = messages[msg]; beep(440, 0.04); }
  }, 130);
}

// ===== Game start =====

function startGame() {
  state.deck = buildDeck(15);
  state.rung = 0;
  state.lifelines = { fifty: true, phone: true, audience: true };
  state.review = [];
  showScreen('game');
  document.body.dataset.diff = state.difficulty;
  loadQuestion();
}

function loadQuestion() {
  const idx = state.deck[state.rung];
  state.current = QUESTIONS[idx];
  markSeen(state.current.n);
  state.selected = null;
  state.locked = false;
  state.eliminated = [];
  renderLadder();
  if (state.difficulty === 'medium') {
    renderTypeQuestion();
  } else {
    renderMCQuestion();
  }
  renderLifelines();
}

function renderLadder() {
  const wrap = document.getElementById('ladder-list');
  wrap.innerHTML = '';
  for (let i = LADDER.length - 1; i >= 0; i--) {
    const row = document.createElement('div');
    row.className = 'rung';
    if (SAFE_HAVENS.includes(i)) row.classList.add('safe');
    if (i === state.rung) row.classList.add('current');
    if (i < state.rung) row.classList.add('won');
    row.innerHTML = `<span><span class="num">${i+1}</span></span><span>${fmt(LADDER[i])}${SAFE_HAVENS.includes(i)?' ★':''}</span>`;
    wrap.appendChild(row);
  }
}

// ===== Easy: Multiple choice =====

function renderMCQuestion() {
  const q = state.current;
  document.getElementById('q-counter').textContent = `Q ${state.rung + 1} / 15  —  ${fmt(LADDER[state.rung])}  —  EASY`;
  document.getElementById('question-text').textContent = q.q;
  const wrap = document.getElementById('answers');
  wrap.style.display = 'grid';
  document.getElementById('type-input-wrap').style.display = 'none';
  wrap.innerHTML = '';

  // Build 4 options: 1 correct + 3 distractor sets
  const correctItems = pickCorrect(q);
  const correctText = joinItems(correctItems);
  const requires = q.requires || 1;
  const wrongOptions = [];
  // Generate distinct wrong options
  const usedWrongs = new Set();
  let attempts = 0;
  while (wrongOptions.length < 3 && attempts < 30) {
    attempts++;
    const items = pickDistractors(q, requires);
    const s = joinItems(items);
    if (s === correctText) continue;
    if (usedWrongs.has(s)) continue;
    usedWrongs.add(s);
    wrongOptions.push(s);
  }
  // If we couldn't get 3 distinct (small distractor pool), pad with whatever
  while (wrongOptions.length < 3) wrongOptions.push(joinItems(pickDistractors(q, requires)));

  const options = shuffle([correctText, ...wrongOptions]);
  state.currentCorrectText = correctText;
  state.currentCorrectIdx = options.indexOf(correctText);

  options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.innerHTML = `<span class="letter">${letterOf(i)}</span><span>${text}</span>`;
    btn.addEventListener('click', () => chooseMC(i, btn));
    wrap.appendChild(btn);
  });
  document.getElementById('final-prompt').textContent = '';
}

function chooseMC(i, btn) {
  if (state.locked) return;
  if (state.eliminated.includes(i)) return;
  SOUND.select();
  if (state.selected === i) { lockMC(i); return; }
  state.selected = i;
  document.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('final-prompt').textContent = `Selected ${letterOf(i)}. Click again to LOCK IT IN.`;
}

function lockMC(i) {
  state.locked = true;
  document.getElementById('final-prompt').textContent = '';
  revealMC(i);
}

function revealMC(i) {
  const buttons = document.querySelectorAll('.answer');
  const correctIdx = state.currentCorrectIdx;
  const right = i === correctIdx;
  buttons[i].classList.remove('selected');
  buttons[i].classList.add(right ? 'correct' : 'wrong');
  if (!right) buttons[correctIdx].classList.add('correct');
  if (right) SOUND.correct(); else SOUND.wrong();

  state.review.push({
    n: state.current.n,
    q: state.current.q,
    accepted: state.current.accepted,
    chosenText: buttons[i].querySelector('span:last-child').textContent,
    correctText: state.currentCorrectText,
    right,
    note: state.current.note,
  });

  setTimeout(() => showAfterAnswer(right), 1200);
}

// ===== Medium: Type the answer =====

function renderTypeQuestion() {
  const q = state.current;
  document.getElementById('q-counter').textContent = `Q ${state.rung + 1} / 15  —  ${fmt(LADDER[state.rung])}  —  MEDIUM (TYPE IT)`;
  document.getElementById('question-text').textContent = q.q;
  document.getElementById('answers').style.display = 'none';
  const wrap = document.getElementById('type-input-wrap');
  wrap.style.display = 'block';
  const hint = q.requires ? `Type ${q.requires} answers, separated by commas or "and".` : `Type your answer below.`;
  wrap.innerHTML = `
    <div class="type-hint">${hint}</div>
    <input id="type-input" class="type-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${q.requires ? 'e.g., life, liberty' : 'your answer...'}" />
    <button id="type-submit" class="type-submit">SUBMIT</button>
  `;
  const input = document.getElementById('type-input');
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitType();
  });
  document.getElementById('type-submit').addEventListener('click', submitType);
  document.getElementById('final-prompt').textContent = '';
}

function submitType() {
  if (state.locked) return;
  const input = document.getElementById('type-input');
  const val = input.value.trim();
  if (!val) return;
  state.locked = true;
  input.setAttribute('disabled', 'true');
  document.getElementById('type-submit').setAttribute('disabled', 'true');

  const q = state.current;
  const result = q.requires
    ? matchMulti(val, q.accepted, q.requires)
    : matchSingle(val, acceptedFor(q));

  revealType(val, result);
}

function revealType(userVal, result) {
  const q = state.current;
  const right = result.kind === 'exact' || result.kind === 'fuzzy';
  const close = !right && result.kind === 'close';

  if (right) SOUND.correct();
  else if (close) SOUND.close();
  else SOUND.wrong();

  // Build the "correct" string to show (one official answer)
  const officialOne = q.requires
    ? joinItems(q.accepted.slice(0, q.requires))
    : q.accepted[0];

  state.review.push({
    n: q.n,
    q: q.q,
    accepted: q.accepted,
    chosenText: userVal,
    correctText: officialOne,
    right,
    close,
    matchKind: result.kind,
    note: q.note,
  });

  // Show modal with feedback
  const modal = document.getElementById('after-modal');
  modal.classList.add('active');
  let headline, color;
  if (right && result.kind === 'fuzzy') { headline = "CORRECT (with a tiny typo)"; color = 'var(--green)'; }
  else if (right) { headline = "CORRECT!"; color = 'var(--green)'; }
  else if (close) { headline = "CLOSE — BUT NOT QUITE"; color = 'var(--yellow)'; }
  else { headline = "INCORRECT"; color = 'var(--red)'; }

  const acceptedHtml = q.accepted.length > 1
    ? `<div class="note">All acceptable answers: ${q.accepted.map(a=>`<span class="pill">${a}</span>`).join(' ')}</div>`
    : '';
  const closeHint = close
    ? `<p class="hint">You typed "<strong>${userVal}</strong>". USCIS expects "<strong>${result.target}</strong>".</p>`
    : '';
  const partialMulti = (!right && q.requires && result.matched && result.matched.length > 0)
    ? `<p class="note">You got ${result.matched.length} of ${q.requires} needed: ${result.matched.join(', ')}.</p>`
    : '';

  const next = right
    ? (state.rung === LADDER.length - 1 ? 'CLAIM YOUR PRIZE' : 'NEXT QUESTION')
    : 'SEE RESULTS';

  modal.querySelector('.box').innerHTML = `
    <h2 style="color:${color}">${headline}</h2>
    <p><strong>Q${q.n}.</strong> ${q.q}</p>
    <p class="hint">Your answer: ${userVal}</p>
    <p class="hint">Official answer: ${officialOne}</p>
    ${closeHint}
    ${partialMulti}
    ${acceptedHtml}
    ${q.note ? `<p class="note">${q.note}</p>` : ''}
    <button id="after-next">${next}</button>
  `;
  document.getElementById('after-next').addEventListener('click', () => {
    modal.classList.remove('active');
    if (right) {
      if (state.rung === LADDER.length - 1) endGame(true);
      else { state.rung++; loadQuestion(); }
    } else {
      endGame(false);
    }
  });
}

// ===== Shared after-answer (Easy mode) =====

function showAfterAnswer(right) {
  const modal = document.getElementById('after-modal');
  modal.classList.add('active');
  const q = state.current;
  const acceptedHtml = q.accepted.length > 1
    ? `<div class="note">All acceptable answers: ${q.accepted.map(a=>`<span class="pill">${a}</span>`).join(' ')}</div>`
    : '';
  const next = right
    ? (state.rung === LADDER.length - 1 ? 'CLAIM YOUR PRIZE' : 'NEXT QUESTION')
    : 'SEE RESULTS';
  modal.querySelector('.box').innerHTML = `
    <h2 style="color:${right ? 'var(--green)' : 'var(--red)'}">${right ? 'CORRECT!' : 'INCORRECT'}</h2>
    <p><strong>Q${q.n}.</strong> ${q.q}</p>
    <p class="hint">Correct answer: ${state.currentCorrectText}</p>
    ${acceptedHtml}
    ${q.note ? `<p class="note">${q.note}</p>` : ''}
    <button id="after-next">${next}</button>
  `;
  document.getElementById('after-next').addEventListener('click', () => {
    modal.classList.remove('active');
    if (right) {
      if (state.rung === LADDER.length - 1) endGame(true);
      else { state.rung++; loadQuestion(); }
    } else {
      endGame(false);
    }
  });
}

// ===== Lifelines (Easy only) =====

function renderLifelines() {
  const easy = state.difficulty === 'easy';
  document.getElementById('lifeline-row').style.display = easy ? 'flex' : 'none';
  if (!easy) return;
  ['fifty','phone','audience'].forEach(key => {
    const el = document.getElementById('lifeline-' + key);
    if (state.lifelines[key]) el.removeAttribute('disabled');
    else el.setAttribute('disabled', 'true');
  });
}

function useFifty() {
  if (!state.lifelines.fifty) return;
  state.lifelines.fifty = false;
  renderLifelines();
  SOUND.click();
  const correct = state.currentCorrectIdx;
  const wrongs = [0,1,2,3].filter(i => i !== correct);
  const toRemove = shuffle(wrongs).slice(0, 2);
  state.eliminated = toRemove;
  toRemove.forEach(i => {
    const btn = document.querySelectorAll('.answer')[i];
    btn.classList.add('eliminated');
    btn.classList.remove('selected');
    btn.setAttribute('disabled', 'true');
  });
  if (state.selected !== null && toRemove.includes(state.selected)) {
    state.selected = null;
    document.getElementById('final-prompt').textContent = '';
  }
}

function usePhone() {
  if (!state.lifelines.phone) return;
  state.lifelines.phone = false;
  renderLifelines();
  SOUND.click();
  const correct = state.currentCorrectIdx;
  const friendRight = Math.random() < 0.8;
  let guess = correct;
  if (!friendRight) {
    const wrongs = [0,1,2,3].filter(i => i !== correct && !state.eliminated.includes(i));
    guess = wrongs[Math.floor(Math.random() * wrongs.length)] ?? correct;
  }
  const phrases = friendRight
    ? ['pretty sure', "I'd bet on", "almost certain it's", "gotta be"]
    : ['I think maybe', 'not totally sure but', 'my gut says', 'I might be wrong but'];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  showLifelineModal(
    '☎  PHONE A FRIEND',
    `Your friend Ben Franklin says:`,
    `"Hmm... ${phrase} ${letterOf(guess)}."`,
    'Friends are usually right — but not always.'
  );
}

function useAudience() {
  if (!state.lifelines.audience) return;
  state.lifelines.audience = false;
  renderLifelines();
  SOUND.click();
  const correct = state.currentCorrectIdx;
  let pcts = [0,0,0,0];
  const correctPct = 55 + Math.floor(Math.random() * 24);
  pcts[correct] = correctPct;
  let remaining = 100 - correctPct;
  const others = [0,1,2,3].filter(i => i !== correct);
  for (let i = 0; i < others.length - 1; i++) {
    const give = Math.floor(Math.random() * remaining);
    pcts[others[i]] = give;
    remaining -= give;
  }
  pcts[others[others.length - 1]] = remaining;
  state.eliminated.forEach(i => { pcts[i] = 0; });
  const total = pcts.reduce((a,b)=>a+b, 0);
  if (total > 0) pcts = pcts.map(p => Math.round(p * 100 / total));

  const rows = pcts.map((p, i) => `
    <div class="poll-row">
      <span class="poll-letter">${letterOf(i)}</span>
      <div class="poll-bar"><div class="poll-fill" style="width:${p}%"></div></div>
      <span class="poll-pct">${p}%</span>
    </div>
  `).join('');
  showLifelineModal(
    '👥  ASK THE AUDIENCE',
    'The audience has voted:',
    `<div class="poll">${rows}</div>`,
    'The crowd is usually wise. Usually.'
  );
}

function showLifelineModal(title, line1, line2, note) {
  const modal = document.getElementById('lifeline-modal');
  modal.classList.add('active');
  modal.querySelector('.box').innerHTML = `
    <h2>${title}</h2>
    <p>${line1}</p>
    <p class="hint">${line2}</p>
    <p class="note">${note}</p>
    <button onclick="document.getElementById('lifeline-modal').classList.remove('active')">CLOSE</button>
  `;
}

// ===== End =====

function endGame(won) {
  let winnings;
  if (won) {
    winnings = LADDER[LADDER.length - 1];
    SOUND.win();
  } else {
    if (state.rung > SAFE_HAVENS[1]) winnings = LADDER[SAFE_HAVENS[1]];
    else if (state.rung > SAFE_HAVENS[0]) winnings = LADDER[SAFE_HAVENS[0]];
    else winnings = 0;
  }
  const modal = document.getElementById('end-modal');
  modal.classList.add('active');
  const cls = won ? 'end-win' : 'end-lose';
  const reviewHtml = state.review.map(r => `
    <div class="item ${r.right ? 'right' : (r.close ? 'close' : 'miss')}">
      <span class="num">Q${r.n}.</span>${r.q}<br>
      &nbsp;&nbsp;&nbsp;✓ ${r.correctText}
      ${r.accepted.length > 1 ? `<br>&nbsp;&nbsp;&nbsp;<span style="color:var(--gray)">also OK: ${r.accepted.filter(a => a !== r.correctText).slice(0, 4).join(' • ')}${r.accepted.length > 5 ? ' • ...' : ''}</span>` : ''}
      ${!r.right ? `<br>&nbsp;&nbsp;&nbsp;✗ you ${state.difficulty === 'medium' ? 'typed' : 'chose'}: ${r.chosenText}` : ''}
    </div>
  `).join('');
  const rightCount = state.review.filter(r => r.right).length;
  const passNote = rightCount >= 6
    ? `<p class="hint">You got ${rightCount} of ${state.review.length} — that's a PASS on USCIS scoring (6/10).</p>`
    : `<p style="color:var(--red)">You got ${rightCount} of ${state.review.length} — USCIS needs 6 out of 10.</p>`;
  modal.querySelector('.box').innerHTML = `
    <div class="end-screen ${cls}">
      <h2>${won ? '★ YOU ARE AMERICAN ★' : 'GAME OVER'}</h2>
      <p>Difficulty: <strong>${state.difficulty.toUpperCase()}</strong> &nbsp;•&nbsp; You walk away with:</p>
      <div class="winnings">${fmt(winnings)}</div>
      ${passNote}
      <div class="review">${reviewHtml}</div>
      <button onclick="location.reload()">PLAY AGAIN</button>
    </div>
  `;
}

// ===== Bootstrap =====

window.addEventListener('DOMContentLoaded', () => {
  MUSIC.loadPref();
  updateMusicButton();
  bindSplash();
  document.getElementById('lifeline-fifty').addEventListener('click', useFifty);
  document.getElementById('lifeline-phone').addEventListener('click', usePhone);
  document.getElementById('lifeline-audience').addEventListener('click', useAudience);
  document.getElementById('music-toggle').addEventListener('click', () => MUSIC.toggle());
});
