const mongoose = require("mongoose");

mongoose
.connect("mongodb+srv://favoursunday600:Favoursu@cluster0.ovy8rh1.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`Connected to DB`))
.catch((err) => console.error(err));