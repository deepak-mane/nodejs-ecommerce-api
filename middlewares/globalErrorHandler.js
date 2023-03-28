export const globalErrorHandler = (err, req, res, next) => {
    // stack
    // message
    const stack = err?.stack
    const statusCode = err?.status ? err?.status: 500
    const message = err?.message

    return res.status(statusCode).json({
        stack,
        message,
    })
}
// 404 Handler
export const notFound = ( req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`)
    next(err)
}