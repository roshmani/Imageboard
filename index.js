const express = require("express");
const { getImages, writeFiletodb } = require("./imageboarddb");
const s3 = require("./s3");
const config = require("./config");
const app = express();
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
); // used in POST requests
/***********************************************************************/
/*                   File Upload header Declarations                   */
/***********************************************************************/
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    /*destination: directory to save the files to*/
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/***********************************************************************/
app.use(express.static("public"));
app.get("/getimages", (req, res) => {
    getImages()
        .then(function(results) {
            res.json({ images: results.rows });
        })
        .catch(function(err) {
            console.log("error !", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("POST upload!", req.body);
    writeFiletodb(
        config.s3Url + req.file.filename,
        req.body.title,
        req.body.description,
        req.body.username
    )
        .then(({ rows }) => {
            res.json({
                image: rows[0]
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});

app.listen(8080, () => console.log("listening on port 8080..."));
