(function() {
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            axios.get("/getImages").then(function(res) {
                app.images = res.data.images;
            });
        },
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                /*formdata is an api used to upload a file*/
                var formData = new FormData();
                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                axios.post("/upload", formData).then(function(resp) {
                    app.images.unshift(resp.data.image);
                });
            } //close upload
        } //close methods
    }); //close vue
})();
