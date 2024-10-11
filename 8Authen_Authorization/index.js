
const cookieParser=require('cookie-parser');
const express=require('express');
const cors=require('cors');
const app=express();


//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//cookie set and read.

//route in get
app.get('/',(req,res)=>{
    // res.send('the port is running');
    res.cookie("name","salman");
    res.send('done')
});

app.get('/read',(req,res)=>{
    console.log(req.cookies)
    res.send("read page");
})


//running port
app.listen(3000,()=>{
    console.log(`the port is running 3000`);
});