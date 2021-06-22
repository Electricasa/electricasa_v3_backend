const mongoose = require('mongoose');
// const connectionString = 'mongodb://localhost/electricasa';

// const MONGODB_URL = `mongodb+srv://seheesf88:casa-north@cluster0.4c1d1.mongodb.net/electricasa-production?retryWrites=true&w=majority`
const connectionString = process.env.CONNECTIONSTRING
const MONGODB_URL = process.env.MONGODB_URL


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
