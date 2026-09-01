const users = require('../../models/users.js');
const getbillmodel = require('../../models/getbillmodel.js');

const getBillsController = async (req, res) => {
    try {
        const user = await users.findOne({ _id: req.user.id });
        const databasename = user.email.split("@")[0];
        const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
        const bills = await getbillmodel(cleanDatabasename);
        const allBills = await bills.find();
        res.status(200).json(allBills);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bills", error: error });
    }
};

module.exports = getBillsController;