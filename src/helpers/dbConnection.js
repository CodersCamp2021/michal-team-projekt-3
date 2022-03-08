import * as productionDbConnection from './productionDbConnection.js';
import * as testDbConnection from './testDbConnection.js';

const dbConnection =
  process.env.NODE_ENV === 'production'
    ? productionDbConnection
    : testDbConnection;

export default dbConnection;
