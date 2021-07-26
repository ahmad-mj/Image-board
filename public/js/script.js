console.log("yaay 🌟sctipt is linked...");
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
        },
    });
})();
