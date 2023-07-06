const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    slug:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId, // category wale model se us ki id get ki h.
        ref: 'Category', // ref is liye dea h kun k hame link krna h category se.
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping:{
        type: Boolean, 
    }

},
    {timestamps:true}
);

module.exports = mongoose.model("Products", productSchema)