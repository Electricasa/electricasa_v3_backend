const mongoose = require('mongoose');

const connectionString = process.env.CONNECTIONSTRING
const MONGODB_URL = process.env.MONGODB_URL
console.log(MONGODB_URL, connectionString, "DB Stuff")

mongoose.connect( MONGODB_URL || process.env.MONGODB_URL || connectionString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log(`mongoose connected to ${connectionString}`)
})

mongoose.connection.on('error', (err) =>{
  console.log(`mongoose error `, err)
})

mongoose.connection.on('disconnected', () =>{
  console.log(`mongoose disconnected from ${connectionString}`)
})
