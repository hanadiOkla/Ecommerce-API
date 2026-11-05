import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true,
        ref:"User"
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        }
    ]
})

wishlistSchema.pre(/^find/, function(){
    this.populate({
    path: "products",
    select: "name price images slug",
  });
})

const Wishlist=mongoose.model('Wishlist',wishlistSchema)
export default Wishlist;