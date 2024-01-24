const express = require('express')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())

//initial route
app.use('/api', require('./routes'))


app.listen(PORT, () => {
    console.log(`Server running port on: ${PORT}`);
})