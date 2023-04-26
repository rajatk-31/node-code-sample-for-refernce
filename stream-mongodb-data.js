const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Define a Mongoose schema for your data model
const dataSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
});

// Define a Mongoose model for your data
const DataModel = mongoose.model('Data', dataSchema);

// Create an Express app
const app = express();

// Define an endpoint to retrieve data in batches
app.get('/data', async (req, res) => {
    try {
        const batchSize = 1;
        const cursor = DataModel.find().cursor();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Encoding', 'chunked');
        res.setHeader('Transfer-Encoding', 'chunked');

        cursor.on('data', (doc) => {
            console.log("Data", doc)
            res.write(JSON.stringify(doc));
        });

        cursor.on('end', () => {
            res.end();
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
