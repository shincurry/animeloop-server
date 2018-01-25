class Response {
  static returnSuccess(message, data) {
    return {
      status: 'success',
      data,
    };
  }

  static returnError(statusCode, message) {
    return {
      status: 'error',
      error: {
        code: statusCode,
        message,
      },
    };
  }

  static handleResponse(res) {
    return (err, data) => {
      if (err) {
        res.json(Response.returnError(500, err.message));
        return;
      }
      res.json(this.returnSuccess('success', data));
    };
  }
}

module.exports = Response;
