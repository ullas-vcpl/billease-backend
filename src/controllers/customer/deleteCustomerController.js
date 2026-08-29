const getCustomerModel = require('../../models/getcustomermodel.js');
const user = require('../../models/users.js');
    
const deleteCustomerController = async (req, res) => {
    try {
        const useremail = (await user.findById(req.user.id)).email;
        const dbname = useremail.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const customers = await getCustomerModel(cleanedDbname);
        const { id } = req.params;
        const deletedCustomer = await customers.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully", customer: deletedCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error: error });
    }
};

module.exports = deleteCustomerController;