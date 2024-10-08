const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const Todo = new mongoose.model('Todo', todoSchema);

// Get all the todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find(); // Fetch all todos
        res.status(200).json(todos); // Return todos
    } catch (err) {
        res.status(500).json("There was a server-side error!"); // Error handling
    }
});

// Get todo by id
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id); // Find todo by ID
        if (!todo) {
            return res.status(404).json('Todo not found!'); // If todo not found
        }
        res.status(200).json(todo); // Return the found todo
    } catch (err) {
        res.status(500).json("There was a server-side error!"); // Error handling
    }
});

// Post a todo
router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(200).json('Todo was inserted successfully!'); // Successful insertion response
    } catch (err) {
        res.status(500).json("There was a server-side error!"); // Error handling
    }
});

// Post multiple todos.
router.post('/all', async (req, res) => {
    try {
        await Todo.insertMany(req.body); // Insert multiple todos
        res.status(200).json('Todos were inserted successfully!'); // Successful insertion response
    } catch (err) {
        res.status(500).json('There was a server-side error!'); // Error handling
    }
});

// Put todo
router.put('/:id', async (req, res) => {
    try {
        const result = await Todo.updateOne(
            { _id: req.params.id }, // Accessing the todo ID from the URL parameters
            { $set: req.body } // Update fields with the data from the request body
        );

        // Check if any document was modified
        if (result.modifiedCount === 0) {
            return res.status(404).json('Todo not found or no changes made!'); // No document was found to update
        }

        res.status(200).json('Todo was updated successfully!'); // Successful update response
    } catch (err) {
        res.status(500).json('There was a server-side error!'); // Error handling
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const result = await Todo.deleteOne({ _id: req.params.id }); // Use deleteOne to remove the todo by ID

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json('Todo not found!'); // No document was found to delete
        }

        res.status(200).json('Todo was deleted successfully!'); // Successful deletion response
    } catch (err) {
        res.status(500).json('There was a server-side error!'); // Error handling
    }
});

module.exports = router;
