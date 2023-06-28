const form = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');
const bookTemplate = document.getElementById('book-template').content;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = {
    keywords: form.querySelector('#keywords').value,
    author: form.querySelector('#author').value,
    year: form.querySelector('#year').value
  };

  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при отправке запроса');
      }
      return response.json();
    })
    .then(data => {
      displaySearchResults(data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
    });
});

function displaySearchResults(books) {
  searchResults.innerHTML = '';

  books.forEach(book => {
    const bookElement = document.importNode(bookTemplate, true);

    bookElement.querySelector('.book-title').textContent = book.TITLE;
    bookElement.querySelector('.book-author').textContent = book.AUTHORS;
    bookElement.querySelector('.book-year').textContent = book.YEAR_OF_PUBLISHING;
    bookElement.querySelector('.book-publisher').textContent = book.PUBLISHERS;
    bookElement.querySelector('.book-quantity').textContent = book.NUM_OF_BOOKS;

    searchResults.appendChild(bookElement);
  });
}