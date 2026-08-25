const customerSchema = require('./customerSchema');
const getdatabase = require('../db/getdatabase');

const getcustomermodel = async (databasename) => {
    const db = await getdatabase(databasename);
    return db.models.customer || db.model('customer', customerSchema);
}