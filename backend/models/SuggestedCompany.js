import mongoose from "mongoose";

const SuggestedCompany = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true
        },
        company : {
            type : String,
            required : true
        }
    }
)

export default mongoose.model("Sugges ",SuggestedCompany);