// Database Connexion Setup
const mongoose = require('mongoose');

const dbURL = process.env.DB_URL;

try {
    mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection.on('connected' , () => {
        console.log(`connection open to ${dbURL}`)
    });

    mongoose.connection.on('error', () => {
        console.log(`cannot connect to the database on ${dbURL}`);
    })

} catch (error) {
    console.log(error);
}
