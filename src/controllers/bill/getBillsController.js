const users = require('../../models/users.js');
const getbillmodel = require('../../models/getbillmodel.js');

const user = await users.findOne({ _id: req.user.id });
const databasename = user.email.split("@")[0];
const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
const Bill = await getbillmodel(cleanDatabasename);


const getBills = async (req, res) => {
    
    const user = await users.findOne({ _id: req.user.id });
    const databasename = user.email.split("@")[0];
    const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
    const bills = await getbillmodel(cleanDatabasename);

    
    
    try {
        const {
            search = "",
            customer = "",
            from = "",
            to = "",
            minAmount = "",
            maxAmount = "",
            sort = "newest",
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(parseInt(limit) || 10, 100);
        const skip = (pageNumber - 1) * limitNumber;

        // -------------------------
        // 1. Initial bill filters
        // -------------------------

        const billMatch = {};

        // Filter by customer
        if (customer) {
            billMatch.customer = customer;
        }

        // Filter by amount
        if (minAmount || maxAmount) {
            billMatch.amount = {};

            if (minAmount) {
                billMatch.amount.$gte = Number(minAmount);
            }

            if (maxAmount) {
                billMatch.amount.$lte = Number(maxAmount);
            }
        }

        // Filter by date
        if (from || to) {
            billMatch.createdAt = {};

            if (from) {
                const fromDate = new Date(from);
                fromDate.setHours(0, 0, 0, 0);

                billMatch.createdAt.$gte = fromDate;
            }

            if (to) {
                const toDate = new Date(to);
                toDate.setHours(23, 59, 59, 999);

                billMatch.createdAt.$lte = toDate;
            }
        }

        // -------------------------
        // 2. Sorting
        // -------------------------

        let sortOption = { createdAt: -1 };

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        if (sort === "highest") {
            sortOption = { amount: -1 };
        }

        if (sort === "lowest") {
            sortOption = { amount: 1 };
        }

        // -------------------------
        // 3. Aggregation
        // -------------------------

        const pipeline = [
            {
                $match: billMatch
            },

            // Get customer information
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer"
                }
            },

            {
                $unwind: {
                    path: "$customer",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        // -------------------------
        // 4. Search
        // -------------------------

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "customer.name": {
                                $regex: search.trim(),
                                $options: "i"
                            }
                        },
                        {
                            "customer.phone": {
                                $regex: search.trim(),
                                $options: "i"
                            }
                        }
                    ]
                }
            });
        }

        // -------------------------
        // 5. Sort + Pagination
        // -------------------------

        pipeline.push(
            {
                $sort: sortOption
            },

            {
                $facet: {
                    bills: [
                        {
                            $skip: skip
                        },
                        {
                            $limit: limitNumber
                        },
                        {
                            $project: {
                                _id: 1,
                                amount: 1,
                                description: 1,
                                createdAt: 1,

                                customer: {
                                    _id: "$customer._id",
                                    name: "$customer.name",
                                    phone: "$customer.phone"
                                }
                            }
                        }
                    ],

                    totalCount: [
                        {
                            $count: "count"
                        }
                    ]
                }
            }
        );

        const result = await Bill.aggregate(pipeline);

        const bills = result[0]?.bills || [];
        const totalBills = result[0]?.totalCount[0]?.count || 0;

        const totalPages = Math.ceil(totalBills / limitNumber);

        res.status(200).json({
            success: true,
            bills,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalBills,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });

    } catch (error) {
        console.error("Get bills error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bills"
        });
    }
};

module.exports = getBillsController;