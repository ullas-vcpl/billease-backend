//products model
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {   
    type: String,
    required: true
  },
  description: {        
    type: String,
    required: true
  },
    price: {    
    type: Number,
    required: true
  },
  productcode: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    default: 0  
  } 
});

module.exports = productSchema;