require('dotenv').config()
const express=require('express');
const path=require("path");
const app=express();
const port=process.env.PORT || 3000;
const mongoose=require('mongoose');
const authRoutes=require('./routes/authRoutes')
const cookieParser=require('cookie-parser')
const {requireAuth,checkUser}=require('./middlewares/authmiddlewares')
// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
// Set template engine
var engines=require("@ladjs/consolidate");
// For serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set the view directory
app.set('views', __dirname + '/views');
app.engine('html', engines.ejs);
app.set('view engine', 'html');
// Connect our server with mongo-DB using mongoose
const connectDB=async()=>{
    try {
        const conn = await mongoose.connect(process.env.SECRET,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log('We connect with database successfully!');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
// Endpoints
app.get('*',checkUser)
app.get('/',(req,res)=>{
    try{
        res.status(200).render('index.html')
    }catch(error){
        console.log(error)
    }
});
app.use(authRoutes)
// Start the server
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`The application started successfully on https://localhost:${port}`)
    })
})