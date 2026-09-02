const getbillmodel = require("../../models/getbillmodel.js");
const user = require("../../models/users.js");

const getRecentBills = async (req, res) => {
    const email = (await user.findById(req.user.id)).email;
    const Dbname = email.split("@")[0];
    const cleanDbName = Dbname.replace(/\./g, "");
    const Bill = await getbillmodel(cleanDbName);

    try {

        const bills = await Bill.find()

            .populate(
                "customer",
                "name"
            )

            .sort({
                createdAt: -1
            })

            .limit(10)

            .lean();


        res.status(200).json(bills);

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