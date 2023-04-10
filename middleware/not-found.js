const notFoundMiddleware = (req, res) => 
    res.status(404).send('Route does not exist')

    export default notFoundMiddleware

// This will be looking for the requests that do not match any of our current routes