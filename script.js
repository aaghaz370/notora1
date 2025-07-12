
// script.js

const popContainer = document.getElementById('popularBooks');
const allContainer = document.getElementById('allBooks');
const modal = document.getElementById('bookModal');
const modalTitle = document.getElementById('modalTitle');
const modalPdf = document.getElementById('bookPdf');
const closeModal = document.querySelector('.close-btn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const genreFilter = document.getElementById('genreFilter');
const searchInput = document.getElementById('searchInput');

let allBooksData = [];
let popBooksData = [];

fetch('pop.json')
  .then(res => res.json())
  .then(data => {
    popBooksData = data;
    renderPopularBooks(data);
    autoSlidePopular();
  });

fetch('all.json')
  .then(res => res.json())
  .then(data => {
    allBooksData = data;
    renderAllBooks(data);
  });

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.innerHTML = `
    <img src="${book.img}" alt="${book.name}" />
    <div class="book-name">${book.name}</div>
    <div class="book-author">${book.author}</div>
    <div class="book-genre">${book.genre}</div>
    <div class="book-rating">⭐ ${book.rating}</div>
  `;
  card.onclick = () => openModal(book);
  return card;
}

function renderPopularBooks(data) {
  popContainer.innerHTML = '';
  data.forEach(book => {
    const div = createBookCard(book);
    popContainer.appendChild(div);
  });
}

function renderAllBooks(data) {
  allContainer.innerHTML = '';
  data.forEach(book => {
    const div = createBookCard(book);
    allContainer.appendChild(div);
  });
}

function openModal(book) {
  modal.style.display = 'flex';
  modalTitle.textContent = book.name;
  modalPdf.src = book.link;
}

closeModal.onclick = () => {
  modal.style.display = 'none';
  modalPdf.src = '';
};

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalPdf.src = '';
  }
});

fullscreenBtn.onclick = () => {
  modalPdf.requestFullscreen();
};

const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const slider = document.querySelector('.popular-slider');

leftBtn.onclick = () => slider.scrollBy({ left: -300, behavior: 'smooth' });
rightBtn.onclick = () => slider.scrollBy({ left: 300, behavior: 'smooth' });

function filterBooks() {
  const query = searchInput.value.toLowerCase();
  const genre = genreFilter.value;

  const filterFn = book => {
    const matchesText = book.name.toLowerCase().includes(query) ||
                        book.author.toLowerCase().includes(query) ||
                        book.genre.toLowerCase().includes(query);
    const matchesGenre = genre === 'all' || book.genre === genre;
    return matchesText && matchesGenre;
  };

  const filteredAll = allBooksData.filter(filterFn);
  const filteredPop = popBooksData.filter(filterFn);

  renderAllBooks(filteredAll);
  renderPopularBooks(filteredPop);
}

searchInput.addEventListener('input', filterBooks);
genreFilter.addEventListener('change', filterBooks);


let scrollDirection = 1;
function autoSlidePopular() {
  setInterval(() => {
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft >= maxScroll) scrollDirection = -1;
    else if (slider.scrollLeft <= 0) scrollDirection = 1;
    slider.scrollBy({ left: scrollDirection * 300, behavior: 'smooth' });
  }, 3000);
}
