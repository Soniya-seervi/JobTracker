import {StatusCodes} from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err.message)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later'
    }
    // Checking for empty fields
    if(err.name === "ValidationError"){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        // defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',')
    }

    // Checking for unique fields
    if(err.code && err.code === 11000){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }

    // Checking for empty values in container

    // res.status(defaultError.statusCode).json({msg: err})
    res.status(defaultError.statusCode).json({msg: defaultError.msg})

}

export default errorHandlerMiddleware


// Looks for error that are existing in our current router