const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, { err });
  console.log('Uncaught Exception  🔥 Shutting Down');
  process.exit(1); // 1 is for uncaught exception
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL,{
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection to database SUCCESSFUL'));
// console.log(process.env);
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandeled Rejection  🔥 Shutting Down');
  server.close(() => {
    process.exit(1); // 1 is for uncaught exception
  });
});
process.on('SIGTERM', () => {
  console.log('✋ SIGTERM  RECEIVED. Shutting down gracefully !!!');
  server.close(() => {
    console.log('💥 Process Terminated ! ');
  });
});
