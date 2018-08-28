var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.getImages = function() {
    var query = `SELECT url,title
    FROM images
    ORDER BY id DESC`;
    return db.query(query);
};

module.exports.writeFiletodb = function(url, title, description, username) {
    var query = `INSERT INTO images (url,title, description,username)
    VALUES ($1,$2,$3,$4) returning url,title`;
    return db.query(query, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};
