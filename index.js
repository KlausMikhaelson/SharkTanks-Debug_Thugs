const express = require("express")
const app = express();
const http = require("http")
const socketIo = require("socket.io")
const path = require("path");
const { time } = require("console");
const server = http.Server(app)
const io = socketIo(server)
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const width_ground = 5000
const height_ground = 5000;

class GameObject{
    constructor(subject={}) {
        const idss = new Date;
        const id = idss.getSeconds();
        this.x = subject.x;
        this.y = subject.y;
        this.width = subject.width;
        this.height = subject.height;
        this.angle = subject.angle;
    } 
    move(distance) {
        const oldDistX = this.x;
        const oldDistY = this.y;
        
        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);
    }
}