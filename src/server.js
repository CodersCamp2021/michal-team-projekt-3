import { app } from './app.js';
import { connect } from './helpers/dbConnection.js';

connect()
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log('Server is listing on port', process.env.PORT);
    }),
  )
  .catch((e) => {
    console.log(e.message);
  });
