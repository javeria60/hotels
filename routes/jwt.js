const jwt = require('jsonwebtoken');
require('dotenv').config();


//to verify token 
const jwtAuthMiddleware = (req, res, next) =>{

    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Token Not Found'});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'unauthorized'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({msg:'Invalid Token'})
    }
}

//to generate token

const generateToken = (userdata) =>{

    return jwt.sign(userdata, process.env.JWT_SECRET)
}

module.exports = {jwtAuthMiddleware, generateToken};