const user = require('../models/users.js');
const getCustomerModel = require('../models/getcustomermodel.js');

const updateCustomerController = async (req, res) => {
    try {
        const useremail = (await user.findById(req.user.id)).email;
        const dbname = useremail.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const customers = await getCustomerModel(cleanedDbname);
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        const updates = {};
        if(name !== undefined) updates.name = name;
        if(email !== undefined) updates.email = email;
        if(phone !== undefined) updates.phone = phone;
        if(address !== undefined) updates.address = address;
        const updatedCustomer = await customers.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: false });
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error: error });
    }
};

module.exports = updateCustomerController;