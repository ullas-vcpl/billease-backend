const user = require("../../models/users.js");
const getBillModel = require("../../models/getbillmodel.js");

const getSalesOverview = async (req, res) => {
    try {
        // Find logged-in user
        const loggedInUser = await user.findById(req.user.id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get user's database name
        const email = loggedInUser.email;

        const dbName = email.split("@")[0];
        const cleanDbName = dbName.replace(/[^a-zA-Z0-9]/g, "");

        const Bill = await getBillModel(cleanDbName);

        // Number of days
        const days = Math.max(
            1,
            parseInt(req.query.days, 10) || 7
        );

        // Today at 00:00:00 in server local time
        const startDate = new Date();

        startDate.setHours(0, 0, 0, 0);

        startDate.setDate(
            startDate.getDate() - (days - 1)
        );

        // Aggregate sales
        const sales = await Bill.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate
                    }
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata"
                        }
                    },

                    sales: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        // Convert aggregation result into Map
        const salesMap = new Map(
            sales.map(item => [
                item._id,
                item.sales
            ])
        );

        // Create an entry for every day
        const result = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);

            date.setDate(
                startDate.getDate() + i
            );

            // Create YYYY-MM-DD using local date
            const year = date.getFullYear();

            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                date.getDate()
            ).padStart(2, "0");

            const dateString =
                `${year}-${month}-${day}`;

            result.push({
                date: date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                ),

                sales:
                    salesMap.get(dateString) || 0
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Sales overview error:",
            error
        );

        res.status(500).json({
            message: "Error getting sales overview",
            error: error.message
        });
    }
};

module.exports = getSalesOverview;