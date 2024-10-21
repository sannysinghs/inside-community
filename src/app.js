const config = require('config');
const express = require('express');
const roomRoutes = require('./routes/rooms.js');

const app = express()
const port = process.env.PORT || 3000;
app.use('/api/rooms', roomRoutes)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
