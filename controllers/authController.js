require('dotenv').config()
const User=require('../models/User')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');

const maxAge=3*24*60*60
const createToken=(id)=>{
    return jwt.sign({id},process.env.TOKEN_KEY,{
        expiresIn:maxAge
    })
}

module.exports.signup_Post=async (req,res)=>{
    const {username,password}=req.body
    try{
        const user= await User.findOne({username})
        if(user){
            res.status(400).json({message:"User already exist"})
        }else{
            const user= await User.create({username,password})
            const token=createToken(user._id)
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
            console.log('Account created successfully!')
            res.redirect('/')
        }
    }catch(error){
        console.log(error)
    }
}

module.exports.login_Post=async (req,res)=>{
    const {username,password}=req.body
    try{
        const user= await User.findOne({username})
        if(user){
            const auth= await bcrypt.compare(password,user.password)
            if(auth){
                const token=createToken(user._id)
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
                console.log('We login successfully!')
                res.redirect('/')
            }else{
                res.status(400).json({error:"Password doesn't match!"})
            }
        }else{
            res.status(400).json({error:"User doesn't exist!"})
        }
    }catch(error){
        console.log(error)
    }
}

module.exports.logout_Get=async (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    console.log('We logout successfully!')
    res.redirect('/')
}

module.exports.delAccount_Post=async (req,res)=>{
    try{
        const isUser= await User.findOne({id:req.params.id})
        if(req.body.username===isUser.username){
            const user= await User.deleteOne({username:isUser.username});
            console.log("Your account deleted successfully!")
            return res.redirect('/');
        }
        else{
            res.status(400).json({error:"Invalid username"})
        }
    }catch(error){
        console.log(error)
    }
}

module.exports.addAmount_Post=async (req,res)=>{
    try{
        const userId= await User.findOne(req.user)
        const user= await User.updateOne({_id:req.user},{
            $set:{totalAmount: req.body.amount}
        })
        console.log("Total amount added successfully!");
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.addItems_Post=async (req,res)=>{
    try{
        const isUser= await User.findOne(req.user)
        const user= await User.updateOne({_id:req.user},{
            $push:{
                liveTable: {
                    itemname: req.body.item,
                    price: req.body.price
                }
            },
            $unset:{
                lostItem: isUser.lostItem,
                realRemPrice: isUser.realRemPrice
            }
        })
        console.log("Item added successfully!");
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.edit_Get=async (req,res)=>{
    let readQuery=req.params.id
    try{
        const isUser= await User.findOne({'liveTable':{$elemMatch:{'itemname':readQuery}}})
        const user= await User.findOneAndUpdate({'liveTable':{$elemMatch:{'itemname':readQuery}}},{
            $set:{
                'liveTable.$.itemname':req.body.item,
                'liveTable.$.price':req.body.price
            },
            $unset:{
                lostItem: isUser.lostItem,
                realRemPrice: isUser.realRemPrice
            }
        },{new:true}).then(docs=>{
            res.render('edit.html',{readQuery})
        })
    }catch(error){
        console.log(error)
    }
}

module.exports.edit_Post=async (req,res)=>{
    let readQuery=req.params.id
    try{
        const isUser= await User.findOne({'liveTable':{$elemMatch:{'itemname':readQuery}}})
        const user= await User.findOneAndUpdate({'liveTable':{$elemMatch:{'itemname':readQuery}}},{
            $set:{
                'liveTable.$.itemname':req.body.item,
                'liveTable.$.price':req.body.price
            },
            $unset:{
                lostItem: isUser.lostItem,
                realRemPrice: isUser.realRemPrice
            }
        }).then(docs=>{
            console.log("Item edited successfully!");
            return res.redirect('/');
        })
    }catch(error){
        console.log(error)
    }
}

module.exports.delItem_Get=async (req,res)=>{
    let readQuery=req.params.id
    try{
        const user= await User.findOneAndUpdate({'liveTable':{$elemMatch:{'itemname':readQuery}}},{
            $pull:{
                liveTable: {
                    itemname: readQuery
                }
            }
        },{new:true})
        console.log("Item deleted successfully!")
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.save_Post=async (req,res)=>{
    try{
        const isUser=res.locals.user
        const userId= await User.findOne(req.user)
        const user= await User.updateOne({_id:req.user},{
            $push:{
                billlist:{
                    createdDate: new Date(),
                    totalAmount: isUser.totalAmount,
                    spentPrice: req.body.spentPrice,
                    remPrice: req.body.remPrice,
                    itemlist: isUser.liveTable,
                }
            }
        })
        console.log("Your bill saved successfully!")
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.help_Post=async (req,res)=>{
    try{
        const isUser= await User.findOne(req.user)
        const user= await User.updateOne({_id:req.user},{
            lostItem: req.body.lostItem,
            realRemPrice: req.body.realRemPrice
        })
        console.log('Your item price calculated successfully!')
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.clear_Get=async (req,res)=>{
    try{
        const isUser= await User.findOne(req.user)
        const user= await User.updateOne({_id:req.user},{
            $unset:{
                lostItem: isUser.lostItem,
                realRemPrice: isUser.realRemPrice
            }
        })
        console.log('Item name and actual remaining amount fields cleared successfully!')
        return res.redirect('/');
    }catch(error){
        console.log(error)
    }
}

module.exports.history_Get=async (req,res)=>{
    try{
        res.status(200).render('history.html')
    }catch(error){
        console.log(error)
    }
}

module.exports.view_Get=async (req,res)=>{
    let readQuery=req.params.id
    try{
        res.status(200).render('bills.html',{readQuery})
    }catch(error){
        console.log(error)
    }
}

module.exports.delBill_Get=async (req,res)=>{
    let readQuery=req.params.id
    try{
        const user= await User.findOneAndUpdate({'billlist':{$elemMatch:{'_id':readQuery}}},{
            $pull:{
                billlist: {
                    _id: readQuery
                }
            }
        },{new:true})
        console.log('Your saved bill deleted successfully!')
        return res.redirect('/history');
    }catch(error){
        console.log(error)
    }
}
