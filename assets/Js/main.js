const vat = 0.16;

class Book {
    constructor(code, title, author, borrowed, price) {
        this.code = code;
        this.title = title;
        this.author = author;
        this.borrowed = borrowed;
        this.price = price;
    }
    calculatePriceWithVAT() {
        return this.price + (this.price * vat);
    }
}
class Library {
    constructor(name) {
        this.name = name;
        this.books = [];
    }
    addBook(book) {
        this.books.push(book);
    }
    totalBooks() {
        return this.books.length;
    }
    totalBorrowed() {
        return this.books.filter(b => b.borrowed).length;
    }
    totalAmountWithVAT() {
        return this.books.reduce((acc, b) => {
            return acc + b.calculatePriceWithVAT();
        }, 0);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const library = new Library("Librarius");

    const btnAddBook = document.getElementById("btnAddBook");
    const tableBody = document.querySelector(".books-table tbody");

    function renderBook(book) {
        let row = document.createElement("tr");
        [book.code, book.title, book.author, book.borrowed ? "Yes" : "No", book.price.toFixed(2), book.calculatePriceWithVAT().toFixed(2)]
            .forEach(val => {
                let cell = document.createElement("td");
                cell.textContent = val;
                row.appendChild(cell);
            });

        tableBody.appendChild(row);
    }

    let cookie = Cookies.get("Library");
    if (cookie) {
        const info = JSON.parse(cookie);

        info.books.forEach(b => {
            const book = new Book(b.code, b.title, b.author, b.borrowed, b.price)
            library.addBook(book);
            renderBook(book);
        });
        document.getElementById("totalBooks").textContent = library.totalBooks();
        document.getElementById("totalBorrowed").textContent = library.totalBorrowed();
        document.getElementById("totalAmount").textContent = library.totalAmountWithVAT().toFixed(2);

    }

    btnAddBook.addEventListener("click", function () {
        const code = document.getElementById("code").value.trim().toLowerCase();
        const title = document.getElementById("title").value.trim().toLowerCase();
        const author = document.getElementById("author").value.trim().toLowerCase();
        const borrowed = document.getElementById("borrowed").checked;
        const price = parseFloat(document.getElementById("price").value);

        if (code === "" || title === "" || author === "" || isNaN(price)) {
            alert("Fill in all the fields");
            return;
        }
        const book = new Book(code, title, author, borrowed, price);
        library.addBook(book);

        renderBook(book);
        document.getElementById("formBook").reset();

        document.getElementById("totalBooks").textContent = library.totalBooks();
        document.getElementById("totalBorrowed").textContent = library.totalBorrowed();
        document.getElementById("totalAmount").textContent = library.totalAmountWithVAT().toFixed(2);

        Cookies.set("Library", JSON.stringify(library), { expires: 1 });
    })
});