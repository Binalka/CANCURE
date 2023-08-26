require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT;

const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/CANCURE',
  collection: 'sessions',
});

// conect mongo
mongoose.set("strictQuery", false);
const ConnectMongoDB = require('./config/database');
ConnectMongoDB();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

app.post('/', (req, res) => {
  req.session.userId = user.id;
  req.session.email = user.email;
  res.send({ message: 'Login successful' });
});


//cookies
app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('cookieName', 'cookieValue', { httpOnly: true });
  res.send('Cookie set successfully!');
});



// Configure routes
const empRoutes = require('./routes/employee.routes');
app.use('/employees', empRoutes);

const complaintRoutes = require('./routes/complaint.routes');
app.use('/complaints', complaintRoutes);

const feedbackRoutes = require('./routes/feedback.routes');
app.use('/feedbacks', feedbackRoutes);

const payRoutes = require('./routes/payment.routes');
app.use('/payments', payRoutes);

const appoinmnetRoutes = require('./routes/doctorAppoinment.routes');
app.use('/appoinmnets', appoinmnetRoutes);

app.use('/hairDonations', require('./routes/hairDonation.routes'));

app.use('/moneyDonations', require('./routes/moneyDonation.routes'));

app.use('/clinics', require('./routes/clinicSchedule.routes'));

app.use('/foodDonations', require('./routes/foodDonation.routes'));

app.use('/Entertainmnets', require('./routes/entertainment.routes'));



// Start the server
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is listening on port ${PORT}`);
});

module.exports=app;
 
