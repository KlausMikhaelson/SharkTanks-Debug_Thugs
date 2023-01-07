const express = require("express")
const app = express();
const http = require("http")
const socketIo = require("socket.io")
const path = require("path")
const server = http.Server(app)
const io = socketIo(server)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

