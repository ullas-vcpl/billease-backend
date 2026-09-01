// bill schema

const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
      type: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
        }
      ],
      required: true
    
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30*7*24*60*60 // example: expires in 7 days (in seconds)
    },
    
},);

module.exports = billSchema;