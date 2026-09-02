const user = require("../../models/users.js");
const getbillmodel = require("../../models/getbillmodel.js");
const getproductmodel = require("../../models/getproductmodel.js");
const getcustomermodel = require("../../models/getcustomermodel.js");

const getDashboardSummary = async (req, res) => {

    const email = (await user.findById(req.user.id)).email;
    const Dbname = email.split("@")[0];
    const cleanDbName = Dbname.replace(/\./g, "");
    const Bill = await getbillmodel(cleanDbName);
    const Product = await getproductmodel(cleanDbName);
    const Customer = await getcustomermodel(cleanDbName);
    try {

        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Start of tomorrow
        const startOfTomorrow = new Date(startOfDay);
        startOfTomorrow.setDate(
            startOfTomorrow.getDate() + 1
        );

        // Today's sales
        const todaySales = await Bill.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lt: startOfTomorrow
                    }
                }
            },
            {
                $group: {
                    _id: null,

                    totalSales: {
                        $sum: "$amount"
                    },

                    totalBills: {
                        $sum: 1
                    }
                }
            }
        ]);

        // Total products
        const totalProducts =
            await Product.countDocuments();

        // Total customers
        const totalCustomers =
            await Customer.countDocuments();

        res.status(200).json({

            todaySales:
                todaySales[0]?.totalSales || 0,

            todayBills:
                todaySales[0]?.totalBills || 0,

            totalProducts,

            totalCustomers

        });

    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

        res.status(500).json({
            message: "Error getting dashboard summary",
            error: error.message
        });

    }
};

module.exports = getDashboardSummary;