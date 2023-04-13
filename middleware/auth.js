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
        req.user = {userId: payload.userId}
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid, token not verified')
    }
}

export default auth