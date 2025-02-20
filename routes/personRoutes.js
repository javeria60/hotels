const express = require('express');

const router = express.Router();

const Person = require('../models/person');

const passport = require('./auth');

//post route for /person

router.post('/', async (req, res) =>{
    try{
        const data = req.body;
        const newPerson = new Person(data);

        const response = await newPerson.save();
        console.log('data saved',response);
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});


//get route for /person

// router.get('/', async (req,res) => {
//     try{
//         const data = await Person.find();
//         console.log("Data fetched:");
//         res.status(200).json(data);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: "internal server error"});
//     }
// });

//prints unauthorized
router.get('/', passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });

        const data = await Person.findOne({ username: user.username });;
        res.status(200).json(data); 
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
});

//prints incorrect username or password
// router.get('/', (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err) return res.status(500).json({ error: 'Internal server error' }); 
//         if (!user) return res.status(401).json({ error: info.message }); 

//         req.user = user; 
//         next(); 
//     })(req, res, next);
// }, async (req, res) => {
//     try {
//         const user = req.user; 
//         const data = await Person.findOne({ username: user.username });
//         res.status(200).json(data); 
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal server error' }); 
//     }
// });



//get route for /person/worktype

router.get('/:worktype', async (req,res) =>{
    try{
        const workType = req.params.worktype;
        if (workType === 'chef' || workType === 'manager' ||workType =='waiter'){
            const response = await Person.find({work: workType});

            console.log('response fetched')
            res.status(200).json(response);
        }else{
            res.status(404).json({error: "invalid work type"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

//put route for update /person


router.put('/:id', async (req, res) =>{
    try{
        const personId = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true,
        });
        if(!response){
            return res.status(404).json({error: 'person not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});


//delete route for delete /person
router.delete('/:id', async (req, res) =>{
    try{
        const personId = req.params.id;

        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            return res.status(404).json({error: 'person not found'});
        }
        console.log('data delete');
        res.status(200).json({msg: 'person deleted succesfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});



module.exports = router;