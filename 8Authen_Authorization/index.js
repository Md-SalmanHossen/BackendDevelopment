

const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('the port is running');
})

app.listen(3000,()=>{
    console.log(`the port is running 3000`);
});