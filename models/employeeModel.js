const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    position: String,
    salary: {
        type: Number,
        min: 0 // volunteer, maybe? :P
    },
    date_of_joining: Date,
    department: String,
    created_at: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updated_at: {
        type: Date,
        default: () => Date.now()
    }
})
employeeSchema.pre('save', function(next) {
    this.updated_at = Date.now()
    next()
})

const Emp = mongoose.model('Employee', employeeSchema)
module.exports = Emp