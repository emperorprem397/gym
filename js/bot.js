/* ============================================================
   ELITEFORCE FITNESS — AI GYM ADVISOR BOT
   Goal-based quiz + FAQ + Membership recommender
   Adapted from Naveen Nutrition bot architecture
   Bottom-RIGHT corner. Dark/Red theme.
   ============================================================ */

(function () {

  /* ── INJECT CSS ─────────────────────────────────────────── */
  const css = `
    #ef-bot-fab {
      position: fixed !important;
      bottom: 160px !important;
      right: 24px !important;
      z-index: 2147483640 !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      background: linear-gradient(135deg,#E31C1C,#900000) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 50px !important;
      padding: 11px 18px 11px 13px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 24px rgba(227,28,28,0.5) !important;
      font-family: 'Inter', 'Segoe UI', sans-serif !important;
      animation: efBotBounce 1s ease 3.5s both !important;
      max-width: 230px !important;
      transition: transform 0.2s !important;
    }
    #ef-bot-fab:hover { transform: translateY(-2px) !important; }
    #ef-bot-fab .ef-fab-emoji { font-size: 22px !important; flex-shrink: 0 !important; }
    #ef-bot-fab .ef-fab-txt { display: flex !important; flex-direction: column !important; line-height: 1.25 !important; }
    #ef-bot-fab .ef-fab-title { font-size: 13px !important; font-weight: 700 !important; letter-spacing: 0.3px !important; }
    #ef-bot-fab .ef-fab-sub { font-size: 10px !important; opacity: 0.85 !important; }
    #ef-bot-fab .ef-fab-x { margin-left: auto !important; font-size: 18px !important; opacity: 0.7 !important; padding: 0 2px !important; line-height: 1 !important; }
    #ef-bot-fab .ef-fab-x:hover { opacity: 1 !important; }

    #ef-bot-panel {
      position: fixed !important;
      bottom: 160px !important;
      right: 24px !important;
      z-index: 2147483641 !important;
      width: 345px !important;
      max-height: 590px !important;
      background: #0d0d0d !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(227,28,28,0.3) !important;
      display: none !important;
      flex-direction: column !important;
      overflow: hidden !important;
      font-family: 'Inter', 'Segoe UI', sans-serif !important;
    }
    #ef-bot-panel.ef-open { display: flex !important; animation: efSlideUp 0.3s ease !important; }

    .ef-head {
      background: linear-gradient(135deg,#E31C1C,#7a0000) !important;
      padding: 14px 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-shrink: 0 !important;
    }
    .ef-head-left { display: flex !important; align-items: center !important; gap: 10px !important; }
    .ef-head-emoji { font-size: 26px !important; }
    .ef-head-name { font-size: 14px !important; color: #fff !important; font-weight: 700 !important; letter-spacing: 0.3px !important; line-height: 1.2 !important; }
    .ef-head-status { font-size: 10px !important; color: rgba(255,255,255,0.75) !important; display: flex !important; align-items: center !important; gap: 4px !important; }
    .ef-head-dot { width: 7px !important; height: 7px !important; background: #4cff7a !important; border-radius: 50% !important; display: inline-block !important; animation: efBlink 1.5s infinite !important; }
    .ef-close-btn {
      background: rgba(255,255,255,0.2) !important;
      border: none !important;
      color: #fff !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      font-size: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }
    .ef-close-btn:hover { background: rgba(255,255,255,0.35) !important; }

    .ef-body {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 14px 12px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      background: #0d0d0d !important;
      min-height: 200px !important;
      max-height: 290px !important;
    }
    .ef-body::-webkit-scrollbar { width: 3px !important; }
    .ef-body::-webkit-scrollbar-thumb { background: #E31C1C !important; border-radius: 2px !important; }

    .ef-msg { display: flex !important; gap: 8px !important; align-items: flex-end !important; animation: efMsgIn 0.25s ease !important; }
    .ef-msg.ef-user { flex-direction: row-reverse !important; }
    .ef-bubble {
      max-width: 83% !important;
      padding: 9px 13px !important;
      border-radius: 14px !important;
      font-size: 13px !important;
      line-height: 1.6 !important;
      color: #eee !important;
    }
    .ef-msg.ef-bot .ef-bubble { background: #1c1c1c !important; border-bottom-left-radius: 3px !important; }
    .ef-msg.ef-user .ef-bubble { background: #E31C1C !important; color: #fff !important; border-bottom-right-radius: 3px !important; }
    .ef-icon { font-size: 18px !important; flex-shrink: 0 !important; }

    .ef-typing { display: flex !important; gap: 4px !important; align-items: center !important; padding: 10px 13px !important; background: #1c1c1c !important; border-radius: 14px !important; border-bottom-left-radius: 3px !important; width: fit-content !important; }
    .ef-typing span { width: 7px !important; height: 7px !important; background: #E31C1C !important; border-radius: 50% !important; animation: efDot 1.2s infinite !important; }
    .ef-typing span:nth-child(2) { animation-delay: 0.2s !important; }
    .ef-typing span:nth-child(3) { animation-delay: 0.4s !important; }

    .ef-opts {
      padding: 10px 12px !important;
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 7px !important;
      background: #111 !important;
      border-top: 1px solid rgba(227,28,28,0.15) !important;
      min-height: 54px !important;
      flex-shrink: 0 !important;
    }
    .ef-opt {
      background: #1c1c1c !important;
      border: 1.5px solid rgba(227,28,28,0.2) !important;
      color: #ddd !important;
      padding: 7px 13px !important;
      border-radius: 20px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      font-family: 'Inter','Segoe UI',sans-serif !important;
    }
    .ef-opt:hover, .ef-opt.ef-picked { background: #E31C1C !important; color: #fff !important; border-color: #E31C1C !important; }

    .ef-plan-card {
      background: #181818 !important;
      border: 1.5px solid rgba(227,28,28,0.3) !important;
      border-radius: 10px !important;
      padding: 12px !important;
    }
    .ef-pc-badge { display: inline-block !important; background: #E31C1C !important; color: #fff !important; font-size: 9px !important; font-weight: 700 !important; letter-spacing: 1px !important; padding: 2px 8px !important; border-radius: 3px !important; margin-bottom: 6px !important; }
    .ef-pc-name { font-size: 15px !important; font-weight: 700 !important; color: #fff !important; margin: 4px 0 4px !important; }
    .ef-pc-price { font-size: 20px !important; font-weight: 700 !important; color: #E31C1C !important; margin-bottom: 6px !important; }
    .ef-pc-why { font-size: 11px !important; color: #888 !important; line-height: 1.6 !important; margin-bottom: 8px !important; }
    .ef-pc-call {
      display: inline-flex !important; align-items: center !important; gap: 5px !important;
      background: #E31C1C !important; color: #fff !important; padding: 7px 14px !important;
      border-radius: 5px !important; font-size: 11px !important; font-weight: 700 !important;
      text-decoration: none !important; transition: background 0.2s !important;
    }
    .ef-pc-call:hover { background: #b71414 !important; }

    .ef-foot {
      display: flex !important;
      gap: 8px !important;
      padding: 10px 12px !important;
      background: #111 !important;
      border-top: 1px solid rgba(227,28,28,0.15) !important;
      flex-shrink: 0 !important;
    }
    .ef-restart {
      flex: 1 !important;
      background: #1c1c1c !important;
      border: 1px solid rgba(227,28,28,0.2) !important;
      color: #aaa !important;
      padding: 8px !important;
      border-radius: 6px !important;
      font-size: 11px !important;
      cursor: pointer !important;
      font-family: 'Inter','Segoe UI',sans-serif !important;
    }
    .ef-restart:hover { background: #252525 !important; }
    .ef-wa-link {
      flex: 1 !important;
      background: #25D366 !important;
      color: #fff !important;
      padding: 8px !important;
      border-radius: 6px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      text-decoration: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
    }
    .ef-wa-link:hover { background: #1ebe5d !important; }

    .ef-progress { display: flex !important; gap: 4px !important; padding: 8px 12px !important; background: #111 !important; flex-shrink: 0 !important; border-top: 1px solid rgba(255,255,255,0.04) !important; }
    .ef-prog-dot { height: 3px !important; flex: 1 !important; background: #2a2a2a !important; border-radius: 2px !important; transition: background 0.3s !important; }
    .ef-prog-dot.ef-done { background: #E31C1C !important; }

    .ef-faq-input-wrap {
      display: flex !important; gap: 6px !important;
      padding: 8px 12px !important;
      background: #111 !important;
      border-top: 1px solid rgba(227,28,28,0.12) !important;
      flex-shrink: 0 !important;
    }
    .ef-faq-input {
      flex: 1 !important;
      background: #1c1c1c !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      color: #fff !important;
      padding: 8px 12px !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      font-family: 'Inter','Segoe UI',sans-serif !important;
      outline: none !important;
    }
    .ef-faq-input:focus { border-color: rgba(227,28,28,0.5) !important; }
    .ef-faq-send {
      background: #E31C1C !important; border: none !important; color: #fff !important;
      width: 34px !important; height: 34px !important; border-radius: 8px !important;
      cursor: pointer !important; font-size: 14px !important; flex-shrink: 0 !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
    }

    @keyframes efBotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes efSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes efMsgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes efDot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes efBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    @media(max-width:420px){
      #ef-bot-panel { width: calc(100vw - 20px) !important; right: 10px !important; }
      #ef-bot-fab { right: 10px !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── INJECT HTML ─────────────────────────────────────────── */
  const botHTML = `
    <button id="ef-bot-fab">
      <span class="ef-fab-emoji">🏋️</span>
      <span class="ef-fab-txt">
        <span class="ef-fab-title">AI Gym Advisor</span>
        <span class="ef-fab-sub">Find your perfect plan!</span>
      </span>
      <span class="ef-fab-x" id="ef-fab-x">✕</span>
    </button>

    <div id="ef-bot-panel">
      <div class="ef-head">
        <div class="ef-head-left">
          <span class="ef-head-emoji">⚡</span>
          <div>
            <div class="ef-head-name">EliteForce AI Advisor</div>
            <div class="ef-head-status">
              <span class="ef-head-dot"></span> Online · Free Consultation
            </div>
          </div>
        </div>
        <button class="ef-close-btn" id="ef-close-btn">✕</button>
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
  `;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = botHTML;
  document.body.appendChild(wrapper);

  /* ── MEMBERSHIP PLANS ────────────────────────────────────── */
  const PLANS = {
    basic: {
      name: 'Basic Plan',
      price: '₹999/month',
      badge: 'STARTER',
      why: 'Full gym access, locker room & group cardio classes. Perfect for beginners who want to explore the gym.',
      tel: 'tel:7568521210',
    },
    standard: {
      name: 'Standard Plan',
      price: '₹1,999/month',
      badge: 'MOST POPULAR ⭐',
      why: 'Full gym + all group classes + trainer support + diet consultation. Best all-round value for serious members.',
      tel: 'tel:7568521210',
    },
    premium: {
      name: 'Premium Plan',
      price: '₹3,999/month',
      badge: 'ELITE 🏆',
      why: '1-on-1 personal trainer, custom diet plan, steam bath & all classes. Maximum results, fastest progress.',
      tel: 'tel:7568521210',
    },
  };

  /* ── QUIZ FLOW ────────────────────────────────────────────── */
  const QUIZ = [
    { id: 'goal', q: '💪 What is your main fitness goal?', opts: [
      { l: '🏋️ Build Muscle & Gain Size',       v: 'bulk'      },
      { l: '🔥 Lose Fat & Get Lean',             v: 'cut'       },
      { l: '⚡ Increase Strength & Power',        v: 'strength'  },
      { l: '🏃 Improve Stamina & Endurance',      v: 'endurance' },
      { l: '🧘 General Health & Wellness',        v: 'health'    },
    ]},
    { id: 'level', q: '📅 How long have you been training?', opts: [
      { l: '🌱 Complete Beginner',                v: 'beginner'  },
      { l: '📆 Less than 1 Year',                 v: 'newbie'    },
      { l: '💪 1–3 Years',                        v: 'mid'       },
      { l: '🏆 3+ Years (Advanced)',               v: 'advanced'  },
    ]},
    { id: 'budget', q: '💰 What is your monthly budget?', opts: [
      { l: '💵 Under ₹1,500',                     v: 'low'       },
      { l: '💴 ₹1,500 – ₹2,500',                  v: 'mid'       },
      { l: '💶 ₹2,500 – ₹4,500',                  v: 'high'      },
      { l: '💷 ₹4,500+ (Best results!)',           v: 'premium'   },
    ]},
    { id: 'trainer', q: '🤝 Do you want personal trainer guidance?', opts: [
      { l: '✅ Yes — I want 1-on-1 training',      v: 'yes'       },
      { l: '👥 Group classes are fine for me',     v: 'group'     },
      { l: '🙋 I'll train independently',          v: 'solo'      },
    ]},
  ];

  /* ── FAQ KNOWLEDGE BASE ──────────────────────────────────── */
  const FAQ = [
    { keys: ['timing','time','hour','open','close','schedule'], ans: '⏰ EliteForce Fitness is open <b>Monday to Sunday, 5:00 AM – 11:00 PM</b>. We\'re available every day of the week for your convenience!' },
    { keys: ['fee','price','cost','membership','plan','charge'], ans: '💰 Our membership plans start at just <b>₹999/month</b> (Basic), ₹1,999/month (Standard), and ₹3,999/month (Premium). Call <b>7568521210</b> for the best offer and quarterly discounts!' },
    { keys: ['trial','free','visit','try'], ans: '🎁 Yes! We offer a <b>FREE trial session</b> — no commitment needed. Just call <b>7568521210</b> or WhatsApp us to schedule your visit.' },
    { keys: ['trainer','coach','instructor'], ans: '🏆 We have <b>12 certified trainers</b> with 5–8 years of experience, specialising in strength, fat loss, yoga, Zumba, CrossFit and nutrition.' },
    { keys: ['diet','nutrition','food','meal'], ans: '🥗 All Standard and Premium members get a <b>free personalised diet consultation</b>. Our in-house nutrition coach creates a plan specifically for your goal.' },
    { keys: ['women','female','ladies','girl'], ans: '🌸 Yes! We have a <b>dedicated Women\'s Fitness Zone</b> — fully private, comfortable and staffed with female trainers. Women are always welcome at EliteForce!' },
    { keys: ['location','address','where','direction','map'], ans: '📍 We are located at <b>123 Main Road, Near City Mall, Your City</b>. Call <b>7568521210</b> for exact directions or check the map on this page!' },
    { keys: ['steam','sauna','bath','spa'], ans: '♨️ <b>Steam bath & sauna</b> facilities are available exclusively for <b>Premium Plan members</b>. A great way to recover after intense sessions!' },
    { keys: ['parking','park','bike','car'], ans: '🚗 Yes, we have <b>free parking</b> available for both two-wheelers and four-wheelers right outside the gym.' },
    { keys: ['locker','lock','storage','bag'], ans: '🔒 Locker rooms are available for <b>all members</b>. Keep your belongings safe while you train.' },
    { keys: ['yoga','zumba','dance','aerobic','class'], ans: '🧘 We offer <b>Yoga, Zumba, CrossFit, Cardio & HIIT</b> group classes. Standard and Premium members get access to all group classes.' },
    { keys: ['contact','call','phone','number','reach'], ans: '📞 You can reach us at <b>+91 75685 21210</b>. We\'re also available on <a href="https://wa.me/917568521210" target="_blank" style="color:#25D366;font-weight:700">WhatsApp</a> for quick replies!' },
  ];

  /* ── STATE ────────────────────────────────────────────────── */
  let ans = {}, qIdx = 0, open = false, mode = 'quiz'; // mode: quiz | faq

  /* ── ELEMENTS ─────────────────────────────────────────────── */
  const fab    = document.getElementById('ef-bot-fab');
  const panel  = document.getElementById('ef-bot-panel');
  const body   = document.getElementById('ef-body');
  const opts   = document.getElementById('ef-opts');
  const fabX   = document.getElementById('ef-fab-x');
  const closeB = document.getElementById('ef-close-btn');
  const restart= document.getElementById('ef-restart');

  /* ── EVENTS ───────────────────────────────────────────────── */
  fab.addEventListener('click', function (e) {
    if (e.target === fabX || fabX.contains(e.target)) {
      fab.style.display = 'none'; return;
    }
    toggle();
  });
  closeB.addEventListener('click', toggle);
  restart.addEventListener('click', doRestart);

  function toggle() {
    open = !open;
    panel.classList.toggle('ef-open', open);
    fab.style.display = open ? 'none' : 'flex';
    if (open && qIdx === 0 && Object.keys(ans).length === 0) startBot();
  }

  /* ── BOT START ────────────────────────────────────────────── */
  function startBot() {
    mode = 'quiz';
    addMsg('bot', '👋 Hi! I\'m your <b>EliteForce AI Advisor</b>. I\'ll help you find the perfect membership plan and answer any questions about our gym!');
    setTimeout(() => {
      addMsg('bot', 'I can do <b>2 things</b>:');
      setTimeout(() => {
        opts.innerHTML = '';
        addOpt('🎯 Find my perfect plan', () => { opts.innerHTML=''; askQ(0); });
        addOpt('❓ Ask a question', () => { opts.innerHTML=''; showFaqMode(); });
      }, 600);
    }, 700);
  }

  /* ── FAQ MODE ─────────────────────────────────────────────── */
  function showFaqMode() {
    mode = 'faq';
    updateProgress(0);
    addMsg('bot', '💬 Go ahead — type your question about timings, membership, facilities, trainers, or anything else!');
    showFaqInput();
  }

  function showFaqInput() {
    // Inject text input into opts area
    opts.innerHTML = `
      <div class="ef-faq-input-wrap" style="width:100%">
        <input class="ef-faq-input" id="ef-faq-inp" type="text" placeholder="e.g. What are your timings?" />
        <button class="ef-faq-send" id="ef-faq-send">➤</button>
      </div>
    `;
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
        setTimeout(() => {
          addMsg('bot', 'Anything else I can help with?');
          opts.innerHTML = '';
          addOpt('🎯 Find my plan', () => { opts.innerHTML=''; doRestart(); });
          addOpt('📞 Call us', () => window.open('tel:7568521210'));
          addOpt('💬 WhatsApp', () => window.open('https://wa.me/917568521210'));
          showFaqInput();
        }, 400);
      } else {
        addMsg('bot', '🤔 I\'m not sure about that one! For the best answer, contact us directly:');
        opts.innerHTML = '';
        addOpt('📞 Call 7568521210', () => window.open('tel:7568521210'));
        addOpt('💬 WhatsApp', () => window.open('https://wa.me/917568521210'));
        addOpt('🔄 Try again', () => { opts.innerHTML=''; showFaqInput(); });
      }
      scrollBot();
    }, 800);
  }

  /* ── QUIZ FLOW ─────────────────────────────────────────────── */
  function askQ(i) {
    qIdx = i;
    if (i >= QUIZ.length) { showResult(); return; }
    updateProgress(i);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg('bot', `<b>Q${i+1} of ${QUIZ.length}</b><br>${QUIZ[i].q}`);
      renderOpts(QUIZ[i].opts, i);
      scrollBot();
    }, 650);
  }

  function renderOpts(options, qI) {
    opts.innerHTML = '';
    options.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'ef-opt';
      btn.textContent = o.l;
      btn.onclick = () => pick(qI, o, btn);
      opts.appendChild(btn);
    });
  }

  function pick(qI, o, btn) {
    document.querySelectorAll('.ef-opt').forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
    btn.classList.add('ef-picked'); btn.style.opacity = '1';
    ans[QUIZ[qI].id] = o.v;
    addMsg('user', o.l);
    setTimeout(() => { opts.innerHTML = ''; askQ(qI + 1); }, 400);
  }

  /* ── PLAN RECOMMENDATION ──────────────────────────────────── */
  function getRec() {
    const { goal, level, budget, trainer } = ans;

    // Premium triggers
    if (trainer === 'yes' || budget === 'premium') return PLANS.premium;

    // Budget-forced basic
    if (budget === 'low') return PLANS.basic;

    // Goal-based
    if (goal === 'bulk' || goal === 'strength') {
      return (level === 'advanced' || budget === 'high') ? PLANS.premium : PLANS.standard;
    }
    if (goal === 'cut') {
      return budget === 'high' ? PLANS.premium : PLANS.standard;
    }
    if (goal === 'endurance' || goal === 'health') {
      return trainer === 'group' ? PLANS.standard : PLANS.basic;
    }

    return PLANS.standard;
  }

  function showResult() {
    updateProgress(QUIZ.length);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg('bot', '🎉 <b>Analysis complete!</b> Based on your answers, here\'s my recommendation:');
      const plan = getRec();
      setTimeout(() => {
        addPlanCard(plan);
        setTimeout(() => {
          addMsg('bot', '📞 Call or WhatsApp us to join at the best price — we often have quarterly discounts!');
          opts.innerHTML = '';
          const wa = `Hi! I used the AI Advisor on your website. I'm interested in the ${plan.name} at EliteForce Fitness.`;
          addOpt('📞 Call Now', () => window.open('tel:7568521210'));
          addOpt(`💬 WhatsApp`, () => window.open(`https://wa.me/917568521210?text=${encodeURIComponent(wa)}`));
          addOpt('🔄 Try Again', () => doRestart());
          scrollBot();
        }, 400);
      }, 350);
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
        <a href="${plan.tel}" class="ef-pc-call">📞 Call to Join</a>
      </div>`;
    body.appendChild(div);
    scrollBot();
  }

  /* ── HELPERS ──────────────────────────────────────────────── */
  function addMsg(type, html) {
    const div = document.createElement('div');
    div.className = `ef-msg ef-${type}`;
    div.innerHTML = type === 'bot'
      ? `<span class="ef-icon">⚡</span><div class="ef-bubble">${html}</div>`
      : `<div class="ef-bubble">${html}</div>`;
    body.appendChild(div);
    scrollBot();
  }

  function addOpt(label, fn) {
    const btn = document.createElement('button');
    btn.className = 'ef-opt'; btn.textContent = label;
    btn.onclick = fn; opts.appendChild(btn);
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ef-msg ef-bot'; div.id = 'ef-typing';
    div.innerHTML = '<span class="ef-icon">⚡</span><div class="ef-typing"><span></span><span></span><span></span></div>';
    body.appendChild(div); scrollBot();
  }
  function removeTyping() { const t = document.getElementById('ef-typing'); if (t) t.remove(); }
  function scrollBot() { setTimeout(() => { body.scrollTop = body.scrollHeight; }, 60); }
  function updateProgress(i) {
    for (let j = 0; j < QUIZ.length; j++) {
      const d = document.getElementById(`ef-p${j}`);
      if (d) d.classList.toggle('ef-done', j < i);
    }
  }

  function doRestart() {
    ans = {}; qIdx = 0; mode = 'quiz';
    body.innerHTML = ''; opts.innerHTML = '';
    updateProgress(0);
    startBot();
  }

  /* ── AUTO SHOW FAB after 5s ───────────────────────────────── */
  fab.style.display = 'none';
  setTimeout(() => { fab.style.display = 'flex'; }, 5000);

})();
