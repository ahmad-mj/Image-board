const express = require("express");
const app = express();
const db = require("./db.js");
const s3 = require("./s3.js");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
app.use(express.json());
app.use(express.static("./public"));

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("inside upload");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        console.log("inside my if statement");

        const { title, description, username } = req.body;
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

        db.addImage(title, description, username, url)
            .then((data) => {
                // console.log("my data:\t", data.rows);
                // console.log("rows[0]:\t", data.rows[0]);
                res.json(data.rows[0]);
            })
            .catch((err) => {
                console.log("error in getting filename: ", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((data) => {
            // console.log("response from db getData: ", data);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in 'GET /images' db.getImages: ", err);
        });
});

app.listen(8080, () => {
    console.log("listining...");
});
