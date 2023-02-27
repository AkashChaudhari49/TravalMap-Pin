const mongoose = require("mongoose");

const PinsSchema = new mongoose.Schema({
    username:{
        type: String,
        require:true,
    },
    title:{
        type:String,
        require:true,
        min:3,
        max:20,   
    },
    desc:{
        type:String,
        require:true,
        min:4,
        max:40,   
    },
    rating:{
        type:Number,
        require:true,
        min:0,
        max:5,  
    },
    lat:{
        type:Number,
        require:true,
    },
    long:{
        type:Number,
        require:true,
        
    },
},{timestamps: true}
);

module.exports = mongoose.model("Pins", PinsSchema)