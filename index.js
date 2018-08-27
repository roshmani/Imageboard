const express = require("express");
const { getImages } = require("./imageboarddb");
const app = express();
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
); // used in POST requests

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

app.listen(8080, () => console.log("listening on port 8080..."));
