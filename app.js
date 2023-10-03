require('dotenv').config()
const express=require("express");
const path=require("path");
const app=express();
const port=process.env.PORT;
const bcrypt = require('bcrypt');
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
const User=require("./models/User");
// Connect our server with mongo-DB using mongoose
const connectDB=async()=>{
    mongoose.connect(process.env.SECRET);
    var db=await mongoose.connection;
    db.on('error',console.error.bind(console,'connection error:'));
    db.once('open',function(){
    console.log("We connect with database successfully!");
});
}
// mongoose.connect(process.env.SECRET);
// var db=mongoose.connection;
// db.on('error',console.error.bind(console,'connection error:'));
// db.once('open',function(){
//     console.log("We connect with database successfully!");
// });
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(require("express-session")({
    secret:"login to account",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Set template engin
var engines=require("@ladjs/consolidate");
// For serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set the view directory
app.set('views', __dirname + '/views');
app.engine('html', engines.ejs);
app.set('view engine', 'html');
// Endpoints
app.get("/",(req,res)=>{
    res.set({
        'Access-control-Allow-Origin':'*'
    });
    let userid=req.isAuthenticated()
    res.status(200).render('index.html',{
        userid,user:req.user
    })
});
app.post("/signup",async (req,res)=>{
    const existingUser= await User.findOne({username:req.body.username});
    if(existingUser){
        return res.status(400).json({message:"User already exist"});
    }
    else{
        const hashedpassword= await bcrypt.hash(req.body.password,10)
        const user = await User.create({
            username: req.body.username,
            password: hashedpassword,
        });
        console.log("Account is created successfully!")
        return res.redirect('/')
    }
});
app.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({ username: req.body.username });
        if (user) {
             const result= await bcrypt.compare(req.body.password,user.password);
             if (result) {
               req.login(user, function(error) {
                   if (error) return next(error);
                   console.log("We login successfully!");
                   res.redirect("/");
               });
             } 
          else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
    }catch (error) {
        res.status(400).json({ error });
    }
});
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        console.log("We logout successfully!");
        res.redirect('/');
    });
});
app.post("/deleteAccount", async (req,res)=>{
    if(req.body.username===req.user.username){
        const user= await User.deleteOne({username:req.user.username});
        console.log("Your account deleted successfully!")
        res.redirect('/');
    }
    else{
        res.status(400).json({error:"Invalid username"})
    }
});
app.post("/addAmount", async (req,res)=>{
    const user= await User.updateOne({username:req.user.username},{
        totalAmount: req.body.amount
    })
    console.log("Total amount added successfully!");
    res.redirect('/');
});
app.post("/addItems", async (req,res)=>{
    const user= await User.updateOne({username:req.user.username},{
        $push:{
            liveTable: {
                itemname: req.body.item,
                price: req.body.price
            }
        },
        $unset:{
            lostItem: req.user.lostItem,
            realRemPrice: req.user.realRemPrice
        }
    })
    console.log("Item added successfully!");
    return res.redirect('/');
});
app.get("/edit/:id",async (req,res)=>{
    let readQuery=req.params.id
    const user= await User.findOneAndUpdate({'liveTable':{$elemMatch:{'itemname':readQuery}}},{
        $set:{
            'liveTable.$.itemname':req.body.item,
            'liveTable.$.price':req.body.price
        },
        $unset:{
            lostItem: req.user.lostItem,
            realRemPrice: req.user.realRemPrice
        }
    },{new:true}).then(docs=>{
        let userid=req.isAuthenticated()
        res.render('edit.html',{club:docs,userid,user:req.user,readQuery})
    })
});
app.post("/edit/:id",async (req,res)=>{
    readQuery=req.params.id
    const user= await User.findOneAndUpdate({'liveTable':{$elemMatch:{'itemname':readQuery}}},{
        $set:{
            'liveTable.$.itemname':req.body.item,
            'liveTable.$.price':req.body.price
        },
        $unset:{
            lostItem: req.user.lostItem,
            realRemPrice: req.user.realRemPrice
        }
    }).then(docs=>{
        console.log("Item edited successfully!");
        res.redirect('/');
    })
});
app.get("/deleteItem/:id", async (req,res)=>{
    let readQuery=req.params.id
    const user= await User.updateOne({username:req.user.username},{
        $pull:{
            liveTable: {
                itemname: readQuery
            }
        }
    })
    console.log("Item deleted successfully!")
    return res.redirect('/');
});
app.post("/save", async (req,res)=>{
    const user= await User.updateOne({username: req.user.username},{
        $push:{
            billlist:{
                createdDate: new Date(),
                totalAmount: req.user.totalAmount,
                spentPrice: req.body.spentPrice,
                remPrice: req.body.remPrice,
                itemlist: req.user.liveTable,
            }
        }
    })
    console.log("Your bill saved successfully!")
    res.redirect('/');
});
app.post("/help", async (req,res)=>{
    const user= await User.updateOne({username: req.user.username},{
        lostItem: req.body.lostItem,
        realRemPrice: req.body.realRemPrice
    })
    console.log('Your information collected successfully!')
    res.redirect('/');
});
app.get("/clearFields", async (req,res)=>{
    const user= await User.updateOne({username: req.user.username},{
        $unset:{
            lostItem: req.user.lostItem,
            realRemPrice: req.user.realRemPrice
        }
    })
    console.log('Item name and actual remaining amount fields cleared successfully!')
    res.redirect('/');
});
app.get("/history",(req,res)=>{
    let userid=req.isAuthenticated()
    res.status(200).render('history.html',{userid,user:req.user})
});
app.get("/view/:id", async (req,res)=>{
    let readQuery=req.params.id
    let userid=req.isAuthenticated()
    res.status(200).render('bills.html',{userid,user:req.user,readQuery})
});
app.get("/deleteBill/:id", async (req,res)=>{
    let readQuery=req.params.id
    const user= await User.updateOne({username:req.user.username},{
        $pull:{
            billlist: {
                _id: readQuery
            }
        }
    })
    console.log('Your saved bill deleted successfully!')
    return res.redirect('/history');
});
// Start the server
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`The application started successfully!`)
    })
})
// app.listen(port,()=>{
//     console.log(`The application started successfully!`)
// })