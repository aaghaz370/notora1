// ===== Main Page Book Loading =====
    const categories = [
        "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance", "Horror", "Fantasy", 
        "Coding",  "Business", "CBSE", "ICSE", "10th", "11th", "12th", "Spiritual", "Comics"
    ];
    const categoryContainer = document.getElementById("categoryContainer");

    async function loadCategory(category) {
        try {
            const res = await fetch(`data/${category}.json`);
            if (!res.ok) return; // Skip if a category file doesn't exist
            const books = await res.json();
            
            const section = document.createElement("div");
            section.className = "category-section";

            const title = document.createElement("h3");
            title.className = "category-title";
            title.textContent = category;

            const wrapper = document.createElement("div");
            wrapper.style.position = 'relative';

            const slider = document.createElement("div");
            slider.className = "book-slider";

            books.slice(0, 30).forEach(book => {
                const card = document.createElement("div");
                card.className = "book-card";
                card.innerHTML = `
                    <img src="${book.thumbnail}" alt="${book.name}" />
                    <div class="book-title">${book.name}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-genre">${book.genre}</div>
                    <div class="book-rating">⭐ ${book.rating}</div>
                `;
                // When a card is clicked, save the book data and go to book.html
                card.addEventListener("click", () => {
                    localStorage.setItem("selectedBook", JSON.stringify(book));
                    window.location.href = "book.html";
                });
                slider.appendChild(card);
            });

            const leftArrow = document.createElement("button");
            leftArrow.className = "arrow-btn arrow-left";
            leftArrow.innerHTML = "&#8249;";
            leftArrow.onclick = () => slider.scrollBy({ left: -300, behavior: 'smooth' });

            const rightArrow = document.createElement("button");
            rightArrow.className = "arrow-btn arrow-right";
            rightArrow.innerHTML = "&#8250;";
            rightArrow.onclick = () => slider.scrollBy({ left: 300, behavior: 'smooth' });

            wrapper.appendChild(leftArrow);
            wrapper.appendChild(slider);
            wrapper.appendChild(rightArrow);

            section.appendChild(title);
            section.appendChild(wrapper);
            categoryContainer.appendChild(section);
        } catch (error) {
            console.error(`Failed to load category: ${category}`, error);
        }
    }

    categories.forEach(loadCategory);

    // ===== Search Logic =====
    const openSearch = document.getElementById("openSearch");
const searchOverlay = document.getElementById("searchOverlay");
const closeOverlay = document.getElementById("closeOverlay");
const overlaySearchInput = document.getElementById("overlaySearchInput");
const searchResults = document.getElementById("searchResults");

let allBooks = [];

async function loadAllBooksOnce() {
  try {
    const res = await fetch("data/All.json");
    const extraBooks = await res.json();
    allBooks = extraBooks;
  } catch (e) {
    console.error("Failed to load All.json", e);
  }
}

openSearch.addEventListener("click", async () => {
  document.getElementById("mainContent").style.display = "none";
  searchOverlay.classList.remove("hidden");
  if (allBooks.length === 0) await loadAllBooksOnce();
});

closeOverlay.addEventListener("click", () => {
  searchOverlay.classList.add("hidden");
  document.getElementById("mainContent").style.display = "block";
  overlaySearchInput.value = "";
  searchResults.innerHTML = "";
});

