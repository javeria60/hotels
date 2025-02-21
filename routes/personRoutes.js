const express = require('express');

const router = express.Router();

const Person = require('../models/person');

const { jwtAuthMiddleware } = require('./jwt'); 



const passport = require('./auth');
const { generateToken } = require('./jwt');

//signup route for /person

router.post('/signup', async (req, res) =>{
    try{
        const data = req.body;
        const newPerson = new Person(data);

        const response = await newPerson.save();
        console.log('data saved',response);

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is:", token);

        res.status(200).json({response: response, token: token}); 
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
})

//login route for /person
router.post('/login', async (req, res) =>{
    try{
        const {username, password} = req.body;
        console.log("Request Body:", req.body);

        const user = await Person.findOne({username: username});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Incorrect Username or Password'});
        }

        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.json({token})
    }
    catch(err){
        console.error(err);
        return res.status(500).json({error:'Internal Server Error'})
    }
});

//profile route for /person
router.get('/profile', jwtAuthMiddleware, async (req, res) =>{
    try{
        const userdata = req.user;
        const userId = userdata.id;
        const user = await Person.findById(userId);
        console.log("user", user)

        res.status(200).json({user});
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//get route for /person
router.get('/', jwtAuthMiddleware, async (req,res) => {
    try{
        const data = await Person.find();
        console.log("Data fetched:");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});
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