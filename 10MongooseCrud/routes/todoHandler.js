
const express=require('express');
const router = express.Router();
const  mongoose = require('mongoose');
const todoSchema=require('../schemas/todoSchema');
const Todo = new mongoose.model('Todo',todoSchema);


//get all the todos
router.get('/', async(req,res)=>{

});

//get todo by id
router.get('/:id', async(req,res)=>{

});


//post a todo
router.post('/', async(req,res)=>{

    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(200).json('todo was inserted successfully!');
    } catch (err) {
        res.status(500).json("There was a server-side error!");
    }

})


//post multiple todo.
router.post('/all', async(req,res)=>{
    try{
       await Todo.insertMany(req.body);
       res.status(200).json('todo was inserted successfully!');
    }catch(err){
        res.status(500).json('there were a server side error!')
    }
});


//put todo
router.put('/', async(req,res)=>{
    try{
        const result = await Todo.updateOne(
            {_id:req.params.id},
            {$set:{status:"active"}},
        );
        if(result.modifiedCount==0){
            return res.status(404).json('todo not found or no changes model!')
        }
        res.status(200).json('Todo was updated successfully!');
    }catch(err){
        res.status(500).json('there were a server side error!')
    }
});


//delete todo
router.delete('./:id', async(req,res)=>{

})

module.exports=router;