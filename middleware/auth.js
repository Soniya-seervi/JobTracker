import { UnAuthenticatedError } from "../errors/index.js";
import jwt from 'jsonwebtoken'

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnAuthenticatedError("Authentication invalid")
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attaching the user request object
        const testUser = payload.userId === '6444e1a2007d0c717eecfbd5'
        req.user = {userId: payload.userId, testUser}
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid, token not verified')
    }
}

export default auth