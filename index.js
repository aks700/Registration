const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const dotenv=require("dotenv")

const app=express();
dotenv.config()
const port=process.env.PORT || 3000;

const mongodb=process.env.MONGODB;

try {
    mongoose.connect(mongodb);
    console.log('Connected to MongoDB!');
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}


const registartion=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
})

const Registartion=mongoose.model("Registartion",registartion);

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})
app.post("/register",async (req,res)=>{
    try {
        const {name,email,password}=req.body;

        const existingUser=await Registartion.findOne({email:email});
        if(!existingUser)
        {
        const registartionData=new Registartion({
            name,
            email,
            password,
        })
        await registartionData.save()
        res.redirect("/success");
       }
       else
       {
        console.log("User already exists");
        res.redirect("/error");
       }

    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
