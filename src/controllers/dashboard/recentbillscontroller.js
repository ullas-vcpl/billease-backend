const getBillModel = require("../../models/getbillmodel.js");
const getCustomerModel = require("../../models/getcustomermodel.js");
const user = require("../../models/users.js");

const getRecentBills = async (req, res) => {
    try {
        const loggedInUser = await user.findById(req.user.id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const email = loggedInUser.email;

        const dbName = email.split("@")[0];
        const cleanDbName = dbName.replace(/[^a-zA-Z0-9]/g, "");

        const Bill = await getBillModel(cleanDbName);
        const Customer = await getCustomerModel(cleanDbName);

        const bills = await Bill.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const recentBills = await Promise.all(
            bills.map(async (bill) => {
                let customer = null;

                if (bill.customer) {
                    customer = await Customer.findById(
                        bill.customer
                    )
                        .select("name")
                        .lean();
                }

                return {
                    ...bill,
                    customer
                };
            })
        );

        res.status(200).json(recentBills);

    } catch (error) {
        console.error(
            "Recent bills error:",
            error
        );

        res.status(500).json({
            message: "Error getting recent bills",
            error: error.message
        });
    }
};

module.exports = getRecentBills;