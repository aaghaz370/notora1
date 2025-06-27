// ===== script.js =====

let books = [];
let currentPage = 1;
const booksPerPage = 60;

const bookGrid = document.getElementById("bookGrid");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("searchSuggestions");
const categorySelect = document.getElementById("categorySelect");

const clearButton = document.createElement("span");
clearButton.textContent = "✖";
clearButton.style.position = "absolute";
clearButton.style.right = "10px";
clearButton.style.top = "50%";
clearButton.style.transform = "translateY(-50%)";
clearButton.style.cursor = "pointer";
clearButton.style.fontSize = "16px";
clearButton.style.display = "none";
clearButton.style.color = "#555";

clearButton.onclick = () => {
  searchInput.value = "";
  clearButton.style.display = "none";
  suggestions.innerHTML = "";
  displayBooks("", categorySelect.value);
};

window.onload = () => {
  document.querySelector(".search-container").appendChild(clearButton);
  loadBooks();
};

function loadBooks() {
  fetch("books.json")
    .then((res) => res.json())
    .then((data) => {
      books = data;
      populateCategories();
      displayBooks();
    });
}

function populateCategories() {
  const uniqueCategories = [...new Set(books.map((b) => b.category))];
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function displayBooks(filter = "", category = "All") {
  const filtered = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === "All" || book.category === category;
    return matchesTitle && matchesCategory;
  });

  const start = (currentPage - 1) * booksPerPage;
  const paginated = filtered.slice(start, start + booksPerPage);

  bookGrid.innerHTML = paginated
    .map(
      (book) => `
      <div class="book-card" onclick="openModal('${book.id}')">
        <img src="${book.image}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p class="rating">⭐ ${book.rating}</p>
        <p class="category">${book.category}</p>
      </div>
    `
    )
    .join("");

  renderPagination(filtered.length);
}

function renderPagination(totalBooks) {
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      displayBooks(searchInput.value, categorySelect.value);
    };
    pagination.appendChild(btn);
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";
  clearButton.style.display = value ? "block" : "none";

  const matched = books.filter((b) => b.title.toLowerCase().includes(value));
  if (matched.length === 0) {
    const notFound = document.createElement("li");
    notFound.textContent = "Not Found!";
    suggestions.appendChild(notFound);
  } else {
    matched.slice(0, 10).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b.title;
      li.onclick = () => {
        searchInput.value = b.title;
        suggestions.innerHTML = "";
        displayBooks(b.title, categorySelect.value);
      };
      suggestions.appendChild(li);
    });
  }

  displayBooks(value, categorySelect.value);
});

categorySelect.addEventListener("change", () => {
  currentPage = 1;
  displayBooks(searchInput.value, categorySelect.value);
});

function openModal(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;
  document.getElementById("modalTitle").textContent = book.title;
  document.getElementById("modalAuthor").textContent = book.author;
  document.getElementById("modalViewer").src = book.link;
  document.getElementById("modalDownload").href = book.link;
  document.getElementById("modalDownload").download = `${book.title}.pdf`;
  document.getElementById("bookModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("bookModal").style.display = "none";
  document.getElementById("modalViewer").src = "";
}

function toggleFullScreen() {
  const iframe = document.getElementById("modalViewer");
  if (iframe.requestFullscreen) iframe.requestFullscreen();
}

function toggleHighlight() {
  alert("Highlight feature coming soon!");
}

function toggleTheme() {
      document.body.classList.toggle('night-mode');
      document.querySelector('.theme-toggle').textContent = document.body.classList.contains('night-mode') ? '🌙' : '🌞';
    }

