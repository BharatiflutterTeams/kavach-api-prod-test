const rateLimit = require("express-rate-limit");


exports.limiter = rateLimit({
    windowMs: (process.env.RATELIMITING_MIN) * 60 *1000,
  max:process.env.RATELIMITING_MAX,
  status : 429,
  message: "Too many requests from this IP, please try again after 1 minutes"
});

