//logout controller

const logoutController = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = logoutController;