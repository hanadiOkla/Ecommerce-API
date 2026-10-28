import mongoose from "mongoose";

// Sub-schema: snapshot of the product at time of purchase
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    name: {
      type: String,
      required: [true, "Product ID is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    price: {
      type: Number,
      required: [true, "Prodct image is required"],
      min: [0, "Price cannot be less than 0"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false },
);

// Sub-schema: shipping address
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (arr) => arr.length >= 1,
      message: "Order must have at least one item",
    },
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: [true, "Shipping address is required"],
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ["cash", "stripe", "paypal", "paymob"],
      message: "{VALUE} is not a valid payment method",
    },
    default: "cash",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is required"],
    min: [0, "Subtotal cannot be less than 0"],
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be less than 0"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending",
  },
  paidAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  customerNote: {
    type: String,
    trim: true,
    maxlength: [1000, "Customer note cannot exceed 1000 characters"]
  },
  adminNote:{
    type: String,
    trim: true,
    maxlength: [1000, "Admin note cannot exceed 1000 characters"],    
  },
 },
    { timestamps: true },
);

const Order = mongoose.model( "Order" , orderSchema);
export default Order;