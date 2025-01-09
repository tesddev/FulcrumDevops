import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true 
    },
    productDescription: { 
        type: String 
    },
    productPrice: { 
        type: String, 
        required: true 
    },
    productCategory: { 
        type: String, 
        required: true 
    },
    createdBy: {
        type: String,
    }
});

export default mongoose.model('Product', productSchema)