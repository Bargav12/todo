const mongoose=require("mongoose");
const conn = async (res,req)=>{
    try {
        await mongoose.connect("mongodb+srv://gvns1610:bhargav1610@cluster0.goez1ol.mongodb.net/").then ( ()=>{
        console.log("Connected!!");
    })
    } catch (error) {
        res.status(400).json({message:"Not connected"});
    }
};
conn();