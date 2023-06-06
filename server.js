require('dotenv').config({path:'./Config/config.env'})
const app =require('./app')



// // conecting the DataBase
const databaseConnection =require('./DataBase/database')
const PORT = process.env.PORT || 8000;

// console.log(`NODE_ENV=${config.NODE_ENV}`,"helllo");





// starting the server
app.listen(PORT,()=>{
    // Calling to the database
    databaseConnection()
    //  start the server
    console.log(`Server Running here 👉 http://localhost:${PORT}`)
})