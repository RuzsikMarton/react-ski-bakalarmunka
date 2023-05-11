import mongoose from "mongoose";

const skipassSchema = new mongoose.Schema(
    {
        name: {type: String, required:true},
        slug: {type: String, required: true, unique:true},
        image: {type: String, required: true},
        ar: {type: Number, required:true},
        description: {type: String, required: true},
    },
    {
        timestamps: true,
    }
);
const Skipass = mongoose.model('Skipass', skipassSchema);
export default Skipass;

