const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    sku: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
