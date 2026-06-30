/* ============================================================
   ELITEFORCE FITNESS — AI GYM ADVISOR BOT v2
   FIXED: positioning, visibility, z-index conflicts
   Goal-based quiz + FAQ + Membership recommender
   ============================================================ */

(function () {

  /* ── INJECT CSS ──────────────────────────────────────────── */
  const css = `
    /* ── FAB button — LEFT side to avoid WA/Call conflict ── */
    #ef-bot-fab {
      position: fixed !important;
      bottom: 24px !important;
      left: 24px !important;
      z-index: 9000 !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      background: linear-gradient(135deg, #E31C1C, #900000) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 50px !important;
      padding: 12px 20px 12px 14px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 28px rgba(227,28,28,0.55) !important;
      font-family: 'Inter', 'Segoe UI', sans-serif !important;
      max-width: 220px !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    #ef-bot-fab:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 10px 36px rgba(227,28,28,0.65) !important;
    }
    #ef-bot-fab .ef-fab-emoji  { font-size: 22px !important; flex-shrink: 0 !important; }
    #ef-bot-fab .ef-fab-txt   { display: flex !important; flex-direction: column !important; line-height: 1.25 !important; }
    #ef-bot-fab .ef-fab-title { font-size: 13px !important; font-weight: 700 !important; letter-spacing: 0.3px !important; white-space: nowrap !important; }
    #ef-bot-fab .ef-fab-sub   { font-size: 10px !important; opacity: 0.82 !important; white-space: nowrap !important; }
    #ef-bot-fab .ef-fab-x     { margin-left: 6px !important; font-size: 16px !important; opacity: 0.65 !important; padding: 0 2px !important; line-height: 1 !important; flex-shrink: 0 !important; }
    #ef-bot-fab .ef-fab-x:hover { opacity: 1 !important; }

    /* ── Panel — LEFT side matching FAB ── */
    #ef-bot-panel {
      position: fixed !important;
      bottom: 86px !important;
      left: 24px !important;
      z-index: 9001 !important;
      width: 340px !important;
      max-height: 580px !important;
      background: #0d0d18 !important;
      border-radius: 18px !important;
      border: 1px solid rgba(227,28,28,0.3) !important;
      box-shadow: 0 24px 64px rgba(0,0,0,0.75) !important;
      display: none !important;
      flex-direction: column !important;
      overflow: hidden !important;
      font-family: 'Inter', 'Segoe UI', sans-serif !important;
    }
    #ef-bot-panel.ef-open {
      display: flex !important;
      animation: efSlideUp 0.28s cubic-bezier(.22,1,.36,1) !important;
    }

    /* ── Header ── */
    .ef-head {
      background: linear-gradient(135deg, #E31C1C, #7a0000) !important;
      padding: 14px 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-shrink: 0 !important;
    }
    .ef-head-left   { display: flex !important; align-items: center !important; gap: 10px !important; }
    .ef-head-emoji  { font-size: 24px !important; }
    .ef-head-name   { font-size: 14px !important; color: #fff !important; font-weight: 700 !important; line-height: 1.2 !important; }
    .ef-head-status { font-size: 10px !important; color: rgba(255,255,255,0.72) !important; display: flex !important; align-items: center !important; gap: 4px !important; margin-top: 2px !important; }
    .ef-head-dot    { width: 6px !important; height: 6px !important; background: #4cff7a !important; border-radius: 50% !important; display: inline-block !important; animation: efBlink 1.4s infinite !important; }
    .ef-close-btn   {
      background: rgba(255,255,255,0.18) !important;
      border: none !important; color: #fff !important;
      width: 28px !important; height: 28px !important;
      border-radius: 50% !important; cursor: pointer !important;
      font-size: 13px !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      flex-shrink: 0 !important; transition: background 0.2s !important;
    }
    .ef-close-btn:hover { background: rgba(255,255,255,0.32) !important; }

    /* ── Progress dots ── */
    .ef-progress {
      display: flex !important; gap: 5px !important;
      padding: 8px 14px !important;
      background: #111120 !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      flex-shrink: 0 !important;
    }
    .ef-prog-dot { height: 3px !important; flex: 1 !important; background: #2a2a3a !important; border-radius: 3px !important; transition: background 0.3s !important; }
    .ef-prog-dot.ef-done { background: #E31C1C !important; }

    /* ── Chat body ── */
    .ef-body {
      flex: 1 !important; overflow-y: auto !important;
      padding: 12px 12px 8px !important;
      display: flex !important; flex-direction: column !important; gap: 9px !important;
      background: #0d0d18 !important;
      max-height: 280px !important;
      min-height: 120px !important;
    }
    .ef-body::-webkit-scrollbar { width: 3px !important; }
    .ef-body::-webkit-scrollbar-thumb { background: #E31C1C !important; border-radius: 2px !important; }

    /* ── Messages ── */
    .ef-msg     { display: flex !important; gap: 7px !important; align-items: flex-end !important; animation: efMsgIn 0.22s ease !important; }
    .ef-msg.ef-user { flex-direction: row-reverse !important; }
    .ef-bubble  {
      max-width: 84% !important; padding: 9px 13px !important;
      border-radius: 14px !important; font-size: 13px !important;
      line-height: 1.58 !important; color: #ddd !important;
    }
    .ef-msg.ef-bot  .ef-bubble { background: #1c1c2e !important; border-bottom-left-radius: 3px !important; border: 1px solid rgba(255,255,255,0.06) !important; }
    .ef-msg.ef-user .ef-bubble { background: #E31C1C !important; color: #fff !important; border-bottom-right-radius: 3px !important; }
    .ef-icon { font-size: 18px !important; flex-shrink: 0 !important; }

    /* ── Typing ── */
    .ef-typing { display: flex !important; gap: 4px !important; align-items: center !important; padding: 10px 14px !important; background: #1c1c2e !important; border-radius: 14px !important; border-bottom-left-radius: 3px !important; width: fit-content !important; border: 1px solid rgba(255,255,255,0.06) !important; }
    .ef-typing span { width: 7px !important; height: 7px !important; background: #E31C1C !important; border-radius: 50% !important; animation: efDot 1.1s infinite !important; }
    .ef-typing span:nth-child(2) { animation-delay: 0.18s !important; }
    .ef-typing span:nth-child(3) { animation-delay: 0.36s !important; }

    /* ── Option chips ── */
    .ef-opts {
      padding: 10px 12px !important;
      display: flex !important; flex-wrap: wrap !important; gap: 6px !important;
      background: #111120 !important;
      border-top: 1px solid rgba(255,255,255,0.05) !important;
      min-height: 50px !important; flex-shrink: 0 !important;
    }
    .ef-opt {
      background: #1c1c2e !important;
      border: 1.5px solid rgba(227,28,28,0.22) !important;
      color: #ccc !important; padding: 7px 13px !important;
      border-radius: 20px !important; font-size: 12px !important;
      font-weight: 500 !important; cursor: pointer !important;
      transition: all 0.18s !important;
      font-family: 'Inter','Segoe UI',sans-serif !important;
      line-height: 1.3 !important;
    }
    .ef-opt:hover, .ef-opt.ef-picked { background: #E31C1C !important; color: #fff !important; border-color: #E31C1C !important; }

    /* ── Plan recommendation card ── */
    .ef-plan-card {
      background: #181828 !important;
      border: 1.5px solid rgba(227,28,28,0.35) !important;
      border-radius: 12px !important; padding: 14px !important;
      width: 100% !important;
    }
    .ef-pc-badge  { display: inline-block !important; background: #E31C1C !important; color: #fff !important; font-size: 9px !important; font-weight: 700 !important; letter-spacing: 1px !important; padding: 3px 9px !important; border-radius: 4px !important; margin-bottom: 7px !important; }
    .ef-pc-name   { font-size: 16px !important; font-weight: 700 !important; color: #fff !important; margin-bottom: 4px !important; }
    .ef-pc-price  { font-size: 22px !important; font-weight: 700 !important; color: #E31C1C !important; margin-bottom: 7px !important; }
    .ef-pc-why    { font-size: 12px !important; color: #888 !important; line-height: 1.6 !important; margin-bottom: 10px !important; }
    .ef-pc-call   {
      display: inline-flex !important; align-items: center !important; gap: 6px !important;
      background: #E31C1C !important; color: #fff !important;
      padding: 8px 16px !important; border-radius: 6px !important;
      font-size: 12px !important; font-weight: 700 !important;
      text-decoration: none !important; transition: background 0.2s !important;
    }
    .ef-pc-call:hover { background: #b71414 !important; }

    /* ── Footer actions ── */
    .ef-foot {
      display: flex !important; gap: 7px !important;
      padding: 9px 12px !important;
      background: #111120 !important;
      border-top: 1px solid rgba(255,255,255,0.05) !important;
      flex-shrink: 0 !important;
    }
    .ef-restart {
      flex: 1 !important; background: #1c1c2e !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      color: #888 !important; padding: 8px !important;
      border-radius: 8px !important; font-size: 11px !important;
      cursor: pointer !important; font-family: 'Inter','Segoe UI',sans-serif !important;
      transition: background 0.2s !important;
    }
    .ef-restart:hover { background: #252535 !important; }
    .ef-wa-link {
      flex: 1 !important; background: #25D366 !important; color: #fff !important;
      padding: 8px !important; border-radius: 8px !important;
      font-size: 11px !important; font-weight: 600 !important;
      text-decoration: none !important;
      display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important;
      transition: background 0.2s !important;
    }
    .ef-wa-link:hover { background: #1ebe5d !important; }

    /* ── FAQ input row ── */
    .ef-faq-row {
      display: flex !important; gap: 6px !important;
      padding: 9px 12px !important;
      background: #111120 !important;
      border-top: 1px solid rgba(255,255,255,0.05) !important;
      flex-shrink: 0 !important;
    }
    .ef-faq-inp {
      flex: 1 !important; background: #1c1c2e !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      color: #fff !important; padding: 8px 12px !important;
      border-radius: 8px !important; font-size: 12px !important;
      font-family: 'Inter','Segoe UI',sans-serif !important; outline: none !important;
    }
    .ef-faq-inp:focus { border-color: rgba(227,28,28,0.5) !important; }
    .ef-faq-inp::placeholder { color: #555 !important; }
    .ef-faq-send {
      background: #E31C1C !important; border: none !important; color: #fff !important;
      width: 34px !important; height: 34px !important; border-radius: 8px !important;
      cursor: pointer !important; font-size: 14px !important; flex-shrink: 0 !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      transition: background 0.2s !important;
    }
    .ef-faq-send:hover { background: #b71414 !important; }

    /* ── Keyframes ── */
    @keyframes efSlideUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes efMsgIn    { from { opacity:0; transform:translateY(7px); }  to { opacity:1; transform:translateY(0); } }
    @keyframes efDot      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes efBlink    { 0%,100%{opacity:1} 50%{opacity:0.25} }

    @media (max-width: 420px) {
      #ef-bot-panel { width: calc(100vw - 20px) !important; left: 10px !important; }
      #ef-bot-fab   { left: 10px !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.id = 'ef-bot-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── INJECT HTML ─────────────────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="ef-bot-fab" aria-label="Open AI Gym Advisor">
      <span class="ef-fab-emoji">🏋️</span>
      <span class="ef-fab-txt">
        <span class="ef-fab-title">AI Gym Advisor</span>
        <span class="ef-fab-sub">Find your perfect plan!</span>
      </span>
      <span class="ef-fab-x" id="ef-fab-x" aria-label="Dismiss">✕</span>
    </button>

    <div id="ef-bot-panel" role="dialog" aria-label="EliteForce AI Advisor">
      <div class="ef-head">
        <div class="ef-head-left">
          <span class="ef-head-emoji">⚡</span>
          <div>
            <div class="ef-head-name">EliteForce AI Advisor</div>
            <div class="ef-head-status"><span class="ef-head-dot"></span> Online · Free Consultation</div>
          </div>
        </div>
        <button class="ef-close-btn" id="ef-close-btn" aria-label="Close chat">✕</button>
      </div>
      <div class="ef-progress" id="ef-progress">
        <div class="ef-prog-dot" id="ef-p0"></div>
        <div class="ef-prog-dot" id="ef-p1"></div>
        <div class="ef-prog-dot" id="ef-p2"></div>
        <div class="ef-prog-dot" id="ef-p3"></div>
      </div>
      <div class="ef-body" id="ef-body"></div>
      <div class="ef-opts" id="ef-opts"></div>
      <div class="ef-foot">
        <button class="ef-restart" id="ef-restart">🔄 Start Over</button>
        <a class="ef-wa-link" href="https://wa.me/917568521210?text=Hi! I need help choosing a membership at EliteForce Fitness." target="_blank">💬 WhatsApp</a>
      </div>
    </div>
  `);

  /* ── MEMBERSHIP DATA ─────────────────────────────────────── */
  const PLANS = {
    basic: {
      name: 'Basic Plan', price: '₹999/month', badge: 'STARTER',
      why: 'Full gym access, locker room & group cardio classes. Great for beginners exploring the gym at their own pace.',
    },
    standard: {
      name: 'Standard Plan', price: '₹1,999/month', badge: 'MOST POPULAR ⭐',
      why: 'Full gym + all group classes + trainer support + diet consultation. Best all-round value for serious members.',
    },
    premium: {
      name: 'Premium Plan', price: '₹3,999/month', badge: 'ELITE 🏆',
      why: '1-on-1 personal trainer, custom diet plan, steam bath & all classes. Maximum results, fastest transformation.',
    },
  };

  /* ── QUIZ STEPS ──────────────────────────────────────────── */
  const QUIZ = [
    { id: 'goal', q: '💪 What is your main fitness goal?', opts: [
      { l: '🏋️ Build Muscle & Gain Size', v: 'bulk' },
      { l: '🔥 Lose Fat & Get Lean',      v: 'cut' },
      { l: '⚡ Increase Strength & Power', v: 'strength' },
      { l: '🏃 Improve Stamina',           v: 'endurance' },
      { l: '🧘 General Health & Wellness', v: 'health' },
    ]},
    { id: 'level', q: '📅 How long have you been training?', opts: [
      { l: '🌱 Complete Beginner',   v: 'beginner' },
      { l: '📆 Less than 1 Year',    v: 'newbie' },
      { l: '💪 1–3 Years',           v: 'mid' },
      { l: '🏆 3+ Years (Advanced)', v: 'advanced' },
    ]},
    { id: 'budget', q: '💰 Your monthly budget?', opts: [
      { l: '💵 Under ₹1,500',          v: 'low' },
      { l: '💴 ₹1,500 – ₹2,500',       v: 'mid' },
      { l: '💶 ₹2,500 – ₹4,500',       v: 'high' },
      { l: '💷 ₹4,500+ (Best results)', v: 'premium' },
    ]},
    { id: 'trainer', q: '🤝 Do you want a personal trainer?', opts: [
      { l: '✅ Yes — 1-on-1 training',    v: 'yes' },
      { l: '👥 Group classes are fine',   v: 'group' },
      { l: '🙋 I\'ll train independently', v: 'solo' },
    ]},
  ];

  /* ── FAQ KNOWLEDGE BASE ──────────────────────────────────── */
  const FAQ = [
    { keys: ['timing','time','hour','open','close','schedule','when'], ans: '⏰ We are open <b>Monday to Sunday, 5:00 AM – 11:00 PM</b> — every single day of the year!' },
    { keys: ['fee','price','cost','membership','plan','charge','rate'], ans: '💰 Plans start at <b>₹999/month</b> (Basic), ₹1,999/month (Standard), ₹3,999/month (Premium). Call <b>7568521210</b> for quarterly/annual discounts!' },
    { keys: ['trial','free','visit','try','test'], ans: '🎁 Yes! We offer a <b>FREE trial session</b> — no commitment. Call <b>7568521210</b> or WhatsApp us to schedule yours today.' },
    { keys: ['trainer','coach','instructor','staff'], ans: '🏆 We have <b>12 certified trainers</b> with 5–8 years experience in strength, fat loss, yoga, Zumba, CrossFit and nutrition.' },
    { keys: ['diet','nutrition','food','meal','eating'], ans: '🥗 Standard and Premium members get a <b>free personalised diet consultation</b> with our in-house nutrition coach.' },
    { keys: ['women','female','ladies','girl','sister'], ans: '🌸 Yes! We have a <b>dedicated Women\'s Fitness Zone</b> — fully private with female trainers. Women are always welcome!' },
    { keys: ['location','address','where','direction','map','place'], ans: '📍 <b>123 Main Road, Near City Mall, Your City</b>. Call <b>7568521210</b> for directions or check the map on this page!' },
    { keys: ['steam','sauna','bath','spa','recovery'], ans: '♨️ <b>Steam bath & sauna</b> are available exclusively for <b>Premium Plan members</b> — great for post-workout recovery!' },
    { keys: ['parking','park','bike','car','vehicle'], ans: '🚗 Yes! <b>Free parking</b> is available for both two-wheelers and four-wheelers right outside the gym.' },
    { keys: ['locker','lock','storage','bag','belongings'], ans: '🔒 <b>Locker rooms</b> are available for all members. Keep your belongings secure while you train.' },
    { keys: ['yoga','zumba','dance','aerobic','class','group','hiit','crossfit'], ans: '🧘 We offer <b>Yoga, Zumba, CrossFit, Cardio & HIIT</b> group classes. Standard and Premium members get full access.' },
    { keys: ['contact','call','phone','number','reach','whatsapp'], ans: '📞 Call or WhatsApp us at <b>+91 75685 21210</b>. Our team responds quickly to all enquiries!' },
    { keys: ['equipment','machine','weights','dumbbell','barbell'], ans: '🏋️ We have <b>top-of-the-line equipment</b> — full free weights section, cables, machines for every muscle group, and a dedicated cardio zone.' },
    { keys: ['ac','air','cool','temperature','condition'], ans: '❄️ Yes! The entire gym is <b>fully air-conditioned</b> for a comfortable workout experience all year round.' },
  ];

  /* ── STATE ───────────────────────────────────────────────── */
  let ans = {}, qIdx = 0, isOpen = false, mode = 'quiz';

  /* ── ELEMENTS ────────────────────────────────────────────── */
  const fab      = document.getElementById('ef-bot-fab');
  const panel    = document.getElementById('ef-bot-panel');
  const body     = document.getElementById('ef-body');
  const opts     = document.getElementById('ef-opts');
  const fabX     = document.getElementById('ef-fab-x');
  const closeBtn = document.getElementById('ef-close-btn');
  const restart  = document.getElementById('ef-restart');

  /* ── EVENTS ──────────────────────────────────────────────── */
  fab.addEventListener('click', function (e) {
    // If X button clicked, dismiss FAB
    if (e.target === fabX || fabX.contains(e.target)) {
      fab.style.display = 'none';
      return;
    }
    togglePanel();
  });
  closeBtn.addEventListener('click', togglePanel);
  restart.addEventListener('click', doRestart);

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('ef-open', isOpen);
    fab.style.display = isOpen ? 'none' : 'flex';
    if (isOpen && !body.hasChildNodes()) startBot();
  }

  /* ── BOT START ───────────────────────────────────────────── */
  function startBot() {
    mode = 'quiz';
    updateProgress(0);
    addMsg('bot', '👋 Hi! I\'m your <b>EliteForce AI Fitness Advisor</b>. I help you find the perfect membership plan and answer questions about our gym!');
    setTimeout(() => {
      addMsg('bot', 'What would you like to do?');
      setTimeout(() => {
        opts.innerHTML = '';
        addOpt('🎯 Find my perfect plan', () => { opts.innerHTML = ''; askQuiz(0); });
        addOpt('❓ Ask a question',       () => { opts.innerHTML = ''; showFaqMode(); });
      }, 500);
    }, 750);
  }

  /* ── FAQ MODE ────────────────────────────────────────────── */
  function showFaqMode() {
    mode = 'faq';
    updateProgress(0);
    addMsg('bot', '💬 Ask me anything — timings, membership, facilities, trainers, parking, diet and more!');
    setTimeout(() => renderFaqInput(), 300);
  }

  function renderFaqInput() {
    opts.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'ef-faq-row';
    row.innerHTML = `
      <input class="ef-faq-inp" id="ef-faq-inp" type="text" placeholder="Type your question..." autocomplete="off" />
      <button class="ef-faq-send" id="ef-faq-send" aria-label="Send">➤</button>
    `;
    // We put this in the opts area
    opts.appendChild(row);
    const inp  = document.getElementById('ef-faq-inp');
    const send = document.getElementById('ef-faq-send');
    inp.focus();
    const doSend = () => {
      const q = inp.value.trim();
      if (!q) return;
      addMsg('user', q);
      inp.value = '';
      handleFaq(q);
    };
    send.addEventListener('click', doSend);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSend(); });
  }

  function handleFaq(q) {
    showTyping();
    const lower = q.toLowerCase();
    const match = FAQ.find(f => f.keys.some(k => lower.includes(k)));
    setTimeout(() => {
      removeTyping();
      if (match) {
        addMsg('bot', match.ans);
      } else {
        addMsg('bot', '🤔 I\'m not sure about that one! Our team can answer everything:');
      }
      setTimeout(() => {
        opts.innerHTML = '';
        addOpt('📞 Call Us',       () => window.open('tel:7568521210'));
        addOpt('💬 WhatsApp',      () => window.open('https://wa.me/917568521210'));
        addOpt('🎯 Find my plan',  () => { opts.innerHTML = ''; doRestart(); });
        // Also re-show FAQ input below the chips
        const row = document.createElement('div');
        row.className = 'ef-faq-row';
        row.innerHTML = `<input class="ef-faq-inp" id="ef-faq-inp" type="text" placeholder="Ask another question..." autocomplete="off" /><button class="ef-faq-send" id="ef-faq-send">➤</button>`;
        opts.appendChild(row);
        const inp  = document.getElementById('ef-faq-inp');
        const send = document.getElementById('ef-faq-send');
        const doSend2 = () => { const q2 = inp.value.trim(); if (!q2) return; addMsg('user', q2); inp.value = ''; handleFaq(q2); };
        send.addEventListener('click', doSend2);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSend2(); });
        scrollBot();
      }, 300);
    }, 850);
  }

  /* ── QUIZ FLOW ───────────────────────────────────────────── */
  function askQuiz(i) {
    qIdx = i;
    if (i >= QUIZ.length) { showResult(); return; }
    updateProgress(i);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg('bot', `<b>Question ${i + 1} of ${QUIZ.length}</b><br>${QUIZ[i].q}`);
      renderQuizOpts(QUIZ[i].opts, i);
      scrollBot();
    }, 650);
  }

  function renderQuizOpts(options, qI) {
    opts.innerHTML = '';
    options.forEach(o => {
      const btn = document.createElement('button');
      btn.className   = 'ef-opt';
      btn.textContent = o.l;
      btn.onclick = () => pickOpt(qI, o, btn);
      opts.appendChild(btn);
    });
  }

  function pickOpt(qI, o, btn) {
    document.querySelectorAll('.ef-opt').forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
    btn.classList.add('ef-picked'); btn.style.opacity = '1';
    ans[QUIZ[qI].id] = o.v;
    addMsg('user', o.l);
    setTimeout(() => { opts.innerHTML = ''; askQuiz(qI + 1); }, 380);
  }

  /* ── RECOMMENDATION LOGIC ────────────────────────────────── */
  function getRec() {
    const { goal, budget, trainer } = ans;
    if (trainer === 'yes' || budget === 'premium') return PLANS.premium;
    if (budget === 'low') return PLANS.basic;
    if (goal === 'bulk' || goal === 'strength') return budget === 'high' ? PLANS.premium : PLANS.standard;
    if (goal === 'cut') return budget === 'high' ? PLANS.premium : PLANS.standard;
    if (trainer === 'group') return PLANS.standard;
    return PLANS.standard;
  }

  function showResult() {
    updateProgress(QUIZ.length);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg('bot', '✅ <b>Analysis done!</b> Based on your answers, here\'s your ideal plan:');
      const plan = getRec();
      setTimeout(() => {
        addPlanCard(plan);
        setTimeout(() => {
          addMsg('bot', '📞 Call or WhatsApp us to join — we often have special quarterly deals!');
          opts.innerHTML = '';
          const waText = encodeURIComponent(`Hi! I used the AI Advisor on your website. I'm interested in the ${plan.name} at EliteForce Fitness.`);
          addOpt('📞 Call to Join', () => window.open('tel:7568521210'));
          addOpt('💬 WhatsApp',     () => window.open(`https://wa.me/917568521210?text=${waText}`));
          addOpt('🔄 Try Again',    () => doRestart());
          scrollBot();
        }, 350);
      }, 300);
    }, 1000);
  }

  function addPlanCard(plan) {
    const div = document.createElement('div');
    div.className = 'ef-msg ef-bot';
    div.innerHTML = `
      <span class="ef-icon">⚡</span>
      <div class="ef-plan-card">
        <div class="ef-pc-badge">${plan.badge}</div>
        <div class="ef-pc-name">${plan.name}</div>
        <div class="ef-pc-price">${plan.price}</div>
        <div class="ef-pc-why">${plan.why}</div>
        <a href="tel:7568521210" class="ef-pc-call">📞 Call to Join</a>
      </div>`;
    body.appendChild(div);
    scrollBot();
  }

  /* ── HELPERS ─────────────────────────────────────────────── */
  function addMsg(type, html) {
    const div = document.createElement('div');
    div.className = `ef-msg ef-${type}`;
    if (type === 'bot') {
      div.innerHTML = `<span class="ef-icon">⚡</span><div class="ef-bubble">${html}</div>`;
    } else {
      div.innerHTML = `<div class="ef-bubble">${html}</div>`;
    }
    body.appendChild(div);
    scrollBot();
  }

  function addOpt(label, fn) {
    const btn = document.createElement('button');
    btn.className   = 'ef-opt';
    btn.textContent = label;
    btn.onclick     = fn;
    opts.appendChild(btn);
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ef-msg ef-bot'; div.id = 'ef-typing-indicator';
    div.innerHTML = '<span class="ef-icon">⚡</span><div class="ef-typing"><span></span><span></span><span></span></div>';
    body.appendChild(div); scrollBot();
  }
  function removeTyping() { const t = document.getElementById('ef-typing-indicator'); if (t) t.remove(); }

  function scrollBot() { setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50); }

  function updateProgress(step) {
    for (let i = 0; i < QUIZ.length; i++) {
      const dot = document.getElementById(`ef-p${i}`);
      if (dot) dot.classList.toggle('ef-done', i < step);
    }
  }

  function doRestart() {
    ans = {}; qIdx = 0; mode = 'quiz';
    body.innerHTML = ''; opts.innerHTML = '';
    updateProgress(0);
    startBot();
  }

})();
