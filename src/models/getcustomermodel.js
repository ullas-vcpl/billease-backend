const customerSchema = require('./customers.js');
const getdatabase = require('../db/getdatabase');

const getcustomermodel = async (databasename) => {
    const db = await getdatabase(databasename);
    return db.models.customer || db.model('customer', customerSchema);
};
module.exports = getcustomermodel;