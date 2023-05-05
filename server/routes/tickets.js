const express = require('express');
const router = express.Router();
const axios = require('axios');

// List todos API
router.get('/todos', async (req, res) => {
    try{
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        res.status(200).json(response.data);
    } catch(err){
        res.status(400).json({ message: err.message });
    }
});

// View todo API
router.get('/todos/:id', async(req, res) => {
   try{
       const id = req.params.id;
       const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
       res.status(200).json(response.data);
   }catch (err){
       res.status(400).json({ message: err.message });
   }
});

module.exports = router;