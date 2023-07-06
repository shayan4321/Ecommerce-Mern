const express = require('express');
const app = express();
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors')
const authRoutes = require('./routers/authRoute.js');
const categoryRoutes = require('./routers/categoryRoutes');
const productRoutes = require('./routers/productRoutes.js')
const path = require('path'); // this line is use for hosting application

const dotenv = require('dotenv');
const  connectDB  = require('./config/db.js');

app.use(cors());
app.use(express.json())



//Routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

// configure env
dotenv.config();

//database config
connectDB();

//middleware
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build'))) // this line is use for hosting application





// rest api
// app.get('/',(req,res)=>{
//     res.send({
//         messsage: "Welcome to Ecommerce App"
//     })
// })
app.use('*', function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});
// this app.use for hosting application 

//PORT
const PORT = process.env.PORT || 8080;


//run App
app.listen(PORT,()=>{
    // console.log(`Server Running on ${PORT}`.bgCyan.white);
})