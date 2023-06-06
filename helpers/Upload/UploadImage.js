const multer =require('multer')
const Error=require('../../Utils/ErrorHandler/ErrorHandler')


const multerStorage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/assets/images');
    },
    filename:(req,file,cb)=>{
         const ext =file.mimetype.split('/')[1]
         cb(null,`${file.originalname}-${Date.now()}.${ext}`)
    }
})


// Multer Filter 

 const multerFilter =(req,file,cb)=>{
     if(file.mimetype==="image/jpg"||"image/jpeg"||"image/png"){
         cb(null,true)
     }else{
         cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false)
     }
 }


module.exports =Upload =multer({
    storage:multerStorage,
    fileFilter:multerFilter
})
