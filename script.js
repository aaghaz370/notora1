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

// profileIcon.addEventListener("click", () => {
//   window.location.href = "profile.html";
// });
// ---------- Load Profile Image from localStorage ----------
document.addEventListener("DOMContentLoaded", () => {
  const profileIconImg = document.querySelector("#profileIcon img");
  const savedImage = localStorage.getItem("userImage");

  if (savedImage && profileIconImg) {
    profileIconImg.src = savedImage;
  } else {
    // fallback default if none saved yet
    profileIconImg.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  }
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


  // =============== THEME TOGGLE ===============
const root = document.documentElement;
const body = document.body;
const themeToggle = document.createElement("div");
themeToggle.classList.add("theme-toggle");
themeToggle.innerHTML = "☀️";
document.querySelector(".timer-container").appendChild(themeToggle);

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  themeToggle.innerHTML = body.classList.contains("light-mode") ? "🌙" : "☀️";
  localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
});

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  themeToggle.innerHTML = "🌙";
}

// =============== TIMER LOGIC ===============
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("statusText");
const sessionSelect = document.getElementById("sessionLength");
const breakSelect = document.getElementById("breakLength");
const canvas = document.getElementById("progressCanvas");
const ctx = canvas.getContext("2d");

let timer;
let totalSeconds = 25 * 60;
let remaining = totalSeconds;
let isRunning = false;
let isBreak = false;

const ding = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_ding-10772.mp3?filename=ding-10772.mp3");

// Format time
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

// Draw progress ring
function drawProgress() {
  const radius = 100;
  const center = canvas.width / 2;
  const progress = 1 - remaining / totalSeconds;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 10;
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--border-color");

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--accent-color");
  ctx.beginPath();
  ctx.arc(center, center, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress);
  ctx.stroke();
}

// Update timer every second
function updateTimer() {
  remaining--;
  timeDisplay.textContent = formatTime(remaining);
  drawProgress();

  if (remaining <= 0) {
    clearInterval(timer);
    ding.play();
    if (!isBreak) {
      addSession(totalSeconds / 60);
      startBreak();
    } else {
      startFocus();
    }
  }
}

function startTimer() {
  if (!isRunning) {
    timer = setInterval(updateTimer, 1000);
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  remaining = totalSeconds;
  timeDisplay.textContent = formatTime(remaining);
  drawProgress();
}

function startFocus() {
  isBreak = false;
  totalSeconds = parseInt(sessionSelect.value) * 60;
  remaining = totalSeconds;
  statusText.textContent = "Focus Session";
  timeDisplay.textContent = formatTime(remaining);
  drawProgress();
}

function startBreak() {
  isBreak = true;
  totalSeconds = parseInt(breakSelect.value) * 60;
  remaining = totalSeconds;
  statusText.textContent = "Break Time ☕";
  timeDisplay.textContent = formatTime(remaining);
  drawProgress();
  startTimer();
}

// Buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
sessionSelect.addEventListener("change", startFocus);
breakSelect.addEventListener("change", startFocus);

// =============== SESSION STORAGE ===============
const sessionList = document.getElementById("sessionList");
const clearBtn = document.getElementById("clearSessions");

function addSession(minutes) {
  const session = {
    date: new Date().toLocaleString(),
    duration: minutes,
  };
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  sessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(sessions));
  renderSessions();
  updateGraph();
}

function renderSessions() {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  sessionList.innerHTML = "";
  sessions.slice().reverse().forEach((s) => {
    const div = document.createElement("div");
    div.classList.add("session-item");
    div.textContent = `${s.date} — ${s.duration} min`;
    sessionList.appendChild(div);
  });
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("sessions");
  renderSessions();
  updateGraph();
});

// =============== GRAPH LOGIC ===============
const graphCanvas = document.getElementById("studyGraph");
const gctx = graphCanvas.getContext("2d");

function updateGraph() {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const week = Array(7).fill(0);
  const now = new Date();
  sessions.forEach((s) => {
    const d = new Date(s.date);
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff < 7) week[6 - diff] += s.duration;
  });

  gctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  const barWidth = 40;
  const gap = 20;
  const max = Math.max(...week, 1);
  const heightScale = 150 / max;

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  gctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--accent-color");
  gctx.textAlign = "center";
  gctx.font = "14px Poppins";

  week.forEach((v, i) => {
    const x = 40 + i * (barWidth + gap);
    const y = 200 - v * heightScale;
    gctx.fillRect(x, y, barWidth, v * heightScale);
    gctx.fillText(days[i], x + barWidth / 2, 190 + 20);
  });

  document.getElementById("totalTime").textContent = (week.reduce((a, b) => a + b, 0) / 60).toFixed(1) + " hrs";
  document.getElementById("totalSessions").textContent = sessions.length;
}

// =============== TAB SWITCHING ===============
const tabs = document.querySelectorAll(".tab-btn");
const panes = document.querySelectorAll(".tab-pane");

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    panes.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// =============== FLOATING BUTTON BEHAVIOR ===============
const floatingTimer = document.getElementById("floatingTimer");
const modal = document.getElementById("timerModal");
const closeModal = document.getElementById("closeModal");

let offsetX, offsetY, isDragging = false;

floatingTimer.addEventListener("mousedown", startDrag);
floatingTimer.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;
  offsetX = e.touches ? e.touches[0].clientX - floatingTimer.getBoundingClientRect().left : e.clientX - floatingTimer.getBoundingClientRect().left;
  offsetY = e.touches ? e.touches[0].clientY - floatingTimer.getBoundingClientRect().top : e.clientY - floatingTimer.getBoundingClientRect().top;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", stopDrag);
}

function drag(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX - offsetX : e.clientX - offsetX;
  const y = e.touches ? e.touches[0].clientY - offsetY : e.clientY - offsetY;
  floatingTimer.style.left = `${x}px`;
  floatingTimer.style.top = `${y}px`;
  floatingTimer.style.bottom = "auto";
  floatingTimer.style.right = "auto";
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
}

floatingTimer.addEventListener("click", (e) => {
  if (!isDragging) modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// =============== INIT ===============
renderSessions();
updateGraph();
drawProgress();
timeDisplay.textContent = formatTime(remaining);