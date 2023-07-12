const mongoose = require("mongoose");
const  mongodbErrorHandler =require('mongoose-mongodb-errors')


mongoose.Promise = global.Promise;
mongoose.plugin(mongodbErrorHandler);


mongoose.set('strictQuery', false);

const databaseConnection = () => {
  const dbUri = process.env.DB_URI
  mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `MongoDb Database Connected to the Server`
      );
    })
    .catch((err) => {
         console.log(`Some Database Connection Error Occured :- ${err}`);
    });
};

module.exports = databaseConnection;