import dotenv from "dotenv";
import path from "path";

const envPath = path.join(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

const config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire: process.env.JWT_ACCESS_EXPIRE,
  jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE,
};

export default config;
