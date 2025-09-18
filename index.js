// ---------------- all require -----------
const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000

const mongoose = require('mongoose')
const { createServer } = require('http');
const { Server } = require("socket.io")
const server = createServer(app)

// -------------- middleware -----------
app.use(express.json())
app.use(cors())


// ------------socket ------------ 

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    },
  });

  io.on('connection', (socket) => {
    console.log('client connected')
})


// -----------  db connection -----------
mongoose.connect('mongodb+srv://mongo123:mongo123@cluster0.2ms8nmx.mongodb.net/mongo123?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('db connect'))
.catch((err)=> console.log(err))

// -------------- schema ---

const todoSchema = new mongoose.Schema({
      todo: {
            type: String
        }
})
    
const todoModel = mongoose.model('todo' , todoSchema)

// ---------------api --------
app.post('/todo' , async(req, res)=>{
    const {todo} = req.body
   await new todoModel({
    todo
 }).save()
     const allTodo = await todoModel.find()

  io.emit('allTodo' , allTodo)

  res.send('todoo')
} )

app.get('/allTodo' , async (req , res) =>{
    const allTodo = await todoModel.find()
    res.send(allTodo)
})

// -----------------listen ------------ 
app.listen(port , ()=>{
    console.log(`this is running at ${port}`)
}
)
