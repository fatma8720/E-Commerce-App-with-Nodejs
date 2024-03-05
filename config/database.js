const mongoose = require("mongoose");
//database connection
const dbConnection = () => {
    mongoose.connect(process.env.DB_URL)
    .then((conn) => {
      console.log(`Database Connected : ${conn.connection.host}`);
    })
/*     .catch((err) => {
      console.log(`Database Error: ${err}`);
      //stop app
      process.exit(1);
    }); */
    
};

module.exports = dbConnection;
