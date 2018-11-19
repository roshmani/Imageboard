(function() {
    Vue.component("image-modal", {
        data: function() {
            return {
                image: {},
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        template: "#imagemodal",
        props: ["id"],
        watch: {
            id: function() {
                this.getImageforModal();
            }
        },
        mounted: function() {
            var component = this;
            console.log("In mounted:", this.id);
            this.getImageforModal();
            axios.get("/getComments/" + this.id).then(function(res) {
                component.comments = res.data.comments;
            });
        },
        methods: {
            emitClose: function() {
                this.$emit("close");
            },
            submitComment: function() {
                var component = this;
                axios
                    .post("/submitComment/" + this.id, this.form)
                    .then(function(resp) {
                        component.comments.unshift(resp.data.comment[0]);
                        component.form.comment = "";
                        component.form.username = "";
                    });
            }, //submitcomment end
            getImageforModal: function() {
                var component = this;
                axios.get("/getImage/" + this.id).then(function(resp) {
                    component.image = resp.data.image[0];
                    if (!component.image) {
                        console.log("in component image doesnot exist");
                        app.currentImageId = null;
                        location.hash = "";
                    }
                });
            } //get image end
        } //methods end*/
    }); //close vue component
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            search: "",
            lastImageId: null,
            hasMore: true,
            currentImageId: location.hash.length > 1 && location.hash.slice(1),
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            this.loadImages();
        },
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = this.file;
                /*formdata is an api used to upload a file*/
                var formData = new FormData();
                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        app.images.unshift(resp.data.image);
                        app.form.title = "";
                        app.form.description = "";
                        app.form.username = "";
                        this.file = "";
                    })
                    .catch(err => {
                        console.log("error in upload files", err);
                    });
            }, //close upload
            getImageId: function(id) {
                this.currentImageId = id;
            }, //close getImageDetails
            hideModal: function() {
                this.currentImageId = null;
                location.hash = "";
            },
            getMoreImages: function() {
                //ajax request get next < last images id
                axios
                    .get("/getMoreImages/" + this.lastImageId)
                    .then(function(res) {
                        app.hasMore = !!res.data.moreimages.length;
                        app.images = app.images.concat(res.data.moreimages);
                        app.lastImageId = app.images[app.images.length - 1].id;
                    });
            }, //getMoreImages
            changeFile: function(e) {
                this.file = e.target.files[0];
            },
            filteredImages: function() {
                var self = this;
                let filtered;
                if (this.search != "") {
                    filtered = this.images.filter(function(image) {
                        return (
                            image.title
                                .toLowerCase()
                                .indexOf(self.search.toLowerCase()) >= 0
                        );
                    });
                    console.log("test", filtered);
                    this.images = filtered;
                } else {
                    this.loadImages();
                }
            },
            loadImages: function() {
                axios.get("/getImages").then(function(res) {
                    app.images = res.data.images;
                    app.lastImageId = app.images[app.images.length - 1].id;
                    console.log("last image id", app.lastImageId);
                });
            }
        } //close methods
    }); //close vue
    addEventListener("hashchange", function() {
        app.currentImageId = location.hash.slice(1);
    });
})();
