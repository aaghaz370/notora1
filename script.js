// ===== Main Page Book Loading =====
//     const categories = [
//         "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance", "Horror", "Fantasy", 
//         "Coding",  "Business", "CBSE", "ICSE", "10th", "11th", "12th", "Spiritual", "Comics"
//     ];
//     const categoryContainer = document.getElementById("categoryContainer");

//     async function loadCategory(category) {
//         try {
//             const res = await fetch(`data/${category}.json`);
//             if (!res.ok) return; 
//             const books = await res.json();
            
//             const section = document.createElement("div");
//             section.className = "category-section";

//             const title = document.createElement("h3");
//             title.className = "category-title";
//             title.textContent = category;

//             const wrapper = document.createElement("div");
//             wrapper.style.position = 'relative';

//             const slider = document.createElement("div");
//             slider.className = "book-slider";

//             books.slice(0, 30).forEach(book => {
//                 const card = document.createElement("div");
//                 card.className = "book-card";
//                 card.innerHTML = `
//                     <img src="${book.thumbnail}" alt="${book.name}" />
//                     <div class="book-title">${book.name}</div>
//                     <div class="book-author">${book.author}</div>
//                     <div class="book-genre">${book.genre}</div>
//                     <div class="book-rating">⭐ ${book.rating}</div>
//                 `;
                
//                 card.addEventListener("click", () => {
//                     localStorage.setItem("selectedBook", JSON.stringify(book));
//                     window.location.href = "book.html";
//                 });
//                 slider.appendChild(card);
//             });

//             const leftArrow = document.createElement("button");
//             leftArrow.className = "arrow-btn arrow-left";
//             leftArrow.innerHTML = "&#8249;";
//             leftArrow.onclick = () => slider.scrollBy({ left: -300, behavior: 'smooth' });

//             const rightArrow = document.createElement("button");
//             rightArrow.className = "arrow-btn arrow-right";
//             rightArrow.innerHTML = "&#8250;";
//             rightArrow.onclick = () => slider.scrollBy({ left: 300, behavior: 'smooth' });

//             wrapper.appendChild(leftArrow);
//             wrapper.appendChild(slider);
//             wrapper.appendChild(rightArrow);

            
// const showAllBtn = document.createElement("button");
// showAllBtn.className = "show-all-btn";
// showAllBtn.textContent = "Show All →";
// showAllBtn.onclick = () => {
//   window.location.href = `category.html?genre=${encodeURIComponent(category)}`;
// };

// section.appendChild(showAllBtn);


          


//             section.appendChild(title);
//             section.appendChild(wrapper);
//             categoryContainer.appendChild(section);
//         } catch (error) {
//             console.error(`Failed to load category: ${category}`, error);
//         }
//     }

//     categories.forEach(loadCategory);
    // ===== Main Page Book Loading =====
// const categories = [
//   "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance", 
//   "Horror", "Fantasy", "Coding", "Business", "CBSE", "ICSE", 
//   "10th", "11th", "12th", "Spiritual", "Comics"
// ];

// const categoryContainer = document.getElementById("categoryContainer");

// async function loadCategory(category) {
//   try {
//     const res = await fetch(`data/${category}.json`);
//     if (!res.ok) return;

//     const books = await res.json();

//     const section = document.createElement("div");
//     section.className = "category-section";

//     const title = document.createElement("h3");
//     title.className = "category-title";
//     title.textContent = category;

//     const wrapper = document.createElement("div");
//     wrapper.style.position = "relative";

//     const slider = document.createElement("div");
//     slider.className = "book-slider";

//     // ==== Load First 30 Books ====
//     books.slice(0, 30).forEach(book => {
//       const card = document.createElement("div");
//       card.className = "book-card";
//       card.innerHTML = `
//         <img src="${book.thumbnail}" alt="${book.name}" />
//         <div class="book-title">${book.name}</div>
//         <div class="book-author">${book.author}</div>
//         <div class="book-genre">${book.genre}</div>
//         <div class="book-rating">⭐ ${book.rating}</div>
//       `;

