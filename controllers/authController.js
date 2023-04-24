import User from "../models/User.js"
import {StatusCodes} from 'http-status-codes'
import {BadRequestError, UnAuthenticatedError} from '../errors/index.js'
import attachCookie from "../utils/attachCookies.js"

const register = async(req, res) => {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            throw new BadRequestError('please provide all values')
        }

        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists){
            throw new BadRequestError('Email already in use')
        }

        const user = await User.create({name, email, password})
        const token = user.createJWT()
        attachCookie({res,token})
        res.status(StatusCodes.CREATED).json({
            user:{
                email:user.email, 
                lastName: user.lastName, 
                location: user.location, 
                name:user.name
            }, 
            location:user.location})
}

const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({ email }).select('+password')   // We select password to get from user, as else, we can't compare the passwords(as by default we are not getting the password as we have defined the select property as fa;se in User.js)
    if(!user){
        throw new UnAuthenticatedError('Invalid Credentials')
    }
    
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    user.password = undefined   // This is being done so that we do not get the password in response

    attachCookie({res,token})
    res.status(StatusCodes.OK).json({user, location:user.location})

    // res.send('login user')
}

const updateUser = async(req, res) => {
    const {email, name, lastName, location} = req.body
    if(!email || !name || !lastName || !location){
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({_id: req.user.userId})

    user.email = email
    user.name = name
    user.lastName = lastName 
    user.location = location

    await user.save()

    const token = user.createJWT()
    attachCookie({res,token})
    res.status(StatusCodes.OK).json({user, location:user.location})
    // res.send('updateUser user')
}

const getCurrentUser = async(req, res) => {
    const user = await User.findOne({_id: req.user.userId})
    res.status(StatusCodes.OK).json({user, location:user.location})
}

const logout = async(req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'})
}

export {register, login, updateUser, getCurrentUser, logout}
