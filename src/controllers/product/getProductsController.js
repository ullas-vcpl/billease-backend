//get all products
const getproductmodel = require('../../models/getproductmodel.js');
const users = require('../../models/users.js');

const getproducts = async (req, res) => {
  try { 

    const user = await users.findOne({ _id: req.user.id });
    const databasename = user.email.split("@")[0];
    const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
    const products = await getproductmodel(cleanDatabasename);
    const allProducts = await products.find();
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error });
  }
};

module.exports = getproducts;