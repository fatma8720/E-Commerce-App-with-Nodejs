const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require('../utils/apiError')
const Product= require('../models/productModel');
const CategoryModel = require("../models/categoryModel");
const factory = require('./handlersFactory')


//@desc  Get list of products
//@route GET /api/v1/products
//@access public
exports.getProducts = asyncHandler(async (req, res) => {
  //pagenation
  //*1 to convert it to number from string 
  const page = req.query.page *1 || 1 ;
  const limit = req.query.limit *1 || 5;
  //(2-1)*5=5
  const skip = (page - 1)*limit;

  const products = await Product.find({}).skip(skip).limit(limit).populate({
    path: "category",
    select: "name -_id",
  });
  res.status(200).json({ results: products.length, page ,data: products });
});


//@desc Get list of products by category
//@route GET /api/v1/products
//@access public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
  
    const categoryId = req.query.category;
  
    const products = await Product.find({ category: categoryId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name -_id",
      });
  
    res.status(200).json({ results: products.length, page, data: products });
  });




//@desc  Get specific Product by id 
//@route GET /api/v1/products/:id
//@access public

exports.getProduct = factory.getOne(Product);

/* exports.getProduct = asyncHandler(async (req, res ,next) => {
    //const id = req.query.id; or ..
    const {id} = req.params;
    const product = await Product.findById(id).populate({
        path: "category",
        select: "name -_id",
      });
    if (!product){
        //res.status(404).json({msg:`Product with this id Not Found ${id}`});
        //return to pass error and stop don`t complete
       return next(new ApiError(`No Product found with this id : ${id}`,404))
    }
    
        res.status(200).json({ data: product});
});
 */





//@desc Create product
//@route POST  /api/v1/products
//@access private

//async and await is better than then and catch and try and catch

exports.createProduct= factory.createOne(Product);

/* exports.createProduct = asyncHandler(async (req, res) => {
   req.body.slug = slugify(req.body.productName);
 
  //async await
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
}); */




//@desc  Update specific product by id 
//@route PUT /api/v1/products/:id
//@access private

exports.updateProduct =factory.updateOne(Product);

/* exports.updateProduct = asyncHandler(async (req, res,next) => {
    if (req.body.productName){
        req.body.slug = slugify(req.body.productName)
    }
    const {id} = req.params;
    //filteration , update what , options
    const product= await Product.findOneAndUpdate(
        {_id : id},
        req.body,
        {new : true}//return product after making update not before 
        );
        if (!product){
            return next(new ApiError(`No product found with this id : ${id}`,404))
        }
        
            res.status(200).json({ data: product });

});
 */




//@desc  Delete specific product by id 
//@route DELETE/api/v1/products/:id
//@access private

exports.deleteProduct =factory.deleteOne(Product);

/* exports.deleteProduct = asyncHandler(async (req, res,next) => {
    const {id} = req.params;
    //filteration , update what , options
    const product = await Product.findByIdAndDelete(id);
        if (!product){
            return next(new ApiError(`No product found with this id : ${id}`,404))
        }
        
            res.status(204).send();

}); */
