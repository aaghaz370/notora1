// ===== JavaScript for EduSpark Books with Arrow Buttons, Modal Exit, and Full Search Support =====

const categories = [
  "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance", "Horror", "Fantasy", "Self Help",
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