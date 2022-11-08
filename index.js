const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const serviceRoute = require('./routes/service');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');
const postRoute = require('./routes/post');

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected');
  })
  .catch((error) => {
    console.log(error);
  });



app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/services', serviceRoute);
app.use('/carts', cartRoute);
app.use('/orders', orderRoute);
app.use('/blogs', postRoute);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
