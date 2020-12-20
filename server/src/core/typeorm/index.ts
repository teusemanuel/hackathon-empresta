// @tsed/cli do not edit
import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";
import * as defaultConfig from "./default.config.json";

const defaultConnectionConfig = {
  host: process.env.DB_HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  synchronize: process.env.NODE_ENV === "development"
};
const connection = {...defaultConfig, ...defaultConnectionConfig};

export default [connection as MysqlConnectionOptions];
