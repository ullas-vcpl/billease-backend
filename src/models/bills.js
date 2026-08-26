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
      ]
    
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = billSchema;