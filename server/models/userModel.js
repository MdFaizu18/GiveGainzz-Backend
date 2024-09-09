import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    DOB:{
        type:String,
    },
    gender:{
        type:String,
        enum:["male","female","other"],
        default:"male"
    },
    qualification:{
        type:String
    },
    profession:{
        type:String
    },
    contact:{
        type:Number
    },
    location:{
        type:String
    },
    interests:{
        type:[]
    },
    languages:{
        type:[]
    },
    experience:{
        type:Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
},
    { timestamps: true }
);

export default mongoose.model('User', userSchema);