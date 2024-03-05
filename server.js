const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const morgan = require("morgan");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
//connect to database
const dbConnection = require("./config/database");

dbConnection();

//route
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");

//express app
const app = express();

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is : ${process.env.NODE_ENV}`);
}

//to parse any encoded string to js object to read it
app.use(express.json());

/*app.post("/", );
  app.get("/", (req, res) => {
  res.send("My API2");
});*/

//Mount Rotues

// if there isn`t any error then it will enter here
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

//if it ask for route not in my routes
app.use("*", (req, res, next) => {
  //create error and send to error handlling middleware
  //const err = new Error (`Cannot find this route : ${req.originalUrl}`)
  ////send it to middleware of handlling error
  //next(err.message)

  //we always want to send both message and status code so make class
  next(new ApiError(`Cannot find this route : ${req.originalUrl}`, 400));
});

//Global Error handeling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

//Events happen when error out express occured as dbconnection so we need to listen on these events => list callback(error)
//listen on it -- make callback function to handle this error
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  //if there are requests runing or pending it finish it frst then close
  server.close(() => {
    //stop app
    console.error("Shutting down ..... ");
    process.exit(1);
  });
});
