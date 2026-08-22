//update product controller
const products = require('../models/products.js');

const updateProductController = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, productcode, discount } = req.body;
    try {
        const updatedProduct = await products.findByIdAndUpdate(id, { name, price, description, productcode, discount }, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = updateProductController;