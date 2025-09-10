import express from 'express';
import { connectDB } from './db/connect';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('It works! And it is connected to the database.');
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();