const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        default: () => this.username || this.email.split('@')[0]
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if(value.length<5) {
                throw new Error("Email must be at least 5 characters!");
            }
            // TODO - maybe regex check for @ and .
        }
    },
    password: {
        // TODO - hashing??
        type: String,
        required: true
    },
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
userSchema.pre('save', function(next) {
    this.updated_at = Date.now()
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User