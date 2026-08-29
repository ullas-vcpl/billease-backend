const getBillModel = require('../../models/getbillmodel.js');
const user = require('../../models/users.js');

const getBillByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const email = (await user.findById(req.user.id)).email;
        const dbname = (email.split('@')[0]);
        const cleanDbName = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const bill = await getBillModel(cleanDbName).findById(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = getBillByIdController;