import * as productionDbConnection from './productionDbConnection.js';
import * as testDbConnection from './testDbConnection.js';

const dbConnection =
  process.env.NODE_ENV === 'test'
    ? testDbConnection
    : productionDbConnection;

export default dbConnection;
