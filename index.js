const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/user');
// const auth = require('./routes/auth');
const config = require('config')
const app = express();

// if (!config.get('jwtPrivateKey')) {
//   console.error('FATAL ERROR: jwtPrivateKey is not defined.');
//   process.exit(1);
// }
mongoose.connect('mongodb://localhost/auth', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('Connected to mongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/users', users);
// app.use('api/auth', auth);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on poprt ${port}`));