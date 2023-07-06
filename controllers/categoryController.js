const categoryModel = require("../models/categoryModel");
const slugify = require('slugify');

const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message:'Name is Required'
            })
        }
        // Check Existing Category
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category Already Exists'
            })
        }
        const category = await new categoryModel({name, slug: slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'New Category Created',
            category
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message:'Error in Category',
            error
        })
    }
};

// Update Category
const updateCategoryController = async (req, res) =>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id, {name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message:"Error While Updateing Category",
            error
        })
    }
}

// Get All Category 
const categoryController = async (req,res)=>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"All Category List",
            category
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:"Error While Getting All Categories",
            error
        })
    }
}

// Single Category
const singleCategoryController = async (req,res) =>{
    try {
        const category  = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message: 'Get Single Category Successfully',
            category
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error While Single Category',
            error
        })
    }
}

// Delete Category 
const deleteCategoryController = async (req,res) =>{
    try {
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message: 'Category Deleted Successfully'
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error While Deleting Category',
            error
        })
    }
}
module.exports = {
    createCategoryController,
    updateCategoryController,
    categoryController,
    singleCategoryController,
    deleteCategoryController
};
