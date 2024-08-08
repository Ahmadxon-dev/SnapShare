const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type:String, required: true, unique:true},
    password: {type:String, required: true},
    followers:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    picture:{
        type:String,
        default:"https://res.cloudinary.com/dskh7ffuq/image/upload/v1719074508/3c73ee8caf56fcc08bd11d595dca167d_ssbwvg.jpg"
    }

},
    {
        timestamps: true
    },
)
module.exports = model("User", UserSchema)