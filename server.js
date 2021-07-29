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
    if (req.file) {
        const { title, description, username } = req.body;
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

        db.addImage(title, description, username, url)
            .then((data) => {
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
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in 'GET /images' db.getImages: ", err);
        });
});

app.get("/info/:id", (req, res) => {
    const { id } = req.params;
    console.log("id from info route: ", id);
    console.log("i hit the /info");
    db.getImageInfo(id)
        .then((data) => {
            res.json(data.rows[0]);
        })
        .catch((err) => {
            console.log("error in db.getImageInfo", err);
        });
});

app.get("/load-more/:id", (req, res) => {
    //     console.log("i hit the /load-more");

    const { id } = req.params;
    db.loadMoreImages(id)
        .then((data) => {
            console.log("my response array from loadMoreImages", data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in db.loadMoreImages", err);
        });
});
app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    // console.log("id", req.params);
    db.getComments(id)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in db.getComments: ", err);
        });
});

app.post("/comment", (req, res) => {
    const { imageId, username, comment } = req.body;
    db.postComment(imageId, username, comment)
        .then((data) => {
            console.log("response from comment post", data.rows);
            res.json(data.rows[0]);
        })
        .catch((err) => console.log("error in db.postComment", err));
});
app.listen(8080, () => {
    console.log("listining...");
});
