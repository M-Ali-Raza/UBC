require('dotenv').config()
const jwt=require('jsonwebtoken')
const User = require('../models/User')

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt

    //check json web token exists & is verified
    if(token){
        jwt.verify(token,process.env.TOKEN_KEY, async (error,decodedToken)=>{
            if(error){
                res.redirect('/')
            }else{
                let user= await User.findById(decodedToken.id)
                res.locals.user=user
                // next()
                req.user=decodedToken.id
            }
        })
        next()
    }else{
        res.redirect('/')
    }
}

// check current user
const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt

    //check json web token exists & is verified
    if(token){
        jwt.verify(token,process.env.TOKEN_KEY, async (error,decodedToken)=>{
            if(error){
                res.locals.user=null
                next()
            }else{
                let user= await User.findById(decodedToken.id)
                res.locals.user=user
                // req.user=decodedToken.id
                next()
            }
        })
    }else{
        res.locals.user=null
        next()
    }
}
module.exports={requireAuth,checkUser}