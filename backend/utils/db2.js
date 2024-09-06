const mongoose=require("mongoose");
const URI="mongodb+srv://Nikunj:uLbtKIsCjZof4iEE@cluster0.fmyer.mongodb.net/Feedback?retryWrites=true&w=majority&appName=Cluster0";
const connectToDb=async()=>{
    try
    {
        await mongoose.connect(URI);
        console.log("Connection Established");
    }
    catch(error)
    {
        console.log(error);
        process.exit(0);
    }
};
module.exports=connectToDb;