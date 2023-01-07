const express = require("express")
const app = express();
const http = require("http")
const socketIo = require("socket.io")
const path = require("path");
const { time } = require("console");
const server = http.Server(app)
const io = socketIo(server)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const width_ground = 5000
const height_ground = 5000;

class GameObject{
    constructor(obj={}) {
        const idss = new Date;
        const id = idss.getSeconds();
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.angle = obj.angle;
    } 
}