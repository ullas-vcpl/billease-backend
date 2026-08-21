const dummy = (req, res) => {
    res.status(200).json({ message: "Dummy endpoint accessed successfully", user: req.user });
};

module.exports = dummy;
