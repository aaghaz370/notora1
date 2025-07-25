// ===== JavaScript for EduSpark Books with Arrow Buttons, Modal Exit, and Full Search Support =====

const categories = [
  "Fictional", "JEE", "NEET", "Story Hindi","Moral Stories" ,"UPSC", "Biography", "Romance", "Horror", "Fantasy", "Self Help",
  "Coding", "Computer Science", "Business", "CBSE", "ICSE", "10th", "11th", "12th", "Spiritual", "Comics"
];

const categoryContainer = document.getElementById("categoryContainer");

async function loadCategory(category) {
  const res = await fetch(`data/${category}.json`);
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
    card.addEventListener("click", () => openModal(book));
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
}

categories.forEach(loadCategory);

// ===== Modal for Book View =====
const modal = document.getElementById("bookModal");
const modalTitle = document.getElementById("modalTitle");
const pdfViewer = document.getElementById("pdfViewer");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const closeModal = document.getElementById("closeModal");


function openModal(book) {
  modalTitle.textContent = book.name;
  pdfViewer.src = book.pdfUrl;
  modal.classList.remove("hidden");

  // ✅ Track as read
  let readBooks = JSON.parse(localStorage.getItem("readBooks")) || [];

  // Use unique ID (preferably use a real `book.id`, here fallback to name)
  const bookId = book.id || book.name;

  if (!readBooks.includes(bookId)) {
    readBooks.push(bookId);
    localStorage.setItem("readBooks", JSON.stringify(readBooks));
    localStorage.setItem("readCount", readBooks.length);
  }

  // ✅ Update badge after reading
  updateBadgeProgress();
}


fullscreenBtn.addEventListener("click", () => {
  if (pdfViewer.requestFullscreen) {
    pdfViewer.requestFullscreen();
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  pdfViewer.src = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});



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
});



 window.addEventListener('load', () => {
    const audio = document.getElementById('notify-sound');
    const notice = document.getElementById('notice');

    // Only play if notice is visible
    if (notice.style.display !== 'none') {
      // Try to play after a short delay for better browser compatibility
      setTimeout(() => {
        audio.play().catch(err => {
          console.log("Autoplay failed. Waiting for user interaction.");
        });
      }, 500); // small delay to ensure DOM is ready
    }
  });

  function closeNotice() {
    const banner = document.getElementById('notice');
    banner.style.display = 'none';
  }




  
 const profileOverlay = document.getElementById("profileOverlay");
  const profileIcon = document.getElementById("profileIcon");
  const closeProfile = document.getElementById("closeProfile");
  const userImage = document.getElementById("userImage");
  const imageOptions = document.getElementById("imageOptions");
  const usernameDisplay = document.getElementById("usernameDisplay");

  const favBooksSection = document.getElementById("favBooksSection");
  const favBookGrid = document.getElementById("favBookGrid");

  profileIcon.addEventListener("click", () => {
    profileOverlay.classList.remove("hidden");
    loadUserData();
  });

  closeProfile.addEventListener("click", () => {
    profileOverlay.classList.add("hidden");
    favBooksSection.classList.add("hidden");
  });

  userImage.addEventListener("click", () => {
    imageOptions.classList.toggle("hidden");
  });

  function changeImage() {
    const url = prompt("Enter image URL:");
    if (url) {
      localStorage.setItem("userImage", url);
      userImage.src = url;
    }
    imageOptions.classList.add("hidden");
  }

  function deleteImage() {
    localStorage.removeItem("userImage");
    userImage.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    imageOptions.classList.add("hidden");
  }

  function editUsername() {
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

    // Load fake level + read count
    document.getElementById("userLevel").textContent = localStorage.getItem("userLevel") || 1;
    document.getElementById("readBooks").textContent = localStorage.getItem("readCount") || 0;
  }

  function toggleFavBooks() {
    favBooksSection.classList.toggle("hidden");

    // Load favorite books from localStorage
    const books = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    favBookGrid.innerHTML = "";

    if (books.length === 0) {
      favBookGrid.innerHTML = "<p style='grid-column: 1 / -1;'>No favorite books found.</p>";
      return;
    }

    books.forEach(book => {
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <p style="margin-top: 0.5rem;">${book.title}</p>
      `;
      favBookGrid.appendChild(div);
    });
  }


const badgeIcon = document.querySelector(".badge-icon");
const badgePanel = document.getElementById("badgePanel");
const closeBadge = document.getElementById("closeBadge");

const badgeLevelText = document.getElementById("badgeLevelText");
const badgeReadCount = document.getElementById("badgeReadCount");
const badgeCircle = document.getElementById("badgeCircle");
const badgeFill = document.getElementById("badgeFill");

const LEVELS = [
  { level: 0, target: 10 },
  { level: 1, target: 50 },
  { level: 2, target: 100 },
  { level: 3, target: 200 },
  { level: 4, target: 700 },
  { level: 5, target: Infinity }
];

function getLevel(readCount) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (readCount >= LEVELS[i].target) {
      return i;
    }
  }
  return 0;
}

function getNextLevelTarget(level) {
  return LEVELS[Math.min(level + 1, LEVELS.length - 1)].target;
}

function updateBadge() {
  const read = parseInt(localStorage.getItem("readCount") || "0");
  const level = getLevel(read);
  const target = getNextLevelTarget(level);
  const percent = Math.min((read / target) * 100, 100);

  badgeReadCount.textContent = `Books Read: ${read}`;
  badgeCircle.textContent = `Level ${level}`;
  badgeFill.style.width = `${percent}%`;

  if (level === 5) {
    badgeLevelText.textContent = "🔥 Max Level Reached! You're a Master Reader!";
  } else {
    badgeLevelText.textContent = `Next level at ${target} books`;
  }
}

// Open badge panel
badgeIcon.addEventListener("click", () => {
  badgePanel.classList.remove("hidden");
  updateBadge();
});

// Close badge panel
closeBadge.addEventListener("click", () => {
  badgePanel.classList.add("hidden");
});

// Live update every 5 seconds in case user reads book dynamically
setInterval(updateBadge, 5000);

// Optionally call once on load
updateBadge();
