console.log("yaay 🌟sctipt is linked...");
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
        }, //data ends here
        mounted: function () {
            console.log("my vue instance has mounted!!!");

            console.log("this OUTSIDE OF AxIOS: ", this);

            var self = this;

            axios
                .get("/images")
                .then((response) => {
                    console.log("response from /images: ", response);
                    console.log("this INSIDE OF AxIOS: ", self);
                    self.images = response.data;
                })
                .catch((err) => {
                    console.log("err in /images: ", err);
                });
        },
        // methods: {
        //     myFunction: function (arg) {
        //         console.log("this is my function and it's running....", arg);
        //     },
        // },
    });
})();
