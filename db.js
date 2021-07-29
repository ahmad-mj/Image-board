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
    return db.query(`SELECT * FROM images`);
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
            LIMIT 10;`,
        [id]
    );
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id=$1 `, [id]);
};

module.exports.postComment = (username, comment, image_id) => {
    return db.query(
        `INSERT INTO comments ( username, comment, image_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, comment, image_id]
    );
};
