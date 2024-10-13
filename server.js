const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')
const empRoute = require('./routes/employeeRoute')
const PORT = process.env.port || 8082

app.use(express.json())

const DB_URL = "mongodb+srv://tacopocalyptical:fpV0Xj9aTIzJ5V1L@mycluster.fvweq.mongodb.net/Assign01_db?retryWrites=true&w=majority&appName=MyCluster"
mongoose.Promise = global.Promise

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true // outdated warning??
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})

app.use('/api/v1/user', userRoute)
app.use('/api/v1/emp/employees', empRoute)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

