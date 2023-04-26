const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Set up mongoose connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    // Initialize GridFS stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine using GridFS
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/mydatabase',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// Define API route for file upload
app.post('/upload', upload.single('audio'), (req, res) => {
    res.json({ file: req.file });
});


app.get('/audio/:id', (req, res) => {
    const id = req.params.id;
    console.log(id, "----", gfs.files)
    gfs.files.findOne({ _id: id }, (err, file) => {
        console.log(err)
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        console.log("file found", file)
        const readstream = gfs.createReadStream(file.filename);

        res.set('Content-Type', file.contentType);
        return readstream.pipe(res);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
