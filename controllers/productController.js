const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');
const slugify = require('slugify');
const fs = require('fs')
const braintree = require("braintree");
const dotenv = require('dotenv')

dotenv.config();

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req,res) =>{
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files
        
        // Validation
        switch(true){
            case !name:
                return res.status(500).send({
                    error: 'Name is Required'
                })
            case !description:
                return res.status(500).send({
                    error: 'Description is Required'
                })
            case !price:
                return res.status(500).send({
                    error: 'Price is Required'
                })
            case !category:
                return res.status(500).send({
                    error: 'Category is Required'
                })
            case !quantity:
                return res.status(500).send({
                    error: 'Quantity is Required'
                })
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: 'Photo is Required and should be less then 1mb'
                })
        }
        const products = new productModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Creating Product',
            error
        })
    }
}

// Get All Product

const getProductController = async (req,res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})  // photo initail time pe nhi chahiye, filter add kiya h, photo k liye alg api bnaen gen, limit is liye use kiya kun k hame 12 products show krwani hn bs, populate m ham ne category ki sari fields show krwaen hn.
        res.status(200).send({
            status:true,
            totalCount: products.length, // total count product
            message:'All Products',
            products
            
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in Getting Product',
            error: error.message
        })
    }
}

// Get Single Product

const getSingleProductController = async (req,res) =>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            status:true,
            message:'Single Product Fetched',
            product
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            status:false,
            message:'Error While Getting Single Product',
            error
        })
    }
}

// Get Photo 
const productPhotoController = async (req,res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            status: false,
            message: 'Error While Getting Photo',
            error
        })
    }
}

// Delete Product
const deleteProductController = async (req,res) =>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            status: true,
            message: 'Product Deleted Successfully'
        })
    } catch (error) {
        console.log(erroe);
        res.status(500).send({
            status:false,
            message: 'Error While Deleting Product',
            error
        })
    }
}

// Udpate Product
const updateProductController = async (req,res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files
        
        // Validation
        switch(true){
            case !name:
                return res.status(500).send({
                    error: 'Name is Required'
                })
            case !description:
                return res.status(500).send({
                    error: 'Description is Required'
                })
            case !price:
                return res.status(500).send({
                    error: 'Price is Required'
                })
            case !category:
                return res.status(500).send({
                    error: 'Category is Required'
                })
            case !quantity:
                return res.status(500).send({
                    error: 'Quantity is Required'
                })
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: 'Photo is Required and should be less then 1mb'
                })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields, slug:slugify(name)},{new:true}
        )
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product Updated Successfully',
            products
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updating Product',
            error
        })
    }
}

// Filter Product
const productFilterController = async (req,res) => {
    try {
        const {checked, radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked; // jo b user category filter kare ga check lagae ga wo check kr rahe hn ham, ek se zyada pe b check laga sakta h.
        if(radio.length) args.price = {$gte: radio[0], $lte:radio[1] }; // get mean greater then, le mean less then.
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success:false,
            message: 'Error While Filtering Product',
            error
        })
    }
}

// Product Count (Pagination)
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message:'Error in Product Count',
            error
        })
    }
}

// Product Per Page base on Page
const productListController = async (req,res) =>{
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products
        })
        
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in per page',
            error
        })
    }
}

// Search Product 
const searchProductController = async (req,res) => {
    try {
        const {keyword} = req.params
        const results = await productModel.find({
            $or: [
                {name:{$regex :keyword, $options: "i"}},
                {description:{$regex :keyword, $options: "i"}}
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in Search Product',
            error
        })
    }
}

// Similar Products
const relatedProductController = async (req,res) =>{
    try {
        const {pid,cid} = req.params
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid} // ne means not include, pid ko include nhi karo.
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error While Geting Related Product',
            error
        })
    }
}
// Category wise Product
const productCategoryController = async (req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success:false,
            message: 'Error While Getting Category Wise Product',
            error
        })
    }
}

// Payment Gateway (Token)
const braintreeTokenController = async (req,res) => {
    try {
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err);
            }else{
                res.send(response);
            }
        })
    } catch (error) {
        // console.log(error);
    }
}

// For Payment
const brainTreePaymentController = async (req,res) => {
    try {
        const {cart, nonce} = req.body // nonce is predefined word in braintree Api.
        let total = 0
        cart.map((i) => {
            total += i.price
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement: true
            }
        },
        function(error, result){
            if(result){
                const order = new orderModel({
                    products: cart, // products cart m se aye gi.
                    payment: result,
                    buyer: req.user._id // require singin ka jo middleware add kiya h us me se aye ga user.
                }).save();
                res.json({ok:true});
            }else{
                res.status(500).send(error);
            }
        }
        )

    } catch (error) {
        // console.log(error);
    }
}
module.exports = {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    brainTreePaymentController
};

