const dataChecker = (title, author, genre, publishedYear, res) => {
    if (!title || !author || !genre || !publishedYear) {
        res
        .status(400)
        .json({
            status: 400,
            message: `${!title ? "Title, " : ""}${!author ? "Author, " : ""}${!genre ? "Genre, " : ""}${!publishedYear ? "Published Year " : ""}is required`,
        });
        return false;
    }
    return true;
};

const bookExistance = (title, author, userId, data, res) => {
    const bookChk = data.some(book => book.title === title && book.author === author && book.userId === userId);
    if (bookChk) {
        res
        .status(409)
        .json({
            status: 409,
            message: "This book alreday exists"
        });
        return true;
    }
    return false;
};

module.exports = {
    dataChecker,
    bookExistance
}