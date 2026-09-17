const getBillModel = require("../../models/getbillmodel.js");
const getCustomerModel = require("../../models/getcustomermodel.js");
const getProductModel = require("../../models/getproductmodel.js");
const user = require("../../models/users.js");

const getBillByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Get logged-in user
        const loggedInUser = await user.findById(req.user.id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get user's database name
        const email = loggedInUser.email;

        const dbname = email.split("@")[0];
        const cleanDbName = dbname.replace(/[^a-zA-Z0-9]/g, "");

        // Get models from user's database
        const Bill = await getBillModel(cleanDbName);
        const Customer = await getCustomerModel(cleanDbName);
        const Product = await getProductModel(cleanDbName);

        // Find bill
        const bill = await Bill.findById(id);

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        // Get customer
        let customer = null;

        if (bill.customer) {
            customer = await Customer.findById(bill.customer);
        }

        // Get products
        const description = await Promise.all(
            bill.description.map(async (item) => {
                const product = await Product.findById(item.product);

                return {
                    product,
                    quantity: item.quantity
                };
            })
        );

        // Send complete bill
        res.status(200).json({
            _id: bill._id,
            amount: bill.amount,
            customer,
            description,
            createdAt: bill.createdAt
        });

    } catch (error) {
        console.error("getBillById error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = getBillByIdController;