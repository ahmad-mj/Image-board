// console.log("yaay 🌟sctipt is linked...");
(function () {
    //------------------------------------------comments-component------------------------------------------------------

    Vue.component("comments-component", {
        template: "#comments-template",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["id"],
        mounted: function () {
            var self = this;
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error in /comments axios", err);
                });
        },
        watch: {
            id: function () {
                var self = this;
                axios
                    .get("/comments/" + this.id)
                    .then(function (response) {
                        self.comments = response.data;
                        this.$emit("close");
                    })
                    .catch(function (err) {
                        console.log("error in /comments axios", err);
                    });
            },
        },

        methods: {
            addComment: function () {
                var self = this;
                // console.log("this   : ", this);
                // console.log("adding comment!");
                let commentInput = {
                    comment: this.comment,
                    username: this.username,
                    imageId: this.id,
                };
                // console.log("commentInput: ", commentInput);
                axios
                    .post("/comment", commentInput)
                    .then(function (response) {
                        // console.log("response from postComment", response);
                        self.comments.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log(
                            "error from post request submit comment",
                            err
                        );
                    });
            },
        },
    });
    //------------------------------------------image-modal-component------------------------------------------------------

    Vue.component("image-modal-component", {
        template: "#image-modal-template",
        data: function () {
            return {
                data: [],
            };
        },
        props: ["imageid"],
        mounted: function () {
            // console.log("imageid: ", this.imageid);

            axios
                .get(`/info/${this.imageid}`)
                .then((response) => {
                    // console.log("response.data: ", response.data);
                    // console.log("description: ", response.data.description);
                    // console.log("title: ", response.data.title);
                    this.data = response.data;
                })
                .catch((err) => console.log("err in /info axios: ", err));
        },
        watch: {
            imageid: function () {
                // console.log("imageid: ", this.imageid);

                axios
                    .get(`/info/${this.imageid}`)
                    .then((response) => {
                        if (response.data) {
                            this.image = response.data;
                        } else {
                            this.$emit("close");
                            location.hash = "";
                        }
                        // console.log("response.data: ", response.data);
                        this.data = response.data;
                    })
                    .catch((err) => {
                        console.log("err in /info axios: ", err);
                        this.$emit("close");
                    });
            },
        },
        methods: {
            closeModal: function () {
                // console.log("closing the modal...");
                history.pushState({}, "", "/");
                this.$emit("close");
                this.selectedImage = null;
            },
        },
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------

    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            selectedImage: location.hash.slice(1),
            button: true,
        },
        mounted: function () {
            // console.log("my vue instance has mounted!!!");
            // console.log("this OUTSIDE OF AxIOS: ", this);
            window.addEventListener("hashchange", () => {
                // console.log("the event hashchange is working");
                // console.log("location.hash: ", location.hash);
                this.selectedImage = location.hash.slice(1);
            }),
                axios
                    .get("/images")
                    .then((response) => {
                        // console.log("response from /images: ", response);
                        // console.log("this INSIDE OF AxIOS: ", this);
                        this.images = response.data;
                    })
                    .catch((err) => {
                        console.log("err in /images axios: ", err);
                    });
        },

        methods: {
            uploadImage: function () {
                var username = this.username;
                var title = this.title;
                var description = this.description;
                var file = this.file;

                var formData = new FormData();
                formData.append("username", username);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("file", file);

                axios.post("/upload", formData).then((results) => {
                    this.images.unshift(results.data);
                });
            },
            handleFileSelection: function (e) {
                this.file = e.target.files[0];
            },
            openModal: function (img) {
                this.selectedImage = img;
            },
            closeModal: function () {
                this.selectedImage = null;
            },

            loadMoreImages: function () {
                var self = this;
                var lowestId = this.images[this.images.length - 1].id;
                // console.log("my lowestId before axios:", lowestId);
                axios
                    .get("/load-more/" + lowestId)
                    .then(function (response) {
                        // console.log("response from axios load-more", response);
                        for (var i = 0; i < response.data.length; i++) {
                            // console.log("response.data[i]", response.data[i]);

                            self.images.push(response.data[i]);
                        }
                        if (!response.data[1]) {
                            this.button = false;
                        }
                    })
                    .catch(function (err) {
                        console.log("error in loadMoreImages", err);
                    });
                // console.log("loadMoreImages function have been invoked😃");
            },
        },
    });
})();
