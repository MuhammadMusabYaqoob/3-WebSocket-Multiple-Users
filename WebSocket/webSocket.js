
import express from "express";
import http from "node:http";
import path from "node:path";
import { Server } from "socket.io";

// Step 1: Create an Express application.
// We will use Express to handle HTTP requests and responses.
const app = express();

// Step 2: Create an HTTP server and pass the Express application to it.
// This HTTP server will handle incoming HTTP connections.
const server = http.createServer(app);

// Step 3: Create a Socket.IO server and attach it to the HTTP server.
// Now the same HTTP server can handle normal HTTP requests and Socket.IO connections.
const io = new Server(server);

io.on("connection", (socket) =>{
    // here socket = client mean new client
    console.log("A new user has been connected")
})

// Step 4: Serve static files from the WebSocket folder.
// Express can now serve files such as HTML, CSS and JavaScript
// from the specified folder.
app.use(express.static(path.resolve("./WebSocket")));

// Step 5: Handle requests to the homepage ("/").
// When someone visits http://localhost:3000/,
// Express sends client1.html back to the browser.
app.get("/", (req, res) => {
    return res.sendFile(path.resolve("client1.html"));
});

// Step 6: Listen for new Socket.IO client connections.
// Whenever a client successfully connects,
// this callback executes and receives that client's socket object.
io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);
    // now get the client message
    socket.on('user-message', message =>{
        // console.log("A new User message", message)
        // now send one client message to all
        io.emit('message', message)
    })
});

// Step 7: Start the HTTP server on port 3000.
// The server is now ready to receive HTTP requests
// and Socket.IO connections.
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
