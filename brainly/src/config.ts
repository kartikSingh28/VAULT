const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URL = process.env.MONGO_URL;


if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

if (!MONGO_URL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};