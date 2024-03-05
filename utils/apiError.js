//@desc   this class is resposible for operation error that i can predict

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        //fail 400...else error
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        //i can predict it -- it mean i send it 
        this.isOperational = true;
    }
}
module.exports = ApiError;
