//delete product

const products = require('../models/products.js');

const deleteProductController = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await products.findByIdAndDelete(id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = deleteProductController;