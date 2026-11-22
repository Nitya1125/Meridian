const { createServer } = require('http') // this helps to handle incoming request
const next = require('next') // It loads next.js application
const  {Server} = require("socket.io") // give socket.io server


const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || '3000'

const app = next({dev})

const handler = app.getRequestHandler();

app.prepare().then(()=> {
    console.log("Next.js preparation completed")
    const httpServer = createServer(handler)
    console.log("HTTP server created");

    const io = new Server(httpServer)
    console.log("Socket.IO attached successfully");


    io.on("connection", (socket)=> {
        console.log("User connected:", socket.id)
        socket.emit('welcome', "Connected to the messaging server!")
    })

    httpServer.listen(port, () =>{
            console.log(`Server running on port ${port}`)
        })
})