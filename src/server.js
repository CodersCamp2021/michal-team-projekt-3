import { app } from './app.js';
import dbConnection from './helpers/dbConnection.js';

dbConnection
  .connect()
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log('Server is listing on port', process.env.PORT);
    }),
  )
  .catch((e) => {
    console.log(e.message);
  });
