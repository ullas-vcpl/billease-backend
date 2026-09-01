const getcustomerModel = require('../../models/getcustomermodel.js');
const user = require('../../models/users.js');

const addCustomerController = async (req, res) => {
    try {
        const useremail = (await user.findById(req.user.id)).email;
        const dbname = useremail.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const customers = await getcustomerModel(cleanedDbname);
        const { name, email, phone, address } = req.body;
        const newCustomer = new customers({ name, email, phone, address });
        await newCustomer.save();
        res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error adding customer", error: error });
    }
};

module.exports = addCustomerController;