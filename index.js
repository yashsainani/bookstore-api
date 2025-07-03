const express = require("express");
const cookieParser = require("cookie-parser");

// server
const app = express();

// env vars
const { PORT } = require("./config/env");

// body parser middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// router middelware
const userRouter = require("./routers/userRouter.js");
const booksRouter = require("./routers/booksRouter.js");

// route to API
app.use("/user", userRouter);
app.use("/books", booksRouter);

// bad request urlencoded
app.use("", (req, res, next) => {
    res
    .status(404)
    .json({
        status: 404,
        message: "URL not found"
    });
})

// error router
app.use("", (err, req, res, next) => {
    res
    .status(err.status || 500)
    .json({
        status: err.status || 500,
        message: err.message || "Internal Server Error"
    });
});

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });