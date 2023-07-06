const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Protected Routes token Base
//Requied Token At the time of signin
const requireSignIn = async (req, res, next)=>{
    try {
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET) //  verify is use for compare
        req.user = decode; // decrypt user.
        next()
    } catch (error) {
        //console.log(error);
    }

}
// Check Admin Success.
const isAdmin = async (req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id) // req.user._id get id when Login Successfully, and user object passed when login user.
        // role is for db column, and role 1 for admin & 0 for user.
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:'Unauthorized Access'
            })
        }else{
            next();
        }
    } catch (error) {
        //console.log(error);
        res.status(401).send({
            success:false,
            message:'Error in MiddleWare',
            error,
        })
    }
}
module.exports={
    requireSignIn,
    isAdmin
};
