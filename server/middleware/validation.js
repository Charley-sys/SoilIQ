// server/middleware/validation.js
const validateSoilReading = (req, res, next) => {
  const { pH, nitrogen, phosphorus, potassium } = req.body;

  const errors = [];

  if (pH === undefined || pH < 0 || pH > 14) {
    errors.push('pH must be between 0 and 14');
  }

  if (nitrogen === undefined || nitrogen < 0) {
    errors.push('Nitrogen must be a positive number');
  }

  if (phosphorus === undefined || phosphorus < 0) {
    errors.push('Phosphorus must be a positive number');
  }

  if (potassium === undefined || potassium < 0) {
    errors.push('Potassium must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = { validateSoilReading };