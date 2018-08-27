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
