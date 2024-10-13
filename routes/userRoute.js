const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel')
const { body, matchedData, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

// User Management

// create new account
router.post('/signup', [
        body('username').trim().optional(),
        body('password').notEmpty().isString().customSanitizer(async val => {
            return await bcrypt.hash(val, 12)
        }), // 'strong password' verification can be done before hashing
        body('email', 'Must be valid email format').trim().isEmail()
    ], async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({status: false, errors: errors.array()})}

    let data = matchedData(req) 
    try {
        const user = new userModel(data)
        await user.save()
        res.status(201).json({status: true, message: "User created successfully.", user_id: user._id})
    } catch (err) {
        res.status(500).json({status: false, error: err.message})
    }
})


// allow user to access the system
router.post('/login', [
        body('username').trim().optional(),
        body('password').notEmpty().isString(),
        body('email', 'Must be valid email format').trim().optional().isEmail()
    ], async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({status: false, errors: errors.array()})}

    let data = matchedData(req)
    try {
        const user = await userModel.findOne({ $or: [{username: data.username}, {email: data.email}]})
        console.log(data.password, user.password, user)
        if (!user){
            res.status(400).json({status: false, message: 'Invalid username or email.'})
        } else if (!await bcrypt.compare(data.password, user.password)){             
            res.status(401).json({status: false, message: 'Invalid password.'}) 
        } else {
            res.status(200).json({status: true, message: "Login successful"}) // TODO - jwt token return
        }
    } catch (err) {
        res.status(500).json({status: false, error: err.message})
    }
})


module.exports = router