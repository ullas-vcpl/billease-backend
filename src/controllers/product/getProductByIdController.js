const getproductmodel = require('../../models/getproductmodel.js');
const users = require('../../models/users.js');

const getProductByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await users.findOne({ _id: req.user.id });
        const databasename = user.email.split("@")[0];
        const cleanDatabasename = databasename.replace(/[^a-zA-Z0-9]/g, "");
        const products = await getproductmodel(cleanDatabasename);
        const product = await products.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error });
    }
};

module.exports = getProductByIdController;