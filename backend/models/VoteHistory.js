import mongoose from "mongoose";

const VoteHistorySchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true
        },
        question_id : {
            type : String,
            required : true
        },
        answer_id : {
            type : String,
            required : true
        }, 
        action : {
            type : String,
            enum : ["upvote","downvote"],
            required : true,
        },
        updated_at :{
            type : Date,
            default : Date.now
        }
    }
)

export default mongoose.model("VotesHistory",VoteHistorySchema);