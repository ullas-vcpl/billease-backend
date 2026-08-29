//delete product

const getproductmodel = require('../../models/getproductmodel.js');
const user = require('../../models/users.js');

const deleteProductController = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(id);
        const email = (await user.findById(req.user.id)).email;
        console.log(email);
        const dbname = email.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const products = await getproductmodel(cleanedDbname);
        const deletedProduct = await products.findByIdAndDelete(id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = deleteProductController;