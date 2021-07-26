const express = require("express");
const app = express();
const db = require("./db.js");
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    console.log("GET request to /images happend!");
    db.getImages()
        .then((data) => {
            console.log("response from db getData: ", data);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in 'GET /images' db.getImages: ", err);
        });
});

app.listen(8080, () => {
    console.log("listining...");
});
