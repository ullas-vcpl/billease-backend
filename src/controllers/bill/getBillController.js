const getBillModel = require('../models/getbillmodel.js');
const user = require('../models/users.js');


const getBillController = async (req, res) => {
    const email = (await user.findOne({ _id: req.user.id })).email;
    const dbname = email.split('@')[0];
    const cleanDbName = dbname.replace(/[^a-zA-Z0-9]/g, '');
    const Bill = await getBillModel(cleanDbName);
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = getBillController;