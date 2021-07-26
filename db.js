const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.addImage = (title, description, username, url) => {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING title, description, username, url`,
        [title, description, username, url]
    );
};

module.exports.getImages = () => {
    console.log("query for db.images...");
    return db.query(`SELECT * FROM images`);
};
