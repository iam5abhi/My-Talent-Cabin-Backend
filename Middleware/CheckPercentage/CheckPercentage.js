const StudentProfile =require('../../Models/StudentProfile/studentProfile')
const Error=require('../../Utils/ErrorHandler/ErrorHandler')

exports.CheckPercentage =async(req,res,next)=>{ 
 const student =await StudentProfile({StudentId:req.data.user._id})
 if(student.status<"75%")return next(new Error('You are not eligible  for The Project InternShip',403));
 next()
}


exports.CheckProfileComplete =async(req,res,next)=>{
  const student =await StudentProfile({StudentId:req.data.user._id})
  if(!student)return next(new Error('Please Complete your Profile',403));
 const {dob,family_occupation,gender,education,Category,campus} =student
   if(dob=='' ||family_occupation=='' || gender=='',education==null || Category==null || campus=='')return next(new Error('Please Complete your Profile',403));
 next()
}