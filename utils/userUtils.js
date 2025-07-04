const bcrypt = require("bcrypt");

const credentialsChecker = (email, password, res) => {
    if (!email || !password) {
        res
        .status(400)
        .json({
            status: 400,
            message: `${!email ? "Email" : ""}${!email ? " and " : ""}${
                !password ? "Password" : ""
            } ${!email && !password ? "are" : "is"} required`,
        });
        return false;
    }
    return true;
};

const emailChecker = (email, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res
        .status(400)
        .json({
            status: 400,
            message: "Give a correct email"
        });
        return false;
    }
    return true;
};

const userExistanceCheck = (email, data, res) => {
    const chk = data.some(ele => ele.email === email);
    if (chk) {
        res
        .status(409)
        .json({
            status: 409,
            message: "User already exist with this email try to login"
        });
        return true;
    }
    return false;
};

const passwordHashing = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        return hashPass
    }
    catch (err) {
        console.log("🚀 ~ passwordHashing ~ err:", err);
    }
};

const passwordComparing = async (password, hashPass) => {
    try {
        const comparisonChk = await bcrypt.compare(password, hashPass);
        return comparisonChk;
    }
    catch (err) {
        console.log("passwordComparing Error", err);
        return false;
    }
};
module.exports = {
    credentialsChecker,
    emailChecker,
    userExistanceCheck,
    passwordHashing,
    passwordComparing
}