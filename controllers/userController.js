const register = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            status: 400,
            message: `${!email ? "Email" : ""}${!email ? " and " : ""}${
                !password ? "Password" : ""
            } ${!email && !password ? "are" : "is"} required`,
        });
    }
};

module.exports = {
    userRegister: register
}