overlaySearchInput.addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  searchResults.innerHTML = "";
  if (query.trim() === "") return;

  let results = [];

  // Load from categories
  for (const cat of categories) {
    try {
      const res = await fetch(`data/${cat}.json`);
      const books = await res.json();
      results = results.concat(books);
    } catch {}
  }

  // Add from All.json if not already included
  results = results.concat(allBooks);

  const filtered = results.filter(book =>
    book.name.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.genre.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    // Only one no-result div
    const noResult = document.createElement("div");
    noResult.className = "no-result";
    noResult.textContent = "No results found";
    searchResults.appendChild(noResult);
  } else {
    filtered.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${book.thumbnail}" alt="${book.name}" />
        <div class="book-title">${book.name}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-genre">${book.genre}</div>
        <div class="book-rating">⭐ ${book.rating}</div>
      `;
      card.addEventListener("click", () => openModal(book));
      searchResults.appendChild(card);
    });
  }
});

profileIcon.addEventListener("click", () => {
  window.location.href = "profile.html";
});



    
   
    
    // ===== Badge System =====
    const badgeIcon = document.querySelector(".badge-icon");
    const badgePanel = document.getElementById("badgePanel");
    const closeBadge = document.getElementById("closeBadge");
    const badgeReadCount = document.getElementById("badgeReadCount");
    const badgeCircle = document.getElementById("badgeCircle");
    const badgeFill = document.getElementById("badgeFill");
    const badgeLevelText = document.getElementById("badgeLevelText");

    const LEVELS = [
        { level: 1, target: 10 }, { level: 2, target: 50 },
        { level: 3, target: 100 }, { level: 4, target: 200 },
        { level: 5, target: 700 }
    ];

    function updateBadge() {
        const read = parseInt(localStorage.getItem("readCount") || "0");
        let currentLevel = 0;
        let nextTarget = LEVELS[0].target;
        
        for (const levelInfo of LEVELS) {
            if (read >= levelInfo.target) {
                currentLevel = levelInfo.level;
            }
        }
        
        const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
        nextTarget = nextLevelInfo ? nextLevelInfo.target : LEVELS[LEVELS.length-1].target;

        const prevTarget = LEVELS.find(l => l.level === currentLevel)?.target || 0;
        const progressInLevel = read - prevTarget;
        const levelRange = nextTarget - prevTarget;
        const percent = Math.min((progressInLevel / levelRange) * 100, 100);

        badgeReadCount.textContent = `${read} books read`;
        badgeCircle.textContent = `Level ${currentLevel}`;
        badgeFill.style.width = `${percent}%`;

        if (currentLevel >= 5) {
            badgeLevelText.textContent = "🔥 Max Level Reached! You're a Master Reader!";
        } else {
            badgeLevelText.textContent = `Read ${nextTarget - read} more books for Level ${currentLevel + 1}`;
        }
    }

    badgeIcon.addEventListener("click", () => {
        badgePanel.classList.remove("hidden");
        updateBadge();
    });

    closeBadge.addEventListener("click", () => {
        badgePanel.classList.add("hidden");
    });

    // Initial load
    updateBadge();
;


window.addEventListener('load', () => {
    const audio = document.getElementById('notify-sound');
    audio.play().catch(() => {}); // In case user hasn't interacted yet
  });

  function closeNotice() {
    const banner = document.getElementById('notice');
    banner.style.display = 'none';
  }


  profileIcon.addEventListener("click", () => {
  window.location.href = "profile.html";
});


// clock
(function(){
  // ---------- Config ----------
  const DEFAULT_MIN = 25;
  const STORAGE_KEY = "es_timer_v1";
  const WEEK_KEY = "es_timer_week_start_v1";

  // ---------- DOM ----------
  const overlay = document.getElementById("overlay");
  const floating = document.getElementById("floatingClock");
  const miniTime = document.getElementById("miniTime");
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const presetEls = document.querySelectorAll(".preset-item");
  const statSessions = document.getElementById("statSessions");
  const statThisWeek = document.getElementById("statThisWeek");
  const statGoalPerc = document.getElementById("statGoalPerc");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const dailyGoalInput = document.getElementById("dailyGoal");
  const notifyToggle = document.getElementById("notifyToggle");

  const viewTimerBtn = document.getElementById("viewTimerBtn");
  const viewGraphBtn = document.getElementById("viewGraphBtn");
  const timerBlock = document.getElementById("timerBlock");
  const graphBlock = document.getElementById("graphBlock");
  const graphRangeLabel = document.getElementById("graphRange");
  const weekRange = document.getElementById("weekRange");
  const monthRange = document.getElementById("monthRange");
  const focusCanvas = document.getElementById("focusChart");
  const miniCanvas = document.getElementById("miniChart");
  const historyList = document.getElementById("historyList");
  const recentSessions = document.getElementById("recentSessions");
  const rightWeekTotal = document.getElementById("rightWeekTotal");
  const rightMonthTotal = document.getElementById("rightMonthTotal");
  const rightSessions = document.getElementById("rightSessions");
  const exportBtn = document.getElementById("exportBtn");
  const clearBtn = document.getElementById("clearBtn");
  const overlayModal = document.querySelector(".ts-modal");

  // ---------- state ----------
  let state = {
    // runtime
    secondsLeft: DEFAULT_MIN * 60,
    running: false,
    endTime: null,
    // data
    sessions: [], // {duration:min, timestamp:ms}
    dailyProgress: {}, // 'YYYY-MM-DD' : minutes
    weeklyTotals: {}, // weekStart(ms): totalMin
    monthlyTotals: {}, // 'YYYY-MM' : totalMin
    totalSessions: 0,
    // settings
    dailyGoal: parseInt(dailyGoalInput.value || 60, 10),
    notify: false,
  };

  // ---------- helpers ----------
  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch(e){ console.warn("Storage failed",e); }
  }
  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){ Object.assign(state, JSON.parse(raw)); }
    }catch(e){ console.warn("Storage read failed", e); }
    // migrate or ensure keys:
    if(!state.sessions) state.sessions = [];
    if(!state.dailyProgress) state.dailyProgress = {};
    if(!state.weeklyTotals) state.weeklyTotals = {};
    if(!state.monthlyTotals) state.monthlyTotals = {};
    state.dailyGoal = parseInt(state.dailyGoal || dailyGoalInput.value || 60, 10);
    state.notify = !!state.notify;
  }
  function formatTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
  function getTodayKey(){ const d=new Date(); return d.toISOString().slice(0,10); }
  function getWeekStart(ts){
    const d = ts? new Date(ts) : new Date();
    // compute Monday as week start for consistent rotate (or use user's preference)
    const day = d.getDay(); // 0 Sun .. 6 Sat
    const diff = (day + 6) % 7; // days since Monday
    d.setDate(d.getDate() - diff);
    d.setHours(0,0,0,0);
    return d.getTime();
  }
  function getMonthKey(ts){
    const d = ts? new Date(ts) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  // ---------- persistence with weekly rotation ----------
  function ensureWeeklyRotation(){
    const storedWeek = localStorage.getItem(WEEK_KEY);
    const currentWeek = getWeekStart();
    if(!storedWeek){
      localStorage.setItem(WEEK_KEY, String(currentWeek));
      return;
    }
    const weekNum = parseInt(storedWeek,10);
    if(weekNum !== currentWeek){
      // rotate: remove data older than 8 weeks (keep history in sessions though), but keep monthly
      localStorage.setItem(WEEK_KEY, String(currentWeek));
      // Optionally remove weeklyTotals older than this week to keep small
      Object.keys(state.weeklyTotals).forEach(k=>{
        if(parseInt(k,10) < currentWeek - (1000*60*60*24*7*8)) delete state.weeklyTotals[k];
      });
      save();
    }
  }

  // ---------- UI update ----------
  function refreshUI(){
    // timer display
    timerDisplay.textContent = formatTime(state.secondsLeft);
    miniTime.textContent = formatTime(state.secondsLeft);

    // stats compute
    const todayKey = getTodayKey();
    const todayMin = (state.dailyProgress[todayKey] || 0);
    const weekStart = getWeekStart();
    const weekTotal = Object.keys(state.dailyProgress).reduce((acc,k)=>{
      const d = new Date(k);
      if(getWeekStart(d.getTime()) === weekStart) return acc + (state.dailyProgress[k]||0);
      return acc;
    },0);

    const monthKey = getMonthKey();
    const monthTotal = Object.keys(state.dailyProgress).reduce((acc,k)=>{
      const mk = k.slice(0,7);
      if(mk === monthKey) return acc + (state.dailyProgress[k]||0);
      return acc;
    },0);

    statSessions.textContent = state.totalSessions || 0;
    statThisWeek.textContent = `${Math.round(weekTotal/60)}h`;
    rightWeekTotal.textContent = `${weekTotal} min`;
    rightMonthTotal.textContent = `${monthTotal} min`;
    rightSessions.textContent = `${state.totalSessions||0}`;

    // progress
    const goal = parseInt(state.dailyGoal,10) || 60;
    const pct = Math.min(100, Math.round((todayMin/goal) * 100));
    progressFill.style.width = pct + "%";
    progressLabel.textContent = `${todayMin}/${goal} min`;
    statGoalPerc.textContent = `${pct}%`;

    // history lists
    renderHistory();
    drawMiniChart();
    drawFocusChart(currGraphRange);
  }

  function renderHistory(){
    // recent sessions (last 20)
    const rec = state.sessions.slice().reverse().slice(0,20);
    recentSessions.innerHTML = rec.map(s=>{
      const dt = new Date(s.timestamp);
      const t = dt.toLocaleString();
      return `<div class="session-item"><div class="left">${s.duration} min • ${s.note || 'focus'}</div><div class="right">${t}</div></div>`;
    }).join('') || '<div style="color:var(--muted);padding:12px;border-radius:8px">No sessions yet — start a focus session to track progress.</div>';

    // history small (for graph detail)
    historyList.innerHTML = state.sessions.slice().reverse().slice(0,40).map(s=>{
      const dt=new Date(s.timestamp);
      return `<div class="session-item"><div class="left">${s.duration} min</div><div class="right">${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></div>`;
    }).join('');
  }

  // ---------- timer runtime ----------
  let tickInterval = null;
  function startTimer(minutes){
    if(typeof minutes === 'number' && minutes > 0) state.secondsLeft = minutes*60;
    if(state.running) return;
    state.running = true;
    state.endTime = Date.now() + state.secondsLeft*1000;
    save();

    // set up tick
    tickInterval = setInterval(()=> tick(), 250);
    refreshUI();
  }
  function pauseTimer(){
    if(!state.running) return;
    state.running = false;
    // recalc secondsLeft
    if(state.endTime) state.secondsLeft = Math.max(0, Math.round((state.endTime - Date.now())/1000));
    state.endTime = null;
    clearInterval(tickInterval);
    tickInterval = null;
    save();
    refreshUI();
  }
  function resetTimer(){
    pauseTimer();
    state.secondsLeft = DEFAULT_MIN*60;
    state.endTime = null;
    save();
    refreshUI();
  }

  function tick(){
    if(!state.running) return;
    const remainMs = state.endTime - Date.now();
    if(remainMs <= 0){
      // session complete
      state.secondsLeft = 0;
      completeSession();
    } else {
      state.secondsLeft = Math.ceil(remainMs/1000);
      // update UI frequently
      refreshUI();
    }
  }

  // when session finishes
  function completeSession(){
    // mark session length in minutes (round)
    const durationMin = Math.max(1, Math.round(( (DEFAULT_MIN*60) - state.secondsLeft ) / 60 ) || DEFAULT_MIN);
    const ts = Date.now();
    state.sessions.push({duration: durationMin, timestamp: ts, note: 'session'});
    state.totalSessions = (state.totalSessions||0) + 1;

    // update daily progress
    const today = getTodayKey();
    state.dailyProgress[today] = (state.dailyProgress[today] || 0) + durationMin;

    // update weekly & monthly
    const weekKey = String(getWeekStart());
    state.weeklyTotals[weekKey] = (state.weeklyTotals[weekKey]||0) + durationMin;
    const monthKey = getMonthKey(ts);
    state.monthlyTotals[monthKey] = (state.monthlyTotals[monthKey]||0) + durationMin;

    // stop timer and notify
    state.running = false;
    state.endTime = null;
    state.secondsLeft = DEFAULT_MIN*60;
    save();

    // popup like notification (browser notification if allowed), small confetti substitute via modal pulse
    showSessionComplete();
    refreshUI();
  }

  function showSessionComplete(){
    // small visual: scale floating clock briefly
    floating.style.transform = "scale(1.06)";
    setTimeout(()=> floating.style.transform = "", 350);

    if(state.notify && "Notification" in window){
      if(Notification.permission === "granted"){
        new Notification("Pomodoro Completed", {body:"Great work — session recorded to local stats."});
      } else if(Notification.permission !== "denied"){
        Notification.requestPermission().then(p=>{
          if(p === "granted") new Notification("Pomodoro Completed",{body:"Nice! Notifications enabled."});
        });
      }
    }
    // also show ephemeral badge inside modal if open
    const oldText = startBtn.innerHTML;
    startBtn.innerHTML = '<i class="fa-solid fa-check"></i> Complete';
    setTimeout(()=> startBtn.innerHTML = oldText, 1400);
  }

  // ---------- UI events ----------
  startBtn.addEventListener("click",()=>{
    if(!state.running){
      // if secondsLeft is zero, reset to default
      if(state.secondsLeft <= 0) state.secondsLeft = DEFAULT_MIN*60;
      startTimer(Math.round(state.secondsLeft/60));
    }
  });
  pauseBtn.addEventListener("click", ()=> pauseTimer());
  resetBtn.addEventListener("click", ()=> { resetTimer(); });

  // presets
  presetEls.forEach(p=>{
    p.addEventListener("click", ()=> {
      const m = parseInt(p.dataset.min,10) || DEFAULT_MIN;
      state.secondsLeft = m*60;
      pauseTimer();
      refreshUI();
    });
  });

  // floating open modal
  floating.addEventListener("click", (e)=>{
    // open overlay
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden","false");
    overlayModal.focus?.();
  });

  // close overlay on background click (but do not stop timer)
  overlay.addEventListener("click", (e)=>{
    if(e.target === overlay){
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden","true");
    }
  });

  // drag floating
  (function draggable(el){
    let isDown=false, offset={x:0,y:0}, start={x:0,y:0};
    el.addEventListener("mousedown", startDrag);
    el.addEventListener("touchstart", startDrag,{passive:false});
    function startDrag(e){
      e.preventDefault();
      isDown = true;
      const rect = el.getBoundingClientRect();
      start.x = (e.touches ? e.touches[0].clientX : e.clientX);
      start.y = (e.touches ? e.touches[0].clientY : e.clientY);
      offset.x = start.x - rect.left;
      offset.y = start.y - rect.top;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove,{passive:false});
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
    }
    function onMove(e){
      if(!isDown) return;
      const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
      const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
      let left = clientX - offset.x;
      let top = clientY - offset.y;
      // clamp inside viewport
      left = Math.max(8, Math.min(window.innerWidth - el.offsetWidth - 8, left));
      top = Math.max(8, Math.min(window.innerHeight - el.offsetHeight - 8, top));
      el.style.right = "auto";
      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.bottom = "auto";
    }
    function endDrag(){
      isDown = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchend", endDrag);
    }
  })(floating);

  // view toggle (timer/graph)
  viewTimerBtn.addEventListener("click", ()=>{
    timerBlock.style.display = "";
    graphBlock.style.display = "none";
    viewTimerBtn.classList.add("active");
    viewGraphBtn.classList.remove("active");
  });
  viewGraphBtn.addEventListener("click", ()=>{
    timerBlock.style.display = "none";
    graphBlock.style.display = "";
    viewGraphBtn.classList.add("active");
    viewTimerBtn.classList.remove("active");
  });

  // graph range toggle
  let currGraphRange = "week";
  weekRange.addEventListener("click", ()=> { currGraphRange="week"; drawFocusChart("week"); graphRangeLabel.textContent="Week"; weekRange.classList.add("active"); monthRange.classList.remove("active");});
  monthRange.addEventListener("click", ()=> { currGraphRange="month"; drawFocusChart("month"); graphRangeLabel.textContent="Month"; monthRange.classList.add("active"); weekRange.classList.remove("active");});
  // init chips
  weekRange.classList.add("active");

  // notification toggle
  notifyToggle.addEventListener("change", (e)=>{ state.notify = e.target.checked; save(); });

  // export / clear
  exportBtn.addEventListener("click", ()=>{
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'eduspark_timer_export.json'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
  clearBtn.addEventListener("click", ()=>{
    if(!confirm("Clear all local timer data? This removes sessions stored in this browser.")) return;
    state.sessions = []; state.dailyProgress={}; state.weeklyTotals={}; state.monthlyTotals={}; state.totalSessions = 0;
    save(); refreshUI();
  });

  // daily goal change
  dailyGoalInput.addEventListener("change", ()=>{ state.dailyGoal = parseInt(dailyGoalInput.value||60,10); save(); refreshUI(); });

  // ---------- charts (canvas drawing) ----------
  function drawMiniChart(){
    const ctx = miniCanvas.getContext('2d');
    miniCanvas.width = miniCanvas.clientWidth * devicePixelRatio;
    miniCanvas.height = miniCanvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // prepare last 7 days data
    const labels = [];
    const data = [];
    for(let i=6;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      labels.push(d.toLocaleDateString([], {weekday:'short'}));
      data.push(state.dailyProgress[key] || 0);
    }
    // draw
    const w = miniCanvas.clientWidth;
    const h = miniCanvas.clientHeight;
    ctx.clearRect(0,0,w*devicePixelRatio,h*devicePixelRatio);
    // background
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    roundRect(ctx, 0,0, w, h, 8); ctx.fill();

    // bars
    const max = Math.max(1, ...data);
    const barW = (w - 20) / data.length;
    data.forEach((v,i)=>{
      const x = 10 + i*barW;
      const barH = (v/max) * (h - 36);
      const y = h - 22 - barH;
      // gradient
      const g = ctx.createLinearGradient(x,y,x, y+barH);
      g.addColorStop(0, 'rgba(124,77,255,0.95)');
      g.addColorStop(1, 'rgba(255,107,107,0.9)');
      ctx.fillStyle = g;
      roundRect(ctx, x, y, barW*0.6, barH, 6); ctx.fill();
      // label
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '10px Inter';
      ctx.fillText(labels[i], x, h - 6);
    });
  }

  function drawFocusChart(range){
    const ctx = focusCanvas.getContext('2d');
    focusCanvas.width = focusCanvas.clientWidth * devicePixelRatio;
    focusCanvas.height = focusCanvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const w = focusCanvas.clientWidth; const h = focusCanvas.clientHeight;

    ctx.clearRect(0,0,w*devicePixelRatio,h*devicePixelRatio);
    ctx.fillStyle = "rgba(255,255,255,0.01)"; roundRect(ctx,0,0,w,h,10); ctx.fill();

    if(range === "week"){
      // last 7 days
      const labels = []; const data = [];
      for(let i=6;i>=0;i--){
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = d.toISOString().slice(0,10);
        labels.push(d.toLocaleDateString([], {weekday:'short'}));
        data.push(state.dailyProgress[k] || 0);
      }
      drawLineBars(ctx, w, h, labels, data);
    } else {
      // last 6 months
      const labels = []; const data = [];
      const now = new Date();
      for(let i=5;i>=0;i--){
        const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
        const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        labels.push(d.toLocaleString([], {month:'short'}));
        data.push(state.monthlyTotals[k] || 0);
      }
      drawLineBars(ctx, w, h, labels, data, true);
    }
  }

  function drawLineBars(ctx,w,h,labels,data,isMonth=false){
    // compute max
    const padding = 28;
    const max = Math.max(1, ...data);
    const step = (w - padding*2) / (data.length - 1 || 1);
    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1;
    for(let i=0;i<4;i++){
      const y = padding + i*( (h - padding*2)/3 );
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(w - padding, y); ctx.stroke();
    }
    // line
    ctx.beginPath();
    data.forEach((v,i)=>{
      const x = padding + i*step;
      const y = h - padding - (v/max) * (h - padding*2);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    // stroke gradient
    const g = ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0, 'rgba(124,77,255,0.95)'); g.addColorStop(1, 'rgba(255,107,107,0.95)');
    ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.stroke();

    // fill area
    ctx.lineTo(w - padding, h-padding); ctx.lineTo(padding, h-padding); ctx.closePath();
    const gf = ctx.createLinearGradient(0,0,0,h);
    gf.addColorStop(0, 'rgba(124,77,255,0.12)'); gf.addColorStop(1, 'rgba(255,107,107,0.03)');
    ctx.fillStyle = gf; ctx.fill();

    // labels
    ctx.fillStyle = 'rgba(230,240,255,0.95)'; ctx.font = '12px Inter';
    data.forEach((v,i)=>{
      const x = padding + i*step; const y = h - padding - (v/max) * (h - padding*2);
      ctx.fillText(labels[i], x - 12, h - 8);
      ctx.fillStyle = 'rgba(230,240,255,0.9)'; ctx.fillText(String(v)+'m', x - 14, y - 6);
      ctx.fillStyle = 'rgba(230,240,255,0.95)';
    });
  }

  // helper roundRect
  function roundRect(ctx,x,y,w,h,r){
    const min = Math.min(w,h);
    if(typeof r === 'undefined') r = 6;
    if(r > (min/2)) r = min/2;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  // ---------- storage helpers for adding minutes mid-session (e.g., pausing/resuming) ----------
  function addMinutesToToday(min){
    const key = getTodayKey();
    state.dailyProgress[key] = (state.dailyProgress[key] || 0) + min;
    const wk = String(getWeekStart());
    state.weeklyTotals[wk] = (state.weeklyTotals[wk] || 0) + min;
    const mk = getMonthKey();
    state.monthlyTotals[mk] = (state.monthlyTotals[mk] || 0) + min;
    save();
  }

  // ---------- simulate mid-session saving when paused manually (optional) ----------
  // For simplicity, we only create a session when timer reaches 0. But we might also allow "finish early" to record partial sessions:
  // We'll add a right-click on reset to store current partial time as session:
  resetBtn.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
    // record partial if > 1 minute
    const elapsedMin = Math.round((DEFAULT_MIN*60 - state.secondsLeft)/60);
    if(elapsedMin > 0){
      state.sessions.push({duration: elapsedMin, timestamp: Date.now(), note:"partial"});
      state.totalSessions = (state.totalSessions||0) + 1;
      addMinutesToToday(elapsedMin);
      save(); refreshUI();
      alert("Partial session saved ("+elapsedMin+" min).");
    }
  });

  // ---------- load/save init ----------
  load(); ensureWeeklyRotation(); refreshUI();

  // restore timer if it was running before reload
  if(state.running && state.endTime){
    const remain = Math.round((state.endTime - Date.now())/1000);
    if(remain <= 0){
      state.running = false; state.secondsLeft = DEFAULT_MIN*60; state.endTime = null;
      save();
    } else {
      state.secondsLeft = remain;
      tickInterval = setInterval(()=> tick(), 250);
    }
  }

  // ---------- draw initial charts ----------
  drawMiniChart(); drawFocusChart(currGraphRange="week");

  // re-render when window focus changes to keep times accurate
  window.addEventListener("focus", ()=> { if(state.running && state.endTime){ state.secondsLeft = Math.max(0, Math.round((state.endTime - Date.now())/1000)); } refreshUI(); });

  // Resize handling for canvas
  let resizeTimeout=null;
  window.addEventListener("resize", ()=>{ clearTimeout(resizeTimeout); resizeTimeout = setTimeout(()=>{ drawMiniChart(); drawFocusChart(currGraphRange); }, 240); });

  // ---------- auto save every 10s while running ----------
  setInterval(()=>{ if(state.running) save(); }, 10000);

  // expose tiny API on window to allow external controls if you want
  window.ES_Timer = {
    open: ()=> overlay.classList.add('show'),
    close: ()=> overlay.classList.remove('show'),
    start: ()=> startTimer(),
    pause: ()=> pauseTimer(),
    reset: ()=> resetTimer(),
    export: ()=> exportBtn.click(),
    getState: ()=> JSON.parse(JSON.stringify(state))
  };

})();
// clock