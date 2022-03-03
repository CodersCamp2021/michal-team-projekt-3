import * as productionDbConnection from './productionDbConnection';
import * as testDbConnection from './testDbConnection';

const dbConnection =
  process.env.NODE_ENV === 'production'
    ? productionDbConnection
    : testDbConnection;

export default dbConnection;
