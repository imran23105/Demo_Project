class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  static success(res, message = 'Success', data = null, statusCode = 200, meta = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, meta));
  }

  static created(res, message = 'Created', data = null) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  static paginated(res, message, data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const meta = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
    return res.status(200).json(new ApiResponse(200, message, data, meta));
  }
}

module.exports = ApiResponse;
