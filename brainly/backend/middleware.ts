const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const userMiddleware = async (req: any, res: any, next: any) => {
  const header = req.headers["authorization"];

  try {
    const decoded = jwt.verify(header as string, JWT_SECRET);

    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized Access",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized Access",
    });
  }
};

module.exports = {
  userMiddleware,
};