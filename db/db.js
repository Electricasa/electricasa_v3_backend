const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost/electricasa';
const MONGODB_URL = `mongodb+srv://seheesf88:casa-north@cluster0.4c1d1.mongodb.net/electricasa-v3?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URL || process.env.MONGODB_URI || connectionString, {
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
