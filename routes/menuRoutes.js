const express = require('express');

const router = express.Router();

const MenuItem = require('../models/MenuItem');



//post method for /menu
router.post('/', async (req, res)=>{
    try{
        const data = req.body
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();

        console.log('data saved');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

//get method for /menu
router.get('/', async (req, res) =>{
    try{
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

//get method for /menu/testtype

router.get('/:tasteType', async(req,res) =>{
    try{
        const tasteType = req.params.tasteType;
        if (tasteType === 'sweet' || tasteType === 'spicy' ||tasteType =='sour'){
            const response = await MenuItem.find({taste: tasteType});

            console.log('response fetched')
            res.status(200).json(response);
        }else{
            res.status(404).json({error: "invalid taste type"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

//put method for update /menu
router.put('/:id', async (req, res) =>{
    try{
        const menuId = req.params.id;
        const updatedMenuData = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
            new: true,
            runValidators: true,
        });
        if(!response){
            return res.status(404).json({error: 'menu not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});
//delete method for delete /menu
router.delete('/:id', async (req, res) =>{
    try{
        const menuId = req.params.id;

        const response = await MenuItem.findByIdAndDelete(menuId);

        if(!response){
            return res.status(404).json({error: 'menu not found'});
        }
        console.log('data delete');
        res.status(200).json({msg: 'menu deleted succesfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

module.exports = router;
