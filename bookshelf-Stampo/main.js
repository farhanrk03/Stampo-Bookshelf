document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  
  renderBookshelf();

  function getFromLocalStorage() {
    const books = localStorage.getItem('books');
    return books ? JSON.parse(books) : [];
  }

  function saveToLocalStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }

  function createBookElement(id, title, author, year, isComplete) {
    
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.setAttribute("id", id);

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + year;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const completeButton = document.createElement("button");
    completeButton.classList.add(isComplete ? "green" : "red");
    completeButton.innerText = isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      toggleBookStatus(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-book", "red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(id);
    });

    actionDiv.appendChild(completeButton);
    actionDiv.appendChild(deleteButton);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  function renderBookshelf() {
    const books = getFromLocalStorage();

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    books.forEach(book => {
      const { id, title, author, year, isComplete } = book;
      const bookItem = createBookElement(id, title, author, year, isComplete);
      if (isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    });
  }

  function addBook() {
    const titleInput = document.getElementById("inputBookTitle").value;
    const authorInput = document.getElementById("inputBookAuthor").value;
    const yearInput = parseInt(document.getElementById("inputBookYear").value);
    const isCompleteInput = document.getElementById("inputBookIsComplete").checked;

    const id = Date.now().toString();
    const bookItem = createBookElement(id, titleInput, authorInput, yearInput, isCompleteInput);
    if (isCompleteInput) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }

    const books = getFromLocalStorage();
    books.push({ id, title: titleInput, author: authorInput, year: yearInput, isComplete: isCompleteInput });
    saveToLocalStorage(books); 
    alert("Buku berhasil dimasukkan!");
  }

  function toggleBookStatus(id) {
    const books = getFromLocalStorage();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveToLocalStorage(books);

      renderBookshelf(); 
    }
  }

  function deleteBook(id) {
    const confirmation = confirm("Anda yakin ingin menghapus buku ini?");
    if (confirmation) {
      const books = getFromLocalStorage();
      const updatedBooks = books.filter(book => book.id !== id);
      saveToLocalStorage(updatedBooks);

      renderBookshelf(); 
      alert("Buku berhasil dihapus!");
    }
  }

  function searchBook() {
    const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
    const allBooks = document.querySelectorAll('.book_item');
    allBooks.forEach(bookItem => {
      const title = bookItem.querySelector("h3").innerText.toLowerCase();
      if (title.includes(searchInput)) {
        bookItem.style.display = "block";
      } else {
        bookItem.style.display = "none";
      }
    });
  }
});
