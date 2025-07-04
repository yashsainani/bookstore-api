const path = require("node:path");
const fs = require("node:fs").promises;
const { v4: uuidv4 } = require("uuid");

const { dataChecker, bookExistance } = require("../utils/booksUtils");
const { tokenChecker } = require("../utils/utils");

const bookPath = path.join(__dirname, "..", "books.json");

const getBooksList = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const lengthLimit = page * limit;
    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        if (!data) {
            const err = new Error("There is no book in the store");
            err.status = 204;
            throw err;
        }
        const startIdx = (lengthLimit - limit);
        const endIdx = data.length >= lengthLimit ? lengthLimit : data.length;
        const filterData = data.slice(startIdx, endIdx);
        res
        .status(200)
        .json({
            status: 200,
            message: "Books List fetched successfully",
            data: filterData
        })
    }
    catch (err) {
        res
        .status(err.status || 500)
        .json({
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        })
    }
}

const getBookById = async (req, res) => {
    const id = req.params.id;
    const tokenChk = tokenChecker(req, res);
    if (!tokenChk) return;

    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        const book = data.find(ele => ele._id === id);
        if (!book) {
            const err = new Error("The book you needed is not there");
            err.status = 400;
            throw err;
        }
        res
        .status(200)
        .json({
            status: 200,
            message: "Book fetched successfully",
            book
        })
    }
    catch (err) {
        res
        .status(err.status || 500)
        .json({
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        })
    }
};

const addBook = async (req, res) => {
    const { title, author, genre, publishedYear } = req.body;
    const tokenChk = tokenChecker(req, res);
    if (!tokenChk) return;
    if (!dataChecker(title, author, genre, publishedYear, res)) return;
    const bookId = uuidv4();

    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        if (bookExistance(title, author, tokenChk._id, data, res)) return;
        data.push({ ...req.body, _id: bookId, userId: tokenChk._id });
        await fs.writeFile(bookPath, JSON.stringify(data, null, 2), "utf-8");
        res
        .status(200)
        .json({
            status: 200,
            message: "Book added successfully",
            _id: bookId
        })
    }
    catch (err) {
        const data = [{ ...req.body, _id: bookId, userId: tokenChk._id }];
        await fs.writeFile(bookPath, JSON.stringify(data, null, 2), "utf-8");
        res
        .status(200)
        .json({
            status: 200,
            message: "Book added successfully",
            _id: bookId
        })
    }
};

const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const tokenChk = tokenChecker(req, res);
    if (!tokenChk) return;

    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        let idxToUpdate;
        const book = data.find((ele, idx) => {
            if (ele._id === bookId) {
                idxToUpdate = idx;
                return ele;
            }
        });
        if (!book) {
            const err = new Error("Book to update is not there");
            err.status = 404;
            throw err;
        }
        if (book && book.userId !== tokenChk._id) {
            const err = new Error("You can't update this book");
            err.status = 401;
            throw err;
        }
        data.splice(idxToUpdate, 1, { ...book, ...req.body });
        await fs.writeFile(bookPath, JSON.stringify(data, null, 2), "utf-8");
        res
        .status(200)
        .json({
            status: 200,
            message: "Book updated successfully"
        });
    }
    catch (err) {
        res
        .status(err.status || 500)
        .json({
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        })
    }
};

const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    const tokenChk = tokenChecker(req, res);
    if (!tokenChk) return;

    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        let idxToDelete;
        const book = data.find((ele, idx) => {
            if (ele._id === bookId) {
                idxToDelete = idx;
                return ele;
            }
        });
        if (!book) {
            const err = new Error("Book you want to delete is not there");
            err.status = 404;
            throw err;
        }
        if (book && book.userId !== tokenChk._id) {
            const err = new Error("You can't delete this book");
            err.status = 401;
            throw err;
        }
        data.splice(idxToDelete, 1);
        await fs.writeFile(bookPath, JSON.stringify(data, null, 2), "utf-8");
        res
        .status(200)
        .json({
            status: 200,
            message: "Successfully deleted the book"
        });
    }
    catch (err) {
        res
        .status(err.status || 500)
        .json({
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        });
    }
};

const searchBook = async (req, res) => {
    const genre = req.query.genre || "";
    const tokenChk = tokenChecker(req, res);
    if (!tokenChk) return;

    try {
        await fs.access(bookPath);
        const stringData = await fs.readFile(bookPath, "utf-8");
        const data = JSON.parse(stringData);
        const filterData = data.filter(book => book.genre === genre);
        if (!filterData) {
            const err = new Error(`There is no book with the ${genre} genre`);
            err.status = 404;
            throw err;
        }
        res
        .status(200)
        .json({
            status: 200,
            message: "Books fetched successfully",
            data: filterData
        });
    }
    catch (err) {
        res
        .status(err.status || 500)
        .json({
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        });
    }
};

module.exports = {
    getBooksList,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBook
}