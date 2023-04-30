const mongoose = require('mongoose')


mongoose
.connect('Your MongoDB secrey Key')
.then(() => console.log(`connected to DB`))
.catch((err) => console.log(err));