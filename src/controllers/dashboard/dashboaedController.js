const getBillModel = require('../../models/getbillmodel.js');
const getCustomerModel = require('../../models/getcustomermodel.js');
const getProductModel = require('../../models/getproductmodel.js');

const mongoose = require("mongoose");


// ========================================
// DASHBOARD SUMMARY
// ========================================

const getDashboardSummary = async (req, res) => {
    const email = (await findById(req.user.id)).email;
    const DBNAME = email.split('@')[0];
    const cleanDBNAME = DBNAME.replace(/[^a-zA-Z0-9]/g, '');
    const Bill = getBillModel(cleanDBNAME);
    const Product = getProductModel(cleanDBNAME);
    const Customer = getCustomerModel(cleanDBNAME);

    try {

        // Start of today
        const startOfDay = new Date();

        startOfDay.setHours(0, 0, 0, 0);


        // Start of tomorrow
        const startOfTomorrow = new Date(startOfDay);

        startOfTomorrow.setDate(
            startOfTomorrow.getDate() + 1
        );


        // Get today's sales
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


// ========================================
// SALES OVERVIEW
// ========================================

const getSalesOverview = async (req, res) => {

    try {

        const days =
            parseInt(req.query.days) || 7;


        // Date from which we want data
        const startDate = new Date();

        startDate.setHours(0, 0, 0, 0);

        startDate.setDate(
            startDate.getDate() - (days - 1)
        );


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


        // Create dates for all days
        // This ensures days with zero sales
        // also appear in the chart.

        const result = [];


        for (let i = 0; i < days; i++) {

            const date = new Date(startDate);

            date.setDate(
                startDate.getDate() + i
            );


            const dateString =
                date.toISOString().split("T")[0];


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


// ========================================
// RECENT BILLS
// ========================================

const getRecentBills = async (req, res) => {

    try {

        const bills = await Bill.find()

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


module.exports = {

    getDashboardSummary,

    getSalesOverview,

    getRecentBills

};