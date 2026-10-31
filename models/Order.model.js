import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  shipping: {
    type: Number,
    default: 50 // قيمة الشحن الافتراضية
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Confirmed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Stripe'],
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  }
}, { timestamps: true });

// Pre-save hook لحساب الأسعار تلقائياً (Order Price Hook)
orderSchema.pre('save', function (next) {
  // حساب المجموع الفرعي من المنتجات والكميات
  this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // حساب الضرائب مثلاً بنسبة 14% أو حسب الحاجة
  this.tax = this.subtotal * 0.14;

  // حساب الإجمالي النهائي
  this.total = this.subtotal + this.shipping + this.tax - (this.discount || 0);

  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;