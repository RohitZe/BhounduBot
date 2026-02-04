const express = require("express");
const app = express();
const { generate } = require("./chatbot");
const cors = require("cors");
const connectToDatabase = require('./database/database.js');
const authRoutes=require('./routes.js');


const PORT = process.env.PORT || 3001


app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('welcome to my server')
})

app.use('/users', authRoutes);



app.post('/chat', async (req, res) => {
  const { message,threadId } = req.body

  if(!message || !threadId) return  res.status(400).json({message:"All fields are required"});

  const result=await generate(message,threadId);
   res.json({ message: result })
})



async function startServer() {
    try {
        await connectToDatabase();  
        console.log("Database connected")

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server: DB connection error", error);
        process.exit(1);
    }
}

startServer();
