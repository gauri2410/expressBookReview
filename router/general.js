const axios = require("axios");

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000"
});

const getAllBooks = async () => (await api.get("/books")).data;
const getBookByISBN = async (isbn) => (await api.get(`/isbn/${encodeURIComponent(isbn)}`)).data;
const getBooksByAuthor = async (author) => (await api.get(`/author/${encodeURIComponent(author)}`)).data;
const getBooksByTitle = async (title) => (await api.get(`/title/${encodeURIComponent(title)}`)).data;

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
