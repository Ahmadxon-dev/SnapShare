const express = require('express')
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const app = express()
const { MONGO_URI } = require('./config/keys')
const PORT =process.env.PORT || 5000
require('./models/user');
require('./models/post');
const corseOptions = {
    origin:"*",
    credentials:true,
    optionsSuccessStatus: 200,

}
app.use(cors(corseOptions))
mongoose.connect(MONGO_URI)
app.use(express.json())
app.use(require('./routes/user'))
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
// for deploy II
//            V
// if (process.env.NODE_ENV === "production"){
//     app.use(express.static("client/dist"))
//     app.get("*", (req,res)=>{
//         res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
//     })
// }
app.listen(PORT, (req,res) => {
    console.log("server has been started on PORT" + PORT)
})

