class HttpError extends Error {
    constructor(statusCode, message, data = null) {
        super(message)
        this.name = 'HttpError'
        this.statusCode = statusCode
        this.data = data
    }
}

export default HttpError
