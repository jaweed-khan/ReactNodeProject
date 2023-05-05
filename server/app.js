const express = require('express');
const app = express();
const usersRoute = require('./routes/users');
const ticketsRoute = require('./routes/tickets');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Use the route files
app.use('/users', usersRoute);
app.use('/tickets', ticketsRoute);

const port = 3000; // or any other port you want to use

app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});

module.exports = app;