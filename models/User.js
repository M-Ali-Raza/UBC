const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
// Create an array of object to save stored item name and price
var Item = new Schema({
    itemname: {
        type: String,
        required: true,
        unique: true
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
        unique: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
})
// Create a main collection to store all data used in UBC
var User = new Schema({
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
User.plugin(passportLocalMongoose); 
module.exports = mongoose.model('User', User)