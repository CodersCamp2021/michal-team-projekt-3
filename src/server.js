import { app } from './app.js';
import { dbConnection } from './utils/dbConnection.js';

dbConnection()
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log('Server is listing on port', process.env.PORT);
    }),
  )
  .catch((e) => {
    console.log(e.message);
  });
