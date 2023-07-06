const { hashpassowrd, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const JWT = require('jsonwebtoken')

// For Registration (Signup)
const registerController = async(req,res) => {
    try{
        // console.log(req.body);
        const {name, email, password, phone, address,answer} = req.body;
        // Validation
        if(!name){
            return res.send({message: 'Name is Required'})
        }
        if(!email){
            return res.send({message: 'Email is Required'})
        }
        if(!password){
            return res.send({message: 'Password is Required'})
        }
        if(!phone){
            return res.send({message: 'Phone no is Required'})
        }
        if(!address){
            return res.send({message: 'Address is Required'})
        }
        if(!answer){
            return res.send({message: 'Answer is Required'})
        }

        // Check User
        const existingUser = await userModel.findOne({email:email})
        // Existing User
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Register Please Login',
            })
        }
        // Register User
        const hashedPassword = await hashpassowrd(password)
        //Save User
        const user = await new userModel({
            name, 
            email,
            phone, 
            address,
            password: hashedPassword,
            answer
        }).save();
        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user,
        })
    }catch(error){
        // console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Register',
            error,
        })
    }
};

// POST Login (For Login)
const loginController = async (req,res)=>{
    try {
        const {email, password} = req.body
        //validate
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message:'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not Registered'
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        // Token Create
        const token = await JWT.sign({_id:user.id},process.env.JWT_SECRET,{
            expiresIn:'7d'
        }); // sign is user for token creation
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            //Print User information, After Successfully Login 
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
    }
}

// Forgot Password

const forgotPasswordController = async (req,res)=>{
    try {
        const {email,answer, newPassword} = req.body
        if(!email){
            res.status(400).send({
                message:'Email is Required'
            })
        }
        if(!answer){
            res.status(400).send({
                message:'Answer is Required'
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:'New Password is Required'
            })
        }
        //Check 
        const user = await userModel.findOne({email,answer})
        // validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email Or Amswer'
            })
        }
        const hashed = await hashpassowrd(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success: true,
            message:'Password Reset Successfully'
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:'Something Went Wrong',
            error
        })
    }
}

//Test Controller
const testController = (req,res)=>{
    res.send('Protected Routes')
}

// Update Profile
const updateProfileController = async (req,res) => {
    try {
        const {name, email, password, address, phone} = req.body
        const user = await userModel.findById(req.user._id)
        // Password
        if(password && password.length < 6){
            return res.json({error: 'Password is required and 6 Charater long'})
        }
        const hashedPassword = password ? await hashedPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name, // agr name milta h to name ko update karo wrna pehle se jo name h wohi rehne do.
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        },{new:true})
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUser
        })
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error While Updating Profile',
            error
        })
    }
}

// Orders
const getOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Geting Orders',
            error
        })
    }
}
// All Orders
const getAllOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt: "-1" }) // sort m jo latest hoga wo top pe show kare ga.
        res.json(orders)
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Geting All Orders',
            error
        })
    }
}
// Order Status Update
const orderStatusController = async (req,res) => {
    try {
        const {orderId} = req.params
        const {status} = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true}) // update k time new ki property add krni hoti h.
        res.json(orders)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error While Updating Order',
            error
        })
    }
}
module.exports={
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
};