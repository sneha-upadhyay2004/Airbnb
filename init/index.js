const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://airbnb:PpP2JLuCUxYGnSds@cluster0.9fozq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
  await  Listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({...obj, owner: "66fac38e05562bee67e993e9"}))
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}
initDB();