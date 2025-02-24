import express from 'express'; 
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';


//initialize express
const app = express();

//Connect to DataBase

await connectDB();

//Middleware
app.use(cors())

//Route
app.get('/', (req,res)=> res.send("API working"));

//Port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})