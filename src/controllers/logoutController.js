//logout controller

const logoutController = (req, res) => {
    res.clearCookie("token",{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = logoutController;