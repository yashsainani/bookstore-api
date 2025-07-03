const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/env");

const tokenChecker = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            status: 401,
            message: "Unauthorized Access, Try to login or sign-up",
        });
        return false;
    }
    const tokenChk = jwt.verify(token, SECRET_KEY);
    if (!tokenChk) {
        res.status(403).json({
            status: 403,
            message: "You are forcefully logged please log-in again!",
        });
        return false;
    }
    // if (tokenChk.email !== email || tokenChk.password !== password) {
    //     res
    //     .status(403)
    //     .json({
    //         status: 403,
    //         message: "Unauthorized Access, Credentials mismatched with token credentials"
    //     })
    // }
    return tokenChk;
};

module.exports = {
    tokenChecker
}