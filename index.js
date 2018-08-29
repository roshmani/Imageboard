const express = require("express");
const {
    getImages,
    writeFiletodb,
    getImageFromDB,
    getComments,
    writeCommentstodb
} = require("./imageboarddb");
const s3 = require("./s3");
const config = require("./config");
const app = express();
app.use(require("body-parser").json()); // used in POST requests
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
app.get("/getImages", (req, res) => {
    getImages()
        .then(function(results) {
            res.json({ images: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting images !", err);
        });
});

app.get("/getComments/:id", (req, res) => {
    let imageId = req.params.id;
    getComments(imageId)
        .then(function(results) {
            res.json({ comments: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting images !", err);
        });
});

app.get("/getImage/:id", (req, res) => {
    let imageId = req.params.id;
    getImageFromDB(imageId)
        .then(function(results) {
            res.json({ image: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting the image based on id!", err);
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

app.post("/submitComment/:id", (req, res) => {
    let imageId = req.params.id;
    writeCommentstodb(imageId, req.body.comment, req.body.username)
        .then(results => {
            res.json({
                comment: results.rows
            });
        })
        .catch(err => {
            console.log("error from submit comments", err);
            res.status(500).json({
                success: false
            });
        });
});
app.listen(8080, () => console.log("listening on port 8080..."));
