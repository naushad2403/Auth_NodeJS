const express = require('express')
const cors = require('cors');
const { connect } = require('./db');
require('dotenv').config()

connect(); // Connect DB
const app = express();
app.use(cors())
const PORT = process.env.PORT || 3006;
app.use((req, res, next)=>{
    next();
})
app.use(express.json());
// app.use(express.bodyparser());
app.use('/user', require('./routes'))

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})