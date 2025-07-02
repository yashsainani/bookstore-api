const route = require("express").Router();

const { userRegister } = require("../controllers/userController");

route.post("/register", userRegister);

route.post("/login", (req, res) => { });

module.exports = route;