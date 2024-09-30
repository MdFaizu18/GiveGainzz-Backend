import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    useRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    author:String,
    age:String,
    title:String,
    caption:String,
    comments:[],
    category:[String],
    likes:[],
    share:[],
    interest:[]
    },{timestamps:true});

export default mongoose.model('Post',postSchema);