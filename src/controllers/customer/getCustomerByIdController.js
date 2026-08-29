const users = require('../../models/users.js');
const getcustomermodel = require('../../models/getcustomermodel.js');

const getCustomerByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await users.findOne({ _id: req.user.id });
        const databasename = user.email.split("@")[0];
        const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
        const customers = await getcustomermodel(cleanDatabasename);
        const customer = await customers.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error: error });
    }
};

module.exports = getCustomerByIdController;