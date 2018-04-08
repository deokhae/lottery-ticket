class BadRequestError extends Error {
  constructor(err) {
    super(err);

    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;