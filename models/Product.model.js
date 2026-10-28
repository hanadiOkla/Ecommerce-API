import mongoose from "mongoose";
import slugify from "slugify";

// Sub-schema for product images
const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);
//------ Review subschema (start)---------
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true }
);
//-----Review subschema--(end)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    images: {
      type: [imageSchema],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (arr) {
          return arr.length >= 1;
        },
        message: "At least one image is required",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    reviews: [reviewSchema],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
  },
  { timestamps: true },
);

// Generate unique slug before saving
productSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let finalSlug = baseSlug;
  let count = 1;

  // Check if slug exists and append a number if it does
  while (
    await this.constructor.exists({ slug: finalSlug, _id: { $ne: this._id } })
  ) {
    finalSlug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = finalSlug;
});

//---method calcAverageRating and count of views

productSchema.methods.calcAverageRating = function () {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.numReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.numReviews = 0;
  }
};

const Product = mongoose.model("Product", productSchema);

export default Product;
