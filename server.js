const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authroutes');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const mongoURI = 'mongodb://127.0.0.1:27017/Kriyeta';
console.log('mongoURI:', mongoURI);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    app.get('/', (req, res) => {
      res.status(200).send({
        message: 'Welcome to your express application'
      });
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down gracefully...');
      server.close(err => {
        if (err) {
          console.error('Error closing server:', err);
          process.exit(1);
        }
        console.log('Server closed successfully');
        mongoose.connection.close(err => {
          if (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
          }
          console.log('Server and MongoDB connection closed successfully');
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
