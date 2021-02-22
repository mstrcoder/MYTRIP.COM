class APPERROR extends Error{
    constructor(message,statusCode)
    {
        super(message)
        console.log("hello1111");
        this.statusCode = statusCode
        this.status=`${statusCode}`.startsWith('4')?'fail':'error';
        this.isOperational=true;
        console.log(this.statusCode);
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports =APPERROR 