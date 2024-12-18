import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));
// TODO: Serve static files of entire client dist folder DONE 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware for parsing JSON and urlencoded form data DONE

app.use(routes);
// TODO: Implement middleware to connect the routes DONE



// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
