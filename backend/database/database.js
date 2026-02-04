const mongoose=require('mongoose');
let dbString='mongodb+srv://avikgupta2363_db_user:Cw9ind43HX9kTUoy@cluster0.woseexj.mongodb.net/';
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbString);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error; 
  }
};



module.exports = connectToDatabase;