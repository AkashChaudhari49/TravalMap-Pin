const express = require ("express");
const mongoose = require ("mongoose");
const app = express();
const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")
var cors = require('cors')

app.use(express.json())

app.use(cors())

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/travel-map', {useNewUrlParser: true})
.then(()=> {
    console.log("mongodb connection succesfully");
}).
catch((err) => console.log(err)
)

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);


app.listen(8000,() =>{
    console.log("server is running")
});

