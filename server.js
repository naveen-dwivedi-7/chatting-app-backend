const express = require('express');
const app = express();
const auth =require('./middlewares/auth')
require('dotenv').config();
const path = require("path");   

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

``
// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// app.use(auth)
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);



app.get('/', (req, res) => res.send('JWT Auth Demo'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));