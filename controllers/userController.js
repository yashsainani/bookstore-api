const fs = require("node:fs").promises;
const path = require("node:path");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userPath = path.join(__dirname, "..", "user.json");

const { credentialsChecker, userExistanceCheck, emailChecker, passwordHashing, passwordComparing } = require("../utils/userUtils");
const { SECRET_KEY } = require("../config/env");

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!credentialsChecker(email, password, res)) return;
    
    try {
        if (!emailChecker(email, res)) return;
        await fs.access(userPath);
        const stringData = await fs.readFile(userPath, 'utf-8');
        const data = JSON.parse(stringData);
        if (userExistanceCheck(email, data, res)) return;
        const userId = uuidv4();
        const hashPass = await passwordHashing(password);
        data.push({email, password: hashPass, _id: userId})
        await fs.writeFile(userPath, JSON.stringify(data, null, 2), "utf-8")
        const token = jwt.sign({...req.body, _id: userId}, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res
        .status(200)
        .json({
            status: 200,
            message: "User Registered Successfully",
            _id: userId
        });
    }
    catch (err) {
        const userId = uuidv4();
        const hashPass = await passwordHashing(password)
        const data = [{email, password: hashPass, _id: userId}];
        await fs.writeFile(userPath, JSON.stringify(data, null, 2), "utf-8");
        const token = jwt.sign({...req.body, _id: userId}, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res
        .status(200)
        .json({
            status: 200,
            message: "User Successfully Registered",
            _id: userId
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!credentialsChecker(email, password, res)) return;

    try {
        await fs.access(userPath);
        const stringData = await fs.readFile(userPath, "utf-8");
        const data = JSON.parse(stringData);
        const user = data.find(ele => ele.email === email);
        if (!user) {
            const err = new Error("User doesn't Exist");
            err.status = 401;
            throw err;
        }
        if (!await passwordComparing(password, user.password)) {
            const err = new Error("Password is incorrect");
            err.status = 401
            throw err;
        }
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res
        .status(200)
        .json({
            status: 200,
            message: "User Logged In Successfully",
            _id: user._id
        })
    }
    catch (err) {
        res
        .status(err.status || 401)
        .json({
            status: 401,
            message: err.message || "Email or Password is incorrect!"
        })
    }
};

module.exports = {
    register,
    login
}