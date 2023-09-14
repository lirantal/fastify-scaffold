class ApiError extends Error {
  constructor(statusCode = 500, message = "Internal Server Error") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
