const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    totalStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure proper export of the model
module.exports = mongoose.model('Product', ProductSchema);
