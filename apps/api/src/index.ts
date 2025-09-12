import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connect';
import invoiceRoutes from './routes/invoice.routes';

const app = express();
const port = 8000;

app.use((req, res, next) => {
  console.log(`==> Request Received: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api', invoiceRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("!!! GLOBAL ERROR HANDLER CAUGHT AN ERROR !!!");
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    details: err.message 
  });
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