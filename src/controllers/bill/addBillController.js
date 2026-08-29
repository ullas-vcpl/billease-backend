const getBillModel = require('../../models/getbillmodel.js');
const user = require('../../models/users.js');

const addBillController = async (req, res) => {
    const {amount, description, customer, date} = req.body;
    const email = (await user.findOne({ _id: req.user.id })).email;
    dbname = email.split('@')[0];
    cleanDbName = dbname.replace(/[^a-zA-Z0-9]/g, '');
    const Bill = await getBillModel(cleanDbName);
    try {
        const newBill = new Bill({
        amount,
        description,
        customer,
        date
    });
    await newBill.save();
        res.status(201).json(newBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = addBillController;