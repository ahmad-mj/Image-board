console.log("yaay 🌟sctipt is linked...");
(function () {
    Vue.component("comments-component", {
        template: "#comments-template",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["image_id"],
        mounted: function () {},

        methods: {
            addComment: function () {
                console.log("adding comment!");
                let obj = {
                    comment: this.comment,
                    username: this.username,
                    created_at: this.created_at,
                    commentId: this.image_id,
                };
            },
        },
    });

    Vue.component("image-modal-component", {
        template: "#image-modal-template",
        data: function () {
            return {
                data: [],
            };
        },
        props: ["imageid"],
        mounted: function () {
            console.log("imageid: ", this.imageid);

            axios
                .get(`/info/${this.imageid}`)
                .then((response) => {
                    console.log("response.data: ", response.data);
                    this.data = response.data;
                })
                .catch((err) => console.log("err in /info axios: ", err));
        },
        methods: {
            closeModal: function () {
                console.log("closing the modal...");
                this.$emit("close");
                this.selectedImage = null;
            },
        },
    });

    //------------------------------------------------------------------------

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: null,
            button: true,
        }, //data ends here
        mounted: function () {
            console.log("my vue instance has mounted!!!");
            console.log("this OUTSIDE OF AxIOS: ", this);

            axios
                .get("/images")
                .then((response) => {
                    // console.log("response from /images: ", response);
                    console.log("this INSIDE OF AxIOS: ", this);
                    this.images = response.data;
                })
                .catch((err) => {
                    console.log("err in /images: ", err);
                });
        },
        methods: {
            uploadImage: function () {
                var title = this.title;
                var desc = this.description;
                var username = this.username;
                var file = this.file;

                var formData = new FormData();
                formData.append("title", title);
                formData.append("desc", desc);
                formData.append("username", username);
                formData.append("file", file);

                axios.post("/upload", formData).then((results) => {
                    this.images.unshift({
                        results,
                    });
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
                let lastImg = this.images[this.images.length - 1].id;
                axios
                    .get("/load-more/" + lastImg)
                    .then(function (response) {
                        // console.log("response from axios load-more", response);
                        for (var i = 0; i < response.data.length; i++) {
                            // console.log("response.data[i]", response.data[i]);
                            //response.data[i].push(self.images);
                            self.images.push(response.data[i]);
                        }
                        if (!response.data[1]) {
                            this.button = false;
                        }
                    })
                    .catch(function (err) {
                        console.log("error in loadMoreImages", err);
                    });
                console.log("loadMoreImages function have been invoked😃");
            },
        },
    });
})();
