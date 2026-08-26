const getdatabase = require('../db/getdatabase.js');
const billSchema = require('./bills.js');

const getBillModel = async (databasename) => {
    const db = await getdatabase(databasename);
    return db.models.bill || db.model('Bill', billSchema);
}

module.exports = getBillModel;