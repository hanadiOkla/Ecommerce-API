import mongoose from "mongoose";

// Sub-schema: one product inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    coupon: {
      code: {
        type: String,
        uppercase: true,
        trim: true,
      },
      discountType: {
        type: String,
        enum: {
          values: ["percentage", "fixed"],
          message: "{VALUE} is not a valid discount type",
        },
      },
      discountValue: {
        type: Number,
        min: [0, "Discount value cannot be negative"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: sum of (price x quantity)
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Virtual: coupon saving (never more than subtotal)
cartSchema.virtual("discountAmount").get(function () {
  if (!this.coupon || !this.coupon.code) return 0;

  const subtotal = this.subtotal;
  let discount = 0;

  if (this.coupon.discountType === "percentage") {
    discount = (subtotal * this.coupon.discountValue) / 100;
  } else if (this.coupon.discountType === "fixed") {
    discount = this.coupon.discountValue;
  }

  return Math.min(discount, subtotal);
});

// Virtual: subtotal minus discount
cartSchema.virtual("total").get(function () {
  return this.subtotal - this.discountAmount;
});

// Virtual: total number of units
cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;