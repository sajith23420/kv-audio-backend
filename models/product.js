import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true,
        default : "uncategorized"
    },

    dimensions : {
        type : String,
        required : true
    }, 
    description : {
        type : String,
        required : true
    },
    availability :{
        type : Boolean,
        required : true,
        default : true
    },
    Image:{
        type : [String],
        required : true,
        default : ["https://www.greencustoms.org/sites/default/files/default_images/default-placeholder.png"]
    }

})

const Product = mongoose.model("Product",productSchema);

export default Product;