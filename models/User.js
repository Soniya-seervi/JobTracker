import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email : {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator:validator.isEmail,
            message:'Please provide valid email'
        },
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    lastName : {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
        default: 'lastName'
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'myCity'
    }
})

// Before saving the document, we run some kind of functionality

UserSchema.pre('save', async function(){
    const salt  = await bcrypt.genSalt(10)     // generates extra 10 characters which will make the password safe
    this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('User', UserSchema)