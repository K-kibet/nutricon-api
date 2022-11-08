const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: Array
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Number
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("Service", ServiceSchema);