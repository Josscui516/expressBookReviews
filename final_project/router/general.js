const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books));
});

// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
public_users.get('/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error retrieving book list");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    res.send(books[req.params.isbn]);
});

public_users.get('/books/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error retrieving book details");
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    let authoredBooks = [];
    for (let isbn in books) {
        if (books[isbn].author === author) {
            authoredBooks.push(books[isbn]);
        }
    }
    res.send(authoredBooks);
});

public_users.get('/books/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error retrieving books by author");
    }
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    let titledBooks = [];
    for (let isbn in books) {
        if (books[isbn].title === title) {
            titledBooks.push(books[isbn]);
        }
    }
    res.send(titledBooks);
});

public_users.get('/books/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error retrieving books by title");
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.send("Book not found");
    }
});

module.exports.general = public_users;
