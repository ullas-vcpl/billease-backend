const getdatabase = require("../db/getdatabase.js");
const productSchema = require("./products.js");

const getproductmodel = async (databasename) => {
    const db = await getdatabase(databasename);
    return db.models.product || db.model("Product", productSchema);
}

module.exports = getproductmodel;