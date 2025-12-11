import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buyerName: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "process", "shipped", "completed", "cancelled"], 
    default: "pending" 
  },
  shippingAddress: { type: String }, 
  recipientName: { type: String },
  
  // Payment info
  paymentMethod: { type: String }, // qris, transfer, etc
  paymentDate: { type: Date },
  trackingNumber: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;