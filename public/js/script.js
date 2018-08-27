(function() {
    var app = new Vue({
        el: "#main",
        data: {
            images: []
        },
        mounted: function() {
            axios.get("/getImages").then(function(res) {
                app.images = res.data.images;
            });
        }
    });
})();
