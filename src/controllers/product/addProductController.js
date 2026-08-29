//add product 
const getproductmodel = require('../../models/getproductmodel.js');
const users = require('../../models/users.js');
const addProductController = async (req, res) => {
    try { 
        console.log(req.user.id);
        const user = await users.findOne({ _id: req.user.id });
        console.log(user.email);
        //console.log(email);
        databasename = user.email.split("@")[0];
        //remove special characters from the database name
        const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
        console.log(cleanDatabasename);
        const products = await getproductmodel(cleanDatabasename);
        const { name, price, description, productcode, discount } = req.body;
        const newProduct = new products({ name, price, description, productcode, discount });
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error });
    }
};

module.exports = addProductController;