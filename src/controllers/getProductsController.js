//get all products
const products = require('../models/products.js');

const getproducts = async (req, res) => {
  try { 
    const allProducts = await products.find();
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error });
  }
};

module.exports = getproducts;