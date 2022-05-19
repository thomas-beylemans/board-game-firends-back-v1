require('dotenv').config();

const express = require('express');
const router = require('./app/router/router');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

// to read the body of the request
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(express.json({ limit: '50mb', parameterLimit: 1000000 }));

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// use the router 'router' if the path begins by '/api/v1'
app.use('/api/v1', router);

// for any other path, return a 404 error
app.use('*', (req, res) => {
    res.status(404).json({
        // TODO: use the error handler
        error: '404 - not found'
    });
});

app.listen(PORT, () => {
    console.log(`Serveur is running!`);
});