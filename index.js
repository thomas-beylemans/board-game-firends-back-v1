require('dotenv').config();

const express = require('express');
const userRouter = require('./app/router/userRouter');

const app = express();

const PORT = process.env.PORT || 3000;

// permet de lire du POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use the router 'router' if the path begins by '/api/v1'
app.use('/api/v1', userRouter);

app.listen(PORT, () => {
    // console.clear();
    console.log(`Listening http://localhost:${PORT}`);
});