const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require('../utils/apiError')
const Category = require('../models/categoryModel');
const factory = require('./handlersFactory')

//@desc  Get list of categories
//@route GET /api/v1/categories
//@access public
exports.getCategories = asyncHandler(async (req, res) => {
  //pagenation
  //*1 to convert it to number from string 
  const page = req.query.page *1 || 1 ;
  const limit = req.query.limit *1 || 5;
  //(2-1)*5=5
  const skip = (page - 1)*limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page ,data: categories });
});





//@desc  Get specific category by id 
//@route GET /api/v1/categories/:id
//@access public

exports.getCategory = factory.getOne(Category);

/* exports.getCategory = asyncHandler(async (req, res ,next) => {
    //const id = req.query.id; or ..
    const {id} = req.params;
    const category = await Category.findById(id);
    if (!category){
        //res.status(404).json({msg:`Category with this id Not Found ${id}`});
        //return to pass error and stop don`t complete
       return next(new ApiError(`No Category found with this id : ${id}`,404))
    }
    
        res.status(200).json({ data: category });
}); */






//@desc Create category
//@route POST  /api/v1/categories
//@access private

//async and await is better than then and catch and try and catch
exports.createCategory = factory.createOne(Category);

/* exports.createCategory = asyncHandler(async (req, res) => {
   const {name} = req.body;
  //async await
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
 */



//@desc  Update specific category by id 
//@route PUT /api/v1/categories/:id
//@access private

exports.updateCategory = factory.updateOne(Category);

/* exports.updateCategory = asyncHandler(async (req, res,next) => {
    const {name} = req.body;
    const {id} = req.params;
    //filteration , update what , options
    const category = await Category.findOneAndUpdate(
        {_id : id},
        {name ,slug: slugify(name)},
        {new : true}//return category after making update not before 
        );
        if (!category){
            return next(new ApiError(`No Category found with this id : ${id}`,404))
        }
        
            res.status(200).json({ data: category });

});
 */




//@desc  Delete specific category by id 
//@route DELETE/api/v1/categories/:id
//@access private

exports.deleteCategory = factory.deleteOne(Category);

/* exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const {id} = req.params;
    //filteration , update what , options
    const category = await Category.findByIdAndDelete(id);
        if (!category){
            return next(new ApiError(`No Category found with this id : ${id}`,404))
        }
        
            res.status(204).send();

}); */
