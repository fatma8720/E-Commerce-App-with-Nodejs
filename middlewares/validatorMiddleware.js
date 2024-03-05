
const {validationResult } = require("express-validator");
//middleware catch error from rules if
const validatoeMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
      next(); // Proceed to getCategory if validation succeeds
  }

  module.exports = validatoeMiddleware;