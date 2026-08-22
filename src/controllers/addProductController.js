//add product 
const products = require('../models/products.js');

const addProductController = async (req, res) => {
    try { 
        const { name, price, description, productcode, discount } = req.body;
        const newProduct = new products({ name, price, description, productcode, discount });
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error });
    }
};

module.exports = addProductController;