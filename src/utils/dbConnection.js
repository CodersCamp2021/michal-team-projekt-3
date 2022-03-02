import mongoose from 'mongoose';
const dbUri =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_URL
    : process.env.MONGO_URL;

export const dbConnection = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const closeConnection = () => {
  return mongoose.disconnect();
};
