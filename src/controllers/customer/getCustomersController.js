const user = require('../../models/users.js');
const getCustomerModel = require('../../models/getcustomermodel.js');

const getCustomersController = async (req, res) => {
    try {
        const useremail = (await user.findById(req.user.id)).email;
        const dbname = useremail.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const customers = await getCustomerModel(cleanedDbname);
        const allCustomers = await customers.find();
        res.status(200).json({ customers: allCustomers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers", error: error });
    }
};

module.exports = getCustomersController;