
const express=require('express');
const mongoose=require('mongoose');
const todoHandler=require('./routes/todoHandler');


const app=express();
app.use(express.json());

//database connection with mongoose
mongoose
    .connect('mongodb://localhost/todos')
    .then(()=>console.log('connecting successfully '))
    .catch(err=>console.log('Database connection error:',err));


//application routes
app.use('/todo',todoHandler)


//default error handler
function errorHandler(err,req,res,next){
    if(res.headerSent){
        return next(err);
    }
    res.status(500).json({err:err.message});
}



app.listen(3000,()=>{
    console.log('app listening at port 3000');
})