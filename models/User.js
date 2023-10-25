const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
// Create an array of object to save stored item name and price
var Item = new Schema({
    itemname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
})
// Create an array of object to get all data from liveTable
var Bill = new Schema({
    createdDate: {
        type: Date,
        default: Date.now
    },
    totalAmount:{
        type: Number,
        required: true,
        default: 0
    },
    spentPrice:{
        type: Number,
        required: true,
        default: 0
    },
    remPrice:{
        type: Number,
        required: true,
        default: 0
    },
    itemlist: [Item]
})
// Create an array of object to store item name and price
var Table =new Schema({
    itemname: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
})
// Create a main collection to store all data used in UBC
var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    liveTable: [Table],
    totalAmount:{
        type: Number,
        required: true,
        default: 0
    },
    lostItem:{
        type: String,
        required: true,
        default: 0
    },
    realRemPrice:{
        type: Number,
        required: true,
        default: 0
    },
    billlist: [Bill]
}) 
// fire a function before saving data in database
UserSchema.pre('save', async function(next){
    const salt= await bcrypt.genSalt()
    this.password= await bcrypt.hash(this.password, salt)
    next()
})
const User=mongoose.model('User',UserSchema)
module.exports=User