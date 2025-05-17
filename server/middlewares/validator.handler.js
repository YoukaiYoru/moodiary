const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      return next(boom.badRequest(error));
    }
    req[property] = value; // assign validated (and possibly sanitized) data
    next();
  };
}
module.exports = validatorHandler;
