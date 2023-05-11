import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema(
    {
        dateW: {type: Date, required:true},
        snow: {type: Number, required: true},
        temperature: {type:Number, required: true},
    },
    {
        timestamps:true,
    }
);
const Weather = mongoose.model('Weather', weatherSchema);
export default Weather;