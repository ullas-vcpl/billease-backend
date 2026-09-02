const user = require("../../models/users.js");
const getbillmodel = require("../../models/getbillmodel.js");


const getSalesOverview = async (req, res) => {
    const email = (await user.findById(req.user.id)).email;
    const Dbname = email.split("@")[0];
    const cleanDbName = Dbname.replace(/\./g, "");
    const Bill = await getbillmodel(cleanDbName);
    try {

        const days =
            parseInt(req.query.days) || 7;

        // Start date
        const startDate = new Date();

        startDate.setHours(0, 0, 0, 0);

        startDate.setDate(
            startDate.getDate() - (days - 1)
        );

        // Get sales from MongoDB
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
                            date: "$createdAt"
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


        // Create result for every day
        const result = [];

        for (let i = 0; i < days; i++) {

            const date = new Date(startDate);

            date.setDate(
                startDate.getDate() + i
            );

            const dateString =
                date.toISOString().split("T")[0];


            // Find sales for this date
            const existingDay =
                sales.find(
                    item => item._id === dateString
                );


            result.push({

                date: date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                ),

                sales:
                    existingDay?.sales || 0

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