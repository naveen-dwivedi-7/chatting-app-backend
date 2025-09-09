const User = require("../models/user");
const jwt = require('jsonwebtoken')

const auth =async (req, res, next)=>{
    try{
      const bearerHeader=req.header['authorization']
      console.log("bearerheader")
      console.log(bearerHeader)
      if(typeof bearerHeader!='undefined'){
        const bearer=bearerHeader.split('')
        const token=bearer[1]
        const user =jwt.verify(token,process.env.JWT_SECRET)
        console.log(user)
        req.token=user
        next()
      }
      else{
        res.status(401).json({message : 'No Token provided'})
      }
    }
    catch{
        res.status(403).json({message : 'Invalid or Expired Token'})
    }

};
module.exports=auth