const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });
};

const generateTokenPair = (id) => {
  return {
    accessToken: generateAccessToken(id),
    refreshToken: generateRefreshToken(id),
  };
};

module.exports = { generateAccessToken, generateRefreshToken, generateTokenPair };
