const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)
         RETURNING id, url, username, title, description`,
        [url, username, title, description]
    );
};

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC
    LIMIT 6`);
};
module.exports.getImageInfo = (id) => {
    console.log("query for db.getImageInfo...");
    return db.query(`SELECT * FROM images WHERE id =$1`, [id]);
};

module.exports.loadMoreImages = (id) => {
    return db.query(
        `SELECT url, title, id, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
            ) AS "lowestId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 3;`,
        [id]
    );
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id=$1 `, [id]);
};

module.exports.postComment = (image_id, username, comment) => {
    return db.query(
        `INSERT INTO comments ( image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`,
        [image_id, username, comment]
    );
};
