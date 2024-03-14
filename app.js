const express = require('express')
const connectToDb = require('./config/connectToDb')
require('dotenv').config()

connectToDb()

const app = express()

//middleware
app.use(express.json())

app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/posts', require('./routes/postsRoute'))

const PORT = process.env.PORT || 2002
app.listen(PORT,() => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//Routes
//app.use('/api/auth', require('./routes/authRoute'))