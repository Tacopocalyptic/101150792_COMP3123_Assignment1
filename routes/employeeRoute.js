const express = require('express')
const router = express.Router()
const empModel = require('../models/employeeModel')
const { body, query, param, matchedData, validationResult } = require('express-validator')


// Employee Management

router
    .route('')

    // get all employees
    .get(async (req, res) =>{
        try {
            const emps = await empModel.find()
            res.status(200).json({status: true, Employees: emps})
        } catch (err) {
            res.status(500).send({status: false, message: err.message})
        }
    })

    // create new employee
    .post([
            body('first_name', 'First name cannot be empty').trim().notEmpty(),
            body('last_name', 'Last name cannot be empty').trim().notEmpty(),
            body('email', 'Invalid email format').trim().optional().isEmail(),
            body('salary', 'Salary must be integer value, minimum 0').optional().isInt({min:0}),
            body('date_of_joining', 'Must be date format').optional().isISO8601().toDate(),
            body('position').trim().optional(),
            body('department').trim().optional()
        ], async (req, res) =>{
        // Validate request
        const errors = validationResult(req)
        if(!errors.isEmpty()) {return res.status(400).json({status: false, errors: errors.array()})}

        // save to db
        try {
            const emp = new empModel(matchedData(req))
            await emp.save()
            res.status(201).json({status: true,  message: "Employee created successfully.", employee_id: emp._id})
        } catch (err) {
            res.status(500).json({status: false, message: err.message})
        }
    })
    
    // delete emp by ID
    .delete([query('eid').notEmpty()], async (req, res) => {
        // Validate request
        let eid = matchedData(req).eid
        if(!eid) {return res.status(400).json({status: false, message: "No employee id sent"})}
        
        // delete from db
        try {
            const emp = await empModel.findByIdAndDelete(eid)
            if(!emp){return res.status(400).json({status: false, message: `No employee with ID ${eid} found`})}
            // Using 200 status instead of 204 to return message
            res.status(200).json({status: true, message: "Employee deleted successfully."})
        } catch (err) {
            res.status(500).send({status: false, message: err.message})
        }
    })


router
    .route('/:eid')

    // get employee details by ID
    .get(param('eid').isString(), async (req, res) => {
        let eid = matchedData(req).eid;
        // Validate request - maybe redundant since this would re-route to previous GET??
        if(!eid) {return res.status(400).json({status: false, message: "No employee id"})}

        try {
            const emp = await empModel.findById(eid)
            res.status(200).json({status: true, employee: emp})
        } catch (err) {
            res.status(500).send({status: false, message: err.message})
        }
    })

    // update employee details by ID
    .put([
            param('eid').isString(),
            body('first_name', 'First name cannot be empty').trim().optional(),
            body('last_name', 'Last name cannot be empty').trim().optional(),
            body('email', 'Invalid email format').trim().optional().isEmail(),
            body('salary', 'Salary must be integer value, minimum 0').optional().isInt({min:0}),
            body('date_of_joining', 'Must be date format').optional().isISO8601().toDate(),
            body('position').trim().optional(),
            body('department').trim().optional()
        ], async (req, res) => {
        let eid = matchedData(req).eid;
        let data = matchedData(req)
        // Validate request
        if(!eid || !data) {return res.status(400).json({status: false, message: "Employee parameters missing"})}
        const errors = validationResult(req)
        if(!errors.isEmpty()) {return res.status(400).json({status: false, errors: errors.array()})}
    
        try {
            const emp = await empModel.findByIdAndUpdate(eid, data)
            emp.save()
            res.status(200).json({status: true, message : 'Employee details updated successfully' })
        } catch (err) {
            res.status(500).send({status: false, message: err.message})
        }
    })

module.exports = router