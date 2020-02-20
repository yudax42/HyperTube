const express = require("express");
const app = express();
const movieRoute = require("./routes/movie");
const commentsRouter = require("./routes/comments");
const subtitlesRouter = require("./routes/subtitles");
const port = 3000;
const mongoose = require('./config/database');
const cronJob = require('./config/cronJob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');

app.use(cors());

app.use(cookieParser());
app.use(express.json());

// app.use(express.static(__dirname + '/images'));

//Configuration for multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});
// to filter type of files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif')
        cb(null, true);
    else
        cb(new Error('invalid image type.'), false);
}

// Used to parse the post data of the body.
app.use(bodyParser.json({ limit: "10mb" })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false })); // to support URL-encoded bodies

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'))

app.use("/API", require('./routes'));
app.use("/api/comments", commentsRouter);
app.use("/api/subtitles", subtitlesRouter);
app.use("/API/", movieRoute);

app.use(express.static(__dirname + '/client/build'));
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});

app.use((error, request, response, next) => {
    if (error.details) {
        let errors = {};
        error.details.forEach(element => {
            errors[element.context.key] = element.message;
        });
        return response.json({ errors })
    }
    return response.status(400).json({ error: "Something is wrong" });
});

app.listen(port, () => console.log(`App working on port ${port}`));
