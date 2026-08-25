//update product controller
const getproductmodel = require('../models/getproductmodel.js');
const users = require('../models/users.js');

const updateProductController = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, productcode, discount } = req.body;
    const updates = {};
    if(name!==undefined) updates.name = name;
    if(price!==undefined) updates.price = price;
    if(description!==undefined) updates.description = description;
    if(productcode!==undefined) updates.productcode = productcode;
    if(discount!==undefined) updates.discount = discount;
    console.log(updates);
    console.log(req.body);
    console.log(id);
    try {
        const email = (await users.findById(req.user.id)).email;
        const dbname = email.split('@')[0];
        const cleanedDbname = dbname.replace(/[^a-zA-Z0-9]/g, '');
        const products = await getproductmodel(cleanedDbname);
        const updatedProduct = await products.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: false });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = updateProductController;