//       card.addEventListener("click", () => {
//         localStorage.setItem("selectedBook", JSON.stringify(book));
//         window.location.href = "book.html";
//       });

//       slider.appendChild(card);
//     });

//     // ==== Arrows ====
//     const leftArrow = document.createElement("button");
//     leftArrow.className = "arrow-btn arrow-left";
//     leftArrow.innerHTML = "&#8249;";
//     leftArrow.onclick = () => slider.scrollBy({ left: -300, behavior: "smooth" });

//     const rightArrow = document.createElement("button");
//     rightArrow.className = "arrow-btn arrow-right";
//     rightArrow.innerHTML = "&#8250;";
//     rightArrow.onclick = () => slider.scrollBy({ left: 300, behavior: "smooth" });

//     wrapper.appendChild(leftArrow);
//     wrapper.appendChild(slider);
//     wrapper.appendChild(rightArrow);

//     // ==== Show All Button ====
//     const showAllBtn = document.createElement("button");
//     showAllBtn.className = "show-all-btn";
//     showAllBtn.textContent = "Show All →";
//     showAllBtn.onclick = () => {
//       window.location.href = `category.html?genre=${encodeURIComponent(category)}`;
//     };

//     // ==== Append Everything ====
//     section.appendChild(title);
//     section.appendChild(wrapper);
//     section.appendChild(showAllBtn); // ✅ Button at the END
//     categoryContainer.appendChild(section);

//   } catch (error) {
//     console.error(`Failed to load category: ${category}`, error);
//   }
// }

// categories.forEach(loadCategory);
// ===== Main Page Book Loading =====
const categories = [
  "Fictional", "JEE", "NEET", "Story Hindi", "UPSC", "Biography", "Romance",
  "Horror", "Fantasy", "Coding", "Business", "CBSE", "ICSE",
  "10th", "11th", "12th", "Spiritual", "Comics"
];

const categoryContainer = document.getElementById("categoryContainer");

