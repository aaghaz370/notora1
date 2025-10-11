document.addEventListener("DOMContentLoaded", () => {
    // ===== Main Page Book Loading =====
    const categories = [
        "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance", "Horror", "Fantasy",
        "Coding", "Business", "CBSE", "ICSE", "10th", "11th", "12th", "Spiritual", "Comics"
    ];
    const categoryContainer = document.getElementById("categoryContainer");

    async function loadCategory(category) {
        try {
            const res = await fetch(`data/${category}.json`);
            if (!res.ok) return;
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

    // ===== Search Logic with Skeleton Loading =====
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

    // ===== Profile Section =====
    const profileOverlay = document.getElementById("profileOverlay");
    const profileIcon = document.getElementById("profileIcon");
    const closeProfile = document.getElementById("closeProfile");
    const userImage = document.getElementById("userImage");
    const imageOptions = document.getElementById("imageOptions");
    const usernameDisplay = document.getElementById("usernameDisplay");

    profileIcon.addEventListener("click", () => {
        profileOverlay.classList.remove("hidden");
        loadUserData();
    });

    closeProfile.addEventListener("click", () => {
        profileOverlay.classList.add("hidden");
    });

    userImage.addEventListener("click", () => {
        imageOptions.classList.toggle("hidden");
    });

    window.changeImage = function() {
        const url = prompt("Enter image URL:");
        if (url) {
            localStorage.setItem("userImage", url);
            userImage.src = url;
        }
        imageOptions.classList.add("hidden");
    }

    window.deleteImage = function() {
        localStorage.removeItem("userImage");
        userImage.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        imageOptions.classList.add("hidden");
    }

    window.editUsername = function() {
        const name = prompt("Enter your name:");
        if (name) {
            localStorage.setItem("userName", name);
            usernameDisplay.textContent = name;
        }
    }

    function loadUserData() {
        const savedName = localStorage.getItem("userName");
        const savedImage = localStorage.getItem("userImage");
        usernameDisplay.textContent = savedName || "Click to add name";
        if (savedImage) userImage.src = savedImage;
        document.getElementById("readBooks").textContent = localStorage.getItem("readCount") || 0;
    }

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

        for (const levelInfo of LEVELS) {
            if (read >= levelInfo.target) currentLevel = levelInfo.level;
        }

        const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
        const nextTarget = nextLevelInfo ? nextLevelInfo.target : LEVELS[LEVELS.length-1].target;
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
});

// ===== Notification Sound & Notice Banner =====
window.addEventListener('load', () => {
    const audio = document.getElementById('notify-sound');
    audio.play().catch(() => {}); // Avoid errors if user hasn't interacted
});

function closeNotice() {
    const banner = document.getElementById('notice');
    banner.style.display = 'none';
}
