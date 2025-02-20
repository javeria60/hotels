const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    work:{
        type:String,
        enum:['chef', 'waiter', 'manager'],
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type:Number,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

personSchema.pre('save', async function (next){
    const person = this;
    if(!person.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        person.password = await bcrypt.hash(person.password, salt); 
        next();
    }
    catch(err){
        next(err);
    }
});


personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch
    }
    catch(err){
        throw err;
    }
};


const Person = mongoose.model('Person', personSchema);
module.exports = Person;

















// this code didnt works properly in postman post request 
// i share a person with all keys data including username 
// and password but it doesnt change it into hashed password
//  also it saves in db with same password i wrote there and
//  also after that i use that username and password for 
// login but it shows unauthorized



// now it saves in db in hashed form but in postman
//  when i did get request at our api /person and use
//  username and password of any specific person it
//  shows the all person data... which stored in
//  db...why?? and how to fix it 