async function loadCategory(category) {
  try {
    const res = await fetch(`data/${category}.json`);
    if (!res.ok) return;

    const books = await res.json();
    const limitedBooks = books.slice(0, 30); // ✅ Only first 30 books

    const section = document.createElement("div");
    section.className = "category-section";

    const title = document.createElement("h3");
    title.className = "category-title";
    title.textContent = category;

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const slider = document.createElement("div");
    slider.className = "book-slider";

    // ==== Add 30 Book Cards ====
    limitedBooks.forEach(book => {
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

    // ==== Add "Show All" Button as a Fake Card ====
    const showAllCard = document.createElement("div");
    showAllCard.className = "book-card show-all-card";
    showAllCard.innerHTML = `<span>Show All →</span>`;
    showAllCard.addEventListener("click", () => {
      window.location.href = `category.html?genre=${encodeURIComponent(category)}`;
    });
    slider.appendChild(showAllCard);

    // ==== Arrows ====
    const leftArrow = document.createElement("button");
    leftArrow.className = "arrow-btn arrow-left";
    leftArrow.innerHTML = "&#8249;";
    leftArrow.onclick = () => slider.scrollBy({ left: -300, behavior: "smooth" });

    const rightArrow = document.createElement("button");
    rightArrow.className = "arrow-btn arrow-right";
    rightArrow.innerHTML = "&#8250;";
    rightArrow.onclick = () => slider.scrollBy({ left: 300, behavior: "smooth" });

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
//     const openSearch = document.getElementById("openSearch");
// const searchOverlay = document.getElementById("searchOverlay");
// const closeOverlay = document.getElementById("closeOverlay");
// const overlaySearchInput = document.getElementById("overlaySearchInput");
// const searchResults = document.getElementById("searchResults");

// let allBooks = [];

// async function loadAllBooksOnce() {
//   try {
//     const res = await fetch("data/All.json");
//     const extraBooks = await res.json();
//     allBooks = extraBooks;
//   } catch (e) {
//     console.error("Failed to load All.json", e);
//   }
// }

// openSearch.addEventListener("click", async () => {
//   document.getElementById("mainContent").style.display = "none";
//   searchOverlay.classList.remove("hidden");
//   if (allBooks.length === 0) await loadAllBooksOnce();
// });

// closeOverlay.addEventListener("click", () => {
//   searchOverlay.classList.add("hidden");
//   document.getElementById("mainContent").style.display = "block";
//   overlaySearchInput.value = "";
//   searchResults.innerHTML = "";
// });

// overlaySearchInput.addEventListener("input", async (e) => {
//   const query = e.target.value.toLowerCase();
//   searchResults.innerHTML = "";
//   if (query.trim() === "") return;

//   let results = [];

  
//   for (const cat of categories) {
//     try {
//       const res = await fetch(`data/${cat}.json`);
//       const books = await res.json();
//       results = results.concat(books);
//     } catch {}
//   }

  
//   results = results.concat(allBooks);

//   const filtered = results.filter(book =>
//     book.name.toLowerCase().includes(query) ||
//     book.author.toLowerCase().includes(query) ||
//     book.genre.toLowerCase().includes(query)
//   );

//   if (filtered.length === 0) {
    
//     const noResult = document.createElement("div");
//     noResult.className = "no-result";
//     noResult.textContent = "No results found";
//     searchResults.appendChild(noResult);
//   } else {
//     filtered.forEach(book => {
//       const card = document.createElement("div");
//       card.className = "book-card";
//       card.innerHTML = `
//         <img src="${book.thumbnail}" alt="${book.name}" />
//         <div class="book-title">${book.name}</div>
//         <div class="book-author">${book.author}</div>
//         <div class="book-genre">${book.genre}</div>
//         <div class="book-rating">⭐ ${book.rating}</div>
//       `;
//       card.addEventListener("click", () => openModal(book));
//       searchResults.appendChild(card);
//     });
//   }
// });
// ===== Search Logic =====
const openSearch = document.getElementById("openSearch");
const searchOverlay = document.getElementById("searchOverlay");
const closeOverlay = document.getElementById("closeOverlay");
const overlaySearchInput = document.getElementById("overlaySearchInput");
const searchResults = document.getElementById("searchResults");

let allBooks = [];
let searchTimeout = null; // debounce ke liye
let activeFetch = 0; // track karne ke liye ke latest search ka result hi dikhaye

// Loader element create
const loader = document.createElement("div");
loader.className = "loader";
loader.innerHTML = `<div class="spinner"></div>`;
searchResults.parentElement.appendChild(loader);
loader.style.display = "none";

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
  loader.style.display = "none";
});

overlaySearchInput.addEventListener("input", async (e) => {
  clearTimeout(searchTimeout);
  const query = e.target.value.toLowerCase().trim();

  // Agar empty query h to clear kar do aur loader hide
  if (query === "") {
    searchResults.innerHTML = "";
    loader.style.display = "none";
    return;
  }

  loader.style.display = "flex"; // loader show
  searchResults.innerHTML = "";

  // Debounce lagao (250ms)
  searchTimeout = setTimeout(async () => {
    const currentFetchId = ++activeFetch;
    let results = [];

    try {
      // Load from categories
      for (const cat of categories) {
        const res = await fetch(`data/${cat}.json`);
        const books = await res.json();
        results = results.concat(books);
      }

      // Add from All.json
      results = results.concat(allBooks);
    } catch (err) {
      console.error("Error loading categories:", err);
    }

    // Agar koi aur fetch start ho gaya to purana ignore
    if (currentFetchId !== activeFetch) return;

    const filtered = results.filter(
      (book) =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
    );

    loader.style.display = "none"; // hide loader

    // Clear old results
    searchResults.innerHTML = "";

    if (filtered.length === 0) {
      const noResult = document.createElement("div");
      noResult.className = "no-result";
      noResult.textContent = "No results found";
      searchResults.appendChild(noResult);
    } else {
      const seen = new Set(); // duplicate avoid karne ke liye
      filtered.forEach((book) => {
        const key = `${book.name}-${book.author}`;
        if (seen.has(key)) return;
        seen.add(key);

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
  }, 250);
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


 