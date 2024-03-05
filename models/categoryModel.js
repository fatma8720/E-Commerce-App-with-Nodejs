const mongoose = require("mongoose");

// 1- create schema
const categorySchema = new mongoose.Schema({
    name : {
       type : String,
       required : [true , 'Category required'],
       unique : [true , 'Category must be unique'],
       minlength : [3 , "Too short Category Name"],
       maxlength : [30 , "Too long Category Name"],
    },
    //category name A and B -> url - > shopping/a-and-b 
    //a-and-b slug -> convert capital to small and spaces to - 
    slug : {
        type : String,
        lowercase : true,

    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image : String,
  },
  { timestamps: true }
);

// 2- convert schema to model to use it 

const CategoryModel = mongoose.model("Category",categorySchema);


module.exports = CategoryModel;